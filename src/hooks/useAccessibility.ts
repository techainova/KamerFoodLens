// src/hooks/useAccessibility.ts
// Dérive échelle de police et durée d'animation depuis l'état d'accessibilité

import { useAccessibilityStore } from '@/store/accessibility.store';

const FONT_SCALES = [0.88, 1, 1.15, 1.32] as const;

export function useFontScale(): number {
  const textSize = useAccessibilityStore(s => s.textSize);
  return FONT_SCALES[textSize];
}

export function useAnimDuration(normalMs: number): number {
  const reduceMotion = useAccessibilityStore(s => s.reduceMotion);
  return reduceMotion ? 0 : normalMs;
}

export function useBoldText(): boolean {
  return useAccessibilityStore(s => s.boldText);
}
