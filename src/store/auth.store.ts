// src/store/auth.store.ts
// État global d'authentification — Zustand

import { create } from 'zustand';

export type UserRole = 'standard' | 'pro' | 'admin';

export interface User {
  id:        string;
  email:     string;
  firstName: string;
  lastName:  string;
  username:  string;
  phone?:    string;
  avatar?:   string;
  role:      UserRole;
  xpPoints:  number;
  level:     number;
}

interface AuthState {
  user:            User | null;
  accessToken:     string | null;
  refreshToken:    string | null;
  isAuthenticated: boolean;
  isLoading:       boolean;

  setUser:         (user: User) => void;
  setTokens:       (access: string, refresh: string) => void;
  clearAuth:       () => void;
  setLoading:      (v: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user:            null,
  accessToken:     null,
  refreshToken:    null,
  isAuthenticated: false,
  isLoading:       false,

  setUser: (user) => set({ user, isAuthenticated: true }),

  setTokens: (accessToken, refreshToken) =>
    set({ accessToken, refreshToken }),

  clearAuth: () =>
    set({
      user:            null,
      accessToken:     null,
      refreshToken:    null,
      isAuthenticated: false,
    }),

  setLoading: (isLoading) => set({ isLoading }),
}));
