import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const CATEGORY_KEYS = ['all', 'sauce', 'meat', 'vegetarian', 'desserts'] as const;
type CategoryKey = typeof CATEGORY_KEYS[number];

const FAVORITES: {
  id: string; name: string; region: string;
  difficultyKey: 'difficultyEasy' | 'difficultyMedium' | 'difficultyHard';
  diffColor: string; time: string; rating: number; category: CategoryKey;
}[] = [
  { id: '1', name: 'Ndolé traditionnel', region: 'Littoral',  difficultyKey: 'difficultyMedium', diffColor: '#F9A825', time: '45 min',  rating: 4.9, category: 'vegetarian' },
  { id: '2', name: 'Poulet DG',          region: 'Centre',    difficultyKey: 'difficultyEasy',   diffColor: '#2E7D32', time: '60 min',  rating: 4.7, category: 'meat' },
  { id: '3', name: 'Mbongo Tchobi',      region: 'Littoral',  difficultyKey: 'difficultyHard',   diffColor: '#C62828', time: '90 min',  rating: 5.0, category: 'sauce' },
  { id: '4', name: 'Eru spécial',        region: 'Sud-Ouest', difficultyKey: 'difficultyMedium', diffColor: '#F9A825', time: '55 min',  rating: 4.8, category: 'vegetarian' },
  { id: '5', name: 'Achu Soup',          region: 'Ouest',     difficultyKey: 'difficultyHard',   diffColor: '#C62828', time: '120 min', rating: 4.9, category: 'sauce' },
  { id: '6', name: 'Koki haricots',      region: 'Littoral',  difficultyKey: 'difficultyEasy',   diffColor: '#2E7D32', time: '30 min',  rating: 4.5, category: 'vegetarian' },
];

export default function FavoritesScreen() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const canGoBack = navigation.canGoBack();
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [favorites, setFavorites] = useState(FAVORITES);

  const filtered = favorites.filter(f => activeCategory === 'all' || f.category === activeCategory);

  const toggleSave = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        {canGoBack && (
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
            <Icon name="ArrowLeft" size={22} color={C.ink} />
          </TouchableOpacity>
        )}
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('favorites.title')}</Text>
        <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: C.goldSoft }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: C.primary }}>{t('favorites.count', { count: favorites.length })}</Text>
        </View>
      </View>

      {/* Category chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }} style={{ backgroundColor: C.surface, maxHeight: 52, borderBottomWidth: 1, borderColor: C.border }}>
        {CATEGORY_KEYS.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCategory(cat)}
            style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: cat === activeCategory ? C.primary : C.surface2, borderWidth: 1, borderColor: cat === activeCategory ? C.primary : C.border }}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: cat === activeCategory ? '#fff' : C.inkSoft }}>{t(`favorites.${cat}`)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 80 }}>
            <Icon name="Heart" size={48} color={C.inkMute} />
            <Text style={{ fontSize: 16, color: C.inkMute, marginTop: 12 }}>{t('favorites.empty')}</Text>
          </View>
        ) : (
          filtered.map(fav => (
            <TouchableOpacity
              key={fav.id}
              style={{ backgroundColor: C.surface, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}
              activeOpacity={0.85}
            >
              <View style={{ width: 70, height: 70, borderRadius: 14, backgroundColor: C.surface2, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Camera" size={22} color={C.inkMute} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink, marginBottom: 2 }}>{fav.name}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Icon name="MapPin" size={11} color={C.inkMute} />
                  <Text style={{ fontSize: 12, color: C.inkMute }}>{fav.region}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ paddingHorizontal: 7, paddingVertical: 2, borderRadius: 7, backgroundColor: fav.diffColor + '15' }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: fav.diffColor }}>{t(`favorites.${fav.difficultyKey}`)}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <Icon name="Clock" size={11} color={C.inkMute} />
                    <Text style={{ fontSize: 11, color: C.inkMute }}>{fav.time}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <Icon name="Star" size={11} color={C.gold} fill={C.gold} />
                    <Text style={{ fontSize: 11, fontWeight: '700', color: C.ink }}>{fav.rating}</Text>
                  </View>
                </View>
              </View>

              <TouchableOpacity onPress={() => toggleSave(fav.id)} style={{ padding: 8 }}>
                <Icon name="Heart" size={20} color={C.primary} fill={C.primary} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
