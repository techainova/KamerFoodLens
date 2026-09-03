// src/ai/voice/loadVoiceModel.ts
// Charge le modèle Whisper (français) depuis les assets une seule fois.

import { Platform } from 'react-native';
import { loadTensorflowModel, type TensorflowModel, type TensorflowModelDelegate } from 'react-native-fast-tflite';
import { resolveModelAssetUri } from '../resolveModelAsset';

// Délégué GPU si possible — beaucoup plus rapide que le CPU par défaut ([]),
// sans rien changer au modèle ni à sa précision. Tous les graphes ne sont pas
// compatibles GPU (opérateurs dynamiques du décodage auto-régressif) ; on
// retombe donc silencieusement sur le CPU si le chargement accéléré échoue.
const GPU_DELEGATE: TensorflowModelDelegate[] = Platform.OS === 'ios' ? ['core-ml'] : ['android-gpu'];

let modelPromise: Promise<TensorflowModel> | null = null;

async function loadWithBestDelegate(url: string): Promise<TensorflowModel> {
  try {
    return await loadTensorflowModel({ url }, GPU_DELEGATE);
  } catch {
    return loadTensorflowModel({ url }, []);
  }
}

export function loadVoiceModel(): Promise<TensorflowModel> {
  if (!modelPromise) {
    modelPromise = resolveModelAssetUri(require('../../../assets/models/whisper-base-fr.tflite')).then(loadWithBestDelegate);
  }
  return modelPromise;
}
