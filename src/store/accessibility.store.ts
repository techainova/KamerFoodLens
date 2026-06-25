// src/store/accessibility.store.ts
// État global accessibilité — taille du texte, contraste, animations

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';

const _mmkv = createMMKV({ id: 'kfl-accessibility-store' });
const mmkvStorage = {
  setItem:    (key: string, value: string) => _mmkv.set(key, value),
  getItem:    (key: string) => _mmkv.getString(key) ?? null,
  removeItem: (key: string) => { _mmkv.remove(key); },
};

export type TextSize = 0 | 1 | 2 | 3;
export type ContrastMode = 0 | 1 | 2;
export type BodyFont = 'inter' | 'mono';
export type ColorBlindMode = 0 | 1 | 2 | 3; // 0=aucun 1=deuteranopie 2=protanopie 3=tritanopie
export type CaptionSize = 'small' | 'medium' | 'large';
export type LetterSpacing = 'normal' | 'wide';

interface AccessibilityState {
  textSize:        TextSize;
  contrastMode:    ContrastMode;
  reduceMotion:    boolean;
  screenReader:    boolean;
  haptics:         boolean;
  boldText:        boolean;
  bodyFont:        BodyFont;
  colorBlindMode:  ColorBlindMode;
  captionsEnabled: boolean;
  captionSize:     CaptionSize;
  captionBgOpacity: number;
  actionDelay:     boolean;
  largeTargets:    boolean;
  letterSpacing:   LetterSpacing;

  setTextSize:        (v: TextSize) => void;
  setContrastMode:    (v: ContrastMode) => void;
  setReduceMotion:    (v: boolean) => void;
  setScreenReader:    (v: boolean) => void;
  setHaptics:         (v: boolean) => void;
  setBoldText:        (v: boolean) => void;
  setBodyFont:        (v: BodyFont) => void;
  setColorBlindMode:  (v: ColorBlindMode) => void;
  setCaptionsEnabled: (v: boolean) => void;
  setCaptionSize:     (v: CaptionSize) => void;
  setCaptionBgOpacity: (v: number) => void;
  setActionDelay:     (v: boolean) => void;
  setLargeTargets:    (v: boolean) => void;
  setLetterSpacing:   (v: LetterSpacing) => void;
  reset: () => void;
}

const DEFAULTS = {
  textSize:        1 as TextSize,
  contrastMode:    0 as ContrastMode,
  reduceMotion:    false,
  screenReader:    false,
  haptics:         true,
  boldText:        false,
  bodyFont:        'inter' as BodyFont,
  colorBlindMode:  0 as ColorBlindMode,
  captionsEnabled: true,
  captionSize:     'medium' as CaptionSize,
  captionBgOpacity: 75,
  actionDelay:     false,
  largeTargets:    false,
  letterSpacing:   'normal' as LetterSpacing,
};

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      ...DEFAULTS,

      setTextSize:        (textSize)        => set({ textSize }),
      setContrastMode:    (contrastMode)    => set({ contrastMode }),
      setReduceMotion:    (reduceMotion)    => set({ reduceMotion }),
      setScreenReader:    (screenReader)    => set({ screenReader }),
      setHaptics:         (haptics)         => set({ haptics }),
      setBoldText:        (boldText)        => set({ boldText }),
      setBodyFont:        (bodyFont)        => set({ bodyFont }),
      setColorBlindMode:  (colorBlindMode)  => set({ colorBlindMode }),
      setCaptionsEnabled: (captionsEnabled) => set({ captionsEnabled }),
      setCaptionSize:     (captionSize)     => set({ captionSize }),
      setCaptionBgOpacity: (captionBgOpacity) => set({ captionBgOpacity }),
      setActionDelay:     (actionDelay)     => set({ actionDelay }),
      setLargeTargets:    (largeTargets)    => set({ largeTargets }),
      setLetterSpacing:   (letterSpacing)   => set({ letterSpacing }),
      reset: () => set({ ...DEFAULTS }),
    }),
    {
      name:    'kfl-accessibility',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
