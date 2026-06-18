import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, SafeAreaView, StatusBar, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useColors, useAppTheme } from '@/hooks/useAppTheme';
import Icon from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

type ToggleItem  = { labelKey: string; icon: IconName; type: 'toggle'; toggleKey: string };
type NavItem     = { labelKey: string; icon: IconName; type: 'nav'; valueKey?: string; screen?: string };
type SettingItem = ToggleItem | NavItem;

type GroupDef = { titleKey: string; items: SettingItem[] };

const GROUP_DEFS: GroupDef[] = [
  {
    titleKey: 'settings.preferencesGroup',
    items: [
      { labelKey: 'settings.pushNotif',   icon: 'Bell',   type: 'toggle', toggleKey: 'push'    },
      { labelKey: 'settings.offlineMode', icon: 'Wifi',   type: 'toggle', toggleKey: 'offline' },
      { labelKey: 'settings.language',    icon: 'Globe',  type: 'nav', valueKey: 'settings.languageValue', screen: 'language' },
      { labelKey: 'settings.theme',       icon: 'Sun',    type: 'nav', valueKey: '__themeValue__',          screen: 'theme'    },
    ],
  },
  {
    titleKey: 'settings.accountGroup',
    items: [
      { labelKey: 'settings.changePassword', icon: 'Lock',      type: 'nav', screen: 'password' },
      { labelKey: 'settings.privacy',        icon: 'Shield',    type: 'nav', screen: 'privacy'  },
      { labelKey: 'settings.dataExport',     icon: 'BarChart2', type: 'nav', screen: 'data'     },
    ],
  },
  {
    titleKey: 'settings.accessibilityGroup',
    items: [
      { labelKey: 'settings.textSize',         icon: 'Type',  type: 'nav',    valueKey: 'settings.textSizeValue', screen: 'AccessibilitySettings' },
      { labelKey: 'settings.highContrast',     icon: 'Eye',   type: 'toggle', toggleKey: 'contrast'  },
      { labelKey: 'settings.reduceAnimations', icon: 'Pause', type: 'toggle', toggleKey: 'animation' },
    ],
  },
  {
    titleKey: 'settings.helpGroup',
    items: [
      { labelKey: 'settings.helpCenter', icon: 'HelpCircle',    type: 'nav', screen: 'help'  },
      { labelKey: 'settings.reportBug',  icon: 'AlertTriangle', type: 'nav', screen: 'bug'   },
      { labelKey: 'settings.about',      icon: 'Info',          type: 'nav', valueKey: 'settings.aboutVersion', screen: 'about' },
    ],
  },
];

const REAL_SCREENS: Record<string, string> = {
  AccessibilitySettings: 'AccessibilitySettings',
  FoodJournal:           'FoodJournal',
  password:              'ChangePassword',
  privacy:               'PrivacySettings',
  language:              'LanguagePicker',
  theme:                 'ThemePicker',
  about:                 'AboutKFL',
};

export default function ProfileSettings() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { themeMode } = useAppTheme();
  const { t } = useTranslation();

  const themeValueKey =
    themeMode === 'dark'   ? 'settings.themeValueDark' :
    themeMode === 'system' ? 'settings.themeValueSystem' :
                             'settings.themeValueLight';
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    push: true, offline: false, contrast: false, animation: false,
  });

  const setToggle = (key: string, val: boolean) => setToggles(prev => ({ ...prev, [key]: val }));

  const handleNavPress = (screen?: string) => {
    if (screen && REAL_SCREENS[screen]) {
      navigation.navigate(REAL_SCREENS[screen]);
      return;
    }
    const msgs: Record<string, [string, string]> = {
      theme: [t('settings.themeAlertTitle'), t('settings.themeAlertMsg')],
      data:  [t('settings.dataAlertTitle'),  t('settings.dataAlertMsg')],
      help:  [t('settings.helpAlertTitle'),  t('settings.helpAlertMsg')],
      bug:   [t('settings.bugAlertTitle'),   t('settings.bugAlertMsg')],
    };
    const [title, msg] = msgs[screen ?? ''] ?? [t('settings.comingSoonTitle'), t('settings.comingSoonMsg')];
    Alert.alert(title, msg, [{ text: 'OK' }]);
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

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {GROUP_DEFS.map((group, gi) => (
          <View key={gi} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingHorizontal: 4 }}>
              {t(group.titleKey)}
            </Text>
            <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
              {group.items.map((item, ii) => (
                <TouchableOpacity
                  key={ii}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: ii < group.items.length - 1 ? 1 : 0, borderColor: C.surface2 }}
                  onPress={() => {
                    if (item.type === 'toggle') setToggle(item.toggleKey, !toggles[item.toggleKey]);
                    else handleNavPress(item.screen);
                  }}
                >
                  <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={item.icon} size={16} color={C.inkSoft} />
                  </View>
                  <Text style={{ flex: 1, fontSize: 14, color: C.ink }}>{t(item.labelKey)}</Text>
                  {item.type === 'toggle' && (
                    <Switch
                      value={toggles[item.toggleKey]}
                      onValueChange={(val) => setToggle(item.toggleKey, val)}
                      trackColor={{ false: C.border, true: C.primary }}
                      thumbColor="#fff"
                    />
                  )}
                  {item.type === 'nav' && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      {item.valueKey ? (
                        <Text style={{ fontSize: 12, color: C.inkMute }}>
                          {item.valueKey === '__themeValue__' ? t(themeValueKey) : t(item.valueKey)}
                        </Text>
                      ) : null}
                      <Icon name="ChevronRight" size={16} color={C.inkMute} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        <TouchableOpacity style={{ height: 48, borderWidth: 1, borderColor: 'rgba(198,40,40,0.3)', borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: C.error }}>{t('settings.logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
