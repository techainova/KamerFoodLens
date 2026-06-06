// src/screens/games/Games.tsx
// Hub Jeux & Gamification — points + défis + modes de jeu

import React from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/auth.store';
import { colors, fontFamily, fontSize, radius, spacing, shadows } from '@/constants/theme';

const GAME_MODES = [
  { id: '1', emoji: '🧠', title: 'Quiz culinaire',   sub: '50 questions · 10 niveaux',  color: colors.primary },
  { id: '2', emoji: '🎵', title: 'Blind Test Audio',  sub: 'Devinez au son',              color: colors.navy },
  { id: '3', emoji: '📷', title: 'Défi Photo',       sub: 'Thème de la semaine',         color: colors.teal ?? colors.success },
  { id: '4', emoji: '🎟', title: 'Tombola',          sub: 'Tirage mensuel',              color: colors.gold },
];

export default function Games() {
  const user = useAuthStore((s) => s.user);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* AppBar */}
        <View style={styles.appBar}>
          <View style={styles.logo}>
            <View style={styles.logoCircle}><Text style={styles.logoText}>KFL</Text></View>
            <Text style={styles.appBarTitle}>Jeux & Défis</Text>
          </View>
        </View>

        {/* Points card */}
        <View style={[styles.pointsCard, shadows.md]}>
          <View style={styles.pointsLeft}>
            <Text style={styles.pointsLabel}>MES POINTS</Text>
            <Text style={styles.pointsValue}>{user?.xpPoints ?? 1250} pts</Text>
            <Text style={styles.pointsSub}>Niveau : Amateur · {2000 - (user?.xpPoints ?? 1250)} pts du Chef</Text>
          </View>
          <Text style={styles.pointsEmoji}>🏆</Text>
        </View>

        {/* Défi du jour */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Défi du jour</Text>
        </View>

        <View style={[styles.challengeCard, shadows.sm]}>
          <View style={styles.challengeImagePlaceholder}>
            <View style={styles.challengeBlur}>
              <Text style={styles.challengeEmoji}>🍲</Text>
            </View>
          </View>
          <View style={styles.challengeInfo}>
            <Text style={styles.challengeTitle}>Plat mystère du jour</Text>
            <Text style={styles.challengeSub}>Identifiez ce plat ! · 1 247 joueurs</Text>
            <Text style={styles.challengeTimer}>Termine dans 4h 23m</Text>
          </View>
          <TouchableOpacity
            style={styles.playBtn}
            accessibilityRole="button"
            accessibilityLabel="Jouer"
          >
            <Text style={styles.playBtnText}>Jouer · +20 pts</Text>
          </TouchableOpacity>
        </View>

        {/* Modes de jeu */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Modes de jeu</Text>
        </View>

        <View style={styles.modesGrid}>
          {GAME_MODES.map((mode) => (
            <TouchableOpacity
              key={mode.id}
              style={[styles.modeCard, shadows.sm]}
              accessibilityRole="button"
              accessibilityLabel={mode.title}
            >
              <View style={[styles.modeIconBg, { backgroundColor: mode.color + '20' }]}>
                <Text style={styles.modeEmoji}>{mode.emoji}</Text>
              </View>
              <Text style={styles.modeTitle}>{mode.title}</Text>
              <Text style={styles.modeSub}>{mode.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Classement */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Top classement</Text>
          <TouchableOpacity><Text style={styles.seeAll}>Voir tout</Text></TouchableOpacity>
        </View>

        {[
          { rank: 1, name: 'Chef Joëlle K.', pts: 8420, emoji: '🥇' },
          { rank: 2, name: 'Sami N.',        pts: 6310, emoji: '🥈' },
          { rank: 3, name: 'Maman Pauline',  pts: 5180, emoji: '🥉' },
        ].map((entry) => (
          <View key={entry.rank} style={styles.rankRow}>
            <Text style={styles.rankEmoji}>{entry.emoji}</Text>
            <Text style={styles.rankName}>{entry.name}</Text>
            <Text style={styles.rankPts}>{entry.pts} pts</Text>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

// teal fallback
const teal = colors.success;

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.cream },
  appBar:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  logo:    { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logoCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontFamily: fontFamily.serifBold, fontSize: 10, color: colors.white },
  appBarTitle:{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },

  pointsCard: {
    marginHorizontal: spacing.md, marginBottom: spacing.md,
    backgroundColor: colors.gold, borderRadius: radius.lg,
    padding: spacing.lg, flexDirection: 'row', alignItems: 'center',
  },
  pointsLeft:   { flex: 1 },
  pointsLabel:  { fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: 'rgba(255,255,255,0.7)', letterSpacing: 1, marginBottom: 4 },
  pointsValue:  { fontFamily: fontFamily.serifBold, fontSize: 36, color: colors.white, marginBottom: 4 },
  pointsSub:    { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: 'rgba(255,255,255,0.85)' },
  pointsEmoji:  { fontSize: 48 },

  sectionHeader:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  sectionTitle: { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },
  seeAll:       { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.primary },

  challengeCard: { marginHorizontal: spacing.md, marginBottom: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  challengeImagePlaceholder:{ height: 80, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  challengeBlur: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(0,0,0,0.2)', alignItems: 'center', justifyContent: 'center' },
  challengeEmoji:{ fontSize: 28, opacity: 0.3 },
  challengeInfo: { padding: spacing.md, paddingBottom: spacing.sm },
  challengeTitle:{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },
  challengeSub:  { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.inkMute, marginTop: 2 },
  challengeTimer:{ fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.primary, marginTop: 4 },
  playBtn:       { marginHorizontal: spacing.md, marginBottom: spacing.md, backgroundColor: colors.primary, borderRadius: radius.full, paddingVertical: spacing.sm, alignItems: 'center' },
  playBtnText:   { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.white },

  modesGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.md, gap: spacing.md, marginBottom: spacing.md },
  modeCard:  { width: '45%', backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  modeIconBg:{ width: 48, height: 48, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  modeEmoji: { fontSize: 24 },
  modeTitle: { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink, marginBottom: 2 },
  modeSub:   { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute },

  rankRow:   { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border, gap: spacing.md },
  rankEmoji: { fontSize: 24, width: 32 },
  rankName:  { flex: 1, fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },
  rankPts:   { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.primary },
});
