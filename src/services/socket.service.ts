// src/services/socket.service.ts
// Connexions Socket.io temps réel — commandes et événements live

import { io, type Socket } from 'socket.io-client';
import { API_CONFIG } from './config';
import { useAuthStore } from '@/store/auth.store';
import { useStoriesStore } from '@/store/stories.store';
import { useEventsStore } from '@/store/events.store';
import { useFeedStore } from '@/store/feed.store';
import { useMessagesStore } from '@/store/messages.store';
import { useNotificationsStore } from '@/store/notifications.store';
import type { Story, FeedPost } from './community.service';
import type { KflEvent as KflEventDto } from './events.service';
import type { KflMessage } from './messages.service';
import type { Notification as KflNotification } from './users.service';

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
  // Connexions distinctes de `events` ci-dessus : celui-là ne vit que le temps
  // d'un écran d'événement live (join/leave room) ; celles-ci restent ouvertes
  // pour toute la session app, pour recevoir les diffusions globales
  // 'story:new'/'event:new' même en dehors de l'écran concerné.
  private communityFeed: Socket | null = null;
  private eventsFeed: Socket | null = null;
  private messages: Socket | null = null;
  private notifications: Socket | null = null;

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

  // ── Diffusion globale (stories, événements) ────────────────────────────────
  // Connexion unique pour toute la durée de vie de l'app — invités compris
  // (browse-first : voir les nouveautés en direct ne demande pas de compte).
  connectContentFeed(): void {
    if (!this.communityFeed) {
      this.communityFeed = io(`${API_CONFIG.SOCKET_URL}/community`, socketOptions());
      this.communityFeed.on('story:new', (story: Story) => {
        useStoriesStore.getState().receiveStory(story);
      });
      this.communityFeed.on('post:new', (post: FeedPost) => {
        useFeedStore.getState().receivePost(post);
      });
      this.communityFeed.on('connect_error', (err: Error) => {
        console.warn('[Socket/community] connect_error:', err.message);
      });
    }

    if (!this.eventsFeed) {
      this.eventsFeed = io(`${API_CONFIG.SOCKET_URL}/events`, socketOptions());
      this.eventsFeed.on('event:new', (event: KflEventDto) => {
        useEventsStore.getState().receiveEvent(event);
      });
      this.eventsFeed.on('connect_error', (err: Error) => {
        console.warn('[Socket/events-feed] connect_error:', err.message);
      });
    }
  }

  disconnectContentFeed(): void {
    this.communityFeed?.disconnect();
    this.communityFeed = null;
    this.eventsFeed?.disconnect();
    this.eventsFeed = null;
  }

  // ── Namespace /messages ─────────────────────────────────────────────────────
  // Contrairement au fil (accessible en invité), la messagerie exige un
  // compte : on ne se connecte qu'avec un userId réel, pour rejoindre sa
  // propre room et recevoir les messages entrants même écran fermé.
  connectMessaging(userId: string): void {
    if (this.messages?.connected) return;

    this.messages = io(`${API_CONFIG.SOCKET_URL}/messages`, socketOptions());
    this.messages.on('connect', () => {
      this.messages?.emit('message:join', userId);
    });
    this.messages.on('message:new', (message: KflMessage) => {
      useMessagesStore.getState().receiveMessage(message);
    });
    this.messages.on('connect_error', (err: Error) => {
      console.warn('[Socket/messages] connect_error:', err.message);
    });
  }

  disconnectMessaging(): void {
    this.messages?.disconnect();
    this.messages = null;
  }

  // ── Namespace /notifications ────────────────────────────────────────────────
  // Room par utilisateur, même principe que /messages : reçoit les nouvelles
  // notifications (commande, paiement, événement…) en direct, écran fermé compris.
  connectNotifications(userId: string): void {
    if (this.notifications?.connected) return;

    this.notifications = io(`${API_CONFIG.SOCKET_URL}/notifications`, socketOptions());
    this.notifications.on('connect', () => {
      this.notifications?.emit('notification:join', userId);
    });
    this.notifications.on('notification:new', (notification: KflNotification) => {
      useNotificationsStore.getState().receiveNotification(notification);
    });
    this.notifications.on('connect_error', (err: Error) => {
      console.warn('[Socket/notifications] connect_error:', err.message);
    });
  }

  disconnectNotifications(): void {
    this.notifications?.disconnect();
    this.notifications = null;
  }

  // ── Utilitaires ────────────────────────────────────────────────────────────
  disconnectAll(): void {
    this.disconnectOrders();
    this.leaveEventLive();
    this.disconnectContentFeed();
    this.disconnectMessaging();
    this.disconnectNotifications();
  }
}

export const socketService = new SocketService();
