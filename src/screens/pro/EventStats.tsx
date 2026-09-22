// Compte Pro — statistiques d'un événement, dérivées des vraies données
// (détail de l'événement + liste des inscrits), sans endpoint dédié supplémentaire.
import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { eventsService, type EventAttendee, type KflEvent } from '@/services/events.service';

export default function EventStats() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const C = useColors();
  const { t } = useTranslation();
  const eventId: string | undefined = route.params?.eventId;

  const [event, setEvent] = useState<KflEvent | null>(null);
  const [attendees, setAttendees] = useState<EventAttendee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!eventId) { setLoading(false); return; }
    let cancelled = false;
    Promise.all([eventsService.getDetail(eventId), eventsService.getAttendees(eventId)])
      .then(([e, a]) => { if (!cancelled) { setEvent(e); setAttendees(a); } })
      .catch(() => { if (!cancelled) { setEvent(null); setAttendees([]); } })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [eventId]);

  const checkedInCount = attendees.filter((a) => a.checkedInAt).length;
  const fillRate = event && event.maxAttendees > 0 ? Math.round((event.registeredCount / event.maxAttendees) * 100) : 0;
  const revenue = event ? event.price * event.registeredCount : 0;
  const attendanceRate = attendees.length > 0 ? Math.round((checkedInCount / attendees.length) * 100) : 0;

  // Regroupe les inscriptions par jour pour un mini historique.
  const byDay = new Map<string, number>();
  for (const a of attendees) {
    const key = new Date(a.registeredAt).toLocaleDateString();
    byDay.set(key, (byDay.get(key) ?? 0) + 1);
  }
  const days = [...byDay.entries()];
  const maxPerDay = Math.max(1, ...days.map(([, n]) => n));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('manageEvent.eventStats')}</Text>
      </View>

      {loading ? (
        <ActivityIndicator color={C.primary} style={{ marginTop: 40 }} />
      ) : !event ? (
        <Text style={{ fontSize: 13, color: C.inkMute, textAlign: 'center', marginTop: 24 }}>{t('restaurant.notFound', 'Introuvable.')}</Text>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {[
              { v: String(event.registeredCount), l: t('manageEvent.registered'), color: C.ink },
              { v: `${fillRate}%`, l: t('eventStats.fillRate', 'Remplissage'), color: C.gold },
              { v: String(checkedInCount), l: t('eventStats.checkedIn', 'Présents'), color: C.success },
              { v: `${attendanceRate}%`, l: t('eventStats.attendanceRate', "Taux d'entrée"), color: C.navy },
            ].map((s, i) => (
              <View key={i} style={{ width: '48%', padding: 14, borderRadius: 16, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, alignItems: 'center', ...SHADOW_SM }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: s.color }}>{s.v}</Text>
                <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 4 }}>{s.l}</Text>
              </View>
            ))}
          </View>

          {!event.isFree && (
            <View style={{ marginTop: 14, padding: 16, borderRadius: 16, backgroundColor: C.navy }}>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>{t('eventStats.revenue', 'Revenu généré')}</Text>
              <Text style={{ color: '#fff', fontSize: 22, fontWeight: '700', marginTop: 4 }}>{revenue.toLocaleString()} XAF</Text>
              <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11, marginTop: 2 }}>{event.price.toLocaleString()} XAF × {event.registeredCount} {t('eventStats.tickets', 'billets')}</Text>
            </View>
          )}

          <Text style={{ fontSize: 13, fontWeight: '700', color: C.inkSoft, marginTop: 20, marginBottom: 10 }}>{t('eventStats.registrationHistory', 'Inscriptions par jour')}</Text>
          {days.length === 0 ? (
            <Text style={{ fontSize: 12, color: C.inkMute }}>{t('eventAttendees.noAttendees', 'Aucun inscrit pour le moment.')}</Text>
          ) : (
            <View style={{ borderRadius: 16, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, padding: 14, gap: 8, ...SHADOW_SM }}>
              {days.map(([day, count]) => (
                <View key={day} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <Text style={{ fontSize: 11, color: C.inkMute, width: 80 }}>{day}</Text>
                  <View style={{ flex: 1, height: 10, borderRadius: 5, backgroundColor: C.surface2, overflow: 'hidden' }}>
                    <View style={{ width: `${(count / maxPerDay) * 100}%`, height: '100%', backgroundColor: C.primary, borderRadius: 5 }} />
                  </View>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: C.ink, width: 20, textAlign: 'right' }}>{count}</Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
