import React from 'react';
import {
  ScrollView, StatusBar, TouchableOpacity, View, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';

import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM, SHADOW_MD } from '@/constants/theme';
import { proService, type ProOrderSummary } from '@/services/pro.service';
import { useAuthStore } from '@/store/auth.store';

type QuickAction = {
  icon: 'ShoppingBag' | 'DollarSign' | 'ChefHat' | 'Tag' | 'Users' | 'BarChart2';
  labelKey: string;
  screen: string;
  badge?: string;
  badgeColor?: string;
};

const QUICK_ACTION_DEFS: QuickAction[] = [
  { icon: 'ShoppingBag', labelKey: 'pro.orders',     screen: 'ProOrders',      badge: '3', badgeColor: '#C62828' },
  { icon: 'DollarSign',  labelKey: 'pro.revenues',   screen: 'ProRevenues' },
  { icon: 'ChefHat',     labelKey: 'pro.myMenu',     screen: 'RestaurantMenu' },
  { icon: 'Tag',         labelKey: 'pro.promotions', screen: 'ProPromos' },
  { icon: 'Users',       labelKey: 'pro.community',  screen: 'ManageCommunity' },
  { icon: 'BarChart2',   labelKey: 'pro.analytics',  screen: 'ProAnalytics' },
];

const FALLBACK_STATS = { revenueXAF: 0, ordersCount: 0, rating: 0, revenueChange: 0, ordersChange: 0, customersCount: 0, avgOrderXAF: 0, activeMenuItems: 0 };

type OrderApiStatus = ProOrderSummary['status'];

function orderStatusLabel(status: OrderApiStatus, t: (k: string) => string): string {
  const MAP: Record<OrderApiStatus, string> = {
    pending:    t('order.statuses.pending'),
    confirmed:  t('order.statuses.confirmed'),
    preparing:  t('order.statuses.preparing'),
    ready:      t('order.statuses.ready'),
    delivering: t('order.statuses.delivering'),
    completed:  t('order.statuses.completed'),
    cancelled:  t('order.statuses.cancelled'),
  };
  return MAP[status] ?? status;
}

function orderStatusColors(status: OrderApiStatus, C: ReturnType<typeof useColors>): { bg: string; fg: string } {
  switch (status) {
    case 'pending':   return { bg: C.goldSoft,    fg: C.gold };
    case 'confirmed': return { bg: C.navySoft,    fg: C.navy };
    case 'preparing': return { bg: C.navySoft,    fg: C.navy };
    case 'ready':      return { bg: C.successSoft, fg: C.success };
    case 'delivering': return { bg: C.successSoft, fg: C.success };
    case 'completed':  return { bg: C.surface2,    fg: C.inkMute };
    case 'cancelled':  return { bg: C.errorSoft,   fg: C.error };
    default:          return { bg: C.surface2,    fg: C.inkSoft };
  }
}

function relativeTime(isoDate: string, t: (k: string, opts?: Record<string, unknown>) => string): string {
  const diffMs = Date.now() - Date.parse(isoDate);
  const diffMin = Math.floor(diffMs / 60_000);
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

  const { data: dashStats } = useQuery({
    queryKey: ['pro-dashboard'],
    queryFn: () => proService.getDashboard(),
    staleTime: 5 * 60_000,
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['pro-orders-recent'],
    queryFn: () => proService.getOrders(undefined, 1),
    staleTime: 2 * 60_000,
  });

  const stats       = dashStats ?? FALLBACK_STATS;
  const recentOrders = (ordersData?.items ?? []).slice(0, 3);
  const quickActions = QUICK_ACTION_DEFS.map(a => ({ ...a, label: t(a.labelKey) }));

  const perfStats = [
    { value: stats.rating > 0 ? String(stats.rating) : '—',          unit: '/ 5',   labelKey: 'proAnalytics.avgRating' },
    { value: stats.avgOrderXAF > 0 ? String(stats.avgOrderXAF.toLocaleString()) : '—', unit: 'XAF', labelKey: 'pro.avgOrder' },
    { value: stats.customersCount > 0 ? String(stats.customersCount) : '—',           unit: t('pro.customers'), labelKey: 'pro.clients' },
  ];

  const todayLabel = new Date().toLocaleDateString(undefined, {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <View style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle="light-content" backgroundColor={C.navy} />

      {/* Header navy */}
      <View style={{ backgroundColor: C.navy, paddingTop: 48, paddingBottom: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Text style={{ fontFamily: 'Inter-Bold', fontSize: 16, color: '#FFFFFF' }}>
              {user?.firstName ? `${user.firstName} ${user.lastName}` : 'KFL Pro'}
            </Text>
            <View style={{ backgroundColor: C.gold, borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text style={{ fontFamily: 'Inter-Bold', fontSize: 10, color: '#FFFFFF', letterSpacing: 0.6 }}>PRO</Text>
            </View>
          </View>
          <Text style={{ fontFamily: 'Inter-Regular', fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>
            {todayLabel}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <TouchableOpacity
            accessibilityLabel={t('profile.notifications')}
            style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="Bell" size={20} color="#FFFFFF" strokeWidth={1.8} />
          </TouchableOpacity>

          <TouchableOpacity
            accessibilityLabel={t('settings.title')}
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
                {t('pro.revenue')}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: C.successSoft, borderRadius: 9999, paddingHorizontal: 10, paddingVertical: 4, gap: 4 }}>
                <Icon name="TrendingUp" size={13} color={C.success} strokeWidth={2.5} />
                <Text style={{ fontFamily: 'Inter-Bold', fontSize: 12, color: C.success }}>
                  +{stats.revenueChange} %
                </Text>
              </View>
            </View>

            <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 28, color: '#FFFFFF', marginBottom: 18 }}>
              {stats.revenueXAF.toLocaleString()} XAF
            </Text>

            <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)', paddingTop: 14, flexDirection: 'row', justifyContent: 'space-between' }}>
              {[
                { value: String(stats.ordersCount),              label: t('pro.orders') },
                { value: String(stats.rating),                   label: t('proAnalytics.avgRating') },
                { value: `+${stats.revenueChange} %`,            label: t('proAnalytics.vsPreviousPeriod') },
              ].map((stat, idx) => (
                <View key={stat.label} style={{ alignItems: 'center', flex: 1 }}>
                  {idx > 0 && (
                    <View style={{ position: 'absolute', left: 0, top: '10%', height: '80%', width: 1, backgroundColor: 'rgba(255,255,255,0.15)' }} />
                  )}
                  <Text style={{ fontFamily: 'Inter-Bold', fontSize: 18, color: '#FFFFFF' }}>{stat.value}</Text>
                  <Text style={{ fontFamily: 'Inter-Regular', fontSize: 11, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Quick actions */}
        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          <Text style={{ fontFamily: 'Inter-Bold', fontSize: 16, color: C.ink, marginBottom: 12 }}>
            {t('pro.quickActions')}
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {quickActions.map((action) => (
              <TouchableOpacity
                key={action.labelKey}
                onPress={() => navigation.navigate(action.screen)}
                accessibilityLabel={action.label}
                activeOpacity={0.8}
                style={{ width: '30.5%', backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 14, alignItems: 'center', position: 'relative', ...SHADOW_SM }}
              >
                <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: C.navySoft, alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <Icon name={action.icon} size={22} color={C.navy} strokeWidth={1.8} />
                </View>
                <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 12, color: C.inkSoft, textAlign: 'center' }}>
                  {action.label}
                </Text>
                {action.badge && (
                  <View style={{ position: 'absolute', top: 8, right: 8, backgroundColor: action.badgeColor ?? C.error, borderRadius: 9999, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 }}>
                    <Text style={{ fontFamily: 'Inter-Bold', fontSize: 10, color: '#FFFFFF' }}>{action.badge}</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent orders */}
        <View style={{ paddingHorizontal: 16, paddingTop: 28 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <Text style={{ fontFamily: 'Inter-Bold', fontSize: 16, color: C.ink }}>
              {t('pro.recentActivity')}
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('ProOrders')}>
              <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 13, color: C.primary }}>{t('common.seeAll')}</Text>
            </TouchableOpacity>
          </View>

          {ordersLoading ? (
            <ActivityIndicator color={C.primary} style={{ marginVertical: 20 }} />
          ) : recentOrders.length === 0 ? (
            <Text style={{ fontSize: 13, color: C.inkMute, textAlign: 'center', paddingVertical: 20 }}>{t('pro.noRecentOrders')}</Text>
          ) : (
            recentOrders.map((order) => {
              const { bg, fg } = orderStatusColors(order.status, C);
              const statusLabel = orderStatusLabel(order.status, t);
              return (
                <TouchableOpacity
                  key={order.id}
                  onPress={() => navigation.navigate('ProOrderDetail', { orderId: order.id })}
                  activeOpacity={0.8}
                  accessibilityLabel={t('pro.orderRef', { ref: order.ref })}
                  style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12, ...SHADOW_SM }}
                >
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <Text style={{ fontFamily: 'Inter-Bold', fontSize: 13, color: C.ink }}>{order.ref}</Text>
                      <View style={{ backgroundColor: bg, borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 2 }}>
                        <Text style={{ fontFamily: 'Inter-Bold', fontSize: 10, color: fg }}>{statusLabel}</Text>
                      </View>
                    </View>
                    <Text style={{ fontFamily: 'Inter-Regular', fontSize: 12, color: C.inkMute }}>
                      {order.clientName} · {relativeTime(order.createdAt, t)}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <Text style={{ fontFamily: 'Inter-Bold', fontSize: 14, color: C.ink }}>
                      {order.totalXAF.toLocaleString()} XAF
                    </Text>
                    <Icon name="ChevronRight" size={16} color={C.inkMute} strokeWidth={2} />
                  </View>
                </TouchableOpacity>
              );
            })
          )}
        </View>

        {/* Performance stats */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <Text style={{ fontFamily: 'Inter-Bold', fontSize: 16, color: C.ink, marginBottom: 12 }}>
            {t('proAnalytics.title')}
          </Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {perfStats.map((stat) => (
              <View key={stat.labelKey} style={{ flex: 1, backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, paddingVertical: 16, alignItems: 'center', ...SHADOW_SM }}>
                <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 22, color: C.navy, lineHeight: 28 }}>
                  {stat.value}
                </Text>
                <Text style={{ fontFamily: 'Inter-Regular', fontSize: 11, color: C.inkMute, marginTop: 2 }}>
                  {stat.unit}
                </Text>
                <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 12, color: C.inkSoft, marginTop: 4 }}>
                  {t(stat.labelKey)}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Events & Courses (links only — data loaded on sub-screens) */}
        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          <Text style={{ fontFamily: 'Inter-Bold', fontSize: 16, color: C.ink, marginBottom: 12 }}>
            {t('pro.activeEvents')} & {t('pro.activeCourses')}
          </Text>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              activeOpacity={0.8}
              accessibilityLabel={t('pro.activeEvents')}
              onPress={() => navigation.navigate('ManageEvent')}
              style={{ flex: 1, backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}
            >
              <View style={{ height: 80, backgroundColor: C.navySoft, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Award" size={32} color={C.navy} strokeWidth={1.5} />
              </View>
              <View style={{ padding: 12 }}>
                <View style={{ backgroundColor: C.navySoft, borderRadius: 9999, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, marginBottom: 6 }}>
                  <Text style={{ fontFamily: 'Inter-Bold', fontSize: 10, color: C.navy }}>{t('events.upcoming')}</Text>
                </View>
                <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 13, color: C.inkSoft, lineHeight: 18 }}>
                  {t('pro.manageEvents')}
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              accessibilityLabel={t('pro.activeCourses')}
              onPress={() => navigation.navigate('CreateCourse')}
              style={{ flex: 1, backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}
            >
              <View style={{ height: 80, backgroundColor: C.goldSoft, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="ChefHat" size={32} color={C.gold} strokeWidth={1.5} />
              </View>
              <View style={{ padding: 12 }}>
                <View style={{ backgroundColor: C.goldSoft, borderRadius: 9999, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 2, marginBottom: 6 }}>
                  <Text style={{ fontFamily: 'Inter-Bold', fontSize: 10, color: C.gold }}>{t('courses.inProgress')}</Text>
                </View>
                <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 13, color: C.inkSoft, lineHeight: 18 }}>
                  {t('pro.manageCourses')}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Manage subscription */}
        <View style={{ paddingHorizontal: 16, paddingTop: 28, paddingBottom: 12 }}>
          <TouchableOpacity
            onPress={() => navigation.navigate('ProSubscription')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={t('pro.manageSubscription')}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.navySoft, borderRadius: 14, borderWidth: 1.5, borderColor: C.navy, paddingVertical: 14 }}
          >
            <Icon name="Award" size={18} color={C.navy} strokeWidth={2} />
            <Text style={{ fontFamily: 'Inter-Bold', fontSize: 15, color: C.navy }}>
              {t('pro.manage')} — {t('pro.subscription')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}
