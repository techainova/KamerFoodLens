import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, Image,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon, { type IconName } from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/store/auth.store';
import { useFavoritesStore } from '@/store/favorites.store';
import { useStoriesStore } from '@/store/stories.store';
import ProfilePro from '@/screens/user_v3/ProfilePro';
import StoryHighlightBar from '@/screens/home/story-stickers/StoryHighlightBar';
import { SHADOW_SM, SHADOW_MD, SHADOW_LG } from '@/constants/theme';
import { onTabBarScroll } from '@/navigation/tabBarScroll';
import { useRestaurantStore } from '@/store/restaurant.store';
import { useCoursesStore } from '@/store/courses.store';
import { useEventsStore } from '@/store/events.store';
import { usersService, type UserStats, type MyReview } from '@/services/users.service';
import { communityService, type FeedPost } from '@/services/community.service';
import { gamesService, type Badge } from '@/services/games.service';
import { ordersService } from '@/services/orders.service';


export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const user = useAuthStore((s) => s.user);
  const favorites = useFavoritesStore((s) => s.favorites);
  const fetchFavorites = useFavoritesStore((s) => s.fetchAll);
  const highlights = useStoriesStore((s) => s.highlights);
  const fetchHighlights = useStoriesStore((s) => s.fetchHighlights);
  const followedRestaurants = useRestaurantStore((s) => s.followed);
  const fetchFollowed = useRestaurantStore((s) => s.fetchFollowed);
  const myCourses = useCoursesStore((s) => s.myCourses);
  const fetchMyCourses = useCoursesStore((s) => s.fetchMyCourses);
  const upcomingEvents = useEventsStore((s) => s.getRegistered());
  const fetchEvents = useEventsStore((s) => s.fetchAll);

  const [stats, setStats] = useState<UserStats | null>(null);
  const [myPosts, setMyPosts] = useState<FeedPost[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [myReviews, setMyReviews] = useState<MyReview[]>([]);
  const [ordersCount, setOrdersCount] = useState(0);

  useEffect(() => {
    void fetchFavorites();
    if (user?.id) void fetchHighlights(user.id);
    void fetchFollowed();
    void fetchMyCourses();
    void fetchEvents();
    void usersService.getMyStats().then(setStats).catch(() => setStats(null));
    void usersService.getMyReviews().then(setMyReviews).catch(() => setMyReviews([]));
    void gamesService.getMyBadges().then(setBadges).catch(() => setBadges([]));
    void ordersService.getList(1).then((r) => setOrdersCount(r.total)).catch(() => setOrdersCount(0));
    if (user?.id) {
      void communityService.getFeed(1, user.id).then((r) => setMyPosts(r.items)).catch(() => setMyPosts([]));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const TABS = [t('profile.tabPublications'), t('profile.favorites'), t('profile.badges'), t('profile.tabAvis')];

  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Invité';
  const avatarInitial = (user?.firstName?.charAt(0) || '?').toUpperCase() + (user?.lastName?.charAt(0) || '').toUpperCase();

  // Compte Pro actif → profil restaurant/business (badge PRO, stats business, accès Dashboard)
  if (user?.role === 'pro') {
    return <ProfilePro />;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('profile.title')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="Edit" size={16} color={C.inkSoft} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="Settings" size={16} color={C.inkSoft} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        onScroll={onTabBarScroll}
        scrollEventThrottle={16}
      >

        {/* Avatar & identity */}
        <View style={{ alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 }}>
          <View style={{ position: 'relative' }}>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} activeOpacity={0.8}>
              <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {user?.avatar ? (
                  <Image source={{ uri: user.avatar }} style={{ width: 96, height: 96 }} resizeMode="cover" />
                ) : (
                  <Text style={{ fontSize: 32, fontWeight: '600', color: C.inkMute, fontFamily: 'Inter-Bold' }}>{avatarInitial}</Text>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
              style={{ position: 'absolute', bottom: 0, left: -4, width: 30, height: 30, borderRadius: 15, backgroundColor: C.primary, borderWidth: 2, borderColor: C.cream, alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="Camera" size={14} color="#fff" />
            </TouchableOpacity>
            <View style={{ position: 'absolute', bottom: 0, right: -4, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: C.primary, borderRadius: 10, borderWidth: 2, borderColor: C.cream }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>{t('profile.levelN', { n: user?.level ?? 1 })}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 22, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginTop: 10, marginBottom: 2 }}>{fullName}</Text>
          <Text style={{ fontSize: 12, color: C.inkMute }}>@{user?.username ?? 'invite'}{user?.location ? ` · ${user.location}` : ''}</Text>
          {!!user?.bio && (
            <Text style={{ fontSize: 13, color: C.inkSoft, maxWidth: 280, marginTop: 10, textAlign: 'center', lineHeight: 20 }}>
              {user.bio}
            </Text>
          )}
        </View>

        {/* Stats row — données réelles (aucun système de "followers" entre utilisateurs
            n'existe côté backend ; on affiche donc les statistiques qui ont un sens et
            qui sont réellement synchronisées avec la base). */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 14, borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.border }}>
          {[
            { value: String(stats?.recipesCount ?? 0),      labelKey: 'profile.recipesCount' },
            { value: String(stats?.scansCount ?? 0),        labelKey: 'profile.scans'        },
            { value: String(stats?.postsCount ?? 0),        labelKey: 'profile.tabPublications' },
            { value: String(followedRestaurants.length),    labelKey: 'profile.followedRestaurants' },
          ].map((stat, i) => (
            <View key={i} style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: C.ink, fontFamily: 'Inter-Bold' }}>{stat.value}</Text>
              <Text style={{ fontSize: 10, color: C.inkMute, marginTop: 1 }}>{t(stat.labelKey)}</Text>
            </View>
          ))}
        </View>

        {/* Edit button */}
        <View style={{ padding: 16 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            style={{ height: 48, borderWidth: 1.5, borderColor: C.success, borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: C.success }}>{t('profile.edit')}</Text>
          </TouchableOpacity>
        </View>

        {/* Restaurants suivis */}
        {followedRestaurants.length > 0 && (
          <View style={{ paddingTop: 4 }}>
            <View style={{ paddingHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 10 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink }}>{t('profile.followedRestaurants', 'Restaurants suivis')}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ paddingHorizontal: 16, gap: 14, alignItems: 'center' }}>
              {followedRestaurants.map((r) => (
                <TouchableOpacity key={r.id} onPress={() => navigation.navigate('Restaurant', { restaurantId: r.id })} style={{ width: 76, alignItems: 'center' }}>
                  <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                    {r.imageUrl ? (
                      <Image source={{ uri: r.imageUrl }} style={{ width: 60, height: 60 }} resizeMode="cover" />
                    ) : (
                      <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>{r.name.slice(0, 2).toUpperCase()}</Text>
                    )}
                  </View>
                  <Text numberOfLines={1} style={{ fontSize: 10.5, fontWeight: '700', color: C.ink, marginTop: 4 }}>{r.name}</Text>
                  <Text style={{ fontSize: 9.5, color: C.gold, fontWeight: '700', marginTop: 1 }}>★ {r.rating.toFixed(1)}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Mes formations / événements / commandes */}
        <View style={{ paddingHorizontal: 16, paddingTop: 18, gap: 9 }}>
          {[
            { key: 'formations', icon: 'GraduationCap' as const, title: t('profile.myCourses', 'Mes formations'), subtitle: myCourses.length > 0 ? `${myCourses.filter(c => c.progressPct < 100).length} en cours · ${myCourses.filter(c => c.progressPct === 100).length} terminée(s)` : 'Aucune formation pour le moment', color: C.success, bg: C.successSoft, count: myCourses.length, onPress: () => navigation.navigate('Courses') },
            { key: 'events', icon: 'Calendar' as const, title: t('profile.myUpcomingEvents', 'Mes événements à venir'), subtitle: upcomingEvents[0]?.title ?? 'Aucun événement à venir', color: C.primary, bg: 'rgba(232,89,26,0.1)', count: upcomingEvents.length, onPress: () => navigation.navigate('Events') },
            { key: 'orders', icon: 'ShoppingBag' as const, title: t('profile.myOrders', 'Mes commandes'), subtitle: t('profile.myOrdersSubtitle', 'Historique de vos commandes'), color: C.inkSoft, bg: C.surface2, count: ordersCount, onPress: () => navigation.navigate('OrderHistory') },
          ].map((row) => (
            <TouchableOpacity
              key={row.key}
              onPress={row.onPress}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13, borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 11, backgroundColor: row.bg, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={row.icon} size={21} color={row.color} />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text style={{ fontSize: 13.5, fontWeight: '700', color: C.ink }}>{row.title}</Text>
                <Text numberOfLines={1} style={{ fontSize: 11.5, color: C.inkMute, marginTop: 1 }}>{row.subtitle}</Text>
              </View>
              {row.count > 0 && (
                <View style={{ paddingHorizontal: 8, height: 18, borderRadius: 9, backgroundColor: row.color, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>{row.count}</Text>
                </View>
              )}
              <Icon name="ChevronRight" size={17} color={C.inkMute} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Histoires à la une */}
        <StoryHighlightBar
          highlights={highlights}
          isMine
          myAuthorId={user?.id}
          onOpenHighlight={(highlightId) => navigation.navigate('StoriesViewer', { highlightId })}
        />

        {/* Tabs */}
        <View style={{ flexDirection: 'row', backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
          {TABS.map((tab, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setActiveTab(i)}
              style={{ flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderColor: i === activeTab ? C.primary : 'transparent' }}
            >
              <Text style={{ fontSize: 13, fontWeight: i === activeTab ? '700' : '500', color: i === activeTab ? C.primary : C.inkMute }}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Publications grid — les vraies publications de l'utilisateur (Mongo, filtrées par authorId) */}
        {activeTab === 0 && (
          myPosts.length === 0 ? (
            <View style={{ alignItems: 'center', paddingTop: 40 }}>
              <Icon name="Camera" size={40} color={C.inkMute} />
              <Text style={{ fontSize: 14, color: C.inkMute, marginTop: 10 }}>{t('profile.noPosts', 'Aucune publication pour le moment.')}</Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 2 }}>
              {myPosts.map((post) => {
                const thumb = post.media[0]?.url ?? post.imageUrl;
                return (
                  <TouchableOpacity key={post.id} style={{ width: '33.33%', aspectRatio: 1, padding: 2 }}>
                    <View style={{ flex: 1, backgroundColor: C.surface2, borderRadius: 2, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {thumb ? (
                        <Image source={{ uri: thumb }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                      ) : (
                        <Icon name="MessageSquare" size={20} color={C.inkMute} />
                      )}
                      {post.media.length > 1 && (
                        <View style={{ position: 'absolute', top: 4, right: 4 }}>
                          <Icon name="Grid" size={13} color="#fff" />
                        </View>
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )
        )}

        {/* Favorites list */}
        {activeTab === 1 && (
          <View style={{ paddingHorizontal: 16, paddingTop: 14, gap: 10 }}>
            {favorites.length === 0 ? (
              <View style={{ alignItems: 'center', paddingTop: 40 }}>
                <Icon name="Heart" size={40} color={C.inkMute} />
                <Text style={{ fontSize: 14, color: C.inkMute, marginTop: 10 }}>{t('favorites.empty')}</Text>
              </View>
            ) : favorites.map((fav) => {
              const navigable = fav.type === 'recipe' || fav.type === 'restaurant';
              return (
                <TouchableOpacity
                  key={fav.id}
                  disabled={!navigable}
                  activeOpacity={navigable ? 0.85 : 1}
                  onPress={() => {
                    if (fav.type === 'recipe') navigation.navigate('Recipe', { dishId: fav.itemId });
                    else if (fav.type === 'restaurant') navigation.navigate('Restaurant', { restaurantId: fav.itemId });
                  }}
                  style={{ backgroundColor: C.surface, borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}
                >
                  <View style={{ width: 50, height: 50, borderRadius: 12, backgroundColor: C.surface2, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={fav.type === 'restaurant' ? 'Store' : 'ChefHat'} size={18} color={C.inkMute} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink, marginBottom: 2 }}>{fav.name}</Text>
                    {!!fav.region && <Text style={{ fontSize: 12, color: C.inkMute }}>{fav.region}</Text>}
                  </View>
                  {fav.rating !== null && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                      <Icon name="Star" size={12} color={C.gold} fill={C.gold} />
                      <Text style={{ fontSize: 12, fontWeight: '700', color: C.ink }}>{fav.rating}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Badges grid — vraies données (GET /users/badges) */}
        {activeTab === 2 && (
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 12, color: C.inkMute, marginBottom: 14, textAlign: 'center' }}>
              {t('profile.badgesCount', { unlocked: badges.filter((b) => b.isEarned).length, total: badges.length })}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
              {badges.slice(0, 9).map((b) => (
                <View key={b.id} style={{ alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: b.isEarned ? b.color + '15' : C.surface2, borderWidth: 2, borderColor: b.isEarned ? b.color + '40' : C.border, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={b.icon as IconName} size={24} color={b.isEarned ? b.color : C.inkMute} />
                  </View>
                </View>
              ))}
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Badges')} style={{ marginTop: 16, height: 42, borderRadius: 14, borderWidth: 1.5, borderColor: C.primary, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.primary }}>{t('profile.viewAllBadges')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Reviews — vraies données (GET /users/me/reviews, toutes restaurants confondus) */}
        {activeTab === 3 && (
          <View style={{ paddingHorizontal: 16, paddingTop: 14, gap: 12 }}>
            {myReviews.length === 0 ? (
              <View style={{ alignItems: 'center', paddingTop: 26 }}>
                <Icon name="Star" size={40} color={C.inkMute} />
                <Text style={{ fontSize: 14, color: C.inkMute, marginTop: 10 }}>{t('profile.noReviews', 'Aucun avis pour le moment.')}</Text>
              </View>
            ) : myReviews.map((r) => (
              <TouchableOpacity
                key={r.id}
                onPress={() => navigation.navigate('Restaurant', { restaurantId: r.restaurantId })}
                style={{ backgroundColor: C.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{r.restaurantName}</Text>
                    <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 1 }}>{new Date(r.createdAt).toLocaleDateString()}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 1 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Icon key={s} name="Star" size={12} color={C.gold} fill={s <= r.rating ? C.gold : 'none'} />
                    ))}
                  </View>
                </View>
                {!!r.comment && <Text style={{ fontSize: 13, color: C.inkSoft, lineHeight: 19 }}>{r.comment}</Text>}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
