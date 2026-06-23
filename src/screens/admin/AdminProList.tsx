import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const TABS = ['En attente', 'Approuvés', 'Rejetés'];

const PENDING = [
  { name: 'Kmer Saveurs',    owner: 'Kevin Bah',   type: 'Restaurant', submitted: '14 Jun', docs: true  },
  { name: 'Douala Food Lab', owner: 'Thierry M.',  type: 'Formation',  submitted: '13 Jun', docs: false },
];

export default function AdminProList() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#1A237E' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12, padding: 4 }}>
          <Icon name="ArrowLeft" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', flex: 1 }}>Comptes Pro</Text>
        <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#C62828', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{PENDING.length}</Text>
        </View>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={i} onPress={() => setActiveTab(i)}
            style={{ flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderColor: i === activeTab ? '#1A237E' : 'transparent' }}
          >
            <Text style={{ fontSize: 13, fontWeight: i === activeTab ? '600' : '500', color: i === activeTab ? '#1A237E' : '#8C8278' }}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {activeTab === 0 ? (
          <View style={{ gap: 12 }}>
            {PENDING.map((pro, i) => (
              <View key={i} style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>{pro.name}</Text>
                    <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 2 }}>{pro.owner} · {pro.type}</Text>
                    <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 1 }}>Soumis le {pro.submitted}</Text>
                  </View>
                  <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, backgroundColor: pro.docs ? '#E3F0E4' : '#FBDCDC', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon name={pro.docs ? 'Check' : 'AlertTriangle'} size={10} color={pro.docs ? '#2E7D32' : '#C62828'} />
                    <Text style={{ fontSize: 11, fontWeight: '600', color: pro.docs ? '#2E7D32' : '#C62828' }}>
                      {pro.docs ? 'Docs OK' : 'Docs manquants'}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity style={{ flex: 1, height: 36, backgroundColor: C.successSoft, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#2E7D32', fontSize: 12, fontWeight: '600' }}>Approuver</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1, height: 36, backgroundColor: C.errorSoft, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#C62828', fontSize: 12, fontWeight: '600' }}>Rejeter</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('AdminProDetail', { restaurantId: pro.name })}
                    style={{ height: 36, paddingHorizontal: 12, borderWidth: 1, borderColor: C.border, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text style={{ color: C.inkSoft, fontSize: 12 }}>Détails</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 64 }}>
            <Icon name="Check" size={32} color="rgba(140,130,120,0.3)" />
            <Text style={{ color: C.inkMute, fontSize: 14, marginTop: 12 }}>Aucun élément dans cet onglet.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
