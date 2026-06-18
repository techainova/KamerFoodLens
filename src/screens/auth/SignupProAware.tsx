import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, TextInput, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import LangSwitch from '@/components/auth/LangSwitch';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'SignupProAware'>;

export default function SignupProAware({ navigation }: Props) {
  const C = useColors();
  const { t } = useTranslation();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [accepted, setAccepted] = useState(true);
  const [isBusiness, setIsBusiness] = useState(false);

  const handleSignup = () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      Alert.alert(t('auth.missingFieldsTitle'), t('auth.missingFieldsMsg'));
      return;
    }
    if (!accepted) {
      Alert.alert(t('auth.acceptTermsRequired'));
      return;
    }
    navigation.navigate('OTP', { email, isBusiness });
  };

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

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }} keyboardShouldPersistTaps="handled">

        {/* Progress 1/2 */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 18 }}>
          <View style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: C.primary }} />
          <View style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: C.border }} />
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
                placeholderTextColor={C.inkMute}
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
                placeholderTextColor={C.inkMute}
              />
            </View>
          </View>

          {/* Email */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkSoft, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {t('auth.email')}
            </Text>
            <View style={{ height: 48, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 }}>
              <Icon name="Mail" size={16} color={C.inkMute} />
              <TextInput
                style={{ flex: 1, fontSize: 14, color: C.ink }}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="amah@example.com"
                placeholderTextColor={C.inkMute}
              />
            </View>
          </View>

          {/* Phone */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkSoft, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {t('auth.phone')}
            </Text>
            <View style={{ height: 48, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 }}>
              <Icon name="Smartphone" size={16} color={C.inkMute} />
              <TextInput
                style={{ flex: 1, fontSize: 14, color: C.ink }}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                placeholder="+237 6XX XX XX XX"
                placeholderTextColor={C.inkMute}
              />
            </View>
          </View>

          {/* Password */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkSoft, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {t('auth.password')}
            </Text>
            <View style={{ height: 48, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 }}>
              <Icon name="Lock" size={16} color={C.inkMute} />
              <TextInput
                style={{ flex: 1, fontSize: 14, color: C.ink }}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPw}
                placeholder="••••••••"
                placeholderTextColor={C.inkMute}
              />
              <TouchableOpacity onPress={() => setShowPw(!showPw)}>
                <Icon name={showPw ? 'EyeOff' : 'Eye'} size={18} color={C.inkMute} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms */}
          <TouchableOpacity
            style={{ flexDirection: 'row', gap: 10, alignItems: 'flex-start', marginTop: 4 }}
            onPress={() => setAccepted(!accepted)}
          >
            <View style={{
              width: 18, height: 18, borderRadius: 4, flexShrink: 0, marginTop: 1,
              backgroundColor: accepted ? C.primary : 'transparent',
              borderWidth: accepted ? 0 : 1, borderColor: C.border,
              alignItems: 'center', justifyContent: 'center',
            }}>
              {accepted && <Icon name="Check" size={11} color="#fff" strokeWidth={3} />}
            </View>
            <Text style={{ flex: 1, fontSize: 12, color: C.inkSoft, lineHeight: 18 }}>
              {t('auth.acceptTerms')}{' '}
              <Text onPress={() => Alert.alert(t('auth.terms'), t('settingsProEntry.terms'))} style={{ color: C.primary, fontWeight: '600' }}>{t('auth.terms')}</Text>
            </Text>
          </TouchableOpacity>

          {/* Business checkbox — élément distinctif de cet écran */}
          <TouchableOpacity
            style={{
              flexDirection: 'row', gap: 10, alignItems: 'flex-start',
              padding: 12, borderRadius: 12,
              borderWidth: 1, borderColor: C.primary,
              backgroundColor: C.goldSoft,
            }}
            onPress={() => setIsBusiness(!isBusiness)}
            activeOpacity={0.85}
          >
            <View style={{
              width: 20, height: 20, borderRadius: 4, flexShrink: 0,
              borderWidth: 1.5, borderColor: C.primary,
              backgroundColor: isBusiness ? C.primary : C.surface,
              alignItems: 'center', justifyContent: 'center',
            }}>
              {isBusiness && <Icon name="Check" size={12} color="#fff" strokeWidth={3} />}
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Icon name="Star" size={13} color={C.gold} fill={C.gold} />
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.primary }}>{t('auth.isBusiness')}</Text>
              </View>
              <Text style={{ fontSize: 11, color: C.inkSoft, marginTop: 2, lineHeight: 17 }}>
                {t('auth.businessDesc')}
              </Text>
            </View>
          </TouchableOpacity>

          {/* CTA */}
          <TouchableOpacity
            style={{ height: 56, backgroundColor: C.primary, borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginTop: 6 }}
            onPress={handleSignup}
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
