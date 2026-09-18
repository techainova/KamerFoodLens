import React, { useEffect } from 'react';
import { Animated, View, Pressable, Image } from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, shadows } from '@/constants/theme';
import { useColors } from '@/hooks/useAppTheme';
import { useFontScale, useBoldText } from '@/hooks/useAccessibility';
import { tabBarTranslateY, resetTabBarVisibility } from '@/navigation/tabBarScroll';
import Icon, { type IconName } from './Icon';

// Compte standard : 5 icônes seules (pas de texte), calquées sur la nav
// Instagram — home / restaurant / scanner (IA) / vidéos / profil.
export type TabName = 'home' | 'resto' | 'scan' | 'video' | 'profile';

// Compte Pro : barre distincte, avec labels — tableau de bord du restaurant.
export type ProTabName = 'dash' | 'orders' | 'create' | 'offers' | 'page';

const TABS_STANDARD: { name: TabName; icon: IconName }[] = [
  { name: 'home',    icon: 'Home' },
  { name: 'resto',   icon: 'Store' },
  { name: 'scan',    icon: 'Sparkles' },
  { name: 'video',   icon: 'Video' },
  { name: 'profile', icon: 'User' },
];

const TABS_PRO: { name: ProTabName; icon: IconName; label: string; badgeKey?: string }[] = [
  { name: 'dash',   icon: 'TrendingUp',     label: 'Tableau' },
  { name: 'orders', icon: 'ShoppingBag',    label: 'Commandes', badgeKey: 'orders' },
  { name: 'create', icon: 'Plus',           label: '' },
  { name: 'offers', icon: 'GraduationCap',  label: 'Offres' },
  { name: 'page',   icon: 'Store',          label: 'Ma page' },
];

interface Props {
  activeTab:   TabName;
  onTabPress:  (tab: TabName) => void;
  avatarUri?:  string;
}

/** Barre standard — 5 icônes nues, avatar en place du dernier onglet. */
export function WFBottomNav({ activeTab, onTabPress, avatarUri }: Props) {
  const insets = useSafeAreaInsets();
  const C = useColors();

  useEffect(() => {
    tabBarTranslateY.setValue(0);
    resetTabBarVisibility();
  }, []);

  return (
    <Animated.View style={[
      {
        position: 'absolute', left: 0, right: 0, bottom: 0,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
        backgroundColor: C.surface, borderTopWidth: 0.5, borderColor: C.border,
        paddingTop: 10, paddingBottom: insets.bottom + 8, minHeight: 56 + insets.bottom,
        transform: [{ translateY: tabBarTranslateY }],
      },
    ]}>
      {TABS_STANDARD.map((tab) => {
        const isActive = activeTab === tab.name;
        const iconColor = isActive ? C.ink : C.inkMute;

        if (tab.name === 'profile') {
          return (
            <Pressable
              key={tab.name}
              onPress={() => onTabPress(tab.name)}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
              accessibilityRole="button"
              accessibilityLabel="Profil"
              accessibilityState={{ selected: isActive }}
            >
              <View style={{
                width: 28, height: 28, borderRadius: 14, overflow: 'hidden',
                borderWidth: isActive ? 2 : 1, borderColor: isActive ? C.ink : C.borderStrong,
                alignItems: 'center', justifyContent: 'center', backgroundColor: C.surface2,
              }}>
                {avatarUri ? (
                  <Image source={{ uri: avatarUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                ) : (
                  <Icon name="User" size={15} color={iconColor} />
                )}
              </View>
            </Pressable>
          );
        }

        if (tab.name === 'scan') {
          return (
            <Pressable
              key={tab.name}
              onPress={() => onTabPress(tab.name)}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
              accessibilityRole="button"
              accessibilityLabel="Scanner KFL Lens"
              accessibilityState={{ selected: isActive }}
            >
              <View style={{
                width: 42, height: 32, borderRadius: 11, alignItems: 'center', justifyContent: 'center',
                backgroundColor: isActive ? C.primary : C.primarySoft,
              }}>
                <Icon name="Sparkles" size={19} color={isActive ? '#fff' : C.primary} strokeWidth={1.6} fill={isActive ? '#fff' : 'none'} />
              </View>
            </Pressable>
          );
        }

        return (
          <Pressable
            key={tab.name}
            onPress={() => onTabPress(tab.name)}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', minHeight: 40 }}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <Icon
              name={tab.icon}
              size={25}
              color={iconColor}
              fill={isActive ? colors.ink : 'none'}
              strokeWidth={isActive ? 0 : 1.7}
            />
          </Pressable>
        );
      })}
    </Animated.View>
  );
}

interface ProProps {
  activeTab:  ProTabName;
  onTabPress: (tab: ProTabName) => void;
  ordersBadge?: number;
}

/** Barre Compte Pro — 5 onglets labellisés, bouton "Créer" en FAB central. */
export function WFProBottomNav({ activeTab, onTabPress, ordersBadge }: ProProps) {
  const insets = useSafeAreaInsets();
  const C = useColors();
  const fontScale = useFontScale();
  const boldText = useBoldText();

  useEffect(() => {
    tabBarTranslateY.setValue(0);
    resetTabBarVisibility();
  }, []);

  return (
    <Animated.View style={[
      {
        position: 'absolute', left: 0, right: 0, bottom: 0,
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around',
        backgroundColor: C.surface, borderTopWidth: 0.5, borderColor: C.border,
        paddingTop: 8, paddingBottom: insets.bottom + 6, minHeight: 58 + insets.bottom,
        transform: [{ translateY: tabBarTranslateY }],
      },
    ]}>
      {TABS_PRO.map((tab) => {
        const isActive = activeTab === tab.name;

        if (tab.name === 'create') {
          return (
            <Pressable
              key={tab.name}
              onPress={() => onTabPress(tab.name)}
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
              accessibilityRole="button"
              accessibilityLabel="Créer"
            >
              <View style={[{
                width: 46, height: 34, borderRadius: 12, backgroundColor: C.primary,
                alignItems: 'center', justifyContent: 'center',
              }, shadows.md]}>
                <Icon name="Plus" size={21} color="#fff" strokeWidth={2.4} />
              </View>
            </Pressable>
          );
        }

        const iconColor = isActive ? C.primary : C.inkMute;
        const badge = tab.badgeKey === 'orders' ? ordersBadge : undefined;

        return (
          <Pressable
            key={tab.name}
            onPress={() => onTabPress(tab.name)}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 2, minHeight: 44 }}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            <View>
              <Icon name={tab.icon} size={23} color={iconColor} />
              {!!badge && badge > 0 && (
                <View style={{
                  position: 'absolute', top: -3, right: -8, minWidth: 15, height: 15, paddingHorizontal: 3,
                  borderRadius: 8, backgroundColor: C.error, borderWidth: 1.5, borderColor: C.surface,
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Text style={{ fontSize: 9, fontWeight: '800', color: '#fff' }}>{badge > 9 ? '9+' : badge}</Text>
                </View>
              )}
            </View>
            <Text style={{
              fontSize: 9.5 * fontScale,
              fontWeight: (isActive || boldText) ? '800' : '600',
              color: iconColor,
            }}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </Animated.View>
  );
}
