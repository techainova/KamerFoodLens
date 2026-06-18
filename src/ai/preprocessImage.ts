// src/ai/preprocessImage.ts
// Redimensionne l'image capturée en 224x224 et normalise les pixels en 0-1
// pour correspondre à l'entrée attendue par le modèle MobileNetV2.

import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { decode as decodeJpeg } from 'jpeg-js';

export const MODEL_INPUT_SIZE = 224;

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

/**
 * Redimensionne l'image en 224x224 puis retourne un Float32Array RGB
 * normalisé 0-1 (longueur 224*224*3), prêt à être passé au modèle TFLite.
 */
export async function preprocessImage(imageUri: string): Promise<Float32Array> {
  const rendered = await ImageManipulator.manipulate(imageUri)
    .resize({ width: MODEL_INPUT_SIZE, height: MODEL_INPUT_SIZE })
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

  const pixelCount = MODEL_INPUT_SIZE * MODEL_INPUT_SIZE;
  const input = new Float32Array(pixelCount * 3);

  for (let i = 0; i < pixelCount; i++) {
    const srcOffset = i * 4; // RGBA
    const dstOffset = i * 3; // RGB
    input[dstOffset]     = decoded.data[srcOffset]     / 255;
    input[dstOffset + 1] = decoded.data[srcOffset + 1] / 255;
    input[dstOffset + 2] = decoded.data[srcOffset + 2] / 255;
  }

  return input;
}
