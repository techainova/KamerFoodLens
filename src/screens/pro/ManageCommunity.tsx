import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const MEMBERS = [
  { name: 'Sami Nguimfack', joined: '10 Jan', role: 'Membre',      active: true  },
  { name: 'Adèle Biya',     joined: '15 Jan', role: 'Modérateur',  active: true  },
  { name: 'Ngo Mireille',   joined: '20 Jan', role: 'Membre',      active: false },
];

export default function ManageCommunity() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Communauté</Text>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 40, backgroundColor: '#F5F0EB', borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 12, paddingHorizontal: 12, gap: 8 }}>
          <Icon name="Search" size={14} color="#8C8278" />
          <TextInput value={search} onChangeText={setSearch} placeholder="Rechercher un membre..." placeholderTextColor="#8C8278" style={{ flex: 1, fontSize: 14, color: '#2C1810' }} />
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          {[{ v: '312', l: 'Membres' }, { v: '24', l: 'Actifs/sem.' }, { v: '4.8', l: 'Satisfaction' }].map((s, i) => (
            <View key={i} style={{ flex: 1, padding: 12, borderRadius: 14, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', alignItems: 'center', ...SHADOW_SM }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#F9A825' }}>{s.v}</Text>
              <Text style={{ fontSize: 11, color: '#8C8278', marginTop: 2 }}>{s.l}</Text>
            </View>
          ))}
        </View>

        {/* Members list */}
        <View style={{ borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', overflow: 'hidden', ...SHADOW_SM }}>
          {MEMBERS.map((m, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: i < MEMBERS.length - 1 ? 1 : 0, borderColor: '#F5F0EB' }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F5F0EB', borderWidth: 1, borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#6D4C41' }}>{m.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#2C1810' }}>{m.name}</Text>
                <Text style={{ fontSize: 12, color: '#8C8278' }}>{m.role} · {m.joined}</Text>
              </View>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: m.active ? '#2E7D32' : '#E5E0D8' }} />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
