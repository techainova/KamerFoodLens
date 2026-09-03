// src/services/socket.service.ts
// Connexions Socket.io temps réel — commandes et événements live

import { io, type Socket } from 'socket.io-client';
import { API_CONFIG } from './config';
import { useAuthStore } from '@/store/auth.store';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface OrderStatusUpdate {
  orderId:   string;
  status:    'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';
  updatedAt: string;
}

export interface EventChatMessage {
  userId:      string;
  displayName: string;
  text:        string;
  sentAt:      string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function socketOptions() {
  return {
    auth:       { token: useAuthStore.getState().accessToken ?? '' },
    transports: ['websocket'] as string[],
    reconnectionDelay: 2_000,
    reconnectionAttempts: 5,
  };
}

// ── Service ───────────────────────────────────────────────────────────────────
class SocketService {
  private orders: Socket | null = null;
  private events: Socket | null = null;

  // ── Namespace /orders ──────────────────────────────────────────────────────
  connectOrders(onUpdate: (payload: OrderStatusUpdate) => void): void {
    if (this.orders?.connected) return;

    this.orders = io(`${API_CONFIG.SOCKET_URL}/orders`, socketOptions());

    this.orders.on('connect', () => {
      const userId = useAuthStore.getState().user?.id;
      if (userId) this.orders?.emit('order:join', userId);
    });

    this.orders.on('order:status_update', onUpdate);

    this.orders.on('connect_error', (err: Error) => {
      console.warn('[Socket/orders] connect_error:', err.message);
    });
  }

  disconnectOrders(): void {
    this.orders?.disconnect();
    this.orders = null;
  }

  // ── Namespace /events ──────────────────────────────────────────────────────
  joinEventLive(
    eventId: string,
    onMessage: (msg: EventChatMessage) => void,
  ): void {
    if (this.events?.connected) {
      this.events.emit('event:live', eventId);
      this.events.on('event:chat', onMessage);
      return;
    }

    this.events = io(`${API_CONFIG.SOCKET_URL}/events`, socketOptions());

    this.events.on('connect', () => {
      this.events?.emit('event:live', eventId);
    });

    this.events.on('event:chat', onMessage);

    this.events.on('connect_error', (err: Error) => {
      console.warn('[Socket/events] connect_error:', err.message);
    });
  }

  sendEventChat(text: string): void {
    this.events?.emit('event:chat', { text });
  }

  leaveEventLive(): void {
    this.events?.disconnect();
    this.events = null;
  }

  // ── Utilitaires ────────────────────────────────────────────────────────────
  disconnectAll(): void {
    this.disconnectOrders();
    this.leaveEventLive();
  }
}

export const socketService = new SocketService();
