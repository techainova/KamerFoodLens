// src/screens/profile/FavoritesScreen.tsx
// Écran favoris — Plats / Recettes / Restaurants / Événements

import React, { useState } from 'react';
import {
  FlatList, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

type FavTab = 'dishes' | 'recipes' | 'restaurants' | 'events';

const TABS: { key: FavTab; label: string }[] = [
  { key: 'dishes',      label: 'Plats' },
  { key: 'recipes',     label: 'Recettes' },
  { key: 'restaurants', label: 'Restaurants' },
  { key: 'events',      label: 'Événements' },
];

const MOCK_FAVS = [
  { id: '1', name: 'Ndolé traditionnel',  sub: 'Littoral · Ajouté le 18 Nov' },
  { id: '2', name: 'Mbongo Tchobi',       sub: 'Centre · Ajouté le 14 Nov' },
  { id: '3', name: 'Eru aux écrevisses',  sub: 'Sud-Ouest · Ajouté le 12 Nov' },
  { id: '4', name: 'Sanga au maïs',       sub: 'Adamaoua · Ajouté le 8 Nov' },
];

export default function FavoritesScreen() {
  const [tab, setTab] = useState<FavTab>('recipes');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>Mes favoris</Text>
      </View>

      {/* Onglets */}
      <View style={styles.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            onPress={() => setTab(t.key)}
            style={[styles.tab, tab === t.key && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Liste */}
      {tab === 'recipes' ? (
        <>
          <Text style={styles.count}>{MOCK_FAVS.length} recettes sauvegardées</Text>
          <FlatList
            data={MOCK_FAVS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.favRow}>
                <View style={styles.favImage}>
                  <Text style={styles.favEmoji}>🍲</Text>
                </View>
                <View style={styles.favInfo}>
                  <Text style={styles.favName}>{item.name}</Text>
                  <Text style={styles.favSub}>{item.sub}</Text>
                </View>
                <TouchableOpacity style={styles.removeBtn} accessibilityLabel="Retirer des favoris">
                  <Text style={styles.removeIcon}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <TouchableOpacity style={styles.addAllBtn}>
            <Text style={styles.addAllText}>Tout ajouter à la liste de courses</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Aucun favori dans cette catégorie</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.cream },
  header: { paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  title:  { fontFamily: fontFamily.bold, fontSize: fontSize.lg, color: colors.ink },
  tabs:   { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  tab:    { flex: 1, paddingVertical: spacing.sm, alignItems: 'center' },
  tabActive:    { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText:      { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.inkMute },
  tabTextActive:{ color: colors.primary, fontFamily: fontFamily.bold },
  count: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.inkMute, padding: spacing.md },
  favRow:{
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.border, gap: spacing.md,
  },
  favImage:{ width: 56, height: 56, borderRadius: radius.md, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  favEmoji:{ fontSize: 28 },
  favInfo: { flex: 1 },
  favName: { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },
  favSub:  { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.inkMute },
  removeBtn:{ padding: spacing.sm },
  removeIcon:{ fontSize: 16, color: colors.inkMute },
  addAllBtn: {
    margin: spacing.md, backgroundColor: colors.primary,
    borderRadius: radius.full, paddingVertical: spacing.md, alignItems: 'center',
  },
  addAllText:{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.white },
  empty:     { flex: 1, alignItems: 'center', justifyContent: 'center' },
  emptyText: { fontFamily: fontFamily.regular, fontSize: fontSize.md, color: colors.inkMute },
});
