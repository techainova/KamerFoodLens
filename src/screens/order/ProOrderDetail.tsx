import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { proService, type ProOrderDetail, type ProOrderStatus } from '@/services/pro.service';

function modeLabel(mode: string, t: (key: string) => string): string {
  switch (mode) {
    case 'delivery': return t('order.deliveryLabel');
    case 'pickup': return t('order.pickupLabel');
    case 'dine_in': return t('order.dineInLabel');
    case 'reservation': return t('order.reservationLabel');
    default: return mode;
  }
}

const NEXT_STATUS: Partial<Record<ProOrderStatus, ProOrderStatus>> = {
  pending: 'confirmed',
  confirmed: 'preparing',
  preparing: 'ready',
  ready: 'delivering',
  delivering: 'completed',
};

export default function ProOrderDetail() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const route = useRoute<any>();
  const orderId: string | undefined = route.params?.orderId;

  const [order, setOrder] = useState<ProOrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const loadOrder = async () => {
    if (!orderId) { setLoading(false); return; }
    const detail = await proService.getOrderDetail(orderId);
    setOrder(detail);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        await loadOrder();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const handleUpdateStatus = async (status: ProOrderStatus) => {
    if (!orderId || updating) return;
    setUpdating(true);
    try {
      const updated = await proService.updateOrderStatus(orderId, status);
      setOrder(updated);
    } catch {
      Alert.alert(t('common.error'), t('pro.orderUpdateError'));
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(t('pro.cancelOrderTitle'), t('pro.cancelOrderMsg'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.confirm'), style: 'destructive', onPress: () => void handleUpdateStatus('cancelled') },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
        <StatusBar barStyle={C.statusBar} />
        <ActivityIndicator color="#E8591A" />
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Icon name="ShoppingBag" size={48} color={C.inkMute} />
        <Text style={{ fontSize: 15, color: C.inkSoft, textAlign: 'center', marginTop: 16 }}>{t('pro.orderNotFound')}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          <Text style={{ color: '#E8591A', fontWeight: '600' }}>{t('common.goBack')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const netAmount = order.totalXAF - order.kflFeeXAF;
  const nextStatus = NEXT_STATUS[order.status];
  const canCancel = order.status !== 'completed' && order.status !== 'cancelled' && order.status !== 'delivering';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: C.ink, lineHeight: 22 }}>{order.ref}</Text>
          <Text style={{ fontSize: 12, color: C.inkMute }}>{t('pro.orderDetail')}</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Client */}
        <View style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, marginBottom: 16, ...SHADOW_SM }}>
          <Text style={{ fontSize: 11, color: C.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('pro.client')}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: C.inkSoft }}>{order.clientName[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{order.clientName}</Text>
              {!!order.clientPhone && <Text style={{ fontSize: 12, color: C.inkMute }}>{order.clientPhone}</Text>}
            </View>
          </View>
        </View>

        {/* Order info */}
        <View style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, marginBottom: 16, ...SHADOW_SM }}>
          {[
            { l: t('pro.orderNumber'), v: order.ref, green: false },
            { l: t('pro.time'), v: new Date(order.createdAt).toLocaleString(), green: false },
            { l: t('pro.mode'), v: modeLabel(order.mode, t), green: false },
            ...(order.paymentMethod ? [{ l: t('payment.title'), v: `${order.paymentMethod} · ${order.paymentStatus ?? ''}`, green: order.paymentStatus === 'succeeded' }] : []),
          ].map((row, i, arr) => (
            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: i < arr.length - 1 ? 1 : 0, borderColor: C.border }}>
              <Text style={{ fontSize: 14, color: C.inkMute }}>{row.l}</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: row.green ? '#2E7D32' : '#2C1810' }}>{row.v}</Text>
            </View>
          ))}
          {!!order.note && (
            <View style={{ paddingTop: 10, borderTopWidth: 1, borderColor: C.border, marginTop: 4 }}>
              <Text style={{ fontSize: 12, color: '#E8591A' }}>{t('order.noteLabel')}: {order.note}</Text>
            </View>
          )}
        </View>

        {/* Items */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 8 }}>{t('order.articles')}</Text>
        <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, marginBottom: 16, ...SHADOW_SM }}>
          {order.items.map((item, i) => (
            <View key={i} style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: i < order.items.length - 1 ? 1 : 0, borderColor: C.border }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{item.name} × {item.qty}</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>{(item.priceXAF * item.qty).toLocaleString()} XAF</Text>
              </View>
            </View>
          ))}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderColor: C.border }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>{t('pro.totalReceived')}</Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#E8591A' }}>{order.totalXAF.toLocaleString()} XAF</Text>
          </View>
        </View>

        {/* Commission */}
        <View style={{ padding: 14, borderRadius: 16, backgroundColor: C.navySoft, borderWidth: 1, borderColor: 'rgba(26,35,126,0.2)' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ fontSize: 14, color: '#1A237E' }}>{t('pro.kflCommission')}</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A237E' }}>−{order.kflFeeXAF.toLocaleString()} XAF</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#1A237E' }}>{t('pro.netAmount')}</Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#1A237E' }}>{netAmount.toLocaleString()} XAF</Text>
          </View>
        </View>
      </ScrollView>

      {/* Actions */}
      {(canCancel || nextStatus) && (
        <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
          {canCancel && (
            <TouchableOpacity
              onPress={handleCancel}
              disabled={updating}
              style={{ flex: 1, height: 44, borderWidth: 1, borderColor: 'rgba(198,40,40,0.4)', borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ fontSize: 14, color: '#C62828' }}>{t('common.cancel')}</Text>
            </TouchableOpacity>
          )}
          {nextStatus && (
            <TouchableOpacity
              onPress={() => void handleUpdateStatus(nextStatus)}
              disabled={updating}
              style={{ flex: 2, height: 44, backgroundColor: '#2E7D32', borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}
              activeOpacity={0.85}
            >
              {updating ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{t(`order.statuses.${nextStatus}`)}</Text>
              )}
            </TouchableOpacity>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
