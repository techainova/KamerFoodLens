import React, { useEffect, useRef } from 'react';
import {
  View, Animated, StatusBar,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { useGuestStore } from '@/store/guest.store';
import { resetToRoute } from '@/navigation/navigationRef';
import LangSwitch from '@/components/auth/LangSwitch';
import KFLLogo from '@/components/ui/KFLLogo';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

const SPLASH_DURATION_MS = 1600;

export default function Splash(_props: Props) {
  const { t } = useTranslation();
  const hasSeenOnboarding = useGuestStore((s) => s.hasSeenOnboarding);
  const loadingBar = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const anim = Animated.timing(loadingBar, { toValue: 1, duration: SPLASH_DURATION_MS, useNativeDriver: false });
    anim.start();

    // Écran de marque uniquement — jamais de geste requis pour continuer, on
    // atterrit directement sur l'accueil pour un utilisateur déjà onboardé.
    const timer = setTimeout(() => {
      resetToRoute(hasSeenOnboarding ? 'App' : 'Onboarding');
    }, SPLASH_DURATION_MS);

    return () => { anim.stop(); clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- ne doit se déclencher qu'au montage
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: '#14110E' }}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={{ position: 'absolute', inset: 0, backgroundColor: '#3A2A20' }} />

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

          {/* Trait de chargement fin — progresse pendant le court affichage de marque */}
          <View style={{ height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
            <Animated.View
              style={{
                height: 3, borderRadius: 2, backgroundColor: '#E8591A',
                width: loadingBar.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }),
              }}
            />
          </View>

        </View>
      </SafeAreaView>
    </View>
  );
}
