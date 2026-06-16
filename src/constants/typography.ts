// src/constants/typography.ts
export const fontFamily = {
  // ── Display & headings — Plus Jakarta Sans ──
  displayBlack: 'PlusJakartaSans-ExtraBold',
  displayBold:  'PlusJakartaSans-Bold',
  displaySemi:  'PlusJakartaSans-SemiBold',

  // ── Corps — Inter ───────────────────────────
  regular:  'Inter-Regular',
  medium:   'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold:     'Inter-Bold',

  // ── Noms de plats UNIQUEMENT — Playfair Display
  serif:        'PlayfairDisplay-Bold',

  // ── Monospace ────────────────────────────────
  mono:     'JetBrainsMono-Regular',
  monoBold: 'JetBrainsMono-Bold',

  // ── Aliases backward-compat ──────────────────
  serifBold:    'PlayfairDisplay-Bold',
  serifRegular: 'PlayfairDisplay-Regular',
} as const;

export const fontSize = {
  // ── Nouvelle échelle sémantique ─────────────
  display:  32,
  h1:       24,
  h2:       20,
  h3:       16,
  body:     14,
  caption:  12,
  label:    14,
  overline: 11,

  // ── Aliases backward-compat ─────────────────
  xs:   11,
  sm:   12,
  md:   14,
  base: 14,
  lg:   17,
  xl:   20,
  xxl:  24,
  hero: 42,
} as const;

export const lineHeight = {
  // ── Nouvelle échelle en pixels ──────────────
  display:  38,
  h1:       30,
  h2:       26,
  h3:       22,
  body:     22,
  caption:  16,
  label:    18,
  overline: 14,

  // ── Aliases backward-compat (ratios) ────────
  tight:  1.2,
  normal: 1.5,
  loose:  1.7,
} as const;

export const letterSpacing = {
  display:  -0.32,
  h1:       -0.12,
  h2:        0,
  h3:        0,
  body:      0,
  label:     0.5,
  overline:  1.2,
} as const;

export type FontFamilyKey = keyof typeof fontFamily;
export type FontSizeKey   = keyof typeof fontSize;
