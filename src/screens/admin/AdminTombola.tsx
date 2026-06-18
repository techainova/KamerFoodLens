import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const PRIZES = [
  { rank: '1er', prize: 'Stage cuisine + Vol A/R', value: '350 000 XAF', color: '#F9A825', icon: 'Trophy'  as const },
  { rank: '2e',  prize: 'Kit cuisine pro',          value: '85 000 XAF',  color: '#8C8278', icon: 'Award'   as const },
  { rank: '3e',  prize: 'Abonnement Pro 1 an',      value: '36 000 XAF',  color: '#E8591A', icon: 'Star'    as const },
];

export default function AdminTombola() {
  const navigation = useNavigation<any>();
  const C = useColors();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#1A237E' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12, padding: 4 }}>
          <Icon name="ArrowLeft" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', flex: 1 }}>Gestion Tombola</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Current tombola hero */}
        <View style={{ padding: 20, borderRadius: 22, backgroundColor: '#1A237E', marginBottom: 20 }}>
          <Text style={{ color: '#F9A825', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Tombola en cours</Text>
          <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'PlayfairDisplay-Bold', marginBottom: 14 }}>Grande Tombola de Juin</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[
              { v: '1 247', l: 'Participants' },
              { v: '2 915', l: 'Tickets' },
              { v: '14j',   l: 'Restant' },
            ].map((s, i) => (
              <View key={i} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 14, padding: 10, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>{s.v}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>{s.l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Prizes */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>Lots</Text>
        <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden', marginBottom: 20, ...SHADOW_SM }}>
          {PRIZES.map((prize, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: i < 2 ? 1 : 0, borderColor: C.border }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: prize.color + '15', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={prize.icon} size={18} color={prize.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{prize.prize}</Text>
                <Text style={{ fontSize: 12, color: C.inkMute }}>{prize.rank} · {prize.value}</Text>
              </View>
              <TouchableOpacity style={{ height: 28, paddingHorizontal: 10, borderWidth: 1, borderColor: C.border, borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 11, color: C.inkSoft }}>Éditer</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={{ gap: 10 }}>
          <TouchableOpacity style={{ height: 48, backgroundColor: '#C62828', borderRadius: 24, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }} activeOpacity={0.85}>
            <Icon name="Zap" size={16} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Lancer le tirage au sort</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ height: 48, borderWidth: 1, borderColor: C.border, borderRadius: 24, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}>
            <Icon name="FileText" size={16} color="#6D4C41" />
            <Text style={{ fontSize: 14, color: C.inkSoft }}>Exporter la liste des participants</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
