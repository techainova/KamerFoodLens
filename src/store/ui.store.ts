// src/store/ui.store.ts
// État global UI — langue, thème, loading

import { create } from 'zustand';
import type { Language } from '@/i18n';

interface UIState {
  language:   Language;
  theme:      'light' | 'dark';
  isLoading:  boolean;
  toastMsg:   string | null;

  setLanguage:  (lang: Language) => void;
  setTheme:     (theme: 'light' | 'dark') => void;
  setLoading:   (v: boolean) => void;
  showToast:    (msg: string) => void;
  clearToast:   () => void;
}

export const useUIStore = create<UIState>((set) => ({
  language:  'fr',
  theme:     'light',
  isLoading: false,
  toastMsg:  null,

  setLanguage:  (language)  => set({ language }),
  setTheme:     (theme)     => set({ theme }),
  setLoading:   (isLoading) => set({ isLoading }),
  showToast:    (toastMsg)  => set({ toastMsg }),
  clearToast:   ()          => set({ toastMsg: null }),
}));
