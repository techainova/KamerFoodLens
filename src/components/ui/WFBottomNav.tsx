// src/components/ui/WFBottomNav.tsx
// Barre de navigation inférieure — 5 onglets avec FAB Scanner central

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamily, fontSize, radius, shadows, spacing } from '@/constants/theme';

export type TabName = 'home' | 'search' | 'scanner' | 'favorites' | 'profile';

interface TabItem {
  name:  TabName;
  label: string;
  icon:  string;
}

const TABS: TabItem[] = [
  { name: 'home',      label: 'Accueil',   icon: '⌂' },
  { name: 'search',    label: 'Recherche',  icon: '⌕' },
  { name: 'scanner',   label: 'Scanner',    icon: '◉' },
  { name: 'favorites', label: 'Favoris',    icon: '♡' },
  { name: 'profile',   label: 'Profil',     icon: '◯' },
];

interface Props {
  activeTab: TabName;
  onTabPress: (tab: TabName) => void;
}

export function WFBottomNav({ activeTab, onTabPress }: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      {TABS.map((tab) => {
        const isScanner = tab.name === 'scanner';
        const isActive  = activeTab === tab.name;

        if (isScanner) {
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => onTabPress(tab.name)}
              style={styles.scannerWrapper}
              accessibilityRole="button"
              accessibilityLabel={tab.label}
            >
              <View style={[styles.scannerFAB, shadows.lg]}>
                <Text style={styles.scannerIcon}>{tab.icon}</Text>
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.name}
            onPress={() => onTabPress(tab.name)}
            style={styles.tab}
            accessibilityRole="button"
            accessibilityLabel={tab.label}
          >
            <Text style={[styles.tabIcon, isActive && styles.tabIconActive]}>
              {tab.icon}
            </Text>
            <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: colors.surface,
    borderTopWidth:  1,
    borderTopColor:  colors.border,
    paddingTop:      spacing.sm,
    ...shadows.sm,
  },
  tab: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
  },
  tabIcon: {
    fontSize:   22,
    color:      colors.inkMute,
    marginBottom: 2,
  },
  tabIconActive: { color: colors.primary },
  tabLabel: {
    fontFamily: fontFamily.medium,
    fontSize:   fontSize.xs,
    color:      colors.inkMute,
  },
  tabLabelActive: { color: colors.primary },

  // FAB Scanner
  scannerWrapper: {
    flex:           1,
    alignItems:     'center',
    justifyContent: 'center',
    marginTop:      -24,
  },
  scannerFAB: {
    width:           58,
    height:          58,
    borderRadius:    radius.full,
    backgroundColor: colors.primary,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     3,
    borderColor:     colors.surface,
  },
  scannerIcon: {
    fontSize: 24,
    color:    colors.white,
  },
});
