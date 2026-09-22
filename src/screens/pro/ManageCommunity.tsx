import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, TextInput, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { Alert } from '@/utils/alert';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { proService, type CommunityMember } from '@/services/pro.service';

export default function ManageCommunity() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(() => {
    setIsLoading(true);
    proService.getCommunityMembers()
      .then(setMembers)
      .catch(() => setMembers([]))
      .finally(() => setIsLoading(false));
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const filtered = members.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));
  const activeCount = members.filter((m) => m.isActive).length;

  const handleRemove = (member: CommunityMember) => {
    Alert.alert(
      t('manageCommunity.remove'),
      member.name,
      [
        { text: t('manageEvent.cancelConfirmNo'), style: 'cancel' },
        {
          text: t('manageCommunity.remove'),
          style: 'destructive',
          onPress: async () => {
            setBusyId(member.userId);
            try {
              await proService.removeCommunityMember(member.userId);
              setMembers((prev) => prev.filter((m) => m.userId !== member.userId));
            } catch {
              Alert.alert(t('common.error', 'Erreur'), t('manageCommunity.actionError', "L'action a échoué."));
            } finally {
              setBusyId(null);
            }
          },
        },
      ],
    );
  };

  const handleToggleBlock = async (member: CommunityMember) => {
    setBusyId(member.userId);
    try {
      await proService.setMemberBlocked(member.userId, !member.isBlocked);
      setMembers((prev) => prev.map((m) => (m.userId === member.userId ? { ...m, isBlocked: !m.isBlocked } : m)));
    } catch {
      Alert.alert(t('common.error', 'Erreur'), t('manageCommunity.actionError', "L'action a échoué."));
    } finally {
      setBusyId(null);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('manageCommunity.title')}</Text>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 40, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 12, gap: 8 }}>
          <Icon name="Search" size={14} color={C.inkMute} />
          <TextInput value={search} onChangeText={setSearch} placeholder={t('manageCommunity.searchPlaceholder')} placeholderTextColor={C.inkMute} style={{ flex: 1, fontSize: 14, color: C.ink }} />
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Stats — dérivées des vrais abonnés (restaurant_follows) */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          {[
            { v: String(members.length), l: t('manageCommunity.members') },
            { v: String(activeCount), l: t('manageCommunity.activeWeek') },
            { v: String(members.filter((m) => m.isBlocked).length), l: t('manageCommunity.blockedCount', 'Bloqués') },
          ].map((s, i) => (
            <View key={i} style={{ flex: 1, padding: 12, borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, alignItems: 'center', ...SHADOW_SM }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: C.gold }}>{s.v}</Text>
              <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 2 }}>{s.l}</Text>
            </View>
          ))}
        </View>

        {isLoading ? (
          <ActivityIndicator color={C.primary} style={{ marginTop: 30 }} />
        ) : filtered.length === 0 ? (
          <Text style={{ fontSize: 13, color: C.inkMute, textAlign: 'center', marginTop: 24 }}>{t('manageCommunity.noResults')}</Text>
        ) : (
          <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
            {filtered.map((m, i) => (
              <View key={m.userId} style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: i < filtered.length - 1 ? 1 : 0, borderColor: C.surface2 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: C.inkSoft }}>{m.name[0]?.toUpperCase() ?? '?'}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{m.name}</Text>
                    <Text style={{ fontSize: 12, color: C.inkMute }}>
                      {t('manageCommunity.followedSince', 'Abonné depuis le {{date}}', { date: new Date(m.followedAt).toLocaleDateString() })}
                    </Text>
                  </View>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: m.isActive ? C.success : C.border }} />
                </View>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                  <TouchableOpacity
                    onPress={() => void handleToggleBlock(m)}
                    disabled={busyId === m.userId}
                    style={{ flex: 1, height: 32, borderRadius: 16, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center', opacity: busyId === m.userId ? 0.6 : 1 }}
                  >
                    <Text style={{ fontSize: 12, color: C.inkSoft }}>{m.isBlocked ? t('manageCommunity.unblock') : t('manageCommunity.block')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleRemove(m)}
                    disabled={busyId === m.userId}
                    style={{ flex: 1, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#C6282830', alignItems: 'center', justifyContent: 'center', opacity: busyId === m.userId ? 0.6 : 1 }}
                  >
                    <Text style={{ fontSize: 12, color: C.error }}>{t('manageCommunity.remove')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
