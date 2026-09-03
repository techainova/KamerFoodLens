import React, { useEffect, useMemo, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM, SHADOW_MD } from '@/constants/theme';
import { gamesService, type LeaderboardEntry, type Badge } from '@/services/games.service';
import { useAuthStore } from '@/store/auth.store';

const XP_PER_LEVEL = 100;
const AVATAR_COLORS = ['#F9A825', '#8C8278', '#E8591A', '#2E7D32', '#1A237E', '#C62828'];

function initials(name: string): string {
  return name.split(' ').map((w) => w[0] ?? '').join('').toUpperCase().slice(0, 2) || '?';
}

export default function Games() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const user = useAuthStore(s => s.user);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [lb, myBadges] = await Promise.all([
          gamesService.getLeaderboard('week'),
          gamesService.getMyBadges().catch(() => []),
        ]);
        if (!cancelled) {
          setLeaderboard(lb.slice(0, 4));
          setBadges(myBadges);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const points = user?.xpPoints ?? 0;
  const level = user?.level ?? 1;
  const pointsIntoLevel = points % XP_PER_LEVEL;
  const levelPct = Math.round((pointsIntoLevel / XP_PER_LEVEL) * 100);
  const badgesUnlocked = badges.filter((b) => b.isEarned).length;

  const gameModes = useMemo(() => [
    { icon: 'HelpCircle' as const, title: t('games.quizOfDay'), desc: t('games.quizDesc'), color: '#E8591A', screen: 'Quiz' },
    { icon: 'Gift' as const, title: t('games.tombola'), desc: t('games.tombolaDesc'), color: '#F9A825', screen: 'Tombola' },
    { icon: 'Award' as const, title: t('games.badges'), desc: t('games.badgesUnlockedShort', { unlocked: badgesUnlocked, total: badges.length }), color: '#2E7D32', screen: 'Badges' },
  ], [t, badgesUnlocked, badges.length]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('games.title')}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('LeaderboardFull')}
          style={{ width: 36, height: 36, borderRadius: 18, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}
        >
          <Icon name="Trophy" size={17} color="#F9A825" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* XP Hero Banner */}
        <View style={{ margin: 16, borderRadius: 20, backgroundColor: '#1A237E', padding: 20, ...SHADOW_MD }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
            <View>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>{t('games.yourLevel')}</Text>
              <Text style={{ fontSize: 22, fontFamily: 'PlayfairDisplay-Bold', color: '#fff' }}>{t('games.levelN', { n: level })}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#F9A825', fontFamily: 'Inter-Bold' }}>{points.toLocaleString()}</Text>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{t('games.xpPoints')}</Text>
            </View>
          </View>
          <View style={{ height: 7, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 4, overflow: 'hidden' }}>
            <View style={{ height: '100%', width: `${levelPct}%`, backgroundColor: '#F9A825', borderRadius: 4 }} />
          </View>
          <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>{pointsIntoLevel} / {XP_PER_LEVEL} XP · {levelPct}%</Text>
        </View>

        {/* Game modes */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>{t('games.gameModes')}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {gameModes.map((mode) => (
              <TouchableOpacity
                key={mode.title}
                onPress={() => navigation.navigate(mode.screen)}
                style={{ width: '47.5%', backgroundColor: mode.color + '12', borderWidth: 1.5, borderColor: mode.color + '30', borderRadius: 18, padding: 16, ...SHADOW_SM }}
                activeOpacity={0.85}
              >
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: mode.color + '20', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <Icon name={mode.icon} size={20} color={mode.color} />
                </View>
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, marginBottom: 2, fontFamily: 'Inter-Bold' }}>{mode.title}</Text>
                <Text style={{ fontSize: 12, color: C.inkSoft }}>{mode.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Leaderboard */}
        <View style={{ paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ flex: 1, fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: C.ink }}>{t('games.ranking')}</Text>
            <TouchableOpacity onPress={() => navigation.navigate('LeaderboardFull')}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#E8591A' }}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>
          {loading ? (
            <ActivityIndicator color="#E8591A" style={{ marginTop: 12 }} />
          ) : leaderboard.length === 0 ? (
            <Text style={{ fontSize: 13, color: C.inkMute }}>{t('games.noRanking')}</Text>
          ) : (
            <View style={{ backgroundColor: C.surface, borderRadius: 18, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
              {leaderboard.map((player, i) => {
                const displayName = `${player.firstName} ${player.lastName}`.trim();
                const isMe = player.userId === user?.id;
                const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
                return (
                  <View
                    key={player.userId}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, backgroundColor: isMe ? '#FEF3EC' : '#fff', borderTopWidth: i > 0 ? 1 : 0, borderColor: C.border }}
                  >
                    <View style={{ width: 32, alignItems: 'center' }}>
                      {player.rank <= 3 ? (
                        <Icon name="Trophy" size={18} color={player.rank === 1 ? '#F9A825' : player.rank === 2 ? '#8C8278' : '#E8591A'} fill={player.rank === 1 ? '#F9A825' : 'none'} />
                      ) : (
                        <Text style={{ fontSize: 13, fontWeight: '700', color: C.inkMute }}>#{player.rank}</Text>
                      )}
                    </View>
                    <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: color + '20', borderWidth: 1.5, borderColor: color + '40', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color }}>{initials(displayName)[0]}</Text>
                    </View>
                    <Text style={{ flex: 1, fontSize: 14, fontWeight: isMe ? '700' : '500', color: isMe ? '#E8591A' : '#2C1810' }}>
                      {displayName}{isMe ? ` · ${t('games.you')}` : ''}
                    </Text>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: player.rank === 1 ? '#F9A825' : '#2C1810' }}>
                      {player.points.toLocaleString()} pts
                    </Text>
                  </View>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
