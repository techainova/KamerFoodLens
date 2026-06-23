import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

type Player = { rank: number; user: string; pts: number; initials: string; color: string; isMe: boolean };

const DATA: Record<string, Player[]> = {
  week: [
    { rank: 1, user: 'Chef Joël',   pts: 1240, initials: 'CJ', color: '#F9A825', isMe: false },
    { rank: 2, user: 'Adèle Biya',  pts: 980,  initials: 'AB', color: '#8C8278', isMe: false },
    { rank: 3, user: 'Moi',         pts: 820,  initials: 'MO', color: '#E8591A', isMe: true  },
    { rank: 4, user: 'Kevin B.',    pts: 640,  initials: 'KB', color: '#2E7D32', isMe: false },
    { rank: 5, user: 'Ngo M.',      pts: 580,  initials: 'NM', color: '#1A237E', isMe: false },
    { rank: 6, user: 'Sami N.',     pts: 520,  initials: 'SN', color: '#E8591A', isMe: false },
    { rank: 7, user: 'Amah K.',     pts: 440,  initials: 'AK', color: '#2E7D32', isMe: false },
    { rank: 8, user: 'Luc T.',      pts: 310,  initials: 'LT', color: '#F9A825', isMe: false },
  ],
  month: [
    { rank: 1, user: 'Chef Joël',   pts: 8420, initials: 'CJ', color: '#F9A825', isMe: false },
    { rank: 2, user: 'Adèle Biya',  pts: 7105, initials: 'AB', color: '#8C8278', isMe: false },
    { rank: 3, user: 'Sami N.',     pts: 6780, initials: 'SN', color: '#E8591A', isMe: false },
    { rank: 4, user: 'Moi',         pts: 4250, initials: 'MO', color: '#E8591A', isMe: true  },
    { rank: 5, user: 'Kevin B.',    pts: 3890, initials: 'KB', color: '#2E7D32', isMe: false },
    { rank: 6, user: 'Ngo M.',      pts: 3200, initials: 'NM', color: '#1A237E', isMe: false },
    { rank: 7, user: 'Amah K.',     pts: 2450, initials: 'AK', color: '#2E7D32', isMe: false },
    { rank: 8, user: 'Luc T.',      pts: 1980, initials: 'LT', color: '#F9A825', isMe: false },
  ],
  all: [
    { rank: 1, user: 'Chef Joël',  pts: 42100, initials: 'CJ', color: '#F9A825', isMe: false },
    { rank: 2, user: 'Adèle Biya', pts: 38400, initials: 'AB', color: '#8C8278', isMe: false },
    { rank: 3, user: 'Ngo M.',     pts: 29800, initials: 'NM', color: '#1A237E', isMe: false },
    { rank: 4, user: 'Sami N.',    pts: 24100, initials: 'SN', color: '#E8591A', isMe: false },
    { rank: 5, user: 'Kevin B.',   pts: 19300, initials: 'KB', color: '#2E7D32', isMe: false },
    { rank: 6, user: 'Amah K.',    pts: 16800, initials: 'AK', color: '#2E7D32', isMe: false },
    { rank: 7, user: 'Moi',        pts: 14250, initials: 'MO', color: '#E8591A', isMe: true  },
    { rank: 8, user: 'Luc T.',     pts: 11900, initials: 'LT', color: '#F9A825', isMe: false },
  ],
};

const TABS: { key: string; label: string }[] = [
  { key: 'week',  label: 'Semaine'    },
  { key: 'month', label: 'Mois'       },
  { key: 'all',   label: 'Tout temps' },
];

const PODIUM_COLORS = ['#F9A825', '#8C8278', '#E8591A']; // indexed by rank-1: gold/silver/bronze
const PODIUM_ORDER  = [1, 0, 2]; // visual left→right: 2nd · 1st · 3rd

export default function LeaderboardFull() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const [activeTab, setActiveTab] = useState('week');

  const players = DATA[activeTab] ?? [];
  const top3    = players.slice(0, 3);
  const rest    = players.slice(3);
  const me      = players.find(p => p.isMe);

  const podiumHeights = [76, 56, 44]; // indexed by rank-1: 1st tallest
  const podiumSizes   = [62, 50, 50];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>Classement</Text>
        <Icon name="Trophy" size={20} color="#F9A825" fill="#F9A825" />
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={{ flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderColor: activeTab === tab.key ? '#E8591A' : 'transparent' }}
          >
            <Text style={{ fontSize: 13, fontWeight: activeTab === tab.key ? '700' : '500', color: activeTab === tab.key ? '#E8591A' : '#8C8278' }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Podium */}
        <View style={{ backgroundColor: '#1A237E', paddingTop: 24, paddingBottom: 0, paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 8 }}>
            {PODIUM_ORDER.map(idx => {
              const p = top3[idx];
              if (!p) return null;
              const isFirst = idx === 0;
              const sz      = podiumSizes[idx] ?? 50;
              const medal   = PODIUM_COLORS[idx] ?? '#E5E0D8';
              const barH    = podiumHeights[idx] ?? 44;

              return (
                <View key={p.rank} style={{ flex: 1, alignItems: 'center' }}>
                  {isFirst && (
                    <View style={{ marginBottom: 4 }}>
                      <Icon name="Trophy" size={18} color="#F9A825" fill="#F9A825" />
                    </View>
                  )}
                  <View style={{ width: sz, height: sz, borderRadius: sz / 2, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: isFirst ? 3 : 2, borderColor: medal, alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                    <Text style={{ fontSize: isFirst ? 22 : 17, fontWeight: '700', color: p.isMe ? '#F9A825' : '#fff' }}>
                      {p.initials[0]}
                    </Text>
                  </View>
                  <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: '600', marginBottom: 2 }} numberOfLines={1}>
                    {p.user.split(' ')[0]}
                  </Text>
                  <Text style={{ fontSize: 11, fontWeight: '700', color: medal, marginBottom: 6 }}>
                    {p.pts.toLocaleString()}
                  </Text>
                  <View style={{ width: 64, height: barH, backgroundColor: medal + '30', borderTopLeftRadius: 8, borderTopRightRadius: 8, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 8 }}>
                    <Text style={{ color: medal, fontWeight: '700', fontSize: 18 }}>{p.rank}</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* My rank banner (when not in top 3) */}
        {me && me.rank > 3 && (
          <View style={{ marginHorizontal: 16, marginTop: 16, backgroundColor: '#FEF3EC', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderColor: '#E8591A40', ...SHADOW_SM }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#E8591A', width: 34 }}>#{me.rank}</Text>
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#E8591A20', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontWeight: '700', color: '#E8591A', fontSize: 14 }}>{me.initials[0]}</Text>
            </View>
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: '#E8591A' }}>Vous</Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#E8591A' }}>{me.pts.toLocaleString()} pts</Text>
          </View>
        )}

        {/* Rest of list */}
        <View style={{ marginHorizontal: 16, marginTop: 16, backgroundColor: C.surface, borderRadius: 18, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
          {rest.map((player, i) => (
            <View
              key={player.rank}
              style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 13, backgroundColor: player.isMe ? '#FEF3EC' : '#fff', borderTopWidth: i > 0 ? 1 : 0, borderColor: C.border }}
            >
              <Text style={{ width: 32, fontSize: 13, fontWeight: '700', color: player.isMe ? '#E8591A' : '#8C8278' }}>#{player.rank}</Text>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: player.color + '20', borderWidth: 1.5, borderColor: player.color + '40', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                <Text style={{ fontSize: 13, fontWeight: '700', color: player.color }}>{player.initials[0]}</Text>
              </View>
              <Text style={{ flex: 1, fontSize: 14, fontWeight: player.isMe ? '700' : '500', color: player.isMe ? '#E8591A' : '#2C1810' }}>
                {player.user}{player.isMe ? ' · Vous' : ''}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>
                {player.pts.toLocaleString()} pts
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
