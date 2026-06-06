// src/screens/home/Search.tsx
// Recherche avancée — onglets Plats / Recettes / Restaurants / Événements

import React from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useSearch, type SearchTab } from '@/hooks/useSearch';
import { WFChip } from '@/components/ui';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

const TABS: { key: SearchTab; label: string }[] = [
  { key: 'dishes',      label: 'Plats' },
  { key: 'recipes',     label: 'Recettes' },
  { key: 'restaurants', label: 'Restaurants' },
  { key: 'events',      label: 'Événements' },
];

export default function Search() {
  const { t } = useTranslation();
  const { query, activeTab, results, onQueryChange, setActiveTab, clearSearch } =
    useSearch();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>

      {/* Barre recherche */}
      <View style={styles.searchRow}>
        <TouchableOpacity style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <View style={styles.inputWrap}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            value={query}
            onChangeText={onQueryChange}
            placeholder={t('common.search')}
            placeholderTextColor={colors.inkMute}
            autoFocus
            returnKeyType="search"
            accessibilityLabel={t('common.search')}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch} accessibilityLabel="Effacer">
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Onglets */}
      <FlatList
        horizontal
        data={TABS}
        keyExtractor={(t) => t.key}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsRow}
        renderItem={({ item }) => (
          <WFChip
            label={item.label}
            active={activeTab === item.key}
            onPress={() => setActiveTab(item.key)}
          />
        )}
      />

      {/* Résultats */}
      {results.isLoading ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : results.data && results.data.length > 0 ? (
        <>
          <Text style={styles.resultCount}>
            {results.data.length} résultats / results
          </Text>
          <FlatList
            data={results.data}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultRow}
                accessibilityLabel={item.name}
              >
                <View style={styles.resultImage}>
                  <Text>🍽</Text>
                </View>
                <View style={styles.resultInfo}>
                  <Text style={styles.resultName}>{item.name}</Text>
                  {item.subtitle && (
                    <Text style={styles.resultSub}>{item.subtitle}</Text>
                  )}
                </View>
                {item.score !== undefined && (
                  <View style={styles.scoreBadge}>
                    <Text style={styles.scoreText}>{item.score}% match</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          />
        </>
      ) : query.length >= 2 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aucun résultat pour « {query} »</Text>
        </View>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>
            Recherchez un plat, une recette, un restaurant...
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.cream },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.sm,
  },
  backBtn:   { padding: spacing.xs },
  backIcon:  { fontSize: 28, color: colors.ink, lineHeight: 32 },
  inputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: radius.lg,
    borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: spacing.sm, gap: spacing.sm,
  },
  searchIcon: { fontSize: 16 },
  input: {
    flex: 1, fontFamily: fontFamily.regular,
    fontSize: fontSize.base, color: colors.ink,
    paddingVertical: spacing.sm,
  },
  clearIcon: { fontSize: 14, color: colors.inkMute, padding: spacing.xs },
  tabsRow:   { paddingHorizontal: spacing.md, paddingBottom: spacing.sm },
  loader:    { paddingTop: spacing.xl },
  resultCount:{
    fontFamily: fontFamily.medium, fontSize: fontSize.sm,
    color: colors.inkMute, paddingHorizontal: spacing.md, marginBottom: spacing.sm,
  },
  list:      { paddingHorizontal: spacing.md },
  resultRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: spacing.sm, borderBottomWidth: 1,
    borderBottomColor: colors.border, gap: spacing.md,
  },
  resultImage:{
    width: 48, height: 48, borderRadius: radius.sm,
    backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center',
  },
  resultInfo: { flex: 1 },
  resultName: { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },
  resultSub:  { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.inkMute },
  scoreBadge: {
    backgroundColor: colors.successSoft, borderRadius: radius.sm,
    paddingHorizontal: spacing.sm, paddingVertical: 2,
  },
  scoreText: { fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.success },
  empty:     { flex: 1, alignItems: 'center', paddingTop: spacing.xxl },
  emptyText: { fontFamily: fontFamily.regular, fontSize: fontSize.md, color: colors.inkMute, textAlign: 'center' },
});
