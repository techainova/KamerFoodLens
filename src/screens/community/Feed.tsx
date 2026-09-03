import React, { useEffect, useMemo, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Image,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useFeedStore } from '@/store/feed.store';
import { useStoriesStore, buildStoryGroups } from '@/store/stories.store';
import { useAuthStore } from '@/store/auth.store';

const TABS = ['Pour vous', 'Trending'];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return 'À l\'instant';
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}j`;
}

export default function Feed() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const C = useColors();
  const [activeTab, setActiveTab] = useState(0);

  const posts = useFeedStore(s => s.posts);
  const isLoading = useFeedStore(s => s.isLoading);
  const fetchPosts = useFeedStore(s => s.fetchAll);
  const toggleLike = useFeedStore(s => s.toggleLike);

  const stories = useStoriesStore(s => s.stories);
  const fetchStories = useStoriesStore(s => s.fetchAll);

  const user = useAuthStore(s => s.user);
  const storyGroups = useMemo(() => buildStoryGroups(stories, user?.id), [stories, user?.id]);

  useEffect(() => {
    void fetchPosts();
    void fetchStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sorted = [...posts].sort((a, b) => {
    if (activeTab === 1) return b.likes.length - a.likes.length;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

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
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        {TABS.map((tab, i) => (
          <TouchableOpacity key={i} onPress={() => setActiveTab(i)}
            style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 2, borderColor: i === activeTab ? '#E8591A' : 'transparent' }}>
            <Text style={{ fontSize: 14, fontWeight: i === activeTab ? '700' : '500', color: i === activeTab ? '#E8591A' : '#8C8278' }}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Stories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 14, gap: 12 }}>
          <TouchableOpacity onPress={() => navigation.navigate('StoryCreatorCamera')} style={{ alignItems: 'center', gap: 6 }}>
            <View style={{ width: 62, height: 62, borderRadius: 31, padding: 2, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#E5E0D8' }}>
              <View style={{ flex: 1, borderRadius: 28, backgroundColor: '#F5F0EB', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Plus" size={20} color="#8C8278" />
              </View>
            </View>
            <Text style={{ fontSize: 11, color: C.inkSoft }}>{t('community.me')}</Text>
          </TouchableOpacity>
          {storyGroups.map((g) => (
            <TouchableOpacity key={g.authorId} onPress={() => navigation.navigate('StoriesViewer', { authorId: g.authorId })} style={{ alignItems: 'center', gap: 6 }}>
              <View style={{
                width: 62, height: 62, borderRadius: 31, padding: 2,
                borderWidth: 2.5, borderColor: g.stories[0].avatarColor,
              }}>
                <View style={{ flex: 1, borderRadius: 28, overflow: 'hidden' }}>
                  {g.stories[g.stories.length - 1].imageUrl ? (
                    <Image source={{ uri: g.stories[g.stories.length - 1].imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  ) : (
                    <View style={{ width: '100%', height: '100%', backgroundColor: g.stories[g.stories.length - 1].backgroundColor ?? C.navy }} />
                  )}
                </View>
              </View>
              <Text style={{ fontSize: 11, color: C.inkSoft, maxWidth: 56, textAlign: 'center' }} numberOfLines={1}>{g.authorName}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Posts */}
        {isLoading && posts.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 60 }}>
            <ActivityIndicator color="#E8591A" />
          </View>
        ) : (
          <View>
            {sorted.map((post) => {
              const badgeColor = post.authorRole === 'pro' ? '#F9A825' : '#E8591A';
              const badge = post.authorRole === 'pro' ? t('community.badgePro') : t('community.badgeStandard');
              const likedByMe = !!user && post.likes.includes(user.id);
              return (
                <View key={post.id} style={{ marginBottom: 2, borderTopWidth: 1, borderColor: C.border, backgroundColor: C.surface, paddingVertical: 16 }}>

                  {/* Header */}
                  <View style={{ paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: post.avatarColor + '18', borderWidth: 1.5, borderColor: post.avatarColor + '40', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: post.avatarColor, fontFamily: 'Inter-Bold' }}>{post.initials[0]}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, fontFamily: 'Inter-Bold' }}>{post.authorName}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 1 }}>
                        <View style={{ paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8, backgroundColor: badgeColor + '15' }}>
                          <Text style={{ fontSize: 10, fontWeight: '700', color: badgeColor, fontFamily: 'Inter-Bold' }}>{badge}</Text>
                        </View>
                        <Text style={{ fontSize: 11, color: C.inkMute }}>· {timeAgo(post.createdAt)}</Text>
                      </View>
                    </View>
                  </View>

                  {/* Text */}
                  <Text style={{ paddingHorizontal: 16, fontSize: 14, color: C.ink, lineHeight: 22, marginBottom: 10 }}>
                    {post.content}
                  </Text>

                  {/* Image */}
                  {post.imageUrl && (
                    <Image source={{ uri: post.imageUrl }} style={{ marginHorizontal: 16, height: 180, borderRadius: 16, marginBottom: 10 }} resizeMode="cover" />
                  )}

                  {/* Actions */}
                  <View style={{ paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <TouchableOpacity onPress={() => void toggleLike(post.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                      <Icon name="Heart" size={20} color={likedByMe ? '#E8591A' : '#8C8278'} fill={likedByMe ? '#E8591A' : 'none'} />
                      <Text style={{ fontSize: 13, color: likedByMe ? '#E8591A' : '#8C8278', fontWeight: '500' }}>{post.likes.length}</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                      <Icon name="MessageCircle" size={20} color="#8C8278" />
                      <Text style={{ fontSize: 13, color: C.inkMute, fontWeight: '500' }}>{post.comments.length}</Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        onPress={() => navigation.navigate('CreatePost')}
        style={{ position: 'absolute', bottom: 24, right: 20, width: 52, height: 52, borderRadius: 26, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center', shadowColor: '#E8591A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.4, shadowRadius: 10, elevation: 6 }}
        activeOpacity={0.85}
      >
        <Icon name="Plus" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
