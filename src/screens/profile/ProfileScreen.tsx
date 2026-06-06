// src/screens/profile/ProfileScreen.tsx
// Profil — stats + onglets + bouton Admin + deconnexion

import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@/store/auth.store';
import { logoutMock } from '@/services/mock.auth';
import { WFAvatar } from '@/components/ui';
import { colors, fontFamily, fontSize, radius, spacing, shadows } from '@/constants/theme';

type ProfileTab = 'posts' | 'favorites' | 'badges';

export default function ProfileScreen() {
  const navigation      = useNavigation();
  const user            = useAuthStore((s) => s.user);
  const [tab, setTab]   = useState<ProfileTab>('posts');

  if (!user) return null;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mon profil</Text>
          <TouchableOpacity style={styles.editBtn}>
            <Text style={styles.editIcon}>pencil</Text>
          </TouchableOpacity>
        </View>

        {/* Infos utilisateur */}
        <View style={styles.userBlock}>
          <WFAvatar initials={`${user.firstName[0]}${user.lastName[0]}`} size="xl" />
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>Niv.{user.level}</Text>
          </View>
          <Text style={styles.fullName}>{user.firstName} {user.lastName}</Text>
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.bio}>Passionnee de cuisine traditionnelle</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            { label: 'Recettes', value: '24' },
            { label: 'Scans',    value: String(user.xpPoints) },
            { label: 'Abonnes',  value: '318' },
            { label: 'Abonn.',   value: '92' },
          ].map((s) => (
            <View key={s.label} style={styles.statItem}>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Bouton modifier */}
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.editProfileBtn}>
            <Text style={styles.editProfileText}>Modifier le profil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.proBtn}
            onPress={() => navigation.navigate('UpgradePro' as never)}
            accessibilityLabel="Devenir Pro"
          >
            <Text style={styles.proBtnText}>Pro</Text>
          </TouchableOpacity>
        </View>

        {/* Onglets */}
        <View style={styles.tabs}>
          {(['posts','favorites','badges'] as ProfileTab[]).map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              style={[styles.tab, tab === t && styles.tabActive]}
            >
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'posts' ? 'Publications' : t === 'favorites' ? 'Favoris' : 'Badges'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Contenu */}
        {tab === 'posts' && (
          <View style={styles.grid}>
            {[1,2,3,4,5,6].map((i) => (
              <View key={i} style={styles.gridItem}>
                <Text style={styles.gridEmoji}>dish</Text>
              </View>
            ))}
          </View>
        )}
        {tab === 'favorites' && (
          <View style={styles.emptyTab}>
            <Text style={styles.emptyText}>Vos favoris apparaitront ici</Text>
          </View>
        )}
        {tab === 'badges' && (
          <View style={styles.badgesGrid}>
            {[
              { emoji: 'target', label: 'Premier scan', date: '12 Nov' },
              { emoji: 'camera', label: '100 scans',    date: '20 Nov' },
              { emoji: 'trophy', label: 'Champion Quiz',date: '24 Nov' },
            ].map((b) => (
              <View key={b.label} style={[styles.badgeItem, shadows.sm]}>
                <Text style={styles.badgeEmoji}>{b.emoji}</Text>
                <Text style={styles.badgeLabel}>{b.label}</Text>
                <Text style={styles.badgeDate}>{b.date}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Bouton Panneau Admin */}
        <TouchableOpacity
          style={styles.adminBtn}
          onPress={() => navigation.navigate('AdminLogin' as never)}
          accessibilityLabel="Panneau Admin"
        >
          <Text style={styles.adminBtnEmoji}>shield</Text>
          <Text style={styles.adminBtnText}>Panneau Admin (TechAINova)</Text>
          <Text style={styles.adminChevron}>arrow</Text>
        </TouchableOpacity>

        {/* Deconnexion */}
        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={logoutMock}
          accessibilityLabel="Deconnexion"
        >
          <Text style={styles.logoutText}>Deconnexion / Sign out</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.cream },
  header:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  headerTitle:{ fontFamily: fontFamily.bold, fontSize: fontSize.lg, color: colors.ink },
  editBtn: { padding: spacing.xs },
  editIcon:{ fontSize: 16, color: colors.inkMute },

  userBlock: { alignItems: 'center', paddingVertical: spacing.lg, position: 'relative' },
  levelBadge:{ position: 'absolute', top: spacing.lg + 56, right: '35%', backgroundColor: colors.primary, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  levelText: { fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.white },
  fullName:  { fontFamily: fontFamily.serifBold, fontSize: fontSize.xl, color: colors.ink, marginTop: spacing.sm },
  username:  { fontFamily: fontFamily.regular, fontSize: fontSize.md, color: colors.inkMute },
  bio:       { fontFamily: fontFamily.regular, fontSize: fontSize.md, color: colors.inkSoft, textAlign: 'center', marginTop: spacing.sm, paddingHorizontal: spacing.xl },

  statsRow: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: spacing.md, borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.border },
  statItem: { alignItems: 'center' },
  statValue:{ fontFamily: fontFamily.serifBold, fontSize: fontSize.xl, color: colors.ink },
  statLabel:{ fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute },

  actionRow:      { flexDirection: 'row', paddingHorizontal: spacing.md, paddingVertical: spacing.md, gap: spacing.sm },
  editProfileBtn: { flex: 1, borderWidth: 1.5, borderColor: colors.primary, borderRadius: radius.full, paddingVertical: spacing.sm, alignItems: 'center' },
  editProfileText:{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.primary },
  proBtn:         { backgroundColor: colors.gold, borderRadius: radius.full, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, alignItems: 'center' },
  proBtnText:     { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.white },

  tabs:         { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  tab:          { flex: 1, paddingVertical: spacing.sm, alignItems: 'center' },
  tabActive:    { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText:      { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.inkMute },
  tabTextActive:{ color: colors.primary, fontFamily: fontFamily.bold },

  grid:     { flexDirection: 'row', flexWrap: 'wrap' },
  gridItem: { width: '33.33%', aspectRatio: 1, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: colors.border },
  gridEmoji:{ fontSize: 28 },

  badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: spacing.md, gap: spacing.md },
  badgeItem:  { width: '28%', backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', gap: 4 },
  badgeEmoji: { fontSize: 28 },
  badgeLabel: { fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.ink, textAlign: 'center' },
  badgeDate:  { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute },

  emptyTab:  { alignItems: 'center', paddingVertical: spacing.xxl },
  emptyText: { fontFamily: fontFamily.regular, fontSize: fontSize.md, color: colors.inkMute },

  adminBtn:      { flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.md, marginTop: spacing.xl, backgroundColor: colors.navySoft, borderRadius: radius.md, padding: spacing.md, gap: spacing.sm },
  adminBtnEmoji: { fontSize: 20 },
  adminBtnText:  { flex: 1, fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.navy },
  adminChevron:  { fontSize: 16, color: colors.navy },

  logoutBtn: { marginHorizontal: spacing.md, marginTop: spacing.md, borderWidth: 1, borderColor: colors.errorSoft, borderRadius: radius.full, paddingVertical: spacing.sm, alignItems: 'center' },
  logoutText:{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.error },
});
