import React, { useEffect, useMemo, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, TextInput, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { useForumStore, FORUM_CATEGORIES } from '@/store/forum.store';
import { useAuthStore } from '@/store/auth.store';

const CAT_COLORS: Record<string, string> = {
  Recettes:      '#E8591A',
  Restaurants:   '#1A237E',
  Ingrédients:   '#2E7D32',
  Astuces:       '#9C27B0',
  Événements:    '#F9A825',
  Général:       '#8C8278',
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'À l\'instant';
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return d === 1 ? '1j' : `${d}j`;
}

export default function Forum() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const allLabel = t('common.all');
  const CATEGORIES = [allLabel, ...FORUM_CATEGORIES];
  const [activeCategory, setActiveCategory] = useState(allLabel);
  const [search, setSearch] = useState('');

  const threads = useForumStore(s => s.threads);
  const isLoading = useForumStore(s => s.isLoading);
  const fetchAll = useForumStore(s => s.fetchAll);
  const toggleThreadLike = useForumStore(s => s.toggleThreadLike);
  const user = useAuthStore(s => s.user);

  useEffect(() => {
    void fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = threads.filter(thread => {
    const matchCat = activeCategory === allLabel || thread.category === activeCategory;
    const matchSearch = !search || thread.title.toLowerCase().includes(search.toLowerCase());
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
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('community.forum')}</Text>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface2, borderRadius: 12, paddingHorizontal: 12, height: 40 }}>
          <Icon name="Search" size={15} color="#8C8278" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder={t('community.newDiscussion')}
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

      {isLoading && threads.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#E8591A" />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingVertical: 12, paddingHorizontal: 16, gap: 10, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
          {filtered.length === 0 && (
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
              <Icon name="MessageSquare" size={48} color="rgba(140,130,120,0.3)" />
              <Text style={{ fontSize: 15, color: C.inkMute, marginTop: 12 }}>{t('community.noResults')}</Text>
            </View>
          )}
          {filtered.map(thread => {
            const catColor = CAT_COLORS[thread.category] ?? '#8C8278';
            const isHot = thread.replyCount > 1 || thread.views > 200;
            const likedByMe = !!user && thread.likes.includes(user.id);
            return (
              <TouchableOpacity
                key={thread.id}
                onPress={() => navigation.navigate('ForumDetail', { threadId: thread.id })}
                activeOpacity={0.85}
                style={{ backgroundColor: C.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: '#E5E0D8', ...SHADOW_SM }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: catColor + '15' }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: catColor }}>{thread.category}</Text>
                  </View>
                  {isHot && (
                    <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: C.errorSoft }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: '#C62828' }}>HOT</Text>
                    </View>
                  )}
                </View>

                <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink, lineHeight: 22, marginTop: 8, marginBottom: 10 }} numberOfLines={2}>
                  {thread.title}
                </Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ width: 26, height: 26, borderRadius: 13, backgroundColor: thread.avatarColor + '20', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: thread.avatarColor + '40' }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: thread.avatarColor }}>{thread.initials[0]}</Text>
                  </View>
                  <Text style={{ flex: 1, fontSize: 12, color: C.inkSoft }}>{thread.authorName} · {timeAgo(thread.createdAt)}</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <TouchableOpacity onPress={() => void toggleThreadLike(thread.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Icon name="Heart" size={13} color={likedByMe ? '#E8591A' : '#8C8278'} fill={likedByMe ? '#E8591A' : 'none'} />
                      <Text style={{ fontSize: 12, color: C.inkMute }}>{thread.likes.length}</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Icon name="MessageCircle" size={13} color="#8C8278" />
                      <Text style={{ fontSize: 12, color: C.inkMute }}>{thread.replyCount}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Icon name="Eye" size={13} color="#8C8278" />
                      <Text style={{ fontSize: 12, color: C.inkMute }}>{thread.views}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {/* FAB */}
      <TouchableOpacity
        onPress={() => navigation.navigate('CreateThread')}
        style={{ position: 'absolute', bottom: 24, right: 20, width: 52, height: 52, borderRadius: 26, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center', shadowColor: '#E8591A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6 }}
        activeOpacity={0.85}
      >
        <Icon name="Plus" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
