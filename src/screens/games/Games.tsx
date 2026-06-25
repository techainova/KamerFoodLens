import React, { useState, useEffect } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };
const SHADOW_MD = { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 6, elevation: 4 };

const LEADERBOARD = [
  { rank: 1, user: 'Chef Joël', pts: 8420, initials: 'CJ', color: '#F9A825', isMe: false },
  { rank: 2, user: 'Adèle Biya', pts: 7105, initials: 'AB', color: '#8C8278', isMe: false },
  { rank: 3, user: 'Sami N.', pts: 6780, initials: 'SN', color: '#E8591A', isMe: false },
  { rank: 4, user: 'Moi', pts: 4250, initials: 'MO', color: '#E8591A', isMe: true },
];

function useDailyCountdown() {
  const [countdown, setCountdown] = useState('');
  useEffect(() => {
    const update = () => {
      const now  = new Date();
      const midnight = new Date(now);
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight.getTime() - now.getTime();
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);
  return countdown;
}

export default function Games() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const countdown  = useDailyCountdown();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>Jeux & Défis</Text>
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
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 2 }}>Votre niveau</Text>
              <Text style={{ fontSize: 22, fontFamily: 'PlayfairDisplay-Bold', color: '#fff' }}>Chef Explorateur</Text>
              <Text style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>Prochain : Chef Maître</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 24, fontWeight: '700', color: '#F9A825', fontFamily: 'Inter-Bold' }}>4 250</Text>
              <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>points XP</Text>
            </View>
          </View>
          <View style={{ height: 7, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 4, overflow: 'hidden' }}>
            <View style={{ height: '100%', width: '68%', backgroundColor: '#F9A825', borderRadius: 4 }} />
          </View>
          <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>4 250 / 6 250 XP · 68%</Text>
        </View>

        {/* Game modes 2x2 */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>Modes de jeu</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {[
              { icon: 'HelpCircle' as const, title: 'Quiz du jour', en: 'Daily Quiz', desc: '10 questions · +150 pts', color: '#E8591A', badge: 'NOUVEAU', screen: 'Quiz' },
              { icon: 'Gift' as const, title: 'Tombola', en: 'Lucky Draw', desc: 'Tirage le 30 Juin', color: '#F9A825', badge: null, screen: 'Tombola' },
              { icon: 'Award' as const, title: 'Badges', en: 'Achievements', desc: '12/25 débloqués', color: '#2E7D32', badge: null, screen: 'Badges' },
              { icon: 'Zap' as const, title: 'Défi rapide', en: 'Speed Challenge', desc: '30 sec · 5 plats', color: '#1A237E', badge: null, screen: 'SpeedChallenge' },
            ].map((mode) => (
              <TouchableOpacity
                key={mode.title}
                onPress={() => navigation.navigate(mode.screen)}
                style={{ width: '47.5%', backgroundColor: mode.color + '12', borderWidth: 1.5, borderColor: mode.color + '30', borderRadius: 18, padding: 16, ...SHADOW_SM }}
                activeOpacity={0.85}
              >
                {mode.badge && (
                  <View style={{ position: 'absolute', top: 10, right: 10, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8, backgroundColor: '#C62828' }}>
                    <Text style={{ fontSize: 8, fontWeight: '700', color: '#fff' }}>{mode.badge}</Text>
                  </View>
                )}
                <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: mode.color + '20', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                  <Icon name={mode.icon} size={20} color={mode.color} />
                </View>
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, marginBottom: 2, fontFamily: 'Inter-Bold' }}>{mode.title}</Text>
                <Text style={{ fontSize: 11, color: C.inkMute, fontStyle: 'italic', marginBottom: 4 }}>{mode.en}</Text>
                <Text style={{ fontSize: 12, color: C.inkSoft }}>{mode.desc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Daily challenge */}
        <View style={{ marginHorizontal: 16, backgroundColor: '#FEF3EC', borderRadius: 18, padding: 16, borderWidth: 1.5, borderColor: '#E8591A40', marginBottom: 20, ...SHADOW_SM }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#E8591A20', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Flame" size={16} color="#E8591A" fill="#E8591A" />
            </View>
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: '#E8591A', fontFamily: 'Inter-Bold' }}>Défi du jour</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="Clock" size={13} color="#8C8278" />
              <Text style={{ fontSize: 12, color: C.inkMute, fontFamily: 'JetBrainsMono-Regular' }}>{countdown}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink, marginBottom: 4 }}>
            Identifiez 3 plats du Littoral en mode rapide
          </Text>
          <Text style={{ fontSize: 12, color: C.inkMute, fontStyle: 'italic', marginBottom: 12 }}>
            Identify 3 dishes from Littoral region
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Icon name="Zap" size={14} color="#E8591A" fill="#E8591A" />
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#E8591A' }}>+300 XP · Badge bonus</Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('SpeedChallenge')}
              style={{ paddingHorizontal: 18, paddingVertical: 8, backgroundColor: '#E8591A', borderRadius: 20 }}
            >
              <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>Jouer</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Leaderboard */}
        <View style={{ paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ flex: 1, fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: C.ink }}>Classement</Text>
            <TouchableOpacity onPress={() => navigation.navigate('LeaderboardFull')}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#E8591A' }}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          <View style={{ backgroundColor: C.surface, borderRadius: 18, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
            {LEADERBOARD.map((player, i) => (
              <View
                key={player.rank}
                style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, backgroundColor: player.isMe ? '#FEF3EC' : '#fff', borderTopWidth: i > 0 ? 1 : 0, borderColor: C.border }}
              >
                {/* Medal */}
                <View style={{ width: 32, alignItems: 'center' }}>
                  {player.rank <= 3 ? (
                    <Icon name="Trophy" size={18} color={player.rank === 1 ? '#F9A825' : player.rank === 2 ? '#8C8278' : '#E8591A'} fill={player.rank === 1 ? '#F9A825' : 'none'} />
                  ) : (
                    <Text style={{ fontSize: 13, fontWeight: '700', color: C.inkMute }}>#{player.rank}</Text>
                  )}
                </View>
                <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: player.color + '20', borderWidth: 1.5, borderColor: player.color + '40', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: player.color }}>{player.initials[0]}</Text>
                </View>
                <Text style={{ flex: 1, fontSize: 14, fontWeight: player.isMe ? '700' : '500', color: player.isMe ? '#E8591A' : '#2C1810' }}>
                  {player.user}{player.isMe ? ' · Vous' : ''}
                </Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: player.rank === 1 ? '#F9A825' : '#2C1810' }}>
                  {player.pts.toLocaleString()} pts
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
