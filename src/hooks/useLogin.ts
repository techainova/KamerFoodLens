// src/hooks/useLogin.ts
// Logique connexion — validation + appel API + stockage JWT

// src/hooks/useLogin.ts
// Logique connexion — mock pour dev + API pour prod

import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParams } from '@/navigation/types';
import { useAuthStore } from '@/store/auth.store';
import { loginMock } from '@/services/mock.auth';

type Nav = NativeStackNavigationProp<AuthStackParams, 'Login'>;

interface LoginForm   { email: string; password: string; }
interface LoginErrors { email?: string; password?: string; general?: string; }

// Identifiants de test
const MOCK_EMAIL    = 'amah@kmerfoodlens.com';
const MOCK_PASSWORD = 'test1234';

export function useLogin() {
  const navigation = useNavigation<Nav>();
  const [form, setForm]       = useState<LoginForm>({ email: MOCK_EMAIL, password: MOCK_PASSWORD });
  const [errors, setErrors]   = useState<LoginErrors>({});
  const [loading, setLoading] = useState(false);

  function updateField(field: keyof LoginForm, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
    setErrors((p) => ({ ...p, [field]: undefined, general: undefined }));
  }

  function validate(): boolean {
    const e: LoginErrors = {};
    if (!form.email.includes('@'))  e.email    = 'Email invalide';
    if (form.password.length < 6)   e.password = 'Mot de passe trop court';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function submit() {
    if (!validate()) return;
    setLoading(true);
    try {
      // MODE MOCK — connexion instantanée
      if (form.email === MOCK_EMAIL && form.password === MOCK_PASSWORD) {
        await new Promise((r) => setTimeout(r, 800)); // simule latence
        loginMock();
        return;
      }
      // TODO : remplacer par appel API réel en production
      setErrors({ general: 'Utilisez amah@kmerfoodlens.com / test1234 pour tester' });
    } catch {
      setErrors({ general: 'Connexion échouée' });
    } finally {
      setLoading(false);
    }
  }

  function goSignup()         { navigation.navigate('Signup'); }
  function goForgotPassword() { /* Phase 5 */ }

  return { form, errors, loading, updateField, submit, goSignup, goForgotPassword };
}
