// src/hooks/useOTP.ts
// Logique vérification OTP — saisie + countdown + renvoi + validation

import { useEffect, useRef, useState } from 'react';
import { TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { AuthStackParams } from '@/navigation/types';
import { useAuthStore } from '@/store/auth.store';
import apiClient from '@/services/api.client';
import { ENDPOINTS } from '@/services/config';

type Nav   = NativeStackNavigationProp<AuthStackParams, 'OTP'>;
type Route = RouteProp<AuthStackParams, 'OTP'>;

const CODE_LENGTH  = 4;
const RESEND_DELAY = 59; // secondes

export function useOTP() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { email }  = route.params;
  const { setUser, setTokens } = useAuthStore();

  const [code, setCode]         = useState<string[]>(Array(CODE_LENGTH).fill(''));
  const [error, setError]       = useState<string>('');
  const [loading, setLoading]   = useState(false);
  const [countdown, setCountdown] = useState(RESEND_DELAY);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Countdown renvoi
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  function onChangeDigit(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    setError('');

    // Focus suivant
    if (value && index < CODE_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit si complet
    if (index === CODE_LENGTH - 1 && value) {
      submitCode([...newCode]);
    }
  }

  function onKeyPress(index: number, key: string) {
    if (key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  async function submitCode(digits: string[] = code) {
    const fullCode = digits.join('');
    if (fullCode.length < CODE_LENGTH) return;

    setLoading(true);
    try {
      const { data } = await apiClient.post(ENDPOINTS.OTP_VERIFY, {
        email,
        code: fullCode,
      });
      setUser(data.user);
      setTokens(data.accessToken, data.refreshToken);
    } catch {
      setError('Code invalide. Réessayez.');
      setCode(Array(CODE_LENGTH).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  async function resendCode() {
    if (countdown > 0) return;
    try {
      await apiClient.post('/auth/otp/resend', { email });
      setCountdown(RESEND_DELAY);
      setCode(Array(CODE_LENGTH).fill(''));
      setError('');
      inputRefs.current[0]?.focus();
    } catch {
      setError('Impossible de renvoyer le code.');
    }
  }

  function changeEmail() { navigation.goBack(); }

  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, (_: string, a: string, b: string, c: string) =>
    a + '*'.repeat(Math.min(b.length, 6)) + c,
  );

  return {
    email, maskedEmail, code, error, loading, countdown,
    inputRefs, onChangeDigit, onKeyPress, resendCode, changeEmail,
  };
}
