// src/ai/runInference.ts
// Exécute l'inférence TFLite. Lit les spécifications réelles du tenseur
// d'entrée du modèle (taille, type de données) au lieu de supposer un
// format fixe — évite le bug classique où le modèle attend du uint8
// quantifié alors qu'on lui envoie du float32 normalisé (ou l'inverse).

import { loadModel } from './loadModel';
import { preprocessImage } from './preprocessImage';

const DEFAULT_SIZE = 224;

export async function runInference(imageUri: string): Promise<Float32Array> {
  const model = await loadModel();

  const inputTensor = model.inputs[0];
  const outputTensor = model.outputs[0];

  // shape attendue: [1, height, width, 3] — on retombe sur 224x224 si absent.
  const shape = inputTensor?.shape ?? [];
  const height = shape[1] ?? DEFAULT_SIZE;
  const width = shape[2] ?? DEFAULT_SIZE;
  const inputIsFloat = inputTensor?.dataType === 'float32';

  if (__DEV__) {
    console.log('[KFL][runInference] input tensor:', inputTensor);
    console.log('[KFL][runInference] output tensor:', outputTensor);
  }

  const pixels = await preprocessImage(imageUri, { width, height, normalize: inputIsFloat });
  const outputs = await model.run([pixels.buffer as ArrayBuffer]);
  const rawOutput = outputs[0];

  if (!rawOutput) {
    throw new Error("Le modèle n'a retourné aucune sortie");
  }

  // Sortie quantifiée (uint8/int8) : on la ramène sur l'échelle 0-1.
  if (outputTensor?.dataType === 'uint8') {
    return Float32Array.from(new Uint8Array(rawOutput), (v) => v / 255);
  }
  if (outputTensor?.dataType === 'int8') {
    return Float32Array.from(new Int8Array(rawOutput), (v) => (v + 128) / 255);
  }

  return new Float32Array(rawOutput);
}
