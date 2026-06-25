import React, { useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useColors, useAppTheme, LIGHT, DARK } from '@/hooks/useAppTheme';
import { useUIStore } from '@/store/ui.store';
import type { ThemeMode } from '@/store/ui.store';
import Icon from '@/components/ui/Icon';

const SHADOW_MD = { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 6, elevation: 4 };
const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

function MiniPreview({ palette }: { palette: typeof LIGHT }) {
  return (
    <View style={{ borderRadius: 10, backgroundColor: palette.cream, overflow: 'hidden', width: 64, height: 48, borderWidth: 1, borderColor: palette.border }}>
      <View style={{ height: 14, backgroundColor: palette.surface, borderBottomWidth: 1, borderColor: palette.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5, gap: 3 }}>
        <View style={{ width: 12, height: 5, borderRadius: 3, backgroundColor: palette.primary }} />
        <View style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: palette.border }} />
      </View>
      <View style={{ flex: 1, padding: 4, gap: 3 }}>
        <View style={{ height: 5, borderRadius: 2, backgroundColor: palette.ink, width: '70%' }} />
        <View style={{ height: 3, borderRadius: 2, backgroundColor: palette.inkMute, width: '90%' }} />
        <View style={{ height: 3, borderRadius: 2, backgroundColor: palette.inkMute, width: '60%' }} />
      </View>
    </View>
  );
}

export default function ThemePicker() {
  const navigation   = useNavigation<any>();
  const C            = useColors();
  const { t }        = useTranslation();
  const { themeMode } = useAppTheme();
  const setThemeMode = useUIStore(s => s.setThemeMode);
  const [selected, setSelected] = useState<ThemeMode>(themeMode);
  const [applying, setApplying] = useState(false);

  const OPTIONS: { mode: ThemeMode; icon: Parameters<typeof Icon>[0]['name']; labelKey: string; subKey: string; palette: typeof LIGHT }[] = [
    { mode: 'light',  icon: 'Sun',     labelKey: 'themePicker.light',  subKey: 'themePicker.lightSub',  palette: LIGHT },
    { mode: 'dark',   icon: 'Moon',    labelKey: 'themePicker.dark',   subKey: 'themePicker.darkSub',   palette: DARK  },
    { mode: 'system', icon: 'Monitor', labelKey: 'themePicker.system', subKey: 'themePicker.systemSub', palette: LIGHT },
  ];

  const handleApply = () => {
    setApplying(true);
    setThemeMode(selected);
    setTimeout(() => {
      setApplying(false);
      navigation.goBack();
    }, 500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('themePicker.title')}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        <Text style={{ fontSize: 14, color: C.inkSoft, lineHeight: 22, marginBottom: 24 }}>
          {t('themePicker.description')}
        </Text>

        <View style={{ gap: 12, marginBottom: 28 }}>
          {OPTIONS.map(opt => {
            const isActive = selected === opt.mode;
            return (
              <TouchableOpacity
                key={opt.mode}
                onPress={() => setSelected(opt.mode)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: C.surface, borderRadius: 18, borderWidth: isActive ? 2 : 1, borderColor: isActive ? C.primary : C.border, padding: 16, ...SHADOW_SM }}
                activeOpacity={0.85}
              >
                {/* Mini preview */}
                <MiniPreview palette={opt.palette} />

                {/* Icon + labels */}
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: isActive ? C.primary + '18' : C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={opt.icon} size={14} color={isActive ? C.primary : C.inkSoft} />
                    </View>
                    <Text style={{ fontSize: 16, fontWeight: '700', color: isActive ? C.primary : C.ink, fontFamily: 'Inter-Bold' }}>
                      {t(opt.labelKey)}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 13, color: C.inkMute }}>{t(opt.subKey)}</Text>
                </View>

                {/* Radio */}
                <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: isActive ? C.primary : C.border, alignItems: 'center', justifyContent: 'center', backgroundColor: isActive ? C.primary : C.surface }}>
                  {isActive && <Icon name="Check" size={12} color="#fff" />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          onPress={handleApply}
          style={{ height: 50, borderRadius: 25, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', ...SHADOW_MD }}
          activeOpacity={0.85}
          disabled={applying}
        >
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>
            {applying ? t('themePicker.applying') : t('themePicker.apply')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
