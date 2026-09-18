import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import type { IconName } from '@/components/ui/Icon';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useNotificationsStore } from '@/store/notifications.store';
import type { Notification, NotificationType } from '@/services/users.service';
import { timeAgo } from '@/utils/timeAgo';

const TYPE_META: Record<NotificationType, { icon: IconName; color: string }> = {
  order: { icon: 'ShoppingBag', color: '#E8591A' },
  payment: { icon: 'CreditCard', color: '#2E7D32' },
  event: { icon: 'Calendar', color: '#1A237E' },
  course: { icon: 'GraduationCap', color: '#6D4C41' },
  community: { icon: 'Heart', color: '#C2185B' },
  system: { icon: 'Megaphone', color: '#F9A825' },
  badge: { icon: 'Trophy', color: '#8E24AA' },
};

const TABS: Array<{ labelKey: string; type: NotificationType | undefined }> = [
  { labelKey: 'notif.all', type: undefined },
  { labelKey: 'notif.system', type: 'system' },
  { labelKey: 'notif.community', type: 'community' },
  { labelKey: 'notif.events', type: 'event' },
];

export default function Notifications() {
  const C = useColors();
  const { t } = useTranslation();
  const nav = useNavigation();
  const [activeTab, setActiveTab] = useState(0);

  const items = useNotificationsStore((s) => s.items);
  const isLoading = useNotificationsStore((s) => s.isInboxLoading);
  const unreadCount = useNotificationsStore((s) => s.unreadCount);
  const fetchFirstPage = useNotificationsStore((s) => s.fetchFirstPage);
  const fetchNextPage = useNotificationsStore((s) => s.fetchNextPage);
  const markRead = useNotificationsStore((s) => s.markRead);
  const markAllRead = useNotificationsStore((s) => s.markAllRead);
  const deleteNotification = useNotificationsStore((s) => s.deleteNotification);

  useFocusEffect(
    React.useCallback(() => {
      void fetchFirstPage(TABS[activeTab].type);
      // Le changement d'onglet est géré par l'effet ci-dessous ; celui-ci ne
      // recharge qu'au moment où l'écran regagne le focus (retour arrière…).
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []),
  );

  useEffect(() => {
    void fetchFirstPage(TABS[activeTab].type);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const onPressItem = (notif: Notification) => {
    if (!notif.isRead) void markRead(notif.id);
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const meta = TYPE_META[item.type] ?? TYPE_META.system;
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => onPressItem(item)}
        style={{
          flexDirection: 'row', gap: 14, paddingVertical: 14,
          borderBottomWidth: 1, borderColor: C.border,
          backgroundColor: !item.isRead ? '#FFFBF7' : 'transparent',
          paddingHorizontal: 16,
        }}
      >
        <View style={{
          width: 44, height: 44, borderRadius: 22, flexShrink: 0,
          alignItems: 'center', justifyContent: 'center',
          backgroundColor: !item.isRead ? meta.color : '#F5F0EB',
        }}>
          <Icon name={meta.icon} size={20} color={!item.isRead ? '#fff' : meta.color} />
        </View>

        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: !item.isRead ? '700' : '500', color: C.ink, flex: 1, fontFamily: !item.isRead ? 'Inter-Bold' : 'Inter-Regular' }}>
              {item.title}
            </Text>
            <Text style={{ fontSize: 11, color: C.inkMute, flexShrink: 0 }}>{timeAgo(item.createdAt)}</Text>
          </View>
          <Text style={{ fontSize: 12, color: C.inkSoft, marginTop: 3, lineHeight: 17 }}>
            {item.body}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => void deleteNotification(item.id)}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          style={{ alignSelf: 'center', padding: 4 }}
        >
          <Icon name="Trash2" size={16} color={C.inkMute} />
        </TouchableOpacity>

        {!item.isRead && (
          <View style={{ position: 'absolute', top: 20, right: 44, width: 8, height: 8, borderRadius: 4, backgroundColor: '#E8591A' }} />
        )}
      </TouchableOpacity>
    );
  };

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
        {unreadCount > 0 && (
          <TouchableOpacity onPress={() => void markAllRead()}>
            <Text style={{ fontSize: 12, color: '#E8591A', fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>
              {t('notif.markAllRead')}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={tab.labelKey}
            onPress={() => setActiveTab(i)}
            style={{ flex: 1, paddingVertical: 13, alignItems: 'center', borderBottomWidth: 2, borderColor: i === activeTab ? '#E8591A' : 'transparent' }}
          >
            <Text style={{ fontSize: 12, fontWeight: i === activeTab ? '700' : '500', color: i === activeTab ? '#E8591A' : '#8C8278', fontFamily: i === activeTab ? 'Inter-Bold' : 'Inter-Regular' }}>
              {t(tab.labelKey)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={items}
        keyExtractor={(n) => n.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        onEndReached={() => void fetchNextPage()}
        onEndReachedThreshold={1.2}
        ListFooterComponent={isLoading && items.length > 0 ? (
          <ActivityIndicator style={{ marginVertical: 16 }} color="#E8591A" />
        ) : null}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator style={{ marginTop: 60 }} color="#E8591A" />
          ) : (
            <View style={{ paddingTop: 60, alignItems: 'center', gap: 12 }}>
              <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Bell" size={28} color="#E5E0D8" />
              </View>
              <Text style={{ color: C.inkMute, fontSize: 13 }}>{t('notif.empty', 'Aucune notification')}</Text>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
}
