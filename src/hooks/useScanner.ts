// src/hooks/useScanner.ts
// Logique scanner IA — caméra + upload chiffré + résultat

import { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ScannerStackParams } from '@/navigation/types';
import { useAuthStore } from '@/store/auth.store';
import apiClient from '@/services/api.client';
import { ENDPOINTS } from '@/services/config';
import { encrypt, deriveKey, addTimestamp } from '@/crypto';

type Nav = NativeStackNavigationProp<ScannerStackParams, 'Camera'>;

export type ScanMode = 'photo' | 'audio' | 'text';
export type ScanStatus = 'idle' | 'capturing' | 'analyzing' | 'done' | 'error';

export function useScanner() {
  const navigation  = useNavigation<Nav>();
  const { accessToken } = useAuthStore();

  const [mode, setMode]     = useState<ScanMode>('photo');
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [error, setError]   = useState<string>('');

  async function scanImage(base64Image: string) {
    if (!base64Image) return;
    setStatus('analyzing');
    setError('');

    try {
      // Chiffrement AES-256-GCM avant envoi
      const key     = await deriveKey(accessToken ?? 'anonymous');
      const rid     = Math.random().toString(36).slice(2);
      const payload = addTimestamp({ image: base64Image, mode: 'photo' });
      const encrypted = await encrypt(payload, key, rid);

      const { data } = await apiClient.post(ENDPOINTS.SCAN_IMAGE, encrypted);
      setStatus('done');
      navigation.navigate('Result', { scanId: data.scanId });
    } catch (err) {
      setStatus('error');
      setError('Analyse échouée. Réessayez.');
    }
  }

  async function scanAudioText(text: string) {
    if (!text.trim()) return;
    setStatus('analyzing');

    try {
      const key     = await deriveKey(accessToken ?? 'anonymous');
      const rid     = Math.random().toString(36).slice(2);
      const payload = addTimestamp({ description: text, mode: 'text' });
      const encrypted = await encrypt(payload, key, rid);

      const { data } = await apiClient.post(ENDPOINTS.SCAN_TEXT, encrypted);
      setStatus('done');
      navigation.navigate('Result', { scanId: data.scanId });
    } catch {
      setStatus('error');
      setError('Analyse échouée. Réessayez.');
    }
  }

  function reset() {
    setStatus('idle');
    setError('');
  }

  return { mode, status, error, setMode, scanImage, scanAudioText, reset };
}
