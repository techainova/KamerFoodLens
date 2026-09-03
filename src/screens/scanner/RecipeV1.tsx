import React, { useEffect, useMemo, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, Image, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { recipesService, type Recipe } from '@/services/recipes.service';
import { useFavoritesStore } from '@/store/favorites.store';
import { useAccessibilityStore } from '@/store/accessibility.store';

const TAB_KEYS = ['ingredients', 'steps', 'nutrition', 'reviews'] as const;
type TabKey = typeof TAB_KEYS[number];

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export default function RecipeV1() {
  const C = useColors();
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const dishId: string | undefined = route.params?.dishId;

  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('ingredients');
  const [portions, setPortions] = useState(4);
  const [checked, setChecked] = useState<Set<number>>(new Set());

  const isSaved = useFavoritesStore((s) => s.isSaved);
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const fetchFavorites = useFavoritesStore((s) => s.fetchAll);
  const ttsEnabled = useAccessibilityStore((s) => s.ttsEnabled);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => { void Speech.stop(); };
  }, []);

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      void Speech.stop();
      setIsSpeaking(false);
      return;
    }
    if (!recipe) return;
    const stepsText = recipe.steps
      .map((step, i) => `${t('recipe.stepN', { n: i + 1, defaultValue: 'Étape {{n}}' })}. ${step.description}`)
      .join('. ');
    const fullText = [recipe.name, recipe.description, stepsText].filter(Boolean).join('. ');
    Speech.speak(fullText, { language: 'fr-FR', onDone: () => setIsSpeaking(false), onStopped: () => setIsSpeaking(false) });
    setIsSpeaking(true);
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!dishId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const detail = await recipesService.getDetail(dishId);
        if (!cancelled) {
          setRecipe(detail);
          setPortions(detail.servings);
        }
      } catch {
        if (!cancelled) setRecipe(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    void fetchFavorites();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dishId]);

  const bookmarked = recipe ? isSaved(recipe.id) : false;

  const toggleCheck = (i: number) => {
    const next = new Set(checked);
    if (next.has(i)) next.delete(i); else next.add(i);
    setChecked(next);
  };

  const TAB_LABELS: Record<TabKey, string> = {
    ingredients: t('recipe.ingredients'),
    steps:       t('recipe.steps'),
    nutrition:   t('recipe.nutrition'),
    reviews:     t('recipe.reviews'),
  };

  const ratingRounded = useMemo(() => (recipe ? Math.round(recipe.rating) : 0), [recipe]);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
        <StatusBar barStyle={C.statusBar} />
        <ActivityIndicator color="#E8591A" />
      </SafeAreaView>
    );
  }

  if (!recipe) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
        <StatusBar barStyle={C.statusBar} />
        <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
          <TouchableOpacity
            style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}
            onPress={() => nav.goBack()}
          >
            <Icon name="ArrowLeft" size={17} color="#6D4C41" />
          </TouchableOpacity>
          <Text style={{ flex: 1, fontSize: 16, fontWeight: '700', color: C.ink, fontFamily: 'Inter-Bold' }}>
            {t('recipe.title')}
          </Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Icon name="ChefHat" size={48} color={C.inkMute} />
          <Text style={{ fontSize: 16, fontWeight: '700', color: C.ink, marginTop: 16 }}>{t('recipe.notFound')}</Text>
          <Text style={{ fontSize: 13, color: C.inkSoft, marginTop: 8, textAlign: 'center' }}>{t('recipe.notFoundDesc')}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 12, borderBottomWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        <TouchableOpacity
          style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => nav.goBack()}
        >
          <Icon name="ArrowLeft" size={17} color="#6D4C41" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 16, fontWeight: '700', color: C.ink, fontFamily: 'Inter-Bold' }} numberOfLines={1}>
          {t('recipe.title')}
        </Text>
        {ttsEnabled && (
          <TouchableOpacity
            onPress={handleToggleSpeech}
            style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: isSpeaking ? '#E8591A' : C.border, backgroundColor: isSpeaking ? '#FEF0E8' : C.surface, alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="Volume2" size={16} color={isSpeaking ? '#E8591A' : '#6D4C41'} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={() => void toggleFavorite('recipe', recipe.id)}
          style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: bookmarked ? '#E8591A' : C.border, backgroundColor: bookmarked ? '#FEF0E8' : C.surface, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="Bookmark" size={16} color={bookmarked ? '#E8591A' : '#6D4C41'} fill={bookmarked ? '#E8591A' : 'none'} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={{ margin: 16, borderRadius: 16, overflow: 'hidden' }}>
          <View style={{ height: 200, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
            {recipe.imageUrl ? (
              <Image source={{ uri: recipe.imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            ) : (
              <Icon name="ChefHat" size={50} color="#E5E0D8" />
            )}
          </View>
        </View>

        {/* Title + Meta */}
        <View style={{ paddingHorizontal: 16, marginBottom: 4 }}>
          <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 26, color: C.ink, lineHeight: 30 }}>
            {recipe.name}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="Clock" size={13} color="#8C8278" />
              <Text style={{ color: C.inkMute, fontSize: 12 }}>{formatDuration(recipe.duration)}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="BarChart2" size={13} color="#8C8278" />
              <Text style={{ color: C.inkMute, fontSize: 12 }}>{t(`recipe.${recipe.difficulty}`)}</Text>
            </View>
            {recipe.ratingCount > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Icon key={s} name="Star" size={12} color="#F9A825" fill={s <= ratingRounded ? '#F9A825' : 'none'} />
                ))}
                <Text style={{ color: C.inkMute, fontSize: 12, marginLeft: 4 }}>({recipe.ratingCount})</Text>
              </View>
            )}
            {!!recipe.region && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="MapPin" size={13} color="#8C8278" />
                <Text style={{ color: C.inkMute, fontSize: 12 }}>{recipe.region}</Text>
              </View>
            )}
          </View>
          {!!recipe.description && (
            <Text style={{ fontSize: 13, color: C.inkSoft, lineHeight: 20, marginTop: 12 }}>{recipe.description}</Text>
          )}
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: C.border, backgroundColor: C.surface, marginTop: 12 }}>
          {TAB_KEYS.map((key) => (
            <TouchableOpacity
              key={key}
              onPress={() => setActiveTab(key)}
              style={{ flex: 1, paddingVertical: 13, alignItems: 'center', borderBottomWidth: 2, borderColor: activeTab === key ? '#E8591A' : 'transparent' }}
            >
              <Text style={{ fontSize: 12, fontWeight: activeTab === key ? '700' : '500', color: activeTab === key ? '#E8591A' : '#8C8278' }}>
                {TAB_LABELS[key]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>

          {/* ── INGRÉDIENTS ── */}
          {activeTab === 'ingredients' && (
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, paddingBottom: 16, borderBottomWidth: 1, borderColor: C.border }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink, fontFamily: 'Inter-SemiBold' }}>
                  {t('recipe.servings')}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.border, borderRadius: 24, overflow: 'hidden' }}>
                  <TouchableOpacity
                    onPress={() => setPortions(Math.max(1, portions - 1))}
                    style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text style={{ color: '#E8591A', fontWeight: '700', fontSize: 20 }}>−</Text>
                  </TouchableOpacity>
                  <View style={{ width: 44, height: 38, borderLeftWidth: 1, borderRightWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: C.ink, fontWeight: '700', fontSize: 15 }}>{portions}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setPortions(portions + 1)}
                    style={{ width: 38, height: 38, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text style={{ color: '#E8591A', fontWeight: '700', fontSize: 20 }}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {recipe.ingredients.length === 0 ? (
                <Text style={{ fontSize: 13, color: C.inkMute, textAlign: 'center', paddingVertical: 24 }}>{t('recipe.notFoundDesc')}</Text>
              ) : (
                <View style={{ gap: 2 }}>
                  {recipe.ingredients.map((item, i) => {
                    const isChecked = checked.has(i);
                    return (
                      <TouchableOpacity
                        key={item.id}
                        onPress={() => toggleCheck(i)}
                        style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderBottomWidth: 1, borderColor: C.border }}
                        activeOpacity={0.7}
                      >
                        <View style={{ width: 24, height: 24, borderRadius: 6, alignItems: 'center', justifyContent: 'center', backgroundColor: isChecked ? '#2E7D32' : 'transparent', borderWidth: isChecked ? 0 : 1.5, borderColor: C.border, flexShrink: 0 }}>
                          {isChecked && <Icon name="Check" size={14} color="#fff" strokeWidth={2.5} />}
                        </View>
                        <Text style={{ width: 60, fontSize: 13, fontWeight: '700', color: '#E8591A' }}>{item.quantity}{item.unit ? ` ${item.unit}` : ''}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={{ fontSize: 14, color: isChecked ? '#8C8278' : '#2C1810', textDecorationLine: isChecked ? 'line-through' : 'none' }}>
                            {item.name}
                          </Text>
                          {!!item.nameEN && <Text style={{ fontSize: 11, color: C.inkMute, fontStyle: 'italic' }}>{item.nameEN}</Text>}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </>
          )}

          {/* ── ÉTAPES ── */}
          {activeTab === 'steps' && (
            recipe.steps.length === 0 ? (
              <Text style={{ fontSize: 13, color: C.inkMute, textAlign: 'center', paddingVertical: 24 }}>{t('recipe.notFoundDesc')}</Text>
            ) : (
              <View style={{ gap: 16 }}>
                {recipe.steps.map((step, i) => (
                  <View key={step.id} style={{ flexDirection: 'row', gap: 14 }}>
                    <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                      <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>{step.order}</Text>
                    </View>
                    <View style={{ flex: 1, paddingBottom: 16, borderBottomWidth: i < recipe.steps.length - 1 ? 1 : 0, borderColor: C.border }}>
                      {step.imageUrl ? (
                        <Image source={{ uri: step.imageUrl }} style={{ height: 120, borderRadius: 12, marginBottom: 10 }} resizeMode="cover" />
                      ) : (
                        <View style={{ height: 120, backgroundColor: C.surface2, borderRadius: 12, marginBottom: 10, alignItems: 'center', justifyContent: 'center' }}>
                          <Icon name="ChefHat" size={30} color="#E5E0D8" />
                        </View>
                      )}
                      {!!step.title && <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, marginBottom: 4 }}>{step.title}</Text>}
                      <Text style={{ fontSize: 14, color: C.ink, lineHeight: 22 }}>{step.description}</Text>
                      {!!step.durationMin && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10, alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: '#FEF0E8', borderWidth: 1, borderColor: '#E8591A' }}>
                          <Icon name="Clock" size={14} color="#E8591A" />
                          <Text style={{ color: '#E8591A', fontSize: 12, fontWeight: '700' }}>{step.durationMin} min</Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )
          )}

          {/* ── NUTRITION ── */}
          {activeTab === 'nutrition' && (
            <View style={{ gap: 16 }}>
              <View style={{ alignItems: 'center', paddingVertical: 16 }}>
                <View style={{ width: 110, height: 110, borderRadius: 55, borderWidth: 8, borderColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: recipe.calories ? 26 : 14, color: C.ink }}>
                    {recipe.calories ?? t('recipe.caloriesUnavailable')}
                  </Text>
                  {!!recipe.calories && <Text style={{ fontSize: 11, color: C.inkMute }}>kcal</Text>}
                </View>
                <Text style={{ color: C.inkMute, fontSize: 12, marginTop: 8 }}>{t('recipe.perServing')}</Text>
              </View>

              {!!recipe.spiceLevel && (
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <Icon key={lvl} name="Flame" size={16} color={lvl <= recipe.spiceLevel ? '#C62828' : C.border} />
                  ))}
                </View>
              )}
            </View>
          )}

          {/* ── AVIS ── */}
          {activeTab === 'reviews' && (
            <View style={{ gap: 16, alignItems: 'center', paddingVertical: 24 }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 42, color: C.ink }}>{recipe.rating.toFixed(1)}</Text>
                <View style={{ flexDirection: 'row', gap: 2, marginTop: 4 }}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Icon key={s} name="Star" size={14} color="#F9A825" fill={s <= ratingRounded ? '#F9A825' : 'none'} />
                  ))}
                </View>
                <Text style={{ color: C.inkMute, fontSize: 11, marginTop: 4 }}>{recipe.ratingCount} {t('map.rating').toLowerCase()}</Text>
              </View>
              <Text style={{ fontSize: 13, color: C.inkMute, textAlign: 'center', paddingHorizontal: 24 }}>
                {t('recipe.reviewsUnavailable')}
              </Text>
            </View>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
