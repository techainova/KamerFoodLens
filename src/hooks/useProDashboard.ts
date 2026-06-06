// src/hooks/useProDashboard.ts
// Logique Dashboard Pro — stats + actions rapides + commandes

import { useState } from 'react';

export type ProTab = 'dashboard' | 'revenues' | 'activity' | 'settings';

export interface ProStats {
  views:         number;
  viewsGrowth:   string;
  followers:     number;
  newFollowers:  number;
  revenueXAF:    number;
  revenueGrowth: string;
  ticketsSold:   number;
  ticketsTotal:  number;
}

export interface ProOrder {
  id:          string;
  customer:    string;
  username:    string;
  ref:         string;
  totalXAF:    number;
  method:      string;
  status:      'new' | 'confirmed' | 'served';
  minutesAgo:  number;
}

const MOCK_STATS: ProStats = {
  views: 1247, viewsGrowth: '+12% semaine',
  followers: 89, newFollowers: 5,
  revenueXAF: 67500, revenueGrowth: '+8 200 XAF',
  ticketsSold: 47, ticketsTotal: 120,
};

const MOCK_ORDERS: ProOrder[] = [
  { id: '1', customer: 'Amah Nguepi', username: '@amah_ndongo', ref: 'KFL-2026-MP-00847', totalXAF: 10500, method: 'Orange Money', status: 'new', minutesAgo: 3 },
  { id: '2', customer: 'Sami Ngo',    username: '@sami_ngo',    ref: 'KFL-2026-MP-00848', totalXAF: 6500,  method: 'Orange Money', status: 'new', minutesAgo: 8 },
  { id: '3', customer: 'Adèle K.',    username: '@adele_k',     ref: 'KFL-2026-MP-00849', totalXAF: 8000,  method: 'Carte bancaire', status: 'new', minutesAgo: 14 },
];

export function useProDashboard() {
  const [tab, setTab]       = useState<ProTab>('dashboard');
  const [orders, setOrders] = useState<ProOrder[]>(MOCK_ORDERS);

  function confirmOrder(id: string) {
    setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: 'confirmed' } : o));
  }

  function cancelOrder(id: string) {
    setOrders((prev) => prev.filter((o) => o.id !== id));
  }

  return { tab, setTab, stats: MOCK_STATS, orders, confirmOrder, cancelOrder };
}
