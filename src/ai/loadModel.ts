// src/ai/loadModel.ts
// Charge le modèle TFLite de reconnaissance de plats depuis les assets,
// une seule fois (singleton) — exécution 100% locale, aucun appel réseau.

import { Platform } from 'react-native';
import { loadTensorflowModel, type TensorflowModel, type TensorflowModelDelegate } from 'react-native-fast-tflite';
import { resolveModelAssetUri } from './resolveModelAsset';

// Délégué GPU si possible, avec repli silencieux sur CPU s'il n'est pas
// compatible avec ce graphe — voir la même logique dans ai/voice/loadVoiceModel.ts.
const GPU_DELEGATE: TensorflowModelDelegate[] = Platform.OS === 'ios' ? ['core-ml'] : ['android-gpu'];

let modelPromise: Promise<TensorflowModel> | null = null;

async function loadWithBestDelegate(url: string): Promise<TensorflowModel> {
  try {
    return await loadTensorflowModel({ url }, GPU_DELEGATE);
  } catch {
    return loadTensorflowModel({ url }, []);
  }
}

/**
 * Charge le modèle KFL (MobileNetV2, entrée 224x224x3). Les appels suivants
 * retournent la même instance déjà chargée — le modèle n'est lu qu'une fois.
 */
export function loadModel(): Promise<TensorflowModel> {
  if (!modelPromise) {
    modelPromise = resolveModelAssetUri(require('../../assets/models/kfl_food_model.tflite')).then(loadWithBestDelegate);
  }
  return modelPromise;
}
