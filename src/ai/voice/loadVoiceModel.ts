// src/ai/voice/loadVoiceModel.ts
// Charge le modèle Whisper (français) depuis les assets une seule fois.

import { loadTensorflowModel, type TensorflowModel } from 'react-native-fast-tflite';
import { resolveModelAssetUri } from '../resolveModelAsset';

let modelPromise: Promise<TensorflowModel> | null = null;

export function loadVoiceModel(): Promise<TensorflowModel> {
  if (!modelPromise) {
    modelPromise = resolveModelAssetUri(require('../../../assets/models/whisper-base-fr.tflite'))
      .then((url) => loadTensorflowModel({ url }, []));
  }
  return modelPromise;
}
