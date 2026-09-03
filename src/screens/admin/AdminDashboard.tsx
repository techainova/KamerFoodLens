import React from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { getAdminMetrics, getAdminAlerts } from '@/store/admin.store';

export default function AdminDashboard() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();

  const metrics = getAdminMetrics();
  const alerts  = getAdminAlerts();

  const NAV_ITEMS = [
    { l: t('admin.users'),          icon: 'Users'      as const, route: 'AdminUsers'     },
    { l: t('admin.navProAccounts'), icon: 'Star'       as const, route: 'AdminProList'   },
    { l: t('admin.moderation'),     icon: 'Shield'     as const, route: 'AdminModeration'},
    { l: t('admin.navFinance'),     icon: 'DollarSign' as const, route: 'AdminFinance'   },
    { l: t('admin.tombolaAdmin'),   icon: 'Ticket'     as const, route: 'AdminTombola'   },
    { l: t('admin.navPush'),        icon: 'Megaphone'  as const, route: 'AdminPush'      },
    { l: t('admin.navLogs'),        icon: 'List'       as const, route: 'AdminLogs'      },
    { l: t('admin.settings'),       icon: 'Settings'   as const, route: 'AdminSettings'  },
  ];

  const METRICS = [
    { v: metrics.totalUsers.toLocaleString(), l: t('admin.users'),      delta: '+124', icon: 'Users'      as const, color: '#1A237E' },
    { v: metrics.proUsers.toLocaleString(),   l: t('admin.activePros'), delta: '+8',   icon: 'Star'       as const, color: '#F9A825' },
    { v: metrics.totalOrders.toLocaleString(),l: t('admin.orders'),     delta: `+${metrics.pendingOrders}`, icon: 'ShoppingBag' as const, color: '#E8591A' },
    { v: (metrics.totalRevenue / 1000).toFixed(0) + 'k', l: t('admin.revenueXaf'), delta: '+9%', icon: 'DollarSign' as const, color: '#2E7D32' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#1A237E', borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'PlayfairDisplay-Bold' }}>Admin Dashboard</Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>
            {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })} · KmerFoodLens
          </Text>
        </View>
        <View style={{ position: 'relative' }}>
          <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Bell" size={16} color="#fff" />
          </TouchableOpacity>
          {alerts.length > 0 && (
            <View style={{ position: 'absolute', top: -2, right: -2, width: 16, height: 16, backgroundColor: '#C62828', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>{alerts.length}</Text>
            </View>
          )}
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Alerts */}
        {alerts.length > 0 && (
          <View style={{ gap: 8, marginBottom: 20 }}>
            {alerts.map((alert, i) => (
              <TouchableOpacity key={i} onPress={() => navigation.navigate(alert.route)} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, backgroundColor: alert.bg, borderWidth: 1, borderColor: alert.bc }}>
                <Icon name={alert.icon as any} size={14} color={alert.tc} />
                <Text style={{ flex: 1, fontSize: 13, color: alert.tc }}>{alert.msg}</Text>
                <Icon name="ChevronRight" size={14} color={alert.tc} />
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Metrics */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>{t('admin.keyMetrics')}</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
          {METRICS.map((m, i) => (
            <View key={i} style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, width: '47%', ...SHADOW_SM }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: m.color + '15', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={m.icon} size={16} color={m.color} />
                </View>
                <View style={{ backgroundColor: C.successSoft, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20 }}>
                  <Text style={{ color: '#2E7D32', fontSize: 11, fontWeight: '600' }}>{m.delta}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 20, fontWeight: '700', color: m.color }}>{m.v}</Text>
              <Text style={{ color: C.inkMute, fontSize: 11, marginTop: 2 }}>{m.l}</Text>
            </View>
          ))}
        </View>

        {/* Community stats */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>{t('admin.community')}</Text>
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          {[
            { v: metrics.totalPosts,   l: t('admin.posts'),   icon: 'FileText',      color: '#E8591A' },
            { v: metrics.totalThreads, l: t('admin.threads'), icon: 'MessageSquare', color: '#1A237E' },
            { v: metrics.totalEvents,  l: t('admin.events'),  icon: 'Calendar',      color: '#2E7D32' },
          ].map((m, i) => (
            <View key={i} style={{ flex: 1, padding: 14, borderRadius: 16, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, alignItems: 'center', ...SHADOW_SM }}>
              <Icon name={m.icon as any} size={20} color={m.color} />
              <Text style={{ fontSize: 18, fontWeight: '700', color: m.color, marginTop: 6 }}>{m.v}</Text>
              <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 2 }}>{m.l}</Text>
            </View>
          ))}
        </View>

        {/* Navigation */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>{t('admin.navigation')}</Text>
        <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
          {NAV_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => navigation.navigate(item.route)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: i < NAV_ITEMS.length - 1 ? 1 : 0, borderColor: C.border }}
            >
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: C.navySoft, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={item.icon} size={15} color="#1A237E" />
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: C.ink }}>{item.l}</Text>
              <Icon name="ChevronRight" size={16} color="#8C8278" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
