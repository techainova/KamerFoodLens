// src/screens/community/Feed.tsx
// Food Feed — liste de posts + stories + création post

import React, { useState } from 'react';
import {
  FlatList, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFeed } from '@/hooks/useFeed';
import { WFAvatar } from '@/components/ui';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

type FeedTab = 'forYou' | 'following' | 'trending';

export default function Feed() {
  const { posts, toggleLike } = useFeed();
  const [tab, setTab] = useState<FeedTab>('forYou');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <View style={styles.logo}>
          <View style={styles.logoCircle}><Text style={styles.logoText}>KFL</Text></View>
          <Text style={styles.appBarTitle}>Food Feed</Text>
        </View>
        <TouchableOpacity accessibilityLabel="Rechercher">
          <Text style={styles.appBarIcon}>🔍</Text>
        </TouchableOpacity>
      </View>

      {/* Onglets */}
      <View style={styles.tabs}>
        {[
          { key: 'forYou' as FeedTab,    label: 'Pour vous' },
          { key: 'following' as FeedTab, label: 'Abonnements' },
          { key: 'trending' as FeedTab,  label: 'Trending' },
        ].map((t) => (
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

      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          /* Stories */
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={['+ Toi', 'Sami', 'Ngo', 'Chef Joël', 'Maman P']}
            keyExtractor={(s) => s}
            contentContainerStyle={styles.storiesRow}
            renderItem={({ item, index }) => (
              <View style={styles.storyItem}>
                <View style={[styles.storyCircle, index === 0 && styles.storyCircleAdd]}>
                  {index === 0
                    ? <Text style={styles.storyPlus}>+</Text>
                    : <Text style={styles.storyEmoji}>👤</Text>
                  }
                </View>
                <Text style={styles.storyName} numberOfLines={1}>{item}</Text>
              </View>
            )}
          />
        }
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            {/* Header post */}
            <View style={styles.postHeader}>
              <WFAvatar initials={item.author.slice(0,2)} size="sm" />
              <View style={styles.postAuthorInfo}>
                <Text style={styles.postAuthor}>{item.author}</Text>
                <Text style={styles.postMeta}>{item.authorLevel} · {item.timeAgo}</Text>
              </View>
              <TouchableOpacity style={styles.moreBtn}>
                <Text style={styles.moreDots}>···</Text>
              </TouchableOpacity>
            </View>

            {/* Texte */}
            <Text style={styles.postText}>{item.text}</Text>

            {/* Image placeholder */}
            {item.imageCount > 0 && (
              <View style={styles.postImagePlaceholder}>
                <Text style={styles.postImageEmoji}>🍲</Text>
                {item.imageCount > 1 && (
                  <View style={styles.imageCountBadge}>
                    <Text style={styles.imageCountText}>+{item.imageCount - 1}</Text>
                  </View>
                )}
              </View>
            )}

            {/* Tags */}
            <View style={styles.tagsRow}>
              {item.tags.map((tag) => (
                <Text key={tag} style={styles.tag}>{tag}</Text>
              ))}
            </View>

            {/* Actions */}
            <View style={styles.postActions}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={() => toggleLike(item.id)}
                accessibilityLabel={item.liked ? 'Ne plus aimer' : 'Aimer'}
              >
                <Text style={styles.actionIcon}>{item.liked ? '❤️' : '🤍'}</Text>
                <Text style={[styles.actionCount, item.liked && styles.actionCountLiked]}>
                  {item.likes}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} accessibilityLabel="Commenter">
                <Text style={styles.actionIcon}>💬</Text>
                <Text style={styles.actionCount}>{item.comments}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} accessibilityLabel="Partager">
                <Text style={styles.actionIcon}>↗</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.bookmarkBtn} accessibilityLabel="Sauvegarder">
                <Text style={styles.actionIcon}>🔖</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* FAB créer post */}
      <TouchableOpacity
        style={styles.fab}
        accessibilityRole="button"
        accessibilityLabel="Créer un post"
      >
        <Text style={styles.fabIcon}>+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.cream },
  appBar:  {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  logo:       { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logoCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  logoText:   { fontFamily: fontFamily.serifBold, fontSize: 10, color: colors.white },
  appBarTitle:{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },
  appBarIcon: { fontSize: 20, padding: spacing.xs },

  tabs:        { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  tab:         { flex: 1, paddingVertical: spacing.sm, alignItems: 'center' },
  tabActive:   { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText:     { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.inkMute },
  tabTextActive:{ color: colors.primary, fontFamily: fontFamily.bold },

  storiesRow:  { paddingHorizontal: spacing.md, paddingVertical: spacing.md, gap: spacing.md },
  storyItem:   { alignItems: 'center', width: 56 },
  storyCircle: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: colors.surface2, borderWidth: 2, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  storyCircleAdd: { borderStyle: 'dashed', borderColor: colors.inkMute },
  storyPlus:   { fontSize: 20, color: colors.inkMute },
  storyEmoji:  { fontSize: 20 },
  storyName:   { fontFamily: fontFamily.medium, fontSize: 10, color: colors.inkSoft, textAlign: 'center' },

  postCard:    { backgroundColor: colors.surface, marginBottom: spacing.sm, padding: spacing.md },
  postHeader:  { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.sm, gap: spacing.sm },
  postAuthorInfo: { flex: 1 },
  postAuthor:  { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },
  postMeta:    { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute },
  moreBtn:     { padding: spacing.xs },
  moreDots:    { fontSize: 16, color: colors.inkMute, letterSpacing: 2 },

  postText:    { fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.ink, lineHeight: 22, marginBottom: spacing.sm },

  postImagePlaceholder: {
    height: 180, backgroundColor: colors.surface2,
    borderRadius: radius.md, alignItems: 'center', justifyContent: 'center',
    marginBottom: spacing.sm, position: 'relative',
  },
  postImageEmoji:  { fontSize: 48 },
  imageCountBadge: {
    position: 'absolute', bottom: spacing.sm, right: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: radius.sm,
    paddingHorizontal: spacing.sm, paddingVertical: 2,
  },
  imageCountText: { fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.white },

  tagsRow:     { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs, marginBottom: spacing.sm },
  tag:         { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.primary },

  postActions: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  actionBtn:   { flexDirection: 'row', alignItems: 'center', gap: 4 },
  actionIcon:  { fontSize: 18 },
  actionCount: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.inkSoft },
  actionCountLiked: { color: colors.error },
  bookmarkBtn: { marginLeft: 'auto' },

  fab: {
    position: 'absolute', bottom: 88, right: spacing.lg,
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 8,
  },
  fabIcon: { fontSize: 28, color: colors.white, lineHeight: 32 },
});
