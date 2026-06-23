// src/ai/voice/loadVoiceModel.web.ts
// Variante web : react-native-fast-tflite est un module natif sans
// implémentation web. Metro choisit ce fichier sur la plateforme "web".

export function loadVoiceModel(): Promise<never> {
  return Promise.reject(
    new Error("La reconnaissance vocale locale n'est pas disponible sur le web."),
  );
}
