// src/ai/interpretResult.ts
// Applique un seuil de confiance de 60% : sous ce seuil, la classe
// retournée est "inconnu" quelle que soit la prédiction brute du modèle.

import classNames from '../../assets/models/class_names.json';

export const CONFIDENCE_THRESHOLD = 0.6;
export const UNKNOWN_CLASS = 'inconnu';

export interface InterpretedResult {
  classe: string;
  confiance: number; // 0-1
}

export function interpretResult(scores: Float32Array): InterpretedResult {
  let maxIndex = 0;
  let maxScore = scores[0] ?? 0;

  for (let i = 1; i < scores.length; i++) {
    if (scores[i] > maxScore) {
      maxScore = scores[i];
      maxIndex = i;
    }
  }

  const rawClass = classNames[maxIndex] ?? UNKNOWN_CLASS;
  const classe = maxScore >= CONFIDENCE_THRESHOLD ? rawClass : UNKNOWN_CLASS;

  return { classe, confiance: maxScore };
}
