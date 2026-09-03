import React, { useState } from 'react';
import {
  View, TextInput, TouchableOpacity, ScrollView, StatusBar, Alert, ActivityIndicator, Linking,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { useCartStore } from '@/store/cart.store';
import { ordersService, type OrderMode } from '@/services/orders.service';
import { paymentsService, type PaymentMethod } from '@/services/payments.service';

type UiMethod = 'mtn' | 'orange' | 'wallet';

const METHODS: { id: UiMethod; label: string; subLabel: string; color: string; icon: 'Smartphone' | 'Wallet' }[] = [
  { id: 'mtn',    label: 'MTN Mobile Money', subLabel: 'Payer via CinetPay',  color: '#F9A825', icon: 'Smartphone' },
  { id: 'orange', label: 'Orange Money',      subLabel: 'Payer via CinetPay', color: '#E8591A', icon: 'Smartphone' },
  { id: 'wallet', label: 'Portefeuille KFL',  subLabel: 'Débit immédiat',     color: '#2E7D32', icon: 'Wallet' },
];

// Both Mobile Money options route through CinetPay's hosted checkout — the backend has
// a single 'cinetpay' method, not separate mtn_momo/orange_money values.
function toBackendMethod(uiMethod: UiMethod): PaymentMethod {
  return uiMethod === 'wallet' ? 'wallet' : 'cinetpay';
}

interface RouteItem { id: string; name: string; qty: number; price: number }

export default function OrderPayment() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [method, setMethod] = useState<UiMethod>('mtn');
  const [phone, setPhone] = useState('');
  const [processing, setProcessing] = useState(false);

  const {
    total = 0,
    note = '',
    deliveryMode = 'delivery',
    restaurantId = '',
    restaurantName = '',
    items = [] as RouteItem[],
  } = route.params ?? {};

  const clearCart = useCartStore(s => s.clearCart);
  const needsPhone = method !== 'wallet';

  const handleConfirm = async () => {
    if (processing) return;
    if (needsPhone && !phone.trim()) return;
    if (!restaurantId || items.length === 0) return;

    setProcessing(true);
    try {
      const order = await ordersService.create({
        restaurantId,
        items: items.map((i: RouteItem) => ({ menuItemId: i.id, qty: i.qty })),
        mode: (deliveryMode === 'delivery' ? 'delivery' : 'pickup') as OrderMode,
        note: note || undefined,
      });

      const result = await paymentsService.initiate({ orderId: order.id, method: toBackendMethod(method) });

      if (toBackendMethod(method) === 'cinetpay') {
        if (result.paymentUrl) {
          await Linking.openURL(result.paymentUrl);
        } else {
          // No payment gateway credentials configured (or the gateway is unreachable) — the
          // order exists but nothing was charged yet. Being explicit beats a silent false "paid".
          Alert.alert(
            t('payment.gatewayUnavailableTitle', 'Paiement indisponible'),
            t('payment.gatewayUnavailableMsg', "La commande a été créée mais le paiement n'a pas pu être initié. Réessayez depuis l'historique de vos commandes."),
          );
        }
      }

      clearCart();
      navigation.navigate('OrderInvoice', { orderId: order.id });
    } catch {
      Alert.alert(t('common.error'), t('payment.paymentFailedMsg', "Le paiement n'a pas pu être effectué."));
    } finally {
      setProcessing(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('payment.orderTitle')}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>

        {/* Amount hero */}
        <View style={{ alignItems: 'center', paddingVertical: 24, marginBottom: 16 }}>
          <Text style={{ fontSize: 11, color: C.inkMute, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4 }}>{t('payment.amountDue')}</Text>
          <Text style={{ fontSize: 36, fontFamily: 'PlayfairDisplay-Bold', color: '#E8591A' }}>{total.toLocaleString()} XAF</Text>
          <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 4 }}>{restaurantName}</Text>
        </View>

        {/* Methods */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>{t('payment.chooseMethod')}</Text>
        <View style={{ gap: 10, marginBottom: 16 }}>
          {METHODS.map(m => (
            <TouchableOpacity key={m.id} onPress={() => setMethod(m.id)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 18, borderWidth: 2, backgroundColor: method === m.id ? '#FEF3EC' : '#fff', borderColor: method === m.id ? '#E8591A' : '#E5E0D8', ...SHADOW_SM }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: m.color + '20' }}>
                <Icon name={m.icon} size={20} color={m.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{m.label}</Text>
                <Text style={{ fontSize: 12, color: C.inkMute }}>{m.subLabel}</Text>
              </View>
              <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center', borderColor: method === m.id ? '#E8591A' : '#E5E0D8' }}>
                {method === m.id && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#E8591A' }} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {needsPhone && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>{t('payment.phoneLabel')}</Text>
            <View style={{ height: 48, borderWidth: 1, borderColor: phone.length > 0 ? '#E8591A' : C.border, borderRadius: 16, backgroundColor: C.surface, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Icon name="Phone" size={16} color="#8C8278" />
              <TextInput value={phone} onChangeText={setPhone} placeholder="+237 6X XX XX XX" placeholderTextColor="#8C8278" keyboardType="phone-pad" style={{ flex: 1, fontSize: 14, color: C.ink }} />
            </View>
            <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 4 }}>{t('payment.paymentNotice')}</Text>
          </View>
        )}

        {/* Security note */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="Lock" size={14} color="#2E7D32" />
          <Text style={{ fontSize: 12, color: C.inkMute }}>{t('payment.secureLabel')}</Text>
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        <TouchableOpacity
          onPress={() => void handleConfirm()}
          disabled={processing || (needsPhone && !phone.trim())}
          style={{ height: 48, backgroundColor: processing ? '#8C8278' : ((needsPhone && !phone.trim()) ? '#D0C8C0' : '#E8591A'), borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}
          activeOpacity={0.85}
        >
          {processing ? <ActivityIndicator color="#fff" /> : (
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>
              {t('payment.confirmWithAmount', { total: total.toLocaleString() })}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
