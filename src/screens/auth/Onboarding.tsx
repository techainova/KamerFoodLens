import React, { useState } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

const SLIDE_KEYS = ['slide1', 'slide2', 'slide3'] as const;

export default function Onboarding({ navigation }: Props) {
  const { t } = useTranslation();
  const [current, setCurrent] = useState(0);

  const next = () => {
    if (current < SLIDE_KEYS.length - 1) setCurrent(current + 1);
    else navigation.navigate('Login');
  };
  const prev = () => { if (current > 0) setCurrent(current - 1); };

  const slideKey = SLIDE_KEYS[current];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>

      {/* Top bar — logo + skip */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 24, height: 24, borderRadius: 12, borderWidth: 1, borderColor: '#2C1810', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 10, color: '#2C1810', fontWeight: '700' }}>K</Text>
          </View>
          <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 13, color: '#2C1810', fontWeight: '700' }}>KmerFoodLens</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={{ fontSize: 13, color: '#8C8278', fontWeight: '500' }}>
            {t('common.skip')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Illustration slot */}
      <View style={{ marginHorizontal: 32, marginTop: 24 }}>
        <View style={{
          height: 300, borderRadius: 20,
          backgroundColor: '#F5F0EB',
          borderWidth: 1, borderStyle: 'dashed', borderColor: '#E5E0D8',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <Text style={{ fontFamily: 'JetBrainsMono-Regular', fontSize: 11, color: '#8C8278', textAlign: 'center', paddingHorizontal: 16 }}>
            {'[ illustration ]'}
          </Text>
        </View>
      </View>

      {/* Copy */}
      <View style={{ paddingHorizontal: 32, paddingTop: 32, alignItems: 'center' }}>
        <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontWeight: '700', fontSize: 26, color: '#2C1810', textAlign: 'center', lineHeight: 30 }}>
          {t(`onboarding.${slideKey}.title`)}
        </Text>
        <Text style={{ fontSize: 14, color: '#6D4C41', textAlign: 'center', marginTop: 16, lineHeight: 22 }}>
          {t(`onboarding.${slideKey}.description`)}
        </Text>
      </View>

      {/* Dots + nav buttons */}
      <View style={{ position: 'absolute', bottom: 28, left: 0, right: 0, paddingHorizontal: 24 }}>
        {/* Dots */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginBottom: 18 }}>
          {SLIDE_KEYS.map((_, i) => (
            <View key={i} style={{
              height: 6, borderRadius: 3,
              width: i === current ? 22 : 6,
              backgroundColor: i === current ? '#E8591A' : '#E5E0D8',
            }} />
          ))}
        </View>

        {/* Buttons row */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {/* Prev */}
          <TouchableOpacity
            onPress={prev}
            style={{
              width: 48, height: 48, borderRadius: 24,
              borderWidth: 1, borderColor: '#E5E0D8',
              backgroundColor: '#fff',
              alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Text style={{ color: '#6D4C41', fontSize: 20, lineHeight: 24 }}>‹</Text>
          </TouchableOpacity>

          {/* Next */}
          <TouchableOpacity
            onPress={next}
            style={{
              flex: 1, height: 48, borderRadius: 24,
              backgroundColor: '#E8591A',
              alignItems: 'center', justifyContent: 'center',
              flexDirection: 'row', gap: 6,
            }}
            activeOpacity={0.85}
          >
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>
              {current < SLIDE_KEYS.length - 1 ? t('common.next') : t('onboarding.getStarted')}
            </Text>
            <Text style={{ color: '#fff', fontSize: 20, lineHeight: 24 }}>›</Text>
          </TouchableOpacity>
        </View>
      </View>

    </SafeAreaView>
  );
}
