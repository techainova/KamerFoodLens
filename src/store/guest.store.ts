// src/store/guest.store.ts
// Quota de scans anonymes — volontairement séparé de auth.store.ts : l'auth ne
// devrait rien savoir de cette règle métier ("un scan gratuit avant inscription").
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';

const _mmkv = createMMKV({ id: 'kfl-guest-store' });
const mmkvStorage = {
  setItem:    (key: string, value: string) => _mmkv.set(key, value),
  getItem:    (key: string) => _mmkv.getString(key) ?? null,
  removeItem: (key: string) => { _mmkv.remove(key); },
};

export const FREE_SCAN_LIMIT = 1;

interface GuestState {
  anonymousScanCount: number;
  hasSeenOnboarding: boolean;
  registerAnonymousScan: () => void;
  setHasSeenOnboarding: () => void;
}

export const useGuestStore = create<GuestState>()(
  persist(
    (set) => ({
      anonymousScanCount: 0,
      hasSeenOnboarding: false,
      registerAnonymousScan: () => set((s) => ({ anonymousScanCount: s.anonymousScanCount + 1 })),
      setHasSeenOnboarding: () => set({ hasSeenOnboarding: true }),
    }),
    {
      name: 'kfl-guest',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (s) => ({ anonymousScanCount: s.anonymousScanCount, hasSeenOnboarding: s.hasSeenOnboarding }),
    },
  ),
);
