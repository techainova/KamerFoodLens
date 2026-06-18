// src/ai/loadModel.web.ts
// Variante web : react-native-fast-tflite est un module natif (Nitro) sans
// implémentation web. Metro choisit automatiquement ce fichier sur la
// plateforme "web" pour éviter de bundler du code natif incompatible.

export function loadModel(): Promise<never> {
  return Promise.reject(
    new Error('La reconnaissance de plats par IA locale n\'est pas disponible sur le web. Utilisez l\'application mobile (iOS/Android).'),
  );
}
