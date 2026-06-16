import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const TABS = ['Scans', 'Recettes', 'Événements'];

const SCAN_HISTORY = [
  { dish: 'Ndolé traditionnel', date: "Aujourd'hui 14:23", confidence: 97, region: 'Littoral'  },
  { dish: 'Poulet DG',          date: 'Hier 12:05',        confidence: 91, region: 'Centre'    },
  { dish: 'Eru & Fufu',         date: 'Lun 9 Jun · 18:41', confidence: 88, region: 'Nord-Ouest'},
  { dish: 'Koki haricots',      date: 'Dim 8 Jun · 11:20', confidence: 84, region: 'Ouest'     },
  { dish: 'Mbongo tchobi',      date: 'Sam 7 Jun · 19:55', confidence: 79, region: 'Littoral'  },
];

export default function History() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Historique</Text>
        <TouchableOpacity>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#E8591A' }}>Effacer</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff' }}>
        {TABS.map((tab, i) => (
          <TouchableOpacity key={i} onPress={() => setActiveTab(i)}
            style={{ flex: 1, paddingVertical: 12, borderBottomWidth: 2, borderColor: i === activeTab ? '#E8591A' : 'transparent', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: i === activeTab ? '600' : '500', color: i === activeTab ? '#E8591A' : '#8C8278' }}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {activeTab === 0 && (
          <View style={{ gap: 12 }}>
            {SCAN_HISTORY.map((item, i) => (
              <TouchableOpacity key={i} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', padding: 14, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', ...SHADOW_SM }}>
                <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: '#F5F0EB', borderWidth: 1, borderStyle: 'dashed', borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="Camera" size={20} color="rgba(140,130,120,0.4)" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#2C1810' }}>{item.dish}</Text>
                  <Text style={{ fontSize: 12, color: '#8C8278', marginTop: 2 }}>{item.region} · {item.date}</Text>
                </View>
                <View style={{ height: 24, paddingHorizontal: 8, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: item.confidence >= 90 ? '#E3F0E4' : '#F5F0EB' }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: item.confidence >= 90 ? '#2E7D32' : '#6D4C41' }}>{item.confidence}%</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab !== 0 && (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 60 }}>
            <Icon name={activeTab === 1 ? 'BookOpen' : 'Calendar'} size={48} color="rgba(140,130,120,0.3)" />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#2C1810', textAlign: 'center', marginBottom: 6, marginTop: 16 }}>Aucun historique</Text>
            <Text style={{ fontSize: 14, color: '#8C8278', textAlign: 'center', lineHeight: 20 }}>
              {activeTab === 1 ? 'Vos recettes consultées apparaîtront ici.' : 'Les événements auxquels vous avez participé seront listés ici.'}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
