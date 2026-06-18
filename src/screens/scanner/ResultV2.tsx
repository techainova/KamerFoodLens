import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const FOUND   = { fr: 'Ndolé', region: 'Littoral', conf: 87 };
const SIMILAR = ['Eru', 'Mbongo', 'Kwacoco', 'Koki', 'Sanga'];

export default function ResultV2() {
  const navigation = useNavigation<any>();
  const C = useColors();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: C.ink, lineHeight: 22 }}>Résultat</Text>
          <Text style={{ fontSize: 12, color: C.inkMute }}>Result</Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <TouchableOpacity style={{ width: 36, height: 36, borderWidth: 1, borderColor: C.border, borderRadius: 18, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Share2" size={16} color="#6D4C41" />
          </TouchableOpacity>
          <TouchableOpacity style={{ width: 36, height: 36, borderWidth: 1, borderColor: C.border, borderRadius: 18, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Bookmark" size={16} color="#6D4C41" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Confidence badge */}
        <View style={{ alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20, backgroundColor: C.successSoft, marginBottom: 14 }}>
          <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#2E7D32' }} />
          <Text style={{ fontSize: 12, color: '#2E7D32', fontWeight: '600' }}>Confiance {FOUND.conf}% <Text style={{ fontStyle: 'italic', fontWeight: '400' }}>/ Confidence {FOUND.conf}%</Text></Text>
        </View>

        {/* Title */}
        <Text style={{ fontSize: 36, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, lineHeight: 42, marginBottom: 2 }}>{FOUND.fr}</Text>
        <Text style={{ fontSize: 12, color: C.inkMute, marginBottom: 14 }}>{FOUND.region} · <Text style={{ fontStyle: 'italic' }}>"the national dish"</Text></Text>

        {/* Image */}
        <View style={{ height: 192, backgroundColor: C.surface2, borderRadius: 18, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
          <Icon name="ChefHat" size={48} color="rgba(140,130,120,0.25)" />
          <Text style={{ fontSize: 12, color: C.inkMute, fontStyle: 'italic', marginTop: 8 }}>Ndolé fumant</Text>
        </View>

        {/* Quick facts */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
          {[
            { v: '90',     fr: 'min',     en: 'min'   },
            { v: 'Mijoté', fr: 'cuisson', en: 'cook'  },
            { v: 'Moyen',  fr: 'épicé',   en: 'spice' },
          ].map((s, i) => (
            <View key={i} style={{ flex: 1, borderWidth: 1, borderColor: C.border, borderRadius: 12, padding: 10, alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: C.ink, fontFamily: 'PlayfairDisplay-Bold' }}>{s.v}</Text>
              <Text style={{ fontSize: 11, color: C.inkMute }}>{s.fr} <Text style={{ fontStyle: 'italic' }}>/ {s.en}</Text></Text>
            </View>
          ))}
        </View>

        {/* Story */}
        <View style={{ padding: 12, backgroundColor: C.surface2, borderRadius: 12, marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>Histoire <Text style={{ fontWeight: '400', fontStyle: 'italic', color: C.inkMute }}>/ Story</Text></Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="Volume2" size={13} color="#E8591A" />
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#E8591A' }}>Écouter</Text>
            </View>
          </View>
          <Text style={{ fontSize: 12, color: C.inkSoft, lineHeight: 18 }}>
            Plat emblématique du Littoral, à base de feuilles amères mijotées avec pâte d'arachide et poisson fumé...{' '}
            <Text style={{ color: '#E8591A', fontWeight: '600' }}>+ Lire</Text>
          </Text>
        </View>

        {/* Rate */}
        <View style={{ padding: 12, borderWidth: 1, borderColor: C.border, borderRadius: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: C.ink }}>Noter ce plat</Text>
          <View style={{ flexDirection: 'row', gap: 4 }}>
            {[0,1,2,3,4].map(i => (
              <Icon key={i} name="Star" size={20} color={i < 4 ? '#F9A825' : '#E5E0D8'} fill={i < 4 ? '#F9A825' : 'none'} />
            ))}
          </View>
        </View>

        {/* Similar */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 11, color: C.inkMute, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>SIMILAIRES / SIMILAR</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {SIMILAR.map(s => (
                <View key={s} style={{ height: 30, paddingHorizontal: 12, borderRadius: 15, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 12, color: C.inkSoft, fontWeight: '500' }}>{s}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Actions */}
        <View style={{ gap: 8 }}>
          <TouchableOpacity style={{ height: 56, backgroundColor: '#E8591A', borderRadius: 28, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }} activeOpacity={0.85}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Voir la recette</Text>
            <Icon name="ChevronRight" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={{ height: 48, borderWidth: 2, borderColor: '#2E7D32', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#2E7D32' }}>Trouver des restaurants</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
