import React, { useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, TextInput,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const CATEGORIES = ['Tout', 'Recettes', 'Techniques', 'Restaurants', 'Culture'];

const THREADS = [
  {
    id: '1',
    category: 'Recettes',
    catColor: '#E8591A',
    title: 'Comment reproduire le Mbongo Tchobi authentique à la maison ?',
    user: 'Chef Paul',
    initials: 'CP',
    initColor: '#E8591A',
    time: '2h',
    replies: 34,
    views: 428,
    hot: true,
    pinned: false,
  },
  {
    id: '2',
    category: 'Culture',
    catColor: '#1A237E',
    title: 'Différences régionales du Ndolé : Douala vs Yaoundé vs Bafang',
    user: 'Maman Caro',
    initials: 'MC',
    initColor: '#2E7D32',
    time: '5h',
    replies: 67,
    views: 892,
    hot: true,
    pinned: false,
  },
  {
    id: '3',
    category: 'Techniques',
    catColor: '#2E7D32',
    title: '[ÉPINGLÉ] Guide complet des épices camerounaises — njansang, écorces HK...',
    user: 'Admin KFL',
    initials: 'AK',
    initColor: '#F9A825',
    time: '2j',
    replies: 156,
    views: 2341,
    hot: false,
    pinned: true,
  },
  {
    id: '4',
    category: 'Restaurants',
    catcolor: '#8C8278',
    title: 'Meilleurs restaurants de Poulet DG à Douala en 2024 ?',
    user: 'Ngo Beatrice',
    initials: 'NB',
    initColor: '#1A237E',
    time: '1j',
    replies: 23,
    views: 315,
    hot: false,
    pinned: false,
  },
  {
    id: '5',
    category: 'Recettes',
    catColor: '#E8591A',
    title: 'Achu Soup : les secrets de la pâte jaune bien onctueuse',
    user: 'Charlotte NW',
    initials: 'CW',
    initColor: '#E8591A',
    time: '3j',
    replies: 41,
    views: 567,
    hot: false,
    pinned: false,
  },
];

export default function Forum() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const [activeCategory, setActiveCategory] = useState('Tout');
  const [search, setSearch] = useState('');

  const filtered = THREADS.filter(t => {
    const matchCat = activeCategory === 'Tout' || t.category === activeCategory;
    const matchSearch = !search || t.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>Forum</Text>
        <TouchableOpacity style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="Bell" size={17} color="#6D4C41" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface2, borderRadius: 12, paddingHorizontal: 12, height: 40 }}>
          <Icon name="Search" size={15} color="#8C8278" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Chercher un sujet..."
            placeholderTextColor="#8C8278"
            style={{ flex: 1, marginLeft: 8, fontSize: 14, color: C.ink }}
          />
        </View>
      </View>

      {/* Category chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }} style={{ backgroundColor: C.surface, maxHeight: 52, borderBottomWidth: 1, borderColor: C.border }}>
        {CATEGORIES.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCategory(cat)}
            style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: cat === activeCategory ? '#E8591A' : '#F5F0EB', borderWidth: 1, borderColor: cat === activeCategory ? '#E8591A' : '#E5E0D8' }}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: cat === activeCategory ? '#fff' : '#6D4C41' }}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 16, gap: 10, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        {filtered.map(thread => (
          <TouchableOpacity
            key={thread.id}
            onPress={() => navigation.navigate('ForumDetail', { thread })}
            activeOpacity={0.85}
            style={{ backgroundColor: C.surface, borderRadius: 16, padding: 16, borderWidth: thread.pinned ? 1.5 : 1, borderColor: thread.pinned ? '#F9A825' + '60' : '#E5E0D8', ...SHADOW_SM }}
          >
            {thread.pinned && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                <Icon name="Award" size={12} color="#F9A825" />
                <Text style={{ fontSize: 10, fontWeight: '700', color: '#F9A825', textTransform: 'uppercase', letterSpacing: 0.5 }}>Épinglé</Text>
              </View>
            )}

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: thread.catColor + '15' }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: thread.catColor }}>{thread.category}</Text>
              </View>
              {thread.hot && (
                <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: C.errorSoft }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#C62828' }}>HOT</Text>
                </View>
              )}
            </View>

            <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink, lineHeight: 22, marginTop: 8, marginBottom: 10 }} numberOfLines={2}>
              {thread.title}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: thread.initColor + '20', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: thread.initColor + '40' }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: thread.initColor }}>{thread.initials[0]}</Text>
              </View>
              <Text style={{ flex: 1, fontSize: 12, color: C.inkSoft }}>{thread.user} · {thread.time}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="MessageCircle" size={13} color="#8C8278" />
                  <Text style={{ fontSize: 12, color: C.inkMute }}>{thread.replies}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="Eye" size={13} color="#8C8278" />
                  <Text style={{ fontSize: 12, color: C.inkMute }}>{thread.views}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        onPress={() => navigation.navigate('CreatePost')}
        style={{ position: 'absolute', bottom: 96, right: 20, width: 52, height: 52, borderRadius: 26, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center', shadowColor: '#E8591A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6 }}
        activeOpacity={0.85}
      >
        <Icon name="Plus" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
