import React, { useState } from 'react';
import {
  ScrollView, StatusBar, TouchableOpacity, View, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useColors } from '@/hooks/useAppTheme';
import Icon from '@/components/ui/Icon';
import { fontFamily, fontSize, radius, spacing } from '@/constants/theme';
import { SHADOW_SM } from '@/constants/theme';
import { proService, type ProOrderStatus } from '@/services/pro.service';

type FilterId = 'all' | ProOrderStatus;

const STATUS_ORDER: ProOrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'completed', 'cancelled'];

function statusBadgeColors(status: ProOrderStatus, C: ReturnType<typeof useColors>): { bg: string; text: string } {
  switch (status) {
    case 'pending':    return { bg: C.goldSoft,    text: C.primary };
    case 'confirmed':  return { bg: C.navySoft,    text: C.navy    };
    case 'preparing':  return { bg: C.navySoft,    text: C.navy    };
    case 'ready':      return { bg: C.successSoft, text: C.success };
    case 'delivering': return { bg: C.successSoft, text: C.success };
    case 'completed':  return { bg: C.surface2,    text: C.inkMute };
    case 'cancelled':  return { bg: C.errorSoft,   text: C.error   };
    default:           return { bg: C.surface2,    text: C.inkMute };
  }
}

function relativeTime(isoDate: string): string {
  return new Date(isoDate).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export default function ProOrders() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterId>('all');

  const { data, isLoading } = useQuery({
    queryKey: ['pro-orders', activeFilter],
    queryFn: () => proService.getOrders(activeFilter === 'all' ? undefined : activeFilter, 1),
    staleTime: 60_000,
  });

  const orders = data?.items ?? [];

  const FILTER_TABS: Array<{ id: FilterId; label: string }> = [
    { id: 'all', label: t('order.tabAll') },
    ...STATUS_ORDER.map((s) => ({ id: s, label: t(`order.statuses.${s}`) })),
  ];

  const dayTotal = orders.reduce((sum, o) => sum + o.totalXAF, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }} edges={['top']}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View
        style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
          backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border,
          ...SHADOW_SM,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: spacing.xs }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>

        <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.lg, color: C.ink }}>
          {t('pro.orders')}
        </Text>

        <View style={{ width: 30 }} />
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border }}
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.sm }}
      >
        {FILTER_TABS.map(tab => {
          const isActive = activeFilter === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveFilter(tab.id)}
              style={{
                paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2,
                borderRadius: radius.full,
                backgroundColor: isActive ? C.primary : C.surface2,
                borderWidth: 1, borderColor: isActive ? C.primary : C.border,
              }}
            >
              <Text style={{ fontFamily: isActive ? fontFamily.bold : fontFamily.medium, fontSize: fontSize.sm, color: isActive ? C.surface : C.inkSoft }}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.primary} size="large" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ paddingTop: spacing.sm }}>
            {orders.length === 0 ? (
              <Text style={{ fontSize: 13, color: C.inkMute, textAlign: 'center', paddingVertical: 40 }}>{t('pro.noRecentOrders')}</Text>
            ) : (
              orders.map(order => {
                const badge = statusBadgeColors(order.status, C);
                return (
                  <TouchableOpacity
                    key={order.id}
                    onPress={() => navigation.navigate('ProOrderDetail', { orderId: order.id })}
                    style={{
                      flexDirection: 'row', alignItems: 'center',
                      marginHorizontal: spacing.md, marginBottom: spacing.sm,
                      backgroundColor: C.surface, borderRadius: radius.md,
                      borderWidth: 1, borderColor: order.status === 'pending' ? C.primary : C.border,
                      padding: spacing.md, gap: spacing.sm,
                      ...SHADOW_SM,
                    }}
                  >
                    <View style={{ width: 44, height: 44, borderRadius: radius.full, backgroundColor: C.navySoft, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: C.navy }}>
                        {order.clientName.split(' ').map((w) => w[0] ?? '').join('').toUpperCase().slice(0, 2)}
                      </Text>
                    </View>

                    <View style={{ flex: 1 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                        <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: C.ink }}>
                          {order.clientName}
                        </Text>
                        <View style={{ backgroundColor: badge.bg, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 2 }}>
                          <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: badge.text }}>
                            {t(`order.statuses.${order.status}`)}
                          </Text>
                        </View>
                      </View>
                      <Text style={{ fontFamily: fontFamily.mono, fontSize: fontSize.xs, color: C.inkMute, marginBottom: 2 }}>
                        {order.ref}
                      </Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: C.inkSoft }}>
                          {relativeTime(order.createdAt)}
                        </Text>
                        <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: C.ink }}>
                          {order.totalXAF.toLocaleString()} XAF
                        </Text>
                      </View>
                    </View>

                    <Icon name="ChevronRight" size={18} color={C.inkMute} />
                  </TouchableOpacity>
                );
              })
            )}
          </View>

          {orders.length > 0 && (
            <View
              style={{
                marginHorizontal: spacing.md, marginTop: spacing.sm, marginBottom: spacing.xxl,
                backgroundColor: C.surface, borderRadius: radius.md, borderWidth: 1, borderColor: C.border,
                padding: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md,
                ...SHADOW_SM,
              }}
            >
              <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: C.ink }}>
                {t('order.dailyTotal')} :
              </Text>
              <Text style={{ fontFamily: fontFamily.serifBold, fontSize: fontSize.md, color: C.primary }}>
                {dayTotal.toLocaleString()} XAF
              </Text>
              <Text style={{ fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: C.inkMute }}>
                · {t('order.ordersCount', { count: orders.length })}
              </Text>
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
