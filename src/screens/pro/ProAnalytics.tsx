import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const PERIODS = ['7j', '30j', '3m', '1an'];
const BARS = [
  { day: 'Lu', h: 60 }, { day: 'Ma', h: 80 }, { day: 'Me', h: 45 },
  { day: 'Je', h: 90 }, { day: 'Ve', h: 70 }, { day: 'Sa', h: 100 }, { day: 'Di', h: 55 },
];
const TOP_DISHES = [
  { name: 'Ndolé',     orders: 87, pct: 34 },
  { name: 'Eru',       orders: 54, pct: 21 },
  { name: 'Poulet DG', orders: 43, pct: 17 },
];

export default function ProAnalytics() {
  const navigation = useNavigation<any>();
  const [period, setPeriod] = useState(0);
  const maxH = Math.max(...BARS.map(b => b.h));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Analytiques</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Period selector */}
        <View style={{ flexDirection: 'row', backgroundColor: '#F5F0EB', borderRadius: 14, padding: 4, marginBottom: 20 }}>
          {PERIODS.map((p, i) => (
            <TouchableOpacity
              key={i} onPress={() => setPeriod(i)}
              style={{ flex: 1, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: period === i ? '#fff' : 'transparent', ...(period === i ? SHADOW_SM : {}) }}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: period === i ? '#2C1810' : '#8C8278' }}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Revenue hero */}
        <View style={{ padding: 16, borderRadius: 20, backgroundColor: '#1A237E', marginBottom: 16 }}>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 4 }}>Revenus</Text>
          <Text style={{ color: '#fff', fontSize: 24, fontFamily: 'PlayfairDisplay-Bold', marginBottom: 6 }}>247 500 XAF</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#E3F0E4', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
              <Icon name="TrendingUp" size={11} color="#2E7D32" />
              <Text style={{ color: '#2E7D32', fontSize: 11, fontWeight: '700' }}>+18%</Text>
            </View>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>vs période précédente</Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          {[
            { v: '256', l: 'Commandes', delta: '+12%' },
            { v: '4.8', l: 'Note moy.', delta: '+0.2' },
            { v: '94%', l: 'Satisfaction', delta: '+3%' },
          ].map((s, i) => (
            <View key={i} style={{ flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 16, padding: 12, alignItems: 'center', ...SHADOW_SM }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#2C1810' }}>{s.v}</Text>
              <Text style={{ fontSize: 10, color: '#8C8278', textAlign: 'center', marginTop: 2 }}>{s.l}</Text>
              <View style={{ backgroundColor: '#E3F0E4', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, marginTop: 4 }}>
                <Text style={{ color: '#2E7D32', fontSize: 9, fontWeight: '600' }}>{s.delta}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bar chart */}
        <View style={{ padding: 16, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', marginBottom: 16, ...SHADOW_SM }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#2C1810', marginBottom: 12 }}>Commandes / jour</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', height: 80, marginBottom: 8 }}>
            {BARS.map((b, i) => (
              <View key={i} style={{ alignItems: 'center', width: 30 }}>
                <View style={{ width: 18, borderRadius: 4, backgroundColor: '#E8591A', height: Math.round((b.h / maxH) * 72) }} />
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            {BARS.map((b, i) => (
              <Text key={i} style={{ fontSize: 10, color: '#8C8278', width: 30, textAlign: 'center' }}>{b.day}</Text>
            ))}
          </View>
        </View>

        {/* Top dishes */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', marginBottom: 12 }}>Plats populaires</Text>
        <View style={{ borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', overflow: 'hidden', ...SHADOW_SM }}>
          {TOP_DISHES.map((dish, i) => (
            <View key={i} style={{ paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: i < 2 ? 1 : 0, borderColor: '#F5F0EB' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <Text style={{ fontSize: 14, color: '#2C1810' }}>{dish.name}</Text>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#E8591A' }}>{dish.orders} cmds · {dish.pct}%</Text>
              </View>
              <View style={{ height: 4, backgroundColor: '#F5F0EB', borderRadius: 2, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${dish.pct}%`, backgroundColor: '#E8591A', borderRadius: 2 }} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
