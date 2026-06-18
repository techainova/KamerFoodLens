import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, SafeAreaView, StatusBar, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useAccessibilityStore, type TextSize, type ContrastMode } from '@/store/accessibility.store';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

export default function AccessibilitySettings() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();

  const textSize       = useAccessibilityStore(s => s.textSize);
  const contrastMode   = useAccessibilityStore(s => s.contrastMode);
  const reduceMotion   = useAccessibilityStore(s => s.reduceMotion);
  const screenReader   = useAccessibilityStore(s => s.screenReader);
  const haptics        = useAccessibilityStore(s => s.haptics);
  const boldText       = useAccessibilityStore(s => s.boldText);
  const setTextSize       = useAccessibilityStore(s => s.setTextSize);
  const setContrastMode   = useAccessibilityStore(s => s.setContrastMode);
  const setReduceMotion   = useAccessibilityStore(s => s.setReduceMotion);
  const setScreenReader   = useAccessibilityStore(s => s.setScreenReader);
  const setHaptics        = useAccessibilityStore(s => s.setHaptics);
  const setBoldText       = useAccessibilityStore(s => s.setBoldText);
  const reset             = useAccessibilityStore(s => s.reset);

  const [savedFlash, setSavedFlash] = useState(false);

  const TEXT_SIZES: { value: TextSize; labelKey: string }[] = [
    { value: 0, labelKey: 'accessibility.sizeSmall' },
    { value: 1, labelKey: 'accessibility.sizeNormal' },
    { value: 2, labelKey: 'accessibility.sizeLarge' },
    { value: 3, labelKey: 'accessibility.sizeXLarge' },
  ];
  const CONTRAST_MODES: { value: ContrastMode; labelKey: string }[] = [
    { value: 0, labelKey: 'accessibility.contrastStandard' },
    { value: 1, labelKey: 'accessibility.contrastHigh' },
    { value: 2, labelKey: 'accessibility.contrastMax' },
  ];

  const TOGGLES = [
    { label: t('accessibility.reduceMotion'), icon: 'Pause'   as const, value: reduceMotion, set: setReduceMotion },
    { label: t('accessibility.screenReader'), icon: 'Volume2' as const, value: screenReader, set: setScreenReader },
    { label: t('accessibility.haptics'),      icon: 'Zap'     as const, value: haptics,      set: setHaptics      },
    { label: t('accessibility.boldText'),     icon: 'Type'    as const, value: boldText,     set: setBoldText     },
  ];

  const handleSave = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1600);
  };

  const handleReset = () => {
    Alert.alert(t('accessibility.reset'), undefined, [
      { text: t('common.cancel', 'Annuler'), style: 'cancel' },
      { text: t('accessibility.reset'), style: 'destructive', onPress: () => { reset(); handleSave(); } },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('accessibility.title')}</Text>
        <TouchableOpacity onPress={handleSave} style={{ height: 32, paddingHorizontal: 14, backgroundColor: savedFlash ? C.success : C.primary, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{savedFlash ? t('accessibility.saved') : t('accessibility.save')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

        {/* Text size */}
        <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingHorizontal: 4 }}>{t('accessibility.textSize')}</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
          {TEXT_SIZES.map((size) => (
            <TouchableOpacity key={size.value} onPress={() => setTextSize(size.value)}
              style={{ flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 2, alignItems: 'center', backgroundColor: size.value === textSize ? C.goldSoft : C.surface, borderColor: size.value === textSize ? C.primary : C.border }}>
              <Text style={{ fontWeight: '500', fontSize: 10 + size.value * 3, color: size.value === textSize ? C.primary : C.inkSoft }}>{t(size.labelKey)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Preview */}
        <View style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, marginBottom: 20, ...SHADOW_SM }}>
          <Text style={{ fontSize: 11, color: C.inkMute, marginBottom: 8 }}>{t('accessibility.previewLabel')}</Text>
          <Text style={{ fontWeight: boldText ? '800' : '600', color: C.ink, fontSize: 12 + textSize * 3 }}>{t('accessibility.previewTitle')}</Text>
          <Text style={{ fontWeight: boldText ? '700' : '400', color: C.inkSoft, fontSize: 10 + textSize * 3, marginTop: 2 }}>{t('accessibility.previewSubtitle')}</Text>
        </View>

        {/* Contrast mode */}
        <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingHorizontal: 4 }}>{t('accessibility.contrastMode')}</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
          {CONTRAST_MODES.map((mode) => (
            <TouchableOpacity key={mode.value} onPress={() => setContrastMode(mode.value)}
              style={{ flex: 1, paddingVertical: 10, borderRadius: 12, borderWidth: 2, alignItems: 'center', backgroundColor: mode.value === contrastMode ? C.goldSoft : C.surface, borderColor: mode.value === contrastMode ? C.primary : C.border }}>
              <Text style={{ fontSize: 12, fontWeight: '500', color: mode.value === contrastMode ? C.primary : C.inkSoft }}>{t(mode.labelKey)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Toggles */}
        <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingHorizontal: 4 }}>{t('accessibility.optionsTitle')}</Text>
        <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden', marginBottom: 20, ...SHADOW_SM }}>
          {TOGGLES.map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: i < TOGGLES.length - 1 ? 1 : 0, borderColor: C.border }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={item.icon} size={16} color={C.inkSoft} />
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: C.ink }}>{item.label}</Text>
              <Switch value={item.value} onValueChange={item.set} trackColor={{ false: C.border, true: C.primary }} thumbColor="#fff" />
            </View>
          ))}
        </View>

        {/* Reset */}
        <TouchableOpacity onPress={handleReset} style={{ height: 44, borderWidth: 1, borderColor: C.border, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, color: C.inkSoft }}>{t('accessibility.reset')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
