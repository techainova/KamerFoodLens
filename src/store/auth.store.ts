// src/store/auth.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';

const _mmkv = createMMKV({ id: 'kfl-auth-store' });
const mmkvStorage = {
  setItem:    (key: string, value: string) => _mmkv.set(key, value),
  getItem:    (key: string) => _mmkv.getString(key) ?? null,
  removeItem: (key: string) => { _mmkv.remove(key); },
};

export type UserRole = 'standard' | 'pro' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  role: UserRole;
  xpPoints: number;
  level: number;
}

interface AuthState {
  user:            User | null;
  accessToken:     string | null;
  refreshToken:    string | null;
  isAuthenticated: boolean;
  isLoading:       boolean;
  hasHydrated:     boolean;

  setUser:         (user: User) => void;
  setTokens:       (access: string, refresh: string) => void;
  clearAuth:       () => void;
  setLoading:      (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      hasHydrated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      clearAuth: () => set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false }),
      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: 'kfl-auth',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (s) => ({
        user: s.user,
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
        isAuthenticated: s.isAuthenticated,
      }),
      // Le root navigator attend `hasHydrated` avant de choisir l'écran initial,
      // pour ne jamais flasher un état "non connecté" pendant la lecture du MMKV.
      onRehydrateStorage: () => (state) => {
        if (state) state.hasHydrated = true;
      },
    },
  ),
);
