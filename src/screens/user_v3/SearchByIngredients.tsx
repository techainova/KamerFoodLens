import React, { useEffect, useMemo, useState } from 'react';
import {
  View, TextInput, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { recipesService, type Recipe } from '@/services/recipes.service';

const SUGGESTED = [
  'Feuilles de ndolé', "Pâte d'arachide", 'Poisson fumé', 'Plantains', 'Huile de palme',
  'Oignons', "Gousses d'ail", 'Crevettes séchées', 'Gingembre', 'Piment', 'Manioc',
];

const FILTER_KEYS = ['all', 'under30', 'vegetarian', 'spicy', 'simple', 'cameroonian', 'glutenFree'] as const;

interface RecipeMatch {
  recipe: Recipe;
  matchPct: number;
  missing: string[];
}

function normalize(s: string): string {
  return s.trim().toLowerCase();
}

function computeMatch(recipe: Recipe, selected: string[]): RecipeMatch {
  const normalizedSelected = selected.map(normalize);
  const matched = recipe.ingredients.filter((ing) =>
    normalizedSelected.some((sel) => normalize(ing.name).includes(sel) || sel.includes(normalize(ing.name))),
  );
  const missing = recipe.ingredients.filter((ing) => !matched.includes(ing)).map((ing) => ing.name);
  const matchPct = recipe.ingredients.length > 0 ? Math.round((matched.length / recipe.ingredients.length) * 100) : 0;
  return { recipe, matchPct, missing };
}

export default function SearchByIngredients() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState(0);
  const [selected, setSelected] = useState<string[]>(['Feuilles de ndolé', "Pâte d'arachide", 'Poisson fumé']);
  const [results, setResults] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);

  const toggle = (ing: string) => {
    setSelected(prev => prev.includes(ing) ? prev.filter(i => i !== ing) : [...prev, ing]);
  };

  useEffect(() => {
    if (selected.length < 2) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    recipesService.searchByIngredients(selected)
      .then((r) => { if (!cancelled) setResults(r); })
      .catch(() => { if (!cancelled) setResults([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [selected]);

  const matches = useMemo(() => results.map((r) => computeMatch(r, selected)).sort((a, b) => b.matchPct - a.matchPct), [results, selected]);

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
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 6, marginBottom: 16, alignItems: 'center' }}>
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
              {!loading && <Text style={{ fontSize: 12, color: C.inkMute }}>{matches.length} {t('searchByIngredients.results')}</Text>}
            </View>
            {loading ? (
              <ActivityIndicator color={C.primary} style={{ marginTop: 20 }} />
            ) : matches.length === 0 ? (
              <Text style={{ fontSize: 13, color: C.inkMute, textAlign: 'center', paddingVertical: 20 }}>{t('searchByIngredients.noResults', 'Aucune recette trouvée avec ces ingrédients.')}</Text>
            ) : (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
                {matches.map((m) => (
                  <TouchableOpacity key={m.recipe.id} onPress={() => navigation.navigate('RecipeV1', { dishId: m.recipe.id })} style={{ width: '47%' }}>
                    <View style={{ height: 100, borderRadius: 12, backgroundColor: C.surface2, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="ChefHat" size={26} color={C.inkMute} />
                    </View>
                    <View style={{ paddingTop: 6 }}>
                      <Text style={{ fontWeight: '600', fontSize: 12, lineHeight: 16, color: C.ink }} numberOfLines={2}>{m.recipe.name}</Text>
                      <Text style={{ fontSize: 10, color: C.inkMute }}>{m.recipe.region}</Text>
                      <View style={{ marginTop: 4 }}>
                        <View style={{ alignSelf: 'flex-start', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8, backgroundColor: m.matchPct >= 90 ? C.successSoft : C.surface2 }}>
                          <Text style={{ fontSize: 9, fontWeight: '700', color: m.matchPct >= 90 ? C.success : C.inkSoft }}>{m.matchPct}% {t('searchByIngredients.matchAbbrev')}</Text>
                        </View>
                      </View>
                      {m.missing.length > 0 && (
                        <Text style={{ fontSize: 9, color: C.primary, marginTop: 4, fontStyle: 'italic' }} numberOfLines={1}>{t('searchByIngredients.missing')}: {m.missing.join(', ')}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
