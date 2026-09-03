import React, { useEffect, useMemo, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, TextInput, StatusBar, Alert, ActivityIndicator, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM, SHADOW_MD, SHADOW_LG } from '@/constants/theme';
import { scannerService, buildScanDayGroups, type ScanHistoryItem } from '@/services/scanner.service';

// The real Instagram story-ring gradient (yellow → orange → pink → purple → blue).
const INSTAGRAM_GRADIENT = ['#FEDA75', '#FA7E1E', '#D62976', '#962FBF', '#4F5BD5'] as const;

function dayKeyOf(iso: string): string {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'today';
  if (d.toDateString() === yesterday.toDateString()) return 'yesterday';
  return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' });
}

function timeOf(iso: string): string {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
}

export default function History() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [scanHistory, setScanHistory] = useState<ScanHistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const { items } = await scannerService.getHistory(1, 100);
        if (!cancelled) setScanHistory(items);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(
    () => scanHistory.filter((it) => it.dishName.toLowerCase().includes(query.trim().toLowerCase())),
    [scanHistory, query],
  );

  const groups = useMemo(() => {
    const order: string[] = [];
    const byDay = new Map<string, ScanHistoryItem[]>();
    for (const item of filtered) {
      const key = dayKeyOf(item.scannedAt);
      if (!byDay.has(key)) { byDay.set(key, []); order.push(key); }
      byDay.get(key)!.push(item);
    }
    return order.map((dayKey) => ({
      dayKey,
      label: dayKey === 'today' ? t('history.todayLabel') : dayKey === 'yesterday' ? t('history.yesterdayLabel') : dayKey,
      items: byDay.get(dayKey)!,
    }));
  }, [filtered, t]);

  // Instagram-style ribbon: one circle per day with scans, most recent first — same
  // grouping/ordering pattern as the community Stories ribbon on the Home screen.
  const dayGroups = useMemo(() => buildScanDayGroups(scanHistory), [scanHistory]);
  const todayScanGroup = dayGroups.find((g) => g.isToday);
  const pastScanGroups = dayGroups.filter((g) => !g.isToday);

  const handleClear = () => {
    Alert.alert(
      t('history.clearConfirmTitle'),
      t('history.clearConfirmMsg'),
      [
        { text: t('history.clearConfirmCancel'), style: 'cancel' },
        {
          text: t('history.clearConfirmAction'),
          style: 'destructive',
          onPress: () => {
            void scannerService.clearHistory().then(() => setScanHistory([]));
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('history.title')}</Text>
      </View>

      {/* Search */}
      <View style={{ padding: 16, paddingBottom: 8 }}>
        <View style={{ height: 42, borderWidth: 1, borderColor: C.border, borderRadius: 12, backgroundColor: C.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 }}>
          <Icon name="Search" size={16} color={C.inkMute} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('history.searchPlaceholder')}
            placeholderTextColor={C.inkMute}
            style={{ flex: 1, fontSize: 14, color: C.ink }}
          />
        </View>
      </View>

      {/* Ribbon "stories" — un cercle par jour de scans, le plus récent en premier */}
      {dayGroups.length > 0 && (
        <View style={{ paddingVertical: 6, paddingBottom: 16 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}>
            {todayScanGroup && (
              <TouchableOpacity
                style={{ alignItems: 'center', gap: 6 }}
                activeOpacity={0.75}
                onPress={() => navigation.navigate('HistoryStoriesViewer', { dayKey: todayScanGroup.dayKey })}
              >
                <LinearGradient
                  colors={INSTAGRAM_GRADIENT}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ width: 64, height: 64, borderRadius: 32, padding: 3, alignItems: 'center', justifyContent: 'center' }}
                >
                  <View style={{ width: '100%', height: '100%', borderRadius: 29, backgroundColor: C.cream, padding: 2, overflow: 'hidden' }}>
                    {todayScanGroup.items[todayScanGroup.items.length - 1].imageUrl ? (
                      <Image
                        source={{ uri: todayScanGroup.items[todayScanGroup.items.length - 1].imageUrl }}
                        style={{ width: '100%', height: '100%', borderRadius: 27 }}
                        resizeMode="cover"
                      />
                    ) : (
                      <View style={{ width: '100%', height: '100%', borderRadius: 27, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="Camera" size={20} color={C.inkMute} />
                      </View>
                    )}
                  </View>
                </LinearGradient>
                <Text style={{ fontSize: 10.5, fontWeight: '500', color: C.inkSoft, maxWidth: 64, textAlign: 'center' }}>
                  {t('history.todayLabel')}
                </Text>
              </TouchableOpacity>
            )}

            {pastScanGroups.map((g) => {
              const last = g.items[g.items.length - 1];
              return (
                <TouchableOpacity
                  key={g.dayKey}
                  style={{ alignItems: 'center', gap: 6 }}
                  activeOpacity={0.75}
                  onPress={() => navigation.navigate('HistoryStoriesViewer', { dayKey: g.dayKey })}
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
                          <Icon name="Camera" size={20} color={C.inkMute} />
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

      {isLoading && scanHistory.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#E8591A" />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
          {groups.length === 0 ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
              <Icon name="Camera" size={48} color={C.inkMute} />
              <Text style={{ fontSize: 16, fontWeight: '600', color: C.ink, textAlign: 'center', marginTop: 16 }}>{t('history.emptyTitle')}</Text>
            </View>
          ) : (
            groups.map((group) => (
              <View key={group.dayKey}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 1, paddingVertical: 10 }}>
                  {group.label}
                </Text>
                {group.items.map((item) => {
                  const pct = Math.round(item.confidence * 100);
                  const confColor = pct >= 70 ? C.success : pct >= 50 ? C.primary : C.error;
                  return (
                    <TouchableOpacity
                      key={item.scanId}
                      onPress={() => navigation.navigate('Result', { scanId: item.scanId, classId: item.classId, confidence: item.confidence, imageUri: item.imageUrl })}
                      style={{ flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: C.surface2 }}
                    >
                      <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: C.surface2, borderWidth: item.imageUrl ? 0 : 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {item.imageUrl ? (
                          <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                        ) : (
                          <Icon name="Camera" size={18} color={C.inkMute} />
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, fontWeight: '600', color: C.ink }}>{item.dishName}</Text>
                        <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 1 }}>{timeOf(item.scannedAt)}</Text>
                      </View>
                      <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: confColor }}>
                        <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>{pct}%</Text>
                      </View>
                      <Icon name="ChevronRight" size={16} color={C.inkMute} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))
          )}
        </ScrollView>
      )}

      {scanHistory.length > 0 && (
        <View style={{ position: 'absolute', bottom: 24, left: 16, right: 16 }}>
          <TouchableOpacity
            onPress={handleClear}
            style={{ height: 46, borderWidth: 1, borderColor: C.error, borderRadius: 23, alignItems: 'center', justifyContent: 'center', backgroundColor: C.cream, ...SHADOW_SM }}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: C.error }}>{t('history.clear')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
