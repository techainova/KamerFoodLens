// src/utils/readUriAsBase64.ts
// Lit une URI locale (photo/vidéo choisie via expo-image-picker) et retourne
// son contenu en base64, de façon cross-platform :
//  - natif (iOS/Android) : URI file:// — expo-file-system sait la lire directement.
//  - web : URI blob:// — expo-file-system ne l'implémente pas du tout sur web
//    ("is not available on web"), il faut passer par fetch()+FileReader.
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system/legacy';

async function readBlobUriAsBase64(uri: string): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1] ?? '');
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export async function readUriAsBase64(uri: string): Promise<string> {
  if (Platform.OS === 'web') {
    return readBlobUriAsBase64(uri);
  }
  return FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
}
