import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import i18n from '@/i18n';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };
const SHADOW_MD = { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 6, elevation: 4 };

const LANGS = [
  { code: 'fr', flagBg: '#E8EAF6', flagText: 'FR', flagColor: '#1A237E', labelKey: 'languagePicker.frenchLabel', subKey: 'languagePicker.frenchSub', regionKey: 'languagePicker.frenchRegion' },
  { code: 'en', flagBg: '#E3F0E4', flagText: 'EN', flagColor: '#2E7D32', labelKey: 'languagePicker.englishLabel', subKey: 'languagePicker.englishSub', regionKey: 'languagePicker.englishRegion' },
] as const;

export default function LanguagePicker() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [selected, setSelected] = useState<'fr' | 'en'>(i18n.language === 'en' ? 'en' : 'fr');
  const [applying, setApplying] = useState(false);

  const handleApply = () => {
    setApplying(true);
    i18n.changeLanguage(selected);
    setTimeout(() => {
      setApplying(false);
      navigation.goBack();
    }, 700);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('languagePicker.title')}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        <Text style={{ fontSize: 14, color: C.inkSoft, lineHeight: 22, marginBottom: 24 }}>
          {t('languagePicker.description')}
        </Text>

        {/* Language options */}
        <View style={{ gap: 12, marginBottom: 24 }}>
          {LANGS.map(lang => {
            const isActive = selected === lang.code;
            return (
              <TouchableOpacity
                key={lang.code}
                onPress={() => setSelected(lang.code)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.surface, borderRadius: 18, borderWidth: isActive ? 2 : 1, borderColor: isActive ? '#E8591A' : '#E5E0D8', padding: 16, ...SHADOW_SM }}
                activeOpacity={0.85}
              >
                <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: lang.flagBg, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: lang.flagColor + '40' }}>
                  <Text style={{ fontSize: 16, fontWeight: '800', color: lang.flagColor, fontFamily: 'Inter-Bold' }}>{lang.flagText}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 17, fontWeight: '700', color: isActive ? '#E8591A' : '#2C1810', fontFamily: 'Inter-Bold', marginBottom: 2 }}>
                    {t(lang.labelKey)}
                  </Text>
                  <Text style={{ fontSize: 13, color: C.inkMute, marginBottom: 2 }}>{t(lang.subKey)}</Text>
                  <Text style={{ fontSize: 11, color: C.inkSoft }}>{t(lang.regionKey)}</Text>
                </View>
                <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: isActive ? '#E8591A' : '#E5E0D8', alignItems: 'center', justifyContent: 'center', backgroundColor: isActive ? '#E8591A' : '#fff' }}>
                  {isActive && <Icon name="Check" size={12} color="#fff" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Bilingual note */}
        <View style={{ backgroundColor: C.goldSoft, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: '#F9A82530', flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 28 }}>
          <Icon name="Globe" size={16} color="#F9A825" />
          <Text style={{ flex: 1, fontSize: 12, color: C.inkSoft, lineHeight: 18 }}>{t('languagePicker.bilingualNote')}</Text>
        </View>

        {/* Apply button */}
        <TouchableOpacity
          onPress={handleApply}
          style={{ height: 50, borderRadius: 25, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center', ...SHADOW_MD }}
          activeOpacity={0.85}
          disabled={applying}
        >
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>
            {applying ? t('languagePicker.applying') : t('languagePicker.apply')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
