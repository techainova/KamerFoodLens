// src/constants/colors.ts
// Design System KFL — source officielle : CLAUDE.md
export const colors = {
  // ── Palette principale (spec CLAUDE.md) ─────────
  primary:        '#E8591A',   // Orange KFL — boutons CTA, accents
  primaryHover:   '#CF4A0F',
  primaryPressed: '#B03D0C',
  primarySoft:    '#FEF0E8',   // Fond orange pâle

  success:     '#2E7D32',
  successSoft: '#E3F0E4',

  error:       '#C62828',
  errorSoft:   '#FBDCDC',

  gold:        '#F9A825',      // Pro, badges, récompenses
  goldSoft:    '#FBF3DC',

  navy:        '#1A237E',      // Admin, autorité
  navySoft:    '#E8EAF6',

  // ── Textes ──────────────────────────────────────
  ink:         '#2C1810',      // Texte principal — brun chaud
  inkSoft:     '#6D4C41',      // Texte secondaire
  inkMute:     '#8C8278',      // Texte désactivé / placeholder
  fgOnDark:    '#FFFFFF',

  // ── Fonds & surfaces ────────────────────────────
  cream:       '#FFFAF5',      // Fond principal (chaud)
  surface:     '#FFFFFF',      // Cartes, modals
  surface2:    '#F5F0EB',      // Fond secondaire

  // ── Bordures ────────────────────────────────────
  border:      '#E5E0D8',

  // ── Tokens étendus (alias internes) ─────────────
  bg:            '#FFFAF5',    // = cream
  surfaceRaised: '#FFFFFF',    // = surface
  surfaceSunken: '#F5F0EB',    // = surface2

  fg:          '#2C1810',      // = ink
  fgMuted:     '#6D4C41',      // = inkSoft
  fgSubtle:    '#8C8278',      // = inkMute
  fgDisabled:  '#B5A9A4',
  fgSoft:      '#8C8278',      // = inkMute (alias modules Pro/Order)

  borderStrong: '#C8C0BA',
  borderFocus:  '#E8591A',     // = primary
  divider:      '#E5E0D8',     // = border
  borderDark:   '#C8C0BA',

  // ── Sémantiques étendus ──────────────────────────
  warning:     '#F9A825',      // = gold
  warningSoft: '#FBF3DC',      // = goldSoft
  info:        '#1E88E5',
  infoSoft:    '#E6F1FB',

  // ── IA Confiance ────────────────────────────────
  confidenceHigh: '#1D8A2F',
  confidenceMid:  '#E6A100',
  confidenceLow:  '#C62828',

  // ── Utilitaires ─────────────────────────────────
  white:       '#FFFFFF',
  black:       '#000000',
  transparent: 'transparent',
  overlay:     'rgba(44, 24, 16, 0.55)',
  scrim:       'rgba(44, 24, 16, 0.32)',
  overlayLight: 'rgba(44, 24, 16, 0.18)',

  // ── Backward-compat aliases ──────────────────────
  // (noms historiques utilisés dans 80+ fichiers — ne pas supprimer)
  accent:      '#E8591A',      // = primary
  accentHover: '#CF4A0F',      // = primaryHover
  accentSoft:  '#FEF0E8',      // = primarySoft

  green:    '#2E7D32',         // = success
  teal:     '#00796B',         // couleur jeu/défi
  blue:     '#1E88E5',         // = info
  blueSoft: '#E6F1FB',         // = infoSoft
  gray:     '#F5F0EB',         // = surface2

  secondary:      '#2E7D32',   // = success (legacy WFButton outline)
  secondaryHover: '#1D5824',
  secondarySoft:  '#E3F0E4',
} as const;

export type ColorKey = keyof typeof colors;
