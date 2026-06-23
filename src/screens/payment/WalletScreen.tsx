import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };
const SHADOW_MD = { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 6, elevation: 4 };

type IconName = Parameters<typeof Icon>[0]['name'];

const METHODS: { id: string; label: string; icon: IconName; color: string; number: string }[] = [
  { id: 'mtn',    label: 'MTN MoMo',      icon: 'Smartphone', color: '#F9A825', number: '+237 6XX XXX 847' },
  { id: 'orange', label: 'Orange Money',  icon: 'Smartphone', color: '#E8591A', number: '+237 6XX XXX 123' },
  { id: 'card',   label: 'Visa ••• 4242', icon: 'CreditCard', color: '#1A237E', number: '' },
];

const RECENT: { id: string; type: 'debit' | 'credit'; label: string; amount: number; date: string }[] = [
  { id: 'T1', type: 'debit',  label: 'Tombola KFL — 5 billets',       amount: 2500,  date: "Aujourd'hui, 14:30" },
  { id: 'T2', type: 'credit', label: 'Recharge MTN Mobile Money',     amount: 10000, date: 'Hier, 11:02'        },
  { id: 'T3', type: 'debit',  label: 'Cours — Cuisine traditionnelle', amount: 5000,  date: '12 Juin, 09:45'    },
];

export default function WalletScreen() {
  const navigation = useNavigation<any>();
  const C = useColors();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>Mon Portefeuille</Text>
        <TouchableOpacity
          style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => navigation.navigate('TransactionHistory')}
        >
          <Icon name="List" size={16} color="#6D4C41" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 16 }} showsVerticalScrollIndicator={false}>

        {/* Balance hero */}
        <View style={{ borderRadius: 24, backgroundColor: '#1A237E', padding: 24, ...SHADOW_MD }}>
          <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>
            Solde disponible
          </Text>
          <Text style={{ fontSize: 36, fontFamily: 'PlayfairDisplay-Bold', color: '#fff', marginBottom: 4 }}>
            7 500{' '}
            <Text style={{ fontSize: 18, fontWeight: '400' }}>XAF</Text>
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 22 }}>
            <Icon name="Shield" size={12} color="rgba(255,255,255,0.4)" />
            <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Chiffré AES-256 · Sécurisé</Text>
          </View>

          {/* Quick actions */}
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {[
              { label: 'Recharger', icon: 'Plus'  as IconName, onPress: () => navigation.navigate('Payment') },
              { label: 'Retirer',   icon: 'ArrowUp' as IconName, onPress: () => {} },
              { label: 'Historique',icon: 'List'  as IconName, onPress: () => navigation.navigate('TransactionHistory') },
            ].map(action => (
              <TouchableOpacity
                key={action.label}
                onPress={action.onPress}
                style={{ flex: 1, alignItems: 'center', gap: 6 }}
                activeOpacity={0.75}
              >
                <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={action.icon} size={18} color="#fff" />
                </View>
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: '500' }}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Payment methods */}
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ flex: 1, fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: C.ink }}>Méthodes liées</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Payment')}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#E8591A' }}>+ Ajouter</Text>
            </TouchableOpacity>
          </View>
          <View style={{ gap: 8 }}>
            {METHODS.map(m => (
              <TouchableOpacity
                key={m.id}
                style={{ backgroundColor: C.surface, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}
                activeOpacity={0.85}
              >
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: m.color + '15', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={m.icon} size={20} color={m.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{m.label}</Text>
                  {!!m.number && <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 1 }}>{m.number}</Text>}
                </View>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#2E7D32' }} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent transactions */}
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ flex: 1, fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: C.ink }}>Transactions récentes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#E8591A' }}>Tout voir</Text>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: C.surface, borderRadius: 18, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
            {RECENT.map((tx, i) => (
              <View key={tx.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: i > 0 ? 1 : 0, borderColor: C.border }}>
                <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: tx.type === 'credit' ? '#E3F0E4' : '#FEF3EC', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={tx.type === 'credit' ? 'ArrowDown' : 'ArrowUp'} size={16} color={tx.type === 'credit' ? '#2E7D32' : '#E8591A'} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: C.ink }} numberOfLines={1}>{tx.label}</Text>
                  <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 1 }}>{tx.date}</Text>
                </View>
                <Text style={{ fontSize: 13, fontWeight: '700', color: tx.type === 'credit' ? '#2E7D32' : '#E8591A' }}>
                  {tx.type === 'credit' ? '+' : '-'}{tx.amount.toLocaleString()} XAF
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recharge CTA */}
        <TouchableOpacity
          style={{ height: 52, backgroundColor: '#E8591A', borderRadius: 26, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
          activeOpacity={0.85}
          onPress={() => navigation.navigate('Payment')}
        >
          <Icon name="Plus" size={18} color="#fff" />
          <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>Recharger mon portefeuille</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
