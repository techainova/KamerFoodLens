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

interface AccessibilityState {
  textSize:     TextSize;
  contrastMode: ContrastMode;
  reduceMotion: boolean;
  screenReader: boolean;
  haptics:      boolean;
  boldText:     boolean;

  setTextSize:     (v: TextSize) => void;
  setContrastMode: (v: ContrastMode) => void;
  setReduceMotion: (v: boolean) => void;
  setScreenReader: (v: boolean) => void;
  setHaptics:      (v: boolean) => void;
  setBoldText:     (v: boolean) => void;
  reset: () => void;
}

const DEFAULTS = {
  textSize:     1 as TextSize,
  contrastMode: 0 as ContrastMode,
  reduceMotion: false,
  screenReader: false,
  haptics:      true,
  boldText:     false,
};

export const useAccessibilityStore = create<AccessibilityState>()(
  persist(
    (set) => ({
      ...DEFAULTS,

      setTextSize:     (textSize)     => set({ textSize }),
      setContrastMode: (contrastMode) => set({ contrastMode }),
      setReduceMotion: (reduceMotion) => set({ reduceMotion }),
      setScreenReader: (screenReader) => set({ screenReader }),
      setHaptics:      (haptics)      => set({ haptics }),
      setBoldText:     (boldText)     => set({ boldText }),
      reset: () => set({ ...DEFAULTS }),
    }),
    {
      name:    'kfl-accessibility',
      storage: createJSONStorage(() => mmkvStorage),
    },
  ),
);
