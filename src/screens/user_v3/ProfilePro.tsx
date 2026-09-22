import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, Image,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/store/auth.store';
import { SHADOW_SM, SHADOW_MD, SHADOW_LG } from '@/constants/theme';
import { onTabBarScroll } from '@/navigation/tabBarScroll';
import { eventsService, type KflEvent } from '@/services/events.service';
import { coursesService, type Course } from '@/services/courses.service';
import { proService } from '@/services/pro.service';
import { restaurantsService, type Restaurant, type RestaurantReview } from '@/services/restaurants.service';
import { communityService, type FeedPost } from '@/services/community.service';
import { useMessagesStore } from '@/store/messages.store';

const TAB_KEYS = ['tabPublications', 'tabEvents', 'tabFormations', 'tabReviews'] as const;

export default function ProfilePro() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const unreadMessages = useMessagesStore((s) => s.totalUnread());
  const [activeTab, setActiveTab] = useState(0);

  const [myEvents, setMyEvents] = useState<KflEvent[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [myPosts, setMyPosts] = useState<FeedPost[]>([]);
  const [primaryRestaurant, setPrimaryRestaurant] = useState<Restaurant | null>(null);
  const [myReviews, setMyReviews] = useState<RestaurantReview[]>([]);

  useEffect(() => {
    void eventsService.getManaged().then(setMyEvents).catch(() => setMyEvents([]));
    void coursesService.getManaged().then(setMyCourses).catch(() => setMyCourses([]));
    if (user?.id) {
      void communityService.getFeed(1, user.id).then((r) => setMyPosts(r.items)).catch(() => setMyPosts([]));
    }
    void proService.getMyRestaurants().then(async (restaurants) => {
      const first = restaurants[0];
      if (!first) return;
      const detail = await restaurantsService.getDetail(first.id).catch(() => null);
      if (detail) setPrimaryRestaurant(detail);
      const reviews = await restaurantsService.getReviews(first.id).catch(() => []);
      setMyReviews(reviews);
    }).catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Invité';
  const avatarInitial = (user?.firstName?.charAt(0) || '?').toUpperCase() + (user?.lastName?.charAt(0) || '').toUpperCase();

  // Pas de système de "followers" entre comptes dans ce backend — le nombre
  // d'abonnés réel et synchronisé est celui du (des) restaurant(s) suivis
  // (RestaurantFollow), déjà exposé par GET /restaurants/:id.
  const STATS = [
    { v: String(myEvents.length),   labelKey: 'statEvents' },
    { v: String(myCourses.length),  labelKey: 'statFormations' },
    { v: String(primaryRestaurant?.followersCount ?? 0), labelKey: 'statFollowers' },
    { v: primaryRestaurant ? primaryRestaurant.rating.toFixed(1) : '—', labelKey: '', icon: 'Star' as const },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('profile.title')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ProMessages')} style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="Bell" size={16} color={C.inkSoft} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('ConversationsList')} style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: C.border, marginLeft: 8, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <Icon name="MessageCircle" size={16} color={C.inkSoft} />
          {unreadMessages > 0 && (
            <View style={{ position: 'absolute', top: -3, right: -3, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3 }}>
              <Text style={{ fontSize: 9, fontWeight: '800', color: '#fff' }}>{unreadMessages > 9 ? '9+' : unreadMessages}</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: C.border, marginLeft: 8, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="Edit" size={16} color={C.inkSoft} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SettingsProActive')} style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: C.border, marginLeft: 8, alignItems: 'center', justifyContent: 'center' }}>
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
            <View style={{
              position: 'absolute', bottom: 0, right: -4,
              paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10,
              backgroundColor: C.gold,
              borderWidth: 2, borderColor: C.cream,
            }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>⭐ PRO</Text>
            </View>
          </View>
          <Text style={{ fontSize: 22, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginTop: 10, marginBottom: 2 }}>{fullName}</Text>
          <Text style={{ fontSize: 12, color: C.inkMute }}>@{user?.username ?? 'invite'}{user?.location ? ` · ${user.location}` : ''}</Text>

          {/* Pro pill */}
          <View style={{
            flexDirection: 'row', alignItems: 'center', gap: 6,
            marginTop: 8, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 14,
            backgroundColor: C.goldSoft, borderWidth: 1, borderColor: C.gold,
          }}>
            <Icon name="Star" size={12} color={C.gold} fill={C.gold} />
            <Text style={{ fontSize: 11, fontWeight: '700', color: C.primary }}>Pro · {fullName}</Text>
            <Icon name="CheckCircle" size={12} color={C.success} />
          </View>

          {!!user?.bio && (
            <Text style={{ fontSize: 13, color: C.inkSoft, maxWidth: 280, marginTop: 10, textAlign: 'center', lineHeight: 20 }}>
              {user.bio}
            </Text>
          )}
        </View>

        {/* Stats row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 14, borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.border }}>
          {STATS.map((stat, i) => (
            <View key={i} style={{ alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                {stat.icon && <Icon name={stat.icon} size={13} color={C.gold} fill={C.gold} />}
                <Text style={{ fontSize: 16, fontWeight: '700', color: C.ink, fontFamily: 'Inter-Bold' }}>{stat.v}</Text>
              </View>
              {!!stat.labelKey && <Text style={{ fontSize: 10, color: C.inkMute, marginTop: 1 }}>{t(`profilePro.${stat.labelKey}`)}</Text>}
            </View>
          ))}
        </View>

        {/* Dual CTA — Modifier / Dashboard */}
        <View style={{ flexDirection: 'row', gap: 8, padding: 16 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditProfile')}
            style={{ flex: 1, height: 48, borderWidth: 1.5, borderColor: C.success, borderRadius: 24, alignItems: 'center', justifyContent: 'center' }}
            activeOpacity={0.85}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: C.success }}>{t('profilePro.edit')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('DashTab')}
            style={{ flex: 1.4, height: 48, backgroundColor: C.primary, borderRadius: 24, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}
            activeOpacity={0.85}
          >
            <Icon name="BarChart2" size={16} color="#fff" />
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>{t('profilePro.dashboard')}</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
          {TAB_KEYS.map((key, i) => (
            <TouchableOpacity
              key={key}
              onPress={() => setActiveTab(i)}
              style={{ flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderColor: i === activeTab ? C.primary : 'transparent' }}
            >
              <Text style={{ fontSize: 13, fontWeight: i === activeTab ? '700' : '500', color: i === activeTab ? C.primary : C.inkMute }}>{t(`profilePro.${key}`)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Publications grid — vraies publications (authorId filtré) */}
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
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )
        )}

        {/* Événements — vraie liste des événements créés par ce Pro */}
        {activeTab === 1 && (
          <View style={{ paddingHorizontal: 16, paddingTop: 14, gap: 10 }}>
            {myEvents.map((ev) => (
              <TouchableOpacity key={ev.id} onPress={() => navigation.navigate('ManageEvent', { eventId: ev.id })} style={{ backgroundColor: C.surface, borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }} activeOpacity={0.85}>
                <View style={{ width: 50, height: 50, borderRadius: 12, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="Calendar" size={20} color={C.inkMute} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{ev.title}</Text>
                  <Text style={{ fontSize: 12, color: C.inkMute }}>{ev.date} · {ev.location}</Text>
                </View>
                <Icon name="ChevronRight" size={16} color={C.inkMute} />
              </TouchableOpacity>
            ))}
            {myEvents.length === 0 && (
              <Text style={{ fontSize: 13, color: C.inkMute, textAlign: 'center', paddingVertical: 10 }}>{t('profile.noEvents', 'Aucun événement pour le moment.')}</Text>
            )}
            <TouchableOpacity onPress={() => navigation.navigate('CreateEvent')} style={{ height: 44, borderRadius: 14, borderWidth: 1.5, borderColor: C.primary, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.primary }}>+ {t('createEvent.title', 'Créer un événement')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Formations — vraie liste des formations créées par ce Pro */}
        {activeTab === 2 && (
          <View style={{ paddingHorizontal: 16, paddingTop: 14, gap: 10 }}>
            {myCourses.map((c) => (
              <TouchableOpacity key={c.id} onPress={() => navigation.navigate('ProFormationsList')} style={{ backgroundColor: C.surface, borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }} activeOpacity={0.85}>
                <View style={{ width: 50, height: 50, borderRadius: 12, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="GraduationCap" size={20} color={C.inkMute} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{c.title}</Text>
                  <Text style={{ fontSize: 12, color: C.inkMute }}>{c.studentsCount} inscrits</Text>
                </View>
                <Icon name="ChevronRight" size={16} color={C.inkMute} />
              </TouchableOpacity>
            ))}
            {myCourses.length === 0 && (
              <Text style={{ fontSize: 13, color: C.inkMute, textAlign: 'center', paddingVertical: 10 }}>{t('profile.noCourses', 'Aucune formation pour le moment.')}</Text>
            )}
            <TouchableOpacity onPress={() => navigation.navigate('CreateCourse')} style={{ height: 44, borderRadius: 14, borderWidth: 1.5, borderColor: C.primary, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.primary }}>+ {t('createCourse.title', 'Créer une formation')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Avis — vraie note moyenne + vrais avis du restaurant */}
        {activeTab === 3 && (
          <View style={{ paddingHorizontal: 16, paddingTop: 14, gap: 12 }}>
            {primaryRestaurant && (
              <View>
                <Text style={{ fontSize: 14, color: C.inkMute }}>{primaryRestaurant.reviewCount} {t('profilePro.reviewsAvg')}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  {[1, 2, 3, 4, 5].map(s => <Icon key={s} name="Star" size={16} color={C.gold} fill={s <= Math.round(primaryRestaurant.rating) ? C.gold : 'none'} />)}
                  <Text style={{ fontSize: 16, fontWeight: '700', color: C.ink, marginLeft: 4 }}>{primaryRestaurant.rating.toFixed(1)}</Text>
                </View>
              </View>
            )}
            {myReviews.length === 0 ? (
              <Text style={{ fontSize: 13, color: C.inkMute, textAlign: 'center', paddingVertical: 10 }}>{t('profile.noReviews', 'Aucun avis pour le moment.')}</Text>
            ) : myReviews.map((r) => (
              <View key={r.id} style={{ backgroundColor: C.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{r.authorName}</Text>
                  <View style={{ flexDirection: 'row', gap: 1 }}>
                    {[1, 2, 3, 4, 5].map(s => <Icon key={s} name="Star" size={12} color={C.gold} fill={s <= r.rating ? C.gold : 'none'} />)}
                  </View>
                </View>
                <Text style={{ fontSize: 13, color: C.inkSoft, lineHeight: 19 }}>{r.text}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
