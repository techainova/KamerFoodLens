// src/components/ui/Tag.tsx
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, fontSize, radius } from '@/constants/theme';

export type TagTone = 'region' | 'veg' | 'spicy' | 'new' | 'neutral';

interface TagProps {
  label: string;
  tone?: TagTone;
}

const BG: Record<TagTone, string> = {
  region:  colors.primarySoft,
  veg:     colors.secondarySoft,
  spicy:   colors.accentSoft,
  new:     colors.warningSoft,
  neutral: colors.surfaceSunken,
};

const FG: Record<TagTone, string> = {
  region:  colors.primaryPressed,
  veg:     colors.secondaryHover,
  spicy:   colors.accentHover,
  new:     colors.warning,
  neutral: colors.fgMuted,
};

export function Tag({ label, tone = 'neutral' }: TagProps) {
  return (
    <View style={[styles.tag, { backgroundColor: BG[tone] }]}>
      <Text style={[styles.label, { color: FG[tone] }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tag: {
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      radius.xs,
    alignSelf:         'flex-start',
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize:   fontSize.caption,
  },
});
