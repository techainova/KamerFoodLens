import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/auth.store';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'OTP'>;

const DEMO_DIGITS = ['2', '4', '8', '', '', ''];

export default function OTP({ navigation, route }: Props) {
    const C = useColors();
  const { t } = useTranslation();
  const [digits] = useState(DEMO_DIGITS);
  const [seconds, setSeconds] = useState(59);
  const setUser = useAuthStore((s) => s.setUser);
  const email = route.params?.email ?? 'am***@gmail.com';
  const isBusiness = route.params?.isBusiness ?? false;

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  function handleVerify() {
    setUser({ id: '1', email, firstName: 'Amah', lastName: 'Ndzié', username: 'amah.n', role: isBusiness ? 'pro' : 'standard', xpPoints: 1250, level: 2 });
  }

  const maskedEmail = email.includes('@')
    ? email.slice(0, 2) + '***@' + email.split('@')[1]
    : 'am***@gmail.com';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>

      {/* Back button */}
      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <TouchableOpacity
          style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: C.inkSoft, fontSize: 20, lineHeight: 24 }}>‹</Text>
        </TouchableOpacity>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 32, paddingTop: 20, alignItems: 'center' }}>

        {/* Envelope illustration */}
        <View style={{ width: 120, height: 120, position: 'relative' }}>
          <View style={{
            width: 120, height: 120, borderRadius: 16,
            borderWidth: 2, borderColor: C.border,
            backgroundColor: C.surface2,
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="Mail" size={48} color="#6D4C41" />
          </View>
          {/* Check badge */}
          <View style={{
            position: 'absolute', bottom: -8, right: -8,
            width: 36, height: 36, borderRadius: 18,
            backgroundColor: C.success,
            alignItems: 'center', justifyContent: 'center',
            borderWidth: 2, borderColor: C.cream,
          }}>
            <Icon name="Check" size={18} color="#fff" strokeWidth={2.5} />
          </View>
        </View>

        {/* Title */}
        <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontWeight: '700', fontSize: 24, color: C.ink, marginTop: 24, textAlign: 'center' }}>
          {t('auth.verifyEmail')}
        </Text>

        {/* Description */}
        <Text style={{ fontSize: 13, color: C.inkSoft, marginTop: 14, textAlign: 'center', lineHeight: 22 }}>
          {t('auth.codeSentTo')}{' '}
          <Text style={{ fontWeight: '600', color: C.ink }}>{maskedEmail}</Text>
        </Text>

        {/* OTP boxes */}
        <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 28 }}>
          {digits.map((d, i) => (
            <View
              key={i}
              style={{
                width: 44, height: 56, borderRadius: 10,
                borderWidth: 1.5,
                borderColor: i === 3 ? C.primary : C.border,
                backgroundColor: C.surface,
                alignItems: 'center', justifyContent: 'center',
                shadowColor: i === 3 ? C.primary : "transparent",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: i === 3 ? 0.2 : 0,
                shadowRadius: 6,
                elevation: i === 3 ? 2 : 0,
              }}
            >
              <Text style={{ fontSize: 22, fontWeight: '600', color: C.ink }}>{d}</Text>
            </View>
          ))}
        </View>

        {/* Resend timer */}
        <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 22, textAlign: 'center' }}>
          {seconds > 0
            ? t('auth.resendIn', { time: `0:${seconds.toString().padStart(2, '0')}` })
            : <Text style={{ color: C.primary, fontWeight: "600" }}>{t("auth.resendCode")}</Text>
          }
        </Text>

      </View>

      {/* Bottom actions */}
      <View style={{ position: 'absolute', bottom: 28, left: 24, right: 24 }}>
        <TouchableOpacity
          style={{ height: 56, backgroundColor: C.primary, borderRadius: 28, alignItems: 'center', justifyContent: 'center' }}
          onPress={handleVerify}
          activeOpacity={0.85}
        >
          <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>
            {t('auth.verify')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 14, alignItems: 'center' }} onPress={() => navigation.goBack()}>
          <Text style={{ color: C.inkMute, fontSize: 12 }}>
            {t('auth.changeEmail')}
          </Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
}
