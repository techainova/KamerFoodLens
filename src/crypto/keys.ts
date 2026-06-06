// src/crypto/keys.ts
// Dérivation de clé AES-256 depuis le JWT (HKDF-SHA256)

import { Buffer } from 'buffer';

const KEY_LENGTH = 32; // 256 bits

export async function deriveKey(
  jwt: string,
  salt: string = 'kfl-salt-v1',
): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const keyMaterial = encoder.encode(jwt + salt);

  // HKDF simplifié : SHA-256 du jwt+salt répété jusqu'à 32 bytes
  let derived = new Uint8Array(KEY_LENGTH);
  let offset = 0;
  let counter = 1;

  while (offset < KEY_LENGTH) {
    const input = new Uint8Array([...keyMaterial, counter]);
    const hashBuffer = await crypto.subtle.digest('SHA-256', input);
    const hashArray = new Uint8Array(hashBuffer);
    const needed = Math.min(KEY_LENGTH - offset, hashArray.length);
    derived.set(hashArray.slice(0, needed), offset);
    offset += needed;
    counter++;
  }

  return derived;
}