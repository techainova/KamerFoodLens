// src/store/notifications.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { usersService } from '@/services/users.service';

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
    }),
    { name: 'kfl-notifications', storage: createJSONStorage(() => mmkvStorage) }
  )
);
