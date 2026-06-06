// src/crypto/encrypt.ts
// Chiffrement AES-256-GCM d'un payload JSON

export interface EncryptedPayload {
  version:    '1';
  algorithm:  'AES-256-GCM';
  iv:         string;  // base64 — 12 octets
  tag:        string;  // base64 — 16 octets (inclus dans ciphertext Web Crypto)
  ciphertext: string;  // base64
  ts:         number;  // timestamp Unix ms
  rid:        string;  // Request ID unique
}

export async function encrypt(
  data: object,
  key: Uint8Array,
  rid: string,
): Promise<EncryptedPayload> {
  const encoder  = new TextEncoder();
  const plaintext = encoder.encode(JSON.stringify(data));

  // Générer un IV aléatoire 12 octets
  const iv = crypto.getRandomValues(new Uint8Array(12));

  // Importer la clé
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'AES-GCM' },
    false,
    ['encrypt'],
  );

  // Chiffrer
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    plaintext,
  );

  // Les 16 derniers octets = tag GCM (inclus automatiquement par Web Crypto)
  const encryptedArray = new Uint8Array(encrypted);
  const ciphertext = encryptedArray.slice(0, -16);
  const tag        = encryptedArray.slice(-16);

  return {
    version:    '1',
    algorithm:  'AES-256-GCM',
    iv:         btoa(String.fromCharCode(...iv)),
    tag:        btoa(String.fromCharCode(...tag)),
    ciphertext: btoa(String.fromCharCode(...ciphertext)),
    ts:         Date.now(),
    rid,
  };
}