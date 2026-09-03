import React, { useEffect, useRef, useState } from 'react';
import {
  View, ScrollView, TextInput, TouchableOpacity, StatusBar, Dimensions, Platform, Image,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import MapView, { Marker, PROVIDER_GOOGLE, type Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM, SHADOW_MD, SHADOW_LG } from '@/constants/theme';
import { useRestaurantStore } from '@/store/restaurant.store';

const { height: SH } = Dimensions.get('window');

// Douala, Cameroun — centre par défaut si la position de l'utilisateur est indisponible
const DEFAULT_REGION: Region = { latitude: 4.0511, longitude: 9.7679, latitudeDelta: 0.05, longitudeDelta: 0.05 };

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const FILTERS = [
  { key: 'all',    label: 'Tous' },
  { key: 'open',   label: 'Ouvert' },
  { key: 'ndole',  label: 'Ndolé' },
  { key: 'near',   label: '< 2km' },
  { key: 'budget', label: '$$' },
];

export default function MapScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const C = useColors();
  const [activeFilter, setActiveFilter] = useState(0);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [search, setSearch] = useState('');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const mapRef = useRef<MapView>(null);
  const restaurants = useRestaurantStore((s) => s.restaurants);
  const fetchNearby = useRestaurantStore((s) => s.fetchNearby);

  useEffect(() => {
    fetchNearby(DEFAULT_REGION.latitude, DEFAULT_REGION.longitude);

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      try {
        const pos = await Location.getCurrentPositionAsync({});
        const coords = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
        setUserLocation(coords);
        mapRef.current?.animateToRegion({ ...coords, latitudeDelta: 0.05, longitudeDelta: 0.05 }, 600);
        fetchNearby(coords.latitude, coords.longitude);
      } catch {
        // position indisponible — on garde le centre par défaut (Douala)
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const restaurantsWithDist = restaurants.map((r) => ({
    ...r,
    dist: userLocation ? distanceKm(userLocation.latitude, userLocation.longitude, r.lat, r.lng) : distanceKm(DEFAULT_REGION.latitude, DEFAULT_REGION.longitude, r.lat, r.lng),
  }));

  const filtered = restaurantsWithDist.filter(r => {
    if (activeFilter === 1 && !r.isOpen) return false;
    if (activeFilter === 2 && !r.specialties.some(s => s.toLowerCase().includes('ndol'))) return false;
    if (activeFilter === 3 && r.dist > 2) return false;
    if (activeFilter === 4 && r.price !== '€') return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) &&
        !r.specialties.some(s => s.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const MAP_H = SH * 0.54;

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  if (viewMode === 'list') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
        <StatusBar barStyle={C.statusBar} />
        <View style={{ paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderColor: C.border, backgroundColor: C.surface, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity
            onPress={() => setViewMode('map')}
            style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="ArrowLeft" size={17} color={C.inkSoft} />
          </TouchableOpacity>
          <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: C.ink }}>
            {t('map.nearby', 'À proximité')}
          </Text>
          <TouchableOpacity
            onPress={() => setViewMode('map')}
            style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: C.goldSoft, alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="MapPin" size={17} color={C.primary} />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border, gap: 10 }}>
          <View style={{ height: 44, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface2, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 }}>
            <Icon name="Search" size={16} color={C.inkMute} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={t('map.searchPlaceholder', 'Restaurant, plat...')}
              placeholderTextColor={C.inkMute}
              style={{ flex: 1, fontSize: 14, color: C.ink }}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Icon name="X" size={15} color={C.inkMute} />
              </TouchableOpacity>
            )}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {FILTERS.map((f, i) => (
              <TouchableOpacity
                key={f.key}
                onPress={() => setActiveFilter(i)}
                style={{ height: 32, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, backgroundColor: i === activeFilter ? C.primary : C.surface, borderColor: i === activeFilter ? C.primary : C.border, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: i === activeFilter ? '#fff' : C.inkSoft }}>{f.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 4 }}>
          <Text style={{ fontSize: 13, color: C.inkMute }}>
            <Text style={{ fontWeight: '700', color: C.ink }}>{filtered.length}</Text>{' '}
            {t('map.results', 'résultats')} · Douala
          </Text>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {filtered.map((r) => (
            <TouchableOpacity
              key={r.id}
              onPress={() => navigation.navigate('Restaurant', { restaurantId: r.id })}
              style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, flexDirection: 'row', overflow: 'hidden', ...SHADOW_SM }}
              activeOpacity={0.85}
            >
              <View style={{ width: 100, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {r.imageUrl ? (
                  <Image source={{ uri: r.imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                ) : (
                  <Icon name="ChefHat" size={32} color={C.inkMute} />
                )}
                {r.isVerified && (
                  <View style={{ position: 'absolute', top: 6, left: 6, backgroundColor: C.primary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700', fontFamily: 'JetBrainsMono-Regular' }}>KFL</Text>
                      <Icon name="Check" size={8} color="#fff" strokeWidth={3} />
                    </View>
                  </View>
                )}
              </View>
              <View style={{ flex: 1, padding: 14 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, marginBottom: 2, fontFamily: 'Inter-Bold' }}>{r.name}</Text>
                <Text style={{ fontSize: 12, color: C.inkMute, marginBottom: 8 }}>{r.type}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                  <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: r.isOpen ? C.success : C.error }} />
                  <Text style={{ fontSize: 11, color: r.isOpen ? C.success : C.error, fontWeight: '600' }}>
                    {r.isOpen ? `Ouvert · ${r.hoursLabel}` : 'Fermé'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <Icon name="MapPin" size={11} color={C.inkMute} />
                    <Text style={{ fontSize: 11, color: C.inkMute }}>{r.dist.toFixed(1)} km</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                    <Icon name="Star" size={10} color={C.gold} fill={C.gold} />
                    <Text style={{ fontSize: 11, color: C.gold, fontWeight: '700' }}>{r.rating}</Text>
                  </View>
                  <Text style={{ fontSize: 11, color: C.inkMute }}>({r.reviewCount})</Text>
                  <Text style={{ fontSize: 11, color: C.inkSoft }}>{r.price}</Text>
                </View>
              </View>
              <View style={{ paddingRight: 14, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="ChevronRight" size={18} color={C.inkMute} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── MAP VIEW (carte réelle Google Maps / Apple Maps) ───────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      <MapView
        ref={mapRef}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: MAP_H }}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={DEFAULT_REGION}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {filtered.map((r) => (
          <Marker
            key={r.id}
            coordinate={{ latitude: r.lat, longitude: r.lng }}
            onPress={() => navigation.navigate('Restaurant', { restaurantId: r.id })}
          >
            <View style={{ alignItems: 'center' }}>
              <View style={{
                backgroundColor: r.isVerified ? C.primary : C.surface,
                borderWidth: r.isVerified ? 0 : 1.5, borderColor: C.border,
                paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14,
                flexDirection: 'row', alignItems: 'center', gap: 4,
                ...SHADOW_MD,
              }}>
                <Icon name="Star" size={10} color={r.isVerified ? '#fff' : C.gold} fill={r.isVerified ? '#fff' : C.gold} />
                <Text style={{ fontSize: 12, fontWeight: '700', color: r.isVerified ? '#fff' : C.ink, fontFamily: 'Inter-Bold' }}>
                  {r.rating}
                </Text>
              </View>
              <View style={{ width: 8, height: 8, backgroundColor: r.isVerified ? C.primary : C.inkMute, borderRadius: 4, marginTop: -3 }} />
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Search overlay */}
      <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 10, gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderRadius: 16, paddingHorizontal: 14, gap: 10, ...SHADOW_MD, height: 52 }}>
            <Icon name="MapPin" size={18} color={C.primary} />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={t('map.searchPlaceholder', 'Restaurant, plat...')}
              placeholderTextColor={C.inkMute}
              style={{ flex: 1, fontSize: 14, color: C.ink }}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Icon name="X" size={15} color={C.inkMute} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => setViewMode('list')}
              style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="Grid" size={16} color={C.inkSoft} />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 2 }}>
            {FILTERS.map((f, i) => (
              <TouchableOpacity
                key={f.key}
                onPress={() => setActiveFilter(i)}
                style={{ height: 34, paddingHorizontal: 16, borderRadius: 17, borderWidth: 1, backgroundColor: i === activeFilter ? C.primary : C.surface, borderColor: i === activeFilter ? C.primary : C.border, alignItems: 'center', justifyContent: 'center', ...SHADOW_SM }}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', color: i === activeFilter ? '#fff' : C.inkSoft }}>{f.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* Recentrer sur ma position */}
      <TouchableOpacity
        onPress={() => userLocation && mapRef.current?.animateToRegion({ ...userLocation, latitudeDelta: 0.05, longitudeDelta: 0.05 }, 400)}
        style={{ position: 'absolute', right: 16, top: MAP_H - 60, width: 44, height: 44, borderRadius: 22, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', ...SHADOW_MD }}
      >
        <Icon name="Navigation" size={19} color={C.navy} />
      </TouchableOpacity>

      {/* Bottom sheet */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, top: MAP_H - 22,
        backgroundColor: C.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24,
        ...SHADOW_LG,
      }}>
        <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 2 }}>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: C.border }} />
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 17, color: C.ink }}>
              {t('map.nearby', 'À proximité')}
            </Text>
            <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 1 }}>
              {filtered.length} {t('map.results', 'résultats')} · Douala
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setViewMode('list')}
            style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 14, borderWidth: 1, borderColor: C.border, flexDirection: 'row', alignItems: 'center', gap: 6 }}
          >
            <Icon name="Grid" size={14} color={C.inkSoft} />
            <Text style={{ fontSize: 12, color: C.inkSoft, fontWeight: '600' }}>Liste</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 20, paddingBottom: 90, paddingTop: 4 }}>
          {filtered.map((r) => (
            <TouchableOpacity
              key={r.id}
              onPress={() => {
                navigation.navigate('Restaurant', { restaurantId: r.id });
                mapRef.current?.animateToRegion({ latitude: r.lat, longitude: r.lng, latitudeDelta: 0.02, longitudeDelta: 0.02 }, 400);
              }}
              style={{ width: 190, backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}
              activeOpacity={0.85}
            >
              <View style={{ height: 94, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {r.imageUrl ? (
                  <Image source={{ uri: r.imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                ) : (
                  <Icon name="ChefHat" size={34} color={C.inkMute} />
                )}
                {r.isVerified && (
                  <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: C.primary, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700', fontFamily: 'JetBrainsMono-Regular' }}>KFL</Text>
                      <Icon name="Check" size={8} color="#fff" strokeWidth={3} />
                    </View>
                  </View>
                )}
              </View>
              <View style={{ padding: 12 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink, marginBottom: 2, fontFamily: 'Inter-Bold' }} numberOfLines={1}>{r.name}</Text>
                <Text style={{ fontSize: 11, color: C.inkMute, marginBottom: 6 }} numberOfLines={1}>{r.type}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: r.isOpen ? C.success : C.error }} />
                    <Text style={{ fontSize: 10, color: r.isOpen ? C.success : C.error, fontWeight: '600' }}>
                      {r.isOpen ? 'Ouvert' : 'Fermé'}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 10, color: C.inkMute }}>· {r.dist.toFixed(1)} km</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
                    <Icon name="Star" size={9} color={C.gold} fill={C.gold} />
                    <Text style={{ fontSize: 10, color: C.gold, fontWeight: '700' }}>{r.rating}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
