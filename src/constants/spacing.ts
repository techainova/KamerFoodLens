// src/constants/spacing.ts
// Échelle 4dp — ne jamais utiliser de valeurs arbitraires
export const spacing = {
  // ── Nouvelle échelle numérique ───────────
  0:   0,
  1:   2,
  2:   4,
  3:   8,
  4:   12,
  5:   16,
  6:   24,
  7:   32,
  8:   48,
  9:   64,
  // ── Aliases backward-compat ──────────────
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
  xxl: 48,
} as const;

// Alias sémantiques explicites (usage recommandé dans le nouveau code)
export const spacing2 = {
  xs:  4,
  sm:  8,
  md:  16,
  lg:  24,
  xl:  32,
} as const;

export const radius = {
  xs:    4,
  sm:    8,
  md:    12,
  lg:    16,
  xl:    24,
  '2xl': 32,
  full:  9999,
} as const;

export const touchMin = 48;

export type SpacingKey = keyof typeof spacing;
export type RadiusKey  = keyof typeof radius;
