import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const STATS = [
  { value: '127', label: 'Abonnés' },
  { value: '84', label: 'Abonnements' },
  { value: '312', label: 'Scans' },
];

const POST_COLORS = ['#E8591A', '#2E7D32', '#F9A825', '#1A237E', '#E8591A', '#2E7D32'];
const FAVORITES = [
  { name: 'Ndolé traditionnel', region: 'Littoral · Cameroun', rating: 4.9 },
  { name: 'Poulet DG', region: 'Centre · Cameroun', rating: 4.7 },
  { name: 'Eru spécial', region: 'Sud-Ouest · Cameroun', rating: 4.8 },
  { name: 'Mbongo Tchobi', region: 'Littoral · Cameroun', rating: 5.0 },
];

const BADGE_ICONS: { icon: Parameters<typeof Icon>[0]['name']; color: string; unlocked: boolean }[] = [
  { icon: 'Camera', color: '#E8591A', unlocked: true },
  { icon: 'Flame', color: '#F9A825', unlocked: true },
  { icon: 'ChefHat', color: '#E8591A', unlocked: true },
  { icon: 'Globe', color: '#1A237E', unlocked: true },
  { icon: 'Award', color: '#F9A825', unlocked: true },
  { icon: 'Trophy', color: '#F9A825', unlocked: true },
  { icon: 'Star', color: '#F9A825', unlocked: false },
  { icon: 'Users', color: '#8C8278', unlocked: false },
  { icon: 'Sparkles', color: '#8C8278', unlocked: false },
];

const TABS = ['Posts', 'Favoris', 'Badges'];

export default function ProfileScreen() {
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Mon profil</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')} style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Settings" size={16} color="#6D4C41" />
          </TouchableOpacity>
          <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Share2" size={16} color="#6D4C41" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Avatar & info */}
        <View style={{ backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, borderBottomWidth: 1, borderColor: '#F5F0EB' }}>
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
              <Text style={{ fontSize: 20, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', marginBottom: 2 }}>Sami Nguimfack</Text>
              <Text style={{ fontSize: 13, color: '#8C8278', marginBottom: 8 }}>@sami_nguimfack</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FBF3DC', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start', borderWidth: 1, borderColor: '#F9A82540' }}>
                <Icon name="Star" size={11} color="#F9A825" fill="#F9A825" />
                <Text style={{ fontSize: 11, fontWeight: '700', color: '#F9A825' }}>Chef Explorateur · niv. 4</Text>
              </View>
            </View>
          </View>

          {/* Stats */}
          <View style={{ flexDirection: 'row', borderTopWidth: 1, borderColor: '#F5F0EB', paddingTop: 14, marginBottom: 14 }}>
            {STATS.map((stat, i) => (
              <TouchableOpacity key={i} style={{ flex: 1, alignItems: 'center', borderRightWidth: i < 2 ? 1 : 0, borderColor: '#F5F0EB' }}>
                <Text style={{ fontSize: 20, fontWeight: '700', color: '#2C1810', fontFamily: 'Inter-Bold' }}>{stat.value}</Text>
                <Text style={{ fontSize: 11, color: '#8C8278', marginTop: 1 }}>{stat.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Action buttons */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity onPress={() => navigation.navigate('EditProfile')} style={{ flex: 1, height: 40, borderWidth: 1.5, borderColor: '#E8591A', borderRadius: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}>
              <Icon name="Edit" size={14} color="#E8591A" />
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#E8591A' }}>Modifier</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 1, height: 40, backgroundColor: '#E8591A', borderRadius: 20, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}>
              <Icon name="Share2" size={14} color="#fff" />
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>Partager</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* XP bar strip */}
        <View style={{ backgroundColor: '#fff', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#F5F0EB' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
            <Text style={{ fontSize: 12, color: '#8C8278' }}>XP: <Text style={{ fontWeight: '700', color: '#2C1810' }}>4 250</Text> / 6 250</Text>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#E8591A' }}>68%</Text>
          </View>
          <View style={{ height: 6, backgroundColor: '#F5F0EB', borderRadius: 3, overflow: 'hidden' }}>
            <View style={{ height: '100%', width: '68%', backgroundColor: '#E8591A', borderRadius: 3 }} />
          </View>
        </View>

        {/* Admin access */}
        <TouchableOpacity
          onPress={() => navigation.navigate('AdminLogin')}
          style={{ margin: 16, borderRadius: 16, backgroundColor: '#E8EAF6', borderWidth: 1, borderColor: '#1A237E30', padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, ...SHADOW_SM }}
          activeOpacity={0.85}
        >
          <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: '#1A237E', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Shield" size={18} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#1A237E', fontFamily: 'Inter-Bold' }}>Accès Admin</Text>
            <Text style={{ fontSize: 12, color: '#8C8278' }}>Tableau de bord administrateur</Text>
          </View>
          <Icon name="ChevronRight" size={18} color="#1A237E" />
        </TouchableOpacity>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8', borderTopWidth: 1, borderTopColor: '#E5E0D8' }}>
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
                style={{ backgroundColor: '#fff', borderRadius: 14, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#E5E0D8', ...SHADOW_SM }}
                activeOpacity={0.85}
              >
                <View style={{ width: 50, height: 50, borderRadius: 12, backgroundColor: '#F5F0EB', borderWidth: 1, borderStyle: 'dashed', borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="Camera" size={18} color="rgba(140,130,120,0.4)" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#2C1810', marginBottom: 2 }}>{fav.name}</Text>
                  <Text style={{ fontSize: 12, color: '#8C8278' }}>{fav.region}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                  <Icon name="Star" size={12} color="#F9A825" fill="#F9A825" />
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#2C1810' }}>{fav.rating}</Text>
                </View>
                <Icon name="ChevronRight" size={16} color="#8C8278" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Badges grid */}
        {activeTab === 2 && (
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 12, color: '#8C8278', marginBottom: 14, textAlign: 'center' }}>6 débloqués / 18 badges au total</Text>
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
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#E8591A' }}>Voir tous les badges</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Logout */}
        <TouchableOpacity
          style={{ margin: 16, height: 46, borderRadius: 14, borderWidth: 1.5, borderColor: '#C6282830', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
          activeOpacity={0.85}
        >
          <Icon name="LogOut" size={16} color="#C62828" />
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#C62828' }}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
