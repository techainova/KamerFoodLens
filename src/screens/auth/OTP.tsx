import React, { useState, useEffect, useRef } from 'react';
import {
  View, TouchableOpacity, TextInput, Pressable, Alert,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/auth.store';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

type Props = NativeStackScreenProps<RootStackParamList, 'OTP'>;

const CODE_LENGTH = 6;

export default function OTP({ navigation, route }: Props) {
    const C = useColors();
  const { t } = useTranslation();
  const [code, setCode] = useState('');
  const [seconds, setSeconds] = useState(59);
  const setUser = useAuthStore((s) => s.setUser);
  const inputRef = useRef<TextInput>(null);
  const email = route.params?.email ?? 'am***@gmail.com';
  const isBusiness = route.params?.isBusiness ?? false;

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds(s => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  function handleVerify() {
    if (code.length < CODE_LENGTH) {
      Alert.alert(t('auth.otpIncompleteTitle', 'Code incomplet'), t('auth.otpIncompleteMsg', 'Veuillez saisir les 6 chiffres reçus par email.'));
      return;
    }
    setUser({ id: '1', email, firstName: 'Amah', lastName: 'Ndzié', username: 'amah.n', location: 'Yaoundé, Cameroun', bio: "Passionnée de cuisine traditionnelle. J'apprends, je partage, je teste tout ce qui se mijote au Cameroun.", role: isBusiness ? 'pro' : 'standard', xpPoints: 1250, level: 2 });
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

        {/* OTP boxes — tap anywhere on the row to open the keyboard */}
        <Pressable onPress={() => inputRef.current?.focus()} style={{ width: '100%' }}>
          <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 28 }}>
            {Array.from({ length: CODE_LENGTH }).map((_, i) => {
              const isCursor = i === code.length;
              return (
                <View
                  key={i}
                  style={{
                    width: 44, height: 56, borderRadius: 10,
                    borderWidth: 1.5,
                    borderColor: isCursor ? C.primary : C.border,
                    backgroundColor: C.surface,
                    alignItems: 'center', justifyContent: 'center',
                    shadowColor: isCursor ? C.primary : "transparent",
                    shadowOffset: { width: 0, height: 0 },
                    shadowOpacity: isCursor ? 0.2 : 0,
                    shadowRadius: 6,
                    elevation: isCursor ? 2 : 0,
                  }}
                >
                  <Text style={{ fontSize: 22, fontWeight: '600', color: C.ink }}>{code[i] ?? ''}</Text>
                </View>
              );
            })}
          </View>
          {/* Real input driving the boxes above — invisible but focusable/typable */}
          <TextInput
            ref={inputRef}
            value={code}
            onChangeText={(v) => setCode(v.replace(/\D/g, '').slice(0, CODE_LENGTH))}
            keyboardType="number-pad"
            maxLength={CODE_LENGTH}
            autoFocus
            caretHidden
            style={{ position: 'absolute', opacity: 0, height: 56, width: '100%' }}
          />
        </Pressable>

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
