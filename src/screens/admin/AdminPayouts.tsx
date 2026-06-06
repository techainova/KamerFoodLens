// src/screens/admin/AdminPayouts.tsx
// Virements Pro — approuver ou rejeter les demandes

import React, { useState } from 'react';
import {
  FlatList, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

interface PayoutRequest {
  id:          string;
  pro:         string;
  type:        string;
  amountXAF:   number;
  method:      string;
  requestedAt: string;
  status:      'pending' | 'approved' | 'rejected';
}

const MOCK_PAYOUTS: PayoutRequest[] = [
  { id: '1', pro: 'Chez Maman Pauline', type: 'Restaurant', amountXAF: 67500,  method: 'Orange Money (+237 6XX)',  requestedAt: 'il y a 2h',  status: 'pending' },
  { id: '2', pro: 'Chef Joelle K.',     type: 'Chef',       amountXAF: 45000,  method: 'MTN MoMo (+237 6XX)',     requestedAt: 'il y a 5h',  status: 'pending' },
  { id: '3', pro: 'Ecole des Saveurs',  type: 'Ecole',      amountXAF: 120000, method: 'Orange Money (+237 6XX)', requestedAt: 'hier',        status: 'pending' },
];

export default function AdminPayouts() {
  const navigation = useNavigation();
  const [payouts, setPayouts] = useState<PayoutRequest[]>(MOCK_PAYOUTS);

  function approve(id: string) {
    setPayouts((prev) => prev.map((p) => p.id === id ? { ...p, status: 'approved' as const } : p));
  }
  function reject(id: string) {
    setPayouts((prev) => prev.map((p) => p.id === id ? { ...p, status: 'rejected' as const } : p));
  }

  const total = payouts.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amountXAF, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>x</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Virements Pro</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Recap */}
      <View style={styles.recap}>
        <Text style={styles.recapLabel}>Total en attente</Text>
        <Text style={styles.recapValue}>{total.toLocaleString()} XAF</Text>
        <Text style={styles.recapCount}>
          {payouts.filter((p) => p.status === 'pending').length} demande(s)
        </Text>
      </View>

      <FlatList
        data={payouts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.payoutCard}>
            <View style={styles.payoutHeader}>
              <View>
                <Text style={styles.proName}>{item.pro}</Text>
                <Text style={styles.proType}>{item.type} · {item.requestedAt}</Text>
                <Text style={styles.method}>{item.method}</Text>
              </View>
              <View>
                <Text style={styles.amount}>{item.amountXAF.toLocaleString()}</Text>
                <Text style={styles.currency}>XAF</Text>
              </View>
            </View>

            {item.status === 'pending' ? (
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.approveBtn}
                  onPress={() => approve(item.id)}
                  accessibilityLabel="Approuver le virement"
                >
                  <Text style={styles.approveBtnText}>Approuver le virement</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() => reject(item.id)}
                  accessibilityLabel="Rejeter"
                >
                  <Text style={styles.rejectBtnText}>Rejeter</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={[styles.statusBadgeRow,
                { backgroundColor: item.status === 'approved' ? colors.successSoft : colors.errorSoft }]}>
                <Text style={[styles.statusBadgeText,
                  { color: item.status === 'approved' ? colors.success : colors.error }]}>
                  {item.status === 'approved' ? 'Virement approuve' : 'Virement rejete'}
                </Text>
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
  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.navy },
  backBtn: { padding: spacing.xs },
  backIcon:{ fontSize: 18, color: colors.white, fontWeight: 'bold' },
  title:   { fontFamily: fontFamily.bold, fontSize: fontSize.lg, color: colors.white },
  recap:   { backgroundColor: colors.navy, paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, alignItems: 'center' },
  recapLabel:{ fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: 'rgba(255,255,255,0.6)' },
  recapValue:{ fontFamily: fontFamily.serifBold, fontSize: 36, color: colors.white },
  recapCount:{ fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: 'rgba(255,255,255,0.6)' },
  list:    { padding: spacing.md },
  payoutCard:  { backgroundColor: colors.surface, borderRadius: radius.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' },
  payoutHeader:{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', padding: spacing.md },
  proName:     { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },
  proType:     { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.inkMute },
  method:      { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.inkSoft, marginTop: 2 },
  amount:      { fontFamily: fontFamily.serifBold, fontSize: fontSize.xxl, color: colors.success, textAlign: 'right' },
  currency:    { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute, textAlign: 'right' },
  actions:     { flexDirection: 'row', borderTopWidth: 1, borderTopColor: colors.border },
  approveBtn:  { flex: 2, paddingVertical: spacing.sm, alignItems: 'center', backgroundColor: colors.successSoft },
  approveBtnText:{ fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: colors.success },
  rejectBtn:   { flex: 1, paddingVertical: spacing.sm, alignItems: 'center', backgroundColor: colors.errorSoft, borderLeftWidth: 1, borderLeftColor: colors.border },
  rejectBtnText:{ fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: colors.error },
  statusBadgeRow:{ paddingVertical: spacing.sm, alignItems: 'center' },
  statusBadgeText:{ fontFamily: fontFamily.bold, fontSize: fontSize.sm },
});
