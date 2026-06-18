import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const TABS = ['En attente', 'Approuvés', 'Supprimés'];

const REPORTS = [
  { type: 'Post',        content: 'Contenu inapproprié signalé 3 fois',          user: 'Sami N.',  time: '2h', reports: 3 },
  { type: 'Commentaire', content: 'Spam répété sur fil de discussion #Ndolé',    user: 'Inconnu',  time: '5h', reports: 7 },
  { type: 'Profil',      content: 'Photo de profil non conforme',                user: 'User#4521',time: '1j', reports: 1 },
];

export default function AdminModeration() {
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
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', flex: 1 }}>Modération</Text>
        <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: '#C62828', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{REPORTS.length}</Text>
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
            {REPORTS.map((r, i) => (
              <View key={i} style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: C.errorSoft }}>
                    <Text style={{ color: '#C62828', fontSize: 11, fontWeight: '600' }}>{r.type}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: C.errorSoft }}>
                    <Icon name="Flag" size={10} color="#C62828" />
                    <Text style={{ color: '#C62828', fontSize: 11, fontWeight: '600' }}>{r.reports} signalement{r.reports > 1 ? 's' : ''}</Text>
                  </View>
                  <Text style={{ color: C.inkMute, fontSize: 11, marginLeft: 'auto' }}>{r.time}</Text>
                </View>
                <Text style={{ fontSize: 14, color: C.ink, marginBottom: 4 }}>{r.content}</Text>
                <Text style={{ fontSize: 12, color: C.inkMute, marginBottom: 12 }}>Utilisateur : {r.user}</Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity style={{ flex: 1, height: 32, backgroundColor: C.successSoft, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#2E7D32', fontSize: 12, fontWeight: '600' }}>Ignorer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1, height: 32, backgroundColor: C.errorSoft, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#C62828', fontSize: 12, fontWeight: '600' }}>Supprimer</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flex: 1, height: 32, backgroundColor: C.navySoft, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#1A237E', fontSize: 12, fontWeight: '600' }}>Suspendre</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 64 }}>
            <Icon name="CheckCircle" size={40} color="rgba(46,125,50,0.3)" />
            <Text style={{ color: C.inkMute, fontSize: 14, marginTop: 12, textAlign: 'center' }}>Aucun élément dans cet onglet.</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
