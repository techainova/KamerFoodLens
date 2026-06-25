import React, { useState } from 'react';
import {
  View, TextInput, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SUGGESTED = [
  'Feuilles de ndolé', "Pâte d'arachide", 'Poisson fumé', 'Plantains', 'Huile de palme',
  'Oignons', "Gousses d'ail", 'Crevettes séchées', 'Gingembre', 'Piment', 'Manioc',
];

const FILTER_KEYS = ['all', 'under30', 'vegetarian', 'spicy', 'simple', 'cameroonian', 'glutenFree'] as const;

const RESULTS = [
  { name: 'Ndolé traditionnel', match: 97, missing: [],                  region: 'Littoral' },
  { name: 'Mbongo tchobi',      match: 72, missing: ['Écorces fraîches'], region: 'Littoral' },
  { name: 'Sauce arachide',     match: 68, missing: ['Tomates'],          region: 'Centre'   },
  { name: 'Eru aux crevettes',  match: 64, missing: ['Waterleaf'],        region: 'Sud-Ouest'},
];

export default function SearchByIngredients() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState(0);
  const [selected, setSelected] = useState<string[]>(['Feuilles de ndolé', "Pâte d'arachide", 'Poisson fumé']);

  const toggle = (ing: string) => {
    setSelected(prev => prev.includes(ing) ? prev.filter(i => i !== ing) : [...prev, ing]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('searchByIngredients.title')}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* My ingredients */}
        <Text style={{ fontSize: 11, fontWeight: '700', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>
          {t('searchByIngredients.myIngredients')} ({selected.length})
        </Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
          {selected.map(ing => (
            <TouchableOpacity key={ing} onPress={() => toggle(ing)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 32, paddingLeft: 12, paddingRight: 6, borderRadius: 16, backgroundColor: C.primary }}>
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '500' }}>{ing}</Text>
              <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="X" size={10} color="#fff" />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Search input */}
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 48, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 16, paddingHorizontal: 14, gap: 10, marginBottom: 16 }}>
          <Icon name="Search" size={16} color={C.inkMute} />
          <TextInput value={search} onChangeText={setSearch} placeholder={t('searchByIngredients.placeholder')} placeholderTextColor={C.inkMute} style={{ flex: 1, fontSize: 14, color: C.ink }} />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => { if (search.trim()) { toggle(search.trim()); setSearch(''); } }}
              style={{ height: 28, paddingHorizontal: 12, backgroundColor: C.primary, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '600' }}>{t('searchByIngredients.add')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Suggested ingredients */}
        <Text style={{ fontSize: 11, fontWeight: '700', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>{t('searchByIngredients.commonIngredients')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
          {SUGGESTED.filter(i => !selected.includes(i)).map(ing => (
            <TouchableOpacity key={ing} onPress={() => toggle(ing)}
              style={{ height: 32, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 12, color: C.inkSoft }}>+ {ing}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick filters */}
        <Text style={{ fontSize: 11, fontWeight: '700', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 8 }}>{t('searchByIngredients.quickFilters')}</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, marginBottom: 16 }}>
          {FILTER_KEYS.map((key, i) => (
            <TouchableOpacity
              key={key}
              onPress={() => setActiveFilter(i)}
              style={{ height: 32, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: i === activeFilter ? C.primary : C.surface, borderColor: i === activeFilter ? C.primary : C.border }}
            >
              <Text style={{ fontSize: 12, fontWeight: '600', color: i === activeFilter ? '#fff' : C.inkSoft }}>{t(`searchByIngredients.filter${key}`)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Results */}
        {selected.length >= 2 && (
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink }}>{t('searchByIngredients.compatibleRecipes')}</Text>
              <Text style={{ fontSize: 12, color: C.inkMute }}>{RESULTS.length} {t('searchByIngredients.results')}</Text>
            </View>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
              {RESULTS.map((r, i) => (
                <TouchableOpacity key={i} onPress={() => navigation.navigate('RecipeV1')} style={{ width: '47%' }}>
                  <View style={{ height: 100, borderRadius: 12, backgroundColor: C.surface2, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="ChefHat" size={26} color={C.inkMute} />
                  </View>
                  <View style={{ paddingTop: 6 }}>
                    <Text style={{ fontWeight: '600', fontSize: 12, lineHeight: 16, color: C.ink }} numberOfLines={2}>{r.name}</Text>
                    <Text style={{ fontSize: 10, color: C.inkMute }}>{r.region}</Text>
                    <View style={{ marginTop: 4 }}>
                      <View style={{ alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8, backgroundColor: r.match >= 90 ? C.successSoft : C.surface2 }}>
                        <Text style={{ fontSize: 9, fontWeight: '700', color: r.match >= 90 ? C.success : C.inkSoft }}>{r.match}% {t('searchByIngredients.matchAbbrev')}</Text>
                      </View>
                    </View>
                    {r.missing.length > 0 && (
                      <Text style={{ fontSize: 9, color: C.primary, marginTop: 4, fontStyle: 'italic' }}>{t('searchByIngredients.missing')}: {r.missing.join(', ')}</Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
