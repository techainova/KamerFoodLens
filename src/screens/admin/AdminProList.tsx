import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const TABS = ['En attente', 'Approuvés', 'Rejetés'];

const PENDING = [
  { name: 'Kmer Saveurs',    owner: 'Kevin Bah',   type: 'Restaurant', submitted: '14 Jun', docs: true  },
  { name: 'Douala Food Lab', owner: 'Thierry M.',  type: 'Formation',  submitted: '13 Jun', docs: false },
];

export default function AdminProList() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
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
      <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
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
              <View key={i} style={{ padding: 16, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8' }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: '#2C1810' }}>{pro.name}</Text>
                    <Text style={{ fontSize: 12, color: '#8C8278', marginTop: 2 }}>{pro.owner} · {pro.type}</Text>
                    <Text style={{ fontSize: 11, color: '#8C8278', marginTop: 1 }}>Soumis le {pro.submitted}</Text>
                  </View>
                  <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, backgroundColor: pro.docs ? '#E3F0E4' : '#FBDCDC', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon name={pro.docs ? 'Check' : 'AlertTriangle'} size={10} color={pro.docs ? '#2E7D32' : '#C62828'} />
                    <Text style={{ fontSize: 11, fontWeight: '600', color: pro.docs ? '#2E7D32' : '#C62828' }}>
                      {pro.docs ? 'Docs OK' : 'Docs manquants'}
                    </Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity style={{ flex: 1, height: 36, backgroundColor: '#E3F0E4', borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#2E7D32', fontSize: 12, fontWeight: '600' }}>Approuver</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1, height: 36, backgroundColor: '#FBDCDC', borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#C62828', fontSize: 12, fontWeight: '600' }}>Rejeter</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('AdminProDetail', { restaurantId: pro.name })}
                    style={{ height: 36, paddingHorizontal: 12, borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text style={{ color: '#6D4C41', fontSize: 12 }}>Détails</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 64 }}>
            <Icon name="Check" size={32} color="rgba(140,130,120,0.3)" />
            <Text style={{ color: '#8C8278', fontSize: 14, marginTop: 12 }}>Aucun élément dans cet onglet.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
