import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, Alert, Share, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_MD } from '@/constants/theme';
import { ordersService, type Order, type OrderStatus } from '@/services/orders.service';
import { useRestaurantStore } from '@/store/restaurant.store';
import { socketService } from '@/services/socket.service';

function statusStyle(status: OrderStatus, C: ReturnType<typeof useColors>): { icon: 'Check' | 'Clock' | 'X'; color: string; bg: string; border: string } {
  switch (status) {
    case 'pending':    return { icon: 'Clock', color: C.gold,    bg: C.goldSoft,    border: C.gold };
    case 'confirmed':
    case 'preparing':  return { icon: 'Clock', color: C.navy,    bg: C.navySoft,    border: C.navy };
    case 'ready':
    case 'delivering': return { icon: 'Check', color: C.success, bg: C.successSoft, border: C.success };
    case 'completed':  return { icon: 'Check', color: C.success, bg: C.successSoft, border: C.success };
    case 'cancelled':  return { icon: 'X',     color: C.error,   bg: C.errorSoft,   border: C.error };
    default:           return { icon: 'Clock', color: C.inkMute, bg: C.surface2,    border: C.border };
  }
}

export default function OrderInvoice() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const C = useColors();
  const { t } = useTranslation();

  const orderId: string | undefined = route.params?.orderId;
  const fetchRestaurantById = useRestaurantStore(s => s.fetchById);

  const [order, setOrder] = useState<Order | null>(null);
  const [restaurantName, setRestaurantName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!orderId) {
      setLoading(false);
      return;
    }
    (async () => {
      setLoading(true);
      try {
        const detail = await ordersService.getDetail(orderId);
        if (cancelled) return;
        setOrder(detail);
        const restaurant = await fetchRestaurantById(detail.restaurantId);
        if (!cancelled && restaurant) setRestaurantName(restaurant.name);
      } catch {
        if (!cancelled) setOrder(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    socketService.connectOrders((update) => {
      if (update.orderId === orderId) {
        setOrder((prev) => (prev ? { ...prev, status: update.status, updatedAt: update.updatedAt } : prev));
      }
    });

    return () => {
      cancelled = true;
      socketService.disconnectOrders();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#E8591A" size="large" />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: C.inkMute }}>{t('order.invoiceNotFound')}</Text>
      </SafeAreaView>
    );
  }

  const dateStr = new Date(order.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const status = statusStyle(order.status, C);
  const subtotalXAF = order.items.reduce((sum, i) => sum + i.priceXAF * i.qty, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('order.invoice')}</Text>
        <TouchableOpacity
          onPress={() => Share.share({ message: `KFL ${order.ref} · ${order.totalXAF.toLocaleString()} XAF · ${restaurantName}` })}
          style={{ width: 36, height: 36, borderWidth: 1, borderColor: C.border, borderRadius: 18, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="Share2" size={16} color="#6D4C41" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>

        {/* Invoice header */}
        <View style={{ padding: 20, borderRadius: 20, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, marginBottom: 16, ...SHADOW_MD }}>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: status.bg, borderWidth: 2, borderColor: status.border, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Icon name={status.icon} size={22} color={status.color} />
            </View>
            <Text style={{ fontSize: 18, fontFamily: 'PlayfairDisplay-Bold', color: C.ink }}>{t(`order.statuses.${order.status}`)}</Text>
            <Text style={{ fontSize: 12, color: C.inkMute }}>{dateStr}</Text>
          </View>

          {[
            { l: t('order.invoiceNumberShort'), v: order.ref },
            { l: t('order.restaurantLabel'), v: restaurantName || '—' },
          ].map((row, i, arr) => (
            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderColor: C.border }}>
              <Text style={{ fontSize: 14, color: C.inkMute }}>{row.l}</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#2C1810' }}>{row.v}</Text>
            </View>
          ))}
        </View>

        {/* Items */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 8 }}>{t('order.articles')}</Text>
        <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, marginBottom: 16 }}>
          {order.items.map((item, i) => (
            <View key={item.id} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: i < order.items.length - 1 ? 1 : 0, borderColor: C.border }}>
              <Text style={{ fontSize: 14, color: C.ink }}>{item.name} × {item.qty}</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{(item.priceXAF * item.qty).toLocaleString()} XAF</Text>
            </View>
          ))}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderColor: C.border }}>
            <Text style={{ fontSize: 14, color: C.inkMute }}>{t('order.subtotal')}</Text>
            <Text style={{ fontSize: 14, color: C.inkSoft }}>{subtotalXAF.toLocaleString()} XAF</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderColor: C.border }}>
            <Text style={{ fontSize: 14, color: C.inkMute }}>{t('pro.kflCommission')}</Text>
            <Text style={{ fontSize: 14, color: C.inkSoft }}>{order.kflFeeXAF.toLocaleString()} XAF</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>{t('order.total')}</Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#E8591A' }}>{order.totalXAF.toLocaleString()} XAF</Text>
          </View>
        </View>

        {/* QR placeholder */}
        <View style={{ alignItems: 'center', paddingVertical: 20, marginBottom: 16 }}>
          <Text style={{ fontSize: 11, color: C.inkMute, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>{t('order.invoiceQr')}</Text>
          <View style={{ width: 128, height: 128, backgroundColor: C.surface2, borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="QrCode" size={56} color="rgba(140,130,120,0.35)" />
          </View>
          <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 8, fontFamily: 'JetBrainsMono-Regular' }}>{order.ref}</Text>
        </View>
      </ScrollView>

      {/* Actions */}
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        <TouchableOpacity
          onPress={() => Alert.alert(t('settings.comingSoonTitle'), t('settings.comingSoonMsg'))}
          style={{ flex: 1, height: 44, borderWidth: 1, borderColor: C.border, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 14, color: C.inkSoft }}>{t('order.downloadPDF')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('OrderHistory')}
          style={{ flex: 1, height: 44, backgroundColor: '#E8591A', borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}
          activeOpacity={0.85}
        >
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{t('order.myOrders')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
