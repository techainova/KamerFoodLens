import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const PAYOUTS = [
  { pro: 'Chez Mama Pauline', owner: 'Maman Pauline', amount: 185500, method: 'MTN Money',    date: '15 Jun', status: 'pending' },
  { pro: 'Chef Joël Academy',  owner: 'Chef Joël',     amount: 94200,  method: 'Orange Money', date: '14 Jun', status: 'pending' },
  { pro: 'Kmer Saveurs',       owner: 'Kevin Bah',     amount: 41800,  method: 'MTN Money',    date: '13 Jun', status: 'paid' },
];

export default function AdminPayouts() {
  const navigation = useNavigation<any>();
  const pendingTotal = PAYOUTS.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#1A237E' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12, padding: 4 }}>
          <Icon name="ArrowLeft" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', flex: 1 }}>Virements Pro</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Pending hero */}
        <View style={{ padding: 16, borderRadius: 18, backgroundColor: '#1A237E', marginBottom: 20 }}>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>En attente de virement</Text>
          <Text style={{ color: '#fff', fontSize: 24, fontFamily: 'PlayfairDisplay-Bold', marginBottom: 4 }}>
            {pendingTotal.toLocaleString()} XAF
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>
            {PAYOUTS.filter(p => p.status === 'pending').length} virement{PAYOUTS.filter(p => p.status === 'pending').length > 1 ? 's' : ''} à approuver
          </Text>
        </View>

        <View style={{ gap: 12 }}>
          {PAYOUTS.map((payout, i) => (
            <View key={i} style={{ padding: 16, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', ...SHADOW_SM }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#2C1810' }}>{payout.pro}</Text>
                  <Text style={{ fontSize: 12, color: '#8C8278', marginTop: 2 }}>{payout.owner} · {payout.date}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <Icon name="Smartphone" size={11} color="#8C8278" />
                    <Text style={{ fontSize: 11, color: '#8C8278' }}>{payout.method}</Text>
                  </View>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 6 }}>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: '#2C1810' }}>{payout.amount.toLocaleString()} XAF</Text>
                  <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: payout.status === 'pending' ? '#FBF3DC' : '#E3F0E4' }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: payout.status === 'pending' ? '#F9A825' : '#2E7D32' }}>
                      {payout.status === 'pending' ? 'En attente' : 'Versé'}
                    </Text>
                  </View>
                </View>
              </View>
              {payout.status === 'pending' && (
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity style={{ flex: 1, height: 34, backgroundColor: '#E3F0E4', borderRadius: 17, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#2E7D32', fontSize: 12, fontWeight: '600' }}>Approuver</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1, height: 34, backgroundColor: '#FBDCDC', borderRadius: 17, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#C62828', fontSize: 12, fontWeight: '600' }}>Rejeter</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
