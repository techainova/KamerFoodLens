import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const PROMOS_INITIAL = [
  { code: 'BIENVENUE20', discount: '20%', uses: 34,  max: 100,  active: true,  expires: '31 Jan' },
  { code: 'NOEL2025',    discount: '15%', uses: 87,  max: 100,  active: false, expires: '26 Déc' },
  { code: 'FIDELITE10',  discount: '10%', uses: 12,  max: null, active: true,  expires: 'Illimité' },
];

export default function ProPromos() {
  const navigation = useNavigation<any>();
  const [states, setStates] = useState(PROMOS_INITIAL.map(p => p.active));

  const toggle = (i: number) => setStates(prev => prev.map((v, idx) => idx === i ? !v : v));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Promotions</Text>
        <TouchableOpacity style={{ height: 32, paddingHorizontal: 12, backgroundColor: '#F9A825', borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4 }}>
          <Icon name="Plus" size={12} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Créer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          {[{ v: '3', l: 'Promos actives' }, { v: '133', l: 'Utilisations' }, { v: '−12%', l: 'Remise moy.' }].map((s, i) => (
            <View key={i} style={{ flex: 1, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 16, padding: 12, alignItems: 'center', ...SHADOW_SM }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#F9A825' }}>{s.v}</Text>
              <Text style={{ fontSize: 10, color: '#8C8278', textAlign: 'center', marginTop: 2 }}>{s.l}</Text>
            </View>
          ))}
        </View>

        {/* Promo codes */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', marginBottom: 12 }}>Codes promo</Text>
        <View style={{ gap: 12 }}>
          {PROMOS_INITIAL.map((promo, i) => (
            <View key={i} style={{ padding: 16, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', ...SHADOW_SM }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ backgroundColor: '#FBF3DC', borderWidth: 1, borderColor: '#F9A82530', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                    <Text style={{ color: '#F9A825', fontWeight: '700', fontSize: 13, fontFamily: 'JetBrainsMono-Regular' }}>{promo.code}</Text>
                  </View>
                  <View style={{ backgroundColor: '#1A237E', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{promo.discount}</Text>
                  </View>
                </View>
                <Switch
                  value={states[i]} onValueChange={() => toggle(i)}
                  trackColor={{ false: '#E5E0D8', true: '#F9A825' }} thumbColor="#fff"
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="Users" size={12} color="#8C8278" />
                  <Text style={{ fontSize: 12, color: '#8C8278' }}>{promo.uses}{promo.max ? `/${promo.max}` : ''} utilisations</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="Clock" size={12} color="#8C8278" />
                  <Text style={{ fontSize: 12, color: '#8C8278' }}>{promo.expires}</Text>
                </View>
              </View>
              {promo.max && (
                <View style={{ height: 3, backgroundColor: '#F5F0EB', borderRadius: 2, marginTop: 10, overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: `${(promo.uses / promo.max) * 100}%`, backgroundColor: '#F9A825', borderRadius: 2 }} />
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
