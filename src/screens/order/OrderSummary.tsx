import React, { useState } from 'react';
import {
  View, TextInput, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { useCartStore } from '@/store/cart.store';
import { useRestaurantStore } from '@/store/restaurant.store';

export default function OrderSummary() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('delivery');
  const [note, setNote] = useState('');

  const { items, restaurantId, restaurantName, updateQty, removeItem, total: cartTotal } = useCartStore();
  const restaurant = restaurantId ? useRestaurantStore.getState().getById(restaurantId) : null;

  const subtotal = cartTotal();
  const delivery = deliveryMode === 'delivery' ? 1000 : 0;
  const total = subtotal + delivery;

  if (items.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="ShoppingCart" size={48} color="rgba(140,130,120,0.3)" />
        <Text style={{ fontSize: 16, color: C.inkMute, marginTop: 12 }}>{t('order.emptyCart')}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16, paddingHorizontal: 24, paddingVertical: 10, backgroundColor: '#E8591A', borderRadius: 20 }}>
          <Text style={{ color: '#fff', fontWeight: '600' }}>{t('order.orderCta')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('order.summary')}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Restaurant */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, marginBottom: 16, ...SHADOW_SM }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: C.surface2, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{restaurantName ?? ''}</Text>
            {restaurant && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 2 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="MapPin" size={11} color="#8C8278" />
                  <Text style={{ fontSize: 12, color: C.inkMute }}>{restaurant.distance}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="Clock" size={11} color="#8C8278" />
                  <Text style={{ fontSize: 12, color: C.inkMute }}>~{restaurant.deliveryTime} min</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Items */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 8 }}>{t('order.articles')}</Text>
        <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, marginBottom: 16, ...SHADOW_SM }}>
          {items.map((item, i) => (
            <View key={item.id} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: i < items.length - 1 ? 1 : 0, borderColor: C.border }}>
              {/* Qty controls */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginRight: 10 }}>
                <TouchableOpacity onPress={() => item.qty <= 1 ? removeItem(item.id) : updateQty(item.id, item.qty - 1)}
                  style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="Minus" size={10} color="#E8591A" />
                </TouchableOpacity>
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink, minWidth: 16, textAlign: 'center' }}>{item.qty}</Text>
                <TouchableOpacity onPress={() => updateQty(item.id, item.qty + 1)}
                  style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="Plus" size={10} color="#fff" />
                </TouchableOpacity>
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: C.ink }}>{item.name}</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{(item.price * item.qty).toLocaleString()} XAF</Text>
            </View>
          ))}
        </View>

        {/* Delivery mode */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 8 }}>{t('order.deliveryMode')}</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          {([
            { mode: 'delivery' as const, icon: 'Truck', label: t('order.deliveryLabel'), price: '1 000 XAF' },
            { mode: 'pickup' as const,   icon: 'Home',  label: t('order.pickupLabel'),   price: t('common.free') },
          ]).map(({ mode, icon, label, price }) => (
            <TouchableOpacity key={mode} onPress={() => setDeliveryMode(mode)}
              style={{ flex: 1, padding: 14, borderRadius: 18, borderWidth: 2, backgroundColor: deliveryMode === mode ? '#FEF3EC' : '#fff', borderColor: deliveryMode === mode ? '#E8591A' : '#E5E0D8' }}>
              <Icon name={icon} size={22} color={deliveryMode === mode ? '#E8591A' : '#8C8278'} />
              <Text style={{ fontSize: 14, fontWeight: '600', color: deliveryMode === mode ? '#E8591A' : '#2C1810', marginTop: 6 }}>{label}</Text>
              <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 2 }}>{price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Note */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 8 }}>{t('order.noteLabel')}</Text>
        <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16, minHeight: 80 }}>
          <TextInput value={note} onChangeText={setNote} placeholder={t('order.notePlaceholderFull')} placeholderTextColor="#8C8278" multiline numberOfLines={3} style={{ fontSize: 14, color: C.ink }} />
        </View>

        {/* Price breakdown */}
        <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, padding: 16, ...SHADOW_SM }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 14, color: C.inkSoft }}>{t('order.subtotal')}</Text>
            <Text style={{ fontSize: 14, color: C.ink }}>{subtotal.toLocaleString()} XAF</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8, borderBottomWidth: 1, borderColor: C.border, marginBottom: 8 }}>
            <Text style={{ fontSize: 14, color: C.inkSoft }}>{t('order.deliveryLabel')}</Text>
            <Text style={{ fontSize: 14, color: C.ink }}>{delivery === 0 ? t('common.free') : `${delivery.toLocaleString()} XAF`}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>{t('order.total')}</Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#E8591A' }}>{total.toLocaleString()} XAF</Text>
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('OrderPayment', {
            total, note, deliveryMode,
            restaurantId, restaurantName,
            items: items.map(i => ({ id: i.id, name: i.name, qty: i.qty, price: i.price })),
            subtotal, delivery,
          })}
          style={{ height: 48, backgroundColor: '#E8591A', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}
          activeOpacity={0.85}
        >
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{t('order.proceedWithAmount', { total: total.toLocaleString() })}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
