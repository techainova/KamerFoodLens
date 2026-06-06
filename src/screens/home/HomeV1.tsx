// src/screens/home/HomeV1.tsx
// Accueil classique — Scanner CTA + Stories + Recettes populaires + Tendances

import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/auth.store';
import { useHome } from '@/hooks/useHome';
import { WFAvatar } from '@/components/ui';
import { colors, fontFamily, fontSize, radius, shadows, spacing } from '@/constants/theme';

export default function HomeV1() {
  const { t }    = useTranslation();
  const user     = useAuthStore((s) => s.user);
  const { trending, recipes, goScanner, goNotifications } = useHome();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* AppBar */}
        <View style={styles.appBar}>
          <View style={styles.logo}>
            <View style={styles.logoCircle}><Text style={styles.logoText}>KFL</Text></View>
            <Text style={styles.logoName}>KmerFoodLens</Text>
          </View>
          <View style={styles.appBarRight}>
            <TouchableOpacity
              onPress={goNotifications}
              style={styles.iconBtn}
              accessibilityLabel={t('profile.notifications')}
            >
              <Text style={styles.iconText}>🔔</Text>
            </TouchableOpacity>
            <WFAvatar
              initials={`${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`}
              size="sm"
            />
          </View>
        </View>

        {/* Scanner CTA */}
        <TouchableOpacity
          style={[styles.scannerCTA, shadows.md]}
          onPress={goScanner}
          accessibilityRole="button"
          accessibilityLabel={t('home.scanCTA')}
        >
          <View style={styles.scannerCTALeft}>
            <Text style={styles.scannerCTATitle}>{t('home.scanCTA')}</Text>
            <Text style={styles.scannerCTASub}>{t('home.scanSubtitle')}</Text>
          </View>
          <View style={styles.scannerFAB}>
            <Text style={styles.scannerFABIcon}>📷</Text>
          </View>
        </TouchableOpacity>

        {/* Barre recherche */}
        <TouchableOpacity
          style={styles.searchBar}
          accessibilityRole="search"
          accessibilityLabel={t('home.search')}
        >
          <Text style={styles.searchIcon}>🔍</Text>
          <Text style={styles.searchPlaceholder}>{t('home.search')}</Text>
          <Text style={styles.micIcon}>🎤</Text>
        </TouchableOpacity>

        {/* Stories plats */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.dishStories')}</Text>
          <TouchableOpacity accessibilityLabel={t('common.seeAll')}>
            <Text style={styles.seeAll}>{t('common.seeAll')}</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={['Ndolé','Poulet DG','Mbongo Tchobi','Eru','Koki']}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.storiesRow}
          renderItem={({ item }) => (
            <View style={styles.storyItem}>
              <View style={styles.storyCircle}>
                <Text style={styles.storyEmoji}>🍽</Text>
              </View>
              <Text style={styles.storyLabel} numberOfLines={1}>{item}</Text>
            </View>
          )}
        />

        {/* Recettes populaires */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.popularRecipes')}</Text>
          <TouchableOpacity><Text style={styles.seeAll}>{t('common.seeAll')}</Text></TouchableOpacity>
        </View>

        {recipes.isLoading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : (
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={recipes.data ?? MOCK_RECIPES}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.recipesRow}
            renderItem={({ item }) => (
              <View style={[styles.recipeCard, shadows.sm]}>
                <View style={styles.recipeImage}>
                  <Text style={styles.recipePlaceholder}>🍲</Text>
                </View>
                <Text style={styles.recipeName} numberOfLines={2}>{item.name}</Text>
                <Text style={styles.recipeRegion}>📍 {item.region}</Text>
                <TouchableOpacity style={styles.recipeBtn}>
                  <Text style={styles.recipeBtnText}>{t('scanner.viewRecipe')}</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        {/* Tendances */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('home.trending')}</Text>
        </View>

        {(trending.data ?? MOCK_TRENDING).map((item) => (
          <View key={item.dishId} style={styles.trendRow}>
            <Text style={styles.trendRank}>
              {String(item.rank).padStart(2, '0')}
            </Text>
            <View style={styles.trendImage}>
              <Text>🍽</Text>
            </View>
            <View style={styles.trendInfo}>
              <Text style={styles.trendName}>{item.name}</Text>
              <Text style={styles.trendScans}>+{item.scansWeek} scans cette semaine</Text>
            </View>
            <Text style={styles.trendArrow}>›</Text>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// Données mock pour le développement (remplacées par l'API)
const MOCK_RECIPES = [
  { id: '1', name: 'Ndolé',        region: 'Littoral', duration: 90, imageUrl: undefined },
  { id: '2', name: 'Poulet DG',    region: 'Centre',   duration: 60, imageUrl: undefined },
  { id: '3', name: 'Eru',          region: 'Sud-Ouest',duration: 75, imageUrl: undefined },
];

const MOCK_TRENDING = [
  { rank: 1, dishId: 'ndole',   name: 'Ndolé',        scansWeek: 420, region: 'Littoral' },
  { rank: 2, dishId: 'pdg',     name: 'Poulet DG',    scansWeek: 340, region: 'Centre' },
  { rank: 3, dishId: 'mbongo',  name: 'Mbongo Tchobi',scansWeek: 260, region: 'Littoral' },
];

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.cream },
  appBar:  {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  logo:       { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logoCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center',
  },
  logoText:   { fontFamily: fontFamily.serifBold, fontSize: 12, color: colors.white },
  logoName:   { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },
  appBarRight:{ flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  iconBtn:    { padding: spacing.xs },
  iconText:   { fontSize: 20 },

  scannerCTA: {
    marginHorizontal: spacing.md, marginTop: spacing.sm,
    backgroundColor: colors.ink, borderRadius: radius.lg,
    flexDirection: 'row', alignItems: 'center',
    padding: spacing.md, gap: spacing.md,
  },
  scannerCTALeft: { flex: 1 },
  scannerCTATitle: {
    fontFamily: fontFamily.bold, fontSize: fontSize.lg, color: colors.white,
    marginBottom: 4,
  },
  scannerCTASub: {
    fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.inkMute,
  },
  scannerFAB: {
    width: 48, height: 48, borderRadius: radius.full,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  scannerFABIcon: { fontSize: 22 },

  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    marginHorizontal: spacing.md, marginTop: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  searchIcon:        { fontSize: 16, color: colors.inkMute },
  searchPlaceholder: { flex: 1, fontFamily: fontFamily.regular, fontSize: fontSize.md, color: colors.inkMute },
  micIcon:           { fontSize: 16 },

  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: spacing.md, marginTop: spacing.lg, marginBottom: spacing.sm,
  },
  sectionTitle: { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },
  seeAll:       { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.primary },

  storiesRow: { paddingHorizontal: spacing.md, gap: spacing.md },
  storyItem:  { alignItems: 'center', width: 64 },
  storyCircle:{
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: colors.primarySoft, borderWidth: 2, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  storyEmoji: { fontSize: 24 },
  storyLabel: { fontFamily: fontFamily.medium, fontSize: fontSize.xs, color: colors.inkSoft, textAlign: 'center' },

  loader:     { paddingVertical: spacing.xl },
  recipesRow: { paddingHorizontal: spacing.md, gap: spacing.md },
  recipeCard: {
    width: 160, backgroundColor: colors.surface,
    borderRadius: radius.md, overflow: 'hidden',
    borderWidth: 1, borderColor: colors.border,
  },
  recipeImage: {
    height: 100, backgroundColor: colors.surface2,
    alignItems: 'center', justifyContent: 'center',
  },
  recipePlaceholder: { fontSize: 40 },
  recipeName:  {
    fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: colors.ink,
    padding: spacing.sm, paddingBottom: 2,
  },
  recipeRegion:{
    fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute,
    paddingHorizontal: spacing.sm, marginBottom: spacing.sm,
  },
  recipeBtn: {
    marginHorizontal: spacing.sm, marginBottom: spacing.sm,
    backgroundColor: colors.primarySoft, borderRadius: radius.sm, padding: spacing.xs,
    alignItems: 'center',
  },
  recipeBtnText: { fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.primary },

  trendRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.border, gap: spacing.sm,
  },
  trendRank: { fontFamily: fontFamily.serifBold, fontSize: fontSize.lg, color: colors.primary, width: 28 },
  trendImage:{
    width: 44, height: 44, borderRadius: radius.sm,
    backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center',
  },
  trendInfo:  { flex: 1 },
  trendName:  { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },
  trendScans: { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute },
  trendArrow: { fontSize: 20, color: colors.inkMute },
});
