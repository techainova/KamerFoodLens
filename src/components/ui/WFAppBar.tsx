// src/components/ui/WFAppBar.tsx
// Barre de navigation supérieure KFL

import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, fontFamily, fontSize, shadows, spacing } from '@/constants/theme';

interface Props {
  title:           string;
  back?:           boolean;
  onBack?:         () => void;
  trailing?:       React.ReactNode;
  backgroundColor?: string;
}

export function WFAppBar({
  title,
  back           = false,
  onBack,
  trailing,
  backgroundColor = colors.surface,
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        shadows.sm,
        { backgroundColor, paddingTop: insets.top + spacing.sm },
      ]}
    >
      {/* Bouton retour */}
      <View style={styles.left}>
        {back && (
          <TouchableOpacity
            onPress={onBack}
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Retour"
          >
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Titre centré */}
      <Text style={styles.title} numberOfLines={1}>
        {title}
      </Text>

      {/* Zone droite */}
      <View style={styles.right}>
        {trailing ?? null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection:  'row',
    alignItems:     'center',
    paddingBottom:  spacing.sm,
    paddingHorizontal: spacing.md,
    minHeight:      56,
  },
  left:  { width: 44, alignItems: 'flex-start' },
  right: { width: 44, alignItems: 'flex-end' },
  title: {
    flex:        1,
    textAlign:   'center',
    fontFamily:  fontFamily.bold,
    fontSize:    fontSize.lg,
    color:       colors.ink,
  },
  backButton: {
    padding: spacing.xs,
  },
  backIcon: {
    fontSize:   28,
    color:      colors.ink,
    lineHeight: 32,
  },
});
