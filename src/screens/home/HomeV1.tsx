import React, { useEffect } from 'react';
import {
  View, ScrollView, TouchableOpacity, Image,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackActions } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '@/navigation/types';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useStoriesStore, buildStoryGroups } from '@/store/stories.store';
import { useAuthStore } from '@/store/auth.store';
import { useFeedStore } from '@/store/feed.store';
import { useEventsStore } from '@/store/events.store';
import { useMessagesStore } from '@/store/messages.store';
import { useAuthGate } from '@/hooks/useAuthGate';
import { onTabBarScroll } from '@/navigation/tabBarScroll';
import { timeAgo } from '@/utils/timeAgo';

interface ShortcutDef {
  key: string;
  icon: Parameters<typeof Icon>[0]['name'];
  color: string;
  labelKey: string;
  onPress: () => void;
  badge?: number;
}

export default function HomeV1() {
  const C = useColors();
  const { t } = useTranslation();
  const nav = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const stories = useStoriesStore((s) => s.stories);
  const fetchStories = useStoriesStore((s) => s.fetchAll);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const events = useEventsStore((s) => s.getUpcoming());
  const fetchEvents = useEventsStore((s) => s.fetchAll);
  const posts = useFeedStore((s) => s.posts);
  const fetchPosts = useFeedStore((s) => s.fetchAll);
  const fetchConversations = useMessagesStore((s) => s.fetchConversations);
  const unreadMessages = useMessagesStore((s) => s.totalUnread());
  const { requireAuth } = useAuthGate();

  useEffect(() => {
    void fetchEvents();
    // Le fil est public (GET /community/posts est @Public) — accessible à un invité.
    void fetchPosts();
    // Les histoires et la messagerie exigent un compte côté backend —
    // inutile d'appeler ces endpoints pour un invité, ils 401raient.
    if (isAuthenticated) {
      void fetchStories();
      void fetchConversations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  const event = events[0];
  const recentPosts = posts.slice(0, 3);
  const storyGroups = buildStoryGroups(stories, user?.id);
  const myGroup = storyGroups.find((g) => g.isMine);
  const otherGroups = storyGroups.filter((g) => !g.isMine);

  const SHORTCUTS: ShortcutDef[] = [
    { key: 'scan',       icon: 'Camera',        color: '#E8591A', labelKey: 'home.shortcutScan',       onPress: () => nav.navigate('Camera') },
    { key: 'messages',   icon: 'MessageCircle', color: '#9C27B0', labelKey: 'home.shortcutMessages',   onPress: () => requireAuth(() => nav.navigate('ConversationsList')), badge: unreadMessages },
    { key: 'history',    icon: 'Clock',         color: '#2E7D32', labelKey: 'home.shortcutHistory',    onPress: () => requireAuth(() => nav.navigate('History')) },
    { key: 'restaurants',icon: 'MapPin',        color: '#1A237E', labelKey: 'home.shortcutRestaurants',onPress: () => nav.navigate('MapScreen') },
    { key: 'events',     icon: 'Calendar',      color: '#F9A825', labelKey: 'home.shortcutEvents',     onPress: () => nav.navigate('Events') },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      {/* En-tête fixe : avatar + barre de recherche (avec accès direct scan photo/voix) + cloche */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => requireAuth(() => nav.navigate('ProfileScreen'))} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={{ width: 36, height: 36 }} resizeMode="cover" />
          ) : user ? (
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700', fontFamily: 'Inter-Bold' }}>
              {((user.firstName?.charAt(0) ?? '') + (user.lastName?.charAt(0) ?? '')).toUpperCase() || '?'}
            </Text>
          ) : (
            <Icon name="User" size={16} color="#fff" />
          )}
        </TouchableOpacity>

        <View style={{ flex: 1, height: 44, backgroundColor: C.cream, borderWidth: 1, borderColor: C.border, borderRadius: 14, flexDirection: 'row', alignItems: 'center', paddingLeft: 12, paddingRight: 6, gap: 6 }}>
          <TouchableOpacity onPress={() => nav.navigate('Search')} style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 8 }} activeOpacity={0.7}>
            <Icon name="Search" size={16} color="#8C8278" />
            <Text style={{ flex: 1, color: C.inkMute, fontSize: 13 }} numberOfLines={1}>{t('home.search')}</Text>
          </TouchableOpacity>
          <View style={{ width: 1, height: 20, backgroundColor: C.border }} />
          <TouchableOpacity onPress={() => nav.navigate('Camera')} style={{ width: 30, height: 30, borderRadius: 9, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Camera" size={15} color="#6D4C41" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => nav.navigate('AudioText')} style={{ width: 30, height: 30, borderRadius: 9, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Mic" size={14} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center' }}
          onPress={() => nav.navigate('Notifications')}
        >
          <Icon name="Bell" size={18} color="#6D4C41" />
          <View style={{ position: 'absolute', top: 7, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#C62828', borderWidth: 1.5, borderColor: '#fff' }} />
        </TouchableOpacity>

        {/* Bascule de disposition (outil interne) */}
        <TouchableOpacity
          style={{ width: 38, height: 38, borderRadius: 10, borderWidth: 1, borderColor: '#E8591A', backgroundColor: '#FEF0E8', alignItems: 'center', justifyContent: 'center' }}
          onPress={() => nav.dispatch(StackActions.replace('HomeV2'))}
        >
          <Icon name="Grid" size={16} color="#E8591A" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        onScroll={onTabBarScroll}
        scrollEventThrottle={16}
      >

        {/* Carte scan — l'action la plus visible de l'écran */}
        <View style={{ padding: 16, paddingBottom: 0 }}>
          <TouchableOpacity
            style={{ backgroundColor: '#2C1810', borderRadius: 20, padding: 20, flexDirection: 'row', alignItems: 'center', gap: 16 }}
            onPress={() => nav.navigate('Camera')}
            activeOpacity={0.85}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 19, color: '#fff', lineHeight: 24 }}>
                {t('home.scanCTA')}
              </Text>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 6, lineHeight: 17 }}>
                {t('home.scanSubtitle')}
              </Text>
              <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
                {[t('scanner.photo'), t('scanner.audio'), t('scanner.text')].map((m, i) => (
                  <View key={i} style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.12)' }}>
                    <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '500' }}>{m}</Text>
                  </View>
                ))}
              </View>
            </View>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Camera" size={26} color="#fff" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Raccourcis */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingTop: 18, gap: 10 }}>
          {SHORTCUTS.map((s) => (
            <TouchableOpacity key={s.key} onPress={s.onPress} style={{ flex: 1, alignItems: 'center', gap: 6 }} activeOpacity={0.75}>
              <View>
                <View style={{ width: 52, height: 52, borderRadius: 16, backgroundColor: s.color + '18', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={s.icon} size={22} color={s.color} />
                </View>
                {!!s.badge && s.badge > 0 && (
                  <View style={{ position: 'absolute', top: -4, right: -4, minWidth: 18, height: 18, borderRadius: 9, backgroundColor: '#E8591A', borderWidth: 2, borderColor: C.cream, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 }}>
                    <Text style={{ fontSize: 9, fontWeight: '700', color: '#fff' }}>{s.badge > 9 ? '9+' : s.badge}</Text>
                  </View>
                )}
              </View>
              <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkSoft, textAlign: 'center' }} numberOfLines={2}>{t(s.labelKey)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Stories */}
        <View style={{ marginTop: 20, paddingLeft: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12, paddingRight: 16 }}>
            <Text style={{ color: C.ink, fontSize: 15, fontWeight: '700', fontFamily: 'Inter-Bold' }}>{t('home.dishStories')}</Text>
            <TouchableOpacity onPress={() => nav.navigate('AllStories')}>
              <Text style={{ fontSize: 11, color: '#E8591A', fontWeight: '600' }}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 16, gap: 14 }}>
            {/* Add / view your own story */}
            <TouchableOpacity
              style={{ alignItems: 'center', gap: 6 }}
              activeOpacity={0.75}
              onPress={() => myGroup ? nav.navigate('StoriesViewer', { authorId: myGroup.authorId }) : requireAuth(() => nav.navigate('StoryCreatorCamera'))}
            >
              <View style={{ width: 66, height: 66, borderRadius: 33, alignItems: 'center', justifyContent: 'center', backgroundColor: C.surface2, borderWidth: 2, borderColor: myGroup ? C.gold : C.border, borderStyle: myGroup ? 'solid' : 'dashed', overflow: 'hidden' }}>
                {myGroup ? (
                  myGroup.stories[myGroup.stories.length - 1].imageUrl ? (
                    <Image
                      source={{ uri: myGroup.stories[myGroup.stories.length - 1].imageUrl }}
                      style={{ width: '100%', height: '100%' }}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={{ width: '100%', height: '100%', backgroundColor: myGroup.stories[myGroup.stories.length - 1].backgroundColor ?? C.navy }} />
                  )
                ) : (
                  <Icon name="Plus" size={22} color="#E8591A" />
                )}
              </View>
              {myGroup && (
                <TouchableOpacity
                  onPress={() => requireAuth(() => nav.navigate('StoryCreatorCamera'))}
                  style={{ position: 'absolute', top: 40, right: -2, width: 22, height: 22, borderRadius: 11, backgroundColor: '#E8591A', borderWidth: 2, borderColor: C.cream, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Icon name="Plus" size={11} color="#fff" />
                </TouchableOpacity>
              )}
              <Text style={{ fontSize: 10.5, fontWeight: '500', color: C.inkSoft, maxWidth: 64, textAlign: 'center' }}>{t('home.yourStory')}</Text>
            </TouchableOpacity>

            {otherGroups.map((g, i) => {
              const last = g.stories[g.stories.length - 1];
              return (
                <TouchableOpacity
                  key={g.authorId}
                  style={{ alignItems: 'center', gap: 6 }}
                  activeOpacity={0.75}
                  onPress={() => nav.navigate('StoriesViewer', { authorId: g.authorId })}
                >
                  <View style={{ width: 66, height: 66, borderRadius: 33, padding: 2.5, borderWidth: 2, borderColor: i === 0 ? '#E8591A' : '#E5E0D8', overflow: 'hidden' }}>
                    <Image source={{ uri: last.imageUrl }} style={{ width: '100%', height: '100%', borderRadius: 28 }} resizeMode="cover" />
                  </View>
                  <Text style={{ fontSize: 10.5, fontWeight: '500', color: C.inkSoft, maxWidth: 64, textAlign: 'center' }}>{g.authorName}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Fil d'actualité — posts publiés par les utilisateurs et restaurants,
            comme sur Instagram (photo/texte pour tous, + "Événement" pour les
            comptes pro, cf. CreatePost.tsx). */}
        <View style={{ marginTop: 18, paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ color: C.ink, fontSize: 15, fontWeight: '700', fontFamily: 'Inter-Bold' }}>{t('community.feed')}</Text>
            <TouchableOpacity onPress={() => nav.navigate('Feed')}>
              <Text style={{ fontSize: 11, color: '#E8591A', fontWeight: '600' }}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          {recentPosts.length === 0 ? (
            <TouchableOpacity
              onPress={() => nav.navigate('Feed')}
              style={{ borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, borderRadius: 16, padding: 20, alignItems: 'center', gap: 6 }}
            >
              <Icon name="MessageSquare" size={26} color="#E5E0D8" />
              <Text style={{ color: C.inkMute, fontSize: 12 }}>{t('community.feedEmpty')}</Text>
            </TouchableOpacity>
          ) : (
            <View style={{ gap: 10 }}>
              {recentPosts.map((post) => {
                const isEvent = post.type === 'event';
                return (
                  <TouchableOpacity
                    key={post.id}
                    onPress={() => nav.navigate('Feed')}
                    activeOpacity={0.85}
                    style={{
                      backgroundColor: C.surface, borderWidth: 1, borderColor: isEvent ? '#F9A825' : C.border,
                      borderRadius: 16, padding: 12,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: post.avatarColor + '18', borderWidth: 1.5, borderColor: post.avatarColor + '40', alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ fontSize: 12, fontWeight: '700', color: post.avatarColor, fontFamily: 'Inter-Bold' }}>{post.initials[0]}</Text>
                      </View>
                      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink }} numberOfLines={1}>{post.authorName}</Text>
                        {/* Compte pro = admin-approuvé, certifie un vrai restaurant/établissement. */}
                        {post.authorRole === 'pro' && <Text style={{ fontSize: 12 }}>✅</Text>}
                      </View>
                      {isEvent && (
                        <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, backgroundColor: '#F9A82520' }}>
                          <Text style={{ fontSize: 10, fontWeight: '700', color: '#F9A825' }}>🎉 {t('community.postTypeEvent')}</Text>
                        </View>
                      )}
                      <Text style={{ fontSize: 10, color: C.inkMute }}>{timeAgo(post.createdAt)}</Text>
                    </View>
                    <Text style={{ fontSize: 13, color: C.inkSoft, lineHeight: 19, marginTop: 8 }} numberOfLines={2}>
                      {post.content}
                    </Text>
                    {post.imageUrl && (
                      <Image source={{ uri: post.imageUrl }} style={{ width: '100%', height: 140, borderRadius: 12, marginTop: 10 }} resizeMode="cover" />
                    )}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, marginTop: 10 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Icon name="Heart" size={14} color="#8C8278" />
                        <Text style={{ fontSize: 11, color: C.inkMute }}>{post.likes.length}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Icon name="MessageCircle" size={14} color="#8C8278" />
                        <Text style={{ fontSize: 11, color: C.inkMute }}>{post.comments.length}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Events this week */}
        <View style={{ marginTop: 18, paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{ color: C.ink, fontSize: 15, fontWeight: '700', fontFamily: 'Inter-Bold' }}>{t('home.eventsThisWeek')}</Text>
            <TouchableOpacity onPress={() => nav.navigate('AllEvents')}>
              <Text style={{ fontSize: 11, color: '#E8591A', fontWeight: '600' }}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          {event ? (
            <TouchableOpacity style={{ backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 16, overflow: 'hidden' }} activeOpacity={0.85} onPress={() => nav.navigate('EventDetail', { eventId: event.id })}>
              <View style={{ position: 'relative' }}>
                <View style={{ height: 128, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="Calendar" size={40} color="#E5E0D8" />
                </View>
                <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: '#C62828', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                  <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>
                    {new Date(event.startAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </Text>
                </View>
              </View>
              <View style={{ padding: 14 }}>
                <Text style={{ color: C.ink, fontSize: 14, fontWeight: '700', fontFamily: 'Inter-Bold' }}>{event.title}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <Icon name="MapPin" size={11} color="#8C8278" />
                  <Text style={{ color: C.inkMute, fontSize: 11 }}>{event.location} · {event.time}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon name="Users" size={12} color="#8C8278" />
                    <Text style={{ color: C.inkMute, fontSize: 11 }}>{event.registeredCount} {t('events.registeredCount')}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={(e) => { e.stopPropagation?.(); requireAuth(() => void useEventsStore.getState().toggleRegister(event.id)); }}
                    style={{ height: 36, paddingHorizontal: 16, backgroundColor: event.isRegistered ? C.successSoft : '#E8591A', borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: event.isRegistered ? 1 : 0, borderColor: C.success }}
                  >
                    <Text style={{ color: event.isRegistered ? C.success : '#fff', fontSize: 12, fontWeight: '700' }}>
                      {event.isRegistered ? t('events.registered') : t('events.register')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ) : (
            <View style={{ backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 24, alignItems: 'center' }}>
              <Icon name="Calendar" size={32} color="#E5E0D8" />
              <Text style={{ color: C.inkMute, fontSize: 12, marginTop: 8 }}>{t('events.noEvents')}</Text>
            </View>
          )}
        </View>

        {/* Jeux */}
        <View style={{ marginTop: 18, paddingHorizontal: 16, marginBottom: 8 }}>
          <Text style={{ color: C.ink, fontSize: 15, fontWeight: '700', fontFamily: 'Inter-Bold', marginBottom: 10 }}>
            {t('games.dailyChallenge')}
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: C.goldSoft, borderWidth: 1, borderColor: '#F9A825', borderRadius: 16, padding: 14 }}
            activeOpacity={0.85}
            onPress={() => requireAuth(() => nav.navigate('Games'))}
          >
            <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
              <View style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Flame" size={24} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.ink, fontSize: 14, fontWeight: '700', fontFamily: 'Inter-Bold' }}>{t('games.title')}</Text>
                <Text style={{ color: C.inkSoft, fontSize: 11, marginTop: 3 }}>
                  {user ? t('home.gamesTeaserAuthed', { level: user.level }) : t('home.gamesTeaser')}
                </Text>
              </View>
              <TouchableOpacity style={{ height: 36, paddingHorizontal: 14, backgroundColor: '#E8591A', borderRadius: 18, alignItems: 'center', justifyContent: 'center' }} onPress={() => requireAuth(() => nav.navigate('Games'))}>
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{t('games.play')}</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
