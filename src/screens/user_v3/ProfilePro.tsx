import React, { useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useAuthStore } from '@/store/auth.store';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const TAB_KEYS = ['tabPublications', 'tabEvents', 'tabFormations', 'tabReviews'] as const;
const POST_COLORS = ['#E8591A', '#2E7D32', '#F9A825', '#1A237E', '#E8591A', '#2E7D32', '#F9A825', '#1A237E', '#E8591A'];

export default function ProfilePro() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const [activeTab, setActiveTab] = useState(0);

  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : 'Invité';
  const avatarInitial = (user?.firstName?.charAt(0) || '?').toUpperCase() + (user?.lastName?.charAt(0) || '').toUpperCase();

  const STATS = [
    { v: '12',  labelKey: 'statEvents' },
    { v: '4',   labelKey: 'statFormations' },
    { v: '247', labelKey: 'statFollowers' },
    { v: '4.7', labelKey: '', icon: 'Star' as const },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('profile.title')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="Edit" size={16} color={C.inkSoft} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('SettingsProActive')} style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: C.border, marginLeft: 8, alignItems: 'center', justifyContent: 'center' }}>
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
            onPress={() => navigation.navigate('ProDashboard')}
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

        {/* Événements */}
        {activeTab === 1 && (
          <View style={{ paddingHorizontal: 16, paddingTop: 14, gap: 10 }}>
            <TouchableOpacity onPress={() => navigation.navigate('ManageEvent')} style={{ backgroundColor: C.surface, borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }} activeOpacity={0.85}>
              <View style={{ width: 50, height: 50, borderRadius: 12, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Calendar" size={20} color={C.inkMute} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>Festival du Ndolé</Text>
                <Text style={{ fontSize: 12, color: C.inkMute }}>28 Nov · Bonanjo, Douala</Text>
              </View>
              <Icon name="ChevronRight" size={16} color={C.inkMute} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('CreateEvent')} style={{ height: 44, borderRadius: 14, borderWidth: 1.5, borderColor: C.primary, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: C.primary }}>+ {t('createEvent.title', 'Créer un événement')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Formations */}
        {activeTab === 2 && (
          <View style={{ paddingHorizontal: 16, paddingTop: 14, gap: 10 }}>
            <TouchableOpacity onPress={() => navigation.navigate('ProFormationsList')} style={{ backgroundColor: C.surface, borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }} activeOpacity={0.85}>
              <View style={{ width: 50, height: 50, borderRadius: 12, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="GraduationCap" size={20} color={C.inkMute} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>Maîtriser les sauces camerounaises</Text>
                <Text style={{ fontSize: 12, color: C.inkMute }}>24 inscrits</Text>
              </View>
              <Icon name="ChevronRight" size={16} color={C.inkMute} />
            </TouchableOpacity>
          </View>
        )}

        {/* Avis */}
        {activeTab === 3 && (
          <View style={{ paddingHorizontal: 16, paddingTop: 14 }}>
            <Text style={{ fontSize: 14, color: C.inkMute }}>312 {t('profilePro.reviewsAvg')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
              {[1, 2, 3, 4, 5].map(s => <Icon key={s} name="Star" size={16} color={C.gold} fill={C.gold} />)}
              <Text style={{ fontSize: 16, fontWeight: '700', color: C.ink, marginLeft: 4 }}>4.7</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
