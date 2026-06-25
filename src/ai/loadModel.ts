// src/ai/loadModel.ts
// Charge le modèle TFLite de reconnaissance de plats depuis les assets,
// une seule fois (singleton) — exécution 100% locale, aucun appel réseau.

import { loadTensorflowModel, type TensorflowModel } from 'react-native-fast-tflite';
import { resolveModelAssetUri } from './resolveModelAsset';

let modelPromise: Promise<TensorflowModel> | null = null;

/**
 * Charge le modèle KFL (MobileNetV2, entrée 224x224x3). Les appels suivants
 * retournent la même instance déjà chargée — le modèle n'est lu qu'une fois.
 */
export function loadModel(): Promise<TensorflowModel> {
  if (!modelPromise) {
    modelPromise = resolveModelAssetUri(require('../../assets/models/kfl_food_model.tflite'))
      .then((url) => loadTensorflowModel({ url }, []));
  }
  return modelPromise;
}
