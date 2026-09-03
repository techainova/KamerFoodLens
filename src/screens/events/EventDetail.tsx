import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { useEventsStore, type KflEvent } from '@/store/events.store';

const CATEGORY_COLORS: Record<string, string> = {
  'Festival': '#E8591A',
  'Atelier': '#2E7D32',
  'Dégustation': '#1A237E',
  'Concours': '#F9A825',
  'Conférence': '#00796B',
};
const DEFAULT_CATEGORY_COLOR = '#6D4C41';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function EventDetail() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const route = useRoute<any>();
  const eventId: string | undefined = route.params?.eventId;

  const fetchById = useEventsStore((s) => s.fetchById);
  const toggleRegister = useEventsStore((s) => s.toggleRegister);

  const [event, setEvent] = useState<KflEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [registering, setRegistering] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!eventId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const detail = await fetchById(eventId);
      if (!cancelled) {
        setEvent(detail ?? null);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  // Keep local view in sync with the store after registration toggles
  const storeEvent = useEventsStore((s) => (eventId ? s.getById(eventId) : undefined));
  useEffect(() => {
    if (storeEvent) {
      setEvent(storeEvent);
    }
  }, [storeEvent]);

  const handleToggleRegister = async () => {
    if (!eventId) return;
    setRegistering(true);
    try {
      await toggleRegister(eventId);
    } finally {
      setRegistering(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#E8591A" />
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 15, color: C.inkSoft, textAlign: 'center' }}>
          {t('events.notFound', 'Événement introuvable.')}
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          <Text style={{ color: '#E8591A', fontWeight: '600' }}>{t('common.goBack', 'Retour')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const color = CATEGORY_COLORS[event.category] ?? DEFAULT_CATEGORY_COLOR;
  const remaining = Math.max(event.maxAttendees - event.registeredCount, 0);
  const progress = event.maxAttendees > 0 ? Math.min((event.registeredCount / event.maxAttendees) * 100, 100) : 0;
  const initials = event.organizer.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle="light-content" />

      {/* Hero */}
      <View style={{ height: 220, backgroundColor: '#2C1810', justifyContent: 'flex-end', padding: 20 }}>
        <View style={{ position: 'absolute', top: 16, left: 0, right: 0, flexDirection: 'row', paddingHorizontal: 16, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="ArrowLeft" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => setSaved(s => !s)} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Bookmark" size={18} color={saved ? '#F9A825' : '#fff'} fill={saved ? '#F9A825' : 'none'} />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: event.isOnline ? '#1A237E' : color }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>{event.isOnline ? 'En ligne' : event.category}</Text>
          </View>
          {event.isFree && (
            <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: '#2E7D32' }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>{t('events.free')}</Text>
            </View>
          )}
        </View>

        <Text style={{ fontSize: 20, fontFamily: 'PlayfairDisplay-Bold', color: '#fff', lineHeight: 28 }}>{event.title}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

        {/* Info chips */}
        <View style={{ backgroundColor: C.surface, paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderColor: C.border, gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#E8591A15', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Calendar" size={15} color="#E8591A" />
            </View>
            <Text style={{ fontSize: 14, color: C.ink, fontWeight: '600' }}>{formatDate(event.startAt)} · {event.time}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#E8591A15', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="MapPin" size={15} color="#E8591A" />
            </View>
            <Text style={{ fontSize: 14, color: C.inkSoft }} numberOfLines={1}>{event.location}{event.city ? ` · ${event.city}` : ''}</Text>
          </View>
        </View>

        {/* Seats progress */}
        {event.maxAttendees > 0 && (
          <View style={{ marginHorizontal: 16, marginTop: 16, backgroundColor: C.surface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: C.ink }}>{t('events.availableSeats')}</Text>
              <Text style={{ fontSize: 13, fontWeight: '700', color: remaining <= 5 ? '#C62828' : '#2E7D32' }}>
                {remaining} {t('events.seatsRemaining')}
              </Text>
            </View>
            <View style={{ height: 6, backgroundColor: C.surface2, borderRadius: 3, overflow: 'hidden' }}>
              <View style={{ height: '100%', width: `${progress}%`, backgroundColor: progress >= 80 ? '#C62828' : '#E8591A', borderRadius: 3 }} />
            </View>
            <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 6 }}>{event.registeredCount}/{event.maxAttendees} {t('events.registeredCount')}</Text>
          </View>
        )}

        {/* Description */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <Text style={{ fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 10 }}>{t('events.description')}</Text>
          <Text style={{ fontSize: 14, color: C.inkSoft, lineHeight: 22 }}>{event.description}</Text>
        </View>

        {/* Tags */}
        {event.tags.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, paddingTop: 16 }}>
            {event.tags.map((tag) => (
              <View key={tag} style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, backgroundColor: color + '15' }}>
                <Text style={{ fontSize: 11, fontWeight: '600', color }}>{tag}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Organizer */}
        <View style={{ marginHorizontal: 16, marginTop: 20, backgroundColor: C.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border, flexDirection: 'row', gap: 12, alignItems: 'center', ...SHADOW_SM }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: color + '20', borderWidth: 2, borderColor: color + '40', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color }}>{initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 11, color: C.inkMute, marginBottom: 2 }}>{t('events.organizedBy', 'Organisé par')}</Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>{event.organizer}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: C.surface, borderTopWidth: 1, borderColor: C.border }}>
        {event.price > 0 && (
          <Text style={{ fontSize: 18, fontWeight: '700', color: C.ink, textAlign: 'center', marginBottom: 10 }}>
            {event.price.toLocaleString()} XAF
          </Text>
        )}
        <TouchableOpacity
          onPress={() => void handleToggleRegister()}
          disabled={registering}
          style={{ height: 52, borderRadius: 16, backgroundColor: event.isRegistered ? '#E3F0E4' : '#E8591A', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
          activeOpacity={0.85}
        >
          {registering ? (
            <ActivityIndicator color={event.isRegistered ? '#2E7D32' : '#fff'} />
          ) : (
            <>
              <Icon name={event.isRegistered ? 'Check' : 'Calendar'} size={18} color={event.isRegistered ? '#2E7D32' : '#fff'} />
              <Text style={{ fontSize: 16, fontWeight: '700', color: event.isRegistered ? '#2E7D32' : '#fff' }}>
                {event.isRegistered ? t('events.confirmedRegistration') : t('events.register')}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
