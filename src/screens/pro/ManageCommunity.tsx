import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

type Member = {
  id: string;
  name: string;
  joined: string;
  role: 'member' | 'moderator';
  active: boolean;
  blocked: boolean;
};

const INITIAL_MEMBERS: Member[] = [
  { id: '1', name: 'Sami Nguimfack', joined: '10 Jan', role: 'member',     active: true,  blocked: false },
  { id: '2', name: 'Adèle Biya',     joined: '15 Jan', role: 'moderator',  active: true,  blocked: false },
  { id: '3', name: 'Ngo Mireille',   joined: '20 Jan', role: 'member',     active: false, blocked: false },
];

export default function ManageCommunity() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [members, setMembers] = useState<Member[]>(INITIAL_MEMBERS);

  const roleLabel = (role: Member['role']) => (role === 'moderator' ? t('manageCommunity.roleModerator') : t('manageCommunity.roleMember'));

  const filtered = members.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()));

  const handleRemove = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const handleToggleBlock = (id: string) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, blocked: !m.blocked } : m)));
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

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          {[{ v: '312', l: t('manageCommunity.members') }, { v: '24', l: t('manageCommunity.activeWeek') }, { v: '4.8', l: t('manageCommunity.satisfaction') }].map((s, i) => (
            <View key={i} style={{ flex: 1, padding: 12, borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, alignItems: 'center', ...SHADOW_SM }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: C.gold }}>{s.v}</Text>
              <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 2 }}>{s.l}</Text>
            </View>
          ))}
        </View>

        {/* Members list */}
        {filtered.length === 0 ? (
          <Text style={{ fontSize: 13, color: C.inkMute, textAlign: 'center', marginTop: 24 }}>{t('manageCommunity.noResults')}</Text>
        ) : (
          <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
            {filtered.map((m, i) => (
              <View key={m.id} style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: i < filtered.length - 1 ? 1 : 0, borderColor: C.surface2 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: C.inkSoft }}>{m.name[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{m.name}</Text>
                    <Text style={{ fontSize: 12, color: C.inkMute }}>{roleLabel(m.role)} · {m.joined}</Text>
                  </View>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: m.active ? C.success : C.border }} />
                </View>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
                  <TouchableOpacity
                    onPress={() => handleToggleBlock(m.id)}
                    style={{ flex: 1, height: 32, borderRadius: 16, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Text style={{ fontSize: 12, color: C.inkSoft }}>{m.blocked ? t('manageCommunity.unblock') : t('manageCommunity.block')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleRemove(m.id)}
                    style={{ flex: 1, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#C6282830', alignItems: 'center', justifyContent: 'center' }}
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
