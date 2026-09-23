// src/utils/guessImageMimeType.ts
// expo-image-picker reliably reports the real mimeType on web (File.type) and
// on modern native builds, but falls back to undefined in some edge cases
// (older devices, some third-party file providers). Defaulting blindly to
// 'image/jpeg' in that case mislabels non-JPEG picks (PNG, WEBP, GIF, HEIC...),
// so guess from the file extension in the URI first, and only fall back to
// JPEG when nothing at all is available.
const EXTENSION_TO_MIME: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  bmp: 'image/bmp',
  heic: 'image/heic',
  heif: 'image/heif',
  svg: 'image/svg+xml',
  tiff: 'image/tiff',
  tif: 'image/tiff',
};

export function guessImageMimeType(uri: string, declaredMimeType?: string | null): string {
  if (declaredMimeType) return declaredMimeType;
  const match = uri.match(/\.([a-zA-Z0-9]+)(?:\?.*)?$/);
  const ext = match?.[1]?.toLowerCase();
  return (ext && EXTENSION_TO_MIME[ext]) || 'image/jpeg';
}
