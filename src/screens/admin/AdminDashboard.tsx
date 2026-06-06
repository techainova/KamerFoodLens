// src/screens/admin/AdminDashboard.tsx
// Dashboard admin — metriques globales + alertes + activite live

import React from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAdmin } from '@/hooks/useAdmin';
import { colors, fontFamily, fontSize, radius, spacing, shadows } from '@/constants/theme';

export default function AdminDashboard() {
  const navigation = useNavigation();
  const { stats }  = useAdmin();

  const STAT_CARDS = [
    { emoji: '👥', label: 'Utilisateurs actifs', value: stats.activeUsers.toLocaleString(), sub: '+124 aujourd\'hui', color: colors.primary },
    { emoji: '⭐', label: 'Comptes Pro actifs',  value: String(stats.proAccounts),          sub: `${stats.pendingPro} en attente`, color: colors.gold },
    { emoji: '💰', label: 'Revenus totaux',      value: `${(stats.totalRevenue / 1000).toFixed(0)}K XAF`, sub: '+8 200 XAF/jour', color: colors.success },
    { emoji: '📷', label: 'Scans IA',            value: stats.aiScans.toLocaleString(),     sub: '+1 247 cette semaine', color: colors.navy },
  ];

  const ALERTS = [
    { id: '1', level: 'urgent', emoji: '🔴', text: `${stats.pendingPro} demandes Pro en attente de validation (> 24h)` },
    { id: '2', level: 'warn',   emoji: '🟡', text: `${stats.pendingPayouts} virements Pro en attente d'approbation` },
    { id: '3', level: 'info',   emoji: '🟢', text: 'Serveur IA operationnel — latence moyenne 1.2s' },
  ];

  const LIVE = [
    { label: 'Scans IA / heure',    value: '247',  trend: '+12%' },
    { label: 'Connexions actives',   value: '1 842', trend: '+5%' },
    { label: 'Commandes en cours',  value: '34',   trend: '' },
    { label: 'Transactions Mobile', value: '18',   trend: '' },
  ];

  const QUICK_ACTIONS = [
    { emoji: '👤', label: 'Utilisateurs',  screen: 'AdminUsers' },
    { emoji: '⭐', label: 'Comptes Pro',   screen: 'AdminProList' },
    { emoji: '💸', label: 'Virements',    screen: 'AdminPayouts' },
    { emoji: '📣', label: 'Push notif.',  screen: 'AdminPush' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <View style={styles.appBarLeft}>
          <View style={styles.logoCircle}><Text style={styles.logoText}>KFL</Text></View>
          <View>
            <Text style={styles.appBarTitle}>Administration</Text>
            <Text style={styles.appBarSub}>TechAINova — acces restreint</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn} accessibilityLabel="Deconnexion admin">
          <Text style={styles.logoutText}>Quitter</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {STAT_CARDS.map((s) => (
            <View key={s.label} style={[styles.statCard, shadows.sm]}>
              <Text style={styles.statEmoji}>{s.emoji}</Text>
              <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={styles.statSub}>{s.sub}</Text>
            </View>
          ))}
        </View>

        {/* Alertes */}
        <Text style={styles.sectionTitle}>Alertes / Alerts</Text>
        {ALERTS.map((a) => (
          <View key={a.id} style={styles.alertRow}>
            <Text style={styles.alertEmoji}>{a.emoji}</Text>
            <Text style={styles.alertText}>{a.text}</Text>
          </View>
        ))}

        {/* Activite live */}
        <Text style={styles.sectionTitle}>Activite en direct</Text>
        <View style={styles.liveGrid}>
          {LIVE.map((l) => (
            <View key={l.label} style={[styles.liveCard, shadows.sm]}>
              <View style={styles.liveDot} />
              <Text style={styles.liveValue}>{l.value}</Text>
              <Text style={styles.liveLabel}>{l.label}</Text>
              {l.trend ? <Text style={styles.liveTrend}>{l.trend}</Text> : null}
            </View>
          ))}
        </View>

        {/* Actions rapides */}
        <Text style={styles.sectionTitle}>Actions rapides / Quick actions</Text>
        <View style={styles.actionsRow}>
          {QUICK_ACTIONS.map((a) => (
            <TouchableOpacity
              key={a.label}
              style={[styles.actionBtn, shadows.sm]}
              onPress={() => navigation.navigate(a.screen as never)}
              accessibilityLabel={a.label}
            >
              <Text style={styles.actionEmoji}>{a.emoji}</Text>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.cream },
  appBar:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.navy },
  appBarLeft: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logoCircle: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  logoText:   { fontFamily: fontFamily.serifBold, fontSize: 12, color: colors.white },
  appBarTitle:{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.white },
  appBarSub:  { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: 'rgba(255,255,255,0.6)' },
  logoutBtn:  { backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: radius.sm, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  logoutText: { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.white },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: spacing.md, gap: spacing.sm },
  statCard:  { width: '47%', backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  statEmoji: { fontSize: 18, marginBottom: 4 },
  statValue: { fontFamily: fontFamily.serifBold, fontSize: fontSize.xl },
  statLabel: { fontFamily: fontFamily.medium, fontSize: fontSize.xs, color: colors.inkMute, marginTop: 2 },
  statSub:   { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.success, marginTop: 2 },

  sectionTitle: { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink, paddingHorizontal: spacing.md, marginBottom: spacing.sm, marginTop: spacing.md },

  alertRow: { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border, gap: spacing.sm },
  alertEmoji:{ fontSize: 16 },
  alertText: { flex: 1, fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.ink },

  liveGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.md, gap: spacing.sm },
  liveCard: { width: '47%', backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border, position: 'relative' },
  liveDot:  { position: 'absolute', top: spacing.sm, right: spacing.sm, width: 8, height: 8, borderRadius: 4, backgroundColor: colors.success },
  liveValue:{ fontFamily: fontFamily.serifBold, fontSize: fontSize.xl, color: colors.ink },
  liveLabel:{ fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute, marginTop: 2 },
  liveTrend:{ fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.success, marginTop: 2 },

  actionsRow: { flexDirection: 'row', paddingHorizontal: spacing.md, gap: spacing.sm },
  actionBtn:  { flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.border, gap: spacing.xs },
  actionEmoji:{ fontSize: 22 },
  actionLabel:{ fontFamily: fontFamily.medium, fontSize: fontSize.xs, color: colors.inkSoft, textAlign: 'center' },
});
