import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const MENU_ITEMS_INITIAL = [
  { name: 'Ndolé traditionnel', price: 4500, available: true  },
  { name: 'Poulet DG',          price: 5500, available: true  },
  { name: 'Eru & Fufu',         price: 4000, available: false },
  { name: 'Koki haricots',      price: 2500, available: true  },
];

export default function RestaurantMenu() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [items, setItems] = useState(MENU_ITEMS_INITIAL);

  const toggleAvail = (i: number) => setItems(prev => prev.map((item, idx) => idx === i ? { ...item, available: !item.available } : item));
  const removeItem = (i: number) => setItems(prev => prev.filter((_, idx) => idx !== i));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('restaurantMenu.title')}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('RestaurantMenuEdit', {})}
          style={{ height: 32, paddingHorizontal: 12, backgroundColor: C.gold, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4 }}
        >
          <Icon name="Plus" size={12} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{t('restaurantMenu.add')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 12 }} showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 60, gap: 10 }}>
            <Icon name="ChefHat" size={36} color={C.inkMute} />
            <Text style={{ fontSize: 15, fontWeight: '600', color: C.ink }}>{t('restaurantMenu.emptyTitle')}</Text>
            <Text style={{ fontSize: 13, color: C.inkMute, textAlign: 'center' }}>{t('restaurantMenu.emptySubtitle')}</Text>
          </View>
        ) : (
          items.map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
              <View style={{ width: 56, height: 56, borderRadius: 14, backgroundColor: C.surface2, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="ChefHat" size={22} color="rgba(140,130,120,0.5)" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{item.name}</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.primary, marginTop: 2 }}>{item.price.toLocaleString()} XAF</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <TouchableOpacity
                  onPress={() => toggleAvail(i)}
                  style={{ height: 28, paddingHorizontal: 10, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: item.available ? C.successSoft : C.surface2 }}
                >
                  <Text style={{ fontSize: 11, fontWeight: '600', color: item.available ? C.success : C.inkMute }}>
                    {item.available ? t('restaurantMenu.available') : t('restaurantMenu.unavailable')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => navigation.navigate('RestaurantMenuEdit', { itemId: String(i) })}
                  style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Icon name="Edit" size={12} color={C.inkSoft} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => removeItem(i)}
                  style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Icon name="X" size={12} color={C.error} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
