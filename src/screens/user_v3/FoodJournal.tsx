import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const DAYS = ['L', 'M', 'Me', 'J', 'V', 'S', 'D'];
const TODAY = 4;

const MEALS = [
  { time: 'Matin · 08:15',   dish: 'Bouillie de maïs',  cal: 320, note: null          },
  { time: 'Midi · 13:05',    dish: 'Ndolé & Miondo',    cal: 620, note: 'Sans piment' },
  { time: 'Goûter · 16:30',  dish: 'Beignets haricots', cal: 210, note: null          },
];

const GOAL_KCAL = 2000;
const CONSUMED  = MEALS.reduce((s, m) => s + m.cal, 0);

export default function FoodJournal() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const [activeDay, setActiveDay] = useState(TODAY);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>Journal alimentaire</Text>
        <TouchableOpacity style={{ width: 36, height: 36, borderWidth: 1, borderColor: C.border, borderRadius: 18, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="BarChart2" size={16} color="#6D4C41" />
        </TouchableOpacity>
      </View>

      {/* Week selector */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingHorizontal: 16, paddingVertical: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        {DAYS.map((day, i) => (
          <TouchableOpacity key={i} onPress={() => setActiveDay(i)}
            style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: i === activeDay ? '#E8591A' : 'transparent' }}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: i === activeDay ? '#fff' : '#6D4C41' }}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>

        {/* Calories summary */}
        <View style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, marginBottom: 16, ...SHADOW_SM }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 1 }}>Calories</Text>
            <Text style={{ fontSize: 12, color: C.inkMute }}>{CONSUMED} / {GOAL_KCAL} kcal</Text>
          </View>
          <View style={{ height: 10, backgroundColor: '#E5E0D8', borderRadius: 5, overflow: 'hidden', marginBottom: 10 }}>
            <View style={{ height: '100%', borderRadius: 5, backgroundColor: '#E8591A', width: `${Math.min(100, (CONSUMED / GOAL_KCAL) * 100)}%` }} />
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            {[
              { v: String(CONSUMED),             l: 'Consommés', color: '#E8591A' },
              { v: String(GOAL_KCAL - CONSUMED), l: 'Restants',  color: '#2E7D32' },
              { v: '0',                          l: 'Brûlés',    color: '#F9A825' },
            ].map((s, i) => (
              <View key={i} style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: s.color }}>{s.v}</Text>
                <Text style={{ fontSize: 12, color: C.inkMute }}>{s.l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Macros */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          {[
            { v: '68g',  l: 'Protéines', color: '#2E7D32', pct: 75 },
            { v: '145g', l: 'Glucides',  color: '#E8591A', pct: 58 },
            { v: '32g',  l: 'Lipides',   color: '#F9A825', pct: 40 },
          ].map((m, i) => (
            <View key={i} style={{ flex: 1, padding: 12, borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, alignItems: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: m.color }}>{m.v}</Text>
              <Text style={{ fontSize: 11, color: C.inkMute, marginBottom: 6 }}>{m.l}</Text>
              <View style={{ width: '100%', height: 4, backgroundColor: '#E5E0D8', borderRadius: 2, overflow: 'hidden' }}>
                <View style={{ height: '100%', borderRadius: 2, width: `${m.pct}%`, backgroundColor: m.color }} />
              </View>
            </View>
          ))}
        </View>

        {/* Meals */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>Repas du jour</Text>
        <View style={{ gap: 12 }}>
          {MEALS.map((meal, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', padding: 14, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: '#FEF3EC', borderWidth: 1, borderColor: 'rgba(232,89,26,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="ChefHat" size={20} color="#E8591A" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{meal.dish}</Text>
                <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 1 }}>{meal.time}</Text>
                {meal.note ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <Icon name="FileText" size={11} color="#E8591A" />
                    <Text style={{ fontSize: 11, color: '#E8591A' }}>{meal.note}</Text>
                  </View>
                ) : null}
              </View>
              <Text style={{ fontSize: 13, fontWeight: '700', color: C.inkSoft }}>{meal.cal} kcal</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={{ position: 'absolute', bottom: 24, right: 16, width: 52, height: 52, borderRadius: 26, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center', shadowColor: '#E8591A', shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6 }}>
        <Icon name="Plus" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
