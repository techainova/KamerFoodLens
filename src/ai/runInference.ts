// src/ai/runInference.ts
// Exécute l'inférence TFLite sur un tenseur prétraité et retourne les
// scores softmax bruts (un score par classe), sans aucun appel réseau.

import { loadModel } from './loadModel';

export async function runInference(input: Float32Array): Promise<Float32Array> {
  const model = await loadModel();
  const outputs = await model.run([input.buffer as ArrayBuffer]);
  const rawOutput = outputs[0];

  if (!rawOutput) {
    throw new Error("Le modèle n'a retourné aucune sortie");
  }

  return new Float32Array(rawOutput);
}
