import React, { useState } from 'react';
import {
  View, ScrollView, TextInput, TouchableOpacity, StatusBar,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';

const RECENT_USERS = [
  { name: 'Sami Nguimfack', role: 'Standard', status: 'active',    joined: '15 Jun' },
  { name: 'Adèle Biya',     role: 'Pro',      status: 'active',    joined: '14 Jun' },
  { name: 'Chef Joël',      role: 'Pro',      status: 'suspended', joined: '12 Jun' },
];

export default function AdminDashUnified() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const STATS = [
    { v: '8 247',  l: t('admin.users'),      delta: '+124', color: '#1A237E', icon: 'Users'      as const },
    { v: '312',    l: t('admin.activePros'), delta: '+8',   color: '#F9A825', icon: 'Star'       as const },
    { v: '47 892', l: t('admin.scansMonth'), delta: '+12%', color: '#E8591A', icon: 'ScanLine'   as const },
    { v: '1.4M',   l: t('admin.revenueXaf'), delta: '+9%', color: '#2E7D32', icon: 'DollarSign' as const },
  ];

  const QUICK_ACTIONS = [
    { l: t('admin.users'),       icon: 'Users'      as const, route: 'AdminUsers'      },
    { l: t('admin.moderation'),  icon: 'Shield'     as const, route: 'AdminModeration' },
    { l: t('admin.finance'),     icon: 'DollarSign' as const, route: 'AdminFinance'    },
    { l: t('admin.navLogs'),     icon: 'List'       as const, route: 'AdminLogs'       },
    { l: t('admin.tombolaAdmin'),icon: 'Ticket'     as const, route: 'AdminTombola'    },
    { l: t('admin.events'),      icon: 'Calendar'   as const, route: 'AdminEvents'     },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#1A237E' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'PlayfairDisplay-Bold' }}>Admin Dashboard</Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>KmerFoodLens · Panel Admin</Text>
        </View>
        <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="Shield" size={16} color="#fff" />
        </View>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 10, backgroundColor: C.navySoft, borderBottomWidth: 1, borderColor: '#1A237E20' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 40, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 12, gap: 8 }}>
          <Icon name="Search" size={15} color="#8C8278" />
          <TextInput
            value={search} onChangeText={setSearch}
            placeholder={t('admin.searchPlaceholder')}
            placeholderTextColor="#8C8278" style={{ flex: 1, fontSize: 14, color: C.ink }}
          />
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Stats grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          {STATS.map((s, i) => (
            <View key={i} style={{ padding: 14, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, width: '47%', ...SHADOW_SM }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <View style={{ width: 28, height: 28, borderRadius: 8, backgroundColor: s.color + '15', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={s.icon} size={13} color={s.color} />
                </View>
                <View style={{ backgroundColor: C.successSoft, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 }}>
                  <Text style={{ color: '#2E7D32', fontSize: 10, fontWeight: '600' }}>{s.delta}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 18, fontWeight: '700', color: s.color }}>{s.v}</Text>
              <Text style={{ color: C.inkMute, fontSize: 11 }}>{s.l}</Text>
            </View>
          ))}
        </View>

        {/* Quick actions */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>{t('admin.quickActions')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {QUICK_ACTIONS.map((a, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => navigation.navigate(a.route)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 38, paddingHorizontal: 12, borderRadius: 12, backgroundColor: C.navySoft, borderWidth: 1, borderColor: '#1A237E20' }}
            >
              <Icon name={a.icon} size={13} color="#1A237E" />
              <Text style={{ fontSize: 12, fontWeight: '600', color: '#1A237E' }}>{a.l}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent users */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>{t('admin.recentUsers')}</Text>
        <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
          {RECENT_USERS.map((user, i) => (
            <TouchableOpacity
              key={i}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: i < RECENT_USERS.length - 1 ? 1 : 0, borderColor: C.border }}
            >
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: C.inkSoft, fontSize: 13, fontWeight: '600' }}>{user.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{user.name}</Text>
                <Text style={{ fontSize: 11, color: C.inkMute }}>{user.role} · {user.joined}</Text>
              </View>
              <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 10, backgroundColor: user.status === 'active' ? '#E3F0E4' : '#FBDCDC' }}>
                <Text style={{ fontSize: 11, fontWeight: '600', color: user.status === 'active' ? '#2E7D32' : '#C62828' }}>
                  {user.status === 'active' ? t('admin.statusActive') : t('admin.statusSuspended')}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
