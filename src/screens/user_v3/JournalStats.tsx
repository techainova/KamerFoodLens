import React, { useEffect, useMemo, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM, SHADOW_MD, SHADOW_LG } from '@/constants/theme';
import { useJournalStore } from '@/store/journal.store';

const GOAL_KCAL = 2000;
const PERIODS = ['journalStats.periodWeek', 'journalStats.periodMonth', 'journalStats.periodAll'] as const;
const PERIOD_DAYS = [7, 30, 36500] as const;
const WEEKDAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

export default function JournalStats() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [period, setPeriod] = useState(0);

  const isLoading = useJournalStore((s) => s.isLoading);
  const fetchAll = useJournalStore((s) => s.fetchAll);
  const getByDay = useJournalStore((s) => s.getByDay);
  const getLastDays = useJournalStore((s) => s.getLastDays);
  const getKcalTotal = useJournalStore((s) => s.getKcalTotal);
  const getTopDishes = useJournalStore((s) => s.getTopDishes);
  const entriesVersion = useJournalStore((s) => s.entries);

  useEffect(() => {
    void fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const weekData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const kcal = getKcalTotal(getByDay(d.toISOString()));
      days.push({ dayKey: WEEKDAY_KEYS[d.getDay()], kcal, today: i === 0 });
    }
    return days;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entriesVersion]);

  const maxKcal = Math.max(...weekData.map((d) => d.kcal), GOAL_KCAL + 200);

  const periodEntries = useMemo(
    () => getLastDays(PERIOD_DAYS[period]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [period, entriesVersion],
  );
  const topDishes = useMemo(
    () => getTopDishes(PERIOD_DAYS[period]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [period, entriesVersion],
  );

  const daysWithEntries = new Set(periodEntries.map((e) => new Date(e.date).toDateString())).size;
  const periodAvg = daysWithEntries > 0 ? Math.round(getKcalTotal(periodEntries) / daysWithEntries) : 0;

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

      {isLoading && periodEntries.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#E8591A" />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

          {/* Goal card */}
          <View style={{ marginTop: 14, padding: 12, borderWidth: 1, borderColor: C.border, borderRadius: 12, backgroundColor: C.surface, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={{ fontSize: 11, color: C.inkMute }}>{t('journal.objective')}</Text>
              <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, fontWeight: '700', color: C.ink }}>{GOAL_KCAL.toLocaleString()} kcal/{t('journalStats.perDay')}</Text>
              <Text style={{ fontSize: 10, color: C.inkMute, marginTop: 4 }}>{t('journalStats.basedOnProfile')}</Text>
            </View>
          </View>

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
                {weekData.map((d, i) => (
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
              {weekData.map((d, i) => (
                <Text key={i} style={{ fontSize: 11, width: 28, textAlign: 'center', color: d.today ? C.primary : C.inkMute, fontWeight: d.today ? '700' : '500' }}>
                  {t(`journalStats.day${d.dayKey}`)}
                </Text>
              ))}
            </View>
          </View>

          {/* Top dishes */}
          <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginTop: 20, marginBottom: 12 }}>{t('journalStats.mostEaten')}</Text>
          {topDishes.length === 0 ? (
            <Text style={{ fontSize: 13, color: C.inkMute }}>{t('favorites.empty')}</Text>
          ) : (
            <View style={{ gap: 10 }}>
              {topDishes.map((dish) => (
                <View key={dish.dishName} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
                  <View style={{ width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: C.primary + '20' }}>
                    <Icon name="ChefHat" size={20} color={C.primary} />
                  </View>
                  <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: C.ink }}>{dish.dishName}</Text>
                  <View style={{ height: 24, paddingHorizontal: 10, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: C.primary + '20' }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: C.primary }}>{dish.count}×</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Trend */}
          {daysWithEntries > 0 && (
            <View style={{ marginTop: 20, padding: 12, backgroundColor: periodAvg <= GOAL_KCAL ? C.successSoft : C.goldSoft, borderRadius: 12 }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: periodAvg <= GOAL_KCAL ? C.success : C.primary, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 6 }}>
                {periodAvg <= GOAL_KCAL ? `✓ ${t('journal.trend')}` : t('journal.trend')}
              </Text>
              <Text style={{ fontSize: 12, color: C.inkSoft, lineHeight: 18 }}>
                {t(periodAvg <= GOAL_KCAL ? 'journalStats.trendText' : 'journalStats.trendTextOver', {
                  avg: periodAvg.toLocaleString(),
                  diff: Math.abs(GOAL_KCAL - periodAvg).toLocaleString(),
                })}
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
