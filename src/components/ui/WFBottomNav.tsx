import React from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { colors, shadows } from '@/constants/theme';
import { useColors } from '@/hooks/useAppTheme';
import { useFontScale, useBoldText } from '@/hooks/useAccessibility';
import Icon, { type IconName } from './Icon';

export type TabName = 'home' | 'search' | 'scanner' | 'favorites' | 'pro' | 'profile';

type TabDef = {
  name: TabName;
  icon: IconName;
  iconActive?: IconName;
  labelKey: string;
  proOnly?: boolean;
};

const TABS_STANDARD: TabDef[] = [
  { name: 'home',      icon: 'Home',     labelKey: 'nav.home' },
  { name: 'search',    icon: 'Search',   labelKey: 'nav.search' },
  { name: 'scanner',   icon: 'ScanLine', labelKey: 'nav.scanner' },
  { name: 'favorites', icon: 'Heart',    labelKey: 'nav.favorites' },
  { name: 'profile',   icon: 'User',     labelKey: 'nav.profile' },
];

const TABS_PRO: TabDef[] = [
  { name: 'home',    icon: 'Home',     labelKey: 'nav.home' },
  { name: 'search',  icon: 'Search',   labelKey: 'nav.search' },
  { name: 'scanner', icon: 'ScanLine', labelKey: 'nav.scanner' },
  { name: 'pro',     icon: 'Star',     labelKey: 'nav.pro', proOnly: true },
  { name: 'profile', icon: 'User',     labelKey: 'nav.profile' },
];

interface Props {
  activeTab:  TabName;
  onTabPress: (tab: TabName) => void;
  isPro?:     boolean;
}

export function WFBottomNav({ activeTab, onTabPress, isPro = false }: Props) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const C = useColors();
  const fontScale = useFontScale();
  const boldText = useBoldText();
  const TABS = isPro ? TABS_PRO : TABS_STANDARD;

  return (
    <View style={[
      {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: C.surface,
        paddingTop: 8,
        paddingBottom: insets.bottom + 8,
        minHeight: 64,
        borderTopWidth: 1,
        borderTopColor: C.border,
      },
      shadows.md,
    ]}>
      {TABS.map((tab) => {
        const isScanner = tab.name === 'scanner';
        const isActive  = activeTab === tab.name;
        const isProTab  = tab.proOnly === true;

        const activeColor   = isProTab ? C.gold : C.primary;
        const inactiveColor = C.inkMute;
        const iconColor     = isActive ? activeColor : inactiveColor;

        // ── Scanner FAB (button surélevé au centre) ──────────────
        if (isScanner) {
          return (
            <Pressable
              key={tab.name}
              onPress={() => onTabPress(tab.name)}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: -22 }}
              accessibilityRole="button"
              accessibilityLabel={t(tab.labelKey)}
              accessible
            >
              <View style={[
                {
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                  backgroundColor: activeTab === 'scanner' ? colors.primaryPressed : C.primary,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 3,
                  borderColor: C.surface,
                },
                shadows.elev3,
              ]}>
                <Icon name="ScanLine" size={26} color={colors.fgOnDark} strokeWidth={2} />
              </View>
              <Text style={{
                fontSize: 11 * fontScale,
                fontWeight: boldText ? '700' : '500',
                color: activeTab === 'scanner' ? C.primary : inactiveColor,
                marginTop: 4,
              }}>
                {t(tab.labelKey)}
              </Text>
            </Pressable>
          );
        }

        // ── Onglet normal ─────────────────────────────────────────
        return (
          <Pressable
            key={tab.name}
            onPress={() => onTabPress(tab.name)}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 4, minHeight: 48 }}
            accessibilityRole="button"
            accessibilityLabel={t(tab.labelKey)}
            accessibilityState={{ selected: isActive }}
            accessible
          >
            {/* Icon fill on active state */}
            <Icon
              name={tab.icon}
              size={22}
              color={iconColor}
              fill={isActive && !isProTab ? colors.primarySoft : 'none'}
              strokeWidth={isActive ? 2 : 1.75}
            />
            <Text style={{
              fontSize: 11 * fontScale,
              fontWeight: (isActive || boldText) ? '700' : '500',
              color: iconColor,
              marginTop: 3,
            }}>
              {t(tab.labelKey)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
