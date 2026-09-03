import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, TextInput, TouchableOpacity, StatusBar, Alert, ActivityIndicator, Image,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useCartStore } from '@/store/cart.store';
import { useRestaurantStore } from '@/store/restaurant.store';

type MenuCatId = 'all' | 'Entrées' | 'Plats' | 'Accompagnements' | 'Boissons';

export default function OrderMenu() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [activeCat, setActiveCat] = useState<MenuCatId>('all');
  const [search, setSearch] = useState('');

  const restaurantId: string | undefined = route.params?.restaurantId;
  const fetchById = useRestaurantStore((s) => s.fetchById);
  const [restaurant, setRestaurant] = useState(() => (restaurantId ? useRestaurantStore.getState().getById(restaurantId) : undefined));
  const [loading, setLoading] = useState(!restaurant);

  useEffect(() => {
    let cancelled = false;
    if (!restaurantId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    (async () => {
      const detail = await fetchById(restaurantId);
      if (!cancelled) {
        setRestaurant(detail);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [restaurantId, fetchById]);

  const { items: cartItems, restaurantId: cartRestaurantId, addItem, removeItem, updateQty, total, count } = useCartStore();

  const CATEGORIES: Array<{ id: MenuCatId; label: string }> = [
    { id: 'all',            label: t('order.catAll')       },
    { id: 'Entrées',        label: t('order.catStarters')  },
    { id: 'Plats',          label: t('order.catMains')     },
    { id: 'Accompagnements', label: t('order.catSides')    },
    { id: 'Boissons',       label: t('order.catDrinks')    },
  ];

  const getQty = (itemId: string) => cartItems.find(i => i.id === itemId)?.qty ?? 0;

  const handleAdd = (item: { id: string; name: string; price: number }) => {
    if (!restaurantId || !restaurant) return;
    if (cartRestaurantId && cartRestaurantId !== restaurantId && cartItems.length > 0) {
      Alert.alert(
        t('order.newRestaurantTitle'),
        t('order.newRestaurantMsg'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('common.next'), onPress: () => addItem(restaurantId, restaurant.name, item) },
        ]
      );
      return;
    }
    addItem(restaurantId, restaurant.name, item);
  };

  const handleRemove = (itemId: string) => {
    const qty = getQty(itemId);
    if (qty <= 1) removeItem(itemId);
    else updateQty(itemId, qty - 1);
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color="#E8591A" size="large" />
      </SafeAreaView>
    );
  }

  if (!restaurant) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 15, color: C.inkSoft, textAlign: 'center' }}>
          {t('restaurant.notFound', 'Restaurant introuvable.')}
        </Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          <Text style={{ color: '#E8591A', fontWeight: '600' }}>{t('common.goBack', 'Retour')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const filtered = restaurant.menu.filter(item => {
    const matchCat = activeCat === 'all' || item.category === activeCat;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const cartCount = count();
  const cartTotal = total();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: C.ink, lineHeight: 22 }}>{restaurant.name}</Text>
          <Text style={{ fontSize: 12, color: C.inkMute }}>{restaurant.deliveryTime} min · {restaurant.rating}★</Text>
        </View>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 40, backgroundColor: C.surface2, borderRadius: 12, paddingHorizontal: 12, gap: 8 }}>
          <Icon name="Search" size={14} color="#8C8278" />
          <TextInput value={search} onChangeText={setSearch} placeholder={t('order.searchPlaceholder')} placeholderTextColor="#8C8278" style={{ flex: 1, fontSize: 14, color: C.ink }} />
        </View>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, borderBottomWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        <View style={{ flexDirection: 'row', gap: 6, paddingHorizontal: 16, paddingVertical: 8 }}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat.id} onPress={() => setActiveCat(cat.id)}
              style={{ height: 32, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: cat.id === activeCat ? '#E8591A' : '#F5F0EB', borderColor: cat.id === activeCat ? '#E8591A' : '#E5E0D8' }}>
              <Text style={{ fontSize: 12, fontWeight: '500', color: cat.id === activeCat ? '#fff' : '#6D4C41' }}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {filtered.map((item, i) => {
          const qty = getQty(item.id);
          return (
            <View key={item.id} style={{ flexDirection: 'row', gap: 12, paddingVertical: 14, borderBottomWidth: i < filtered.length - 1 ? 1 : 0, borderColor: C.border }}>
              <View style={{ width: 64, height: 64, borderRadius: 12, backgroundColor: C.surface2, borderWidth: item.imageUrl ? 0 : 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                ) : (
                  <Icon name="ChefHat" size={24} color="rgba(140,130,120,0.35)" />
                )}
                {item.popular && (
                  <View style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: 8, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="Star" size={9} color="#fff" fill="#fff" />
                  </View>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{item.name}</Text>
                <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 2 }}>{item.desc}</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, marginTop: 4 }}>{item.price.toLocaleString()} XAF</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center' }}>
                {qty > 0 && (
                  <>
                    <TouchableOpacity onPress={() => handleRemove(item.id)}
                      style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="Minus" size={14} color="#E8591A" />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, minWidth: 18, textAlign: 'center' }}>{qty}</Text>
                  </>
                )}
                <TouchableOpacity onPress={() => handleAdd(item)}
                  style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="Plus" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {cartCount > 0 && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: C.surface, borderTopWidth: 1, borderColor: C.border }}>
          <TouchableOpacity onPress={() => navigation.navigate('OrderSummary')} style={{ height: 48, backgroundColor: '#E8591A', borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }} activeOpacity={0.85}>
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#E8591A', fontSize: 11, fontWeight: '700' }}>{cartCount}</Text>
            </View>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{t('order.viewCart')}</Text>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>{cartTotal.toLocaleString()} XAF</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
