// src/components/ui/ConfidenceBar.tsx
// Toujours doublement texte + icône + couleur — jamais couleur seule
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, fontSize, radius } from '@/constants/theme';

interface ConfidenceBarProps {
  score:       number;
  showLabel?:  boolean;
  showIcon?:   boolean;
  size?:       'sm' | 'md';
}

function getColor(score: number): string {
  if (score >= 85) return colors.confidenceHigh;
  if (score >= 60) return colors.confidenceMid;
  return colors.confidenceLow;
}

function getLabel(score: number): string {
  if (score >= 85) return 'Fiable';
  if (score >= 60) return 'Probable';
  return 'Incertain';
}

export function ConfidenceBar({
  score,
  showLabel = true,
  showIcon  = true,
  size      = 'md',
}: ConfidenceBarProps) {
  const color     = getColor(score);
  const trackH    = size === 'sm' ? 4 : 6;
  const labelText = `${score} % — ${getLabel(score)}`;

  return (
    <View
      style={styles.wrapper}
      accessible
      accessibilityLabel={`Confiance IA : ${labelText}`}
      accessibilityRole="progressbar"
    >
      {/* Barre */}
      <View style={[styles.track, { height: trackH }]}>
        <View
          style={[
            styles.fill,
            { width: `${score}%` as `${number}%`, backgroundColor: color, height: trackH, borderRadius: radius.full },
          ]}
        />
      </View>

      {/* Texte + icône */}
      {showLabel && (
        <View style={styles.meta}>
          {showIcon && (
            <View style={[styles.iconDot, { backgroundColor: color }]} accessibilityLabel="" />
          )}
          <Text style={[styles.label, { color }]}>{labelText}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { gap: 6 },
  track: {
    backgroundColor: colors.border,
    borderRadius:    radius.full,
    overflow:        'hidden',
    width:           '100%',
  },
  fill: {},
  meta: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           6,
  },
  iconDot: {
    width:        8,
    height:       8,
    borderRadius: 4,
  },
  label: {
    fontFamily: fontFamily.medium,
    fontSize:   fontSize.caption,
  },
});
