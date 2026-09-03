import React, { useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, Modal, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import Icon, { type IconName } from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { gamesService, type Badge } from '@/services/games.service';

const CATEGORY_IDS = ['all', 'scan', 'community', 'games', 'orders', 'courses'] as const;
type CategoryId = typeof CATEGORY_IDS[number];

export default function Badges() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  const { data: badges = [], isLoading } = useQuery({
    queryKey: ['my-badges'],
    queryFn: () => gamesService.getMyBadges(),
    staleTime: 10 * 60_000,
  });

  const CATEGORY_LABELS: Record<CategoryId, string> = {
    all:       t('common.all'),
    scan:      t('games.categoryScan'),
    community: t('games.categoryCommunity'),
    games:     t('games.categoryGames'),
    orders:    t('games.categoryOrders'),
    courses:   t('games.categoryCourses'),
  };

  const filtered = activeCategory === 'all'
    ? badges
    : badges.filter(b => b.category === activeCategory);

  const unlocked = badges.filter(b => b.isEarned).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('games.badges')}</Text>
        {!isLoading && (
          <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: C.primary + '15' }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: C.primary }}>{unlocked}/{badges.length}</Text>
          </View>
        )}
      </View>

      {/* Progress banner */}
      {!isLoading && badges.length > 0 && (
        <View style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ fontSize: 13, color: C.inkSoft }}>{t('games.unlockedBadgesOf', { unlocked, total: badges.length })}</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: C.primary }}>{Math.round((unlocked / badges.length) * 100)}%</Text>
          </View>
          <View style={{ height: 6, backgroundColor: C.surface2, borderRadius: 3, overflow: 'hidden' }}>
            <View style={{ height: '100%', width: `${(unlocked / badges.length) * 100}%`, backgroundColor: C.primary, borderRadius: 3 }} />
          </View>
        </View>
      )}

      {/* Category chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }} style={{ backgroundColor: C.surface, maxHeight: 52, borderBottomWidth: 1, borderColor: C.border }}>
        {CATEGORY_IDS.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setActiveCategory(cat)}
            style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: cat === activeCategory ? C.primary : C.surface2, borderWidth: 1, borderColor: cat === activeCategory ? C.primary : C.border }}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: cat === activeCategory ? '#fff' : C.inkSoft }}>{CATEGORY_LABELS[cat]}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color={C.primary} />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {filtered.map(badge => (
              <TouchableOpacity
                key={badge.id}
                onPress={() => setSelectedBadge(badge)}
                style={{ width: '30%', alignItems: 'center', gap: 6 }}
                activeOpacity={0.8}
              >
                <View style={{
                  width: 72, height: 72, borderRadius: 36,
                  backgroundColor: badge.isEarned ? badge.color + '15' : C.surface2,
                  borderWidth: 2,
                  borderColor: badge.isEarned ? badge.color + '50' : C.border,
                  alignItems: 'center', justifyContent: 'center',
                  ...SHADOW_SM,
                }}>
                  <Icon name={badge.icon as IconName} size={28} color={badge.isEarned ? badge.color : '#C4BDB7'} fill="none" />
                  {!badge.isEarned && (
                    <View style={{ position: 'absolute', bottom: -2, right: -2, width: 22, height: 22, borderRadius: 11, backgroundColor: C.border, borderWidth: 2, borderColor: C.surface, alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="Lock" size={10} color={C.inkMute} />
                    </View>
                  )}
                </View>
                <Text style={{ fontSize: 11, fontWeight: badge.isEarned ? '600' : '400', color: badge.isEarned ? C.ink : C.inkMute, textAlign: 'center' }} numberOfLines={2}>
                  {badge.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Badge detail modal */}
      <Modal visible={!!selectedBadge} transparent animationType="fade" onRequestClose={() => setSelectedBadge(null)}>
        <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }} activeOpacity={1} onPress={() => setSelectedBadge(null)}>
          {selectedBadge && (
            <TouchableOpacity activeOpacity={1} style={{ width: '80%', backgroundColor: C.surface, borderRadius: 24, padding: 28, alignItems: 'center', ...SHADOW_SM }}>
              <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: selectedBadge.isEarned ? selectedBadge.color + '15' : C.surface2, borderWidth: 3, borderColor: selectedBadge.isEarned ? selectedBadge.color + '50' : C.border, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Icon name={selectedBadge.icon as IconName} size={36} color={selectedBadge.isEarned ? selectedBadge.color : '#C4BDB7'} />
              </View>
              <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: selectedBadge.isEarned ? C.successSoft : C.surface2, marginBottom: 10 }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: selectedBadge.isEarned ? C.success : C.inkMute, textTransform: 'uppercase' }}>
                  {selectedBadge.isEarned ? t('games.unlockedBadge') : t('games.notUnlockedBadge')} · {CATEGORY_LABELS[selectedBadge.category as CategoryId] ?? selectedBadge.category}
                </Text>
              </View>
              <Text style={{ fontSize: 18, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 8, textAlign: 'center' }}>{selectedBadge.name}</Text>
              <Text style={{ fontSize: 13, color: C.inkSoft, textAlign: 'center', lineHeight: 20, marginBottom: 16 }}>{selectedBadge.description}</Text>
              {selectedBadge.xpReward > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Icon name="Zap" size={14} color={C.gold} fill={C.gold} />
                  <Text style={{ fontSize: 14, fontWeight: '700', color: C.gold }}>+{selectedBadge.xpReward} XP</Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
