import React from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const ALERTS = [
  { type: 'warn',  msg: '3 contenus signalés en attente',  icon: 'AlertTriangle' as const, bg: '#FBF3DC', bc: '#F9A82540', tc: '#F9A825' },
  { type: 'error', msg: 'Paiement MTN échoué · #TX-4820',  icon: 'X'             as const, bg: '#FBDCDC', bc: '#C6282840', tc: '#C62828' },
  { type: 'info',  msg: '8 nouvelles inscriptions Pro',     icon: 'Info'          as const, bg: '#E8EAF6', bc: '#1A237E20', tc: '#1A237E' },
];

const METRICS = [
  { v: '8 247', l: 'Utilisateurs',  delta: '+124', icon: 'Users'      as const, color: '#1A237E' },
  { v: '312',   l: 'Pros actifs',   delta: '+8',   icon: 'Star'       as const, color: '#F9A825' },
  { v: '47.9k', l: 'Scans/mois',   delta: '+12%', icon: 'ScanLine'   as const, color: '#E8591A' },
  { v: '1.4M',  l: 'Revenus XAF',  delta: '+9%',  icon: 'DollarSign' as const, color: '#2E7D32' },
];

const NAV_ITEMS = [
  { l: 'Utilisateurs',       icon: 'Users'         as const, route: 'AdminUsers'     },
  { l: 'Comptes Pro',        icon: 'Star'          as const, route: 'AdminProList'   },
  { l: 'Modération',         icon: 'Shield'        as const, route: 'AdminModeration'},
  { l: 'Finance & Virements',icon: 'DollarSign'    as const, route: 'AdminFinance'   },
  { l: 'Tombola',            icon: 'Ticket'        as const, route: 'AdminTombola'   },
  { l: 'Notifications Push', icon: 'Megaphone'     as const, route: 'AdminPush'      },
  { l: 'Logs & Alertes',     icon: 'List'          as const, route: 'AdminLogs'      },
  { l: 'Paramètres',         icon: 'Settings'      as const, route: 'AdminSettings'  },
];

export default function AdminDashboard() {
  const navigation = useNavigation<any>();
  const C = useColors();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#1A237E', borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.1)' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'PlayfairDisplay-Bold' }}>Admin Dashboard</Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 11 }}>Juin 2026 · KmerFoodLens</Text>
        </View>
        <View style={{ position: 'relative' }}>
          <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Bell" size={16} color="#fff" />
          </TouchableOpacity>
          <View style={{ position: 'absolute', top: -2, right: -2, width: 16, height: 16, backgroundColor: '#C62828', borderRadius: 8, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>3</Text>
          </View>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Alerts */}
        <View style={{ gap: 8, marginBottom: 20 }}>
          {ALERTS.map((alert, i) => (
            <TouchableOpacity key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: 12, backgroundColor: alert.bg, borderWidth: 1, borderColor: alert.bc }}>
              <Icon name={alert.icon} size={14} color={alert.tc} />
              <Text style={{ flex: 1, fontSize: 13, color: alert.tc }}>{alert.msg}</Text>
              <Icon name="ChevronRight" size={14} color={alert.tc} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Metrics */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>Métriques clés</Text>
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

        {/* Navigation */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>Navigation</Text>
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
