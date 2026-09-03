// src/constants/shadows.ts
// Élévations Material-style — jamais ombre épaisse + bordure simultanément
import { Platform } from 'react-native';

const mkShadow = (
  oY1: number, blur1: number, op1: number,
  _oY2: number, _blur2: number, _op2: number,
  elevation: number,
) => Platform.select({
  ios: {
    shadowColor:   '#0E1A2A',
    shadowOffset:  { width: 0, height: oY1 },
    shadowOpacity: op1,
    shadowRadius:  blur1,
  },
  android: { elevation },
  default: {},
}) ?? {};

const elev1 = mkShadow(1,  2,  0.06, 1, 1, 0.04, 1);
const elev2 = mkShadow(2,  6,  0.08, 1, 2, 0.05, 3);
const elev3 = mkShadow(4,  12, 0.10, 2, 4, 0.06, 6);
const elev4 = mkShadow(8,  24, 0.14, 4, 8, 0.08, 12);

export const shadows = {
  none:  {},
  // ── Nouvelle API ────────────────
  elev1,
  elev2,
  elev3,
  elev4,
  // ── Aliases backward-compat ─────
  sm: elev1,
  md: elev2,
  lg: elev3,
  xl: elev4,
} as const;

export type ShadowKey = keyof typeof shadows;

// Platform-aware named exports — use these in screens instead of local constants
// to avoid "shadow* props are deprecated" warnings on web.
export const SHADOW_SM: object = Platform.select({
  ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4 },
  android: { elevation: 2 },
  default: {},
}) ?? {};

export const SHADOW_MD: object = Platform.select({
  ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 6 },
  android: { elevation: 4 },
  default: {},
}) ?? {};

export const SHADOW_LG: object = Platform.select({
  ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 12 },
  android: { elevation: 8 },
  default: {},
}) ?? {};
