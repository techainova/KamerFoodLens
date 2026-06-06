// src/hooks/useOnboarding.ts
// Logique slides onboarding — navigation entre slides + skip

import { useRef, useState } from 'react';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { AuthStackParams } from '@/navigation/types';

type Nav = NativeStackNavigationProp<AuthStackParams, 'Onboarding'>;

export interface OnboardingSlide {
  id:          string;
  emoji:       string;
  titleFR:     string;
  titleEN:     string;
  descFR:      string;
  descEN:      string;
}

export const SLIDES: OnboardingSlide[] = [
  {
    id:      '1',
    emoji:   '📷',
    titleFR: 'Identifiez vos plats',
    titleEN: 'Identify your dishes',
    descFR:  'Scannez n\'importe quel plat camerounais en 2 secondes',
    descEN:  'Scan any Cameroonian dish in 2 seconds',
  },
  {
    id:      '2',
    emoji:   '🗺️',
    titleFR: 'Trouvez & Partagez',
    titleEN: 'Find & Share',
    descFR:  'Localisez les restaurants autour de vous, partagez vos découvertes culinaires avec une communauté passionnée.',
    descEN:  'Locate nearby restaurants, share your culinary discoveries with the community.',
  },
  {
    id:      '3',
    emoji:   '🎓',
    titleFR: 'Apprenez & Jouez',
    titleEN: 'Learn & Play',
    descFR:  'Formations de chefs, quiz culinaire, tombola mensuelle',
    descEN:  'Chef courses, culinary quiz, monthly lottery',
  },
];

export function useOnboarding() {
  const navigation   = useNavigation<Nav>();
  const flatListRef  = useRef<FlatList>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function goNext() {
    if (activeIndex < SLIDES.length - 1) {
      const next = activeIndex + 1;
      flatListRef.current?.scrollToIndex({ index: next });
      setActiveIndex(next);
    } else {
      navigation.replace('Login');
    }
  }

  function goPrev() {
    if (activeIndex > 0) {
      const prev = activeIndex - 1;
      flatListRef.current?.scrollToIndex({ index: prev });
      setActiveIndex(prev);
    }
  }

  function skip() {
    navigation.replace('Login');
  }

  function onScrollEnd(index: number) {
    setActiveIndex(index);
  }

  const isLast = activeIndex === SLIDES.length - 1;

  return { flatListRef, activeIndex, isLast, goNext, goPrev, skip, onScrollEnd };
}
