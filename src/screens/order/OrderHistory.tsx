import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { ordersService, type Order, type OrderStatus } from '@/services/orders.service';
import { useRestaurantStore } from '@/store/restaurant.store';

type TabId = 0 | 1 | 2 | 3;

const STATUS_TAB: Record<OrderStatus, TabId> = {
  pending: 1, confirmed: 1, preparing: 1, ready: 1, delivering: 1,
  completed: 2,
  cancelled: 3,
};

function statusStyle(status: OrderStatus): { color: string; bg: string } {
  switch (status) {
    case 'pending':
    case 'confirmed':  return { color: '#E8591A', bg: '#FEF3EC' };
    case 'preparing':  return { color: '#F9A825', bg: '#FBF3DC' };
    case 'ready':
    case 'delivering': return { color: '#2E7D32', bg: '#E3F0E4' };
    case 'completed':  return { color: '#2E7D32', bg: '#E3F0E4' };
    case 'cancelled':  return { color: '#C62828', bg: '#FBDCDC' };
    default:           return { color: '#8C8278', bg: '#F5F0EB' };
  }
}

export default function OrderHistory() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<TabId>(0);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['orders-history'],
    queryFn: () => ordersService.getList(1),
    staleTime: 30_000,
  });
  const orders = data?.items ?? [];

  const restaurants = useRestaurantStore(s => s.restaurants);
  const fetchRestaurantById = useRestaurantStore(s => s.fetchById);

  useEffect(() => {
    const uniqueIds = Array.from(new Set(orders.map(o => o.restaurantId)));
    for (const id of uniqueIds) {
      if (!restaurants.some(r => r.id === id)) {
        void fetchRestaurantById(id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders.length]);

  const restaurantName = (restaurantId: string): string =>
    restaurants.find(r => r.id === restaurantId)?.name ?? '…';

  const TABS = [
    t('order.tabAll'),
    t('order.tabInProgress'),
    t('order.tabCompleted'),
    t('order.tabCancelled'),
  ];

  const STATUS_LABEL: Record<OrderStatus, string> = {
    pending: t('order.statuses.pending'),
    confirmed: t('order.statuses.confirmed'),
    preparing: t('order.statuses.preparing'),
    ready: t('order.statuses.ready'),
    delivering: t('order.statuses.delivering'),
    completed: t('order.statuses.completed'),
    cancelled: t('order.statuses.cancelled'),
  };

  const filtered = orders.filter(o => activeTab === 0 || STATUS_TAB[o.status] === activeTab);

  const handleCancel = (order: Order) => {
    Alert.alert(t('order.cancelOrderTitle', 'Annuler la commande'), t('order.cancelOrderMsg', 'Voulez-vous vraiment annuler cette commande ?'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.confirm'), style: 'destructive', onPress: async () => {
          setCancellingId(order.id);
          try {
            await ordersService.cancel(order.id);
            await queryClient.invalidateQueries({ queryKey: ['orders-history'] });
          } catch {
            Alert.alert(t('common.error'), t('pro.orderUpdateError'));
          } finally {
            setCancellingId(null);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('order.myOrders')}</Text>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, borderBottomWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        <View style={{ flexDirection: 'row' }}>
          {TABS.map((tab, i) => (
            <TouchableOpacity key={i} onPress={() => setActiveTab(i as TabId)}
              style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 2, borderColor: i === activeTab ? '#E8591A' : 'transparent' }}>
              <Text style={{ fontSize: 14, fontWeight: i === activeTab ? '600' : '500', color: i === activeTab ? '#E8591A' : '#8C8278' }}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#E8591A" size="large" />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 12 }} showsVerticalScrollIndicator={false}>
          {filtered.length === 0 && (
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
              <Icon name="ShoppingBag" size={48} color="rgba(140,130,120,0.3)" />
              <Text style={{ fontSize: 15, color: C.inkMute, marginTop: 12 }}>{t('order.noOrders')}</Text>
            </View>
          )}
          {filtered.map((order) => {
            const s = statusStyle(order.status);
            const label = STATUS_LABEL[order.status];
            const dateStr = new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
            const itemsStr = order.items.map(i => `${i.name} ×${i.qty}`).join(', ');
            const cancellable = order.status === 'pending' || order.status === 'confirmed';
            return (
              <TouchableOpacity key={order.id} onPress={() => navigation.navigate('OrderInvoice', { orderId: order.id })} style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>{restaurantName(order.restaurantId)}</Text>
                    <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 1 }}>{order.ref} · {dateStr}</Text>
                  </View>
                  <View style={{ height: 24, paddingHorizontal: 10, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: s.bg }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: s.color }}>{label}</Text>
                  </View>
                </View>
                <Text style={{ fontSize: 12, color: C.inkSoft, marginBottom: 10 }} numberOfLines={1}>{itemsStr}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>{order.totalXAF.toLocaleString()} XAF</Text>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    {order.status === 'completed' && (
                      <TouchableOpacity onPress={() => navigation.navigate('OrderMenu', { restaurantId: order.restaurantId })} style={{ height: 30, paddingHorizontal: 12, backgroundColor: '#E8591A', borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{t('order.reorder')}</Text>
                      </TouchableOpacity>
                    )}
                    {cancellable && (
                      <TouchableOpacity
                        onPress={() => handleCancel(order)}
                        disabled={cancellingId === order.id}
                        style={{ height: 30, paddingHorizontal: 12, borderWidth: 1, borderColor: C.error, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}
                      >
                        {cancellingId === order.id ? <ActivityIndicator size="small" color={C.error} /> : <Text style={{ fontSize: 12, color: C.error }}>{t('common.cancel')}</Text>}
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity onPress={() => navigation.navigate('OrderInvoice', { orderId: order.id })} style={{ height: 30, paddingHorizontal: 12, borderWidth: 1, borderColor: C.border, borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 12, color: C.inkSoft }}>{t('order.details')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
