import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const CATEGORIES = ['Tout', 'Sauce', 'Viande', 'Végétarien', 'Desserts'];

const FAVORITES = [
  {
    id: '1',
    name: 'Ndolé traditionnel',
    region: 'Littoral',
    difficulty: 'Intermédiaire',
    diffColor: '#F9A825',
    time: '45 min',
    rating: 4.9,
    category: 'Végétarien',
    saved: true,
  },
  {
    id: '2',
    name: 'Poulet DG',
    region: 'Centre',
    difficulty: 'Facile',
    diffColor: '#2E7D32',
    time: '60 min',
    rating: 4.7,
    category: 'Viande',
    saved: true,
  },
  {
    id: '3',
    name: 'Mbongo Tchobi',
    region: 'Littoral',
    difficulty: 'Expert',
    diffColor: '#C62828',
    time: '90 min',
    rating: 5.0,
    category: 'Sauce',
    saved: true,
  },
  {
    id: '4',
    name: 'Eru spécial',
    region: 'Sud-Ouest',
    difficulty: 'Intermédiaire',
    diffColor: '#F9A825',
    time: '55 min',
    rating: 4.8,
    category: 'Végétarien',
    saved: true,
  },
  {
    id: '5',
    name: 'Achu Soup',
    region: 'Ouest',
    difficulty: 'Expert',
    diffColor: '#C62828',
    time: '120 min',
    rating: 4.9,
    category: 'Sauce',
    saved: true,
  },
  {
    id: '6',
    name: 'Koki haricots',
    region: 'Littoral',
    difficulty: 'Facile',
    diffColor: '#2E7D32',
    time: '30 min',
    rating: 4.5,
    category: 'Végétarien',
    saved: true,
  },
];

export default function FavoritesScreen() {
  const navigation = useNavigation<any>();
  const canGoBack = navigation.canGoBack();
  const [activeCategory, setActiveCategory] = useState('Tout');
  const [favorites, setFavorites] = useState(FAVORITES);

  const filtered = favorites.filter(f => activeCategory === 'Tout' || f.category === activeCategory);

  const toggleSave = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        {canGoBack && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
            <Icon name="ArrowLeft" size={22} color="#2C1810" />
          </TouchableOpacity>
        )}
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Favoris</Text>
        <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: '#E8591A15' }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#E8591A' }}>{favorites.length} plats</Text>
        </View>
      </View>

      {/* Category chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }} style={{ backgroundColor: '#fff', maxHeight: 52, borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCategory(cat)}
            style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: cat === activeCategory ? '#E8591A' : '#F5F0EB', borderWidth: 1, borderColor: cat === activeCategory ? '#E8591A' : '#E5E0D8' }}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: cat === activeCategory ? '#fff' : '#6D4C41' }}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 80 }}>
            <Icon name="Heart" size={48} color="rgba(140,130,120,0.3)" />
            <Text style={{ fontSize: 16, color: '#8C8278', marginTop: 12 }}>Aucun favori ici</Text>
          </View>
        ) : (
          filtered.map(fav => (
            <TouchableOpacity
              key={fav.id}
              style={{ backgroundColor: '#fff', borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#E5E0D8', ...SHADOW_SM }}
              activeOpacity={0.85}
            >
              {/* Image placeholder */}
              <View style={{ width: 70, height: 70, borderRadius: 14, backgroundColor: '#F5F0EB', borderWidth: 1, borderStyle: 'dashed', borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Camera" size={22} color="rgba(140,130,120,0.3)" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#2C1810', marginBottom: 2 }}>{fav.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Icon name="MapPin" size={11} color="#8C8278" />
                  <Text style={{ fontSize: 12, color: '#8C8278' }}>{fav.region}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ paddingHorizontal: 7, paddingVertical: 2, borderRadius: 7, backgroundColor: fav.diffColor + '15' }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: fav.diffColor }}>{fav.difficulty}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <Icon name="Clock" size={11} color="#8C8278" />
                    <Text style={{ fontSize: 11, color: '#8C8278' }}>{fav.time}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <Icon name="Star" size={11} color="#F9A825" fill="#F9A825" />
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#2C1810' }}>{fav.rating}</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity onPress={() => toggleSave(fav.id)} style={{ padding: 8 }}>
                <Icon name="Heart" size={20} color="#E8591A" fill="#E8591A" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
