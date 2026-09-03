// src/services/users.service.ts
import apiClient from './api.client';
import { ENDPOINTS } from './config';
import type { User } from '@/store/auth.store';

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  location?: string;
  phone?: string;
  avatar?: string;
}

export interface FavoriteItem {
  id: string;
  type: 'dish' | 'restaurant' | 'recipe';
  itemId: string;
  name: string;
  imageUrl: string | null;
  region: string | null;
  rating: number | null;
  difficulty: 'easy' | 'medium' | 'hard' | null;
  durationMin: number | null;
  savedAt: string;
}

export interface JournalEntry {
  id: string;
  dishId?: string;
  dishName: string;
  imageUrl?: string;
  nutritionFacts?: Record<string, number>;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  note?: string;
  date: string;
}

export interface AddJournalEntryPayload {
  dishId?: string;
  dishName: string;
  imageUrl?: string;
  nutritionFacts?: Record<string, number>;
  mealType: JournalEntry['mealType'];
  date: string;
  note?: string;
}

export interface Notification {
  id: string;
  type: 'order' | 'payment' | 'community' | 'promo' | 'system';
  title: string;
  body: string;
  isRead: boolean;
  createdAt: string;
  data?: Record<string, string>;
}

export const usersService = {
  async getMe(): Promise<User> {
    const { data } = await apiClient.get<User>(ENDPOINTS.PROFILE_ME);
    return data;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const { data } = await apiClient.patch<User>(ENDPOINTS.PROFILE_UPDATE, payload);
    return data;
  },

  async uploadAvatar(imageBase64: string, mimeType?: string): Promise<User> {
    const { data } = await apiClient.post<User>(ENDPOINTS.AVATAR_UPLOAD, { imageBase64, mimeType });
    return data;
  },

  async registerPushToken(token: string, platform: 'android' | 'ios' | 'web'): Promise<{ message: string }> {
    const { data } = await apiClient.post(ENDPOINTS.PUSH_TOKEN, { token, platform });
    return data;
  },

  async unregisterPushToken(token: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete(`${ENDPOINTS.PUSH_TOKEN}/${encodeURIComponent(token)}`);
    return data;
  },

  async getFavorites(): Promise<FavoriteItem[]> {
    const { data } = await apiClient.get<FavoriteItem[]>(ENDPOINTS.FAVORITES);
    return data;
  },

  async addFavorite(type: FavoriteItem['type'], itemId: string): Promise<FavoriteItem> {
    const { data } = await apiClient.post<FavoriteItem>(ENDPOINTS.FAVORITE_ADD, { type, itemId });
    return data;
  },

  async removeFavorite(favoriteId: string): Promise<void> {
    await apiClient.delete(`${ENDPOINTS.FAVORITE_REMOVE}/${favoriteId}`);
  },

  async getFoodJournal(date?: string): Promise<JournalEntry[]> {
    const { data } = await apiClient.get<JournalEntry[]>(ENDPOINTS.FOOD_JOURNAL, { params: { date } });
    return data;
  },

  async addJournalEntry(entry: AddJournalEntryPayload): Promise<JournalEntry> {
    const { data } = await apiClient.post<JournalEntry>(ENDPOINTS.JOURNAL_ENTRY, entry);
    return data;
  },

  async deleteJournalEntry(entryId: string): Promise<void> {
    await apiClient.delete(`${ENDPOINTS.JOURNAL_ENTRY}/${entryId}`);
  },

  async getNotifications(page = 1): Promise<{ items: Notification[]; unreadCount: number }> {
    const { data } = await apiClient.get(ENDPOINTS.NOTIFICATIONS, { params: { page } });
    return data;
  },

  async markNotificationRead(notificationId: string): Promise<void> {
    await apiClient.patch(`${ENDPOINTS.NOTIFICATIONS_READ}/${notificationId}`);
  },

  async markAllNotificationsRead(): Promise<void> {
    await apiClient.patch(ENDPOINTS.NOTIFICATIONS_READ);
  },
};
