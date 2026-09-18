// Compte Pro — "Mes offres" : formations et événements créés par ce restaurant.
import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { coursesService, type Course } from '@/services/courses.service';
import { eventsService, type KflEvent } from '@/services/events.service';

type TabKey = 'formations' | 'events';

export default function ProOffers() {
  const C = useColors();
  const nav = useNavigation<any>();
  const [tab, setTab] = useState<TabKey>('formations');
  const [courses, setCourses] = useState<Course[]>([]);
  const [events, setEvents] = useState<KflEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([coursesService.getManaged(), eventsService.getManaged()])
      .then(([c, e]) => { setCourses(c); setEvents(e); })
      .finally(() => setLoading(false));
  }, []);

  const totalRevenue = courses.reduce((sum, c) => sum + c.priceXAF * c.studentsCount, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: C.border }}>
        <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 19, color: C.ink }}>Mes offres</Text>
        <TouchableOpacity onPress={() => nav.navigate('ProCreateHub')} style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="Plus" size={22} color={C.ink} />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', gap: 6, padding: 12 }}>
        {([['formations', `Formations · ${courses.length}`], ['events', `Événements · ${events.length}`]] as const).map(([key, label]) => (
          <TouchableOpacity
            key={key}
            onPress={() => setTab(key)}
            style={{ height: 32, paddingHorizontal: 13, borderRadius: 16, justifyContent: 'center', backgroundColor: tab === key ? C.ink : C.surface, borderWidth: tab === key ? 0 : 1, borderColor: C.border }}
          >
            <Text style={{ fontSize: 12.5, fontWeight: '600', color: tab === key ? C.cream : C.inkSoft }}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <ActivityIndicator color={C.primary} style={{ marginTop: 30 }} />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4 }}>
          {tab === 'formations' && (
            <>
              <View style={{ padding: 14, borderRadius: 16, backgroundColor: C.successSoft, borderWidth: 1, borderColor: C.success, marginBottom: 14 }}>
                <Text style={{ fontSize: 10.5, fontWeight: '800', letterSpacing: 1, color: C.success }}>REVENUS FORMATIONS</Text>
                <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 24, color: C.ink, marginTop: 4 }}>{totalRevenue.toLocaleString()} XAF</Text>
                <Text style={{ fontSize: 11.5, color: C.inkSoft, marginTop: 2 }}>{courses.reduce((s, c) => s + c.studentsCount, 0)} inscrits au total</Text>
              </View>

              {courses.length === 0 ? (
                <Text style={{ textAlign: 'center', color: C.inkMute, fontSize: 13, marginTop: 10 }}>Aucune formation créée pour le moment.</Text>
              ) : courses.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => nav.navigate('ProFormationManage', { courseId: c.id })}
                  style={{ marginBottom: 11, borderRadius: 16, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, padding: 13, flexDirection: 'row', gap: 12 }}
                >
                  <View style={{ width: 60, height: 60, borderRadius: 11, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="GraduationCap" size={24} color={C.inkFaint} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }} numberOfLines={1}>{c.title}</Text>
                    <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 2 }}>{c.lessonsCount} leçons · {c.isFree ? 'Gratuite' : `${c.priceXAF.toLocaleString()} XAF`}</Text>
                    <Text style={{ fontSize: 11.5, color: C.success, fontWeight: '700', marginTop: 4 }}>{c.studentsCount} inscrits</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}

          {tab === 'events' && (
            events.length === 0 ? (
              <Text style={{ textAlign: 'center', color: C.inkMute, fontSize: 13, marginTop: 10 }}>Aucun événement créé pour le moment.</Text>
            ) : events.map((e) => (
              <TouchableOpacity
                key={e.id}
                onPress={() => nav.navigate('ManageEvent', { eventId: e.id })}
                style={{ marginBottom: 11, borderRadius: 16, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, padding: 13, flexDirection: 'row', gap: 12 }}
              >
                <View style={{ width: 60, height: 60, borderRadius: 11, backgroundColor: 'rgba(106,27,154,0.1)', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="Calendar" size={24} color="#6A1B9A" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }} numberOfLines={1}>{e.title}</Text>
                  <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 2 }}>{e.date} · {e.isFree ? 'Gratuit' : `${e.price.toLocaleString()} XAF`}</Text>
                  <Text style={{ fontSize: 11.5, color: '#6A1B9A', fontWeight: '700', marginTop: 4 }}>{e.registeredCount} inscrits{e.maxAttendees ? ` / ${e.maxAttendees}` : ''}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
