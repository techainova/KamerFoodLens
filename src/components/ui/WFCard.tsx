// src/components/ui/WFCard.tsx
import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { colors, radius, shadows, spacing2 } from '@/constants/theme';
import type { ShadowKey } from '@/constants/theme';

interface WFCardProps {
  children: React.ReactNode;
  padding?: number;
  shadow?:  ShadowKey;
  style?:   ViewStyle | ViewStyle[];
}

export function WFCard({
  children,
  padding = spacing2.md,
  shadow  = 'elev1',
  style,
}: WFCardProps) {
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
    // pas de borderWidth — l'ombre porte la séparation
  },
});
