import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar,
  SafeAreaView, Image,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ScannerStackParams } from '@/navigation/types';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { getDishDescription } from '@/ai/dishDescriptions';
import { UNKNOWN_CLASS } from '@/ai/interpretResult';

type ResultNav = NativeStackNavigationProp<ScannerStackParams, 'Result'>;
type ResultRoute = RouteProp<ScannerStackParams, 'Result'>;

function ConfidenceBadge({ value, t }: { value: number; t: (k: string) => string }) {
  const pct    = Math.round(value * 100);
  const color  = pct >= 80 ? '#2E7D32' : pct >= 60 ? '#F9A825' : '#C62828';
  const bgColor = pct >= 80 ? '#E3F0E4' : pct >= 60 ? '#FBF3DC' : '#FBDCDC';
  const labelKey = pct >= 80 ? 'scanner.highConfidence' : pct >= 60 ? 'scanner.mediumConfidence' : 'scanner.lowConfidence';
  return (
    <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: bgColor }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
      <Text style={{ fontSize: 13, fontWeight: '700', color, fontFamily: 'Inter-Bold' }}>
        {pct}% — {t(labelKey)}
      </Text>
    </View>
  );
}

export default function ResultV1() {
  const navigation = useNavigation<ResultNav>();
  const route = useRoute<ResultRoute>();
  const C = useColors();
  const { t } = useTranslation();
  const [savedToJournal, setSavedToJournal] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  const classId     = route.params?.classId ?? UNKNOWN_CLASS;
  const confidence  = route.params?.confidence ?? 0;
  const imageUri    = route.params?.imageUri;
  const isUnknown = classId === UNKNOWN_CLASS;
  const dish = isUnknown ? null : getDishDescription(classId);

  return (
    <View style={{ flex: 1, backgroundColor: '#2C1810' }}>
      <StatusBar barStyle="light-content" />

      {/* Hero image slot */}
      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 440 }}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={{ flex: 1 }} resizeMode="cover" />
        ) : (
          <View style={{ flex: 1, backgroundColor: '#3D2418' }} />
        )}
        <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(44,24,16,0.15)' }} />
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 180, backgroundColor: 'rgba(44,24,16,0.7)' }} />
        {!imageUri && (
          <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="ChefHat" size={80} color="rgba(255,255,255,0.12)" />
          </View>
        )}
      </View>

      {/* Top controls */}
      <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <TouchableOpacity
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.35)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}
            onPress={() => navigation.goBack()}
          >
            <Icon name="ArrowLeft" size={18} color="#fff" />
          </TouchableOpacity>
          {!isUnknown && (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(0,0,0,0.35)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Share2" size={17} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: bookmarked ? 'rgba(232,89,26,0.5)' : 'rgba(0,0,0,0.35)', borderWidth: 1, borderColor: bookmarked ? '#E8591A' : 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}
                onPress={() => setBookmarked(!bookmarked)}
              >
                <Icon name="Bookmark" size={17} color="#fff" fill={bookmarked ? '#fff' : 'none'} />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </SafeAreaView>

      {/* Dish name on hero */}
      <View style={{ position: 'absolute', zIndex: 5, top: 300, left: 20, right: 20 }}>
        {!isUnknown && dish && (
          <Text style={{ color: 'rgba(255,255,255,0.75)', fontSize: 12, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'JetBrainsMono-Regular', marginBottom: 6 }}>
            {dish.region}
          </Text>
        )}
        <Text style={{ fontFamily: 'PlayfairDisplay-Bold', color: '#fff', fontSize: 38, lineHeight: 44 }}>
          {isUnknown || !dish ? t('scanner.notRecognized') : dish.nomFR}
        </Text>
      </View>

      {/* Bottom sheet */}
      <ScrollView
        style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled
      >
        <View style={{ marginTop: 390 }}>
          <View style={{ backgroundColor: C.cream, borderTopLeftRadius: 28, borderTopRightRadius: 28, paddingTop: 12, paddingHorizontal: 20 }}>
            {/* Handle */}
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: C.border, alignSelf: 'center', marginBottom: 20 }} />

            {/* Confidence */}
            <ConfidenceBadge value={confidence} t={t} />

            {isUnknown || !dish ? (
              <View style={{ marginTop: 20, alignItems: 'center', paddingVertical: 24 }}>
                <Icon name="Search" size={40} color={C.inkMute} />
                <Text style={{ fontSize: 16, fontWeight: '700', color: C.ink, marginTop: 14, textAlign: 'center' }}>
                  {t('scanner.notRecognized')}
                </Text>
                <Text style={{ fontSize: 13, color: C.inkSoft, marginTop: 8, textAlign: 'center', lineHeight: 20 }}>
                  {t('scanner.notRecognizedDesc')}
                </Text>
                <TouchableOpacity
                  style={{ marginTop: 20, height: 48, paddingHorizontal: 24, backgroundColor: C.primary, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.85}
                >
                  <Icon name="RefreshCw" size={16} color="#fff" />
                  <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>{t('scanner.tryAgain')}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* Story section */}
                <View style={{ marginTop: 18 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink, fontFamily: 'Inter-Bold', marginBottom: 10 }}>
                    {t('scanner.storyTitle')}
                  </Text>
                  <Text style={{ fontSize: 13, color: C.inkSoft, lineHeight: 21 }}>
                    {dish.description}
                  </Text>
                </View>

                {/* Ingredients */}
                <View style={{ marginTop: 18 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink, marginBottom: 8 }}>{t('scanner.ingredients')}</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                    {dish.ingredients.map((ing) => (
                      <View key={ing} style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border }}>
                        <Text style={{ fontSize: 12, color: C.inkSoft }}>{ing}</Text>
                      </View>
                    ))}
                  </View>
                </View>

                {/* Prep time + spice level */}
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
                  <View style={{ flex: 1, padding: 12, borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, alignItems: 'center' }}>
                    <Icon name="Clock" size={16} color={C.inkMute} />
                    <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink, marginTop: 4 }}>
                      {dish.tempsPreparationMin} {t('scanner.minutes')}
                    </Text>
                    <Text style={{ fontSize: 10, color: C.inkMute, marginTop: 1 }}>{t('scanner.prepTime')}</Text>
                  </View>
                  <View style={{ flex: 1, padding: 12, borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', gap: 2 }}>
                      {[1, 2, 3].map((lvl) => (
                        <Icon key={lvl} name="Flame" size={14} color={lvl <= dish.niveauEpice ? '#C62828' : C.border} />
                      ))}
                    </View>
                    <Text style={{ fontSize: 10, color: C.inkMute, marginTop: 5 }}>{t('scanner.spiceLevel')}</Text>
                  </View>
                </View>

                {/* Primary actions */}
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                  <TouchableOpacity
                    style={{ flex: 1, height: 50, backgroundColor: '#E8591A', borderRadius: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    onPress={() => navigation.navigate('Recipe', { dishId: classId })}
                    activeOpacity={0.85}
                  >
                    <Icon name="ChefHat" size={18} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700', fontFamily: 'Inter-Bold' }}>
                      {t('scanner.viewRecipe')}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{ flex: 1, height: 50, borderWidth: 2, borderColor: '#2E7D32', borderRadius: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate('MapScreen' as never)}
                  >
                    <Icon name="MapPin" size={18} color="#2E7D32" />
                    <Text style={{ color: '#2E7D32', fontSize: 14, fontWeight: '700', fontFamily: 'Inter-Bold' }}>
                      {t('scanner.findRestaurants')}
                    </Text>
                  </TouchableOpacity>
                </View>

                {/* Secondary action */}
                <TouchableOpacity
                  style={{ marginTop: 10, height: 46, borderWidth: 1, borderColor: C.border, borderRadius: 23, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.surface }}
                  onPress={() => setSavedToJournal(true)}
                  activeOpacity={0.8}
                >
                  <Icon name="Bookmark" size={16} color={savedToJournal ? '#2E7D32' : '#6D4C41'} fill={savedToJournal ? '#2E7D32' : 'none'} />
                  <Text style={{ color: savedToJournal ? '#2E7D32' : '#6D4C41', fontSize: 13, fontWeight: '600' }}>
                    {savedToJournal ? t('scanner.addedToJournal', 'Ajouté au journal') : t('scanner.addToJournal')}
                  </Text>
                </TouchableOpacity>

                {/* Accompagnements */}
                <View style={{ marginTop: 20 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink, marginBottom: 10 }}>
                    {t('scanner.accompaniments')}
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                    {dish.accompagnements.map((acc) => (
                      <View
                        key={acc}
                        style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, flexDirection: 'row', alignItems: 'center', gap: 6 }}
                      >
                        <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: C.surface2 }} />
                        <Text style={{ fontSize: 13, color: C.inkSoft, fontWeight: '500' }}>{acc}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              </>
            )}

            {/* Scan again */}
            <TouchableOpacity
              style={{ marginTop: 16, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8 }}
              onPress={() => navigation.goBack()}
            >
              <Icon name="RefreshCw" size={14} color="#E8591A" />
              <Text style={{ color: '#E8591A', fontSize: 13, fontWeight: '600' }}>
                {t('scanner.scanAgain')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
