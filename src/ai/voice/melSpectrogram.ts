// src/ai/voice/melSpectrogram.ts
// Reproduit le pipeline log-mel spectrogram de Whisper (audio 16kHz mono
// -> tenseur 80x3000) pour alimenter le modèle TFLite. Les trames de
// silence après la fin de l'audio réel sont remplies via un raccourci
// (spectre nul -> valeur constante) plutôt que recalculées une à une.

import { N_FFT, powerSpectrum, getHannWindow } from './dft';
import { N_MEL, applyMelFilters } from './melFilters';

export const SAMPLE_RATE = 16000;
export const N_FRAMES = 3000;
export const N_SAMPLES = SAMPLE_RATE * 30; // 480000 (fenêtre fixe de 30s)
const HOP = 160;
const PAD = N_FFT / 2; // 200

/**
 * Échantillon à une position de la fenêtre centrée, avec reflect-padding
 * aux bords du buffer COMPLET de 30s (pas de la fin de l'audio réel —
 * au-delà de l'audio réel, `full` contient déjà des zéros, donc refléter
 * sur les vrais bords (0 et N_SAMPLES-1) donne bien du silence continu).
 */
function reflectSample(full: Float32Array, paddedIdx: number): number {
  const fullLen = full.length;
  if (paddedIdx < PAD) {
    const src = PAD - paddedIdx;
    return src < fullLen ? full[src] : 0;
  }
  const core = paddedIdx - PAD;
  if (core < fullLen) return full[core];
  const overshoot = core - fullLen;
  const src = fullLen - 2 - overshoot;
  return src >= 0 ? full[src] : 0;
}

/**
 * Calcule le log-mel spectrogramme (80 x 3000, aplati en row-major,
 * index = mel*3000 + trame) attendu par le modèle Whisper TFLite.
 */
export function computeLogMelSpectrogram(samples: Float32Array): Float32Array {
  const recordedLength = Math.min(samples.length, N_SAMPLES);
  const full = new Float32Array(N_SAMPLES);
  full.set(samples.subarray(0, recordedLength));

  const window = getHannWindow();
  const mel = new Float32Array(N_MEL * N_FRAMES);
  const frameBuf = new Float32Array(N_FFT);

  const lastRealFrame = Math.min(N_FRAMES - 1, Math.ceil((recordedLength + PAD) / HOP));

  let globalMaxPower = 0;

  for (let t = 0; t <= lastRealFrame; t++) {
    const start = t * HOP;
    for (let n = 0; n < N_FFT; n++) {
      frameBuf[n] = reflectSample(full, start + n) * window[n];
    }
    const power = powerSpectrum(frameBuf);
    applyMelFilters(power, mel, t, N_FRAMES);
    for (let m = 0; m < N_MEL; m++) {
      const v = mel[m * N_FRAMES + t];
      if (v > globalMaxPower) globalMaxPower = v;
    }
  }

  const logMax = Math.log10(Math.max(globalMaxPower, 1e-10));
  const floor = logMax - 8.0;
  const silentValue = (floor + 4.0) / 4.0;

  for (let t = 0; t < N_FRAMES; t++) {
    for (let m = 0; m < N_MEL; m++) {
      const idx = m * N_FRAMES + t;
      if (t > lastRealFrame) {
        mel[idx] = silentValue;
        continue;
      }
      const logVal = Math.log10(Math.max(mel[idx], 1e-10));
      mel[idx] = (Math.max(logVal, floor) + 4.0) / 4.0;
    }
  }

  return mel;
}
