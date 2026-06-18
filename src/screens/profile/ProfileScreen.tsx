import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const POST_COLORS = ['#E8591A', '#2E7D32', '#F9A825', '#1A237E', '#E8591A', '#2E7D32'];
const FAVORITES = [
  { name: 'Ndolé traditionnel', region: 'Littoral · Cameroun', rating: 4.9 },
  { name: 'Poulet DG', region: 'Centre · Cameroun', rating: 4.7 },
  { name: 'Eru spécial', region: 'Sud-Ouest · Cameroun', rating: 4.8 },
  { name: 'Mbongo Tchobi', region: 'Littoral · Cameroun', rating: 5.0 },
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

  const TABS = [t('profile.postsTab'), t('profile.favorites'), t('profile.badges')];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* Header */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('profile.title')}</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Settings" size={16} color="#6D4C41" />
          </TouchableOpacity>
          <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Share2" size={16} color="#6D4C41" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Avatar & identity */}
        <View style={{ backgroundColor: C.surface, paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, borderBottomWidth: 1, borderColor: C.border }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 16, marginBottom: 16 }}>
            <View style={{ position: 'relative' }}>
              <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#E8591A20', borderWidth: 3, borderColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 30, fontWeight: '700', color: '#E8591A', fontFamily: 'Inter-Bold' }}>S</Text>
              </View>
              <View style={{ position: 'absolute', bottom: 0, right: 0, width: 24, height: 24, borderRadius: 12, backgroundColor: '#2E7D32', borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Check" size={10} color="#fff" />
              </View>
            </View>
            <View style={{ flex: 1, paddingTop: 4 }}>
              <Text style={{ fontSize: 20, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 2 }}>Sami Nguimfack</Text>
              <Text style={{ fontSize: 13, color: C.inkMute, marginBottom: 8 }}>@sami_nguimfack</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: C.goldSoft, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#F9A82540' }}>
                <Icon name="Star" size={11} color="#F9A825" fill="#F9A825" />
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#F9A825' }}>{t('profile.levelBadge')}</Text>
              </View>
            </View>
          </View>

          {/* Stats row */}
          <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: C.border, paddingTop: 14, marginBottom: 14 }}>
            {[
              { value: '127', labelKey: 'profile.followers' },
              { value: '84',  labelKey: 'profile.following' },
              { value: '312', labelKey: 'profile.scans'     },
            ].map((stat, i) => (
              <TouchableOpacity key={i} style={{ flex: 1, alignItems: 'center', borderRightWidth: i < 2 ? 1 : 0, borderColor: C.border }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: C.ink, fontFamily: 'Inter-Bold' }}>{stat.value}</Text>
                <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 1 }}>{t(stat.labelKey)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Action buttons */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={{ flex: 1, height: 40, borderWidth: 1.5, borderColor: '#E8591A', borderRadius: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}>
              <Icon name="Edit" size={14} color="#E8591A" />
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#E8591A' }}>{t('profile.editShort')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, height: 40, backgroundColor: '#E8591A', borderRadius: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}>
              <Icon name="Share2" size={14} color="#fff" />
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>{t('profile.shareProfile')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* XP progress */}
        <View style={{ backgroundColor: C.surface, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: C.border }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
            <Text style={{ fontSize: 12, color: C.inkMute }}>
              {t('profile.nextLevel')}
            </Text>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#E8591A' }}>68%</Text>
          </View>
          <View style={{ height: 6, backgroundColor: C.surface2, borderRadius: 3, overflow: 'hidden' }}>
            <View style={{ height: '100%', width: '68%', backgroundColor: '#E8591A', borderRadius: 3 }} />
          </View>
          <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 4 }}>4 250 / 6 250 XP</Text>
        </View>

        {/* Wallet shortcut */}
        <TouchableOpacity
          onPress={() => navigation.navigate('WalletScreen')}
          style={{ marginHorizontal: 16, marginTop: 16, borderRadius: 16, backgroundColor: C.navySoft, borderWidth: 1, borderColor: '#1A237E20', padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, ...SHADOW_SM }}
          activeOpacity={0.85}
        >
          <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#1A237E', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Wallet" size={18} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, fontFamily: 'Inter-Bold' }}>{t('profile.wallet')}</Text>
            <Text style={{ fontSize: 12, color: C.inkMute }}>{t('profile.walletSub')}</Text>
          </View>
          <Icon name="ChevronRight" size={18} color="#6D4C41" />
        </TouchableOpacity>

        {/* Food Journal shortcut */}
        <TouchableOpacity
          onPress={() => navigation.navigate('FoodJournal')}
          style={{ marginHorizontal: 16, marginTop: 10, borderRadius: 16, backgroundColor: C.successSoft, borderWidth: 1, borderColor: '#2E7D3220', padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, ...SHADOW_SM }}
          activeOpacity={0.85}
        >
          <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#2E7D32', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="BookOpen" size={18} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, fontFamily: 'Inter-Bold' }}>{t('profile.foodJournal')}</Text>
            <Text style={{ fontSize: 12, color: C.inkMute }}>{t('profile.foodJournalSub')}</Text>
          </View>
          <Icon name="ChevronRight" size={18} color="#6D4C41" />
        </TouchableOpacity>

        {/* Admin access */}
        <TouchableOpacity
          onPress={() => navigation.navigate('AdminLogin')}
          style={{ margin: 16, borderRadius: 16, backgroundColor: C.navySoft, borderWidth: 1, borderColor: '#1A237E30', padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, ...SHADOW_SM }}
          activeOpacity={0.85}
        >
          <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#1A237E', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Shield" size={18} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#1A237E', fontFamily: 'Inter-Bold' }}>{t('profile.adminAccess')}</Text>
            <Text style={{ fontSize: 12, color: C.inkMute }}>{t('profile.adminSub')}</Text>
          </View>
          <Icon name="ChevronRight" size={18} color="#1A237E" />
        </TouchableOpacity>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border, borderTopWidth: 1, borderTopColor: '#E5E0D8' }}>
          {TABS.map((tab, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setActiveTab(i)}
              style={{ flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderColor: i === activeTab ? '#E8591A' : 'transparent' }}
            >
              <Text style={{ fontSize: 14, fontWeight: i === activeTab ? '700' : '500', color: i === activeTab ? '#E8591A' : '#8C8278' }}>{tab}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Posts grid */}
        {activeTab === 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
            {POST_COLORS.map((color, i) => (
              <TouchableOpacity key={i} style={{ width: '33.33%', aspectRatio: 1, backgroundColor: color + '20', borderWidth: 0.5, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Camera" size={24} color={color + '60'} />
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
                  <Icon name="Camera" size={18} color="rgba(140,130,120,0.4)" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink, marginBottom: 2 }}>{fav.name}</Text>
                  <Text style={{ fontSize: 12, color: C.inkMute }}>{fav.region}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <Icon name="Star" size={12} color="#F9A825" fill="#F9A825" />
                  <Text style={{ fontSize: 12, fontWeight: '700', color: C.ink }}>{fav.rating}</Text>
                </View>
                <Icon name="ChevronRight" size={16} color="#8C8278" />
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
                  <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: b.unlocked ? b.color + '15' : '#F5F0EB', borderWidth: 2, borderColor: b.unlocked ? b.color + '40' : '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={b.icon} size={24} color={b.unlocked ? b.color : '#C4BDB7'} />
                  </View>
                </View>
              ))}
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Badges')} style={{ marginTop: 16, height: 42, borderRadius: 14, borderWidth: 1.5, borderColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#E8591A' }}>{t('profile.viewAllBadges')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Logout */}
        <TouchableOpacity
          style={{ margin: 16, height: 46, borderRadius: 14, borderWidth: 1.5, borderColor: '#C6282830', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
          activeOpacity={0.85}
        >
          <Icon name="LogOut" size={16} color="#C62828" />
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#C62828' }}>{t('profile.logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
