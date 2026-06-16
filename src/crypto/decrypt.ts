// src/crypto/decrypt.ts
// Déchiffrement AES-256-GCM d'un payload reçu du serveur

import type { EncryptedPayload } from './encrypt';

function base64ToUint8Array(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes  = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function decrypt(
  payload: EncryptedPayload,
  key: Uint8Array,
): Promise<object> {
  const iv         = base64ToUint8Array(payload.iv);
  const tag        = base64ToUint8Array(payload.tag);
  const ciphertext = base64ToUint8Array(payload.ciphertext);

  // Recombiner ciphertext + tag (format Web Crypto)
  const combined = new Uint8Array(ciphertext.length + tag.length);
  combined.set(ciphertext);
  combined.set(tag, ciphertext.length);

  // Importer la clé
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key.buffer as ArrayBuffer,
    { name: 'AES-GCM' },
    false,
    ['decrypt'],
  );

  // Déchiffrer
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: iv.buffer as ArrayBuffer },
    cryptoKey,
    combined.buffer as ArrayBuffer,
  );

  const decoder = new TextDecoder();
  return JSON.parse(decoder.decode(decrypted));
}