// src/hooks/useGoogleSignIn.web.ts
// Web implementation using Google Identity Services (GIS) — detects an already
// signed-in Google session in the browser and offers one-tap continue, the same
// UX as "Se connecter avec Google" on most professional web apps.
import { useCallback } from 'react';

interface GoogleCredentialResponse {
  credential: string;
}

interface GoogleIdConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleIdConfig) => void;
          prompt: () => void;
        };
      };
    };
  }
}

const GIS_SCRIPT_ID = 'kfl-google-identity-services';
const GIS_SCRIPT_SRC = 'https://accounts.google.com/gsi/client';
const CLIENT_ID = (process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID as string | undefined) ?? '';

function loadGisScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const existing = document.getElementById(GIS_SCRIPT_ID);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Failed to load Google Identity Services')));
      return;
    }
    const script = document.createElement('script');
    script.id = GIS_SCRIPT_ID;
    script.src = GIS_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'));
    document.head.appendChild(script);
  });
}

// Module-level (not per-component-instance) so google.accounts.id.initialize() is only ever
// called once for the whole app lifetime — calling it again on every sign-in attempt is what
// triggered Google's "initialize() is called multiple times" warning.
let currentCredentialCallback: ((idToken: string) => void) | null = null;
let gisInitialized = false;

function ensureGisInitialized(clientId: string): void {
  if (gisInitialized) return;
  window.google!.accounts.id.initialize({
    client_id: clientId,
    callback: (response) => currentCredentialCallback?.(response.credential),
  });
  gisInitialized = true;
}

export function useGoogleSignIn(onCredential: (idToken: string) => void): { promptGoogleSignIn: () => Promise<void> } {
  currentCredentialCallback = onCredential;

  const promptGoogleSignIn = useCallback(async () => {
    if (!CLIENT_ID) {
      throw new Error('EXPO_PUBLIC_GOOGLE_CLIENT_ID manquant — voir .env.example');
    }
    await loadGisScript();
    ensureGisInitialized(CLIENT_ID);
    window.google!.accounts.id.prompt();
  }, []);

  return { promptGoogleSignIn };
}
