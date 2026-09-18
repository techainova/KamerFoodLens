// Onglet Restaurant — découverte façon KFL v5 : recherche, catégories, mini
// carte et liste des restaurants à proximité, avec suivi (follow) en un tap.
import React, { useEffect, useMemo, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, TextInput, Image, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useRestaurantStore } from '@/store/restaurant.store';
import { useAuthGate } from '@/hooks/useAuthGate';
import { onTabBarScroll } from '@/navigation/tabBarScroll';

const CATEGORIES = ['Ndolé', 'Grillades', 'Soupes', 'Mijotés', 'Petit-déj', 'Boissons'];
const FILTERS = ['Ouvert', '< 30 min', 'Mieux noté', 'Livraison', 'Réservation'];

function Stars({ value, size = 12 }: { value: number; size?: number }) {
  const C = useColors();
  return (
    <View style={{ flexDirection: 'row', gap: 1 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Icon key={i} name="Star" size={size} color={i <= Math.round(value) ? C.gold : C.border} fill={i <= Math.round(value) ? C.gold : 'none'} />
      ))}
    </View>
  );
}

export default function Restos() {
  const C = useColors();
  const nav = useNavigation<any>();
  const { requireAuth } = useAuthGate();
  const restaurants = useRestaurantStore((s) => s.restaurants);
  const isLoading = useRestaurantStore((s) => s.isLoading);
  const ensureLoaded = useRestaurantStore((s) => s.ensureLoaded);
  const toggleFollow = useRestaurantStore((s) => s.toggleFollow);
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<number | null>(null);

  useEffect(() => { ensureLoaded(); }, [ensureLoaded]);

  const filtered = useMemo(() => {
    let list = restaurants;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((r) =>
        r.name.toLowerCase().includes(q) ||
        r.type.toLowerCase().includes(q) ||
        r.specialties.some((s) => s.toLowerCase().includes(q)));
    }
    if (activeFilter === 0) list = list.filter((r) => r.isOpen);
    if (activeFilter === 1) list = list.filter((r) => parseInt(r.deliveryTime, 10) <= 30);
    if (activeFilter === 2) list = [...list].sort((a, b) => b.rating - a.rating);
    if (activeFilter === 3) list = list.filter((r) => r.acceptsDelivery);
    if (activeFilter === 4) list = list.filter((r) => r.acceptsReservations);
    return list;
  }, [restaurants, query, activeFilter]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }} edges={['top', 'left', 'right']}>
      {/* Barre du haut */}
      <View style={{ height: 50, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={() => nav.navigate('MapScreen')} style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
          <View>
            <Text style={{ fontSize: 10, fontWeight: '700', color: C.inkMute }}>LIVRER À</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>Douala</Text>
              <Icon name="ChevronDown" size={15} color={C.primary} />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.navigate('MapScreen')} style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="MapPin" size={20} color={C.ink} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false} onScroll={onTabBarScroll} scrollEventThrottle={16}>
        {/* Recherche */}
        <View style={{ paddingHorizontal: 14, paddingTop: 4 }}>
          <View style={{ height: 42, borderRadius: 12, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, gap: 9 }}>
            <Icon name="Search" size={17} color={C.inkMute} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Plat, restaurant, quartier…"
              placeholderTextColor={C.inkMute}
              style={{ flex: 1, fontSize: 14, color: C.ink }}
            />
          </View>
        </View>

        {/* Filtres */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, paddingVertical: 12, gap: 7 }}>
          {FILTERS.map((f, i) => (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(activeFilter === i ? null : i)}
              style={{
                height: 32, paddingHorizontal: 13, borderRadius: 16, justifyContent: 'center',
                backgroundColor: activeFilter === i ? C.ink : C.surface,
                borderWidth: activeFilter === i ? 0 : 1, borderColor: C.border,
              }}
            >
              <Text style={{ fontSize: 12.5, fontWeight: '600', color: activeFilter === i ? C.cream : C.inkSoft }}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Catégories */}
        <View style={{ paddingHorizontal: 14, paddingTop: 4 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink, marginBottom: 10 }}>Par catégorie</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 14, gap: 11 }}>
          {CATEGORIES.map((c) => (
            <TouchableOpacity key={c} onPress={() => setQuery(c)} style={{ width: 72, alignItems: 'center' }}>
              <View style={{ width: 72, height: 72, borderRadius: 14, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="ChefHat" size={26} color={C.inkFaint} />
              </View>
              <Text style={{ fontSize: 11.5, fontWeight: '600', color: C.ink, marginTop: 5 }}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Liste */}
        <View style={{ paddingHorizontal: 14, paddingTop: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink }}>Autour de vous</Text>
          <Text style={{ fontSize: 12.5, color: C.inkMute }}>{filtered.length} résultats</Text>
        </View>

        {isLoading && restaurants.length === 0 ? (
          <ActivityIndicator color={C.primary} style={{ marginTop: 30 }} />
        ) : (
          <View style={{ paddingHorizontal: 14, paddingTop: 12, gap: 18 }}>
            {filtered.map((r) => (
              <TouchableOpacity key={r.id} activeOpacity={0.9} onPress={() => nav.navigate('Restaurant', { restaurantId: r.id })}>
                <View style={{ borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
                  {r.imageUrl ? (
                    <Image source={{ uri: r.imageUrl }} style={{ width: '100%', aspectRatio: 16 / 9 }} resizeMode="cover" />
                  ) : (
                    <View style={{ width: '100%', aspectRatio: 16 / 9, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="ChefHat" size={40} color={C.inkFaint} />
                    </View>
                  )}
                  {!r.isOpen && (
                    <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(20,17,14,0.55)', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>Fermé</Text>
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={() => requireAuth(() => void toggleFollow(r.id))}
                    style={{ position: 'absolute', top: 10, right: 10, width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(20,17,14,0.4)', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Icon name="Heart" size={17} color="#fff" fill={r.isFollowing ? '#fff' : 'none'} />
                  </TouchableOpacity>
                  {r.distance && (
                    <View style={{ position: 'absolute', bottom: 10, left: 10, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 11, paddingVertical: 5, borderRadius: 20 }}>
                      <Icon name="Bike" size={13} color={C.ink} />
                      <Text style={{ fontSize: 11.5, fontWeight: '700', color: C.ink }}>{r.deliveryTime} min</Text>
                    </View>
                  )}
                </View>
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 9, alignItems: 'flex-start' }}>
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>{r.name.slice(0, 2).toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink }}>{r.name}</Text>
                    <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 1 }}>{r.type}{r.distance ? ` · ${r.distance}` : ''}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 }}>
                      <Stars value={r.rating} />
                      <Text style={{ fontSize: 11.5, fontWeight: '700', color: C.ink }}>{r.rating.toFixed(1)}</Text>
                      <Text style={{ fontSize: 11, color: C.inkMute }}>({r.reviewCount})</Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => nav.navigate('Restaurant', { restaurantId: r.id })}
                    style={{ paddingHorizontal: 14, height: 32, borderRadius: 16, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text style={{ fontSize: 12.5, fontWeight: '700', color: C.ink }}>Voir</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
            {filtered.length === 0 && (
              <Text style={{ textAlign: 'center', color: C.inkMute, fontSize: 13, marginTop: 20 }}>Aucun restaurant trouvé.</Text>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
