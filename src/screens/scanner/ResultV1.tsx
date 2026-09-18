// KFL Lens — résultat affiché comme un tour de conversation (photo/question de
// l'utilisateur, puis réponse de l'assistant), à la façon de Claude.
import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, Image, Alert,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ScannerStackParams } from '@/navigation/types';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { getDishDescription } from '@/ai/dishDescriptions';
import { UNKNOWN_CLASS } from '@/ai/interpretResult';
import { useFavoritesStore } from '@/store/favorites.store';
import { useJournalStore } from '@/store/journal.store';
import { useAuthGate } from '@/hooks/useAuthGate';
import { matchDishByDescription } from '@/ai/text/matchDishByDescription';
import { scannerService } from '@/services/scanner.service';
import ScanHistoryDrawer from './ScanHistoryDrawer';

type ResultNav = NativeStackNavigationProp<ScannerStackParams, 'Result'>;
type ResultRoute = RouteProp<ScannerStackParams, 'Result'>;

export default function ResultV1() {
  const navigation = useNavigation<ResultNav>();
  const route = useRoute<ResultRoute>();
  const C = useColors();
  const { t } = useTranslation();
  const [savingToJournal, setSavingToJournal] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const fetchFavorites = useFavoritesStore((s) => s.fetchAll);
  const { requireAuth } = useAuthGate();
  const journalToday = useJournalStore((s) => s.getToday);
  const addJournalEntry = useJournalStore((s) => s.addEntry);
  const fetchJournal = useJournalStore((s) => s.fetchAll);

  const classId    = route.params?.classId ?? UNKNOWN_CLASS;
  const confidence = route.params?.confidence ?? 0;
  const imageUri   = route.params?.imageUri;
  const query      = (route.params as { query?: string } | undefined)?.query;
  const isUnknown  = classId === UNKNOWN_CLASS;
  const dish = isUnknown ? null : getDishDescription(classId);
  const pct = Math.round(confidence * 100);

  useEffect(() => {
    void fetchFavorites();
    void fetchJournal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const bookmarked = useFavoritesStore((s) => !isUnknown && s.favorites.some((f) => f.itemId === classId));
  const savedToJournal = !isUnknown && journalToday().some((e) => e.dishId === classId);

  const inferMealType = (): 'breakfast' | 'lunch' | 'dinner' | 'snack' => {
    const hour = new Date().getHours();
    if (hour < 11) return 'breakfast';
    if (hour < 16) return 'lunch';
    if (hour < 21) return 'dinner';
    return 'snack';
  };

  const handleToggleBookmark = () => {
    if (isUnknown) return;
    requireAuth(() => {
      void toggleFavorite('dish', classId).catch(() => {
        Alert.alert(t('common.error'), t('scanner.favoriteError'));
      });
    });
  };

  const handleAddToJournal = () => {
    if (isUnknown || !dish || savedToJournal || savingToJournal) return;
    requireAuth(() => {
      setSavingToJournal(true);
      addJournalEntry({
        dishId: classId,
        dishName: dish.nomFR,
        imageUrl: imageUri,
        mealType: inferMealType(),
        date: new Date().toISOString(),
      })
        .catch(() => Alert.alert(t('common.error'), t('scanner.journalError')))
        .finally(() => setSavingToJournal(false));
    });
  };

  const followUp = async (label: string, description: string) => {
    try {
      const apiResult = await scannerService.analyzeText({ text: description });
      navigation.push('Result', { scanId: apiResult.scanId, classId: apiResult.classId, confidence: apiResult.confidence, query: label } as never);
    } catch {
      const m = matchDishByDescription(description);
      navigation.push('Result', { scanId: `text-scan-${Date.now()}`, classId: m.classId, confidence: m.confidence, query: label } as never);
    }
  };

  const userLine = query ?? "C'est quoi ce plat ?";

  return (
    <View style={{ flex: 1, backgroundColor: C.cream }}>
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {/* Barre du haut */}
        <View style={{ height: 50, paddingHorizontal: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="ArrowLeft" size={20} color={C.ink} />
          </TouchableOpacity>
          <Text numberOfLines={1} style={{ flex: 1, textAlign: 'center', fontSize: 12.5, fontWeight: '700', color: C.inkMute }}>
            {isUnknown ? 'Identification' : `${dish?.nomFR ?? ''} · identification`}
          </Text>
          <TouchableOpacity onPress={() => setHistoryOpen(true)} style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Menu" size={20} color={C.ink} />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingTop: 6 }} showsVerticalScrollIndicator={false}>
          {/* Message utilisateur */}
          <View style={{ alignItems: 'flex-end', marginBottom: 18 }}>
            <View style={{ maxWidth: '82%' }}>
              {imageUri && (
                <View style={{ borderRadius: 18, borderBottomRightRadius: 6, overflow: 'hidden', borderWidth: 1, borderColor: C.border, marginBottom: 6 }}>
                  <Image source={{ uri: imageUri }} style={{ width: 220, aspectRatio: 4 / 3 }} resizeMode="cover" />
                </View>
              )}
              <View style={{ paddingHorizontal: 14, paddingVertical: 9, borderRadius: 18, borderBottomRightRadius: 6, backgroundColor: C.primary }}>
                <Text style={{ color: '#fff', fontSize: 13.5 }}>{userLine}</Text>
              </View>
            </View>
          </View>

          {/* Réponse assistant */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <View style={{ width: 28, height: 28, borderRadius: 9, marginTop: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: C.primary }}>
              <Icon name="Sparkles" size={16} color="#fff" fill="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              {isUnknown || !dish ? (
                <View>
                  <Text style={{ fontSize: 16, fontWeight: '700', color: C.ink, marginBottom: 6 }}>{t('scanner.notRecognized')}</Text>
                  <Text style={{ fontSize: 13, color: C.inkSoft, lineHeight: 20 }}>{t('scanner.notRecognizedDesc')}</Text>
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ marginTop: 14, alignSelf: 'flex-start', height: 42, paddingHorizontal: 18, borderRadius: 21, backgroundColor: C.primary, flexDirection: 'row', alignItems: 'center', gap: 8 }}
                  >
                    <Icon name="RefreshCw" size={15} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 13.5, fontWeight: '700' }}>{t('scanner.tryAgain')}</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 14, backgroundColor: C.successSoft }}>
                    <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: C.success }} />
                    <Text style={{ fontSize: 11, fontWeight: '700', color: C.success }}>Confiance {pct}%</Text>
                  </View>

                  <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 24, color: C.ink, marginTop: 9 }}>{dish.nomFR}</Text>
                  <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 1 }}>{dish.region} · plat camerounais 🇨🇲</Text>

                  <Text style={{ fontSize: 13.5, lineHeight: 21, color: C.inkSoft, marginTop: 12 }}>{dish.description}</Text>

                  {/* Ingrédients */}
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 12 }}>
                    {dish.ingredients.map((ing) => (
                      <View key={ing} style={{ paddingHorizontal: 11, paddingVertical: 5, borderRadius: 14, backgroundColor: C.surface2 }}>
                        <Text style={{ fontSize: 11.5, color: C.inkSoft }}>{ing}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Mini stats */}
                  <View style={{ flexDirection: 'row', gap: 14, marginTop: 14, padding: 13, borderRadius: 14, backgroundColor: C.surface2 }}>
                    <View>
                      <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 16, color: C.ink }}>{dish.tempsPreparationMin} min</Text>
                      <Text style={{ fontSize: 9.5, color: C.inkMute }}>{t('scanner.prepTime')}</Text>
                    </View>
                    <View>
                      <View style={{ flexDirection: 'row', gap: 2 }}>
                        {[1, 2, 3].map((lvl) => (
                          <Icon key={lvl} name="Flame" size={13} color={lvl <= dish.niveauEpice ? C.error : C.border} />
                        ))}
                      </View>
                      <Text style={{ fontSize: 9.5, color: C.inkMute, marginTop: 3 }}>{t('scanner.spiceLevel')}</Text>
                    </View>
                  </View>

                  {/* Actions */}
                  <View style={{ marginTop: 14, gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('Recipe', { dishId: classId })}
                      activeOpacity={0.85}
                      style={{ height: 46, borderRadius: 23, backgroundColor: C.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    >
                      <Icon name="GraduationCap" size={17} color="#fff" />
                      <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>{t('scanner.viewRecipe')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => requireAuth(() => navigation.navigate('CreatePost', { imageUri, classId, confidence }))}
                      activeOpacity={0.85}
                      style={{ height: 46, borderRadius: 23, borderWidth: 1.6, borderColor: C.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    >
                      <Icon name="Send" size={16} color={C.primary} />
                      <Text style={{ color: C.primary, fontSize: 14, fontWeight: '700' }}>Publier en post</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TouchableOpacity
                        onPress={() => navigation.navigate('MapScreen' as never)}
                        activeOpacity={0.85}
                        style={{ flex: 1, height: 42, borderRadius: 21, backgroundColor: C.surface2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 }}
                      >
                        <Icon name="Store" size={15} color={C.inkSoft} />
                        <Text style={{ color: C.ink, fontSize: 13, fontWeight: '600' }}>{t('scanner.findRestaurants')}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleAddToJournal}
                        disabled={savedToJournal || savingToJournal}
                        activeOpacity={0.85}
                        style={{ flex: 1, height: 42, borderRadius: 21, backgroundColor: C.surface2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 7 }}
                      >
                        <Icon name="Bookmark" size={15} color={savedToJournal ? C.success : C.inkSoft} fill={savedToJournal ? C.success : 'none'} />
                        <Text style={{ color: savedToJournal ? C.success : C.ink, fontSize: 13, fontWeight: '600' }}>
                          {savedToJournal ? 'Au journal' : t('scanner.addToJournal')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleToggleBookmark}
                        activeOpacity={0.85}
                        style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: bookmarked ? C.primarySoft : C.surface2, alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Icon name="Heart" size={16} color={bookmarked ? C.primary : C.inkSoft} fill={bookmarked ? C.primary : 'none'} />
                      </TouchableOpacity>
                    </View>
                  </View>

                  {/* Suggestions de suite */}
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginTop: 16 }}>
                    {dish.accompagnements.slice(0, 3).map((acc) => (
                      <TouchableOpacity
                        key={acc}
                        onPress={() => void followUp(`Et ${acc}, comment l'accompagner ?`, acc)}
                        style={{ paddingHorizontal: 12, paddingVertical: 7, borderRadius: 18, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface }}
                      >
                        <Text style={{ fontSize: 12, fontWeight: '600', color: C.inkSoft }}>{acc} ?</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </>
              )}
            </View>
          </View>
          <View style={{ height: 12 }} />
        </ScrollView>
      </SafeAreaView>

      <ScanHistoryDrawer visible={historyOpen} onClose={() => setHistoryOpen(false)} />
    </View>
  );
}
