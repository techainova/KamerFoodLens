import React, { useState } from 'react';
import {
  View, TouchableOpacity, ScrollView, StatusBar, TextInput,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/store/auth.store';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

export default function Payment() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const C = useColors();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [selectedMethod, setSelectedMethod] = useState('mtn');
  const [phoneNumber, setPhoneNumber] = useState('+237 6');
  const [processing, setProcessing] = useState(false);

  const ORDER_ITEMS = [
    { name: t('payment.itemNdole'), qty: 2, price: 4500 },
    { name: t('payment.itemMiondo'), qty: 1, price: 1500 },
    { name: t('payment.itemGinger'), qty: 2, price: 1000 },
  ];

  const METHODS = [
    { id: 'mtn',    label: t('payment.mtnMomo'),      icon: 'Smartphone' as const, color: '#F9A825', bg: '#FBF3DC' },
    { id: 'orange', label: t('payment.orangeMoney'),  icon: 'Smartphone' as const, color: '#E8591A', bg: '#FEF3EC' },
    { id: 'card',   label: t('payment.card'),         icon: 'CreditCard' as const, color: '#1A237E', bg: '#E8EAF6' },
  ];

  const purpose: string = route.params?.purpose ?? 'order';
  const isProUpgrade = purpose === 'pro-upgrade';
  const planLabel: string | undefined = route.params?.label;
  const planAmount: number | undefined = route.params?.amount;

  const subtotal = isProUpgrade ? (planAmount ?? 0) : ORDER_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = isProUpgrade ? 0 : 1000;
  const total = subtotal + delivery;

  const handlePay = () => {
    if (selectedMethod === 'mtn' || selectedMethod === 'orange') {
      navigation.navigate('MobileMoneyConfirm', {
        provider: selectedMethod,
        amount:   total,
        phone:    phoneNumber,
        purpose,
      });
      return;
    }
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      if (isProUpgrade) {
        if (user) setUser({ ...user, role: 'pro' });
        navigation.navigate('ProConfirmation');
        return;
      }
      navigation.navigate('PaymentSuccess');
    }, 2000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('payment.title')}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Icon name="Lock" size={13} color="#2E7D32" />
          <Text style={{ fontSize: 11, color: '#2E7D32', fontWeight: '600' }}>{t('payment.secure')}</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

        {/* Order summary */}
        <View>
          <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 10 }}>{t('payment.summary')}</Text>
          <View style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
            {isProUpgrade ? (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderColor: C.border }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, color: C.ink }}>{t('payment.proSubscription')}</Text>
                  <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 1 }}>{planLabel ?? t('payment.yearlyPlan')}</Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{subtotal.toLocaleString()} XAF</Text>
              </View>
            ) : (
              ORDER_ITEMS.map((item, i) => (
                <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderColor: C.border }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, color: C.ink }}>{item.name}</Text>
                    <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 1 }}>x{item.qty}</Text>
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{(item.price * item.qty).toLocaleString()} XAF</Text>
                </View>
              ))
            )}
            {!isProUpgrade && (
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, backgroundColor: C.surface2 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Icon name="Navigation" size={13} color="#8C8278" />
                  <Text style={{ fontSize: 13, color: C.inkMute }}>{t('payment.delivery')}</Text>
                </View>
                <Text style={{ fontSize: 13, color: C.inkSoft }}>{delivery.toLocaleString()} XAF</Text>
              </View>
            )}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 14 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink, fontFamily: 'Inter-Bold' }}>{t('payment.total')}</Text>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#E8591A', fontFamily: 'Inter-Bold' }}>{total.toLocaleString()} XAF</Text>
            </View>
          </View>
        </View>

        {/* Payment methods */}
        <View>
          <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 10 }}>{t('payment.paymentMethodTitle')}</Text>
          <View style={{ gap: 10 }}>
            {METHODS.map(method => (
              <TouchableOpacity
                key={method.id}
                onPress={() => setSelectedMethod(method.id)}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 16, borderWidth: selectedMethod === method.id ? 2 : 1, borderColor: selectedMethod === method.id ? method.color : '#E5E0D8', backgroundColor: selectedMethod === method.id ? method.bg : '#fff', ...SHADOW_SM }}
                activeOpacity={0.85}
              >
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: method.color + '20', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={method.icon} size={20} color={method.color} />
                </View>
                <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: C.ink }}>{method.label}</Text>
                <View style={{ width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: selectedMethod === method.id ? method.color : '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedMethod === method.id && (
                    <View style={{ width: 11, height: 11, borderRadius: 6, backgroundColor: method.color }} />
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Mobile money input */}
        {(selectedMethod === 'mtn' || selectedMethod === 'orange') && (
          <View style={{ backgroundColor: selectedMethod === 'mtn' ? '#FBF3DC' : '#FEF3EC', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: selectedMethod === 'mtn' ? '#F9A82540' : '#E8591A40' }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: C.ink, marginBottom: 10 }}>
              {t('payment.mobileMoneyNumberLabel', { provider: selectedMethod === 'mtn' ? 'MTN' : 'Orange' })}
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderRadius: 12, paddingHorizontal: 12, height: 48, borderWidth: 1, borderColor: C.border }}>
              <Icon name="Smartphone" size={18} color="#8C8278" />
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="+237 6XX XXX XXX"
                placeholderTextColor="#8C8278"
                keyboardType="phone-pad"
                style={{ flex: 1, fontSize: 16, color: C.ink }}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <Icon name="Info" size={12} color="#8C8278" />
              <Text style={{ fontSize: 11, color: C.inkMute, flex: 1 }}>
                {t('payment.mobileMoneyNotice')}
              </Text>
            </View>
          </View>
        )}

        {/* Card input */}
        {selectedMethod === 'card' && (
          <View style={{ backgroundColor: C.navySoft, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#1A237E30' }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: C.ink, marginBottom: 10 }}>{t('payment.cardInfoTitle')}</Text>
            <View style={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderRadius: 12, paddingHorizontal: 12, height: 48, borderWidth: 1, borderColor: C.border }}>
                <Icon name="CreditCard" size={18} color="#8C8278" />
                <TextInput placeholder={t('payment.cardNumber')} placeholderTextColor="#8C8278" keyboardType="numeric" style={{ flex: 1, fontSize: 15, color: C.ink }} />
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1, backgroundColor: C.surface, borderRadius: 12, paddingHorizontal: 12, height: 48, borderWidth: 1, borderColor: C.border, justifyContent: 'center' }}>
                  <TextInput placeholder={t('payment.expiry')} placeholderTextColor="#8C8278" keyboardType="numeric" style={{ fontSize: 15, color: C.ink }} />
                </View>
                <View style={{ flex: 1, backgroundColor: C.surface, borderRadius: 12, paddingHorizontal: 12, height: 48, borderWidth: 1, borderColor: C.border, justifyContent: 'center' }}>
                  <TextInput placeholder={t('payment.cvv')} placeholderTextColor="#8C8278" keyboardType="numeric" style={{ fontSize: 15, color: C.ink }} />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Security note */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.successSoft, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#2E7D3230' }}>
          <Icon name="Shield" size={16} color="#2E7D32" />
          <Text style={{ flex: 1, fontSize: 12, color: '#2E7D32', lineHeight: 18 }}>
            {t('payment.securityNote')}
          </Text>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: C.surface, borderTopWidth: 1, borderColor: C.border }}>
        <TouchableOpacity
          onPress={handlePay}
          style={{ height: 54, borderRadius: 16, backgroundColor: processing ? '#8C8278' : '#E8591A', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 }}
          disabled={processing}
          activeOpacity={0.85}
        >
          {processing ? (
            <>
              <Icon name="Clock" size={18} color="#fff" />
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>{t('payment.processing')}</Text>
            </>
          ) : (
            <>
              <Icon name="Lock" size={18} color="#fff" />
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>{t('payment.payAmount', { amount: total.toLocaleString() })}</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
