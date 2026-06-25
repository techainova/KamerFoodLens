import React, { useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const GOAL_KCAL = 2000;

type MealItem = { name: string; region: string; kcal: number };
type Meal = { labelKey: 'breakfast' | 'lunch' | 'dinner' | 'snack'; time: string; items: MealItem[] };

const MEALS: Meal[] = [
  { labelKey: 'breakfast', time: '08:30', items: [{ name: 'Bouillie de maïs au lait', region: 'Centre', kcal: 320 }] },
  { labelKey: 'lunch',     time: '12:45', items: [
    { name: 'Ndolé', region: 'Littoral', kcal: 480 },
    { name: 'Plantains frits', region: 'Littoral', kcal: 200 },
  ] },
  { labelKey: 'dinner',    time: '19:00', items: [{ name: 'Eru', region: 'Sud-Ouest', kcal: 420 }] },
  { labelKey: 'snack',     time: '—',     items: [] },
];

const TABS = ['today', 'thisWeek', 'thisMonth'] as const;

export default function FoodJournal() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const consumed = MEALS.reduce((sum, m) => sum + m.items.reduce((s, it) => s + it.kcal, 0), 0);
  const remaining = Math.max(0, GOAL_KCAL - consumed);
  const pct = Math.min(100, Math.round((consumed / GOAL_KCAL) * 100));
  const mealCount = MEALS.filter((m) => m.items.length > 0).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('journal.title')}</Text>
        <TouchableOpacity style={{ width: 36, height: 36, borderWidth: 1, borderColor: C.border, borderRadius: 18, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="Calendar" size={16} color={C.inkSoft} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('JournalStats')} style={{ width: 36, height: 36, borderWidth: 1, borderColor: C.border, borderRadius: 18, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="TrendingUp" size={16} color={C.inkSoft} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>

        {/* Summary card */}
        <View style={{ margin: 16, padding: 14, borderRadius: 14, backgroundColor: C.goldSoft, borderWidth: 1, borderColor: C.primary }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Text style={{ fontWeight: '700', fontSize: 13, color: C.primary }}>{t('journal.today')}</Text>
            <Text style={{ fontSize: 11, color: C.inkMute }}>{mealCount} {t('journal.meals')}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 12 }}>
            {[
              { i: '🔥', v: consumed.toLocaleString(), l: t('journal.consumed'), color: C.ink },
              { i: '🎯', v: GOAL_KCAL.toLocaleString(), l: t('journal.goal'), color: C.inkSoft },
              { i: '✅', v: remaining.toLocaleString(), l: t('journal.remaining'), color: C.success },
            ].map((m, i) => (
              <View key={i} style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 16 }}>{m.i}</Text>
                <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, fontWeight: '700', color: m.color }}>{m.v}</Text>
                <Text style={{ fontSize: 9, color: C.inkMute }}>{m.l}</Text>
              </View>
            ))}
          </View>
          <View style={{ marginTop: 12, height: 6, backgroundColor: '#fff', borderRadius: 3, overflow: 'hidden' }}>
            <View style={{ width: `${pct}%`, height: '100%', backgroundColor: C.primary, borderRadius: 3 }} />
          </View>
          <Text style={{ fontSize: 10, color: C.inkMute, marginTop: 4 }}>
            {pct}% {t('journal.dailyGoalPct')}
          </Text>
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
          {TABS.map((key, i) => (
            <TouchableOpacity
              key={key}
              onPress={() => setActiveTab(i)}
              style={{ flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderColor: i === activeTab ? C.primary : 'transparent' }}
            >
              <Text style={{ fontSize: 13, fontWeight: i === activeTab ? '700' : '500', color: i === activeTab ? C.primary : C.inkMute }}>{t(`journal.${key}`)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Meals */}
        <View style={{ paddingTop: 8 }}>
          {MEALS.map((meal, i) => {
            const mealKcal = meal.items.reduce((s, it) => s + it.kcal, 0);
            return (
              <View key={i}>
                <View style={{ backgroundColor: C.surface2, paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <Text style={{ fontWeight: '700', fontSize: 13, color: C.ink }}>
                    {t(`journal.${meal.labelKey}`)} <Text style={{ fontSize: 11, color: C.inkMute, fontWeight: '400' }}>· {meal.time}</Text>
                  </Text>
                  <Text style={{ fontSize: 11, color: C.inkMute }}>{mealKcal} kcal</Text>
                </View>
                {meal.items.length === 0 ? (
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Camera')}
                    style={{ paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', alignItems: 'center', gap: 8 }}
                  >
                    <Icon name="Plus" size={14} color={C.primary} />
                    <Text style={{ fontSize: 12, fontWeight: '600', color: C.primary }}>{t('journal.addViaScan')}</Text>
                  </TouchableOpacity>
                ) : meal.items.map((it, j) => (
                  <View key={j} style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderColor: C.border, alignItems: 'center' }}>
                    <View style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="ChefHat" size={18} color={C.inkMute} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '600', fontSize: 13, color: C.ink }}>{it.name}</Text>
                      <Text style={{ fontSize: 11, color: C.inkMute }}>{it.region} · {it.kcal} kcal</Text>
                    </View>
                    <TouchableOpacity style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="X" size={12} color={C.inkMute} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        onPress={() => navigation.navigate('Camera')}
        style={{ position: 'absolute', bottom: 24, right: 16, alignItems: 'center', gap: 4 }}
      >
        <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', shadowColor: C.primary, shadowOpacity: 0.4, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6 }}>
          <Icon name="Camera" size={22} color="#fff" />
        </View>
        <Text style={{ fontSize: 10, color: C.inkMute }}>{t('home.scanCTA')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
