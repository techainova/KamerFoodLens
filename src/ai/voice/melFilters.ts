// src/ai/voice/melFilters.ts
// Charge la matrice de filtres mel (80 x 201) extraite du modèle Whisper
// d'origine — garantit une correspondance exacte avec les poids du modèle,
// sans recalculer la formule du banc de filtres mel nous-mêmes.

import melFiltersData from '../../../assets/models/whisper_mel_filters.json';

export const N_MEL = melFiltersData.n_mel; // 80
export const N_FREQ = melFiltersData.n_fft; // 201 (malgré le nom, c'est le nb de bins)

export const MEL_FILTERS: Float32Array = Float32Array.from(melFiltersData.data);

/**
 * Applique le banc de filtres mel à un spectre de puissance (N_FREQ valeurs)
 * et retourne N_MEL valeurs (une par bande mel).
 */
export function applyMelFilters(power: Float32Array, out: Float32Array, frameIndex: number, totalFrames: number): void {
  for (let m = 0; m < N_MEL; m++) {
    let sum = 0;
    const base = m * N_FREQ;
    for (let f = 0; f < N_FREQ; f++) {
      sum += MEL_FILTERS[base + f] * power[f];
    }
    out[m * totalFrames + frameIndex] = sum;
  }
}
