// src/components/ui/WFChip.tsx
import React from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, fontFamily, fontSize, radius } from '@/constants/theme';

interface WFChipProps {
  label:    string;
  active?:  boolean;
  onPress?: () => void;
}

export function WFChip({ label, active = false, onPress }: WFChipProps) {
  const Container = onPress ? Pressable : View;

  return (
    <Container
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={label}
      accessible
      style={[
        styles.chip,
        active ? styles.chipActive : styles.chipInactive,
      ]}
    >
      <Text style={[styles.label, active ? styles.labelActive : styles.labelInactive]}>
        {label}
      </Text>
    </Container>
  );
}

const styles = StyleSheet.create({
  chip: {
    height:            34,
    paddingHorizontal: 14,
    borderRadius:      radius.full,
    alignItems:        'center',
    justifyContent:    'center',
  },
  chipInactive: {
    backgroundColor: colors.surface,
    borderWidth:     1,
    borderColor:     colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize:   13,
  },
  labelInactive: { color: colors.fg },
  labelActive:   { color: colors.fgOnDark },
});
