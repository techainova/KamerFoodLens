// src/constants/shadows.ts
// Définitions d'ombres pour iOS et Android

import { Platform } from 'react-native';

const shadow = (
  opacity: number,
  radius: number,
  offsetY: number,
  elevation: number,
) => Platform.select({
  ios: {
    shadowColor:   '#000000',
    shadowOffset:  { width: 0, height: offsetY },
    shadowOpacity: opacity,
    shadowRadius:  radius,
  },
  android: {
    elevation,
  },
  default: {},
});

export const shadows = {
  none: {},
  sm:   shadow(0.06, 3,  1, 2),
  md:   shadow(0.09, 6,  2, 4),
  lg:   shadow(0.12, 12, 4, 8),
  xl:   shadow(0.16, 20, 8, 16),
} as const;

export type ShadowKey = keyof typeof shadows;