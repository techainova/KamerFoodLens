import React, { useEffect, useMemo, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Image,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useFavoritesStore } from '@/store/favorites.store';
import type { FavoriteItem } from '@/services/users.service';
import { SHADOW_SM } from '@/constants/theme';

const FILTER_KEYS = ['all', 'recipe', 'restaurant'] as const;
type FilterKey = typeof FILTER_KEYS[number];

const DIFFICULTY_COLOR: Record<string, string> = {
  easy: '#2E7D32',
  medium: '#F9A825',
  hard: '#C62828',
};

function toFilterBucket(type: FavoriteItem['type']): 'recipe' | 'restaurant' {
  return type === 'restaurant' ? 'restaurant' : 'recipe';
}

function isNavigable(fav: FavoriteItem): boolean {
  return fav.type === 'recipe' || fav.type === 'restaurant';
}

export default function FavoritesScreen() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const canGoBack = navigation.canGoBack();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const favorites = useFavoritesStore((s) => s.favorites);
  const isLoading = useFavoritesStore((s) => s.isLoading);
  const fetchAll = useFavoritesStore((s) => s.fetchAll);
  const toggle = useFavoritesStore((s) => s.toggle);

  useEffect(() => {
    void fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(
    () => favorites.filter((f) => activeFilter === 'all' || toFilterBucket(f.type) === activeFilter),
    [favorites, activeFilter],
  );

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

      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }} style={{ backgroundColor: C.surface, maxHeight: 52, borderBottomWidth: 1, borderColor: C.border }}>
        {FILTER_KEYS.map(key => (
          <TouchableOpacity
            key={key}
            onPress={() => setActiveFilter(key)}
            style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: key === activeFilter ? C.primary : C.surface2, borderWidth: 1, borderColor: key === activeFilter ? C.primary : C.border }}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: key === activeFilter ? '#fff' : C.inkSoft }}>{t(`favorites.filter${key.charAt(0).toUpperCase()}${key.slice(1)}`)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading && favorites.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#E8591A" />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          {filtered.length === 0 ? (
            <View style={{ alignItems: 'center', paddingTop: 80 }}>
              <Icon name="Heart" size={48} color={C.inkMute} />
              <Text style={{ fontSize: 16, color: C.inkMute, marginTop: 12 }}>{t('favorites.empty')}</Text>
            </View>
          ) : (
            filtered.map(fav => {
              const difficultyColor = fav.difficulty ? DIFFICULTY_COLOR[fav.difficulty] : undefined;
              const navigable = isNavigable(fav);
              return (
                <TouchableOpacity
                  key={fav.id}
                  activeOpacity={navigable ? 0.85 : 1}
                  disabled={!navigable}
                  onPress={() => {
                    if (fav.type === 'recipe') navigation.navigate('Recipe', { dishId: fav.itemId });
                    else if (fav.type === 'restaurant') navigation.navigate('Restaurant', { restaurantId: fav.itemId });
                  }}
                  style={{ backgroundColor: C.surface, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}
                >
                  <View style={{ width: 70, height: 70, borderRadius: 14, backgroundColor: C.surface2, borderWidth: fav.imageUrl ? 0 : 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {fav.imageUrl ? (
                      <Image source={{ uri: fav.imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                    ) : (
                      <Icon name={fav.type === 'restaurant' ? 'Store' : 'ChefHat'} size={22} color={C.inkMute} />
                    )}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink, marginBottom: 2 }}>{fav.name}</Text>
                    {!!fav.region && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                        <Icon name="MapPin" size={11} color={C.inkMute} />
                        <Text style={{ fontSize: 12, color: C.inkMute }}>{fav.region}</Text>
                      </View>
                    )}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      {!!fav.difficulty && difficultyColor && (
                        <View style={{ paddingHorizontal: 7, paddingVertical: 2, borderRadius: 7, backgroundColor: difficultyColor + '15' }}>
                          <Text style={{ fontSize: 10, fontWeight: '700', color: difficultyColor }}>
                            {t(`favorites.difficulty${fav.difficulty.charAt(0).toUpperCase()}${fav.difficulty.slice(1)}`)}
                          </Text>
                        </View>
                      )}
                      {fav.durationMin !== null && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                          <Icon name="Clock" size={11} color={C.inkMute} />
                          <Text style={{ fontSize: 11, color: C.inkMute }}>{fav.durationMin} min</Text>
                        </View>
                      )}
                      {fav.rating !== null && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                          <Icon name="Star" size={11} color={C.gold} fill={C.gold} />
                          <Text style={{ fontSize: 11, fontWeight: '700', color: C.ink }}>{fav.rating}</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <TouchableOpacity onPress={() => void toggle(fav.type, fav.itemId)} style={{ padding: 8 }}>
                    <Icon name="Heart" size={20} color={C.primary} fill={C.primary} />
                  </TouchableOpacity>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
