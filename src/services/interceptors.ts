// src/services/interceptors.ts
// Intercepteurs Axios : JWT + AES-256-GCM (format backend) + unwrap + auto-refresh 401

import axios, { type AxiosInstance, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth.store';
import { API_CONFIG, ENDPOINTS } from './config';

// ── Types ──────────────────────────────────────────────────────────────────────
declare module 'axios' {
  interface InternalAxiosRequestConfig {
    _retry?: boolean;
  }
}

// ── Routes chiffrées AES-256-GCM ──────────────────────────────────────────────
const ENCRYPTED_ROUTES = [
  '/scan/image',
  '/scan/audio',
  '/scan/text',
  '/payments/initiate',
] as const;

function requiresEncryption(url: string = ''): boolean {
  return ENCRYPTED_ROUTES.some((r) => url.includes(r));
}

// ── Helpers crypto (Web Crypto API) ───────────────────────────────────────────
function hexToBytes(hex: string): Uint8Array {
  const pairs = hex.match(/.{2}/g) ?? [];
  return new Uint8Array(pairs.map((b) => parseInt(b, 16)));
}

function bytesToHex(buf: Uint8Array): string {
  return Array.from(buf)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

async function encryptForBackend(
  data: unknown,
): Promise<{ iv: string; tag: string; ciphertext: string }> {
  const keyHex = (process.env.EXPO_PUBLIC_ENCRYPTION_KEY as string | undefined) ?? '';
  if (!keyHex || keyHex.length !== 64) {
    throw new Error('[KFL] EXPO_PUBLIC_ENCRYPTION_KEY manquante ou invalide (doit être 32 octets hex)');
  }

  const keyBytes = hexToBytes(keyHex);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyBytes.buffer as ArrayBuffer,
    { name: 'AES-GCM' },
    false,
    ['encrypt'],
  );

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plaintext = new TextEncoder().encode(
    typeof data === 'string' ? data : JSON.stringify(data),
  );

  // Web Crypto appends the 16-byte GCM tag at the end of the ciphertext
  const encrypted = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    plaintext,
  );

  const enc = new Uint8Array(encrypted);
  const ciphertext = enc.slice(0, -16);
  const tag        = enc.slice(-16);

  return {
    iv:         bytesToHex(iv),
    tag:        bytesToHex(tag),
    ciphertext: bytesToHex(ciphertext),
  };
}

// ── Refresh token queue (évite les appels parallèles) ─────────────────────────
let isRefreshing = false;
let refreshQueue: Array<(token: string | null) => void> = [];

function drainQueue(token: string | null): void {
  refreshQueue.forEach((cb) => cb(token));
  refreshQueue = [];
}

// Instance dédiée au refresh (ne passe PAS par les intercepteurs de l'instance principale)
const refreshAxios = axios.create({ baseURL: API_CONFIG.BASE_URL, timeout: 10_000 });

// ── Export principal ──────────────────────────────────────────────────────────
export function applyInterceptors(instance: AxiosInstance): void {

  // ── REQUEST : JWT + AES ──────────────────────────────────────────────────────
  instance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
      const { accessToken } = useAuthStore.getState();

      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }

      if (config.data !== undefined && config.data !== null && requiresEncryption(config.url)) {
        try {
          const { iv, tag, ciphertext } = await encryptForBackend(config.data);
          config.headers['X-KFL-IV']   = iv;
          config.headers['X-KFL-TAG']  = tag;
          config.headers['Content-Type'] = 'text/plain';
          config.data = ciphertext;
        } catch (err) {
          console.error('[Interceptor] Chiffrement AES échoué :', err);
          throw err;
        }
      }

      return config;
    },
    (error) => Promise.reject(error),
  );

  // ── RESPONSE : unwrap { data: T, meta? } + 401 auto-refresh ─────────────────
  instance.interceptors.response.use(

    // ✅ Succès — désencapsule l'enveloppe backend { data: T, meta?: {...} }
    (response) => {
      const body = response.data;
      if (
        body !== null &&
        body !== undefined &&
        typeof body === 'object' &&
        'data' in (body as object)
      ) {
        // Conserver meta en tant qu'attribut non-énumérable pour les callers qui en ont besoin
        const unwrapped = (body as { data: unknown; meta?: unknown }).data;
        const meta      = (body as { data: unknown; meta?: unknown }).meta;
        response.data = unwrapped;
        if (meta) {
          Object.defineProperty(response, '_meta', { value: meta, writable: true });
        }
      }
      return response;
    },

    // ❌ Erreur — gestion 401 avec refresh automatique
    async (error) => {
      const originalConfig: InternalAxiosRequestConfig = error.config;

      const is401           = error.response?.status === 401;
      const isRefreshRoute  = originalConfig?.url?.includes(ENDPOINTS.REFRESH);
      const alreadyRetried  = originalConfig?._retry === true;

      if (!is401 || isRefreshRoute || alreadyRetried) {
        if (is401) useAuthStore.getState().clearAuth();
        return Promise.reject(error);
      }

      if (isRefreshing) {
        // Mettre la requête en file jusqu'à ce que le refresh soit terminé
        return new Promise((resolve, reject) => {
          refreshQueue.push((newToken) => {
            if (newToken) {
              originalConfig.headers.Authorization = `Bearer ${newToken}`;
              originalConfig._retry = true;
              resolve(instance(originalConfig));
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;
      originalConfig._retry = true;

      try {
        const storedRefresh = useAuthStore.getState().refreshToken;
        if (!storedRefresh) throw new Error('No refresh token');

        const { data: raw } = await refreshAxios.post<{
          data: { accessToken: string; refreshToken: string };
        }>(ENDPOINTS.REFRESH, { refreshToken: storedRefresh });

        // Le refreshAxios ne passe pas par le unwrapper — extraire data manuellement
        const tokens = raw?.data ?? (raw as unknown as { accessToken: string; refreshToken: string });
        const newAccess  = tokens.accessToken;
        const newRefresh = tokens.refreshToken;

        useAuthStore.getState().setTokens(newAccess, newRefresh);

        originalConfig.headers.Authorization = `Bearer ${newAccess}`;
        drainQueue(newAccess);
        return instance(originalConfig);

      } catch {
        useAuthStore.getState().clearAuth();
        drainQueue(null);
        return Promise.reject(error);

      } finally {
        isRefreshing = false;
      }
    },
  );
}
