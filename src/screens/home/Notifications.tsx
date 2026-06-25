import React, { useState } from 'react';
import {
  View, ScrollView, TouchableOpacity,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { IconName } from '@/components/ui/Icon';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

type Notif = {
  icon: IconName;
  iconBg: string;
  titleKey: string;
  descKey: string;
  time: string;
  unread: boolean;
};

const NOTIFS: Notif[] = [
  { icon: 'Camera', iconBg: '#E8591A', titleKey: 'notif.scan', descKey: 'notif.scanDesc', time: 'maintenant', unread: true },
  { icon: 'Trophy', iconBg: '#F9A825', titleKey: 'notif.badge', descKey: 'notif.badgeDesc', time: '2h', unread: true },
  { icon: 'Calendar', iconBg: '#2E7D32', titleKey: 'notif.event', descKey: 'notif.eventDesc', time: '5h', unread: false },
  { icon: 'Globe', iconBg: '#1A237E', titleKey: 'notif.forum', descKey: 'notif.forumDesc', time: 'hier', unread: false },
  { icon: 'Ticket', iconBg: '#6D4C41', titleKey: 'notif.tombola', descKey: 'notif.tombolaDesc', time: 'hier', unread: false },
];

export default function Notifications() {
    const C = useColors();
  const { t } = useTranslation();
  const nav = useNavigation();
  const [activeTab, setActiveTab] = useState(0);

  const TABS = [
    t('notif.all'),
    t('notif.system'),
    t('notif.community'),
    t('notif.events'),
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        <TouchableOpacity
          style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => nav.goBack()}
        >
          <Icon name="ArrowLeft" size={17} color="#6D4C41" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 15, fontWeight: '700', color: C.ink, fontFamily: 'Inter-Bold' }}>
          {t('profile.notifications')}
        </Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 12, color: '#E8591A', fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>
            {t('notif.markAllRead')}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setActiveTab(i)}
            style={{ flex: 1, paddingVertical: 13, alignItems: 'center', borderBottomWidth: 2, borderColor: i === activeTab ? '#E8591A' : 'transparent' }}
          >
            <Text style={{ fontSize: 12, fontWeight: i === activeTab ? '700' : '500', color: i === activeTab ? '#E8591A' : '#8C8278', fontFamily: i === activeTab ? 'Inter-Bold' : 'Inter-Regular' }}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 6, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {NOTIFS.map((n, i) => (
          <TouchableOpacity
            key={i}
            activeOpacity={0.7}
            style={{
              flexDirection: 'row', gap: 14, paddingVertical: 14,
              borderBottomWidth: 1, borderColor: C.border,
              backgroundColor: n.unread ? '#FFFBF7' : 'transparent',
              marginHorizontal: -16, paddingHorizontal: 16,
              position: 'relative',
            }}
          >
            {/* Icon circle */}
            <View style={{
              width: 44, height: 44, borderRadius: 22, flexShrink: 0,
              alignItems: 'center', justifyContent: 'center',
              backgroundColor: n.unread ? n.iconBg : '#F5F0EB',
            }}>
              <Icon name={n.icon} size={20} color={n.unread ? '#fff' : n.iconBg} />
            </View>

            {/* Content */}
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                <Text style={{ fontSize: 13, fontWeight: n.unread ? '700' : '500', color: C.ink, flex: 1, fontFamily: n.unread ? 'Inter-Bold' : 'Inter-Regular' }}>
                  {t(n.titleKey)}
                </Text>
                <Text style={{ fontSize: 11, color: C.inkMute, flexShrink: 0 }}>{n.time}</Text>
              </View>
              <Text style={{ fontSize: 12, color: C.inkSoft, marginTop: 3, lineHeight: 17 }}>
                {t(n.descKey)}
              </Text>
            </View>

            {/* Unread dot */}
            {n.unread && (
              <View style={{ position: 'absolute', top: 20, right: 16, width: 8, height: 8, borderRadius: 4, backgroundColor: '#E8591A' }} />
            )}
          </TouchableOpacity>
        ))}

        {/* Empty state for other tabs */}
        {activeTab > 0 && (
          <View style={{ paddingTop: 60, alignItems: 'center', gap: 12 }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Bell" size={28} color="#E5E0D8" />
            </View>
            <Text style={{ color: C.inkMute, fontSize: 13 }}>Aucune notification</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
