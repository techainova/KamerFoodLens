// src/ai/voice/resample.ts
// Rééchantillonnage simple (interpolation linéaire) d'un signal mono.
// Suffisant pour de la parole — l'objectif est de corriger un débit natif
// du micro qui diffère du 16kHz attendu par Whisper, pas du mastering audio.

export function resampleLinear(input: Float32Array, fromRate: number, toRate: number): Float32Array {
  if (fromRate === toRate || input.length === 0) return input;

  const ratio = fromRate / toRate;
  const outLength = Math.max(1, Math.round(input.length / ratio));
  const output = new Float32Array(outLength);

  for (let i = 0; i < outLength; i++) {
    const srcPos = i * ratio;
    const srcIndex = Math.floor(srcPos);
    const frac = srcPos - srcIndex;
    const a = input[srcIndex] ?? 0;
    const b = input[srcIndex + 1] ?? a;
    output[i] = a + (b - a) * frac;
  }

  return output;
}
