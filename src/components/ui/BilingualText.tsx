// src/components/ui/BilingualText.tsx
// Affiche le texte dans la langue active (FR ou EN)

import React from 'react';
import {
  TextStyle,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { useTranslation } from 'react-i18next';

interface Props {
  fr:    string;
  en:    string;
  style?: TextStyle | TextStyle[];
}

export function BilingualText({ fr, en, style }: Props) {
  const { i18n } = useTranslation();
  const text = i18n.language === 'fr' ? fr : en;
  return <Text style={style}>{text}</Text>;
}
