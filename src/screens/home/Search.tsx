import React, { useEffect, useState, useMemo } from 'react';
import {
  View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useSearchStore } from '@/store/search.store';
import type { SearchResult } from '@/store/search.store';
import { useRestaurantStore } from '@/store/restaurant.store';

const TABS = ['Plats', 'Restaurants', 'Tous'];

export default function Search() {
  const C = useColors();
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const [query, setQuery] = useState('');
  const [activeTab, setActiveTab] = useState(2);

  const { history, addToHistory, removeFromHistory, search } = useSearchStore();
  const ensureLoaded = useRestaurantStore((s) => s.ensureLoaded);
  const restaurantsLoading = useRestaurantStore((s) => s.isLoading);
  const restaurantsCount = useRestaurantStore((s) => s.restaurants.length);

  useEffect(() => {
    ensureLoaded();
  }, [ensureLoaded]);

  const results: SearchResult[] = useMemo(() => {
    if (!query.trim()) return [];
    return search(query);
  }, [query]);

  const filtered = results.filter(r => {
    if (activeTab === 0) return r.type === 'dish';
    if (activeTab === 1) return r.type === 'restaurant';
    return true;
  });

  const handleSubmit = () => {
    if (query.trim()) addToHistory(query.trim());
  };

  const handleHistoryItem = (q: string) => {
    setQuery(q);
    addToHistory(q);
  };

  const TYPE_ICONS: Record<string, string> = {
    restaurant: 'Store',
    dish:       'ChefHat',
    post:       'FileText',
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>

      {/* Search bar */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 12, flexDirection: 'row', gap: 10, alignItems: 'center', backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity
          style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => nav.goBack()}
        >
          <Icon name="ArrowLeft" size={17} color="#6D4C41" />
        </TouchableOpacity>

        <View style={{ flex: 1, height: 44, backgroundColor: C.surface, borderWidth: 1, borderColor: query.length > 0 ? '#E8591A' : C.border, borderRadius: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 }}>
          <Icon name="Search" size={16} color="#8C8278" />
          <TextInput
            style={{ flex: 1, fontSize: 13, color: C.ink, fontFamily: 'Inter-Regular' }}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSubmit}
            placeholder={t('home.search')}
            placeholderTextColor="#8C8278"
            autoFocus
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')} style={{ padding: 2 }}>
              <Icon name="X" size={14} color="#8C8278" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="Mic" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        {['Plats', 'Restaurants', 'Tous'].map((tab, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setActiveTab(i)}
            style={{ flex: 1, paddingVertical: 13, alignItems: 'center', borderBottomWidth: 2, borderColor: i === activeTab ? '#E8591A' : 'transparent' }}
          >
            <Text style={{ fontSize: 12, fontWeight: i === activeTab ? '700' : '500', color: i === activeTab ? '#E8591A' : '#8C8278', fontFamily: i === activeTab ? 'Inter-Bold' : 'Inter-Regular' }}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Empty query → show history */}
        {!query.trim() && (
          <>
            {history.length > 0 && (
              <>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ flex: 1, fontSize: 13, fontWeight: '600', color: C.inkSoft, textTransform: 'uppercase', letterSpacing: 0.5 }}>Recherches récentes</Text>
                  <TouchableOpacity onPress={() => useSearchStore.getState().clearHistory()}>
                    <Text style={{ fontSize: 12, color: '#E8591A' }}>Tout effacer</Text>
                  </TouchableOpacity>
                </View>
                {history.map((q, i) => (
                  <TouchableOpacity key={i} onPress={() => handleHistoryItem(q)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderColor: C.border }}>
                    <Icon name="Clock" size={15} color="#8C8278" />
                    <Text style={{ flex: 1, fontSize: 14, color: C.ink }}>{q}</Text>
                    <TouchableOpacity onPress={() => removeFromHistory(q)} style={{ padding: 4 }}>
                      <Icon name="X" size={13} color="#8C8278" />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </>
            )}
            {history.length === 0 && (
              <View style={{ alignItems: 'center', paddingTop: 60 }}>
                <Icon name="Search" size={48} color="rgba(140,130,120,0.3)" />
                <Text style={{ fontSize: 15, color: C.inkMute, marginTop: 12 }}>Recherchez un plat ou restaurant</Text>
              </View>
            )}
          </>
        )}

        {/* Results */}
        {query.trim().length > 0 && (
          <>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 14 }}>
              <Text style={{ fontSize: 13, color: C.ink, fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>{filtered.length}</Text>
              <Text style={{ fontSize: 12, color: C.inkMute }}>{t('search.results')}</Text>
              <Text style={{ fontSize: 12, color: C.inkMute }}>pour « {query} »</Text>
            </View>

            {restaurantsLoading && restaurantsCount === 0 && (
              <View style={{ alignItems: 'center', paddingTop: 40 }}>
                <ActivityIndicator color="#E8591A" />
              </View>
            )}

            {!restaurantsLoading && filtered.length === 0 && (
              <View style={{ alignItems: 'center', paddingTop: 40 }}>
                <Icon name="SearchX" size={40} color="rgba(140,130,120,0.3)" />
                <Text style={{ fontSize: 15, color: C.inkMute, marginTop: 12 }}>Aucun résultat</Text>
              </View>
            )}

            <View style={{ gap: 8 }}>
              {filtered.map((r) => (
                <TouchableOpacity key={r.id} onPress={() => {
                  addToHistory(query.trim());
                  if (r.type === 'restaurant') nav.navigate('OrderMenu', { restaurantId: r.id });
                }} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border }}>
                  <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: r.type === 'restaurant' ? '#E8591A15' : '#2E7D3215', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={TYPE_ICONS[r.type] as any} size={20} color={r.type === 'restaurant' ? '#E8591A' : '#2E7D32'} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{r.title}</Text>
                    <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 1 }}>{r.subtitle}</Text>
                  </View>
                  {r.meta && (
                    <Text style={{ fontSize: 12, fontWeight: '600', color: C.inkSoft }}>{r.meta}</Text>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
