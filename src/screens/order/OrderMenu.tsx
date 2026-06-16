import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const CATEGORIES = ['Tout', 'Entrées', 'Plats', 'Desserts', 'Boissons'];
const ITEMS = [
  { name: 'Ndolé traditionnel', desc: 'Poisson fumé, crevettes',   price: 4500, popular: true  },
  { name: 'Poulet DG',          desc: 'Plantains frits, légumes',   price: 5500, popular: false },
  { name: 'Koki haricots',      desc: 'Préparation traditionnelle', price: 2500, popular: false },
  { name: 'Miondo (x3)',        desc: 'Bâton de manioc cuit',       price: 1500, popular: false },
  { name: 'Jus de gingembre',   desc: 'Frais & naturel',            price: 1000, popular: false },
];

export default function OrderMenu() {
  const navigation = useNavigation<any>();
  const [activeCat, setActiveCat] = useState(0);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [search, setSearch] = useState('');

  const addToCart = (name: string) => setCart(prev => ({ ...prev, [name]: (prev[name] || 0) + 1 }));
  const removeFromCart = (name: string) => setCart(prev => {
    const n = { ...prev };
    if (n[name] > 1) n[name]--; else delete n[name];
    return n;
  });
  const cartCount = Object.values(cart).reduce((s, v) => s + v, 0);
  const cartTotal = ITEMS.reduce((s, item) => s + (cart[item.name] || 0) * item.price, 0);
  const filtered = ITEMS.filter(item => !search || item.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: '#2C1810', lineHeight: 22 }}>Chez Mama Pauline</Text>
          <Text style={{ fontSize: 12, color: '#8C8278' }}>Commander</Text>
        </View>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 40, backgroundColor: '#F5F0EB', borderRadius: 12, paddingHorizontal: 12, gap: 8 }}>
          <Icon name="Search" size={14} color="#8C8278" />
          <TextInput value={search} onChangeText={setSearch} placeholder="Rechercher un plat..." placeholderTextColor="#8C8278" style={{ flex: 1, fontSize: 14, color: '#2C1810' }} />
        </View>
      </View>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0, borderBottomWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff' }}>
        <View style={{ flexDirection: 'row', gap: 6, paddingHorizontal: 16, paddingVertical: 8 }}>
          {CATEGORIES.map((cat, i) => (
            <TouchableOpacity key={i} onPress={() => setActiveCat(i)}
              style={{ height: 32, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: i === activeCat ? '#E8591A' : '#F5F0EB', borderColor: i === activeCat ? '#E8591A' : '#E5E0D8' }}>
              <Text style={{ fontSize: 12, fontWeight: '500', color: i === activeCat ? '#fff' : '#6D4C41' }}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {filtered.map((item, i) => (
          <View key={i} style={{ flexDirection: 'row', gap: 12, paddingVertical: 14, borderBottomWidth: i < filtered.length - 1 ? 1 : 0, borderColor: '#F5F0EB' }}>
            {/* Dish placeholder */}
            <View style={{ width: 64, height: 64, borderRadius: 12, backgroundColor: '#F5F0EB', borderWidth: 1, borderStyle: 'dashed', borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Icon name="ChefHat" size={24} color="rgba(140,130,120,0.35)" />
              {item.popular && (
                <View style={{ position: 'absolute', top: -4, right: -4, width: 16, height: 16, borderRadius: 8, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="Star" size={9} color="#fff" fill="#fff" />
                </View>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#2C1810' }}>{item.name}</Text>
              <Text style={{ fontSize: 12, color: '#8C8278', marginTop: 2 }}>{item.desc}</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#2C1810', marginTop: 4 }}>{item.price.toLocaleString()} XAF</Text>
            </View>
            {/* Cart controls */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'center' }}>
              {cart[item.name] ? (
                <>
                  <TouchableOpacity onPress={() => removeFromCart(item.name)}
                    style={{ width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="Minus" size={14} color="#E8591A" />
                  </TouchableOpacity>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#2C1810', minWidth: 18, textAlign: 'center' }}>{cart[item.name]}</Text>
                </>
              ) : null}
              <TouchableOpacity onPress={() => addToCart(item.name)}
                style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Plus" size={14} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Cart CTA */}
      {cartCount > 0 && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#E5E0D8' }}>
          <TouchableOpacity style={{ height: 48, backgroundColor: '#E8591A', borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }} activeOpacity={0.85}>
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#E8591A', fontSize: 11, fontWeight: '700' }}>{cartCount}</Text>
            </View>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Voir le panier</Text>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>{cartTotal.toLocaleString()} XAF</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
