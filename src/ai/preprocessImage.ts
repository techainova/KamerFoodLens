// src/ai/preprocessImage.ts
// Redimensionne l'image capturée à la taille attendue par le modèle et
// produit un tenseur RGB soit normalisé 0-1 (float32), soit brut 0-255
// (uint8), selon ce que le modèle attend réellement.

import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { decode as decodeJpeg } from 'jpeg-js';

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function base64ToUint8Array(base64: string): Uint8Array {
  const clean = base64.replace(/=+$/, '');
  const bytes: number[] = [];
  let buffer = 0;
  let bits = 0;
  for (let i = 0; i < clean.length; i++) {
    buffer = (buffer << 6) | BASE64_CHARS.indexOf(clean[i]);
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes.push((buffer >> bits) & 0xff);
    }
  }
  return new Uint8Array(bytes);
}

export interface PreprocessOptions {
  width: number;
  height: number;
  /** true => Float32Array normalisé 0-1 ; false => Uint8Array brut 0-255 */
  normalize: boolean;
}

/**
 * Redimensionne l'image à la taille demandée et retourne un tenseur RGB
 * (longueur width*height*3), au format attendu par le modèle.
 */
export async function preprocessImage(
  imageUri: string,
  { width, height, normalize }: PreprocessOptions,
): Promise<Float32Array | Uint8Array> {
  const rendered = await ImageManipulator.manipulate(imageUri)
    .resize({ width, height })
    .renderAsync();

  const saved = await rendered.saveAsync({
    base64: true,
    format: SaveFormat.JPEG,
    compress: 1,
  });

  if (!saved.base64) {
    throw new Error('Échec du prétraitement: base64 manquant');
  }

  const jpegBytes = base64ToUint8Array(saved.base64);
  const decoded = decodeJpeg(jpegBytes, { useTArray: true });

  const pixelCount = width * height;
  const input = normalize ? new Float32Array(pixelCount * 3) : new Uint8Array(pixelCount * 3);

  for (let i = 0; i < pixelCount; i++) {
    const srcOffset = i * 4; // RGBA (jpeg-js décode toujours en RGBA par défaut)
    const dstOffset = i * 3; // RGB
    const r = decoded.data[srcOffset];
    const g = decoded.data[srcOffset + 1];
    const b = decoded.data[srcOffset + 2];
    if (normalize) {
      input[dstOffset]     = r / 255;
      input[dstOffset + 1] = g / 255;
      input[dstOffset + 2] = b / 255;
    } else {
      input[dstOffset]     = r;
      input[dstOffset + 1] = g;
      input[dstOffset + 2] = b;
    }
  }

  return input;
}
