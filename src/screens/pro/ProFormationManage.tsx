import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const ENROLLEES = [
  { name: 'Sami Nguimfack', progress: 65, joined: '10 Jan' },
  { name: 'Adèle Biya',     progress: 100, joined: '15 Jan' },
  { name: 'Ngo Mireille',   progress: 30,  joined: '20 Jan' },
  { name: 'Kevin Bah',      progress: 45,  joined: '25 Jan' },
];

export default function ProFormationManage() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Gérer la formation</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Course hero */}
        <View style={{ padding: 16, borderRadius: 20, backgroundColor: '#1A237E', marginBottom: 16 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'PlayfairDisplay-Bold' }}>Maîtrisez le Ndolé</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            {[{ v: '124', l: 'Élèves' }, { v: '4.9', l: 'Note' }, { v: '372k', l: 'Revenus XAF' }].map((s, i) => (
              <View key={i} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 10, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>{s.v}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>{s.l}</Text>
              </View>
            ))}
          </View>
        </View>

        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', marginBottom: 12 }}>
          Élèves inscrits ({ENROLLEES.length})
        </Text>

        <View style={{ borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', overflow: 'hidden', ...SHADOW_SM }}>
          {ENROLLEES.map((e, i) => (
            <View key={i} style={{ paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: i < ENROLLEES.length - 1 ? 1 : 0, borderColor: '#F5F0EB' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#F5F0EB', borderWidth: 1, borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#6D4C41', fontSize: 12, fontWeight: '600' }}>{e.name[0]}</Text>
                </View>
                <Text style={{ flex: 1, fontSize: 14, color: '#2C1810', fontWeight: '600' }}>{e.name}</Text>
                <Text style={{ fontSize: 12, color: '#8C8278' }}>{e.joined}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ flex: 1, height: 6, backgroundColor: '#E5E0D8', borderRadius: 3, overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: `${e.progress}%`, backgroundColor: e.progress === 100 ? '#2E7D32' : '#F9A825', borderRadius: 3 }} />
                </View>
                <Text style={{ fontSize: 12, fontWeight: '700', color: e.progress === 100 ? '#2E7D32' : '#F9A825', minWidth: 36, textAlign: 'right' }}>{e.progress}%</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
