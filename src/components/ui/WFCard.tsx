// src/components/ui/WFCard.tsx
// Carte de contenu KFL — fond surface, ombre, border radius

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing } from '@/constants/theme';
import type { ShadowKey } from '@/constants/theme';

interface Props {
  children:  React.ReactNode;
  padding?:  number;
  shadow?:   ShadowKey;
  style?:    ViewStyle | ViewStyle[];
}

export function WFCard({
  children,
  padding = spacing.md,
  shadow  = 'md',
  style,
}: Props) {
  return (
    <View style={[styles.card, shadows[shadow], { padding }, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius:    radius.md,
    borderWidth:     1,
    borderColor:     colors.border,
  },
});
