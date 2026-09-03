import React from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const STEPS = [
  'Lavez les feuilles de ndolé.',
  'Faites cuire la viande avec oignons et ail.',
  "Ajoutez le poisson fumé et laissez mijoter 20 min.",
];

const INGREDIENTS = [
  "500g feuilles de ndolé",
  "300g pâte d'arachide",
  "400g poisson fumé",
  "200g viande de bœuf",
  "1 oignon, 3 gousses d'ail, huile de palme",
];

export default function RecipeV2() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle="light-content" />

      {/* Sticky hero image */}
      <View style={{ height: 240, position: 'relative' }}>
        <View style={{ flex: 1, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="ChefHat" size={56} color="rgba(140,130,120,0.25)" />
          <Text style={{ fontSize: 12, color: C.inkMute, fontStyle: 'italic', marginTop: 8 }}>Ndolé</Text>
        </View>
        <View style={{ position: 'absolute', top: 14, left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity onPress={() => navigation.goBack()}
            style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="ArrowLeft" size={18} color="#fff" />
          </TouchableOpacity>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Bookmark" size={16} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Share2" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 80 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 11, color: '#E8591A', textTransform: 'uppercase', fontWeight: '700', letterSpacing: 1.2 }}>Littoral</Text>
        <Text style={{ fontSize: 28, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginTop: 6, marginBottom: 14, lineHeight: 34 }}>Ndolé</Text>

        {/* Meta row */}
        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.border, paddingVertical: 10, marginBottom: 20 }}>
          {[
            { v: '1h30', l: t('recipe.duration') },
            { v: '4',    l: t('recipe.servings') },
            { v: '480',  l: t('recipe.calories') },
            { v: '4.6',  l: '(312)' },
          ].map((m, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center', borderLeftWidth: i > 0 ? 1 : 0, borderColor: C.border }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>{m.v}</Text>
              <Text style={{ fontSize: 11, color: C.inkMute }}>{m.l}</Text>
            </View>
          ))}
        </View>

        {/* Ingredients */}
        <Text style={{ fontSize: 20, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 8 }}>{t('recipe.ingredients')}</Text>
        <View style={{ marginBottom: 20, paddingLeft: 16 }}>
          {INGREDIENTS.map((item, i) => (
            <Text key={i} style={{ fontSize: 14, color: C.inkSoft, marginBottom: 4, lineHeight: 22 }}>• {item}</Text>
          ))}
        </View>

        {/* Steps */}
        <Text style={{ fontSize: 20, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 8 }}>{t('recipe.steps')}</Text>
        <View style={{ gap: 10 }}>
          {STEPS.map((step, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#2E7D32', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{i + 1}</Text>
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: C.inkSoft, lineHeight: 21 }}>{step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
        <TouchableOpacity style={{ height: 48, backgroundColor: '#E8591A', borderRadius: 24, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }} activeOpacity={0.85}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{t('recipe.cookMode')}</Text>
          <Icon name="ChevronRight" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
