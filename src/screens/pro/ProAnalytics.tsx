import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const PERIODS = ['7j', '30j', '3m', '1an'];
// Multiplier per period applied to base (7j) values to keep numbers plausible but not static.
const PERIOD_FACTORS = [1, 4.1, 11.5, 46];

const BARS = [
  { day: 'Lu', h: 60 }, { day: 'Ma', h: 80 }, { day: 'Me', h: 45 },
  { day: 'Je', h: 90 }, { day: 'Ve', h: 70 }, { day: 'Sa', h: 100 }, { day: 'Di', h: 55 },
];
const TOP_DISHES = [
  { name: 'Ndolé',     orders: 87, pct: 34 },
  { name: 'Eru',       orders: 54, pct: 21 },
  { name: 'Poulet DG', orders: 43, pct: 17 },
];

const BASE_REVENUE = 247500;
const BASE_ORDERS = 256;
const BASE_RATING = 4.8;
const BASE_SATISFACTION = 94;
const BASE_GROWTH = 18;

export default function ProAnalytics() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [period, setPeriod] = useState(0);
  const maxH = Math.max(...BARS.map(b => b.h));

  const factor = PERIOD_FACTORS[period];
  const revenue = Math.round((BASE_REVENUE * factor) / 100) * 100;
  const orders = Math.round(BASE_ORDERS * factor);
  const rating = Math.min(5, BASE_RATING + period * 0.03).toFixed(1);
  const satisfaction = Math.min(99, Math.round(BASE_SATISFACTION + period * 1.2));
  const growth = Math.round(BASE_GROWTH - period * 2.5);

  const stats = [
    { v: String(orders), l: t('proAnalytics.orders'), delta: `+${Math.max(2, 12 - period * 2)}%` },
    { v: rating, l: t('proAnalytics.avgRating'), delta: '+0.2' },
    { v: `${satisfaction}%`, l: t('proAnalytics.satisfaction'), delta: `+${Math.max(1, 3 - period)}%` },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('proAnalytics.title')}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Period selector */}
        <View style={{ flexDirection: 'row', backgroundColor: C.surface2, borderRadius: 14, padding: 4, marginBottom: 20 }}>
          {PERIODS.map((p, i) => (
            <TouchableOpacity
              key={i} onPress={() => setPeriod(i)}
              style={{ flex: 1, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: period === i ? C.surface : 'transparent', ...(period === i ? SHADOW_SM : {}) }}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: period === i ? C.ink : C.inkMute }}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Revenue hero */}
        <View style={{ padding: 16, borderRadius: 20, backgroundColor: C.navy, marginBottom: 16 }}>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 4 }}>{t('proAnalytics.revenue')}</Text>
          <Text style={{ color: '#fff', fontSize: 24, fontFamily: 'PlayfairDisplay-Bold', marginBottom: 6 }}>{revenue.toLocaleString()} XAF</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.successSoft, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10 }}>
              <Icon name="TrendingUp" size={11} color={C.success} />
              <Text style={{ color: C.success, fontSize: 11, fontWeight: '700' }}>+{growth}%</Text>
            </View>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{t('proAnalytics.vsPreviousPeriod')}</Text>
          </View>
        </View>

        {/* Stats row */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          {stats.map((s, i) => (
            <View key={i} style={{ flex: 1, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 12, alignItems: 'center', ...SHADOW_SM }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink }}>{s.v}</Text>
              <Text style={{ fontSize: 10, color: C.inkMute, textAlign: 'center', marginTop: 2 }}>{s.l}</Text>
              <View style={{ backgroundColor: C.successSoft, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8, marginTop: 4 }}>
                <Text style={{ color: C.success, fontSize: 9, fontWeight: '600' }}>{s.delta}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Bar chart */}
        <View style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, marginBottom: 16, ...SHADOW_SM }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: C.ink, marginBottom: 12 }}>{t('proAnalytics.ordersPerDay')}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-around', height: 80, marginBottom: 8 }}>
            {BARS.map((b, i) => (
              <View key={i} style={{ alignItems: 'center', width: 30 }}>
                <View style={{ width: 18, borderRadius: 4, backgroundColor: C.primary, height: Math.round((b.h / maxH) * 72) }} />
              </View>
            ))}
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
            {BARS.map((b, i) => (
              <Text key={i} style={{ fontSize: 10, color: C.inkMute, width: 30, textAlign: 'center' }}>{b.day}</Text>
            ))}
          </View>
        </View>

        {/* Top dishes */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>{t('proAnalytics.popularDishes')}</Text>
        <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
          {TOP_DISHES.map((dish, i) => (
            <View key={i} style={{ paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: i < 2 ? 1 : 0, borderColor: C.border }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <Text style={{ fontSize: 14, color: C.ink }}>{dish.name}</Text>
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.primary }}>{Math.round(dish.orders * factor)} {t('proAnalytics.ordersUnit')} · {dish.pct}%</Text>
              </View>
              <View style={{ height: 4, backgroundColor: C.surface2, borderRadius: 2, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${dish.pct}%`, backgroundColor: C.primary, borderRadius: 2 }} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
