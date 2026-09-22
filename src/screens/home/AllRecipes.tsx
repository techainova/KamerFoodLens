import React, { useEffect, useMemo, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, TextInput, Image, StatusBar, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { recipesService, type Recipe } from '@/services/recipes.service';
import { SHADOW_SM } from '@/constants/theme';

const REGIONS = ['Tout', 'Littoral', 'Centre', 'Sud', 'Sud-Ouest', 'Ouest', 'Nord-Ouest'];

const DIFF_COLOR: Record<Recipe['difficulty'], string> = { easy: '#2E7D32', medium: '#F9A825', hard: '#C62828' };
const DIFF_LABELS: Record<Recipe['difficulty'], string> = { easy: 'Facile', medium: 'Moyen', hard: 'Difficile' };

export default function AllRecipes() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('Tout');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void recipesService.getPopular().then(setRecipes).catch(() => setRecipes([])).finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    return recipes.filter((r) => {
      const matchesRegion = region === 'Tout' || r.region === region;
      const matchesQuery = r.name.toLowerCase().includes(query.trim().toLowerCase());
      return matchesRegion && matchesQuery;
    });
  }, [recipes, query, region]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('home.popularRecipes')}</Text>
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 12 }}>
        <View style={{ height: 44, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 14, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, gap: 8 }}>
          <Icon name="Search" size={15} color={C.inkMute} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('home.search')}
            placeholderTextColor={C.inkMute}
            style={{ flex: 1, fontSize: 14, color: C.ink }}
          />
        </View>
      </View>

      <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.6, paddingHorizontal: 16, marginTop: 14, marginBottom: 8 }}>
        {t('home.filterByRegion')}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 4, gap: 8, alignItems: 'center' }}>
        {REGIONS.map((r) => {
          const active = r === region;
          return (
            <TouchableOpacity
              key={r}
              onPress={() => setRegion(r)}
              activeOpacity={0.8}
              style={{
                height: 36,
                paddingHorizontal: 16,
                borderRadius: 18,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: active ? C.primary : C.surface,
                borderWidth: 1.5,
                borderColor: active ? C.primary : C.border,
                ...(active ? SHADOW_SM : {}),
              }}
            >
              <Text style={{ fontSize: 12.5, fontWeight: active ? '700' : '500', color: active ? '#fff' : C.inkSoft }}>
                {r}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={{ height: 1, backgroundColor: C.border, marginTop: 12 }} />

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.primary} size="large" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, paddingTop: 4, gap: 12 }} showsVerticalScrollIndicator={false}>
          {filtered.length === 0 ? (
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
              <Icon name="Search" size={36} color={C.inkMute} />
              <Text style={{ color: C.inkMute, marginTop: 10 }}>{t('home.noResults')}</Text>
            </View>
          ) : (
            filtered.map((r) => (
              <TouchableOpacity
                key={r.id}
                onPress={() => navigation.navigate('RecipeV1', { dishId: r.id })}
                style={{ flexDirection: 'row', gap: 12, backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}
                activeOpacity={0.85}
              >
                {r.imageUrl ? (
                  <Image source={{ uri: r.imageUrl }} style={{ width: 96, height: 96, flexShrink: 0 }} resizeMode="cover" />
                ) : (
                  <View style={{ width: 96, height: 96, flexShrink: 0, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="ChefHat" size={28} color={C.inkMute} />
                  </View>
                )}
                <View style={{ flex: 1, paddingVertical: 10, paddingRight: 12, justifyContent: 'center' }}>
                  <Text style={{ color: C.ink, fontSize: 14, fontWeight: '700', fontFamily: 'Inter-Bold' }}>{r.name}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    <Icon name="MapPin" size={11} color={C.inkMute} />
                    <Text style={{ color: C.inkMute, fontSize: 11 }}>{r.region}</Text>
                    <Text style={{ color: C.border, fontSize: 11 }}> · </Text>
                    <Icon name="Clock" size={11} color={C.inkMute} />
                    <Text style={{ color: C.inkMute, fontSize: 11 }}>{r.duration}min</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
                    <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, backgroundColor: DIFF_COLOR[r.difficulty] + '20' }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: DIFF_COLOR[r.difficulty] }}>{DIFF_LABELS[r.difficulty]}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <Icon name="Star" size={11} color={C.gold} fill={C.gold} />
                      <Text style={{ color: C.inkMute, fontSize: 11 }}>{r.rating.toFixed(1)} ({r.ratingCount})</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
