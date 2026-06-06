// src/services/mock.auth.ts
// Utilisateur mock pour tester sans backend — SUPPRIMER en production

import { useAuthStore } from '@/store/auth.store';

export const MOCK_USER = {
  id:        'mock-001',
  email:     'amah@kmerfoodlens.com',
  firstName: 'Amah',
  lastName:  'Ndongo',
  username:  '@amah',
  phone:     '+237 6XX XX XX XX',
  role:      'standard' as const,
  xpPoints:  1250,
  level:     2,
  avatar:    undefined,
};

export function loginMock() {
  const { setUser, setTokens } = useAuthStore.getState();
  setUser(MOCK_USER);
  setTokens('mock-access-token-dev', 'mock-refresh-token-dev');
}

export function logoutMock() {
  useAuthStore.getState().clearAuth();
}