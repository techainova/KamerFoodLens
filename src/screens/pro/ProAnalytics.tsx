import React, { useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { proService, type ProAnalyticsSummary, type ProOrderStatus } from '@/services/pro.service';

type Period = 'week' | 'month' | 'year';

const STATUS_ORDER: ProOrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'delivering', 'completed', 'cancelled'];

function statusColor(status: string, C: ReturnType<typeof useColors>): string {
  switch (status) {
    case 'pending':    return C.primary;
    case 'confirmed':
    case 'preparing':  return C.navy;
    case 'ready':
    case 'delivering': return C.success;
    case 'completed':  return C.inkMute;
    case 'cancelled':  return C.error;
    default:           return C.inkMute;
  }
}

export default function ProAnalytics() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [period, setPeriod] = useState<Period>('month');

  const { data, isLoading } = useQuery<ProAnalyticsSummary>({
    queryKey: ['pro-analytics', period],
    queryFn: () => proService.getAnalytics(period),
    staleTime: 5 * 60 * 1000,
  });

  const ordersByStatus = data?.ordersByStatus ?? {};
  const totalOrders = Object.values(ordersByStatus).reduce((sum, n) => sum + n, 0);
  const maxStatusCount = Math.max(...Object.values(ordersByStatus), 1);
  const topMenuItems = data?.topMenuItems ?? [];
  const maxQty = Math.max(...topMenuItems.map(i => i.qty), 1);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('proAnalytics.title')}</Text>
      </View>

      {/* Period selector */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
        <View style={{ flexDirection: 'row', backgroundColor: C.surface2, borderRadius: 14, padding: 4 }}>
          {(['week', 'month', 'year'] as Period[]).map((p) => (
            <TouchableOpacity
              key={p} onPress={() => setPeriod(p)}
              style={{ flex: 1, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: period === p ? C.surface : 'transparent', ...(period === p ? SHADOW_SM : {}) }}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: period === p ? C.ink : C.inkMute }}>
                {t(`pro.period${p.charAt(0).toUpperCase()}${p.slice(1)}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.primary} size="large" />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

          {/* Total orders hero */}
          <View style={{ padding: 16, borderRadius: 20, backgroundColor: C.navy, marginBottom: 16 }}>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 4 }}>{t('proAnalytics.totalOrders')}</Text>
            <Text style={{ color: '#fff', fontSize: 28, fontFamily: 'PlayfairDisplay-Bold' }}>{totalOrders}</Text>
          </View>

          {/* Orders by status */}
          <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>{t('proAnalytics.ordersByStatus')}</Text>
          <View style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, marginBottom: 16, ...SHADOW_SM }}>
            {totalOrders === 0 ? (
              <Text style={{ fontSize: 13, color: C.inkMute, textAlign: 'center', paddingVertical: 8 }}>{t('proAnalytics.noOrdersPeriod')}</Text>
            ) : (
              STATUS_ORDER.filter(s => (ordersByStatus[s] ?? 0) > 0).map((status, i, arr) => {
                const count = ordersByStatus[status] ?? 0;
                const color = statusColor(status, C);
                return (
                  <View key={status} style={{ marginBottom: i < arr.length - 1 ? 12 : 0 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                      <Text style={{ fontSize: 13, color: C.ink }}>{t(`order.statuses.${status}`)}</Text>
                      <Text style={{ fontSize: 13, fontWeight: '700', color }}>{count}</Text>
                    </View>
                    <View style={{ height: 6, backgroundColor: C.surface2, borderRadius: 3, overflow: 'hidden' }}>
                      <View style={{ height: '100%', width: `${(count / maxStatusCount) * 100}%`, backgroundColor: color, borderRadius: 3 }} />
                    </View>
                  </View>
                );
              })
            )}
          </View>

          {/* Top menu items */}
          <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>{t('proAnalytics.topItems')}</Text>
          <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
            {topMenuItems.length === 0 ? (
              <Text style={{ fontSize: 13, color: C.inkMute, textAlign: 'center', paddingVertical: 24 }}>{t('proAnalytics.noItemsPeriod')}</Text>
            ) : (
              topMenuItems.map((item, i) => (
                <View key={item.name} style={{ paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: i < topMenuItems.length - 1 ? 1 : 0, borderColor: C.border }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <Text style={{ fontSize: 14, color: C.ink }}>{item.name}</Text>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: C.primary }}>{item.qty} {t('proAnalytics.unitsSold')}</Text>
                  </View>
                  <View style={{ height: 4, backgroundColor: C.surface2, borderRadius: 2, overflow: 'hidden' }}>
                    <View style={{ height: '100%', width: `${(item.qty / maxQty) * 100}%`, backgroundColor: C.primary, borderRadius: 2 }} />
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
