// src/ai/resolveModelAsset.ts
// Résout un asset require(...) (modèle .tflite, etc.) en une vraie URI
// file:// locale via expo-asset, en téléchargeant/copiant le fichier sur
// le disque si nécessaire.
//
// Pourquoi : react-native-fast-tflite résout lui-même les require(...) via
// `Image.resolveAssetSource()`, conçu pour des images. Sur certains builds
// Android (release, ou assets non-image), cette résolution retourne un nom
// de ressource brut sans schéma (ex. "assets_models_whisperbasefr") au lieu
// d'une URL, ce qui fait planter le chargeur natif avec
// `MalformedURLException: no protocol`. En passant nous-mêmes par
// `Asset.fromModule(...).downloadAsync()`, on obtient une vraie URI
// `file://...` garantie valide, qu'on transmet ensuite via `{ url }`.

import { Asset } from 'expo-asset';

export async function resolveModelAssetUri(moduleId: number): Promise<string> {
  const asset = Asset.fromModule(moduleId);
  await asset.downloadAsync();
  const uri = asset.localUri ?? asset.uri;
  if (!uri) {
    throw new Error('Impossible de résoudre le chemin local de cet asset.');
  }
  return uri;
}
