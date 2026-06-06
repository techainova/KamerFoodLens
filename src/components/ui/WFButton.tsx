// src/components/ui/WFButton.tsx
// Bouton KFL — variantes primary / secondary / ghost

import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, spacing, radius, fontFamily, fontSize } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size    = 'sm' | 'md' | 'lg';

interface Props {
  label:     string;
  onPress:   () => void;
  variant?:  Variant;
  size?:     Size;
  loading?:  boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export function WFButton({
  label,
  onPress,
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  disabled = false,
  fullWidth = false,
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={({ pressed }) => [
        styles.base,
        styles[variant],
        styles[size],
        fullWidth && styles.fullWidth,
        pressed && styles.pressed,
        isDisabled && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' ? colors.white : colors.primary}
          size="small"
        />
      ) : (
        <Text style={[styles.label, styles[`label_${variant}`], styles[`label_${size}`]]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    borderRadius:   radius.full,
    borderWidth:    1.5,
    borderColor:    'transparent',
  },
  fullWidth: { width: '100%' },
  pressed:  { opacity: 0.82 },
  disabled: { opacity: 0.45 },

  // Variantes
  primary: {
    backgroundColor: colors.primary,
    borderColor:     colors.primary,
  },
  secondary: {
    backgroundColor: colors.transparent,
    borderColor:     colors.primary,
  },
  ghost: {
    backgroundColor: colors.transparent,
    borderColor:     colors.transparent,
  },

  // Tailles
  sm: { paddingVertical: spacing.xs,  paddingHorizontal: spacing.md },
  md: { paddingVertical: spacing.sm + 2, paddingHorizontal: spacing.lg },
  lg: { paddingVertical: spacing.md,  paddingHorizontal: spacing.xl },

  // Labels
  label: {
    fontFamily: fontFamily.bold,
    textAlign:  'center',
  },
  label_primary:   { color: colors.white },
  label_secondary: { color: colors.primary },
  label_ghost:     { color: colors.primary },

  label_sm: { fontSize: fontSize.sm },
  label_md: { fontSize: fontSize.base },
  label_lg: { fontSize: fontSize.lg },
});
