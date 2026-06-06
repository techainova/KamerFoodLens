// src/constants/typography.ts
// Tokens typographiques KFL

export const fontFamily = {
  // Titres — Playfair Display
  serifBold:       'PlayfairDisplay-Bold',
  serifRegular:    'PlayfairDisplay-Regular',

  // Corps — Inter
  regular:         'Inter-Regular',
  medium:          'Inter-Medium',
  semiBold:        'Inter-SemiBold',
  bold:            'Inter-Bold',

  // Monospace — JetBrains Mono
  mono:            'JetBrainsMono-Regular',
  monoBold:        'JetBrainsMono-Bold',
} as const;

export const fontSize = {
  xs:   11,
  sm:   12,
  md:   14,
  base: 15,
  lg:   17,
  xl:   20,
  xxl:  24,
  h2:   28,
  h1:   32,
  hero: 42,
} as const;

export const lineHeight = {
  tight:  1.2,
  normal: 1.5,
  loose:  1.7,
} as const;

export type FontFamilyKey = keyof typeof fontFamily;
export type FontSizeKey   = keyof typeof fontSize;