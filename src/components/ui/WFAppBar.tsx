// src/components/ui/WFAppBar.tsx
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamily, fontSize, shadows, spacing2 } from '@/constants/theme';

interface WFAppBarProps {
  title:            string;
  sub?:             string;
  back?:            boolean;
  onBack?:          () => void;
  trailing?:        React.ReactNode;
  backgroundColor?: string;
  transparent?:     boolean;
}

export function WFAppBar({
  title,
  sub,
  back            = false,
  onBack,
  trailing,
  backgroundColor = colors.surface,
  transparent     = false,
}: WFAppBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        !transparent && shadows.elev1,
        { backgroundColor: transparent ? colors.transparent : backgroundColor, paddingTop: insets.top + 8 },
      ]}
    >
      <View style={styles.left}>
        {back && (
          <Pressable
            onPress={onBack}
            style={styles.iconBtn}
            accessibilityRole="button"
            accessibilityLabel="Retour"
            accessible
          >
            <Text style={[styles.backIcon, transparent && styles.iconOnDark]}>‹</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.center}>
        <Text
          style={[styles.title, transparent && styles.titleOnDark]}
          numberOfLines={1}
          accessibilityRole="header"
        >
          {title}
        </Text>
        {sub ? (
          <Text style={[styles.sub, transparent && styles.titleOnDark]} numberOfLines={1}>
            {sub}
          </Text>
        ) : null}
      </View>

      <View style={styles.right}>
        {trailing ?? null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingBottom:     spacing2.sm,
    paddingHorizontal: spacing2.md,
    minHeight:         56,
  },
  left:   { width: 44, alignItems: 'flex-start' },
  right:  { width: 44, alignItems: 'flex-end' },
  center: { flex: 1, alignItems: 'center' },
  title: {
    textAlign:   'center',
    fontFamily:  fontFamily.displaySemi,
    fontSize:    fontSize.h3,
    color:       colors.fg,
  },
  sub: {
    textAlign:  'center',
    fontFamily: fontFamily.regular,
    fontSize:   fontSize.caption,
    color:      colors.fgMuted,
    marginTop:  2,
  },
  titleOnDark: { color: colors.fgOnDark },
  iconBtn: {
    width:           44,
    height:          44,
    alignItems:      'center',
    justifyContent:  'center',
  },
  backIcon: {
    fontSize:   28,
    color:      colors.fg,
    lineHeight: 32,
  },
  iconOnDark: { color: colors.fgOnDark },
});
