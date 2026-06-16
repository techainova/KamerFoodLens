import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const TABS = ['Toutes', 'En cours', 'Terminées', 'Annulées'];

const ORDERS = [
  { id: '#KFL-4821', restaurant: 'Chez Mama Pauline',      items: 'Ndolé x2, Miondo, Jus', total: 13000, status: 'delivered',   date: '15 Jun 2026 14:35' },
  { id: '#KFL-4715', restaurant: "Restaurant L'Authenticité", items: 'Poulet DG x1, Eau',   total: 6500,  status: 'in_progress', date: '14 Jun 2026 19:12' },
  { id: '#KFL-4632', restaurant: 'Kmer Saveurs',             items: 'Eru Fufu x2',           total: 8000,  status: 'cancelled',   date: '12 Jun 2026 12:05' },
];

const STATUS: Record<string, { label: string; color: string; bg: string }> = {
  delivered:   { label: 'Livré',    color: '#2E7D32', bg: '#E3F0E4' },
  in_progress: { label: 'En cours', color: '#E8591A', bg: '#FEF3EC' },
  cancelled:   { label: 'Annulé',   color: '#C62828', bg: '#FBDCDC' },
};

export default function OrderHistory() {
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
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Mes commandes</Text>
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

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 12 }} showsVerticalScrollIndicator={false}>
        {ORDERS.map((order, i) => {
          const s = STATUS[order.status];
          return (
            <TouchableOpacity key={i} style={{ padding: 16, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', ...SHADOW_SM }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                <View>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#2C1810' }}>{order.restaurant}</Text>
                  <Text style={{ fontSize: 11, color: '#8C8278', marginTop: 1 }}>{order.id} · {order.date}</Text>
                </View>
                <View style={{ height: 24, paddingHorizontal: 10, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: s.bg }}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: s.color }}>{s.label}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 12, color: '#6D4C41', marginBottom: 10 }}>{order.items}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#2C1810' }}>{order.total.toLocaleString()} XAF</Text>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  {order.status === 'delivered' && (
                    <TouchableOpacity style={{ height: 30, paddingHorizontal: 12, backgroundColor: '#E8591A', borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Recommander</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={{ height: 30, paddingHorizontal: 12, borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 15, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#6D4C41' }}>Détails</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
