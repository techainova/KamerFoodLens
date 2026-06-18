import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

type TxType = 'debit' | 'credit';

const TRANSACTIONS: {
  id: string; type: TxType; label: string; category: string;
  amount: number; date: string; method: string;
}[] = [
  { id: 'T1',  type: 'debit',  label: 'Tombola KFL — 5 billets',       category: 'Paiements',      amount: 2500,  date: '16 Juin · 14:30', method: 'MTN'    },
  { id: 'T2',  type: 'credit', label: 'Recharge MTN Mobile Money',     category: 'Recharges',      amount: 10000, date: '15 Juin · 11:02', method: 'MTN'    },
  { id: 'T3',  type: 'debit',  label: 'Cours — Cuisine traditionnelle', category: 'Paiements',      amount: 5000,  date: '12 Juin · 09:45', method: 'Orange' },
  { id: 'T4',  type: 'credit', label: 'Bonus Quiz — 500 XP convertis', category: 'Bonus',          amount: 500,   date: '10 Juin · 20:15', method: 'KFL'    },
  { id: 'T5',  type: 'debit',  label: 'Commande Chez Mama Pauline',    category: 'Paiements',      amount: 11500, date: '08 Juin · 13:22', method: 'Carte'  },
  { id: 'T6',  type: 'credit', label: 'Remboursement commande #4821',  category: 'Remboursements', amount: 4500,  date: '05 Juin · 10:08', method: 'MTN'    },
  { id: 'T7',  type: 'debit',  label: 'Abonnement KFL Pro — Mensuel',  category: 'Paiements',      amount: 3000,  date: '01 Juin · 08:00', method: 'Orange' },
  { id: 'T8',  type: 'credit', label: 'Recharge Orange Money',         category: 'Recharges',      amount: 5000,  date: '28 Mai · 16:40',  method: 'Orange' },
  { id: 'T9',  type: 'credit', label: 'Bonus Parrainage — Amah K.',    category: 'Bonus',          amount: 1500,  date: '22 Mai · 09:12',  method: 'KFL'    },
  { id: 'T10', type: 'debit',  label: 'Billets Tombola — 3 billets',   category: 'Paiements',      amount: 1500,  date: '18 Mai · 19:35',  method: 'MTN'    },
];

const FILTERS = ['Tous', 'Paiements', 'Recharges', 'Bonus', 'Remboursements'];

export default function TransactionHistory() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const [filter, setFilter] = useState('Tous');

  const filtered = filter === 'Tous'
    ? TRANSACTIONS
    : TRANSACTIONS.filter(tx => tx.category === filter);

  const totalDebit  = filtered.filter(tx => tx.type === 'debit') .reduce((s, tx) => s + tx.amount, 0);
  const totalCredit = filtered.filter(tx => tx.type === 'credit').reduce((s, tx) => s + tx.amount, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>Historique</Text>
        <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="Filter" size={16} color="#6D4C41" />
        </TouchableOpacity>
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
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }}
        style={{ backgroundColor: C.surface, maxHeight: 52, borderBottomWidth: 1, borderColor: C.border }}
      >
        {FILTERS.map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setFilter(tab)}
            style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: tab === filter ? '#E8591A' : '#F5F0EB', borderWidth: 1, borderColor: tab === filter ? '#E8591A' : '#E5E0D8' }}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: tab === filter ? '#fff' : '#6D4C41' }}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
                <Text style={{ fontSize: 13, fontWeight: '600', color: C.ink, marginBottom: 3 }} numberOfLines={1}>{tx.label}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ fontSize: 11, color: C.inkMute }}>{tx.date}</Text>
                  <View style={{ width: 3, height: 3, borderRadius: 1.5, backgroundColor: '#E5E0D8' }} />
                  <Text style={{ fontSize: 11, color: C.inkMute }}>{tx.method}</Text>
                </View>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: tx.type === 'credit' ? '#2E7D32' : '#E8591A' }}>
                  {tx.type === 'credit' ? '+' : '-'}{tx.amount.toLocaleString()} XAF
                </Text>
                <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, backgroundColor: C.successSoft, marginTop: 3 }}>
                  <Text style={{ fontSize: 9, fontWeight: '700', color: '#2E7D32' }}>OK</Text>
                </View>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
