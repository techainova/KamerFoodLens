// src/ai/voice/decodeTokens.ts
// Convertit la séquence d'identifiants de tokens retournée par le modèle
// en texte. Le vocabulaire est stocké en latin1 (mapping 1:1 octet<->char,
// donc sans perte) car un caractère accentué français peut être réparti
// sur deux tokens BPE adjacents : il faut concaténer les OCTETS bruts de
// tous les tokens avant de décoder l'UTF-8 final, pas décoder chaque
// token individuellement (ce qui casserait "é", "è", "à"...).

import vocab from '../../../assets/models/whisper_vocab.json';

const VOCAB: string[] = vocab;
const VOCAB_SIZE = VOCAB.length; // 50257 — au-delà, ce sont des tokens de contrôle

const utf8Decoder = new TextDecoder('utf-8');

export function decodeTokens(tokenIds: ArrayLike<number>): string {
  const bytes: number[] = [];
  for (let i = 0; i < tokenIds.length; i++) {
    const id = tokenIds[i];
    if (id < 0 || id >= VOCAB_SIZE) continue; // token de contrôle (langue, tâche, eot, timestamp...)
    const token = VOCAB[id];
    for (let c = 0; c < token.length; c++) {
      bytes.push(token.charCodeAt(c) & 0xff);
    }
  }
  return utf8Decoder.decode(new Uint8Array(bytes)).trim();
}
