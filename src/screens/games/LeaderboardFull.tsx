import React, { useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { gamesService } from '@/services/games.service';
import { useAuthStore } from '@/store/auth.store';

const AVATAR_COLORS = ['#F9A825', '#8C8278', '#E8591A', '#2E7D32', '#1A237E', '#C62828', '#6D4C41', '#0277BD'];
const PODIUM_COLORS = ['#F9A825', '#8C8278', '#E8591A'];
const PODIUM_ORDER  = [1, 0, 2];

type PeriodKey = 'week' | 'month' | 'all';

function initials(displayName: string): string {
  return displayName
    .split(' ')
    .map(w => w[0] ?? '')
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function LeaderboardFull() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<PeriodKey>('week');

  const TABS: Array<{ key: PeriodKey; label: string }> = [
    { key: 'week',  label: t('games.weekTab')    },
    { key: 'month', label: t('games.monthTab')   },
    { key: 'all',   label: t('games.allTimeTab') },
  ];

  const { data: entries = [], isLoading } = useQuery({
    queryKey: ['leaderboard', activeTab],
    queryFn:  () => gamesService.getLeaderboard(activeTab),
    staleTime: 5 * 60_000,
  });
  const myUserId = useAuthStore(s => s.user?.id);

  const players = entries.map((entry, idx) => {
    const displayName = `${entry.firstName} ${entry.lastName}`.trim();
    return {
      rank:     entry.rank,
      user:     displayName,
      pts:      entry.points,
      initials: initials(displayName),
      color:    AVATAR_COLORS[idx % AVATAR_COLORS.length] ?? '#E8591A',
      isMe:     entry.userId === myUserId,
    };
  });

  const top3  = players.slice(0, 3);
  const rest  = players.slice(3);
  const me    = players.find(p => p.isMe);

  const podiumHeights = [76, 56, 44];
  const podiumSizes   = [62, 50, 50];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('games.ranking')}</Text>
        <Icon name="Trophy" size={20} color={C.gold} fill={C.gold} />
      </View>

      {/* Tabs */}
      <View style={{ flexDirection: 'row', backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}
            style={{ flex: 1, paddingVertical: 12, alignItems: 'center', borderBottomWidth: 2, borderColor: activeTab === tab.key ? C.primary : 'transparent' }}
          >
            <Text style={{ fontSize: 13, fontWeight: activeTab === tab.key ? '700' : '500', color: activeTab === tab.key ? C.primary : C.inkSoft }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={C.primary} />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

          {/* Podium */}
          <View style={{ backgroundColor: C.navy, paddingTop: 24, paddingHorizontal: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 8 }}>
              {PODIUM_ORDER.map(idx => {
                const p = top3[idx];
                if (!p) return null;
                const isFirst = idx === 0;
                const sz      = podiumSizes[idx] ?? 50;
                const medal   = PODIUM_COLORS[idx] ?? C.border;
                const barH    = podiumHeights[idx] ?? 44;

                return (
                  <View key={p.rank} style={{ flex: 1, alignItems: 'center' }}>
                    {isFirst && (
                      <View style={{ marginBottom: 4 }}>
                        <Icon name="Trophy" size={18} color={C.gold} fill={C.gold} />
                      </View>
                    )}
                    <View style={{ width: sz, height: sz, borderRadius: sz / 2, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: isFirst ? 3 : 2, borderColor: medal, alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                      <Text style={{ fontSize: isFirst ? 20 : 16, fontWeight: '700', color: p.isMe ? C.gold : '#fff' }}>
                        {p.isMe ? t('games.you')[0] : p.initials[0]}
                      </Text>
                    </View>
                    <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.85)', fontWeight: '600', marginBottom: 2 }} numberOfLines={1}>
                      {p.isMe ? t('games.you') : p.user.split(' ')[0]}
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
            <View style={{ marginHorizontal: 16, marginTop: 16, backgroundColor: C.primary + '10', borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1.5, borderColor: C.primary + '40', ...SHADOW_SM }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: C.primary, width: 34 }}>#{me.rank}</Text>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.primary + '20', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontWeight: '700', color: C.primary, fontSize: 14 }}>{t('games.you')[0]}</Text>
              </View>
              <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: C.primary }}>{t('games.you')}</Text>
              <Text style={{ fontSize: 14, fontWeight: '700', color: C.primary }}>{me.pts.toLocaleString()} pts</Text>
            </View>
          )}

          {/* Rest of list */}
          <View style={{ marginHorizontal: 16, marginTop: 16, backgroundColor: C.surface, borderRadius: 18, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
            {rest.map((player, i) => (
              <View
                key={player.rank}
                style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 13, backgroundColor: player.isMe ? C.primary + '10' : C.surface, borderTopWidth: i > 0 ? 1 : 0, borderColor: C.border }}
              >
                <Text style={{ width: 32, fontSize: 13, fontWeight: '700', color: player.isMe ? C.primary : C.inkSoft }}>#{player.rank}</Text>
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: player.color + '20', borderWidth: 1.5, borderColor: player.color + '40', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: player.color }}>{player.isMe ? t('games.you')[0] : player.initials[0]}</Text>
                </View>
                <Text style={{ flex: 1, fontSize: 14, fontWeight: player.isMe ? '700' : '500', color: player.isMe ? C.primary : C.ink }}>
                  {player.isMe ? t('games.you') : player.user}
                </Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>
                  {player.pts.toLocaleString()} pts
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
