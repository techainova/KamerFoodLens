// src/utils/timeAgo.ts
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return 'À l\'instant';
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}j`;
}
