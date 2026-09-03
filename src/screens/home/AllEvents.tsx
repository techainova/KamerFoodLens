import React, { useEffect } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useEventsStore } from '@/store/events.store';
import { SHADOW_SM } from '@/constants/theme';

function formatDateLabel(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

export default function AllEvents() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();

  const events = useEventsStore(s => s.getUpcoming());
  const isLoading = useEventsStore(s => s.isLoading);
  const fetchAll = useEventsStore(s => s.fetchAll);
  const toggleRegister = useEventsStore(s => s.toggleRegister);

  useEffect(() => {
    void fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('home.eventsThisWeek')}</Text>
      </View>

      {isLoading && events.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#E8591A" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }} showsVerticalScrollIndicator={false}>
          {events.map((ev) => (
            <TouchableOpacity
              key={ev.id}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('EventDetail', { eventId: ev.id })}
              style={{ backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 16, overflow: 'hidden', ...SHADOW_SM }}
            >
              <View style={{ position: 'relative' }}>
                <View style={{ height: 140, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="Calendar" size={36} color={C.inkMute} />
                </View>
                <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: C.error, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{formatDateLabel(ev.startAt)}</Text>
                </View>
              </View>
              <View style={{ padding: 14 }}>
                <Text style={{ color: C.ink, fontSize: 14, fontWeight: '700', fontFamily: 'Inter-Bold' }}>{ev.title}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <Icon name="MapPin" size={11} color={C.inkMute} />
                  <Text style={{ color: C.inkMute, fontSize: 11 }}>{ev.location} · {ev.time}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon name="Users" size={12} color={C.inkMute} />
                    <Text style={{ color: C.inkMute, fontSize: 11 }}>{ev.registeredCount} {t('events.registeredCount')}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => void toggleRegister(ev.id)}
                    style={{ height: 36, paddingHorizontal: 16, backgroundColor: ev.isRegistered ? C.successSoft : C.primary, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: ev.isRegistered ? 1 : 0, borderColor: C.success }}
                  >
                    <Text style={{ color: ev.isRegistered ? C.success : '#fff', fontSize: 12, fontWeight: '700' }}>
                      {ev.isRegistered ? t('events.registered') : t('events.register')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
