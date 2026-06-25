// src/components/ui/WFButton.tsx
import React, { useRef } from 'react';
import {
  Animated, ActivityIndicator, Pressable, StyleProp, StyleSheet, View, ViewStyle,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { colors, radius, spacing2, fontFamily, fontSize, letterSpacing } from '@/constants/theme';

type Variant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

interface WFButtonProps {
  label?:             string;
  children?:          React.ReactNode;
  onPress?:           () => void;
  variant?:           Variant;
  size?:              Size;
  loading?:           boolean;
  disabled?:          boolean;
  fullWidth?:         boolean;
  icon?:              React.ReactNode;
  style?:             StyleProp<ViewStyle>;
  accessibilityLabel?: string;
}

const BG: Record<Variant, string> = {
  primary:   colors.primary,
  secondary: colors.transparent,
  accent:    colors.accent,
  ghost:     colors.transparent,
  danger:    colors.error,
};

const BORDER: Record<Variant, string> = {
  primary:   colors.primary,
  secondary: colors.primary,
  accent:    colors.accent,
  ghost:     colors.transparent,
  danger:    colors.error,
};

const TEXT_COLOR: Record<Variant, string> = {
  primary:   colors.fgOnDark,
  secondary: colors.primary,
  accent:    colors.fgOnDark,
  ghost:     colors.primary,
  danger:    colors.fgOnDark,
};

const HEIGHT: Record<Size, number> = { sm: 36, md: 44, lg: 52 };
const PX:     Record<Size, number> = { sm: 14, md: 18, lg: 24 };

export function WFButton({
  label,
  children,
  onPress,
  variant   = 'primary',
  size      = 'md',
  loading   = false,
  disabled  = false,
  fullWidth = false,
  icon,
  style,
  accessibilityLabel,
}: WFButtonProps) {
  const scale = useRef(new Animated.Value(1)).current;
  const isDisabled = disabled || loading;
  const displayLabel = label ?? (typeof children === 'string' ? children : undefined);

  function handlePressIn() {
    Animated.timing(scale, { toValue: 0.97, duration: 120, useNativeDriver: true }).start();
  }
  function handlePressOut() {
    Animated.timing(scale, { toValue: 1, duration: 120, useNativeDriver: true }).start();
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? displayLabel ?? ''}
      accessible
    >
      <Animated.View
        style={[
          styles.base,
          {
            backgroundColor: BG[variant],
            borderColor:     BORDER[variant],
            height:          HEIGHT[size],
            paddingHorizontal: PX[size],
            borderRadius:    radius.xl,
          },
          fullWidth && styles.fullWidth,
          isDisabled && styles.disabled,
          { transform: [{ scale }] },
          style,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'secondary' || variant === 'ghost' ? colors.primary : colors.fgOnDark}
            size="small"
          />
        ) : (
          <View style={styles.inner}>
            {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
            {displayLabel ? (
              <Text style={[styles.label, { color: TEXT_COLOR[variant] }]}>{displayLabel}</Text>
            ) : children ? (
              children
            ) : null}
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    borderWidth:    1.5,
  },
  fullWidth: { width: '100%' },
  disabled:  { opacity: 0.4 },
  inner: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           spacing2.xs,
  },
  iconWrap: { marginRight: 4 },
  label: {
    fontFamily:    fontFamily.semiBold,
    fontSize:      fontSize.label,
    letterSpacing: letterSpacing.label,
    textAlign:     'center',
  },
});
