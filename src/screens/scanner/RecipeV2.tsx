import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="light-content" />

      {/* Sticky hero image */}
      <View style={{ height: 240, position: 'relative' }}>
        <View style={{ flex: 1, backgroundColor: '#F5F0EB', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="ChefHat" size={56} color="rgba(140,130,120,0.25)" />
          <Text style={{ fontSize: 12, color: '#8C8278', fontStyle: 'italic', marginTop: 8 }}>Ndolé éditorial</Text>
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
        <Text style={{ fontSize: 11, color: '#E8591A', textTransform: 'uppercase', fontWeight: '700', letterSpacing: 1.2 }}>Recette du Littoral</Text>
        <Text style={{ fontSize: 28, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', marginTop: 6, marginBottom: 14, lineHeight: 34 }}>Ndolé traditionnel</Text>

        {/* Meta row */}
        <View style={{ flexDirection: 'row', borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#E5E0D8', paddingVertical: 10, marginBottom: 20 }}>
          {[{ v: '1h30', l: 'Durée' }, { v: '4', l: 'Pers.' }, { v: '480', l: 'Kcal' }, { v: '4.6', l: '(312)' }].map((m, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center', borderLeftWidth: i > 0 ? 1 : 0, borderColor: '#E5E0D8' }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: '#2C1810' }}>{m.v}</Text>
              <Text style={{ fontSize: 11, color: '#8C8278' }}>{m.l}</Text>
            </View>
          ))}
        </View>

        {/* Ingredients */}
        <Text style={{ fontSize: 20, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', marginBottom: 8 }}>Ingrédients <Text style={{ fontSize: 14, fontWeight: '400', fontStyle: 'italic', color: '#8C8278' }}>/ Ingredients</Text></Text>
        <View style={{ marginBottom: 20, paddingLeft: 16 }}>
          {INGREDIENTS.map((item, i) => (
            <Text key={i} style={{ fontSize: 14, color: '#6D4C41', marginBottom: 4, lineHeight: 22 }}>• {item}</Text>
          ))}
        </View>

        {/* Steps */}
        <Text style={{ fontSize: 20, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', marginBottom: 8 }}>Étapes <Text style={{ fontSize: 14, fontWeight: '400', fontStyle: 'italic', color: '#8C8278' }}>/ Steps</Text></Text>
        <View style={{ gap: 10 }}>
          {STEPS.map((step, i) => (
            <View key={i} style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#2E7D32', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 2 }}>
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{i + 1}</Text>
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: '#6D4C41', lineHeight: 21 }}>{step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={{ position: 'absolute', bottom: 16, left: 16, right: 16 }}>
        <TouchableOpacity style={{ height: 48, backgroundColor: '#E8591A', borderRadius: 24, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }} activeOpacity={0.85}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Mode cuisson</Text>
          <Icon name="ChevronRight" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
