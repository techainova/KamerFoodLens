import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, TextInput } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import LangSwitch from '@/components/auth/LangSwitch';
import Icon from '@/components/ui/Icon';

type Props = NativeStackScreenProps<RootStackParamList, 'Signup'>;

export default function Signup({ navigation }: Props) {
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [accepted, setAccepted] = useState(true);

  const pwStrength = password.length >= 12 ? 4 : password.length >= 8 ? 3 : password.length >= 4 ? 2 : password.length > 0 ? 1 : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      {/* AppBar */}
      <View style={{ height: 52, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, borderBottomWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff' }}>
        <TouchableOpacity
          style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: '#6D4C41', fontSize: 18, lineHeight: 22 }}>‹</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: '#2C1810', fontFamily: 'Inter-SemiBold' }}>
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
          <Text style={{ fontSize: 11, color: '#8C8278', fontWeight: '600' }}>1/2</Text>
        </View>

        <View style={{ gap: 14 }}>
          {/* First + Last */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: '#6D4C41', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {t('auth.firstName')}
              </Text>
              <TextInput
                style={{ height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff', paddingHorizontal: 14, fontSize: 14, color: '#2C1810' }}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="Amah"
                placeholderTextColor="#8C8278"
              />
            </View>
            <View style={{ flex: 1, gap: 6 }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: '#6D4C41', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {t('auth.lastName')}
              </Text>
              <TextInput
                style={{ height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff', paddingHorizontal: 14, fontSize: 14, color: '#2C1810' }}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Ndongo"
                placeholderTextColor="#8C8278"
              />
            </View>
          </View>

          {/* Email */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#6D4C41', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {t('auth.email')}
            </Text>
            <View style={{ height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 }}>
              <Text style={{ color: '#8C8278', fontSize: 16 }}>✉</Text>
              <TextInput
                style={{ flex: 1, fontSize: 14, color: '#2C1810' }}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="amah@example.com"
                placeholderTextColor="#8C8278"
              />
            </View>
          </View>

          {/* Phone */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#6D4C41', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {t('auth.phone')}
            </Text>
            <View style={{ height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 }}>
              <Text style={{ color: '#8C8278', fontSize: 14 }}>📱</Text>
              <TextInput
                style={{ flex: 1, fontSize: 14, color: '#2C1810' }}
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
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#6D4C41', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {t('auth.password')}
            </Text>
            <View style={{ height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 }}>
              <Text style={{ color: '#8C8278', fontSize: 16 }}>🔒</Text>
              <TextInput
                style={{ flex: 1, fontSize: 14, color: '#2C1810' }}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPw}
                placeholder="••••••••"
                placeholderTextColor="#8C8278"
              />
              <TouchableOpacity onPress={() => setShowPw(!showPw)}>
                <Text style={{ color: '#8C8278', fontSize: 16 }}>{showPw ? '🙈' : '👁'}</Text>
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
            <Text style={{ fontSize: 11, color: '#8C8278', marginTop: 4 }}>
              {t('auth.pwStrengthMedium')}
            </Text>
          </View>

          {/* Confirm */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#6D4C41', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {t('auth.confirmPassword')}
            </Text>
            <View style={{ height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 }}>
              <Text style={{ color: '#8C8278', fontSize: 16 }}>🔒</Text>
              <TextInput
                style={{ flex: 1, fontSize: 14, color: '#2C1810' }}
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
              borderWidth: accepted ? 0 : 1, borderColor: '#E5E0D8',
              alignItems: 'center', justifyContent: 'center',
            }}>
              {accepted && <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>✓</Text>}
            </View>
            <Text style={{ flex: 1, fontSize: 12, color: '#6D4C41', lineHeight: 18 }}>
              {t('auth.acceptTerms')}{' '}
              <Text style={{ color: '#E8591A', fontWeight: '600' }}>{t('auth.terms')}</Text>
              {' '}{t('auth.andThe')}{' '}
              <Text style={{ color: '#E8591A', fontWeight: '600' }}>{t('auth.policy')}</Text>
            </Text>
          </TouchableOpacity>

          {/* CTA */}
          <TouchableOpacity
            style={{ height: 56, backgroundColor: '#E8591A', borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginTop: 6 }}
            onPress={() => navigation.navigate('OTP', { email })}
            activeOpacity={0.85}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>
              {t('auth.signup')}
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
