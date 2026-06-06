// src/i18n/index.ts
// Configuration i18next — détection langue + chargement des traductions

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './fr.json';
import en from './en.json';

export const LANGUAGES = {
  fr: { label: 'Français', flag: '🇫🇷' },
  en: { label: 'English',  flag: '🇬🇧' },
} as const;

export type Language = keyof typeof LANGUAGES;

export const DEFAULT_LANGUAGE: Language = 'fr';

const resources = {
  fr: { translation: fr },
  en: { translation: en },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng:           DEFAULT_LANGUAGE,
    fallbackLng:   DEFAULT_LANGUAGE,
    interpolation: { escapeValue: false },
    compatibilityJSON: 'v4',
  });

export default i18n;