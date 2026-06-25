import React, { useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, Switch, StatusBar, Alert,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import i18n from '@/i18n';
import {
  useAccessibilityStore,
  type TextSize, type ContrastMode, type BodyFont,
  type ColorBlindMode, type CaptionSize,
} from '@/store/accessibility.store';

const SectionHeader = ({ fr, en, C }: { fr: string; en: string; C: ReturnType<typeof useColors> }) => (
  <View style={{ paddingTop: 20, paddingBottom: 6, paddingHorizontal: 4 }}>
    <Text style={{ fontSize: 10, fontWeight: '700', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 1 }}>
      {fr} <Text style={{ fontStyle: 'italic', fontWeight: '500', textTransform: 'none' }}>/ {en}</Text>
    </Text>
  </View>
);

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
  const bodyFont       = useAccessibilityStore(s => s.bodyFont);
  const colorBlindMode  = useAccessibilityStore(s => s.colorBlindMode);
  const captionsEnabled = useAccessibilityStore(s => s.captionsEnabled);
  const captionSize     = useAccessibilityStore(s => s.captionSize);
  const captionBgOpacity = useAccessibilityStore(s => s.captionBgOpacity);
  const actionDelay     = useAccessibilityStore(s => s.actionDelay);
  const largeTargets    = useAccessibilityStore(s => s.largeTargets);
  const letterSpacing   = useAccessibilityStore(s => s.letterSpacing);
  const setTextSize       = useAccessibilityStore(s => s.setTextSize);
  const setContrastMode   = useAccessibilityStore(s => s.setContrastMode);
  const setReduceMotion   = useAccessibilityStore(s => s.setReduceMotion);
  const setScreenReader   = useAccessibilityStore(s => s.setScreenReader);
  const setHaptics        = useAccessibilityStore(s => s.setHaptics);
  const setBoldText       = useAccessibilityStore(s => s.setBoldText);
  const setBodyFont       = useAccessibilityStore(s => s.setBodyFont);
  const setColorBlindMode  = useAccessibilityStore(s => s.setColorBlindMode);
  const setCaptionsEnabled = useAccessibilityStore(s => s.setCaptionsEnabled);
  const setCaptionSize     = useAccessibilityStore(s => s.setCaptionSize);
  const setCaptionBgOpacity = useAccessibilityStore(s => s.setCaptionBgOpacity);
  const setActionDelay     = useAccessibilityStore(s => s.setActionDelay);
  const setLargeTargets    = useAccessibilityStore(s => s.setLargeTargets);
  const setLetterSpacing   = useAccessibilityStore(s => s.setLetterSpacing);
  const reset             = useAccessibilityStore(s => s.reset);
  const currentLang = i18n.language === 'en' ? 'en' : 'fr';

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
  const BODY_FONTS: { value: BodyFont; labelKey: string; family: string }[] = [
    { value: 'inter', labelKey: 'accessibility.fontInter', family: 'Inter-SemiBold' },
    { value: 'mono',  labelKey: 'accessibility.fontMono',  family: 'JetBrainsMono-Bold' },
  ];
  const COLOR_BLIND_MODES: { value: ColorBlindMode; labelKey: string }[] = [
    { value: 0, labelKey: 'accessibility.none' },
    { value: 1, labelKey: 'accessibility.deuteranopia' },
    { value: 2, labelKey: 'accessibility.protanopia' },
    { value: 3, labelKey: 'accessibility.tritanopia' },
  ];
  const CAPTION_SIZES: CaptionSize[] = ['small', 'medium', 'large'];
  const captionSizeValueKey = `accessibility.captionSize${captionSize[0]!.toUpperCase()}${captionSize.slice(1)}`;
  const cycleCaptionSize = () => {
    const idx = CAPTION_SIZES.indexOf(captionSize);
    setCaptionSize(CAPTION_SIZES[(idx + 1) % CAPTION_SIZES.length]!);
  };
  const cycleCaptionBg = () => {
    const PRESETS = [50, 75, 100];
    const idx = PRESETS.indexOf(captionBgOpacity);
    setCaptionBgOpacity(PRESETS[(idx + 1) % PRESETS.length] ?? 75);
  };
  const toggleLetterSpacing = () => setLetterSpacing(letterSpacing === 'normal' ? 'wide' : 'normal');

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

        {/* Font family */}
        <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingHorizontal: 4 }}>{t('accessibility.fontFamilyTitle')}</Text>
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
          {BODY_FONTS.map((font) => (
            <TouchableOpacity key={font.value} onPress={() => setBodyFont(font.value)}
              style={{ flex: 1, paddingVertical: 12, borderRadius: 12, borderWidth: 2, alignItems: 'center', backgroundColor: font.value === bodyFont ? C.goldSoft : C.surface, borderColor: font.value === bodyFont ? C.primary : C.border }}>
              <Text style={{ fontFamily: font.family, fontSize: 13, color: font.value === bodyFont ? C.primary : C.inkSoft }}>{t(font.labelKey)}</Text>
            </TouchableOpacity>
          ))}
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

        {/* Color-blind mode */}
        <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingHorizontal: 4 }}>{t('accessibility.colorBlind')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {COLOR_BLIND_MODES.map((mode) => (
            <TouchableOpacity key={mode.value} onPress={() => setColorBlindMode(mode.value)}
              style={{ width: '47.5%', paddingVertical: 10, paddingHorizontal: 10, borderRadius: 10, borderWidth: 1.5, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: mode.value === colorBlindMode ? C.goldSoft : C.surface, borderColor: mode.value === colorBlindMode ? C.primary : C.border }}>
              <View style={{ width: 16, height: 16, borderRadius: 8, borderWidth: 1.5, borderColor: mode.value === colorBlindMode ? C.primary : C.inkMute, alignItems: 'center', justifyContent: 'center' }}>
                {mode.value === colorBlindMode && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.primary }} />}
              </View>
              <Text style={{ fontSize: 12, fontWeight: '600', color: mode.value === colorBlindMode ? C.primary : C.ink }}>{t(mode.labelKey)}</Text>
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

        {/* Video captions */}
        <SectionHeader fr="Sous-titres vidéos" en="Video captions" C={C} />
        <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden', marginBottom: 20, ...SHADOW_SM }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderColor: C.border }}>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Play" size={16} color={C.inkSoft} />
            </View>
            <Text style={{ flex: 1, fontSize: 14, color: C.ink }}>{t('accessibility.captions')}</Text>
            <Switch value={captionsEnabled} onValueChange={setCaptionsEnabled} trackColor={{ false: C.border, true: C.primary }} thumbColor="#fff" />
          </View>
          <TouchableOpacity onPress={cycleCaptionSize} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderColor: C.border }}>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Type" size={16} color={C.inkSoft} />
            </View>
            <Text style={{ flex: 1, fontSize: 14, color: C.ink }}>{t('accessibility.captionSize')}</Text>
            <Text style={{ fontSize: 12, color: C.inkMute }}>{t(captionSizeValueKey)}</Text>
            <Icon name="ChevronRight" size={16} color={C.inkMute} />
          </TouchableOpacity>
          <TouchableOpacity onPress={cycleCaptionBg} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 }}>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Eye" size={16} color={C.inkSoft} />
            </View>
            <Text style={{ flex: 1, fontSize: 14, color: C.ink }}>{t('accessibility.captionBg')}</Text>
            <Text style={{ fontSize: 12, color: C.inkMute }}>{t('accessibility.captionBgValue', { pct: captionBgOpacity })}</Text>
            <Icon name="ChevronRight" size={16} color={C.inkMute} />
          </TouchableOpacity>
        </View>

        {/* Motricité */}
        <SectionHeader fr="Motricité" en="Motor" C={C} />
        <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden', marginBottom: 20, ...SHADOW_SM }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderColor: C.border }}>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Clock" size={16} color={C.inkSoft} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, color: C.ink }}>{t('accessibility.actionDelay')}</Text>
              <Text style={{ fontSize: 10, color: C.inkMute, marginTop: 1 }}>{t('accessibility.actionDelayHint')}</Text>
            </View>
            <Switch value={actionDelay} onValueChange={setActionDelay} trackColor={{ false: C.border, true: C.primary }} thumbColor="#fff" />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 }}>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Plus" size={16} color={C.inkSoft} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, color: C.ink }}>{t('accessibility.largeTargets')}</Text>
              <Text style={{ fontSize: 10, color: C.inkMute, marginTop: 1 }}>{t('accessibility.largeTargetsHint')}</Text>
            </View>
            <Switch value={largeTargets} onValueChange={setLargeTargets} trackColor={{ false: C.border, true: C.primary }} thumbColor="#fff" />
          </View>
        </View>

        {/* Langue & Lisibilité */}
        <SectionHeader fr="Langue & Lisibilité" en="Language & readability" C={C} />
        <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden', marginBottom: 20, ...SHADOW_SM }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderColor: C.border }}>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Globe" size={16} color={C.inkSoft} />
            </View>
            <Text style={{ flex: 1, fontSize: 14, color: C.ink }}>{t('settings.language')}</Text>
            <View style={{ flexDirection: 'row', borderRadius: 14, overflow: 'hidden', borderWidth: 1, borderColor: C.border }}>
              {(['fr', 'en'] as const).map((code) => (
                <TouchableOpacity key={code} onPress={() => i18n.changeLanguage(code)}
                  style={{ paddingHorizontal: 12, paddingVertical: 4, backgroundColor: currentLang === code ? C.primary : 'transparent' }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: currentLang === code ? '#fff' : C.inkMute }}>{code.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <TouchableOpacity onPress={toggleLetterSpacing} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14 }}>
            <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Edit" size={16} color={C.inkSoft} />
            </View>
            <Text style={{ flex: 1, fontSize: 14, color: C.ink }}>{t('accessibility.letterSpacing')}</Text>
            <Text style={{ fontSize: 12, color: C.inkMute }}>{t(letterSpacing === 'wide' ? 'accessibility.letterSpacingWide' : 'accessibility.letterSpacingNormal')}</Text>
            <Icon name="ChevronRight" size={16} color={C.inkMute} />
          </TouchableOpacity>
        </View>

        {/* Reset */}
        <TouchableOpacity onPress={handleReset} style={{ height: 44, borderWidth: 1, borderColor: C.border, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, color: C.inkSoft }}>{t('accessibility.reset')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
