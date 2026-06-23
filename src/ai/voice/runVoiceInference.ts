// src/ai/voice/runVoiceInference.ts
// Exécute la transcription complète : audio brut 16kHz mono -> texte,
// 100% local (mel-spectrogramme calculé en JS + un seul appel au modèle
// Whisper TFLite, qui contient déjà la boucle de décodage encodeur-décodeur).

import { loadVoiceModel } from './loadVoiceModel';
import { computeLogMelSpectrogram } from './melSpectrogram';
import { decodeTokens } from './decodeTokens';

export async function runVoiceInference(samples: Float32Array): Promise<string> {
  const model = await loadVoiceModel();
  const melSpectrogram = computeLogMelSpectrogram(samples);

  const outputs = await model.run([melSpectrogram.buffer as ArrayBuffer]);
  const rawTokens = outputs[0];

  if (!rawTokens) {
    throw new Error("Le modèle vocal n'a retourné aucune sortie");
  }

  const tokenIds = new Int32Array(rawTokens);
  return decodeTokens(tokenIds);
}
