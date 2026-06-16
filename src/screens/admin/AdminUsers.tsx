import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const USERS = [
  { name: 'Sami Nguimfack', email: 'sami@kfl.cm',    role: 'Standard', status: 'active',    joined: '3 Jan' },
  { name: 'Adèle Biya',     email: 'adele@kfl.cm',   role: 'Pro',      status: 'active',    joined: '12 Jan' },
  { name: 'Chef Joël',      email: 'joel@kfl.cm',    role: 'Pro',      status: 'suspended', joined: '1 Fév' },
  { name: 'Maman Pauline',  email: 'pauline@kfl.cm', role: 'Pro',      status: 'active',    joined: '5 Fév' },
];

const FILTERS = ['Tous', 'Standard', 'Pro', 'Suspendus'];

export default function AdminUsers() {
  const navigation = useNavigation<any>();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState(0);

  const filtered = USERS.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === 0 ||
      (filter === 1 && u.role === 'Standard') ||
      (filter === 2 && u.role === 'Pro') ||
      (filter === 3 && u.status === 'suspended');
    return matchSearch && matchFilter;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#1A237E' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12, padding: 4 }}>
          <Icon name="ArrowLeft" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', flex: 1 }}>Utilisateurs ({USERS.length})</Text>
      </View>

      {/* Search + filters */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8', gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 40, backgroundColor: '#F5F0EB', borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 12, paddingHorizontal: 12, gap: 8 }}>
          <Icon name="Search" size={15} color="#8C8278" />
          <TextInput
            value={search} onChangeText={setSearch}
            placeholder="Rechercher..." placeholderTextColor="#8C8278"
            style={{ flex: 1, fontSize: 14, color: '#2C1810' }}
          />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 6 }}>
            {FILTERS.map((f, i) => (
              <TouchableOpacity
                key={i} onPress={() => setFilter(i)}
                style={{ height: 28, paddingHorizontal: 12, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: i === filter ? '#1A237E' : '#F5F0EB', borderColor: i === filter ? '#1A237E' : '#E5E0D8' }}
              >
                <Text style={{ fontSize: 12, fontWeight: '500', color: i === filter ? '#fff' : '#6D4C41' }}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={{ borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', overflow: 'hidden' }}>
          {filtered.map((user, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => navigation.navigate('AdminUserDetail', { userId: user.email })}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: i < filtered.length - 1 ? 1 : 0, borderColor: '#F5F0EB' }}
            >
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#F5F0EB', borderWidth: 1, borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#6D4C41', fontSize: 13, fontWeight: '600' }}>{user.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#2C1810' }}>{user.name}</Text>
                <Text style={{ fontSize: 11, color: '#8C8278' }}>{user.email} · {user.joined}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: user.role === 'Pro' ? '#FBF3DC' : '#F5F0EB' }}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: user.role === 'Pro' ? '#F9A825' : '#6D4C41' }}>{user.role}</Text>
                </View>
                <View style={{ paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8, backgroundColor: user.status === 'active' ? '#E3F0E4' : '#FBDCDC' }}>
                  <Text style={{ fontSize: 10, color: user.status === 'active' ? '#2E7D32' : '#C62828' }}>
                    {user.status === 'active' ? '● Actif' : '● Suspendu'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
