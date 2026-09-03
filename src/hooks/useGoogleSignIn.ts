// src/hooks/useGoogleSignIn.ts
// Native (Android/iOS) implementation using expo-auth-session's Google provider —
// opens a system browser to Google's consent screen (PKCE, no client secret needed
// on-device) and returns an ID token the same shape as the web flow expects.
// Requires a native rebuild (expo prebuild / eas build / expo run:android|ios) — it
// won't pick up EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID / EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID
// or the "kfl://" redirect scheme in Expo Go or an already-built dev client.
import { useRef } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession();

const ANDROID_CLIENT_ID = (process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID as string | undefined) ?? '';
const IOS_CLIENT_ID = (process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID as string | undefined) ?? '';

export function useGoogleSignIn(onCredential: (idToken: string) => void): { promptGoogleSignIn: () => Promise<void> } {
  const callbackRef = useRef(onCredential);
  callbackRef.current = onCredential;

  const [request, , promptAsync] = Google.useIdTokenAuthRequest({
    androidClientId: ANDROID_CLIENT_ID || undefined,
    iosClientId: IOS_CLIENT_ID || undefined,
  });

  const promptGoogleSignIn = async (): Promise<void> => {
    if (!ANDROID_CLIENT_ID && !IOS_CLIENT_ID) {
      throw new Error('EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID / EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID manquants — voir .env.example');
    }
    if (!request) {
      throw new Error('Google Sign-In pas encore prêt, réessayez dans un instant');
    }

    const result = await promptAsync();
    if (result.type === 'success' && result.params.id_token) {
      callbackRef.current(result.params.id_token);
    } else if (result.type === 'error') {
      throw new Error(result.error?.message ?? 'Échec de la connexion Google');
    }
    // 'cancel' / 'dismiss' / 'locked' / 'opened' — l'utilisateur a fermé la fenêtre, rien à faire.
  };

  return { promptGoogleSignIn };
}
