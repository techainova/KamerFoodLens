// Compte Pro — tableau de bord, relooké dans la palette chaude du design v5
// (au lieu du bleu marine "admin" d'origine), avec données réelles.
import React from 'react';
import {
  ScrollView, StatusBar, TouchableOpacity, View, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { proService, type ProOrderSummary } from '@/services/pro.service';
import { useAuthStore } from '@/store/auth.store';
import { onTabBarScroll } from '@/navigation/tabBarScroll';

const FALLBACK_STATS = { revenueXAF: 0, ordersCount: 0, rating: 0, revenueChange: 0, ordersChange: 0, customersCount: 0, avgOrderXAF: 0, activeMenuItems: 0 };

const QUICK_ACTIONS: { icon: Parameters<typeof Icon>[0]['name']; labelKey: string; screen: string; params?: Record<string, unknown>; color: (C: ReturnType<typeof useColors>) => string }[] = [
  { icon: 'Store', labelKey: 'pro.myMenu', screen: 'RestaurantMenu', color: (C) => C.primary },
  { icon: 'ShoppingBag', labelKey: 'pro.orders', screen: 'ProOrders', color: (C) => C.error },
  { icon: 'Calendar', labelKey: 'pro.activeEvents', screen: 'ProOffers', params: { tab: 'events' }, color: () => '#6A1B9A' },
  { icon: 'GraduationCap', labelKey: 'pro.activeCourses', screen: 'ProOffers', params: { tab: 'formations' }, color: (C) => C.success },
  { icon: 'Wallet', labelKey: 'pro.revenues', screen: 'ProRevenues', color: () => '#1565C0' },
  { icon: 'TrendingUp', labelKey: 'proAnalytics.title', screen: 'ProAnalytics', color: (C) => C.gold },
];

type OrderApiStatus = ProOrderSummary['status'];

function orderStatusLabel(status: OrderApiStatus, t: (k: string) => string): string {
  const MAP: Record<OrderApiStatus, string> = {
    pending: t('order.statuses.pending'), confirmed: t('order.statuses.confirmed'), preparing: t('order.statuses.preparing'),
    ready: t('order.statuses.ready'), delivering: t('order.statuses.delivering'), completed: t('order.statuses.completed'), cancelled: t('order.statuses.cancelled'),
  };
  return MAP[status] ?? status;
}

function relativeTime(isoDate: string, t: (k: string, opts?: Record<string, unknown>) => string): string {
  const diffMin = Math.floor((Date.now() - Date.parse(isoDate)) / 60_000);
  if (diffMin < 60) return t('common.minutesAgo', { count: diffMin });
  const diffH = Math.floor(diffMin / 60);
  if (diffH < 24) return t('common.hoursAgo', { count: diffH });
  return t('common.daysAgo', { count: Math.floor(diffH / 24) });
}

export default function ProDashboard() {
  const C = useColors();
  const navigation = useNavigation<any>();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);

  const { data: dashStats } = useQuery({ queryKey: ['pro-dashboard'], queryFn: () => proService.getDashboard(), staleTime: 5 * 60_000 });
  const { data: ordersData, isLoading: ordersLoading } = useQuery({ queryKey: ['pro-orders-recent'], queryFn: () => proService.getOrders(undefined, 1), staleTime: 2 * 60_000 });
  const { data: revenues } = useQuery({ queryKey: ['pro-revenues-week'], queryFn: () => proService.getRevenues('week'), staleTime: 5 * 60_000 });

  const stats = dashStats ?? FALLBACK_STATS;
  const pendingOrders = (ordersData?.items ?? []).filter((o) => o.status === 'pending');
  const recentOrders = (ordersData?.items ?? []).slice(0, 5);
  const days = revenues?.revenueByDay ?? [];
  const maxAmount = Math.max(1, ...days.map((d) => d.amount));

  const todayLabel = new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={C.statusBar} />

      {/* Barre du haut */}
      <View style={{ height: 50, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 9 }}>
        <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{(user?.firstName?.charAt(0) ?? 'K').toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 13.5, fontWeight: '700', color: C.ink }} numberOfLines={1}>{user?.firstName ? `${user.firstName} ${user.lastName}` : 'KFL Pro'}</Text>
          <Text style={{ fontSize: 10, color: C.primary, fontWeight: '700' }}>COMPTE PRO · vérifié</Text>
        </View>
        <TouchableOpacity style={{ width: 32, height: 32, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="Bell" size={20} color={C.ink} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }} onScroll={onTabBarScroll} scrollEventThrottle={16}>
        {/* Bandeau du jour */}
        <View style={{ margin: 14, padding: 16, borderRadius: 18, backgroundColor: C.ink, position: 'relative' }}>
          <Text style={{ fontSize: 10.5, color: 'rgba(255,255,255,0.6)', fontWeight: '700', letterSpacing: 1 }}>AUJOURD'HUI · {todayLabel}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8, marginTop: 6 }}>
            <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 30, color: C.cream }}>{stats.revenueXAF.toLocaleString()}</Text>
            <Text style={{ fontSize: 12.5, color: 'rgba(255,255,255,0.7)' }}>XAF encaissés</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 18, marginTop: 12 }}>
            {[[String(stats.ordersCount), 'commandes'], [String(pendingOrders.length), 'à confirmer'], ['—', 'réservations']].map(([n, l], i) => (
              <View key={l}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: i === 1 ? '#FF7A3D' : C.cream }}>{n}</Text>
                <Text style={{ fontSize: 10, color: 'rgba(255,255,255,0.6)' }}>{l}</Text>
              </View>
            ))}
          </View>
          <View style={{ position: 'absolute', top: 15, right: 15, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, backgroundColor: 'rgba(76,175,80,0.2)' }}>
            <Text style={{ color: '#4CAF50', fontSize: 11, fontWeight: '700' }}>● Ouvert</Text>
          </View>
        </View>

        {/* Urgent — à confirmer */}
        {pendingOrders.length > 0 && (
          <View style={{ paddingHorizontal: 14 }}>
            <View style={{ padding: 13, borderRadius: 15, backgroundColor: C.primarySoft, borderWidth: 1.4, borderColor: C.primary }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.primary }} />
                <Text style={{ flex: 1, fontSize: 13.5, fontWeight: '700', color: C.primary }}>{pendingOrders.length} commande{pendingOrders.length > 1 ? 's' : ''} à confirmer</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ProOrders')} style={{ height: 30, paddingHorizontal: 14, borderRadius: 15, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>Traiter</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* Gérer — actions rapides */}
        <View style={{ paddingHorizontal: 14, paddingTop: 20 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink, marginBottom: 10 }}>Gérer</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            {QUICK_ACTIONS.map((a) => (
              <TouchableOpacity key={a.labelKey} onPress={() => navigation.navigate(a.screen, a.params)} activeOpacity={0.8} style={{ width: '31%', padding: 13, borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, alignItems: 'center', ...SHADOW_SM }}>
                <Icon name={a.icon} size={22} color={a.color(C)} />
                <Text style={{ fontSize: 11.5, fontWeight: '600', color: C.inkSoft, marginTop: 6, textAlign: 'center' }}>{t(a.labelKey)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Revenus — graphique 7 jours */}
        <View style={{ paddingHorizontal: 14, paddingTop: 22 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink, marginBottom: 10 }}>Revenus · 7 jours</Text>
          <View style={{ padding: 14, borderRadius: 16, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
            <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 8 }}>
              <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: C.ink }}>{(revenues?.totalXAF ?? 0).toLocaleString()} XAF</Text>
              {stats.revenueChange !== 0 && (
                <Text style={{ fontSize: 12, fontWeight: '700', color: stats.revenueChange > 0 ? C.success : C.error }}>{stats.revenueChange > 0 ? '+' : ''}{stats.revenueChange}% {stats.revenueChange > 0 ? '↑' : '↓'}</Text>
              )}
            </View>
            {days.length > 0 ? (
              <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 6, height: 74, marginTop: 14 }}>
                {days.map((d, i) => (
                  <View key={d.date} style={{ flex: 1, alignItems: 'center', gap: 5 }}>
                    <View style={{ width: '100%', height: `${Math.max(6, (d.amount / maxAmount) * 100)}%`, borderRadius: 4, backgroundColor: i === days.length - 1 ? C.primary : C.primarySoft }} />
                    <Text style={{ fontSize: 9, color: i === days.length - 1 ? C.primary : C.inkMute, fontWeight: i === days.length - 1 ? '700' : '500' }}>
                      {new Date(d.date).toLocaleDateString('fr-FR', { weekday: 'narrow' })}
                    </Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 14 }}>Pas encore de données sur cette période.</Text>
            )}
          </View>
        </View>

        {/* Activité récente */}
        <View style={{ paddingHorizontal: 14, paddingTop: 22 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink }}>Activité récente</Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProOrders')}>
              <Text style={{ fontSize: 12.5, color: C.primary, fontWeight: '700' }}>Tout voir</Text>
            </TouchableOpacity>
          </View>
          {ordersLoading ? (
            <ActivityIndicator color={C.primary} style={{ marginVertical: 20 }} />
          ) : recentOrders.length === 0 ? (
            <Text style={{ fontSize: 13, color: C.inkMute, textAlign: 'center', paddingVertical: 20 }}>{t('pro.noRecentOrders')}</Text>
          ) : recentOrders.map((order) => (
            <TouchableOpacity key={order.id} onPress={() => navigation.navigate('ProOrderDetail', { orderId: order.id })} activeOpacity={0.8} style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 13, marginBottom: 9, flexDirection: 'row', alignItems: 'center', gap: 11 }}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink }}>{order.clientName}</Text>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: C.inkMute }}>{orderStatusLabel(order.status, t)}</Text>
                </View>
                <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 2 }}>{relativeTime(order.createdAt, t)}</Text>
              </View>
              <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>{order.totalXAF.toLocaleString()} XAF</Text>
              <Icon name="ChevronRight" size={16} color={C.inkMute} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
