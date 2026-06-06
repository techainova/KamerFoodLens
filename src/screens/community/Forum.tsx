// src/screens/community/Forum.tsx
// Forum thématique — onglets + discussions

import React, { useState } from 'react';
import {
  FlatList, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

type ForumTab = 'general' | 'recipes' | 'regions' | 'tips' | 'events';

const TABS: { key: ForumTab; label: string }[] = [
  { key: 'general',  label: 'Général' },
  { key: 'recipes',  label: 'Recettes' },
  { key: 'regions',  label: 'Régions' },
  { key: 'tips',     label: 'Conseils' },
  { key: 'events',   label: 'Events' },
];

const MOCK_DISCUSSIONS = [
  {
    id: '1', title: 'Le secret du Ndolé bien crémeux ?', badge: 'Populaire 🔥',
    preview: 'Quelqu\'un peut me dire pourquoi mon ndolé devient toujours sec après cuisson ?',
    tags: ['#Ndolé', '#Recette'], author: 'Adèle K.', likes: 28, views: 312, timeAgo: '2h',
  },
  {
    id: '2', title: 'Où trouver de l\'eru frais à Douala ?', badge: 'Nouveau 🆕',
    preview: 'Je cherche un marché qui vend des feuilles d\'eru fraîches...',
    tags: ['#Eru', '#Douala'], author: 'Jean P.', likes: 6, views: 84, timeAgo: '5h',
  },
  {
    id: '3', title: 'Comment fumer le poisson maison ?', badge: 'Résolu ✅',
    preview: 'Salut tous, j\'aimerais apprendre la technique traditionnelle...',
    tags: ['#Poisson', '#Technique'], author: 'Chef Joël', likes: 42, views: 1200, timeAgo: 'hier',
  },
];

export default function Forum() {
  const [tab, setTab] = useState<ForumTab>('recipes');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <View style={styles.logo}>
          <View style={styles.logoCircle}><Text style={styles.logoText}>KFL</Text></View>
          <Text style={styles.appBarTitle}>Forum</Text>
        </View>
        <View style={styles.appBarRight}>
          <TouchableOpacity accessibilityLabel="Rechercher"><Text style={styles.icon}>🔍</Text></TouchableOpacity>
          <TouchableOpacity accessibilityLabel="Filtrer"><Text style={styles.icon}>⚙️</Text></TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <Text style={styles.statText}><Text style={styles.statNum}>1 248</Text> discussions</Text>
        <Text style={styles.statDot}>·</Text>
        <Text style={styles.statText}><Text style={styles.statNum}>342</Text> actifs aujourd'hui</Text>
      </View>

      {/* Onglets */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={TABS}
        keyExtractor={(t) => t.key}
        contentContainerStyle={styles.tabsRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setTab(item.key)}
            style={[styles.tabBtn, tab === item.key && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, tab === item.key && styles.tabTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Discussions */}
      <FlatList
        data={MOCK_DISCUSSIONS}
        keyExtractor={(d) => d.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.discussionCard} accessibilityLabel={item.title}>
            <View style={styles.discussionHeader}>
              <Text style={styles.discussionTitle}>{item.title}</Text>
              <View style={styles.badgeWrap}>
                <Text style={styles.badge}>{item.badge}</Text>
              </View>
            </View>
            <Text style={styles.preview} numberOfLines={2}>{item.preview}</Text>
            <View style={styles.tagsRow}>
              {item.tags.map((tag) => (
                <Text key={tag} style={styles.tag}>{tag}</Text>
              ))}
            </View>
            <View style={styles.metaRow}>
              <Text style={styles.metaText}>👤 {item.author}</Text>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaText}>🤍 {item.likes}</Text>
              <Text style={styles.metaDot}>·</Text>
              <Text style={styles.metaText}>👁 {item.views}</Text>
              <Text style={styles.metaTime}>{item.timeAgo}</Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* FAB nouvelle discussion */}
      <TouchableOpacity
        style={styles.fab}
        accessibilityRole="button"
        accessibilityLabel="Nouvelle discussion"
      >
        <Text style={styles.fabText}>+ Nouvelle discussion</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.cream },
  appBar:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  logo:    { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logoCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontFamily: fontFamily.serifBold, fontSize: 10, color: colors.white },
  appBarTitle:{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },
  appBarRight:{ flexDirection: 'row', gap: spacing.sm },
  icon:    { fontSize: 20, padding: spacing.xs },

  statsRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, gap: spacing.sm, marginBottom: spacing.sm },
  statText: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.inkMute },
  statNum:  { fontFamily: fontFamily.bold, color: colors.ink },
  statDot:  { color: colors.inkMute },

  tabsRow:     { paddingHorizontal: spacing.md, paddingBottom: spacing.sm, gap: spacing.sm },
  tabBtn:      { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  tabBtnActive:{ backgroundColor: colors.primary, borderColor: colors.primary },
  tabText:     { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.inkMute },
  tabTextActive:{ color: colors.white },

  list:          { paddingHorizontal: spacing.md, paddingBottom: 100 },
  discussionCard:{ backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border },
  discussionHeader:{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm, gap: spacing.sm },
  discussionTitle:{ flex: 1, fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },
  badgeWrap:     { alignSelf: 'flex-start' },
  badge:         { fontFamily: fontFamily.medium, fontSize: fontSize.xs, color: colors.primary, backgroundColor: colors.primarySoft, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.full },
  preview:       { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.inkMute, lineHeight: 18, marginBottom: spacing.sm },
  tagsRow:       { flexDirection: 'row', gap: spacing.xs, marginBottom: spacing.sm },
  tag:           { fontFamily: fontFamily.medium, fontSize: fontSize.xs, color: colors.primary, backgroundColor: colors.primarySoft, paddingHorizontal: spacing.sm, paddingVertical: 2, borderRadius: radius.full },
  metaRow:       { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  metaText:      { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute },
  metaDot:       { color: colors.inkMute },
  metaTime:      { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute, marginLeft: 'auto' },

  fab: {
    position: 'absolute', bottom: 88, alignSelf: 'center',
    backgroundColor: colors.primary, borderRadius: radius.full,
    paddingHorizontal: spacing.xl, paddingVertical: spacing.sm,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
  fabText: { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.white },
});
