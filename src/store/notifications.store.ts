// src/store/notifications.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { usersService, type Notification, type NotificationType } from '@/services/users.service';

const _mmkv = createMMKV({ id: 'kfl-notifications-store' });
const mmkvStorage = {
  setItem:    (key: string, value: string) => _mmkv.set(key, value),
  getItem:    (key: string) => _mmkv.getString(key) ?? null,
  removeItem: (key: string) => { _mmkv.remove(key); },
};

interface NotificationsState {
  pushEnabled: boolean;
  deviceToken: string | null;
  isLoading:   boolean;
  enablePush:  () => Promise<boolean>;
  disablePush: () => Promise<void>;

  // Inbox (GET/PATCH/DELETE /users/notifications) — distinct from the push-permission
  // fields above, which only concern the device's Expo push token registration.
  items:        Notification[];
  total:        number;
  page:         number;
  unreadCount:  number;
  hasMore:      boolean;
  isInboxLoading: boolean;
  activeType:   NotificationType | undefined;
  fetchFirstPage: (type?: NotificationType) => Promise<void>;
  fetchNextPage:  () => Promise<void>;
  markRead:       (id: string) => Promise<void>;
  markAllRead:    () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  // Appelé sur réception de l'événement socket 'notification:new'.
  receiveNotification: (notification: Notification) => void;
}

function toPlatform(): 'android' | 'ios' | 'web' {
  if (Platform.OS === 'android') return 'android';
  if (Platform.OS === 'ios') return 'ios';
  return 'web';
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      pushEnabled: false,
      deviceToken: null,
      isLoading: false,

      enablePush: async () => {
        set({ isLoading: true });
        try {
          const permission = await Notifications.requestPermissionsAsync();
          if (!permission.granted) {
            return false;
          }

          const projectId = Constants.expoConfig?.extra?.eas?.projectId as string | undefined;
          const { data: token } = await Notifications.getExpoPushTokenAsync(
            projectId ? { projectId } : undefined,
          );

          await usersService.registerPushToken(token, toPlatform());
          set({ pushEnabled: true, deviceToken: token });
          return true;
        } catch {
          return false;
        } finally {
          set({ isLoading: false });
        }
      },

      disablePush: async () => {
        const { deviceToken } = get();
        set({ pushEnabled: false, deviceToken: null });
        if (deviceToken) {
          try {
            await usersService.unregisterPushToken(deviceToken);
          } catch {
            // Local preference already reflects "disabled" — a failed unregister
            // call server-side is not worth surfacing to the user.
          }
        }
      },

      items: [],
      total: 0,
      page: 1,
      unreadCount: 0,
      hasMore: true,
      isInboxLoading: false,
      activeType: undefined,

      fetchFirstPage: async (type) => {
        set({ isInboxLoading: true, activeType: type });
        try {
          const res = await usersService.getNotifications(1, type);
          set({
            items: res.items,
            total: res.total,
            page: 1,
            unreadCount: res.unreadCount,
            hasMore: res.items.length < res.total,
          });
        } finally {
          set({ isInboxLoading: false });
        }
      },

      fetchNextPage: async () => {
        const { page, hasMore, isInboxLoading, activeType, items } = get();
        if (!hasMore || isInboxLoading) return;
        set({ isInboxLoading: true });
        try {
          const nextPage = page + 1;
          const res = await usersService.getNotifications(nextPage, activeType);
          const merged = [...items, ...res.items];
          set({ items: merged, page: nextPage, total: res.total, unreadCount: res.unreadCount, hasMore: merged.length < res.total });
        } finally {
          set({ isInboxLoading: false });
        }
      },

      markRead: async (id) => {
        const target = get().items.find((n) => n.id === id);
        if (!target || target.isRead) return;
        set((s) => ({
          items: s.items.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
          unreadCount: Math.max(0, s.unreadCount - 1),
        }));
        await usersService.markNotificationRead(id);
      },

      markAllRead: async () => {
        set((s) => ({ items: s.items.map((n) => ({ ...n, isRead: true })), unreadCount: 0 }));
        await usersService.markAllNotificationsRead();
      },

      deleteNotification: async (id) => {
        set((s) => {
          const target = s.items.find((n) => n.id === id);
          return {
            items: s.items.filter((n) => n.id !== id),
            total: Math.max(0, s.total - 1),
            unreadCount: target && !target.isRead ? Math.max(0, s.unreadCount - 1) : s.unreadCount,
          };
        });
        await usersService.deleteNotification(id);
      },

      receiveNotification: (notification) => set((s) => {
        if (s.items.some((n) => n.id === notification.id)) return s;
        const matchesFilter = !s.activeType || s.activeType === notification.type;
        return {
          items: matchesFilter ? [notification, ...s.items] : s.items,
          total: s.total + 1,
          unreadCount: s.unreadCount + 1,
        };
      }),
    }),
    {
      name: 'kfl-notifications',
      storage: createJSONStorage(() => mmkvStorage),
      // Seule la préférence push est un réglage device — la boîte de réception
      // (items/unreadCount/…) doit toujours repartir d'un fetch serveur frais.
      partialize: (s) => ({ pushEnabled: s.pushEnabled, deviceToken: s.deviceToken }),
    }
  )
);
