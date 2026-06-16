import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const ORDER_ITEMS = [
  { name: 'Ndolé traditionnel', qty: 2, price: 4500 },
  { name: 'Miondo (x3)', qty: 1, price: 1500 },
  { name: 'Jus de gingembre', qty: 2, price: 1000 },
];

const METHODS = [
  { id: 'mtn',    label: 'MTN Mobile Money',  icon: 'Smartphone' as const, color: '#F9A825', bg: '#FBF3DC' },
  { id: 'orange', label: 'Orange Money',      icon: 'Smartphone' as const, color: '#E8591A', bg: '#FEF3EC' },
  { id: 'card',   label: 'Carte bancaire',    icon: 'CreditCard' as const, color: '#1A237E', bg: '#E8EAF6' },
];

export default function Payment() {
  const navigation = useNavigation<any>();
  const [selectedMethod, setSelectedMethod] = useState('mtn');
  const [phoneNumber, setPhoneNumber] = useState('+237 6');
  const [processing, setProcessing] = useState(false);

  const subtotal = ORDER_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = 1000;
  const total = subtotal + delivery;

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      navigation.navigate('PaymentSuccess');
    }, 2000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Paiement</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
          <Icon name="Lock" size={13} color="#2E7D32" />
          <Text style={{ fontSize: 11, color: '#2E7D32', fontWeight: '600' }}>Sécurisé</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

        {/* Order summary */}
        <View>
          <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', marginBottom: 10 }}>Récapitulatif</Text>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E5E0D8', overflow: 'hidden', ...SHADOW_SM }}>
            {ORDER_ITEMS.map((item, i) => (
              <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#F5F0EB' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, color: '#2C1810' }}>{item.name}</Text>
                  <Text style={{ fontSize: 11, color: '#8C8278', marginTop: 1 }}>x{item.qty}</Text>
                </View>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#2C1810' }}>{(item.price * item.qty).toLocaleString()} XAF</Text>
              </View>
            ))}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 10, backgroundColor: '#F5F0EB' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Icon name="Navigation" size={13} color="#8C8278" />
                <Text style={{ fontSize: 13, color: '#8C8278' }}>Livraison</Text>
              </View>
              <Text style={{ fontSize: 13, color: '#6D4C41' }}>{delivery.toLocaleString()} XAF</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 14 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: '#2C1810', fontFamily: 'Inter-Bold' }}>Total</Text>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#E8591A', fontFamily: 'Inter-Bold' }}>{total.toLocaleString()} XAF</Text>
            </View>
          </View>
        </View>

        {/* Payment methods */}
        <View>
          <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', marginBottom: 10 }}>Mode de paiement</Text>
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
                <Text style={{ flex: 1, fontSize: 15, fontWeight: '600', color: '#2C1810' }}>{method.label}</Text>
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
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#2C1810', marginBottom: 10 }}>
              Numéro {selectedMethod === 'mtn' ? 'MTN' : 'Orange'} Mobile Money
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, height: 48, borderWidth: 1, borderColor: '#E5E0D8' }}>
              <Icon name="Smartphone" size={18} color="#8C8278" />
              <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="+237 6XX XXX XXX"
                placeholderTextColor="#8C8278"
                keyboardType="phone-pad"
                style={{ flex: 1, fontSize: 16, color: '#2C1810' }}
              />
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8 }}>
              <Icon name="Info" size={12} color="#8C8278" />
              <Text style={{ fontSize: 11, color: '#8C8278', flex: 1 }}>
                Vous recevrez une notification pour confirmer le paiement.
              </Text>
            </View>
          </View>
        )}

        {/* Card input */}
        {selectedMethod === 'card' && (
          <View style={{ backgroundColor: '#E8EAF6', borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#1A237E30' }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#2C1810', marginBottom: 10 }}>Informations de la carte</Text>
            <View style={{ gap: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, height: 48, borderWidth: 1, borderColor: '#E5E0D8' }}>
                <Icon name="CreditCard" size={18} color="#8C8278" />
                <TextInput placeholder="Numéro de carte" placeholderTextColor="#8C8278" keyboardType="numeric" style={{ flex: 1, fontSize: 15, color: '#2C1810' }} />
              </View>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, height: 48, borderWidth: 1, borderColor: '#E5E0D8', justifyContent: 'center' }}>
                  <TextInput placeholder="MM/AA" placeholderTextColor="#8C8278" keyboardType="numeric" style={{ fontSize: 15, color: '#2C1810' }} />
                </View>
                <View style={{ flex: 1, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, height: 48, borderWidth: 1, borderColor: '#E5E0D8', justifyContent: 'center' }}>
                  <TextInput placeholder="CVV" placeholderTextColor="#8C8278" keyboardType="numeric" style={{ fontSize: 15, color: '#2C1810' }} />
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Security note */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#E3F0E4', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: '#2E7D3230' }}>
          <Icon name="Shield" size={16} color="#2E7D32" />
          <Text style={{ flex: 1, fontSize: 12, color: '#2E7D32', lineHeight: 18 }}>
            Paiement chiffré AES-256-GCM · Vos données sont 100% sécurisées
          </Text>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity
          onPress={handlePay}
          style={{ height: 54, borderRadius: 16, backgroundColor: processing ? '#8C8278' : '#E8591A', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 }}
          disabled={processing}
          activeOpacity={0.85}
        >
          {processing ? (
            <>
              <Icon name="Clock" size={18} color="#fff" />
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>Traitement en cours...</Text>
            </>
          ) : (
            <>
              <Icon name="Lock" size={18} color="#fff" />
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>Payer {total.toLocaleString()} XAF</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
