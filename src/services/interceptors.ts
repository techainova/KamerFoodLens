// src/services/interceptors.ts
// Intercepteurs Axios : JWT + chiffrement AES automatique

import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth.store';
import { encrypt, deriveKey, addTimestamp } from '@/crypto';

// Routes qui nécessitent un chiffrement AES du payload
const ENCRYPTED_ROUTES = [
  '/scan/image',
  '/scan/audio',
  '/scan/text',
  '/payments/initiate',
];

function requiresEncryption(url: string = ''): boolean {
  return ENCRYPTED_ROUTES.some((route) => url.includes(route));
}

export function applyInterceptors(instance: AxiosInstance): void {

  // ── REQUEST : JWT + AES ──
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const { accessToken } = useAuthStore.getState();

      // Ajouter le JWT
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      // Chiffrer le payload si nécessaire
      if (config.data && requiresEncryption(config.url)) {
        try {
          const key = await deriveKey(accessToken ?? 'anonymous');
          const rid = crypto.randomUUID?.() ?? Math.random().toString(36);
          const payload = addTimestamp(
            typeof config.data === 'string'
              ? JSON.parse(config.data)
              : config.data,
          );
          config.data = await encrypt(payload, key, rid);
        } catch (err) {
          console.error('[Interceptor] Chiffrement échoué :', err);
        }
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  // ── RESPONSE : gestion 401 ──
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      if (error.response?.status === 401) {
        useAuthStore.getState().clearAuth();
      }
      return Promise.reject(error);
    },
  );
}
