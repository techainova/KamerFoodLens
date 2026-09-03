// src/store/admin.store.ts
import { useOrdersStore } from './orders.store';
import { useFeedStore } from './feed.store';
import { useForumStore } from './forum.store';
import { useEventsStore } from './events.store';
import { useTombolaStore } from './tombola.store';

export interface AdminMetrics {
  totalUsers:    number;
  proUsers:      number;
  totalOrders:   number;
  totalRevenue:  number;
  totalPosts:    number;
  totalThreads:  number;
  totalEvents:   number;
  ticketsSold:   number;
  pendingOrders: number;
  reportedPosts: number;
}

export interface AdminAlert {
  type:  'warn' | 'error' | 'info';
  msg:   string;
  icon:  string;
  bg:    string;
  bc:    string;
  tc:    string;
  route: string;
}

export function getAdminMetrics(): AdminMetrics {
  const orders    = useOrdersStore.getState().orders;
  const posts     = useFeedStore.getState().posts;
  const threads   = useForumStore.getState().threads;
  const events    = useEventsStore.getState().events;
  const tombola   = useTombolaStore.getState();

  const totalRevenue = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter(o =>
    o.status === 'pending' || o.status === 'confirmed' || o.status === 'preparing'
  ).length;

  const ticketsSold = tombola.active?.soldCount ?? 0;

  return {
    totalUsers:   8247,
    proUsers:     312,
    totalOrders:  orders.length,
    totalRevenue,
    totalPosts:   posts.length,
    totalThreads: threads.length,
    totalEvents:  events.length,
    ticketsSold,
    pendingOrders,
    reportedPosts: 3,
  };
}

export function getAdminAlerts(): AdminAlert[] {
  const metrics = getAdminMetrics();
  const alerts: AdminAlert[] = [];

  if (metrics.reportedPosts > 0) {
    alerts.push({
      type: 'warn', icon: 'AlertTriangle', route: 'AdminModeration',
      msg:  `${metrics.reportedPosts} contenu${metrics.reportedPosts > 1 ? 's' : ''} signalé${metrics.reportedPosts > 1 ? 's' : ''} en attente`,
      bg: '#FBF3DC', bc: '#F9A82540', tc: '#F9A825',
    });
  }

  if (metrics.pendingOrders > 0) {
    alerts.push({
      type: 'info', icon: 'ShoppingBag', route: 'AdminFinance',
      msg:  `${metrics.pendingOrders} commande${metrics.pendingOrders > 1 ? 's' : ''} en cours`,
      bg: '#E8EAF6', bc: '#1A237E20', tc: '#1A237E',
    });
  }

  alerts.push({
    type: 'info', icon: 'Ticket', route: 'AdminTombola',
    msg:  `${metrics.ticketsSold} billets de tombola vendus`,
    bg: '#FBF3DC', bc: '#F9A82540', tc: '#F9A825',
  });

  return alerts;
}
