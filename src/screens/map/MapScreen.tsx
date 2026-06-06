// src/screens/map/MapScreen.tsx
// Carte restaurants — placeholder (react-native-maps Phase suivante)

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontFamily, fontSize, spacing } from '@/constants/theme';

export default function MapScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Restaurants</Text>
      </View>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapEmoji}>🗺️</Text>
        <Text style={styles.mapText}>Carte des restaurants</Text>
        <Text style={styles.mapSub}>react-native-maps — Phase suivante</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.cream },
  header: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  title:  { fontFamily: fontFamily.bold, fontSize: fontSize.lg, color: colors.ink },
  mapPlaceholder: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm,
  },
  mapEmoji: { fontSize: 60 },
  mapText:  { fontFamily: fontFamily.bold, fontSize: fontSize.lg, color: colors.ink },
  mapSub:   { fontFamily: fontFamily.regular, fontSize: fontSize.md, color: colors.inkMute },
});
