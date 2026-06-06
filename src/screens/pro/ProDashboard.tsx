// src/screens/pro/ProDashboard.tsx
// Dashboard Pro — stats + commandes + actions rapides

import React from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useProDashboard } from '@/hooks/useProDashboard';
import { WFAvatar } from '@/components/ui';
import { colors, fontFamily, fontSize, radius, spacing, shadows } from '@/constants/theme';

const QUICK_ACTIONS = [
  { emoji: '📅', label: 'Événement' },
  { emoji: '🎓', label: 'Formation' },
  { emoji: '👥', label: 'Communauté' },
  { emoji: '📣', label: 'Annonce' },
  { emoji: '💸', label: 'Virement' },
  { emoji: '🍽', label: 'Mon Menu' },
];

export default function ProDashboard() {
  const navigation = useNavigation();
  const { tab, setTab, stats, orders, confirmOrder, cancelOrder } = useProDashboard();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <View style={styles.restaurantRow}>
          <WFAvatar initials="MP" size="sm" />
          <View>
            <Text style={styles.restaurantName}>Chez Maman Pauline</Text>
            <View style={styles.verifiedRow}>
              <Text style={styles.proBadge}>★ PRO</Text>
              <Text style={styles.verifiedText}>✓ Vérifié · Restaurant</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity accessibilityLabel="Notifications">
          <Text style={styles.bellIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      {/* Onglets */}
      <View style={styles.tabs}>
        {(['dashboard','revenues','activity','settings'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            onPress={() => setTab(t)}
            style={[styles.tab, tab === t && styles.tabActive]}
          >
            <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
              {t === 'dashboard' ? 'Tableau' : t === 'revenues' ? 'Revenus' : t === 'activity' ? 'Activité' : 'Paramètres'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Stats */}
        <View style={styles.statsGrid}>
          {[
            { label: 'Vues profil', value: stats.views.toLocaleString(), sub: stats.viewsGrowth, emoji: '👁' },
            { label: 'Abonnés',     value: String(stats.followers),      sub: `+${stats.newFollowers} nouveaux`, emoji: '👥' },
            { label: 'Rev. mois',   value: `${stats.revenueXAF.toLocaleString()} XAF`, sub: stats.revenueGrowth, emoji: '💰' },
            { label: 'Tickets',     value: `${stats.ticketsSold}/${stats.ticketsTotal}`, sub: 'vendus', emoji: '🎟' },
          ].map((s) => (
            <View key={s.label} style={[styles.statCard, shadows.sm]}>
              <Text style={styles.statEmoji}>{s.emoji}</Text>
              <Text style={styles.statValue}>{s.value}</Text>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={styles.statSub}>{s.sub}</Text>
            </View>
          ))}
        </View>

        {/* Actions rapides */}
        <Text style={styles.sectionTitle}>Actions rapides / Quick actions</Text>
        <View style={styles.actionsGrid}>
          {QUICK_ACTIONS.map((a) => (
            <TouchableOpacity
              key={a.label}
              style={[styles.actionBtn, shadows.sm]}
              accessibilityLabel={a.label}
            >
              <Text style={styles.actionEmoji}>{a.emoji}</Text>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Commandes reçues */}
        <View style={styles.ordersHeader}>
          <Text style={styles.sectionTitle}>Commandes reçues</Text>
          <View style={styles.ordersBadge}>
            <Text style={styles.ordersBadgeText}>{orders.length}</Text>
          </View>
        </View>

        {orders.length === 0 ? (
          <Text style={styles.noOrders}>Aucune commande en attente</Text>
        ) : (
          orders.map((order, idx) => (
            <View
              key={order.id}
              style={[styles.orderCard, idx === 0 && styles.orderCardNew]}
            >
              <View style={styles.orderTop}>
                <View style={[styles.orderNum, { backgroundColor: colors.primary }]}>
                  <Text style={styles.orderNumText}>N{idx + 1}</Text>
                </View>
                <View style={styles.orderInfo}>
                  <Text style={styles.orderCustomer}>{order.customer} · {order.username}</Text>
                  <Text style={styles.orderRef}>{order.ref}</Text>
                  <Text style={styles.orderMeta}>{order.minutesAgo} min · {order.method} ✓</Text>
                </View>
                <Text style={styles.orderAmount}>{order.totalXAF.toLocaleString()} XAF</Text>
              </View>
              <View style={styles.orderActions}>
                <TouchableOpacity
                  style={styles.confirmBtn}
                  onPress={() => confirmOrder(order.id)}
                  accessibilityLabel="Confirmer la commande"
                >
                  <Text style={styles.confirmText}>✓ Confirmer</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.detailBtn} accessibilityLabel="Voir les détails">
                  <Text style={styles.detailText}>Détail →</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={() => cancelOrder(order.id)}
                  accessibilityLabel="Annuler la commande"
                >
                  <Text style={styles.cancelText}>✕ Annuler</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.cream },
  appBar:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  restaurantRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  restaurantName:{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },
  verifiedRow:   { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  proBadge:      { backgroundColor: colors.gold, borderRadius: radius.sm, paddingHorizontal: spacing.xs, fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.white },
  verifiedText:  { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.success },
  bellIcon:      { fontSize: 22 },

  tabs:          { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border },
  tab:           { flex: 1, paddingVertical: spacing.sm, alignItems: 'center' },
  tabActive:     { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText:       { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.inkMute },
  tabTextActive: { color: colors.primary, fontFamily: fontFamily.bold },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', padding: spacing.md, gap: spacing.sm },
  statCard:  { width: '47%', backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: colors.border },
  statEmoji: { fontSize: 18, marginBottom: 4 },
  statValue: { fontFamily: fontFamily.serifBold, fontSize: fontSize.xxl, color: colors.ink },
  statLabel: { fontFamily: fontFamily.medium, fontSize: fontSize.xs, color: colors.inkMute, marginTop: 2 },
  statSub:   { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.success },

  sectionTitle: { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink, paddingHorizontal: spacing.md, marginBottom: spacing.sm },

  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: spacing.md, gap: spacing.sm, marginBottom: spacing.lg },
  actionBtn:   { width: '30%', backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.sm, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  actionEmoji: { fontSize: 22, marginBottom: 4 },
  actionLabel: { fontFamily: fontFamily.medium, fontSize: fontSize.xs, color: colors.inkSoft, textAlign: 'center' },

  ordersHeader: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, marginBottom: spacing.sm, gap: spacing.sm },
  ordersBadge:  { backgroundColor: colors.error, borderRadius: radius.full, width: 22, height: 22, alignItems: 'center', justifyContent: 'center' },
  ordersBadgeText:{ fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.white },

  noOrders: { fontFamily: fontFamily.regular, fontSize: fontSize.md, color: colors.inkMute, textAlign: 'center', paddingVertical: spacing.xl },

  orderCard:    { marginHorizontal: spacing.md, marginBottom: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  orderCardNew: { borderColor: colors.primary },
  orderTop:     { flexDirection: 'row', alignItems: 'flex-start', padding: spacing.md, gap: spacing.sm },
  orderNum:     { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  orderNumText: { fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.white },
  orderInfo:    { flex: 1 },
  orderCustomer:{ fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: colors.ink },
  orderRef:     { fontFamily: fontFamily.mono ?? fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute },
  orderMeta:    { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute, marginTop: 2 },
  orderAmount:  { fontFamily: fontFamily.serifBold, fontSize: fontSize.lg, color: colors.primary },
  orderActions: { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border },
  confirmBtn:   { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', backgroundColor: colors.successSoft },
  confirmText:  { fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: colors.success },
  detailBtn:    { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderLeftWidth: 1, borderRightWidth: 1, borderColor: colors.border },
  detailText:   { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.inkSoft },
  cancelBtn:    { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', backgroundColor: colors.errorSoft },
  cancelText:   { fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: colors.error },
});
