// src/constants/colors.ts
// Tous les tokens de couleur KFL — NE JAMAIS utiliser de valeurs brutes ailleurs

export const colors = {
  // Couleurs principales
  primary:      '#E8591A', // Orange KFL — boutons CTA, accents
  success:      '#2E7D32', // Vert — confirmations, succès
  error:        '#C62828', // Rouge — erreurs, alertes
  gold:         '#F9A825', // Or — Pro, badges, récompenses
  navy:         '#1A237E', // Indigo — Admin, autorité
  blue:         '#1565C0', // Bleu — liens, info

  // Texte
  ink:          '#2C1810', // Texte principal
  inkSoft:      '#6D4C41', // Texte secondaire
  inkMute:      '#8C8278', // Texte désactivé / placeholder

  // Fonds
  cream:        '#FFFAF5', // Fond principal
  surface:      '#FFFFFF', // Cartes, modals
  surface2:     '#F5F0EB', // Fond secondaire
  gray:         '#F4F1ED', // Fond gris léger

  // Bordures
  border:       '#E5E0D8',
  borderDark:   '#D4B8A8',

  // Couleurs douces (backgrounds de badges, chips)
  primarySoft:  '#FBE8DC',
  successSoft:  '#E3F0E4',
  errorSoft:    '#FBDCDC',
  goldSoft:     '#FBF3DC',
  navySoft:     '#E8EAF6',
  blueSoft:     '#DCE8FB',

  // Utilitaires
  white:        '#FFFFFF',
  black:        '#000000',
  transparent:  'transparent',

  // Overlay
  overlay:      'rgba(0,0,0,0.5)',
  overlayLight: 'rgba(0,0,0,0.15)',
} as const;

export type ColorKey = keyof typeof colors;