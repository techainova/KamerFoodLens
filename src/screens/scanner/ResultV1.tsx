// src/screens/scanner/ResultV1.tsx
// Résultat reconnaissance IA — Hero + bottom sheet infos

import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useScanResult } from '@/hooks/useScanResult';
import { WFButton, WFChip } from '@/components/ui';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

export default function ResultV1() {
  const { t }                              = useTranslation();
  const { result, goRecipe, goRestaurants, share } = useScanResult();

  if (result.isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.primary} size="large" />
        <Text style={styles.loadingText}>{t('scanner.analyzing')}</Text>
      </View>
    );
  }

  const data = result.data ?? MOCK_RESULT;

  return (
    <View style={styles.container}>
      {/* Hero image */}
      <View style={styles.hero}>
        <View style={styles.heroImage}>
          <Text style={styles.heroEmoji}>🍲</Text>
        </View>

        {/* Boutons flottants */}
        <View style={styles.heroActions}>
          <TouchableOpacity style={styles.heroBtn} accessibilityLabel="Retour">
            <Text style={styles.heroBtnText}>‹</Text>
          </TouchableOpacity>
          <View style={styles.heroActionsRight}>
            <TouchableOpacity style={styles.heroBtn} onPress={share} accessibilityLabel="Partager">
              <Text style={styles.heroBtnText}>↗</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.heroBtn} accessibilityLabel="Sauvegarder">
              <Text style={styles.heroBtnText}>🔖</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Région */}
        <View style={styles.regionBadge}>
          <Text style={styles.regionText}>CM · {data.region.toUpperCase()}</Text>
        </View>
        <Text style={styles.heroTitle}>{data.dishName}</Text>
      </View>

      {/* Bottom sheet */}
      <ScrollView style={styles.sheet} showsVerticalScrollIndicator={false}>
        <View style={styles.handle} />

        {/* Confiance */}
        <View style={styles.confidenceRow}>
          <View style={styles.confidenceDot} />
          <Text style={styles.confidenceText}>
            Confiance {data.confidence}% / Confidence {data.confidence}%
          </Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{data.duration}</Text>
            <Text style={styles.statLabel}>min / min</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{data.cookType}</Text>
            <Text style={styles.statLabel}>cuisson / cook</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{'★'.repeat(data.spiceLevel)}</Text>
            <Text style={styles.statLabel}>épicé / spice</Text>
          </View>
        </View>

        {/* Histoire */}
        <View style={styles.storyRow}>
          <Text style={styles.storyLabel}>Histoire / Story</Text>
          <TouchableOpacity accessibilityLabel="Écouter">
            <Text style={styles.listenBtn}>🔊 Écouter</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.storyText} numberOfLines={3}>{data.story}</Text>
        <TouchableOpacity><Text style={styles.readMore}>+ Lire</Text></TouchableOpacity>

        {/* Note */}
        <View style={styles.ratingRow}>
          <Text style={styles.ratingLabel}>Noter ce plat</Text>
          <View style={styles.stars}>
            {[1,2,3,4,5].map((s) => (
              <Text key={s} style={styles.star}>⭐</Text>
            ))}
          </View>
        </View>

        {/* Similaires */}
        <Text style={styles.similarLabel}>SIMILAIRES / SIMILAR</Text>
        <View style={styles.chipsRow}>
          {data.similarDishes.map((d) => (
            <WFChip key={d.id} label={d.name} />
          ))}
        </View>

        {/* Actions */}
        <WFButton label="Voir la recette ›" onPress={goRecipe} fullWidth size="lg" />
        <View style={{ height: spacing.sm }} />
        <WFButton label="Trouver des restaurants" onPress={goRestaurants} variant="secondary" fullWidth size="lg" />

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const MOCK_RESULT = {
  scanId: '1', dishName: 'Ndolé', dishNameEN: 'Ndolé',
  region: 'Littoral', confidence: 87, duration: 90,
  cookType: 'Mijoté', spiceLevel: 3 as const,
  story: 'Plat emblématique des Sawa et Bantous du Littoral, le ndolé est préparé avec des feuilles amères, de la pâte d\'arachide, du poisson fumé ou de la viande...',
  similarDishes: [{ id: '1', name: 'Eru' }, { id: '2', name: 'Mbongo' }, { id: '3', name: 'Kwacoco' }, { id: '4', name: 'Koki' }],
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.ink },
  loading:   { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream, gap: spacing.md },
  loadingText:{ fontFamily: fontFamily.medium, fontSize: fontSize.md, color: colors.inkSoft },

  hero:      { height: '55%', position: 'relative' },
  heroImage: { flex: 1, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  heroEmoji: { fontSize: 80 },

  heroActions: {
    position: 'absolute', top: 48, left: spacing.md, right: spacing.md,
    flexDirection: 'row', justifyContent: 'space-between',
  },
  heroActionsRight: { flexDirection: 'row', gap: spacing.sm },
  heroBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center',
  },
  heroBtnText: { fontSize: 18, color: colors.white },

  regionBadge: {
    position: 'absolute', bottom: 72, left: spacing.md,
  },
  regionText: { fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: 'rgba(255,255,255,0.7)', letterSpacing: 2 },
  heroTitle: {
    position: 'absolute', bottom: spacing.lg, left: spacing.md,
    fontFamily: fontFamily.serifBold, fontSize: 40, color: colors.white,
  },

  sheet:   { flex: 1, backgroundColor: colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: -20 },
  handle:  { width: 40, height: 4, borderRadius: 2, backgroundColor: colors.border, alignSelf: 'center', marginTop: spacing.sm, marginBottom: spacing.md },

  confidenceRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, paddingHorizontal: spacing.md, marginBottom: spacing.md },
  confidenceDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  confidenceText:{ fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.success },

  statsRow:  { flexDirection: 'row', paddingHorizontal: spacing.md, marginBottom: spacing.lg, gap: spacing.lg },
  statItem:  { alignItems: 'center' },
  statValue: { fontFamily: fontFamily.serifBold, fontSize: fontSize.xxl, color: colors.ink },
  statLabel: { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute },

  storyRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  storyLabel:{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },
  listenBtn: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.primary },
  storyText: { fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.inkSoft, paddingHorizontal: spacing.md, lineHeight: 22 },
  readMore:  { fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: colors.primary, paddingHorizontal: spacing.md, marginTop: 4, marginBottom: spacing.md },

  ratingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, marginBottom: spacing.md },
  ratingLabel:{ fontFamily: fontFamily.medium, fontSize: fontSize.md, color: colors.ink },
  stars:     { flexDirection: 'row' },
  star:      { fontSize: 18 },

  similarLabel:{ fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.inkMute, letterSpacing: 1, paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  chipsRow:    { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.md, marginBottom: spacing.lg },
});
