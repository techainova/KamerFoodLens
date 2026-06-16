import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_MD = { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 6, elevation: 4 };

const ORDER_ITEMS = [
  { name: 'Ndolé traditionnel × 2', price: 9000 },
  { name: 'Miondo (x3) × 1',        price: 1500 },
  { name: 'Jus de gingembre × 2',   price: 2000 },
];

export default function OrderInvoice() {
  const navigation = useNavigation<any>();
  const subtotal = ORDER_ITEMS.reduce((s, i) => s + i.price, 0);
  const delivery = 1000;
  const total = subtotal + delivery;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Facture</Text>
        <TouchableOpacity style={{ width: 36, height: 36, borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="Share2" size={16} color="#6D4C41" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>

        {/* Invoice header */}
        <View style={{ padding: 20, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', marginBottom: 16, ...SHADOW_MD }}>
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#E3F0E4', borderWidth: 2, borderColor: '#2E7D32', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Icon name="Check" size={22} color="#2E7D32" />
            </View>
            <Text style={{ fontSize: 18, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810' }}>Payé</Text>
            <Text style={{ fontSize: 12, color: '#8C8278' }}>15 Jun 2026 · 14:35</Text>
          </View>

          {[
            { l: 'N° Facture',  v: '#KFL-2026-4821',    green: false },
            { l: 'Restaurant',  v: 'Chez Mama Pauline',  green: false },
            { l: 'Paiement',    v: 'MTN Mobile Money',   green: false },
            { l: 'Statut',      v: 'Confirmé',            green: true  },
          ].map((row, i) => (
            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: i < 3 ? 1 : 0, borderColor: '#F5F0EB' }}>
              <Text style={{ fontSize: 14, color: '#8C8278' }}>{row.l}</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: row.green ? '#2E7D32' : '#2C1810' }}>{row.v}</Text>
            </View>
          ))}
        </View>

        {/* Items */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', marginBottom: 8 }}>Articles</Text>
        <View style={{ borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', marginBottom: 16 }}>
          {ORDER_ITEMS.map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: i < ORDER_ITEMS.length - 1 ? 1 : 0, borderColor: '#F5F0EB' }}>
              <Text style={{ fontSize: 14, color: '#2C1810' }}>{item.name}</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#2C1810' }}>{item.price.toLocaleString()} XAF</Text>
            </View>
          ))}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderColor: '#E5E0D8' }}>
            <Text style={{ fontSize: 14, color: '#8C8278' }}>Livraison</Text>
            <Text style={{ fontSize: 14, color: '#6D4C41' }}>{delivery.toLocaleString()} XAF</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 8, paddingBottom: 16 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#2C1810' }}>Total</Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#E8591A' }}>{total.toLocaleString()} XAF</Text>
          </View>
        </View>

        {/* QR placeholder */}
        <View style={{ alignItems: 'center', paddingVertical: 20, marginBottom: 16 }}>
          <Text style={{ fontSize: 11, color: '#8C8278', textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12 }}>QR Code · Facture</Text>
          <View style={{ width: 128, height: 128, backgroundColor: '#F5F0EB', borderRadius: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="QrCode" size={56} color="rgba(140,130,120,0.35)" />
          </View>
          <Text style={{ fontSize: 12, color: '#8C8278', marginTop: 8, fontFamily: 'JetBrainsMono-Regular' }}>#KFL-2026-4821</Text>
        </View>
      </ScrollView>

      {/* Actions */}
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff' }}>
        <TouchableOpacity style={{ flex: 1, height: 44, borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, color: '#6D4C41' }}>Télécharger PDF</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, height: 44, backgroundColor: '#E8591A', borderRadius: 22, alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.85}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Partager</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
