// src/screens/pro/ProDashboard.tsx
// Dashboard Pro — revenus, commandes récentes, actions rapides, performances

import React from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.07,
  shadowRadius: 4,
  elevation: 2,
};

const SHADOW_MD = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.10,
  shadowRadius: 6,
  elevation: 4,
};

type QuickAction = {
  icon: 'ShoppingBag' | 'DollarSign' | 'ChefHat' | 'Tag' | 'Users' | 'BarChart2';
  label: string;
  screen: string;
  badge?: string;
  badgeColor?: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  { icon: 'ShoppingBag', label: 'Commandes',  screen: 'ProOrders',       badge: '3', badgeColor: '#C62828' },
  { icon: 'DollarSign',  label: 'Revenus',    screen: 'ProRevenues' },
  { icon: 'ChefHat',     label: 'Menu',       screen: 'RestaurantMenu' },
  { icon: 'Tag',         label: 'Promos',     screen: 'ProPromos' },
  { icon: 'Users',       label: 'Communauté', screen: 'ManageCommunity' },
  { icon: 'BarChart2',   label: 'Analytics',  screen: 'ProAnalytics' },
];

type OrderStatus = 'Nouvelle' | 'En préparation';

type RecentOrder = {
  id: string;
  ref: string;
  client: string;
  amount: string;
  status: OrderStatus;
  time: string;
};

const RECENT_ORDERS: RecentOrder[] = [
  { id: '4825', ref: '#KFL-4825', client: 'Sami N.',  amount: '13 000 XAF', status: 'Nouvelle',       time: 'Il y a 4 min' },
  { id: '4822', ref: '#KFL-4822', client: 'Adèle B.', amount: '6 500 XAF',  status: 'En préparation', time: 'Il y a 18 min' },
];

type PerfStat = { label: string; value: string; unit: string };

const PERF_STATS: PerfStat[] = [
  { label: 'Note',         value: '4.8', unit: '/ 5' },
  { label: 'Temps moyen',  value: '12',  unit: 'min' },
  { label: 'Satisfaction', value: '96',  unit: '%' },
];

function statusColor(status: OrderStatus, C: ReturnType<typeof useColors>): string {
  return status === 'Nouvelle' ? C.primary : C.navy;
}

function statusBg(status: OrderStatus, C: ReturnType<typeof useColors>): string {
  return status === 'Nouvelle' ? C.goldSoft : C.navySoft;
}

export default function ProDashboard() {
  const C = useColors();
  const navigation = useNavigation<any>();

  return (
    <View style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle="light-content" backgroundColor={C.navy} />

      {/* Header navy */}
      <View
        style={{
          backgroundColor: C.navy,
          paddingTop: 48, paddingBottom: 16, paddingHorizontal: 16,
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        }}
      >
        <View style={{ flex: 1, marginRight: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Text style={{ fontFamily: 'Inter-Bold', fontSize: 16, color: '#FFFFFF' }}>
              Chez Mama Pauline
            </Text>
            <View style={{ backgroundColor: C.gold, borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ fontFamily: 'Inter-Bold', fontSize: 10, color: '#FFFFFF', letterSpacing: 0.6 }}>
                PRO
              </Text>
            </View>
          </View>
          <Text style={{ fontFamily: 'Inter-Regular', fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>
            Lundi 15 Juin 2026
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity
            accessibilityLabel="Notifications"
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="Bell" size={20} color="#FFFFFF" strokeWidth={1.8} />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel="Paramètres"
            onPress={() => navigation.navigate('SettingsProActive')}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="Settings" size={20} color="#FFFFFF" strokeWidth={1.8} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Revenue hero */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <View style={{ backgroundColor: C.navy, borderRadius: 20, padding: 20, ...SHADOW_MD }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <Text style={{ fontFamily: 'Inter-Regular', fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>
                Revenus ce mois
              </Text>
              <View
                style={{
                  flexDirection: 'row', alignItems: 'center',
                  backgroundColor: C.successSoft, borderRadius: 9999,
                  paddingHorizontal: 10, paddingVertical: 4, gap: 4,
                }}
              >
                <Icon name="TrendingUp" size={13} color={C.success} strokeWidth={2.5} />
                <Text style={{ fontFamily: 'Inter-Bold', fontSize: 12, color: C.success }}>
                  +12 % vs mois dernier
                </Text>
              </View>
            </View>

            <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 28, color: '#FFFFFF', marginBottom: 18 }}>
              195 400 XAF
            </Text>

            <View
              style={{
                borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)',
                paddingTop: 14, flexDirection: 'row', justifyContent: 'space-between',
              }}
            >
              {[
                { value: '47',   label: 'Commandes' },
                { value: '4.8',  label: 'Note' },
                { value: '98 %', label: 'Acceptation' },
              ].map((stat, idx) => (
                <View key={stat.label} style={{ alignItems: 'center', flex: 1 }}>
                  {idx > 0 && (
                    <View style={{ position: 'absolute', left: 0, top: '10%', height: '80%', width: 1, backgroundColor: 'rgba(255,255,255,0.15)' }} />
                  )}
                  <Text style={{ fontFamily: 'Inter-Bold', fontSize: 18, color: '#FFFFFF' }}>
                    {stat.value}
                  </Text>
                  <Text style={{ fontFamily: 'Inter-Regular', fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Quick actions */}
        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          <Text style={{ fontFamily: 'Inter-Bold', fontSize: 16, color: C.ink, marginBottom: 12 }}>
            Actions rapides
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {QUICK_ACTIONS.map((action) => (
              <TouchableOpacity
                key={action.label}
                onPress={() => navigation.navigate(action.screen)}
                accessibilityLabel={action.label}
                activeOpacity={0.8}
                style={{
                  width: '30.5%', backgroundColor: C.surface,
                  borderRadius: 16, borderWidth: 1, borderColor: C.border,
                  padding: 14, alignItems: 'center', position: 'relative',
                  ...SHADOW_SM,
                }}
              >
                <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: C.navySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <Icon name={action.icon} size={22} color={C.navy} strokeWidth={1.8} />
                </View>

                <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 12, color: C.inkSoft, textAlign: 'center' }}>
                  {action.label}
                </Text>

                {action.badge && (
                  <View
                    style={{
                      position: 'absolute', top: 8, right: 8,
                      backgroundColor: action.badgeColor ?? C.error,
                      borderRadius: 9999, minWidth: 18, height: 18,
                      alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
                    }}
                  >
                    <Text style={{ fontFamily: 'Inter-Bold', fontSize: 10, color: '#FFFFFF' }}>
                      {action.badge}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Commandes récentes */}
        <View style={{ paddingHorizontal: 16, paddingTop: 28 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontFamily: 'Inter-Bold', fontSize: 16, color: C.ink }}>
              Commandes récentes
            </Text>

            <TouchableOpacity onPress={() => navigation.navigate('ProOrders')} accessibilityLabel="Voir toutes les commandes">
              <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 13, color: C.primary }}>
                Voir toutes
              </Text>
            </TouchableOpacity>
          </View>

          {RECENT_ORDERS.map((order) => (
            <TouchableOpacity
              key={order.id}
              onPress={() => navigation.navigate('ProOrderDetail', { orderId: order.id })}
              activeOpacity={0.8}
              accessibilityLabel={`Commande ${order.ref}`}
              style={{
                backgroundColor: C.surface, borderRadius: 14,
                borderWidth: 1, borderColor: C.border,
                padding: 14, marginBottom: 10,
                flexDirection: 'row', alignItems: 'center', gap: 12,
                ...SHADOW_SM,
              }}
            >
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <Text style={{ fontFamily: 'Inter-Bold', fontSize: 13, color: C.ink }}>
                    {order.ref}
                  </Text>
                  <View style={{ backgroundColor: statusBg(order.status, C), borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 2 }}>
                    <Text style={{ fontFamily: 'Inter-Bold', fontSize: 10, color: statusColor(order.status, C) }}>
                      {order.status}
                    </Text>
                  </View>
                </View>

                <Text style={{ fontFamily: 'Inter-Regular', fontSize: 12, color: C.inkMute }}>
                  {order.client} · {order.time}
                </Text>
              </View>

              <View style={{ alignItems: 'flex-end', gap: 4 }}>
                <Text style={{ fontFamily: 'Inter-Bold', fontSize: 14, color: C.ink }}>
                  {order.amount}
                </Text>
                <Icon name="ChevronRight" size={16} color={C.inkMute} strokeWidth={2} />
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Performances */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <Text style={{ fontFamily: 'Inter-Bold', fontSize: 16, color: C.ink, marginBottom: 12 }}>
            Performances
          </Text>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            {PERF_STATS.map((stat) => (
              <View
                key={stat.label}
                style={{
                  flex: 1, backgroundColor: C.surface,
                  borderRadius: 16, borderWidth: 1, borderColor: C.border,
                  paddingVertical: 16, alignItems: 'center',
                  ...SHADOW_SM,
                }}
              >
                <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: C.navy, lineHeight: 28 }}>
                  {stat.value}
                </Text>
                <Text style={{ fontFamily: 'Inter-Regular', fontSize: 11, color: C.inkMute, marginTop: 2 }}>
                  {stat.unit}
                </Text>
                <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 12, color: C.inkSoft, marginTop: 4 }}>
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Événements & Formations */}
        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          <Text style={{ fontFamily: 'Inter-Bold', fontSize: 16, color: C.ink, marginBottom: 12 }}>
            Événements & Formations
          </Text>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              accessibilityLabel="Prochain événement"
              style={{ flex: 1, backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}
            >
              <View style={{ height: 80, backgroundColor: C.navySoft, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Award" size={32} color={C.navy} strokeWidth={1.5} />
              </View>
              <View style={{ padding: 12 }}>
                <View style={{ backgroundColor: C.navySoft, borderRadius: 9999, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, marginBottom: 6 }}>
                  <Text style={{ fontFamily: 'Inter-Bold', fontSize: 10, color: C.navy }}>Prochain</Text>
                </View>
                <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 13, color: C.ink, lineHeight: 18 }}>
                  Soirée Ndolè & Bières
                </Text>
                <Text style={{ fontFamily: 'Inter-Regular', fontSize: 11, color: C.inkMute, marginTop: 4 }}>
                  20 Juin 2026
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              accessibilityLabel="Formation active"
              style={{ flex: 1, backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}
            >
              <View style={{ height: 80, backgroundColor: C.goldSoft, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="ChefHat" size={32} color={C.gold} strokeWidth={1.5} />
              </View>
              <View style={{ padding: 12 }}>
                <View style={{ backgroundColor: C.goldSoft, borderRadius: 9999, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, marginBottom: 6 }}>
                  <Text style={{ fontFamily: 'Inter-Bold', fontSize: 10, color: C.gold }}>En cours</Text>
                </View>
                <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 13, color: C.ink, lineHeight: 18 }}>
                  Cuisine camerounaise pro
                </Text>
                <Text style={{ fontFamily: 'Inter-Regular', fontSize: 11, color: C.inkMute, marginTop: 4 }}>
                  14 inscrits
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Gérer abonnement */}
        <View style={{ paddingHorizontal: 16, paddingTop: 28, paddingBottom: 12 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ProSubscription')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="Gérer mon abonnement Pro"
            style={{
              flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
              backgroundColor: C.navySoft, borderRadius: 14,
              borderWidth: 1.5, borderColor: C.navy, paddingVertical: 14,
            }}
          >
            <Icon name="Award" size={18} color={C.navy} strokeWidth={2} />
            <Text style={{ fontFamily: 'Inter-Bold', fontSize: 15, color: C.navy }}>
              Gérer mon abonnement Pro
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}
