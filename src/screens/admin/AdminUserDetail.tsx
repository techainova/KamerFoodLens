import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

type UserStatus = 'active' | 'suspended' | 'banned';

const STATUS_OPTS: { key: UserStatus; label: string; color: string; bg: string }[] = [
  { key: 'active',    label: 'Actif',    color: '#2E7D32', bg: '#E3F0E4' },
  { key: 'suspended', label: 'Suspendu', color: '#F9A825', bg: '#FBF3DC' },
  { key: 'banned',    label: 'Banni',    color: '#C62828', bg: '#FBDCDC' },
];

export default function AdminUserDetail() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const [status, setStatus] = useState<UserStatus>('active');

  const current = STATUS_OPTS.find(s => s.key === status)!;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#1A237E' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12, padding: 4 }}>
          <Icon name="ArrowLeft" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', flex: 1 }}>Utilisateur · Détail</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>

        {/* User info card */}
        <View style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, marginBottom: 16, ...SHADOW_SM }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: '#E8591A20', borderWidth: 2, borderColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 22, fontWeight: '700', color: '#E8591A', fontFamily: 'Inter-Bold' }}>S</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink }}>Sami Nguimfack</Text>
              <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 2 }}>@sami_nguimfack</Text>
              <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, backgroundColor: C.surface2 }}>
                  <Text style={{ fontSize: 11, color: C.inkSoft }}>Standard</Text>
                </View>
                <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, backgroundColor: current.bg }}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: current.color }}>{current.label}</Text>
                </View>
              </View>
            </View>
          </View>

          {[
            { l: 'ID',               v: '#USR-8247' },
            { l: 'Email',            v: 'sami@kfl.cm' },
            { l: 'Tel',              v: '+237 69 00 00 00' },
            { l: 'Inscrit',          v: '3 Jan 2026' },
            { l: 'Dernière connexion',v: '15 Jun 2026 14:38' },
          ].map((row, i) => (
            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: i < 4 ? 1 : 0, borderColor: C.border }}>
              <Text style={{ fontSize: 13, color: C.inkMute }}>{row.l}</Text>
              <Text style={{ fontSize: 13, fontWeight: '500', color: C.ink }}>{row.v}</Text>
            </View>
          ))}
        </View>

        {/* Activity */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          {[{ v: '312', l: 'Scans' }, { v: '48', l: 'Posts' }, { v: '4 250', l: 'XP' }].map((s, i) => (
            <View key={i} style={{ flex: 1, padding: 12, borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, alignItems: 'center', ...SHADOW_SM }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink }}>{s.v}</Text>
              <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 2 }}>{s.l}</Text>
            </View>
          ))}
        </View>

        {/* Status control */}
        <View style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>Modifier le statut</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {STATUS_OPTS.map(opt => (
              <TouchableOpacity
                key={opt.key}
                onPress={() => setStatus(opt.key)}
                style={{ flex: 1, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: status === opt.key ? 1.5 : 1, borderColor: status === opt.key ? opt.color : '#E5E0D8', backgroundColor: status === opt.key ? opt.bg : '#fff' }}
              >
                <Text style={{ fontSize: 12, fontWeight: '600', color: status === opt.key ? opt.color : '#8C8278' }}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom actions */}
      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        <TouchableOpacity style={{ flex: 1, height: 44, borderWidth: 1, borderColor: C.border, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, color: C.inkSoft }}>Impersonifier</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, height: 44, backgroundColor: '#1A237E', borderRadius: 22, alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.85}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>Enregistrer</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
