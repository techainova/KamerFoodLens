import React, { useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, Switch, StatusBar, Alert,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useColors, useAppTheme } from '@/hooks/useAppTheme';
import Icon from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';
import { useAccessibilityStore } from '@/store/accessibility.store';
import { useAuthStore } from '@/store/auth.store';

type ToggleItem  = { labelKey: string; icon: IconName; type: 'toggle'; toggleKey: string };
type NavItem     = { labelKey: string; icon: IconName; type: 'nav'; valueKey?: string; valueParams?: Record<string, unknown>; screen?: string; danger?: boolean };
type SettingItem = ToggleItem | NavItem;

type GroupDef = { titleKey: string; items: SettingItem[] };

const GROUP_DEFS: GroupDef[] = [
  {
    titleKey: 'settings.accountGroup',
    items: [
      { labelKey: 'settings.personalInfo', icon: 'User', type: 'nav', screen: 'EditProfile' },
      { labelKey: 'settings.email',        icon: 'Mail', type: 'nav', valueKey: '__emailValue__' },
      { labelKey: 'settings.changePassword', icon: 'Lock', type: 'nav', screen: 'password' },
    ],
  },
  {
    titleKey: 'settings.preferencesGroup',
    items: [
      { labelKey: 'settings.language', icon: 'Globe', type: 'nav', valueKey: 'settings.languageValue', screen: 'language' },
      { labelKey: 'settings.theme',    icon: 'Sun',   type: 'nav', valueKey: '__themeValue__',          screen: 'theme'    },
      { labelKey: 'settings.notifSetting', icon: 'Bell', type: 'toggle', toggleKey: 'push' },
    ],
  },
  {
    titleKey: 'settings.accessibilityGroup',
    items: [
      { labelKey: 'settings.ttsSetting',   icon: 'Play', type: 'toggle', toggleKey: 'tts' },
      { labelKey: 'settings.textSize',     icon: 'Type', type: 'nav', valueKey: '__textSizeValue__', screen: 'AccessibilitySettings' },
      { labelKey: 'settings.highContrast', icon: 'Eye',  type: 'toggle', toggleKey: 'contrast' },
    ],
  },
  {
    titleKey: 'settings.paymentGroup',
    items: [
      { labelKey: 'settings.mobileMoney',        icon: 'Phone',  type: 'nav', valueKey: 'settings.mobileMoneyValue', valueParams: { count: 2 }, screen: 'ProPaymentSetup' },
      { labelKey: 'settings.transactionHistory', icon: 'Trophy', type: 'nav', screen: 'transactions' },
    ],
  },
  {
    titleKey: 'settings.supportGroup',
    items: [
      { labelKey: 'settings.faqSupport',   icon: 'HelpCircle', type: 'nav', screen: 'help' },
      { labelKey: 'settings.termsPrivacy', icon: 'Bookmark',   type: 'nav', screen: 'terms' },
    ],
  },
  {
    titleKey: 'settings.dangerGroup',
    items: [
      { labelKey: 'settings.logout', icon: 'X', type: 'nav', screen: 'logout', danger: true },
    ],
  },
];

const REAL_SCREENS: Record<string, string> = {
  AccessibilitySettings: 'AccessibilitySettings',
  EditProfile:           'EditProfile',
  password:              'ChangePassword',
  language:              'LanguagePicker',
  theme:                 'ThemePicker',
  ProPaymentSetup:        'ProPaymentSetup',
};

export default function ProfileSettings() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { themeMode } = useAppTheme();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const themeValueKey =
    themeMode === 'dark'   ? 'settings.themeValueDark' :
    themeMode === 'system' ? 'settings.themeValueSystem' :
                             'settings.themeValueLight';
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    push: true, tts: true,
  });

  const contrastMode = useAccessibilityStore((s) => s.contrastMode);
  const setContrastMode = useAccessibilityStore((s) => s.setContrastMode);
  const textSize = useAccessibilityStore((s) => s.textSize);
  const TEXT_SIZE_KEYS = ['accessibility.sizeSmall', 'accessibility.sizeNormal', 'accessibility.sizeLarge', 'accessibility.sizeXLarge'];

  const getToggle = (key: string): boolean => {
    if (key === 'contrast') return contrastMode > 0;
    return toggles[key] ?? false;
  };

  const setToggle = (key: string, val: boolean) => {
    if (key === 'contrast') { setContrastMode(val ? 1 : 0); return; }
    setToggles(prev => ({ ...prev, [key]: val }));
  };

  const handleLogout = () => {
    Alert.alert(t('settings.logout'), undefined, [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('settings.logout'), style: 'destructive', onPress: () => clearAuth() },
    ]);
  };

  const handleNavPress = (screen?: string) => {
    if (screen === 'logout') { handleLogout(); return; }
    if (screen && REAL_SCREENS[screen]) {
      navigation.navigate(REAL_SCREENS[screen]);
      return;
    }
    const msgs: Record<string, [string, string]> = {
      theme:        [t('settings.themeAlertTitle'), t('settings.themeAlertMsg')],
      help:         [t('settings.faqAlertTitle'), t('settings.faqAlertMsg')],
      terms:        [t('settings.termsAlertTitle'), t('settings.termsAlertMsg')],
      transactions: [t('settings.transactionsAlertTitle'), t('settings.transactionsAlertMsg')],
    };
    const [title, msg] = msgs[screen ?? ''] ?? [t('settings.comingSoonTitle'), t('settings.comingSoonMsg')];
    Alert.alert(title, msg, [{ text: 'OK' }]);
  };

  const resolveValue = (item: NavItem): string | null => {
    if (!item.valueKey) return null;
    if (item.valueKey === '__themeValue__') return t(themeValueKey);
    if (item.valueKey === '__emailValue__') return user?.email ?? '';
    if (item.valueKey === '__textSizeValue__') return t(TEXT_SIZE_KEYS[textSize] ?? TEXT_SIZE_KEYS[1]!);
    return t(item.valueKey, item.valueParams);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('settings.title')}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>

        {GROUP_DEFS.map((group, gi) => (
          <React.Fragment key={gi}>
          <View style={{ marginTop: gi === 0 ? 12 : 4 }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 1, paddingHorizontal: 16, marginBottom: 4 }}>
              {t(group.titleKey)}
            </Text>
            {group.items.map((item, ii) => {
              const danger = item.type === 'nav' && item.danger;
              return (
                <TouchableOpacity
                  key={ii}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderColor: C.surface2 }}
                  onPress={() => {
                    if (item.type === 'toggle') setToggle(item.toggleKey, !getToggle(item.toggleKey));
                    else handleNavPress(item.screen);
                  }}
                >
                  <View style={{ width: 32, height: 32, borderRadius: 8, backgroundColor: danger ? C.errorSoft : C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={item.icon} size={16} color={danger ? C.error : C.inkSoft} />
                  </View>
                  <Text style={{ flex: 1, fontSize: 13, fontWeight: '500', color: danger ? C.error : C.ink }}>{t(item.labelKey)}</Text>
                  {item.type === 'toggle' && (
                    <Switch
                      value={getToggle(item.toggleKey)}
                      onValueChange={(val) => setToggle(item.toggleKey, val)}
                      trackColor={{ false: C.border, true: C.primary }}
                      thumbColor="#fff"
                    />
                  )}
                  {item.type === 'nav' && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      {resolveValue(item) ? (
                        <Text style={{ fontSize: 12, color: C.inkMute }} numberOfLines={1}>
                          {resolveValue(item)}
                        </Text>
                      ) : null}
                      {!danger && <Icon name="ChevronRight" size={16} color={C.inkMute} />}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bloc Pro — entre "Mon Compte" et "Préférences" (ordre du design) :
              upsell pour un utilisateur standard, carte active pour un abonné. */}
          {gi === 0 && (
            user?.role === 'pro' ? (
              <View style={{ marginHorizontal: 16, marginTop: 8, marginBottom: 4, padding: 18, borderRadius: 20, backgroundColor: C.navy }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Icon name="Star" size={14} color={C.gold} fill={C.gold} />
                  <View style={{ backgroundColor: C.gold, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{t('settings.proActiveBadge')}</Text>
                  </View>
                </View>
                <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'PlayfairDisplay-Bold', marginBottom: 4 }}>
                  {user.firstName} {user.lastName}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 16 }}>
                  {t('settings.proRenewalNote', { date: '15 Jul 2026' })}
                </Text>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ProDashboard')}
                    style={{ flex: 1, backgroundColor: C.gold, paddingHorizontal: 16, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}
                    activeOpacity={0.85}
                  >
                    <Icon name="BarChart2" size={14} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>{t('settings.proDashboardCta')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('ProSubscription')}
                    style={{ backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 14, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' }}
                    activeOpacity={0.85}
                  >
                    <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>{t('settings.manageSubscription')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => navigation.navigate('UpgradePro')}
                style={{ marginHorizontal: 16, marginTop: 8, marginBottom: 4, padding: 20, borderRadius: 20, backgroundColor: C.navy, overflow: 'hidden' }}
                activeOpacity={0.9}
              >
                <View style={{ position: 'absolute', top: -16, right: -16, width: 128, height: 128, borderRadius: 64, backgroundColor: 'rgba(249,168,37,0.1)' }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Icon name="Star" size={14} color={C.gold} fill={C.gold} />
                  <Text style={{ color: C.gold, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 }}>{t('settings.proUpsellBadge')}</Text>
                </View>
                <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'PlayfairDisplay-Bold', marginBottom: 4 }}>{t('settings.proUpsellTitle')}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 19, marginBottom: 14 }}>
                  {t('settings.proUpsellDesc')}
                </Text>
                <View style={{ backgroundColor: C.gold, alignSelf: 'flex-start', paddingHorizontal: 16, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{t('settings.proUpsellCta')}</Text>
                </View>
              </TouchableOpacity>
            )
          )}
          </React.Fragment>
        ))}

        <Text style={{ textAlign: 'center', fontSize: 11, color: C.inkMute, paddingVertical: 24 }}>
          {t('settings.footerVersion')}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
