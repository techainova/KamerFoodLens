import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView,
  StatusBar, TextInput,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const STORIES = [
  { id: '0', name: '+', isAdd: true },
  { id: '1', name: 'Sami',      initials: 'SN', color: '#E8591A' },
  { id: '2', name: 'Ngo',       initials: 'NM', color: '#2E7D32' },
  { id: '3', name: 'Chef Joël', initials: 'CJ', color: '#F9A825' },
  { id: '4', name: 'Maman P',   initials: 'MP', color: '#E8591A' },
  { id: '5', name: 'Adèle',     initials: 'AB', color: '#1A237E' },
];

const POSTS = [
  {
    id: '1',
    user: 'Sami Nguimfack',
    initials: 'SN',
    badge: 'Chef · niv. 4',
    badgeColor: '#E8591A',
    time: '2h',
    text: "J'ai testé un nouveau Mbongo au poisson capitaine ce weekend à Edéa — vraiment incroyable ! La sauce noire avec les écorces fraîches donne une profondeur unique.",
    imageCaption: 'Mbongo Tchobi · Edéa',
    tags: ['#Mbongo', '#Edéa', '#LittoralCam'],
    likes: 128,
    comments: 24,
    liked: false,
    saved: false,
  },
  {
    id: '2',
    user: 'Maman Pauline',
    initials: 'MP',
    badge: 'Novice · niv. 1',
    badgecolor: '#8C8278',
    time: '4h',
    text: "Ma recette de Ndolé du dimanche, transmise par ma grand-mère. Le secret c'est les écorces fraîches et beaucoup d'amour.",
    imageCaption: 'Ndolé familial · Douala',
    tags: ['#Ndolé', '#Famille', '#Tradition'],
    likes: 312,
    comments: 56,
    liked: true,
    saved: true,
  },
  {
    id: '3',
    user: 'Chef Joël',
    initials: 'CJ',
    badge: 'Pro · Chef certifié',
    badgeColor: '#F9A825',
    time: '6h',
    text: "Masterclass Poulet DG demain à 14h sur Zoom — places limitées ! On va décortiquer la technique de dorure des plantains et la marinade express.",
    imageCaption: 'Poulet DG · Masterclass',
    tags: ['#PouletDG', '#Masterclass', '#Formation'],
    likes: 89,
    comments: 31,
    liked: false,
    saved: false,
  },
];

const TABS = ['Pour vous', 'Abonnements', 'Trending'];

export default function Feed() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const C = useColors();
  const [activeTab, setActiveTab] = useState(0);
  const [posts, setPosts] = useState(POSTS);

  const toggleLike = (id: string) => {
    setPosts(prev => prev.map(p =>
      p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p
    ));
  };

  const toggleSave = (id: string) => {
    setPosts(prev => prev.map(p => p.id === id ? { ...p, saved: !p.saved } : p));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>
          {t('community.feed')}
        </Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Search" size={17} color="#6D4C41" />
          </TouchableOpacity>
          <TouchableOpacity style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Bell" size={17} color="#6D4C41" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        {TABS.map((tab, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setActiveTab(i)}
            style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 2, borderColor: i === activeTab ? '#E8591A' : 'transparent' }}
          >
            <Text style={{ fontSize: 14, fontWeight: i === activeTab ? '700' : '500', color: i === activeTab ? '#E8591A' : '#8C8278' }}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Stories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 14, gap: 12 }}>
          {STORIES.map((s) => (
            <TouchableOpacity key={s.id} style={{ alignItems: 'center', gap: 6 }}>
              <View style={{
                width: 62, height: 62, borderRadius: 31, padding: 2,
                borderWidth: s.isAdd ? 1.5 : 2.5,
                borderStyle: s.isAdd ? 'dashed' : 'solid',
                borderColor: s.isAdd ? '#E5E0D8' : (s.color ?? '#E8591A'),
              }}>
                <View style={{ flex: 1, borderRadius: 28, backgroundColor: s.isAdd ? '#F5F0EB' : (s.color ?? '#E8591A') + '20', alignItems: 'center', justifyContent: 'center' }}>
                  {s.isAdd ? (
                    <Icon name="Plus" size={20} color="#8C8278" />
                  ) : (
                    <Text style={{ fontSize: 16, fontWeight: '700', color: s.color ?? '#E8591A', fontFamily: 'Inter-Bold' }}>
                      {s.initials?.[0]}
                    </Text>
                  )}
                </View>
              </View>
              <Text style={{ fontSize: 11, color: C.inkSoft, maxWidth: 56, textAlign: 'center' }} numberOfLines={1}>{s.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Posts */}
        <View style={{ paddingHorizontal: 0 }}>
          {posts.map((post) => (
            <View key={post.id} style={{ marginBottom: 2, borderTopWidth: 1, borderColor: C.border, backgroundColor: C.surface, paddingVertical: 16 }}>

              {/* Header */}
              <View style={{ paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: post.badgeColor + '18', borderWidth: 1.5, borderColor: post.badgeColor + '40', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: post.badgeColor, fontFamily: 'Inter-Bold' }}>{post.initials[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, fontFamily: 'Inter-Bold' }}>{post.user}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 1 }}>
                    <View style={{ paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8, backgroundColor: post.badgeColor + '15' }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: post.badgeColor, fontFamily: 'Inter-Bold' }}>{post.badge}</Text>
                    </View>
                    <Text style={{ fontSize: 11, color: C.inkMute }}>· {post.time}</Text>
                  </View>
                </View>
                <TouchableOpacity style={{ padding: 6 }}>
                  <Icon name="MoreHorizontal" size={18} color="#8C8278" />
                </TouchableOpacity>
              </View>

              {/* Text */}
              <Text style={{ paddingHorizontal: 16, fontSize: 14, color: C.ink, lineHeight: 22, marginBottom: 10 }}>
                {post.text}
              </Text>

              {/* Image placeholder */}
              <View style={{ marginHorizontal: 16, height: 200, borderRadius: 16, backgroundColor: C.surface2, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Icon name="Camera" size={32} color="rgba(140,130,120,0.3)" />
                <Text style={{ color: C.inkMute, fontSize: 11, fontStyle: 'italic', marginTop: 6 }}>{post.imageCaption}</Text>
              </View>

              {/* Tags */}
              <View style={{ paddingHorizontal: 16, flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                {post.tags.map(tag => (
                  <TouchableOpacity key={tag} style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface2 }}>
                    <Text style={{ fontSize: 12, color: C.inkSoft, fontWeight: '500' }}>{tag}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Actions */}
              <View style={{ paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                <TouchableOpacity onPress={() => toggleLike(post.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <Icon name="Heart" size={20} color={post.liked ? '#E8591A' : '#8C8278'} fill={post.liked ? '#E8591A' : 'none'} />
                  <Text style={{ fontSize: 13, color: post.liked ? '#E8591A' : '#8C8278', fontWeight: '500' }}>{post.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <Icon name="MessageCircle" size={20} color="#8C8278" />
                  <Text style={{ fontSize: 13, color: C.inkMute, fontWeight: '500' }}>{post.comments}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                  <Icon name="Share2" size={18} color="#8C8278" />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <TouchableOpacity onPress={() => toggleSave(post.id)}>
                  <Icon name="Bookmark" size={20} color={post.saved ? '#E8591A' : '#8C8278'} fill={post.saved ? '#E8591A' : 'none'} />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
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
