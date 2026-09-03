import React, { useState } from 'react';
import {
  View, TouchableOpacity, ScrollView, TextInput, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import LangSwitch from '@/components/auth/LangSwitch';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { authService } from '@/services/auth.service';
import { isNetworkError } from '@/utils/apiError';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export default function Signup({ navigation }: Props) {
    const C = useColors();
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [accepted, setAccepted] = useState(true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const pwStrength = password.length >= 12 ? 4 : password.length >= 8 ? 3 : password.length >= 4 ? 2 : password.length > 0 ? 1 : 0;

  async function handleSignup() {
    setError('');
    if (!firstName.trim() || !lastName.trim()) { setError(t('auth.firstLastNameRequired', 'Prénom et nom requis.')); return; }
    if (!email.includes('@')) { setError(t('auth.invalidEmail', 'Email invalide.')); return; }
    if (password.length < 8) { setError(t('auth.passwordTooShort8', 'Mot de passe minimum 8 caractères.')); return; }
    if (password !== confirm) { setError(t('auth.passwordsNoMatch', 'Les mots de passe ne correspondent pas.')); return; }
    if (!accepted) { setError(t('auth.mustAcceptTerms', 'Veuillez accepter les CGU.')); return; }
    setLoading(true);
    try {
      await authService.signup({ firstName, lastName, email: email.toLowerCase().trim(), phone, password });
      navigation.navigate('OTP', { email: email.toLowerCase().trim() });
    } catch (err) {
      if (__DEV__) {
        console.warn('[KFL][Signup] échec de l\'inscription :', err);
      }
      if (isNetworkError(err)) {
        setError(t('auth.networkError', 'Impossible de joindre le serveur. Vérifiez votre connexion.'));
      } else {
        setError(t('auth.signupFailed', 'Erreur lors de l\'inscription. Cet email est peut-être déjà utilisé.'));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      {/* AppBar */}
      <View style={{ height: 52, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        <TouchableOpacity
          style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: C.inkSoft, fontSize: 18, lineHeight: 22 }}>‹</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: C.ink, fontFamily: 'Inter-SemiBold' }}>
            {t('auth.createAccount')}
          </Text>
        </View>
        <LangSwitch />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 48 }} keyboardShouldPersistTaps="handled">

        {/* Progress bar 1/2 */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <View style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: '#E8591A' }} />
          <View style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: '#E5E0D8' }} />
          <Text style={{ fontSize: 11, color: C.inkMute, fontWeight: '600' }}>1/2</Text>
        </View>

        <View style={{ gap: 14 }}>
          {/* First + Last */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkSoft, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {t('auth.firstName')}
              </Text>
              <TextInput
                style={{ height: 48, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, paddingHorizontal: 14, fontSize: 14, color: C.ink }}
                value={firstName}
                onChangeText={setFirstName}
                placeholder={t('auth.firstName')}
                placeholderTextColor="#8C8278"
              />
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkSoft, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {t('auth.lastName')}
              </Text>
              <TextInput
                style={{ height: 48, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, paddingHorizontal: 14, fontSize: 14, color: C.ink }}
                value={lastName}
                onChangeText={setLastName}
                placeholder={t('auth.lastName')}
                placeholderTextColor="#8C8278"
              />
            </View>
          </View>

          {/* Email */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkSoft, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {t('auth.email')}
            </Text>
            <View style={{ height: 48, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 }}>
              <Icon name="Mail" size={16} color="#8C8278" />
              <TextInput
                style={{ flex: 1, fontSize: 14, color: C.ink }}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder={t('auth.emailPlaceholder', 'vous@example.com')}
                placeholderTextColor="#8C8278"
              />
            </View>
          </View>

          {/* Phone */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkSoft, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {t('auth.phone')}
            </Text>
            <View style={{ height: 48, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 }}>
              <Icon name="Smartphone" size={16} color="#8C8278" />
              <TextInput
                style={{ flex: 1, fontSize: 14, color: C.ink }}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="+237 6XX XX XX XX"
                placeholderTextColor="#8C8278"
              />
            </View>
          </View>

          {/* Password */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkSoft, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {t('auth.password')}
            </Text>
            <View style={{ height: 48, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 }}>
              <Icon name="Lock" size={16} color="#8C8278" />
              <TextInput
                style={{ flex: 1, fontSize: 14, color: C.ink }}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPw}
                placeholder="••••••••"
                placeholderTextColor="#8C8278"
              />
              <TouchableOpacity onPress={() => setShowPw(!showPw)}>
                <Icon name={showPw ? 'EyeOff' : 'Eye'} size={18} color="#8C8278" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Password strength */}
          <View>
            <View style={{ flexDirection: 'row', gap: 4, height: 4 }}>
              {[0, 1, 2, 3].map(i => (
                <View key={i} style={{ flex: 1, borderRadius: 2, backgroundColor: i < pwStrength ? '#E8591A' : '#E5E0D8' }} />
              ))}
            </View>
            <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 4 }}>
              {t('auth.pwStrengthMedium')}
            </Text>
          </View>

          {/* Confirm */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkSoft, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {t('auth.confirmPassword')}
            </Text>
            <View style={{ height: 48, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 }}>
              <Icon name="Lock" size={16} color="#8C8278" />
              <TextInput
                style={{ flex: 1, fontSize: 14, color: C.ink }}
                value={confirm}
                onChangeText={setConfirm}
                secureTextEntry
                placeholder="••••••••"
                placeholderTextColor="#8C8278"
              />
            </View>
          </View>

          {/* Terms */}
          <TouchableOpacity
            style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginTop: 4 }}
            onPress={() => setAccepted(!accepted)}
          >
            <View style={{
              width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
              backgroundColor: accepted ? '#E8591A' : 'transparent',
              borderWidth: accepted ? 0 : 1, borderColor: C.border,
              alignItems: 'center', justifyContent: 'center',
            }}>
              {accepted && <Icon name="Check" size={11} color="#fff" strokeWidth={3} />}
            </View>
            <Text style={{ flex: 1, fontSize: 12, color: C.inkSoft, lineHeight: 18 }}>
              {t('auth.acceptTerms')}{' '}
              <Text style={{ color: '#E8591A', fontWeight: '600' }}>{t('auth.terms')}</Text>
              {' '}{t('auth.andThe')}{' '}
              <Text style={{ color: '#E8591A', fontWeight: '600' }}>{t('auth.policy')}</Text>
            </Text>
          </TouchableOpacity>

          {/* Erreur */}
          {error.length > 0 && (
            <View style={{ backgroundColor: '#FBDCDC', borderRadius: 10, padding: 10, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Icon name="AlertCircle" size={15} color="#C62828" />
              <Text style={{ fontSize: 13, color: '#C62828', flex: 1 }}>{error}</Text>
            </View>
          )}

          {/* CTA */}
          <TouchableOpacity
            style={{ height: 56, backgroundColor: '#E8591A', borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginTop: 6 }}
            onPress={handleSignup}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>
                  {t('auth.signup')}
                </Text>
            }
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
