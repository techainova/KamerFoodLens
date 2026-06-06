// src/hooks/useSignup.ts
// Logique inscription — validation formulaire + appel API

import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParams } from '@/navigation/types';
import apiClient from '@/services/api.client';
import { ENDPOINTS } from '@/services/config';

type Nav = NativeStackNavigationProp<AuthStackParams, 'Signup'>;

interface SignupForm {
  firstName:       string;
  lastName:        string;
  email:           string;
  phone:           string;
  password:        string;
  confirmPassword: string;
  acceptTerms:     boolean;
}

interface SignupErrors {
  firstName?:       string;
  lastName?:        string;
  email?:           string;
  phone?:           string;
  password?:        string;
  confirmPassword?: string;
  acceptTerms?:     string;
  general?:         string;
}

export function useSignup() {
  const navigation = useNavigation<Nav>();

  const [form, setForm] = useState<SignupForm>({
    firstName: '', lastName: '', email: '',
    phone: '', password: '', confirmPassword: '', acceptTerms: false,
  });
  const [errors, setErrors]   = useState<SignupErrors>({});
  const [loading, setLoading] = useState(false);
  const [step, setStep]       = useState<1 | 2>(1); // étape 1 ou 2

  function updateField(field: keyof SignupForm, value: string | boolean) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined, general: undefined }));
  }

  function passwordStrength(): 'weak' | 'medium' | 'strong' {
    const p = form.password;
    if (p.length < 6) return 'weak';
    if (p.length >= 8 && /\d/.test(p)) return 'medium';
    if (p.length >= 10 && /\d/.test(p) && /[A-Z]/.test(p)) return 'strong';
    return 'medium';
  }

  function validateStep1(): boolean {
    const e: SignupErrors = {};
    if (!form.firstName.trim()) e.firstName = 'Prénom requis';
    if (!form.lastName.trim())  e.lastName  = 'Nom requis';
    if (!form.email.includes('@')) e.email  = 'Email invalide';
    if (!form.phone.startsWith('+237')) e.phone = 'Format : +237 6XX XX XX XX';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function validateStep2(): boolean {
    const e: SignupErrors = {};
    if (form.password.length < 8)                    e.password        = 'Minimum 8 caractères';
    if (form.password !== form.confirmPassword)       e.confirmPassword = 'Mots de passe différents';
    if (!form.acceptTerms)                            e.acceptTerms     = 'Acceptez les CGU';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function nextStep() {
    if (step === 1 && validateStep1()) setStep(2);
  }

  async function submit() {
    if (!validateStep2()) return;
    setLoading(true);
    try {
      await apiClient.post(ENDPOINTS.SIGNUP, {
        firstName: form.firstName,
        lastName:  form.lastName,
        email:     form.email,
        phone:     form.phone,
        password:  form.password,
      });
      navigation.replace('OTP', { email: form.email });
    } catch (err: any) {
      setErrors({ general: err?.response?.data?.message ?? 'Inscription échouée' });
    } finally {
      setLoading(false);
    }
  }

  function goLogin() { navigation.navigate('Login'); }

  return { form, errors, loading, step, passwordStrength, updateField, nextStep, submit, goLogin };
}
