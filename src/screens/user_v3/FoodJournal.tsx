import React, { useEffect, useMemo, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useJournalStore, buildJournalDayGroups } from '@/store/journal.store';
import type { JournalEntry } from '@/services/users.service';

const GOAL_KCAL = 2000;
const MEAL_KEYS = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
const TABS = ['today', 'thisWeek', 'thisMonth'] as const;
const TAB_DAYS = [1, 7, 30] as const;
// The real Instagram story-ring gradient (yellow → orange → pink → purple → blue).
const INSTAGRAM_GRADIENT = ['#FEDA75', '#FA7E1E', '#D62976', '#962FBF', '#4F5BD5'] as const;

export default function FoodJournal() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  const isLoading = useJournalStore((s) => s.isLoading);
  const fetchAll = useJournalStore((s) => s.fetchAll);
  const removeEntry = useJournalStore((s) => s.removeEntry);
  const getToday = useJournalStore((s) => s.getToday);
  const getLastDays = useJournalStore((s) => s.getLastDays);
  const getKcalTotal = useJournalStore((s) => s.getKcalTotal);
  const entriesVersion = useJournalStore((s) => s.entries);

  useEffect(() => {
    void fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const periodEntries = useMemo(
    () => (activeTab === 0 ? getToday() : getLastDays(TAB_DAYS[activeTab])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeTab, entriesVersion],
  );

  const meals = useMemo(() => {
    return MEAL_KEYS.map((mealType) => ({
      mealType,
      items: periodEntries.filter((e) => e.mealType === mealType),
    }));
  }, [periodEntries]);

  const consumed = getKcalTotal(periodEntries);
  const remaining = Math.max(0, GOAL_KCAL - consumed);
  const pct = Math.min(100, Math.round((consumed / GOAL_KCAL) * 100));
  const mealCount = meals.filter((m) => m.items.length > 0).length;

  // Instagram-style ribbon: one circle per day with a logged dish, most recent first —
  // same grouping/ordering pattern as the community Stories ribbon on the Home screen.
  const dayGroups = useMemo(
    () => buildJournalDayGroups(getLastDays(30)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [entriesVersion],
  );
  const todayGroup = dayGroups.find((g) => g.isToday);
  const pastGroups = dayGroups.filter((g) => !g.isToday);

  const entryLabel = (entry: JournalEntry): string => {
    return activeTab === 0
      ? new Date(entry.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      : new Date(entry.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('journal.title')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('JournalStats')} style={{ width: 36, height: 36, borderWidth: 1, borderColor: C.border, borderRadius: 18, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="TrendingUp" size={16} color={C.inkSoft} />
        </TouchableOpacity>
      </View>

      {/* Ribbon "stories" — un cercle par jour ayant des plats logués, le plus récent en premier */}
      {dayGroups.length > 0 && (
        <View style={{ paddingVertical: 14, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}>
            <TouchableOpacity
              style={{ alignItems: 'center', gap: 6 }}
              activeOpacity={0.75}
              onPress={() => todayGroup
                ? navigation.navigate('JournalStoriesViewer', { dayKey: todayGroup.dayKey })
                : navigation.navigate('Camera')}
            >
              {todayGroup ? (
                <LinearGradient
                  colors={INSTAGRAM_GRADIENT}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ width: 64, height: 64, borderRadius: 32, padding: 3, alignItems: 'center', justifyContent: 'center' }}
                >
                  <View style={{ width: '100%', height: '100%', borderRadius: 29, backgroundColor: C.cream, padding: 2, overflow: 'hidden' }}>
                    {todayGroup.entries[todayGroup.entries.length - 1].imageUrl ? (
                      <Image
                        source={{ uri: todayGroup.entries[todayGroup.entries.length - 1].imageUrl }}
                        style={{ width: '100%', height: '100%', borderRadius: 27 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={{ width: '100%', height: '100%', borderRadius: 27, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="ChefHat" size={22} color={C.inkMute} />
                      </View>
                    )}
                  </View>
                </LinearGradient>
              ) : (
                <View style={{ width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center', backgroundColor: C.surface2, borderWidth: 2, borderColor: C.border, borderStyle: 'dashed' }}>
                  <Icon name="Plus" size={22} color="#E8591A" />
                </View>
              )}
              <Text style={{ fontSize: 10.5, fontWeight: '500', color: C.inkSoft, maxWidth: 64, textAlign: 'center' }}>
                {t('journal.today', "Aujourd'hui")}
              </Text>
            </TouchableOpacity>

            {pastGroups.map((g) => {
              const last = g.entries[g.entries.length - 1];
              return (
                <TouchableOpacity
                  key={g.dayKey}
                  style={{ alignItems: 'center', gap: 6 }}
                  activeOpacity={0.75}
                  onPress={() => navigation.navigate('JournalStoriesViewer', { dayKey: g.dayKey })}
                >
                  <LinearGradient
                    colors={INSTAGRAM_GRADIENT}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ width: 64, height: 64, borderRadius: 32, padding: 3, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <View style={{ width: '100%', height: '100%', borderRadius: 29, backgroundColor: C.cream, padding: 2, overflow: 'hidden' }}>
                      {last.imageUrl ? (
                        <Image source={{ uri: last.imageUrl }} style={{ width: '100%', height: '100%', borderRadius: 27 }} resizeMode="cover" />
                      ) : (
                        <View style={{ width: '100%', height: '100%', borderRadius: 27, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                          <Icon name="ChefHat" size={20} color={C.inkMute} />
                        </View>
                      )}
                    </View>
                  </LinearGradient>
                  <Text style={{ fontSize: 10.5, fontWeight: '500', color: C.inkSoft, maxWidth: 64, textAlign: 'center' }}>{g.dateLabel}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {isLoading && periodEntries.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#E8591A" />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>

          {/* Summary card */}
          <View style={{ margin: 16, padding: 14, borderRadius: 14, backgroundColor: C.goldSoft, borderWidth: 1, borderColor: C.primary }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
              <Text style={{ fontWeight: '700', fontSize: 13, color: C.primary }}>{t(`journal.${TABS[activeTab]}`)}</Text>
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
            {meals.map((meal) => {
              const mealKcal = getKcalTotal(meal.items);
              return (
                <View key={meal.mealType}>
                  <View style={{ backgroundColor: C.surface2, paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <Text style={{ fontWeight: '700', fontSize: 13, color: C.ink }}>
                      {t(`journal.${meal.mealType}`)}
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
                  ) : meal.items.map((entry) => (
                    <View key={entry.id} style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderColor: C.border, alignItems: 'center' }}>
                      <View style={{ width: 48, height: 48, borderRadius: 8, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {entry.imageUrl ? (
                          <Image source={{ uri: entry.imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                        ) : (
                          <Icon name="ChefHat" size={18} color={C.inkMute} />
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: '600', fontSize: 13, color: C.ink }}>{entry.dishName}</Text>
                        <Text style={{ fontSize: 11, color: C.inkMute }}>
                          {entryLabel(entry)}{entry.nutritionFacts?.calories ? ` · ${entry.nutritionFacts.calories} kcal` : ''}
                        </Text>
                      </View>
                      <TouchableOpacity onPress={() => void removeEntry(entry.id)} style={{ width: 28, height: 28, alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="X" size={12} color={C.inkMute} />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

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
