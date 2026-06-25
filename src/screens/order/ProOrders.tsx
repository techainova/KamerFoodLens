// src/screens/order/ProOrders.tsx
// Gestion des commandes Pro — v2.0

import React, { useState } from 'react';
import {
  ScrollView, StatusBar, TouchableOpacity, View,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useColors } from '@/hooks/useAppTheme';
import Icon from '@/components/ui/Icon';
import { fontFamily, fontSize, radius, spacing } from '@/constants/theme';

const SHADOW_SM = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.07,
  shadowRadius: 4,
  elevation: 2,
};

type OrderStatus = 'Nouvelle' | 'En préparation' | 'Prête' | 'Livrée' | 'Annulée';

interface Order {
  id: string;
  ref: string;
  client: string;
  initials: string;
  avatarColor: string;
  time: string;
  items: string;
  total: number;
  status: OrderStatus;
}

const ORDERS: Order[] = [
  { id: 'KFL-4825', ref: '#KFL-4825', client: 'Sami N.',  initials: 'SN', avatarColor: '#E8591A', time: '14:38', items: 'Ndolé + Jus',          total: 13000, status: 'Nouvelle' },
  { id: 'KFL-4822', ref: '#KFL-4822', client: 'Adèle B.', initials: 'AB', avatarColor: '#1565C0', time: '14:21', items: 'Poulet DG',            total: 6500,  status: 'En préparation' },
  { id: 'KFL-4819', ref: '#KFL-4819', client: 'Marc T.',  initials: 'MT', avatarColor: '#2E7D32', time: '13:45', items: 'Eru + Plantain',       total: 8200,  status: 'Prête' },
  { id: 'KFL-4815', ref: '#KFL-4815', client: 'Fatou K.', initials: 'FK', avatarColor: '#6D4C41', time: '13:10', items: 'Tombola menu',         total: 4500,  status: 'Livrée' },
  { id: 'KFL-4810', ref: '#KFL-4810', client: 'Jean P.',  initials: 'JP', avatarColor: '#1A237E', time: '12:30', items: 'Koki + Ndolé',         total: 11000, status: 'Livrée' },
  { id: 'KFL-4805', ref: '#KFL-4805', client: 'Rose N.',  initials: 'RN', avatarColor: '#C62828', time: '11:15', items: 'Beignets haricots',    total: 3500,  status: 'Annulée' },
];

type FilterTab = 'Toutes' | OrderStatus;

const FILTER_TABS: FilterTab[] = ['Toutes', 'Nouvelle', 'En préparation', 'Prête', 'Livrée', 'Annulée'];

function statusBadgeColors(status: OrderStatus, C: ReturnType<typeof useColors>): { bg: string; text: string } {
  switch (status) {
    case 'Nouvelle':       return { bg: C.goldSoft,    text: C.primary };
    case 'En préparation': return { bg: C.navySoft,    text: C.navy };
    case 'Prête':          return { bg: C.successSoft, text: C.success };
    case 'Livrée':         return { bg: C.surface2,    text: C.inkMute };
    case 'Annulée':        return { bg: C.errorSoft,   text: C.error };
    default:                return { bg: C.surface2,    text: C.inkMute };
  }
}

function newOrderCount(orders: Order[]): number {
  return orders.filter((o) => o.status === 'Nouvelle').length;
}

export default function ProOrders() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('Toutes');

  const filtered = activeFilter === 'Toutes' ? ORDERS : ORDERS.filter((o) => o.status === activeFilter);
  const dayTotal = ORDERS.reduce((sum, o) => sum + o.total, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }} edges={['top']}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View
        style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
          backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border,
          ...SHADOW_SM,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: spacing.xs }} accessibilityLabel="Retour">
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>

        <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.lg, color: C.ink }}>
          Commandes
        </Text>

        <TouchableOpacity style={{ padding: spacing.xs }} accessibilityLabel="Filtrer les commandes">
          <Icon name="SlidersHorizontal" size={20} color={C.ink} />
        </TouchableOpacity>
      </View>

      {/* Filter chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border }}
        contentContainerStyle={{ paddingHorizontal: spacing.md, paddingVertical: spacing.sm, gap: spacing.sm }}
      >
        {FILTER_TABS.map((tab) => {
          const isActive = activeFilter === tab;
          const badgeCount = tab === 'Nouvelle' ? newOrderCount(ORDERS) : 0;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveFilter(tab)}
              style={{
                flexDirection: 'row', alignItems: 'center', gap: 5,
                paddingHorizontal: spacing.md, paddingVertical: spacing.xs + 2,
                borderRadius: radius.full,
                backgroundColor: isActive ? C.primary : C.surface2,
                borderWidth: 1, borderColor: isActive ? C.primary : C.border,
              }}
              accessibilityLabel={`Filtre ${tab}`}
            >
              <Text style={{ fontFamily: isActive ? fontFamily.bold : fontFamily.medium, fontSize: fontSize.sm, color: isActive ? C.surface : C.inkSoft }}>
                {tab}
              </Text>
              {badgeCount > 0 && (
                <View
                  style={{
                    backgroundColor: isActive ? C.surface : C.primary,
                    borderRadius: radius.full, minWidth: 18, height: 18,
                    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
                  }}
                >
                  <Text style={{ fontFamily: fontFamily.bold, fontSize: 10, color: isActive ? C.primary : C.surface }}>
                    {badgeCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingTop: spacing.sm }}>
          {filtered.map((order) => {
            const badge = statusBadgeColors(order.status, C);
            return (
              <TouchableOpacity
                key={order.id}
                onPress={() => navigation.navigate('ProOrderDetail', { orderId: order.id })}
                style={{
                  flexDirection: 'row', alignItems: 'center',
                  marginHorizontal: spacing.md, marginBottom: spacing.sm,
                  backgroundColor: C.surface, borderRadius: radius.md,
                  borderWidth: 1, borderColor: order.status === 'Nouvelle' ? C.primary : C.border,
                  padding: spacing.md, gap: spacing.sm,
                  ...SHADOW_SM,
                }}
                accessibilityLabel={`Commande ${order.ref}`}
              >
                <View style={{ width: 44, height: 44, borderRadius: radius.full, backgroundColor: order.avatarColor, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: C.surface }}>
                    {order.initials}
                  </Text>
                </View>

                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
                    <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: C.ink }}>
                      {order.client}
                    </Text>
                    <View style={{ backgroundColor: badge.bg, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 2 }}>
                      <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: badge.text }}>
                        {order.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ fontFamily: fontFamily.mono, fontSize: fontSize.xs, color: C.inkMute, marginBottom: 2 }}>
                    {order.ref}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: C.inkSoft }}>
                      {order.items} · {order.time}
                    </Text>
                    <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: C.ink }}>
                      {order.total.toLocaleString('fr-FR')} XAF
                    </Text>
                  </View>
                </View>

                <Icon name="ChevronRight" size={18} color={C.inkMute} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Résumé du jour */}
        <View
          style={{
            marginHorizontal: spacing.md, marginTop: spacing.sm, marginBottom: spacing.xxl,
            backgroundColor: C.surface, borderRadius: radius.md, borderWidth: 1, borderColor: C.border,
            padding: spacing.md, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md,
            ...SHADOW_SM,
          }}
        >
          <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: C.ink }}>
            Total du jour :
          </Text>
          <Text style={{ fontFamily: fontFamily.serifBold, fontSize: fontSize.md, color: C.primary }}>
            {dayTotal.toLocaleString('fr-FR')} XAF
          </Text>
          <Text style={{ fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: C.inkMute }}>
            · {ORDERS.length} commandes
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
