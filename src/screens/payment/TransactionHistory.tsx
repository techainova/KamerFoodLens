import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator,
} from 'react-native';
import { Alert } from '@/utils/alert';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { paymentsService, type WalletTransaction } from '@/services/payments.service';

type Filter = 'all' | 'credit' | 'debit';
const FILTERS: { key: Filter; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'credit', label: 'Recharges' },
  { key: 'debit', label: 'Dépenses' },
];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
}

export default function TransactionHistory() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const [filter, setFilter] = useState<Filter>('all');
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { items } = await paymentsService.getTransactions(1);
        setTransactions(items);
      } catch {
        Alert.alert('Erreur', "Impossible de charger l'historique. Réessayez plus tard.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = filter === 'all' ? transactions : transactions.filter(tx => tx.type === filter);
  const totalDebit  = filtered.filter(tx => tx.type === 'debit') .reduce((s, tx) => s + tx.amountXAF, 0);
  const totalCredit = filtered.filter(tx => tx.type === 'credit').reduce((s, tx) => s + tx.amountXAF, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>Historique</Text>
      </View>

      {/* Summary row */}
      <View style={{ flexDirection: 'row', backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border, paddingVertical: 12 }}>
        <View style={{ flex: 1, alignItems: 'center', borderRightWidth: 1, borderColor: C.border }}>
          <Text style={{ fontSize: 11, color: C.inkMute, marginBottom: 2 }}>Dépenses</Text>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#E8591A' }}>-{totalDebit.toLocaleString()} XAF</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ fontSize: 11, color: C.inkMute, marginBottom: 2 }}>Crédités</Text>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#2E7D32' }}>+{totalCredit.toLocaleString()} XAF</Text>
        </View>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8, alignItems: 'center' }}
        style={{ flexGrow: 0, backgroundColor: C.surface, maxHeight: 52, borderBottomWidth: 1, borderColor: C.border }}
      >
        {FILTERS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setFilter(tab.key)}
            style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: tab.key === filter ? '#E8591A' : '#F5F0EB', borderWidth: 1, borderColor: tab.key === filter ? '#E8591A' : '#E5E0D8' }}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: tab.key === filter ? '#fff' : '#6D4C41' }}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.primary} size="large" />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 8 }} showsVerticalScrollIndicator={false}>
          {filtered.length === 0 ? (
            <View style={{ alignItems: 'center', paddingTop: 80 }}>
              <Icon name="FileText" size={48} color="rgba(140,130,120,0.28)" />
              <Text style={{ fontSize: 15, color: C.inkMute, marginTop: 12 }}>Aucune transaction</Text>
            </View>
          ) : (
            filtered.map(tx => (
              <View key={tx.id} style={{ backgroundColor: C.surface, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: tx.type === 'credit' ? '#E3F0E4' : '#FEF3EC', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={tx.type === 'credit' ? 'ArrowDown' : 'ArrowUp'} size={18} color={tx.type === 'credit' ? '#2E7D32' : '#E8591A'} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: C.ink, marginBottom: 3 }} numberOfLines={1}>{tx.description || (tx.type === 'credit' ? 'Recharge' : 'Paiement')}</Text>
                  <Text style={{ fontSize: 11, color: C.inkMute }}>{formatDate(tx.createdAt)}</Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: '700', color: tx.type === 'credit' ? '#2E7D32' : '#E8591A' }}>
                  {tx.type === 'credit' ? '+' : '-'}{tx.amountXAF.toLocaleString()} XAF
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
