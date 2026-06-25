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

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const WEEK_DATA = [
  { dayKey: 'mon', kcal: 1850 },
  { dayKey: 'tue', kcal: 1620 },
  { dayKey: 'wed', kcal: 1420, today: true },
  { dayKey: 'thu', kcal: 0 },
  { dayKey: 'fri', kcal: 0 },
  { dayKey: 'sat', kcal: 0 },
  { dayKey: 'sun', kcal: 0 },
];

const GOAL_KCAL = 2000;
const maxKcal = Math.max(...WEEK_DATA.map(d => d.kcal), GOAL_KCAL + 200);

const TOP_DISHES = [
  { name: 'Ndolé',          count: 5, color: '#E8591A' },
  { name: 'Eru',            count: 3, color: '#F9A825' },
  { name: 'Plantains frits', count: 2, color: '#2E7D32' },
];

const PERIODS = ['journalStats.periodWeek', 'journalStats.periodMonth', 'journalStats.periodAll'] as const;

export default function JournalStats() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [period, setPeriod] = useState(0);

  const weekAvg = Math.round(WEEK_DATA.filter(d => d.kcal > 0).reduce((s, d) => s + d.kcal, 0) / Math.max(1, WEEK_DATA.filter(d => d.kcal > 0).length));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('journal.stats')}</Text>
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 12, flexDirection: 'row', gap: 6 }}>
        {PERIODS.map((key, i) => (
          <TouchableOpacity
            key={key}
            onPress={() => setPeriod(i)}
            style={{ height: 32, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: i === period ? C.primary : C.surface, borderColor: i === period ? C.primary : C.border }}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: i === period ? '#fff' : C.inkSoft }}>{t(key)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Goal card */}
        <TouchableOpacity
          onPress={() => navigation.navigate('AccessibilitySettings')}
          style={{ marginTop: 14, padding: 12, borderWidth: 1, borderColor: C.border, borderRadius: 12, backgroundColor: C.surface, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}
        >
          <View>
            <Text style={{ fontSize: 11, color: C.inkMute }}>{t('journal.objective')}</Text>
            <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, fontWeight: '700', color: C.ink }}>{GOAL_KCAL.toLocaleString()} kcal/{t('journalStats.perDay')}</Text>
            <Text style={{ fontSize: 10, color: C.inkMute, marginTop: 4 }}>{t('journalStats.basedOnProfile')}</Text>
          </View>
          <Text style={{ fontSize: 12, color: C.primary, fontWeight: '600' }}>{t('journal.modify')} →</Text>
        </TouchableOpacity>

        {/* Weekly bar chart */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginTop: 20, marginBottom: 12 }}>{t('journalStats.thisWeek')}</Text>
        <View style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
          <View style={{ position: 'relative' }}>
            <View style={{ position: 'absolute', left: 0, right: 0, top: 16, borderTopWidth: 1, borderStyle: 'dashed', borderColor: C.inkMute }}>
              <Text style={{ position: 'absolute', right: 0, top: -16, fontSize: 9, color: C.inkMute, backgroundColor: C.surface, paddingHorizontal: 4 }}>
                {t('journalStats.goalAbbrev')} {GOAL_KCAL.toLocaleString()}
              </Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', height: 110, marginBottom: 8 }}>
              {WEEK_DATA.map((d, i) => (
                <View key={i} style={{ alignItems: 'center', width: 28 }}>
                  {d.kcal > 0 && <Text style={{ fontSize: 9, fontWeight: '700', color: d.today ? C.primary : C.inkMute, marginBottom: 2 }}>{d.kcal}</Text>}
                  <View style={{
                    width: '100%', borderRadius: 4,
                    height: d.kcal > 0 ? Math.round((d.kcal / maxKcal) * 96) : 8,
                    backgroundColor: d.kcal > 0
                      ? d.kcal > GOAL_KCAL ? C.error : d.kcal >= GOAL_KCAL * 0.9 ? C.success : C.primary
                      : 'transparent',
                    borderWidth: d.kcal > 0 ? 0 : 1.5,
                    borderStyle: d.kcal > 0 ? 'solid' : 'dashed',
                    borderColor: C.border,
                  }} />
                </View>
              ))}
            </View>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            {WEEK_DATA.map((d, i) => (
              <Text key={i} style={{ fontSize: 11, width: 28, textAlign: 'center', color: d.today ? C.primary : C.inkMute, fontWeight: d.today ? '700' : '500' }}>
                {t(`journalStats.day${d.dayKey}`)}
              </Text>
            ))}
          </View>
        </View>

        {/* Top dishes */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginTop: 20, marginBottom: 12 }}>{t('journalStats.mostEaten')}</Text>
        <View style={{ gap: 10 }}>
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

        {/* Nutrition split */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginTop: 20, marginBottom: 12 }}>{t('journalStats.nutritionSplit')}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {[
            { e: '🥩', l: t('journal.protein'), v: 22, bg: C.successSoft },
            { e: '🍞', l: t('journal.carbs'),   v: 58, bg: C.goldSoft },
            { e: '🫒', l: t('journal.fat'),      v: 20, bg: C.surface2 },
          ].map((s, i) => (
            <View key={i} style={{ flex: 1, padding: 12, borderRadius: 12, backgroundColor: s.bg, alignItems: 'center' }}>
              <Text style={{ fontSize: 18 }}>{s.e}</Text>
              <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, fontWeight: '700', color: C.ink, marginTop: 4 }}>{s.v}%</Text>
              <Text style={{ fontSize: 10, color: C.inkMute }}>{s.l}</Text>
            </View>
          ))}
        </View>

        {/* Trend */}
        <View style={{ marginTop: 20, padding: 12, backgroundColor: C.successSoft, borderRadius: 12 }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: C.success, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>
            ✓ {t('journal.trend')}
          </Text>
          <Text style={{ fontSize: 12, color: C.inkSoft, lineHeight: 18 }}>
            {t('journalStats.trendText', { avg: weekAvg.toLocaleString(), diff: (GOAL_KCAL - weekAvg).toLocaleString() })} {t('journal.goodBalance')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
