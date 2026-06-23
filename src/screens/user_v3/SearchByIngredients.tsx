import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const SUGGESTED = [
  'Feuilles de ndolé', "Pâte d'arachide", 'Poisson fumé', 'Plantains', 'Huile de palme',
  'Oignons', "Gousses d'ail", 'Crevettes séchées', 'Gingembre', 'Piment', 'Manioc',
];

const RESULTS = [
  { name: 'Ndolé traditionnel', match: 97, missing: [],                  region: 'Littoral' },
  { name: 'Mbongo tchobi',      match: 72, missing: ['Écorces fraîches'], region: 'Littoral' },
  { name: 'Sauce arachide',     match: 68, missing: ['Tomates'],          region: 'Centre'   },
];

export default function SearchByIngredients() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const [search, setSearch] = useState('');
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
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>Chercher par ingrédients</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Search input */}
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 48, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 16, paddingHorizontal: 14, gap: 10, marginBottom: 16 }}>
          <Icon name="Search" size={16} color="#8C8278" />
          <TextInput value={search} onChangeText={setSearch} placeholder="Ajouter un ingrédient..." placeholderTextColor="#8C8278" style={{ flex: 1, fontSize: 14, color: C.ink }} />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => { if (search.trim()) { toggle(search.trim()); setSearch(''); } }}
              style={{ height: 28, paddingHorizontal: 10, backgroundColor: '#E8591A', borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4 }}>
              <Icon name="Plus" size={12} color="#fff" />
            </TouchableOpacity>
          )}
        </View>

        {/* Selected ingredients */}
        {selected.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Mes ingrédients ({selected.length})</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {selected.map(ing => (
                <TouchableOpacity key={ing} onPress={() => toggle(ing)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 32, paddingLeft: 12, paddingRight: 6, borderRadius: 16, backgroundColor: '#E8591A' }}>
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: '500' }}>{ing}</Text>
                  <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="X" size={10} color="#fff" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Suggested ingredients */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Ingrédients courants</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {SUGGESTED.filter(i => !selected.includes(i)).map(ing => (
              <TouchableOpacity key={ing} onPress={() => toggle(ing)}
                style={{ height: 32, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 12, color: C.inkSoft }}>+ {ing}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Results */}
        {selected.length >= 2 && (
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink }}>Recettes compatibles</Text>
              <Text style={{ fontSize: 12, color: C.inkMute }}>{RESULTS.length} résultats</Text>
            </View>
            <View style={{ gap: 10 }}>
              {RESULTS.map((r, i) => (
                <TouchableOpacity key={i} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', padding: 14, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
                  <View style={{ width: 56, height: 56, borderRadius: 12, backgroundColor: C.surface2, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="ChefHat" size={22} color="rgba(140,130,120,0.35)" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{r.name}</Text>
                    <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 1 }}>{r.region}</Text>
                    {r.missing.length > 0 && (
                      <Text style={{ fontSize: 12, color: '#E8591A', marginTop: 2 }}>Manquant: {r.missing.join(', ')}</Text>
                    )}
                  </View>
                  <View style={{ height: 32, width: 56, borderRadius: 16, alignItems: 'center', justifyContent: 'center', backgroundColor: r.match >= 90 ? '#E3F0E4' : '#F5F0EB' }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: r.match >= 90 ? '#2E7D32' : '#6D4C41' }}>{r.match}%</Text>
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
