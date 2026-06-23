import React, { useMemo, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Image, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { RECIPES, DIFF_LABELS, type Recipe } from '@/data/recipes';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };
const REGIONS = ['Tout', 'Littoral', 'Centre', 'Sud', 'Sud-Ouest', 'Ouest', 'Nord-Ouest'];

const DIFF_COLOR: Record<Recipe['diff'], string> = { easy: '#2E7D32', medium: '#F9A825', hard: '#C62828' };

export default function AllRecipes() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [region, setRegion] = useState('Tout');

  const filtered = useMemo(() => {
    return RECIPES.filter((r) => {
      const matchesRegion = region === 'Tout' || r.region === region;
      const matchesQuery = r.name.toLowerCase().includes(query.trim().toLowerCase());
      return matchesRegion && matchesQuery;
    });
  }, [query, region]);

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
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 4, gap: 8 }}>
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
              onPress={() => navigation.navigate('RecipeV1')}
              style={{ flexDirection: 'row', gap: 12, backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}
              activeOpacity={0.85}
            >
              {r.image ? (
                <Image source={r.image} style={{ width: 96, height: 96, flexShrink: 0 }} resizeMode="cover" />
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
                  <Text style={{ color: C.inkMute, fontSize: 11 }}>{r.time}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 }}>
                  <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, backgroundColor: DIFF_COLOR[r.diff] + '20' }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: DIFF_COLOR[r.diff] }}>{DIFF_LABELS[r.diff]}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                    <Icon name="Flame" size={11} color={C.primary} />
                    <Text style={{ color: C.inkMute, fontSize: 11 }}>{r.scans}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
