// src/screens/home/Notifications.tsx
// Centre de notifications — Tout / Système / Communauté / Événements

import React, { useState } from 'react';
import {
  FlatList, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, fontFamily, fontSize, spacing, radius } from '@/constants/theme';

type NotifTab = 'all' | 'system' | 'community' | 'events';

const TABS: { key: NotifTab; label: string }[] = [
  { key: 'all',       label: 'Tout' },
  { key: 'system',    label: 'Système' },
  { key: 'community', label: 'Communauté' },
  { key: 'events',    label: 'Événements' },
];

const MOCK_NOTIFS = [
  { id: '1', type: 'system',    icon: '📷', title: 'Plat identifié : Eru', sub: '92% de confiance · Voir le résultat', time: 'maintenant', unread: true },
  { id: '2', type: 'system',    icon: '🏆', title: 'Nouveau badge : 100 scans !', sub: 'Vous êtes maintenant Amateur', time: '2h', unread: true },
  { id: '3', type: 'events',    icon: '📅', title: 'Festival du Ndolé samedi', sub: 'Bonanjo, Douala · Plus que 3 jours', time: '5h', unread: false },
  { id: '4', type: 'community', icon: '💬', title: 'Chef Joëlle a répondu', sub: '« Pour le mbongo, l\'écorce... »', time: 'hier', unread: false },
  { id: '5', type: 'system',    icon: '🎟', title: 'Tirage tombola dans 2 jours', sub: 'Vous avez 3 tickets en jeu', time: 'hier', unread: false },
];

export default function Notifications() {
  const navigation        = useNavigation();
  const [tab, setTab]     = useState<NotifTab>('all');

  const filtered = tab === 'all'
    ? MOCK_NOTIFS
    : MOCK_NOTIFS.filter((n) => n.type === tab);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <TouchableOpacity>
          <Text style={styles.markAll}>Tout lire</Text>
        </TouchableOpacity>
      </View>

      {/* Onglets */}
      <View style={styles.tabsRow}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            onPress={() => setTab(t.key)}
            style={[styles.tabBtn, tab === t.key && styles.tabBtnActive]}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Liste */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.notifRow, item.unread && styles.notifUnread]}
            accessibilityLabel={item.title}
          >
            <View style={styles.notifIcon}>
              <Text style={styles.notifEmoji}>{item.icon}</Text>
              {item.unread && <View style={styles.unreadDot} />}
            </View>
            <View style={styles.notifContent}>
              <Text style={[styles.notifTitle, item.unread && styles.notifTitleBold]}>
                {item.title}
              </Text>
              <Text style={styles.notifSub} numberOfLines={1}>{item.sub}</Text>
            </View>
            <Text style={styles.notifTime}>{item.time}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  backBtn:  { padding: spacing.xs },
  backIcon: { fontSize: 28, color: colors.ink },
  title:    { fontFamily: fontFamily.bold, fontSize: fontSize.lg, color: colors.ink },
  markAll:  { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.primary },
  tabsRow:  { flexDirection: 'row', paddingHorizontal: spacing.md, gap: spacing.sm, marginBottom: spacing.sm },
  tabBtn:   {
    paddingHorizontal: spacing.md, paddingVertical: spacing.xs,
    borderRadius: radius.full, borderWidth: 1, borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  tabBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  tabText:      { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.inkMute },
  tabTextActive:{ color: colors.white },
  notifRow:    {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: spacing.md, paddingVertical: spacing.md,
    borderBottomWidth: 1, borderBottomColor: colors.border, gap: spacing.md,
  },
  notifUnread:  { backgroundColor: colors.primarySoft },
  notifIcon:    { position: 'relative' },
  notifEmoji:   { fontSize: 28 },
  unreadDot:    {
    position: 'absolute', top: 0, right: -2,
    width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary,
  },
  notifContent:    { flex: 1 },
  notifTitle:      { fontFamily: fontFamily.regular, fontSize: fontSize.md, color: colors.ink },
  notifTitleBold:  { fontFamily: fontFamily.bold },
  notifSub:        { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.inkMute, marginTop: 2 },
  notifTime:       { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute },
});
