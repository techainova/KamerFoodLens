import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_MD, SHADOW_SM } from '@/constants/theme';
import { useEventsStore } from '@/store/events.store';
import type { KflEvent } from '@/store/events.store';

type FilterId = 'all' | 'free' | 'week' | 'festival' | 'workshop' | 'contest';

const CATEGORY_COLORS: Record<string, string> = {
  'Festival': '#E8591A',
  'Atelier': '#2E7D32',
  'Dégustation': '#1A237E',
  'Concours': '#F9A825',
  'Conférence': '#00796B',
};
const DEFAULT_CATEGORY_COLOR = '#6D4C41';

function gradientForCategory(category: string): string {
  return CATEGORY_COLORS[category] ?? DEFAULT_CATEGORY_COLOR;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function Events() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();

  const FILTERS: Array<{ id: FilterId; label: string }> = [
    { id: 'all',      label: t('common.all') },
    { id: 'free',     label: t('events.free') },
    { id: 'week',     label: t('events.thisWeek') },
    { id: 'festival', label: t('events.festival') },
    { id: 'workshop', label: t('events.workshop') },
    { id: 'contest',  label: t('events.contest') },
  ];

  const [activeFilter, setActiveFilter] = useState<FilterId>('all');

  const events = useEventsStore(s => s.events);
  const isLoading = useEventsStore(s => s.isLoading);
  const fetchAll = useEventsStore(s => s.fetchAll);
  const toggleRegister = useEventsStore(s => s.toggleRegister);

  useEffect(() => {
    void fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = events.filter((e: KflEvent) => {
    if (activeFilter === 'free') return e.isFree;
    if (activeFilter === 'week') {
      const d = new Date(e.date);
      const now = new Date();
      const weekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
      return d >= now && d <= weekEnd;
    }
    if (activeFilter === 'festival') return e.category === 'Festival';
    if (activeFilter === 'workshop') return e.category === 'Atelier';
    if (activeFilter === 'contest') return e.category === 'Concours';
    return true;
  });

  const featured = filtered.filter((e: KflEvent) => e.category === 'Festival' || e.registeredCount > 500);
  const regular  = filtered.filter((e: KflEvent) => !featured.includes(e));

  const spotsLeft = (e: KflEvent) => e.maxAttendees - e.registeredCount;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('events.title')}</Text>
        <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: '#FEF3EC' }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#E8591A' }}>{events.filter(e => e.isRegistered).length} {t('events.registeredCount')}</Text>
        </View>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }} style={{ backgroundColor: C.surface, maxHeight: 52, borderBottomWidth: 1, borderColor: C.border }}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f.id}
            onPress={() => setActiveFilter(f.id)}
            style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: f.id === activeFilter ? '#E8591A' : '#F5F0EB', borderWidth: 1, borderColor: f.id === activeFilter ? '#E8591A' : '#E5E0D8' }}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: f.id === activeFilter ? '#fff' : '#6D4C41' }}>{f.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Featured */}
        {featured.length > 0 && (
          <View style={{ paddingTop: 16 }}>
            <Text style={{ paddingHorizontal: 16, fontSize: 13, fontWeight: '600', color: C.inkSoft, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('events.featured')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}>
              {featured.map((event: KflEvent) => {
                const color = gradientForCategory(event.category);
                return (
                <TouchableOpacity
                  key={event.id}
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
                  style={{ width: 260, backgroundColor: C.surface, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: C.border, ...SHADOW_MD }}
                >
                  {/* Hero */}
                  <View style={{ height: 130, backgroundColor: color + '30', alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: color + '30', borderWidth: 2, borderColor: color + '60', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                      <Icon name="Calendar" size={26} color={color} />
                    </View>
                    <View style={{ position: 'absolute', top: 10, left: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: color }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>{event.category}</Text>
                    </View>
                    <View style={{ position: 'absolute', top: 10, right: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: event.isFree ? '#E3F0E4' : '#FBF3DC' }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: event.isFree ? '#2E7D32' : '#F9A825' }}>{event.isFree ? t('events.free') : `${event.price.toLocaleString()} XAF`}</Text>
                    </View>
                  </View>

                  <View style={{ padding: 14 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, lineHeight: 20, marginBottom: 8 }} numberOfLines={2}>{event.title}</Text>

                    <View style={{ gap: 5, marginBottom: 12 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Icon name="Calendar" size={13} color="#E8591A" />
                        <Text style={{ fontSize: 12, color: C.inkSoft }}>{formatDate(event.date)} · {event.time}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Icon name="MapPin" size={13} color="#8C8278" />
                        <Text style={{ fontSize: 12, color: C.inkMute }} numberOfLines={1}>{event.location}</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => void toggleRegister(event.id)}
                      style={{ paddingVertical: 9, borderRadius: 12, backgroundColor: event.isRegistered ? '#E3F0E4' : '#E8591A', alignItems: 'center' }}
                    >
                      <Text style={{ fontSize: 13, fontWeight: '700', color: event.isRegistered ? '#2E7D32' : '#fff' }}>
                        {event.isRegistered ? t('events.registeredCheck') : t('events.register')}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}

        {/* Regular list */}
        {regular.length > 0 && (
          <View style={{ paddingHorizontal: 16, paddingTop: 20, gap: 12 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: C.inkSoft, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('events.upcoming')}</Text>

            {regular.map((event: KflEvent) => {
              const day = new Date(event.date).getDate().toString();
              const month = new Date(event.date).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase();
              const color = gradientForCategory(event.category);
              return (
                <TouchableOpacity
                  key={event.id}
                  activeOpacity={0.85}
                  onPress={() => navigation.navigate('EventDetail', { eventId: event.id })}
                  style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}
                >
                  <View style={{ flexDirection: 'row' }}>
                    {/* Date column */}
                    <View style={{ width: 64, backgroundColor: color, alignItems: 'center', justifyContent: 'center', paddingVertical: 16 }}>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>{month}</Text>
                      <Text style={{ fontSize: 22, fontWeight: '700', color: '#fff', lineHeight: 26 }}>{day}</Text>
                    </View>

                    {/* Info */}
                    <View style={{ flex: 1, padding: 14 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <View style={{ paddingHorizontal: 7, paddingVertical: 2, borderRadius: 7, backgroundColor: color + '15' }}>
                          <Text style={{ fontSize: 10, fontWeight: '700', color: color }}>{event.category}</Text>
                        </View>
                        {event.isFree && (
                          <View style={{ paddingHorizontal: 7, paddingVertical: 2, borderRadius: 7, backgroundColor: '#E3F0E4' }}>
                            <Text style={{ fontSize: 10, fontWeight: '600', color: '#2E7D32' }}>{t('events.free')}</Text>
                          </View>
                        )}
                      </View>

                      <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, marginBottom: 6 }} numberOfLines={2}>{event.title}</Text>

                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Icon name="Clock" size={12} color="#8C8278" />
                          <Text style={{ fontSize: 11, color: C.inkMute }}>{event.time}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                          <Icon name="Users" size={12} color="#8C8278" />
                          <Text style={{ fontSize: 11, color: C.inkMute }}>{spotsLeft(event)} {t('events.placesShort')}</Text>
                        </View>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => void toggleRegister(event.id)}
                      style={{ paddingRight: 14, justifyContent: 'center' }}
                    >
                      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: event.isRegistered ? '#E3F0E4' : '#E8591A15', borderWidth: 1.5, borderColor: event.isRegistered ? '#2E7D32' : '#E8591A40', alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name={event.isRegistered ? 'Check' : 'Plus'} size={15} color={event.isRegistered ? '#2E7D32' : '#E8591A'} />
                      </View>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {isLoading && events.length === 0 && (
          <View style={{ alignItems: 'center', paddingTop: 80 }}>
            <ActivityIndicator color="#E8591A" />
          </View>
        )}

        {!isLoading && filtered.length === 0 && (
          <View style={{ alignItems: 'center', paddingTop: 80 }}>
            <Icon name="Calendar" size={48} color="rgba(140,130,120,0.3)" />
            <Text style={{ fontSize: 16, color: C.inkMute, marginTop: 12 }}>{t('events.noEvents')}</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
