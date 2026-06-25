import React, { useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, Image, StatusBar,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { WEEKLY_EVENTS } from '@/data/events';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

export default function AllEvents() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [registered, setRegistered] = useState<Record<string, boolean>>({});

  const toggleRegister = (id: string) => setRegistered((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('home.eventsThisWeek')}</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, gap: 14 }} showsVerticalScrollIndicator={false}>
        {WEEKLY_EVENTS.map((ev) => {
          const isRegistered = !!registered[ev.id];
          return (
            <View key={ev.id} style={{ backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 16, overflow: 'hidden', ...SHADOW_SM }}>
              <View style={{ position: 'relative' }}>
                {ev.image ? (
                  <Image source={ev.image} style={{ width: '100%', height: 140 }} resizeMode="cover" />
                ) : (
                  <View style={{ height: 140, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="Calendar" size={36} color={C.inkMute} />
                  </View>
                )}
                <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: C.error, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{ev.dateLabel}</Text>
                </View>
              </View>
              <View style={{ padding: 14 }}>
                <Text style={{ color: C.ink, fontSize: 14, fontWeight: '700', fontFamily: 'Inter-Bold' }}>{ev.title}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <Icon name="MapPin" size={11} color={C.inkMute} />
                  <Text style={{ color: C.inkMute, fontSize: 11 }}>{ev.location} · {ev.timeRange}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon name="Users" size={12} color={C.inkMute} />
                    <Text style={{ color: C.inkMute, fontSize: 11 }}>{ev.attendees + (isRegistered ? 1 : 0)} {t('events.registeredCount')}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => toggleRegister(ev.id)}
                    style={{ height: 36, paddingHorizontal: 16, backgroundColor: isRegistered ? C.successSoft : C.primary, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: isRegistered ? 1 : 0, borderColor: C.success }}
                  >
                    <Text style={{ color: isRegistered ? C.success : '#fff', fontSize: 12, fontWeight: '700' }}>
                      {isRegistered ? t('events.registered') : t('events.register')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
