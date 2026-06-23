import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import LangSwitch from '@/components/auth/LangSwitch';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

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

  const pwStrength = password.length >= 12 ? 4 : password.length >= 8 ? 3 : password.length >= 4 ? 2 : password.length > 0 ? 1 : 0;

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
                placeholder="Amah"
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
                placeholder="Ndongo"
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
                placeholder="amah@example.com"
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
