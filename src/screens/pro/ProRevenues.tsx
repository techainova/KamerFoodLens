import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const PERIODS = ['Ce mois', '3 mois', '6 mois', '1 an'];
const BAR_DATA  = [80, 120, 95, 140, 110, 160, 195];
const BAR_LABELS = ['L', 'M', 'Me', 'J', 'V', 'S', 'D'];

const BREAKDOWN = [
  { l: 'Commandes restaurant', v: '145 800', pct: 75, color: '#E8591A' },
  { l: 'Abonnements formations', v: '38 400',  pct: 20, color: '#F9A825' },
  { l: 'Événements',             v: '11 200',  pct: 5,  color: '#2E7D32' },
];

export default function ProRevenues() {
  const navigation = useNavigation<any>();
  const [period, setPeriod] = useState(0);
  const maxVal = Math.max(...BAR_DATA);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Revenus</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Period tabs */}
        <View style={{ flexDirection: 'row', backgroundColor: '#F5F0EB', borderRadius: 18, padding: 4, marginBottom: 16 }}>
          {PERIODS.map((p, i) => (
            <TouchableOpacity
              key={i} onPress={() => setPeriod(i)}
              style={{ flex: 1, paddingVertical: 8, borderRadius: 14, alignItems: 'center', backgroundColor: i === period ? '#fff' : 'transparent', ...( i === period ? SHADOW_SM : {}) }}
            >
              <Text style={{ fontSize: 12, fontWeight: '500', color: i === period ? '#F9A825' : '#8C8278' }}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary hero */}
        <View style={{ padding: 16, borderRadius: 20, backgroundColor: '#1A237E', marginBottom: 16 }}>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Revenus nets</Text>
          <Text style={{ color: '#fff', fontSize: 28, fontFamily: 'PlayfairDisplay-Bold', marginVertical: 4 }}>195 400 XAF</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#2E7D32', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12 }}>
              <Icon name="TrendingUp" size={11} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>+12%</Text>
            </View>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>vs période précédente</Text>
          </View>
        </View>

        {/* Bar chart */}
        <View style={{ padding: 16, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', marginBottom: 16, ...SHADOW_SM }}>
          <Text style={{ fontSize: 12, color: '#8C8278', marginBottom: 12 }}>Revenus journaliers (k XAF)</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', height: 96, marginBottom: 8 }}>
            {BAR_DATA.map((v, i) => (
              <View key={i} style={{ alignItems: 'center', width: 28 }}>
                <View style={{ width: 20, borderRadius: 4, backgroundColor: '#F9A825', height: Math.round((v / maxVal) * 88) }} />
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            {BAR_LABELS.map((l, i) => (
              <Text key={i} style={{ fontSize: 11, color: '#8C8278', width: 28, textAlign: 'center' }}>{l}</Text>
            ))}
          </View>
        </View>

        {/* Breakdown */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', marginBottom: 12 }}>Répartition</Text>
        <View style={{ borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', overflow: 'hidden', ...SHADOW_SM }}>
          {BREAKDOWN.map((row, i) => (
            <View key={i} style={{ paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: i < 2 ? 1 : 0, borderColor: '#F5F0EB' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <Text style={{ fontSize: 13, color: '#2C1810' }}>{row.l}</Text>
                <Text style={{ fontSize: 13, fontWeight: '700', color: row.color }}>{row.v} XAF</Text>
              </View>
              <View style={{ height: 4, backgroundColor: '#F5F0EB', borderRadius: 2, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${row.pct}%`, backgroundColor: row.color, borderRadius: 2 }} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
