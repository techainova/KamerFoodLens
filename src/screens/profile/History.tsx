import React, { useMemo, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, TextInput, StatusBar, Alert,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

interface ScanItem { dish: string; region: string; confidence: number; time: string; dayKey: 'today' | 'yesterday' | string }

const SCAN_HISTORY_INITIAL: ScanItem[] = [
  { dish: 'Eru',             region: 'Sud-Ouest', confidence: 92, time: '14:32', dayKey: 'today' },
  { dish: 'Plantains frits', region: 'Littoral',  confidence: 88, time: '12:18', dayKey: 'today' },
  { dish: 'Mbongo Tchobi',   region: 'Centre',    confidence: 76, time: '20:14', dayKey: 'yesterday' },
  { dish: 'Ndolé',           region: 'Littoral',  confidence: 94, time: '13:02', dayKey: 'yesterday' },
  { dish: 'Koki au manioc',  region: 'Ouest',     confidence: 81, time: '11:45', dayKey: 'yesterday' },
  { dish: 'Sanga',           region: 'Adamaoua',  confidence: 64, time: '19:23', dayKey: '12 Novembre' },
];

export default function History() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [scanHistory, setScanHistory] = useState(SCAN_HISTORY_INITIAL);

  const filtered = useMemo(
    () => scanHistory.filter((it) => it.dish.toLowerCase().includes(query.trim().toLowerCase())),
    [scanHistory, query],
  );

  const groups = useMemo(() => {
    const order: string[] = [];
    const byDay = new Map<string, ScanItem[]>();
    for (const item of filtered) {
      if (!byDay.has(item.dayKey)) { byDay.set(item.dayKey, []); order.push(item.dayKey); }
      byDay.get(item.dayKey)!.push(item);
    }
    return order.map((dayKey) => ({
      dayKey,
      label: dayKey === 'today' ? t('history.todayLabel') : dayKey === 'yesterday' ? t('history.yesterdayLabel') : dayKey,
      items: byDay.get(dayKey)!,
    }));
  }, [filtered, t]);

  const handleClear = () => {
    Alert.alert(
      t('history.clearConfirmTitle'),
      t('history.clearConfirmMsg'),
      [
        { text: t('history.clearConfirmCancel'), style: 'cancel' },
        { text: t('history.clearConfirmAction'), style: 'destructive', onPress: () => setScanHistory([]) },
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
        <TouchableOpacity
          onPress={() => Alert.alert(t('settings.comingSoonTitle'), t('settings.comingSoonMsg'))}
          style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="SlidersHorizontal" size={16} color={C.inkSoft} />
        </TouchableOpacity>
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
              {group.items.map((item, i) => {
                const confColor = item.confidence >= 70 ? C.success : item.confidence >= 50 ? C.primary : C.error;
                return (
                  <TouchableOpacity key={i} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderColor: C.surface2 }}>
                    <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: C.surface2, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="Camera" size={18} color={C.inkMute} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '600', color: C.ink }}>{item.dish}</Text>
                      <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 1 }}>{item.region} · {item.time}</Text>
                    </View>
                    <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: confColor }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>{item.confidence}%</Text>
                    </View>
                    <Icon name="ChevronRight" size={16} color={C.inkMute} />
                  </TouchableOpacity>
                );
              })}
            </View>
          ))
        )}
      </ScrollView>

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
