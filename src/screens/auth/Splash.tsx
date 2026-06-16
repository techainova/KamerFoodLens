import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import LangSwitch from '@/components/auth/LangSwitch';
import KFLLogo from '@/components/ui/KFLLogo';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function Splash({ navigation }: Props) {
  const { t } = useTranslation();

  return (
    <View style={{ flex: 1, backgroundColor: '#14110E' }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background food photo placeholder */}
      <View style={{ position: 'absolute', inset: 0, backgroundColor: '#3A2A20' }} />

      {/* Real gradient overlay */}
      <LinearGradient
        colors={['rgba(20,17,14,0.45)', 'rgba(20,17,14,0.92)']}
        locations={[0, 1]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 60, paddingBottom: 48, justifyContent: 'space-between' }}>

          {/* Lang switch */}
          <View style={{ alignSelf: 'flex-end' }}>
            <LangSwitch dark />
          </View>

          {/* Logo + tagline */}
          <View style={{ alignItems: 'center', gap: 24 }}>
            <KFLLogo size={96} />
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontWeight: '700', fontSize: 28, color: '#fff', textAlign: 'center', lineHeight: 33 }}>
                KmerFoodLens
              </Text>
              <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: 12, lineHeight: 21 }}>
                {t('common.tagline')}
              </Text>
            </View>
          </View>

          {/* CTA */}
          <TouchableOpacity
            style={{ backgroundColor: '#E8591A', height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => navigation.navigate('Onboarding')}
            activeOpacity={0.85}
          >
            <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Inter-SemiBold', fontWeight: '600' }}>
              {t('onboarding.getStarted')}
            </Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    </View>
  );
}
