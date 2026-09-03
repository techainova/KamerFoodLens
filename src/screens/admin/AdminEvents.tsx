import React from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';

type EventStatus = 'published' | 'pending' | 'draft';

const EVENTS = [
  { title: 'Festival des saveurs', date: '22 Jun 2026', status: 'published' as EventStatus, attendees: 847 },
  { title: 'Masterclass Ndolé',    date: '25 Jun 2026', status: 'pending'   as EventStatus, attendees: 124 },
  { title: 'Concours de recettes', date: '28 Jun 2026', status: 'draft'     as EventStatus, attendees: 56  },
];

export default function AdminEvents() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();

  const STATUS_CONF: Record<EventStatus, { label: string; color: string; bg: string }> = {
    published: { label: t('admin.statusPublished'), color: '#2E7D32', bg: '#E3F0E4' },
    pending:   { label: t('common.pending'),         color: '#F9A825', bg: '#FBF3DC' },
    draft:     { label: t('common.draft'),           color: '#8C8278', bg: '#F5F0EB' },
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#1A237E' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12, padding: 4 }}>
          <Icon name="ArrowLeft" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', flex: 1 }}>{t('admin.eventsManagement')}</Text>
        <TouchableOpacity style={{ height: 32, paddingHorizontal: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4 }}>
          <Icon name="Plus" size={12} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{t('admin.new')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 12 }}>
          {EVENTS.map((event, i) => {
            const s = STATUS_CONF[event.status];
            return (
              <View key={i} style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: C.ink, marginRight: 8 }}>{event.title}</Text>
                  <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: s.bg }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: s.color }}>{s.label}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon name="Calendar" size={12} color={C.inkMute} />
                    <Text style={{ fontSize: 12, color: C.inkMute }}>{event.date}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon name="Users" size={12} color={C.inkMute} />
                    <Text style={{ fontSize: 12, color: C.inkMute }}>{event.attendees} {t('admin.attendees')}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity style={{ height: 32, paddingHorizontal: 12, backgroundColor: C.navySoft, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#1A237E', fontSize: 12, fontWeight: '600' }}>{t('common.edit')}</Text>
                  </TouchableOpacity>
                  {event.status === 'pending' && (
                    <TouchableOpacity style={{ height: 32, paddingHorizontal: 12, backgroundColor: C.successSoft, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: '#2E7D32', fontSize: 12, fontWeight: '600' }}>{t('admin.approve')}</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={{ height: 32, paddingHorizontal: 12, backgroundColor: C.errorSoft, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#C62828', fontSize: 12, fontWeight: '600' }}>{t('common.delete')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
