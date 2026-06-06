// src/screens/admin/AdminUsers.tsx
// Gestion utilisateurs — recherche + filtres + suspend/ban

import React from 'react';
import {
  FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAdmin } from '@/hooks/useAdmin';
import { WFAvatar } from '@/components/ui';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

const ROLE_COLOR: Record<string, string> = {
  standard: colors.inkMute,
  pro:      colors.gold,
  admin:    colors.navy,
};

const STATUS_COLOR: Record<string, string> = {
  active:    colors.success,
  suspended: colors.gold,
  banned:    colors.error,
};

export default function AdminUsers() {
  const navigation = useNavigation();
  const { users, searchQuery, setSearchQuery, suspendUser, banUser } = useAdmin();
  const [expandedId, setExpandedId] = React.useState<string | null>(null);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>x</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Utilisateurs</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{users.length}</Text>
        </View>
      </View>

      {/* Recherche */}
      <View style={styles.searchRow}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Rechercher un utilisateur..."
          placeholderTextColor={colors.inkMute}
          accessibilityLabel="Rechercher"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearIcon}>x</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const expanded = expandedId === item.id;
          return (
            <View style={styles.userCard}>
              {/* Ligne principale */}
              <TouchableOpacity
                style={styles.userRow}
                onPress={() => setExpandedId(expanded ? null : item.id)}
                accessibilityLabel={item.name}
              >
                <WFAvatar
                  initials={item.name.slice(0, 2)}
                  size="sm"
                  online={item.status === 'active'}
                />
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{item.name}</Text>
                  <Text style={styles.userEmail}>{item.email}</Text>
                  <View style={styles.userMetaRow}>
                    <View style={[styles.roleBadge, { backgroundColor: ROLE_COLOR[item.role] + '20' }]}>
                      <Text style={[styles.roleBadgeText, { color: ROLE_COLOR[item.role] }]}>
                        {item.role.toUpperCase()}
                      </Text>
                    </View>
                    <View style={[styles.statusDot, { backgroundColor: STATUS_COLOR[item.status] }]} />
                    <Text style={styles.userMeta}>{item.status} · {item.scans} scans</Text>
                  </View>
                </View>
                <Text style={styles.chevron}>{expanded ? 'v' : '>'}</Text>
              </TouchableOpacity>

              {/* Actions expandables */}
              {expanded && (
                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionText}>Profil</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionBtn}>
                    <Text style={styles.actionText}>Message</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.warnBtn]}
                    onPress={() => suspendUser(item.id)}
                    accessibilityLabel="Suspendre"
                  >
                    <Text style={[styles.actionText, styles.warnText]}>Suspendre 30j</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionBtn, styles.dangerBtn]}
                    onPress={() => banUser(item.id)}
                    accessibilityLabel="Bannir"
                  >
                    <Text style={[styles.actionText, styles.dangerText]}>Bannir</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.cream },
  header:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.navy, gap: spacing.sm },
  backBtn: { padding: spacing.xs },
  backIcon:{ fontSize: 18, color: colors.white, fontWeight: 'bold' },
  title:   { fontFamily: fontFamily.bold, fontSize: fontSize.lg, color: colors.white, flex: 1 },
  countBadge: { backgroundColor: colors.primary, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  countText:  { fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.white },

  searchRow: { flexDirection: 'row', alignItems: 'center', margin: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, gap: spacing.sm },
  searchIcon:  { fontSize: 16 },
  searchInput: { flex: 1, fontFamily: fontFamily.regular, fontSize: fontSize.md, color: colors.ink, paddingVertical: spacing.sm },
  clearIcon:   { fontSize: 14, color: colors.inkMute, padding: spacing.xs },

  list:     { paddingHorizontal: spacing.md, paddingBottom: 40 },
  userCard: { backgroundColor: colors.surface, borderRadius: radius.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  userRow:  { flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.md },
  userInfo: { flex: 1 },
  userName: { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },
  userEmail:{ fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.inkMute },
  userMetaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs, marginTop: 2 },
  roleBadge:   { borderRadius: radius.sm, paddingHorizontal: spacing.xs, paddingVertical: 1 },
  roleBadgeText:{ fontFamily: fontFamily.bold, fontSize: fontSize.xs },
  statusDot:   { width: 6, height: 6, borderRadius: 3 },
  userMeta:    { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute },
  chevron:     { fontSize: 14, color: colors.inkMute, fontWeight: 'bold' },

  actionsRow:  { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border },
  actionBtn:   { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', borderRightWidth: 1, borderRightColor: colors.border },
  actionText:  { fontFamily: fontFamily.medium, fontSize: fontSize.xs, color: colors.inkSoft },
  warnBtn:     { backgroundColor: colors.goldSoft },
  warnText:    { color: colors.gold },
  dangerBtn:   { backgroundColor: colors.errorSoft },
  dangerText:  { color: colors.error },
});
