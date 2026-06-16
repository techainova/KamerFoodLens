import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity,
  SafeAreaView, StatusBar, Dimensions,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const { width: SW, height: SH } = Dimensions.get('window');

const SHADOW_MD = { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 6, elevation: 4 };
const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 };
const SHADOW_LG = { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.14, shadowRadius: 12, elevation: 8 };

const RESTAURANTS = [
  {
    id: '1', name: 'Chez Mama Pauline', type: 'Cuisine traditionnelle',
    dist: '0.4 km', rating: 4.8, reviews: 127, open: true,
    hours: '11h–22h', price: '$$', specialties: ['Ndolé', 'Poulet DG'],
    kflVerified: true, px: 0.42, py: 0.38,
  },
  {
    id: '2', name: "Restaurant L'Authenticité", type: 'Cuisine du Littoral',
    dist: '1.2 km', rating: 4.6, reviews: 89, open: true,
    hours: '10h–21h', price: '$$$', specialties: ['Mbongo tchobi', 'Eru'],
    kflVerified: true, px: 0.63, py: 0.52,
  },
  {
    id: '3', name: 'Kmer Saveurs', type: 'Street food camerounaise',
    dist: '2.1 km', rating: 4.3, reviews: 54, open: false,
    hours: '12h–20h', price: '$', specialties: ['Soya', 'Koki'],
    kflVerified: false, px: 0.25, py: 0.62,
  },
  {
    id: '4', name: 'La Table du Wouri', type: 'Cuisine fusion',
    dist: '3.5 km', rating: 4.9, reviews: 203, open: true,
    hours: '12h–23h', price: '$$$', specialties: ['Poisson braisé', 'Plantains'],
    kflVerified: true, px: 0.70, py: 0.28,
  },
];

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
  const [activeFilter, setActiveFilter] = useState(0);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [search, setSearch] = useState('');

  const filtered = RESTAURANTS.filter(r => {
    if (activeFilter === 1 && !r.open) return false;
    if (activeFilter === 3 && parseFloat(r.dist) > 2) return false;
    if (search && !r.name.toLowerCase().includes(search.toLowerCase()) &&
        !r.specialties.some(s => s.toLowerCase().includes(search.toLowerCase()))) return false;
    return true;
  });

  const MAP_H = SH * 0.54;

  // ── LIST VIEW ──────────────────────────────────────────────────────────────
  if (viewMode === 'list') {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
        <StatusBar barStyle="dark-content" />
        <View style={{ paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity
            onPress={() => setViewMode('map')}
            style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="ArrowLeft" size={17} color="#6D4C41" />
          </TouchableOpacity>
          <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: '#2C1810' }}>
            {t('map.nearby', 'À proximité')}
          </Text>
          <TouchableOpacity
            onPress={() => setViewMode('map')}
            style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#FEF0E8', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="MapPin" size={17} color="#E8591A" />
          </TouchableOpacity>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8', gap: 10 }}>
          <View style={{ height: 44, borderRadius: 12, borderWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#F5F0EB', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 }}>
            <Icon name="Search" size={16} color="#8C8278" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={t('map.searchPlaceholder', 'Restaurant, plat...')}
              placeholderTextColor="#8C8278"
              style={{ flex: 1, fontSize: 14, color: '#2C1810' }}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Icon name="X" size={15} color="#8C8278" />
              </TouchableOpacity>
            )}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
            {FILTERS.map((f, i) => (
              <TouchableOpacity
                key={f.key}
                onPress={() => setActiveFilter(i)}
                style={{ height: 32, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, backgroundColor: i === activeFilter ? '#E8591A' : '#fff', borderColor: i === activeFilter ? '#E8591A' : '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: i === activeFilter ? '#fff' : '#6D4C41' }}>{f.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 14, paddingBottom: 4 }}>
          <Text style={{ fontSize: 13, color: '#8C8278' }}>
            <Text style={{ fontWeight: '700', color: '#2C1810' }}>{filtered.length}</Text>{' '}
            {t('map.results', 'résultats')} · Douala
          </Text>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {filtered.map((r) => (
            <TouchableOpacity
              key={r.id}
              onPress={() => navigation.navigate('Restaurant')}
              style={{ backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E5E0D8', flexDirection: 'row', overflow: 'hidden', ...SHADOW_SM }}
              activeOpacity={0.85}
            >
              <View style={{ width: 100, backgroundColor: '#F5F0EB', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {r.kflVerified && (
                  <View style={{ position: 'absolute', top: 6, left: 6, backgroundColor: '#E8591A', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                    <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700', fontFamily: 'JetBrainsMono-Regular' }}>KFL ✓</Text>
                  </View>
                )}
                <Icon name="ChefHat" size={32} color="rgba(140,130,120,0.4)" />
              </View>
              <View style={{ flex: 1, padding: 14 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#2C1810', marginBottom: 2, fontFamily: 'Inter-Bold' }}>{r.name}</Text>
                <Text style={{ fontSize: 12, color: '#8C8278', marginBottom: 8 }}>{r.type}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 }}>
                  <View style={{ width: 7, height: 7, borderRadius: 3.5, backgroundColor: r.open ? '#2E7D32' : '#C62828' }} />
                  <Text style={{ fontSize: 11, color: r.open ? '#2E7D32' : '#C62828', fontWeight: '600' }}>
                    {r.open ? `Ouvert · ${r.hours}` : 'Fermé'}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <Icon name="MapPin" size={11} color="#8C8278" />
                    <Text style={{ fontSize: 11, color: '#8C8278' }}>{r.dist}</Text>
                  </View>
                  <Text style={{ fontSize: 11, color: '#F9A825', fontWeight: '700' }}>★ {r.rating}</Text>
                  <Text style={{ fontSize: 11, color: '#8C8278' }}>({r.reviews})</Text>
                  <Text style={{ fontSize: 11, color: '#6D4C41' }}>{r.price}</Text>
                </View>
              </View>
              <View style={{ paddingRight: 14, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="ChevronRight" size={18} color="#8C8278" />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── MAP VIEW ───────────────────────────────────────────────────────────────
  return (
    <View style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* Map canvas */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: MAP_H, backgroundColor: '#DDE3F0', overflow: 'hidden' }}>
        {[20, 40, 60, 80].map(p => (
          <View key={`h${p}`} style={{ position: 'absolute', left: 0, right: 0, top: `${p}%`, height: 1, backgroundColor: 'rgba(255,255,255,0.55)' }} />
        ))}
        {[20, 40, 60, 80].map(p => (
          <View key={`v${p}`} style={{ position: 'absolute', top: 0, bottom: 0, left: `${p}%`, width: 1, backgroundColor: 'rgba(255,255,255,0.55)' }} />
        ))}
        {/* Roads */}
        <View style={{ position: 'absolute', top: '38%', left: 0, right: 0, height: 14, backgroundColor: 'rgba(255,255,255,0.8)' }} />
        <View style={{ position: 'absolute', top: 0, bottom: 0, left: '52%', width: 14, backgroundColor: 'rgba(255,255,255,0.8)' }} />
        <View style={{ position: 'absolute', top: '65%', left: 0, right: 0, height: 8, backgroundColor: 'rgba(255,255,255,0.65)' }} />
        {/* Park */}
        <View style={{ position: 'absolute', top: '15%', left: '10%', width: 90, height: 70, backgroundColor: 'rgba(46,125,50,0.18)', borderRadius: 10 }} />
        {/* Blocks */}
        <View style={{ position: 'absolute', top: '43%', left: '57%', width: 70, height: 40, backgroundColor: 'rgba(200,195,185,0.35)', borderRadius: 4 }} />
        <View style={{ position: 'absolute', top: '43%', left: '14%', width: 55, height: 40, backgroundColor: 'rgba(200,195,185,0.35)', borderRadius: 4 }} />

        {/* Restaurant pins */}
        {filtered.map(r => (
          <TouchableOpacity
            key={r.id}
            onPress={() => navigation.navigate('Restaurant')}
            style={{ position: 'absolute', left: SW * r.px - 30, top: MAP_H * r.py - 18 }}
            activeOpacity={0.8}
          >
            <View style={{
              backgroundColor: r.kflVerified ? '#E8591A' : '#fff',
              borderWidth: r.kflVerified ? 0 : 1.5, borderColor: '#E5E0D8',
              paddingHorizontal: 10, paddingVertical: 5, borderRadius: 14,
              flexDirection: 'row', alignItems: 'center', gap: 4,
              ...SHADOW_MD,
            }}>
              <Text style={{ fontSize: 12, fontWeight: '700', color: r.kflVerified ? '#fff' : '#2C1810', fontFamily: 'Inter-Bold' }}>
                ★ {r.rating}
              </Text>
            </View>
            <View style={{ width: 8, height: 8, backgroundColor: r.kflVerified ? '#E8591A' : '#8C8278', borderRadius: 4, alignSelf: 'center', marginTop: -3 }} />
          </TouchableOpacity>
        ))}

        {/* User dot */}
        <View style={{ position: 'absolute', left: SW * 0.5 - 24, top: MAP_H * 0.5 - 24, width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(26,35,126,0.12)' }} />
        <View style={{ position: 'absolute', left: SW * 0.5 - 8, top: MAP_H * 0.5 - 8, width: 16, height: 16, borderRadius: 8, backgroundColor: '#1A237E', borderWidth: 2.5, borderColor: '#fff', ...SHADOW_MD }} />
      </View>

      {/* Search overlay */}
      <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 10, gap: 8 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, paddingHorizontal: 14, gap: 10, ...SHADOW_MD, height: 52 }}>
            <Icon name="MapPin" size={18} color="#E8591A" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder={t('map.searchPlaceholder', 'Restaurant, plat...')}
              placeholderTextColor="#8C8278"
              style={{ flex: 1, fontSize: 14, color: '#2C1810' }}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Icon name="X" size={15} color="#8C8278" />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => setViewMode('list')}
              style={{ width: 34, height: 34, borderRadius: 9, backgroundColor: '#F5F0EB', alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="Grid" size={16} color="#6D4C41" />
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 2 }}>
            {FILTERS.map((f, i) => (
              <TouchableOpacity
                key={f.key}
                onPress={() => setActiveFilter(i)}
                style={{ height: 34, paddingHorizontal: 16, borderRadius: 17, borderWidth: 1, backgroundColor: i === activeFilter ? '#E8591A' : '#fff', borderColor: i === activeFilter ? '#E8591A' : '#E5E0D8', alignItems: 'center', justifyContent: 'center', ...SHADOW_SM }}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', color: i === activeFilter ? '#fff' : '#6D4C41' }}>{f.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>

      {/* Bottom sheet */}
      <View style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, top: MAP_H - 22,
        backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
        ...SHADOW_LG,
      }}>
        <View style={{ alignItems: 'center', paddingTop: 10, paddingBottom: 2 }}>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#E5E0D8' }} />
        </View>

        <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 6, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 17, color: '#2C1810' }}>
              {t('map.nearby', 'À proximité')}
            </Text>
            <Text style={{ fontSize: 12, color: '#8C8278', marginTop: 1 }}>
              {filtered.length} {t('map.results', 'résultats')} · Douala
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setViewMode('list')}
            style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 14, borderWidth: 1, borderColor: '#E5E0D8', flexDirection: 'row', alignItems: 'center', gap: 6 }}
          >
            <Icon name="Grid" size={14} color="#6D4C41" />
            <Text style={{ fontSize: 12, color: '#6D4C41', fontWeight: '600' }}>Liste</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 20, paddingBottom: 90, paddingTop: 4 }}>
          {filtered.map((r) => (
            <TouchableOpacity
              key={r.id}
              onPress={() => navigation.navigate('Restaurant')}
              style={{ width: 190, backgroundColor: '#fff', borderRadius: 16, borderWidth: 1, borderColor: '#E5E0D8', overflow: 'hidden', ...SHADOW_SM }}
              activeOpacity={0.85}
            >
              <View style={{ height: 94, backgroundColor: '#F5F0EB', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {r.kflVerified && (
                  <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: '#E8591A', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                    <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700', fontFamily: 'JetBrainsMono-Regular' }}>KFL ✓</Text>
                  </View>
                )}
                <Icon name="ChefHat" size={34} color="rgba(140,130,120,0.35)" />
              </View>
              <View style={{ padding: 12 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#2C1810', marginBottom: 2, fontFamily: 'Inter-Bold' }} numberOfLines={1}>{r.name}</Text>
                <Text style={{ fontSize: 11, color: '#8C8278', marginBottom: 6 }} numberOfLines={1}>{r.type}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: r.open ? '#2E7D32' : '#C62828' }} />
                    <Text style={{ fontSize: 10, color: r.open ? '#2E7D32' : '#C62828', fontWeight: '600' }}>
                      {r.open ? 'Ouvert' : 'Fermé'}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 10, color: '#8C8278' }}>· {r.dist}</Text>
                  <Text style={{ fontSize: 10, color: '#F9A825', fontWeight: '700' }}>★ {r.rating}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
