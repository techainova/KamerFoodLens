import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const TABS = ['Menu', 'Avis', 'Infos'];

const MENU_SECTIONS = [
  {
    title: 'Plats principaux',
    items: [
      { name: 'Ndolé traditionnel', desc: "Poisson fumé, crevettes, pâte d'arachide", price: 4500, popular: true },
      { name: 'Poulet DG',          desc: 'Plantains frits, légumes sautés',           price: 5500 },
      { name: 'Eru & Fufu',         desc: 'Eru frais, waterleaf, viande fumée',         price: 4000 },
    ],
  },
  {
    title: 'Boissons',
    items: [
      { name: 'Jus de gingembre', desc: 'Frais et naturel',  price: 1000 },
      { name: 'Jus de bissap',    desc: 'Hibiscus rouge',    price:  800 },
    ],
  },
];

export default function RestaurantPublicV4() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState(0);
  const [cart, setCart] = useState<Record<string, number>>({});

  const addToCart = (name: string) => setCart(prev => ({ ...prev, [name]: (prev[name] || 0) + 1 }));
  const cartCount = Object.values(cart).reduce((s, v) => s + v, 0);
  const cartTotal = MENU_SECTIONS.flatMap(s => s.items).reduce((s, item) => s + (cart[item.name] || 0) * item.price, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      {/* Hero */}
      <View style={{ height: 208, position: 'relative' }}>
        <View style={{ flex: 1, backgroundColor: '#F5F0EB', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="ChefHat" size={56} color="rgba(140,130,120,0.25)" />
          <Text style={{ fontSize: 11, color: '#8C8278', fontStyle: 'italic', marginTop: 6 }}>Chez Mama Pauline · cover</Text>
        </View>
        <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.18)' }} />
        <View style={{ position: 'absolute', top: 16, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}
            style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="ArrowLeft" size={18} color="#fff" />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Bookmark" size={16} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Share2" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
          <Text style={{ color: '#fff', fontSize: 24, fontFamily: 'PlayfairDisplay-Bold', lineHeight: 30 }}>Chez Mama Pauline</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <View style={{ flexDirection: 'row', gap: 1 }}>
              {[0,1,2,3].map(i => <Icon key={i} name="Star" size={11} color="#F9A825" fill="#F9A825" />)}
              <Icon name="Star" size={11} color="#F9A825" fill="none" />
            </View>
            <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.8)' }}>4.8 (312) · $$ · 1.4 km</Text>
          </View>
        </View>
      </View>

      {/* Status chips */}
      <View style={{ flexDirection: 'row', gap: 6, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <View style={{ height: 28, paddingHorizontal: 10, borderRadius: 14, backgroundColor: '#E3F0E4', borderWidth: 1, borderColor: 'rgba(46,125,50,0.3)', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#2E7D32' }} />
          <Text style={{ fontSize: 11, color: '#2E7D32', fontWeight: '600' }}>Ouvert</Text>
        </View>
        <View style={{ height: 28, paddingHorizontal: 10, borderRadius: 14, backgroundColor: '#F5F0EB', borderWidth: 1, borderColor: '#E5E0D8', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon name="Clock" size={11} color="#6D4C41" />
          <Text style={{ fontSize: 11, color: '#6D4C41' }}>Livraison ~35min</Text>
        </View>
        <View style={{ height: 28, paddingHorizontal: 10, borderRadius: 14, backgroundColor: '#F5F0EB', borderWidth: 1, borderColor: '#E5E0D8', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon name="Truck" size={11} color="#6D4C41" />
          <Text style={{ fontSize: 11, color: '#6D4C41' }}>Gratuite dès 5 000 XAF</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff' }}>
        {TABS.map((tab, i) => (
          <TouchableOpacity key={i} onPress={() => setActiveTab(i)}
            style={{ flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderBottomColor: i === activeTab ? '#E8591A' : 'transparent' }}>
            <Text style={{ fontSize: 13, fontWeight: i === activeTab ? '600' : '500', color: i === activeTab ? '#E8591A' : '#8C8278' }}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {MENU_SECTIONS.map((section, si) => (
          <View key={si} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', marginBottom: 12 }}>{section.title}</Text>
            {section.items.map((item, ii) => (
              <View key={ii} style={{ flexDirection: 'row', gap: 12, paddingVertical: 12, borderBottomWidth: ii < section.items.length - 1 ? 1 : 0, borderBottomColor: '#F5F0EB' }}>
                <View style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: '#F5F0EB', borderWidth: 1, borderStyle: 'dashed', borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="ChefHat" size={24} color="rgba(140,130,120,0.35)" />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: '#2C1810' }}>{item.name}</Text>
                    {item.popular && (
                      <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10, backgroundColor: '#FEF3EC', borderWidth: 1, borderColor: 'rgba(232,89,26,0.3)' }}>
                        <Icon name="Star" size={10} color="#E8591A" fill="#E8591A" />
                      </View>
                    )}
                  </View>
                  <Text style={{ fontSize: 11, color: '#8C8278', marginTop: 2 }}>{item.desc}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: '#2C1810', marginTop: 4 }}>{item.price.toLocaleString()} XAF</Text>
                </View>
                <TouchableOpacity onPress={() => addToCart(item.name)}
                  style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center', flexShrink: 0, alignSelf: 'center' }}>
                  <Icon name="Plus" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Cart CTA */}
      {cartCount > 0 && (
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#E5E0D8' }}>
          <TouchableOpacity style={{ height: 48, backgroundColor: '#E8591A', borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20 }} activeOpacity={0.85}>
            <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#E8591A' }}>{cartCount}</Text>
            </View>
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Voir le panier</Text>
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>{cartTotal.toLocaleString()} XAF</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
