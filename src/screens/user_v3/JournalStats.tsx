import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const WEEK_DATA = [
  { day: 'L',  kcal: 1850, goal: 2000 },
  { day: 'M',  kcal: 2100, goal: 2000 },
  { day: 'Me', kcal: 1650, goal: 2000 },
  { day: 'J',  kcal: 1920, goal: 2000 },
  { day: 'V',  kcal: 1150, goal: 2000 },
  { day: 'S',  kcal: 0,    goal: 2000 },
  { day: 'D',  kcal: 0,    goal: 2000 },
];

const maxKcal = Math.max(...WEEK_DATA.map(d => d.kcal), 2000);

const TOP_DISHES = [
  { name: 'Ndolé',          count: 5, color: '#E8591A' },
  { name: 'Bouillie maïs',  count: 4, color: '#F9A825' },
  { name: 'Poulet DG',      count: 3, color: '#2E7D32' },
];

const PERIODS = ['Cette semaine', 'Ce mois', '3 mois'];

export default function JournalStats() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const [period, setPeriod] = useState(0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>Statistiques</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Period selector */}
        <View style={{ flexDirection: 'row', backgroundColor: C.surface2, borderRadius: 18, padding: 4, marginBottom: 20 }}>
          {PERIODS.map((p, i) => (
            <TouchableOpacity key={i} onPress={() => setPeriod(i)}
              style={{ flex: 1, paddingVertical: 8, borderRadius: 14, alignItems: 'center', backgroundColor: i === period ? '#fff' : 'transparent', ...(i === period ? SHADOW_SM : {}) }}>
              <Text style={{ fontSize: 12, fontWeight: '500', color: i === period ? '#E8591A' : '#8C8278' }}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Summary cards */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          {[
            { v: '1 934', l: 'Moy. kcal/j',      color: '#E8591A' },
            { v: '5/7',   l: 'Jours loggés',      color: '#2E7D32' },
            { v: '84%',   l: 'Objectif atteint',  color: '#F9A825' },
          ].map((s, i) => (
            <View key={i} style={{ flex: 1, padding: 14, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, alignItems: 'center', ...SHADOW_SM }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: s.color, fontFamily: 'PlayfairDisplay-Bold' }}>{s.v}</Text>
              <Text style={{ fontSize: 11, color: C.inkMute, textAlign: 'center', marginTop: 2 }}>{s.l}</Text>
            </View>
          ))}
        </View>

        {/* Calorie bar chart */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>Calories par jour</Text>
        <View style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, marginBottom: 20, ...SHADOW_SM }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', height: 110, marginBottom: 8 }}>
            {WEEK_DATA.map((d, i) => (
              <View key={i} style={{ alignItems: 'center', width: 28 }}>
                <View style={{
                  width: '100%', borderRadius: 4,
                  height: d.kcal > 0 ? Math.round((d.kcal / maxKcal) * 96) : 8,
                  backgroundColor: d.kcal > 0
                    ? d.kcal > d.goal ? '#C62828' : d.kcal >= d.goal * 0.9 ? '#2E7D32' : '#E8591A'
                    : '#E5E0D8',
                }} />
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <View style={{ width: 20, height: 1, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border }} />
            <Text style={{ fontSize: 11, color: C.inkMute }}>Objectif : 2 000 kcal</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            {WEEK_DATA.map((d, i) => (
              <Text key={i} style={{ fontSize: 11, color: C.inkMute, width: 28, textAlign: 'center' }}>{d.day}</Text>
            ))}
          </View>
        </View>

        {/* Top dishes */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>Plats les plus consommés</Text>
        <View style={{ gap: 10, marginBottom: 20 }}>
          {TOP_DISHES.map((dish, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: dish.color + '20' }}>
                <Icon name="ChefHat" size={20} color={dish.color} />
              </View>
              <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: C.ink }}>{dish.name}</Text>
              <View style={{ height: 24, paddingHorizontal: 10, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: dish.color + '20' }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: dish.color }}>{dish.count}×</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Nutrients */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>Macronutriments moyens</Text>
        <View style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
          {[
            { l: 'Protéines', v: '72g / 80g',   pct: 90, color: '#2E7D32' },
            { l: 'Glucides',  v: '148g / 250g',  pct: 59, color: '#E8591A' },
            { l: 'Lipides',   v: '55g / 65g',    pct: 85, color: '#F9A825' },
            { l: 'Fibres',    v: '18g / 25g',    pct: 72, color: '#1A237E' },
          ].map((n, i) => (
            <View key={i} style={{ paddingVertical: 10, borderBottomWidth: i < 3 ? 1 : 0, borderColor: C.border }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ fontSize: 14, color: C.ink }}>{n.l}</Text>
                <Text style={{ fontSize: 12, color: C.inkMute }}>{n.v}</Text>
              </View>
              <View style={{ height: 6, backgroundColor: '#E5E0D8', borderRadius: 3, overflow: 'hidden' }}>
                <View style={{ height: '100%', borderRadius: 3, width: `${n.pct}%`, backgroundColor: n.color }} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
