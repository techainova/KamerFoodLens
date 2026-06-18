// src/store/ui.store.ts
// État global UI — langue, thème, loading

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import type { Language } from '@/i18n';

const _mmkv = createMMKV({ id: 'kfl-ui-store' });
const mmkvStorage = {
  setItem:    (key: string, value: string) => _mmkv.set(key, value),
  getItem:    (key: string) => _mmkv.getString(key) ?? null,
  removeItem: (key: string) => { _mmkv.remove(key); },
};

export type ThemeMode = 'light' | 'dark' | 'system';

interface UIState {
  language:   Language;
  themeMode:  ThemeMode;
  isLoading:  boolean;
  toastMsg:   string | null;

  setLanguage:  (lang: Language) => void;
  setThemeMode: (mode: ThemeMode) => void;
  setLoading:   (v: boolean) => void;
  showToast:    (msg: string) => void;
  clearToast:   () => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      language:   'fr',
      themeMode:  'system',
      isLoading:  false,
      toastMsg:   null,

      setLanguage:  (language)   => set({ language }),
      setThemeMode: (themeMode)  => set({ themeMode }),
      setLoading:   (isLoading)  => set({ isLoading }),
      showToast:    (toastMsg)   => set({ toastMsg }),
      clearToast:   ()           => set({ toastMsg: null }),
    }),
    {
      name:    'kfl-ui',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (s) => ({ language: s.language, themeMode: s.themeMode }),
    },
  ),
);
