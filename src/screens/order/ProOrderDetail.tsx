import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const ORDER_ITEMS = [
  { name: 'Ndolé traditionnel', qty: 2, price: 4500, note: 'Sans piment' },
  { name: 'Miondo (x3)',        qty: 1, price: 1500, note: ''             },
  { name: 'Jus de gingembre',  qty: 2, price: 1000, note: 'Peu sucré'   },
];

export default function ProOrderDetail() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const subtotal = ORDER_ITEMS.reduce((s, i) => s + i.price * i.qty, 0);
  const delivery = 1000;
  const total = subtotal + delivery;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: C.ink, lineHeight: 22 }}>#KFL-4825</Text>
          <Text style={{ fontSize: 12, color: C.inkMute }}>Détail commande</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Client */}
        <View style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, marginBottom: 16, ...SHADOW_SM }}>
          <Text style={{ fontSize: 11, color: C.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Client</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '600', color: C.inkSoft }}>S</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>Sami Nguimfack</Text>
              <Text style={{ fontSize: 12, color: C.inkMute }}>+237 69 00 00 00</Text>
            </View>
            <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.successSoft, borderWidth: 1, borderColor: 'rgba(46,125,50,0.3)', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Phone" size={16} color="#2E7D32" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Order info */}
        <View style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, marginBottom: 16, ...SHADOW_SM }}>
          {[
            { l: 'Commande N°', v: '#KFL-4825',             green: false },
            { l: 'Heure',        v: '14:38 · 15 Jun 2026',  green: false },
            { l: 'Mode',         v: 'Livraison',             green: false },
            { l: 'Paiement',     v: 'MTN Money · Payé',      green: true  },
          ].map((row, i) => (
            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: i < 3 ? 1 : 0, borderColor: C.border }}>
              <Text style={{ fontSize: 14, color: C.inkMute }}>{row.l}</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: row.green ? '#2E7D32' : '#2C1810' }}>{row.v}</Text>
            </View>
          ))}
        </View>

        {/* Items */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 8 }}>Articles</Text>
        <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, marginBottom: 16, ...SHADOW_SM }}>
          {ORDER_ITEMS.map((item, i) => (
            <View key={i} style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: i < ORDER_ITEMS.length - 1 ? 1 : 0, borderColor: C.border }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{item.name} × {item.qty}</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>{(item.price * item.qty).toLocaleString()} XAF</Text>
              </View>
              {item.note ? (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 3 }}>
                  <Icon name="FileText" size={11} color="#E8591A" />
                  <Text style={{ fontSize: 12, color: '#E8591A' }}>{item.note}</Text>
                </View>
              ) : null}
            </View>
          ))}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderColor: C.border }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>Total reçu</Text>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#E8591A' }}>{total.toLocaleString()} XAF</Text>
          </View>
        </View>

        {/* Commission */}
        <View style={{ padding: 14, borderRadius: 16, backgroundColor: C.navySoft, borderWidth: 1, borderColor: 'rgba(26,35,126,0.2)' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ fontSize: 14, color: '#1A237E' }}>Commission KFL (5%)</Text>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A237E' }}>−{(total * 0.05).toLocaleString()} XAF</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#1A237E' }}>Net à percevoir</Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#1A237E' }}>{(total * 0.95).toLocaleString()} XAF</Text>
          </View>
        </View>
      </ScrollView>

      {/* Actions */}
      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        <TouchableOpacity style={{ flex: 1, height: 44, borderWidth: 1, borderColor: 'rgba(198,40,40,0.4)', borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, color: '#C62828' }}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 2, height: 44, backgroundColor: '#2E7D32', borderRadius: 22, alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.85}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Marquer comme prête</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
