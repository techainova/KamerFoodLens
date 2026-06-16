import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const ACTIONS = [
  { l: 'Liste des inscrits',             icon: 'Users'      as const },
  { l: 'Envoyer message aux participants',icon: 'Megaphone'  as const },
  { l: 'Modifier l\'événement',           icon: 'Edit'       as const },
  { l: 'Scanner les billets (entrée)',    icon: 'ScanLine'   as const },
  { l: 'Statistiques de l\'événement',   icon: 'BarChart2'  as const },
];

export default function ManageEvent() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Gérer l'événement</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Event hero */}
        <View style={{ padding: 16, borderRadius: 20, backgroundColor: '#1A237E', marginBottom: 16 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'PlayfairDisplay-Bold' }}>Festival des saveurs camerounaises</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <Icon name="Calendar" size={12} color="rgba(255,255,255,0.6)" />
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Sam 22 Jun 2026 · 10h00 – 20h00</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            {[{ v: '847', l: 'Inscrits' }, { v: '153', l: 'Restants' }, { v: '1000', l: 'Capacité' }].map((s, i) => (
              <View key={i} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 10, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>{s.v}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>{s.l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={{ gap: 10 }}>
          {ACTIONS.map((a, i) => (
            <TouchableOpacity key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', ...SHADOW_SM }}>
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: '#E8EAF6', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={a.icon} size={16} color="#1A237E" />
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: '#2C1810' }}>{a.l}</Text>
              <Icon name="ChevronRight" size={16} color="#8C8278" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={{ marginTop: 20, height: 44, borderWidth: 1, borderColor: '#C6282830', borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, color: '#C62828' }}>Annuler l'événement</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
