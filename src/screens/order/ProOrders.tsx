import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const TABS = ['Nouvelles', 'En préparation', 'Prêtes', 'Livrées'];

const ORDERS = [
  { id: '#KFL-4825', client: 'Sami N.',   items: 'Ndolé x2, Miondo, Jus x2',    total: 13000, time: '14:38', status: 'new',       elapsed: '2 min'  },
  { id: '#KFL-4822', client: 'Adèle B.',  items: 'Poulet DG x1, Eau',             total: 6500,  time: '14:21', status: 'preparing', elapsed: '17 min' },
  { id: '#KFL-4818', client: 'Chef Joël', items: 'Eru Fufu x2, Bissap x1',        total: 9800,  time: '13:55', status: 'ready',     elapsed: '43 min' },
];

const STATUS_CONF: Record<string, { label: string; color: string; bg: string; next: string; nextColor: string }> = {
  new:       { label: 'Nouvelle',       color: '#E8591A', bg: '#FEF3EC', next: 'Accepter',      nextColor: '#2E7D32' },
  preparing: { label: 'En préparation', color: '#F9A825', bg: '#FBF3DC', next: 'Marquer prête',  nextColor: '#E8591A' },
  ready:     { label: 'Prête',          color: '#2E7D32', bg: '#E3F0E4', next: 'Livraison',      nextColor: '#1A237E' },
};

export default function ProOrders() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Commandes</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FEF3EC', borderWidth: 1, borderColor: 'rgba(232,89,26,0.3)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#E8591A' }} />
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#E8591A' }}>3 nouvelles</Text>
        </View>
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, borderBottomWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff' }}>
        <View style={{ flexDirection: 'row' }}>
          {TABS.map((tab, i) => (
            <TouchableOpacity key={i} onPress={() => setActiveTab(i)}
              style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 2, borderColor: i === activeTab ? '#E8591A' : 'transparent' }}>
              <Text style={{ fontSize: 14, fontWeight: i === activeTab ? '600' : '500', color: i === activeTab ? '#E8591A' : '#8C8278' }}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          {[
            { v: '3',  l: 'Nouvelles',  color: '#E8591A' },
            { v: '1',  l: 'En prépa.',  color: '#F9A825' },
            { v: '47', l: 'Auj. total', color: '#2E7D32' },
          ].map((s, i) => (
            <View key={i} style={{ flex: 1, padding: 12, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', alignItems: 'center', ...SHADOW_SM }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: s.color }}>{s.v}</Text>
              <Text style={{ fontSize: 11, color: '#8C8278', marginTop: 2 }}>{s.l}</Text>
            </View>
          ))}
        </View>

        <View style={{ gap: 12 }}>
          {ORDERS.map((order, i) => {
            const s = STATUS_CONF[order.status];
            return (
              <View key={i} style={{ padding: 16, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', ...SHADOW_SM }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#2C1810' }}>{order.id}</Text>
                  <View style={{ height: 24, paddingHorizontal: 10, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: s.bg }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: s.color }}>{s.label}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                  <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#F5F0EB', borderWidth: 1, borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 11, color: '#6D4C41' }}>{order.client[0]}</Text>
                  </View>
                  <Text style={{ fontSize: 14, color: '#2C1810' }}>{order.client}</Text>
                  <Text style={{ flex: 1, textAlign: 'right', fontSize: 12, color: '#8C8278' }}>{order.time} · {order.elapsed}</Text>
                </View>
                <Text style={{ fontSize: 12, color: '#8C8278', marginBottom: 10 }}>{order.items}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#2C1810' }}>{order.total.toLocaleString()} XAF</Text>
                  <TouchableOpacity style={{ height: 32, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: s.nextColor + '15', borderColor: s.nextColor }}>
                    <Text style={{ fontSize: 12, fontWeight: '600', color: s.nextColor }}>{s.next}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
