// src/components/ui/WFChip.tsx
// Chip / Tag KFL — sélectionnable ou statique

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

interface Props {
  label:       string;
  active?:     boolean;
  onPress?:    () => void;
  onRemove?:   () => void;
  color?:      string;
}

export function WFChip({
  label,
  active   = false,
  onPress,
  onRemove,
  color    = colors.primary,
}: Props) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      accessibilityRole={onPress ? 'button' : undefined}
      accessibilityLabel={label}
      style={[
        styles.chip,
        active
          ? { backgroundColor: color, borderColor: color }
          : { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: active ? colors.white : colors.inkSoft },
        ]}
      >
        {label}
      </Text>

      {onRemove && (
        <TouchableOpacity
          onPress={onRemove}
          style={styles.removeBtn}
          accessibilityLabel={`Supprimer ${label}`}
        >
          <Text style={[styles.removeIcon, { color: active ? colors.white : colors.inkMute }]}>
            ×
          </Text>
        </TouchableOpacity>
      )}
    </Container>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection:  'row',
    alignItems:     'center',
    borderWidth:    1,
    borderRadius:   radius.full,
    paddingVertical:   spacing.xs,
    paddingHorizontal: spacing.sm + 2,
    marginRight:    spacing.xs,
    marginBottom:   spacing.xs,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize:   fontSize.sm,
  },
  removeBtn:  { marginLeft: spacing.xs },
  removeIcon: {
    fontSize:   16,
    lineHeight: 18,
    fontFamily: fontFamily.bold,
  },
});
