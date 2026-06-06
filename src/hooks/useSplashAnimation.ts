// src/hooks/useSpashAnimation.ts
// Logique animation écran Splash — fade-in logo + navigation auto

import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParams } from '@/navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParams, 'Splash'>;

export function useSplashAnimation() {
  const navigation = useNavigation<Nav>();
  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    // Fade-in + slide-up du logo
    Animated.parallel([
      Animated.timing(opacity, {
        toValue:         1,
        duration:        800,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue:         0,
        duration:        800,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigation automatique après 2.5s
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return { opacity, translateY };
}
