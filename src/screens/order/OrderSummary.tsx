import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const ORDER_ITEMS = [
  { name: 'Ndolé traditionnel', qty: 2, price: 4500 },
  { name: 'Miondo (x3)',        qty: 1, price: 1500 },
  { name: 'Jus de gingembre',  qty: 2, price: 1000 },
];

export default function OrderSummary() {
  const navigation = useNavigation<any>();
  const [deliveryMode, setDeliveryMode] = useState<'delivery' | 'pickup'>('delivery');
  const [note, setNote] = useState('');

  const subtotal = ORDER_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = deliveryMode === 'delivery' ? 1000 : 0;
  const total = subtotal + delivery;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Récapitulatif</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Restaurant */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', marginBottom: 16, ...SHADOW_SM }}>
          <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: '#F5F0EB', borderWidth: 1, borderStyle: 'dashed', borderColor: '#E5E0D8' }} />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#2C1810' }}>Chez Mama Pauline</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="MapPin" size={11} color="#8C8278" />
                <Text style={{ fontSize: 12, color: '#8C8278' }}>1.4 km</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="Clock" size={11} color="#8C8278" />
                <Text style={{ fontSize: 12, color: '#8C8278' }}>~35 min</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Items */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', marginBottom: 8 }}>Articles</Text>
        <View style={{ borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', marginBottom: 16, ...SHADOW_SM }}>
          {ORDER_ITEMS.map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: i < ORDER_ITEMS.length - 1 ? 1 : 0, borderColor: '#F5F0EB' }}>
              <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#F5F0EB', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                <Text style={{ fontSize: 11, fontWeight: '600', color: '#6D4C41' }}>{item.qty}</Text>
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: '#2C1810' }}>{item.name}</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#2C1810' }}>{(item.price * item.qty).toLocaleString()} XAF</Text>
            </View>
          ))}
        </View>

        {/* Delivery mode */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', marginBottom: 8 }}>Mode de livraison</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          {([
            { mode: 'delivery' as const, icon: 'Truck',  label: 'Livraison',  price: '1 000 XAF' },
            { mode: 'pickup' as const,   icon: 'Home',   label: 'À emporter', price: 'Gratuit'   },
          ]).map(({ mode, icon, label, price }) => (
            <TouchableOpacity key={mode} onPress={() => setDeliveryMode(mode)}
              style={{ flex: 1, padding: 14, borderRadius: 18, borderWidth: 2, backgroundColor: deliveryMode === mode ? '#FEF3EC' : '#fff', borderColor: deliveryMode === mode ? '#E8591A' : '#E5E0D8' }}>
              <Icon name={icon} size={22} color={deliveryMode === mode ? '#E8591A' : '#8C8278'} />
              <Text style={{ fontSize: 14, fontWeight: '600', color: deliveryMode === mode ? '#E8591A' : '#2C1810', marginTop: 6 }}>{label}</Text>
              <Text style={{ fontSize: 12, color: '#8C8278', marginTop: 2 }}>{price}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Note */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', marginBottom: 8 }}>Note pour le restaurant</Text>
        <View style={{ borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', paddingHorizontal: 14, paddingVertical: 12, marginBottom: 16, minHeight: 80 }}>
          <TextInput value={note} onChangeText={setNote} placeholder="Sans piment, allergies, instructions..." placeholderTextColor="#8C8278" multiline numberOfLines={3} style={{ fontSize: 14, color: '#2C1810' }} />
        </View>

        {/* Price breakdown */}
        <View style={{ borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', padding: 16, ...SHADOW_SM }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 14, color: '#6D4C41' }}>Sous-total</Text>
            <Text style={{ fontSize: 14, color: '#2C1810' }}>{subtotal.toLocaleString()} XAF</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8, borderBottomWidth: 1, borderColor: '#F5F0EB', marginBottom: 8 }}>
            <Text style={{ fontSize: 14, color: '#6D4C41' }}>Livraison</Text>
            <Text style={{ fontSize: 14, color: '#2C1810' }}>{delivery === 0 ? 'Gratuit' : `${delivery.toLocaleString()} XAF`}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#2C1810' }}>Total</Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#E8591A' }}>{total.toLocaleString()} XAF</Text>
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff' }}>
        <TouchableOpacity style={{ height: 48, backgroundColor: '#E8591A', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.85}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Passer au paiement · {total.toLocaleString()} XAF</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
