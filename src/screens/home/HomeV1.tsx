// Accueil — fil d'actualité gastronomique, calqué trait pour trait sur
// Instagram (barre du haut, stories, fil de publications) avec les touches
// KFL : tag de plat, encart événement, badge Pro vérifié, carrousel multi-média.
import React, { useEffect, useRef, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, Image, Dimensions, Share, Platform, type NativeSyntheticEvent, type NativeScrollEvent,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParamList } from '@/navigation/types';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useStoriesStore, buildStoryGroups } from '@/store/stories.store';
import { useAuthStore } from '@/store/auth.store';
import { useFeedStore } from '@/store/feed.store';
import { useMessagesStore } from '@/store/messages.store';
import { useNotificationsStore } from '@/store/notifications.store';
import { useFavoritesStore } from '@/store/favorites.store';
import { useAuthGate } from '@/hooks/useAuthGate';
import { onTabBarScroll } from '@/navigation/tabBarScroll';
import { timeAgo } from '@/utils/timeAgo';
import type { FeedPost } from '@/services/community.service';
import PostCommentsModal from '@/screens/community/PostCommentsModal';

const { width: SCREEN_W } = Dimensions.get('window');

function Wordmark({ color }: { color: string }) {
  return (
    <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontStyle: 'italic', fontSize: 22, color, letterSpacing: -0.4 }}>
      KamerFoodLens
    </Text>
  );
}

// Un item du carrousel — vidéo lue seulement quand c'est la page affichée,
// pour ne pas garder plusieurs lecteurs vidéo actifs en même temps dans le fil.
function CarouselVideo({ uri, active }: { uri: string; active: boolean }) {
  const player = useVideoPlayer(uri, (p) => { p.loop = true; p.muted = true; });
  useEffect(() => {
    if (active) player.play(); else player.pause();
  }, [active, player]);
  return <VideoView player={player} style={{ width: '100%', height: '100%' }} contentFit="cover" nativeControls={false} />;
}

function MediaCarousel({ media, cardWidth }: { media: FeedPost['media']; cardWidth: number }) {
  const [index, setIndex] = useState(0);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / cardWidth);
    if (i !== index) setIndex(i);
  };

  if (media.length === 0) return null;

  return (
    <View>
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={32}
      >
        {media.map((m, i) => (
          <View key={i} style={{ width: cardWidth, aspectRatio: 1, backgroundColor: '#000' }}>
            {m.type === 'video' ? (
              <CarouselVideo uri={m.url} active={i === index} />
            ) : (
              <Image source={{ uri: m.url }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            )}
          </View>
        ))}
      </ScrollView>
      {media.length > 1 && (
        <View style={{ position: 'absolute', top: 10, right: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.55)' }}>
          <Text style={{ color: '#fff', fontSize: 10.5, fontWeight: '700' }}>{index + 1}/{media.length}</Text>
        </View>
      )}
      {media.length > 1 && (
        <View style={{ position: 'absolute', bottom: 8, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 4 }}>
          {media.map((_, i) => (
            <View key={i} style={{ width: i === index ? 6 : 5, height: i === index ? 6 : 5, borderRadius: 3, backgroundColor: i === index ? '#fff' : 'rgba(255,255,255,0.5)' }} />
          ))}
        </View>
      )}
    </View>
  );
}

function FeedPostCard({ post, onOpenComments }: { post: FeedPost; onOpenComments: (post: FeedPost) => void }) {
  const C = useColors();
  const nav = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const { requireAuth } = useAuthGate();
  const toggleLike = useFeedStore((s) => s.toggleLike);
  const myId = useAuthStore((s) => s.user?.id);
  const liked = !!myId && post.likes.includes(myId);
  const isEvent = post.type === 'event';
  const toggleFavorite = useFavoritesStore((s) => s.toggle);
  const bookmarked = useFavoritesStore((s) => s.favorites.some((f) => f.itemId === post.id));

  const handleShare = () => {
    const message = `${post.authorName} sur KamerFoodLens : ${post.content}`.slice(0, 500);
    if (Platform.OS === 'web') {
      const nav = (globalThis as {
        navigator?: { share?: (data: { text: string }) => Promise<void>; clipboard?: { writeText: (t: string) => Promise<void> } };
      }).navigator;
      if (nav?.share) {
        void nav.share({ text: message }).catch(() => {});
      } else if (nav?.clipboard) {
        void nav.clipboard.writeText(message).catch(() => {});
      }
      return;
    }
    void Share.share({ message });
  };

  return (
    <View style={{ borderBottomWidth: 0.5, borderColor: C.border, paddingBottom: 6 }}>
      {/* En-tête */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10 }}>
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: post.avatarColor + '18', borderWidth: 1.5, borderColor: post.avatarColor + '40', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: post.avatarColor }}>{post.initials}</Text>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 13.5, fontWeight: '700', color: C.ink }} numberOfLines={1}>{post.authorName}</Text>
            {post.authorRole === 'pro' && (
              <>
                <Icon name="CheckCircle" size={13} color="#1565C0" />
                <View style={{ paddingHorizontal: 5, paddingVertical: 1.5, borderRadius: 5, backgroundColor: C.primarySoft }}>
                  <Text style={{ fontSize: 9, fontWeight: '800', color: C.primary, letterSpacing: 0.3 }}>PRO</Text>
                </View>
              </>
            )}
          </View>
          <Text style={{ fontSize: 11, color: C.inkMute }}>{timeAgo(post.createdAt)}</Text>
        </View>
        <Icon name="MoreHorizontal" size={19} color={C.inkSoft} />
      </View>

      {/* Média — carrousel photos/vidéos */}
      <View style={{ position: 'relative' }}>
        <MediaCarousel media={post.media} cardWidth={SCREEN_W} />
        {isEvent && post.media.length > 0 && (
          <View style={{ position: 'absolute', top: 10, left: 10, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, backgroundColor: C.error }}>
            <Text style={{ color: '#fff', fontSize: 10.5, fontWeight: '800', letterSpacing: 0.4 }}>ÉVÉNEMENT</Text>
          </View>
        )}
      </View>

      {isEvent && (
        <TouchableOpacity
          onPress={() => nav.navigate('Events')}
          style={{ margin: 12, marginTop: post.media.length > 0 ? 10 : 0, padding: 11, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, flexDirection: 'row', alignItems: 'center', gap: 8 }}
        >
          <Icon name="Calendar" size={16} color={C.error} />
          <Text style={{ flex: 1, fontSize: 12.5, fontWeight: '700', color: C.ink }}>Voir les événements à venir</Text>
          <Icon name="ChevronRight" size={15} color={C.inkMute} />
        </TouchableOpacity>
      )}

      {/* Actions */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15, paddingHorizontal: 12, paddingTop: 11 }}>
        <TouchableOpacity onPress={() => requireAuth(() => void toggleLike(post.id))}>
          <Icon name="Heart" size={25} color={liked ? C.primary : C.ink} fill={liked ? C.primary : 'none'} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onOpenComments(post)}>
          <Icon name="MessageCircle" size={24} color={C.ink} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare}>
          <Icon name="Send" size={22} color={C.ink} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => requireAuth(() => void toggleFavorite('post', post.id))} style={{ marginLeft: 'auto' }}>
          <Icon name="Bookmark" size={22} color={C.ink} fill={bookmarked ? C.ink : 'none'} />
        </TouchableOpacity>
      </View>

      {/* Meta */}
      <View style={{ paddingHorizontal: 12, paddingTop: 7 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink }}>{post.likes.length} J'aime</Text>
        <Text style={{ fontSize: 13, marginTop: 4, lineHeight: 18, color: C.ink }}>
          <Text style={{ fontWeight: '700' }}>{post.authorName}</Text> {post.content}
        </Text>
        <TouchableOpacity onPress={() => onOpenComments(post)}>
          <Text style={{ fontSize: 12.5, color: C.inkMute, marginTop: 5 }}>
            {post.comments.length > 0
              ? `Voir les ${post.comments.length} commentaire${post.comments.length > 1 ? 's' : ''}`
              : 'Ajouter un commentaire…'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function HomeV1() {
  const C = useColors();
  const { t } = useTranslation();
  const nav = useNavigation<NativeStackNavigationProp<HomeStackParamList>>();
  const stories = useStoriesStore((s) => s.stories);
  const fetchStories = useStoriesStore((s) => s.fetchAll);
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const posts = useFeedStore((s) => s.posts);
  const fetchPosts = useFeedStore((s) => s.fetchAll);
  const fetchConversations = useMessagesStore((s) => s.fetchConversations);
  const unreadMessages = useMessagesStore((s) => s.totalUnread());
  const unreadNotifications = useNotificationsStore((s) => s.unreadCount);
  const fetchFavorites = useFavoritesStore((s) => s.fetchAll);
  const { requireAuth } = useAuthGate();
  const [commentsPost, setCommentsPost] = useState<FeedPost | null>(null);

  useEffect(() => {
    // Le fil est public (GET /community/posts est @Public) — accessible à un invité.
    void fetchPosts();
    // Les histoires et la messagerie exigent un compte côté backend —
    // inutile d'appeler ces endpoints pour un invité, ils 401raient.
    if (isAuthenticated) {
      void fetchStories();
      void fetchConversations();
      void fetchFavorites();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated]);

  // Le modal affiche l'état vivant du post (nouveaux commentaires) — on
  // recherche par id dans le store plutôt que de garder une copie figée.
  const livePost = commentsPost ? posts.find((p) => p.id === commentsPost.id) ?? commentsPost : null;

  const storyGroups = buildStoryGroups(stories, user?.id);
  const myGroup = storyGroups.find((g) => g.isMine);
  const otherGroups = storyGroups.filter((g) => !g.isMine);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }} edges={['top', 'left', 'right']}>
      {/* Barre du haut — façon Instagram */}
      <View style={{ height: 50, paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <TouchableOpacity onPress={() => requireAuth(() => nav.navigate('CreatePost'))} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="Plus" size={26} color={C.ink} />
        </TouchableOpacity>
        <Wordmark color={C.ink} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <TouchableOpacity onPress={() => requireAuth(() => nav.navigate('Notifications'))} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Icon name="Bell" size={25} color={C.ink} />
            {unreadNotifications > 0 && (
              <View style={{ position: 'absolute', top: 1, right: 1, minWidth: 15, height: 15, paddingHorizontal: 3, borderRadius: 8, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: C.cream }}>
                <Text style={{ fontSize: 9, fontWeight: '800', color: '#fff' }}>{unreadNotifications > 9 ? '9+' : unreadNotifications}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => requireAuth(() => nav.navigate('ConversationsList'))} style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <Icon name="Send" size={24} color={C.ink} />
            {unreadMessages > 0 && (
              <View style={{ position: 'absolute', top: 1, right: 1, minWidth: 15, height: 15, paddingHorizontal: 3, borderRadius: 8, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: C.cream }}>
                <Text style={{ fontSize: 9, fontWeight: '800', color: '#fff' }}>{unreadMessages > 9 ? '9+' : unreadMessages}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        onScroll={onTabBarScroll}
        scrollEventThrottle={16}
      >
        {/* Stories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 14, paddingHorizontal: 12, paddingVertical: 11, borderBottomWidth: 0.5, borderColor: C.border }}
        >
          <TouchableOpacity
            style={{ alignItems: 'center', gap: 5, width: 66 }}
            activeOpacity={0.75}
            onPress={() => myGroup ? nav.navigate('StoriesViewer', { authorId: myGroup.authorId }) : requireAuth(() => nav.navigate('StoryCreatorCamera'))}
          >
            <View style={{ position: 'relative' }}>
              <View style={{ width: 62, height: 62, borderRadius: 31, alignItems: 'center', justifyContent: 'center', backgroundColor: C.surface2, borderWidth: 2, borderColor: myGroup ? C.gold : C.border, borderStyle: myGroup ? 'solid' : 'dashed', overflow: 'hidden' }}>
                {myGroup ? (
                  myGroup.stories[myGroup.stories.length - 1].imageUrl ? (
                    <Image source={{ uri: myGroup.stories[myGroup.stories.length - 1].imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  ) : (
                    <View style={{ width: '100%', height: '100%', backgroundColor: myGroup.stories[myGroup.stories.length - 1].backgroundColor ?? C.navy }} />
                  )
                ) : (
                  <Icon name="Plus" size={22} color={C.primary} />
                )}
              </View>
              {myGroup && (
                <TouchableOpacity
                  onPress={() => requireAuth(() => nav.navigate('StoryCreatorCamera'))}
                  style={{ position: 'absolute', bottom: -1, right: -1, width: 20, height: 20, borderRadius: 10, backgroundColor: C.primary, borderWidth: 2.5, borderColor: C.cream, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Icon name="Plus" size={11} color="#fff" />
                </TouchableOpacity>
              )}
            </View>
            <Text numberOfLines={1} style={{ fontSize: 11, color: C.inkSoft, maxWidth: 66, textAlign: 'center' }}>{t('home.yourStory')}</Text>
          </TouchableOpacity>

          {otherGroups.map((g) => {
            const last = g.stories[g.stories.length - 1];
            return (
              <TouchableOpacity key={g.authorId} style={{ alignItems: 'center', gap: 5, width: 66 }} activeOpacity={0.75} onPress={() => nav.navigate('StoriesViewer', { authorId: g.authorId })}>
                <View style={{ width: 62, height: 62, borderRadius: 31, padding: 2.5, borderWidth: 2, borderColor: C.primary, overflow: 'hidden' }}>
                  <Image source={{ uri: last.imageUrl }} style={{ width: '100%', height: '100%', borderRadius: 28 }} resizeMode="cover" />
                </View>
                <Text numberOfLines={1} style={{ fontSize: 11, color: C.inkSoft, maxWidth: 66, textAlign: 'center' }}>{g.authorName}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Fil d'actualité */}
        {posts.length === 0 ? (
          <View style={{ alignItems: 'center', paddingTop: 60, paddingHorizontal: 30 }}>
            <Icon name="MessageSquare" size={32} color={C.border} />
            <Text style={{ color: C.inkMute, fontSize: 13, marginTop: 10, textAlign: 'center' }}>{t('community.feedEmpty')}</Text>
          </View>
        ) : (
          posts.map((post) => <FeedPostCard key={post.id} post={post} onOpenComments={setCommentsPost} />)
        )}
      </ScrollView>

      <PostCommentsModal post={livePost} onClose={() => setCommentsPost(null)} />
    </SafeAreaView>
  );
}
