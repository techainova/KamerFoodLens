import React from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';

type TxType = 'order' | 'subscription';

const TRANSACTIONS = [
  { id: '#TX-4821', user: 'Sami N.',   type: 'order' as TxType,        amount: 13000, commission: 650,  date: '15 Jun', status: 'paid'    },
  { id: '#TX-4715', user: 'Adèle B.',  type: 'subscription' as TxType, amount: 3000,  commission: 3000, date: '14 Jun', status: 'paid'    },
  { id: '#TX-4632', user: 'Chef Joël', type: 'order' as TxType,        amount: 8000,  commission: 400,  date: '12 Jun', status: 'pending' },
];

export default function AdminFinance() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();

  const SUMMARY = [
    { v: '1.4M XAF', l: t('admin.revenueMonth'), color: '#2E7D32', icon: 'DollarSign' as const },
    { v: '72k XAF',  l: t('admin.commissions'),  color: '#F9A825', icon: 'TrendingUp' as const },
    { v: '47',       l: t('admin.transactions'), color: '#1A237E', icon: 'List'       as const },
  ];

  const TX_TYPE_LABEL: Record<TxType, string> = {
    order:        t('pro.orders'),
    subscription: t('pro.subscription'),
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#1A237E' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12, padding: 4 }}>
          <Icon name="ArrowLeft" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', flex: 1 }}>{t('admin.financeAndRevenues')}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Summary cards */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          {SUMMARY.map((s, i) => (
            <View key={i} style={{ flex: 1, padding: 12, borderRadius: 16, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, alignItems: 'center', ...SHADOW_SM }}>
              <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: s.color + '15', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                <Icon name={s.icon} size={13} color={s.color} />
              </View>
              <Text style={{ fontSize: 14, fontWeight: '700', color: s.color }}>{s.v}</Text>
              <Text style={{ fontSize: 10, color: C.inkMute, textAlign: 'center', marginTop: 2 }}>{s.l}</Text>
            </View>
          ))}
        </View>

        {/* Transactions */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>{t('admin.recentTransactions')}</Text>
        <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
          {TRANSACTIONS.map((tx, i) => (
            <View key={i} style={{ paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: i < TRANSACTIONS.length - 1 ? 1 : 0, borderColor: C.border }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{tx.id} · {tx.user}</Text>
                  <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 2 }}>{TX_TYPE_LABEL[tx.type]} · {tx.date}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>{tx.amount.toLocaleString()} XAF</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 2 }}>
                    <Icon name="TrendingUp" size={10} color="#F9A825" />
                    <Text style={{ fontSize: 11, color: '#F9A825' }}>+{tx.commission.toLocaleString()} comm.</Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Export */}
        <TouchableOpacity style={{ marginTop: 16, height: 44, borderWidth: 1, borderColor: C.border, borderRadius: 22, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}>
          <Icon name="FileText" size={15} color="#6D4C41" />
          <Text style={{ fontSize: 14, color: C.inkSoft }}>{t('admin.exportReport')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
