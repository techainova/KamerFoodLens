import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const MENU_ITEMS_INITIAL = [
  { name: 'Ndolé traditionnel', price: 4500, available: true  },
  { name: 'Poulet DG',          price: 5500, available: true  },
  { name: 'Eru & Fufu',         price: 4000, available: false },
  { name: 'Koki haricots',      price: 2500, available: true  },
];

export default function RestaurantMenu() {
  const navigation = useNavigation<any>();
  const [items, setItems] = useState(MENU_ITEMS_INITIAL);

  const toggleAvail = (i: number) => setItems(prev => prev.map((item, idx) => idx === i ? { ...item, available: !item.available } : item));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Mon menu</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('RestaurantMenuEdit', {})}
          style={{ height: 32, paddingHorizontal: 12, backgroundColor: '#F9A825', borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4 }}
        >
          <Icon name="Plus" size={12} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Ajouter</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 12 }} showsVerticalScrollIndicator={false}>
        {items.map((item, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', ...SHADOW_SM }}>
            <View style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: '#F5F0EB', borderWidth: 1, borderStyle: 'dashed', borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="ChefHat" size={22} color="rgba(140,130,120,0.5)" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#2C1810' }}>{item.name}</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#E8591A', marginTop: 2 }}>{item.price.toLocaleString()} XAF</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TouchableOpacity
                onPress={() => toggleAvail(i)}
                style={{ height: 28, paddingHorizontal: 10, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: item.available ? '#E3F0E4' : '#F5F0EB' }}
              >
                <Text style={{ fontSize: 11, fontWeight: '600', color: item.available ? '#2E7D32' : '#8C8278' }}>
                  {item.available ? 'Dispo' : 'Indispo'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('RestaurantMenuEdit', { itemId: String(i) })}
                style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}
              >
                <Icon name="Edit" size={12} color="#6D4C41" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
