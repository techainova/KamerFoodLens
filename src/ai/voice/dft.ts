// src/ai/voice/dft.ts
// DFT directe à 400 points (n_fft de Whisper n'est pas une puissance de 2,
// donc pas de FFT radix-2 classique). Les tables cos/sin sont précalculées
// une seule fois ; le coût par trame reste O(N_FFT * N_BINS).

export const N_FFT = 400;
export const N_BINS = N_FFT / 2 + 1; // 201

let cosTable: Float32Array | null = null;
let sinTable: Float32Array | null = null;

function getTables(): { cos: Float32Array; sin: Float32Array } {
  if (!cosTable || !sinTable) {
    cosTable = new Float32Array(N_BINS * N_FFT);
    sinTable = new Float32Array(N_BINS * N_FFT);
    for (let k = 0; k < N_BINS; k++) {
      for (let n = 0; n < N_FFT; n++) {
        const angle = (2 * Math.PI * k * n) / N_FFT;
        cosTable[k * N_FFT + n] = Math.cos(angle);
        sinTable[k * N_FFT + n] = Math.sin(angle);
      }
    }
  }
  return { cos: cosTable, sin: sinTable };
}

/**
 * Calcule le spectre de puissance (|DFT|^2) d'une trame de exactement
 * N_FFT échantillons (déjà fenêtrée). Retourne N_BINS valeurs.
 */
export function powerSpectrum(frame: Float32Array): Float32Array {
  const { cos, sin } = getTables();
  const out = new Float32Array(N_BINS);
  for (let k = 0; k < N_BINS; k++) {
    let re = 0;
    let im = 0;
    const base = k * N_FFT;
    for (let n = 0; n < N_FFT; n++) {
      const x = frame[n];
      re += x * cos[base + n];
      im -= x * sin[base + n];
    }
    out[k] = re * re + im * im;
  }
  return out;
}

let hannWindow: Float32Array | null = null;

export function getHannWindow(): Float32Array {
  if (!hannWindow) {
    hannWindow = new Float32Array(N_FFT);
    for (let n = 0; n < N_FFT; n++) {
      hannWindow[n] = 0.5 - 0.5 * Math.cos((2 * Math.PI * n) / N_FFT);
    }
  }
  return hannWindow;
}
