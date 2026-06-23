import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/store/auth.store';
import ProfilePro from '@/screens/user_v3/ProfilePro';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const POST_COLORS = ['#E8591A', '#2E7D32', '#F9A825', '#1A237E', '#E8591A', '#2E7D32', '#F9A825', '#1A237E', '#E8591A'];
const FAVORITES = [
  { name: 'Ndolé traditionnel', region: 'Littoral · Cameroun', rating: 4.9 },
  { name: 'Poulet DG', region: 'Centre · Cameroun', rating: 4.7 },
  { name: 'Eru spécial', region: 'Sud-Ouest · Cameroun', rating: 4.8 },
  { name: 'Mbongo Tchobi', region: 'Littoral · Cameroun', rating: 5.0 },
];
const REVIEWS = [
  { dish: 'Ndolé traditionnel', restaurant: 'Chez Mama Pauline', rating: 5, text: 'Authentique et délicieux, exactement comme à la maison.' },
  { dish: 'Poulet DG', restaurant: "Restaurant L'Authenticité", rating: 4, text: 'Très bon, un peu salé à mon goût.' },
];
const BADGE_ICONS: { icon: Parameters<typeof Icon>[0]['name']; color: string; unlocked: boolean }[] = [
  { icon: 'Camera',   color: '#E8591A', unlocked: true  },
  { icon: 'Flame',    color: '#F9A825', unlocked: true  },
  { icon: 'ChefHat',  color: '#E8591A', unlocked: true  },
  { icon: 'Globe',    color: '#1A237E', unlocked: true  },
  { icon: 'Award',    color: '#F9A825', unlocked: true  },
  { icon: 'Trophy',   color: '#F9A825', unlocked: true  },
  { icon: 'Star',     color: '#F9A825', unlocked: false },
  { icon: 'Users',    color: '#8C8278', unlocked: false },
  { icon: 'Sparkles', color: '#8C8278', unlocked: false },
];

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const user = useAuthStore((s) => s.user);

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

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Avatar & identity */}
        <View style={{ alignItems: 'center', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16 }}>
          <View style={{ position: 'relative' }}>
            <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 32, fontWeight: '600', color: C.inkMute, fontFamily: 'Inter-Bold' }}>{avatarInitial}</Text>
            </View>
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

        {/* Stats row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 14, borderTopWidth: 1, borderBottomWidth: 1, borderColor: C.border }}>
          {[
            { value: '24',  labelKey: 'profile.recipesCount' },
            { value: '142', labelKey: 'profile.scans'        },
            { value: '318', labelKey: 'profile.followers'    },
            { value: '92',  labelKey: 'profile.following'    },
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

        {/* Publications grid */}
        {activeTab === 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 2 }}>
            {POST_COLORS.map((color, i) => (
              <TouchableOpacity key={i} style={{ width: '33.33%', aspectRatio: 1, padding: 2 }}>
                <View style={{ flex: 1, backgroundColor: color + '15', borderRadius: 2, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="Camera" size={22} color={color + '60'} />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Favorites list */}
        {activeTab === 1 && (
          <View style={{ paddingHorizontal: 16, paddingTop: 14, gap: 10 }}>
            {FAVORITES.map((fav, i) => (
              <TouchableOpacity
                key={i}
                style={{ backgroundColor: C.surface, borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}
                activeOpacity={0.85}
              >
                <View style={{ width: 50, height: 50, borderRadius: 12, backgroundColor: C.surface2, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="Camera" size={18} color={C.inkMute} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink, marginBottom: 2 }}>{fav.name}</Text>
                  <Text style={{ fontSize: 12, color: C.inkMute }}>{fav.region}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <Icon name="Star" size={12} color={C.gold} fill={C.gold} />
                  <Text style={{ fontSize: 12, fontWeight: '700', color: C.ink }}>{fav.rating}</Text>
                </View>
                <Icon name="ChevronRight" size={16} color={C.inkMute} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Badges grid */}
        {activeTab === 2 && (
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 12, color: C.inkMute, marginBottom: 14, textAlign: 'center' }}>
              {t('profile.badgesCount', { unlocked: 6, total: 18 })}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
              {BADGE_ICONS.map((b, i) => (
                <View key={i} style={{ alignItems: 'center', gap: 4 }}>
                  <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: b.unlocked ? b.color + '15' : C.surface2, borderWidth: 2, borderColor: b.unlocked ? b.color + '40' : C.border, alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={b.icon} size={24} color={b.unlocked ? b.color : C.inkMute} />
                  </View>
                </View>
              ))}
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Badges')} style={{ marginTop: 16, height: 42, borderRadius: 14, borderWidth: 1.5, borderColor: C.primary, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.primary }}>{t('profile.viewAllBadges')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Reviews */}
        {activeTab === 3 && (
          <View style={{ paddingHorizontal: 16, paddingTop: 14, gap: 12 }}>
            {REVIEWS.map((r, i) => (
              <View key={i} style={{ backgroundColor: C.surface, borderRadius: 14, padding: 14, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{r.dish}</Text>
                    <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 1 }}>{r.restaurant}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 1 }}>
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Icon key={s} name="Star" size={12} color={C.gold} fill={s <= r.rating ? C.gold : 'none'} />
                    ))}
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
