// src/screens/admin/AdminProList.tsx
// Validation comptes Pro — liste + approuver/rejeter

import React from 'react';
import {
  FlatList, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAdmin } from '@/hooks/useAdmin';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

const TYPE_EMOJI: Record<string, string> = {
  Restaurant: '🍽',
  Chef:       '👨‍🍳',
  Ecole:      '🎓',
};

export default function AdminProList() {
  const navigation = useNavigation();
  const { proRequests, approvePro, rejectPro } = useAdmin();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>x</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Demandes Pro</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{proRequests.filter((r) => r.status === 'pending').length}</Text>
        </View>
      </View>

      <FlatList
        data={proRequests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <Text style={styles.typeEmoji}>{TYPE_EMOJI[item.type] ?? '🏢'}</Text>
              <View style={styles.requestInfo}>
                <Text style={styles.businessName}>{item.businessName}</Text>
                <Text style={styles.owner}>{item.owner} · {item.type}</Text>
                <Text style={styles.submitted}>{item.submitted}</Text>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: item.status === 'pending' ? colors.goldSoft : item.status === 'approved' ? colors.successSoft : colors.errorSoft },
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: item.status === 'pending' ? colors.gold : item.status === 'approved' ? colors.success : colors.error },
                ]}>
                  {item.status === 'pending' ? 'En attente' : item.status === 'approved' ? 'Approuve' : 'Rejete'}
                </Text>
              </View>
            </View>

            {item.status === 'pending' && (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.approveBtn}
                  onPress={() => approvePro(item.id)}
                  accessibilityLabel="Approuver"
                >
                  <Text style={styles.approveBtnText}>Approuver (48h)</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() => rejectPro(item.id)}
                  accessibilityLabel="Rejeter"
                >
                  <Text style={styles.rejectBtnText}>Rejeter</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
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
  badge:   { backgroundColor: colors.error, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  badgeText:{ fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.white },
  list:    { padding: spacing.md },
  requestCard: { backgroundColor: colors.surface, borderRadius: radius.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  requestHeader:{ flexDirection: 'row', alignItems: 'flex-start', padding: spacing.md, gap: spacing.md },
  typeEmoji:    { fontSize: 28 },
  requestInfo:  { flex: 1 },
  businessName: { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },
  owner:        { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.inkMute },
  submitted:    { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute, marginTop: 2 },
  statusBadge:  { borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2, alignSelf: 'flex-start' },
  statusText:   { fontFamily: fontFamily.bold, fontSize: fontSize.xs },
  actions:      { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border },
  approveBtn:   { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', backgroundColor: colors.successSoft },
  approveBtnText:{ fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: colors.success },
  rejectBtn:    { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', backgroundColor: colors.errorSoft, borderLeftWidth: 1, borderLeftColor: colors.border },
  rejectBtnText:{ fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: colors.error },
});
