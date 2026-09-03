// src/services/restaurants.service.ts
import apiClient from './api.client';
import { ENDPOINTS } from './config';

export interface Restaurant {
  id: string;
  name: string;
  type: string;
  address: string;
  city: string;
  district?: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  priceRange: 1 | 2 | 3;
  imageUrl?: string;
  isOpen: boolean;
  distance?: number;
  specialties: string[];
  phone?: string;
  hoursLabel?: string;
  isVerified: boolean;
  openingHours?: Record<string, string>;
}

export interface MenuItem {
  id: string;
  name: string;
  nameEN?: string;
  category: string;
  description?: string;
  priceXAF: number;
  imageUrl?: string;
  isAvailable: boolean;
  allergens?: string[];
}

export interface RestaurantReview {
  id: string;
  authorName: string;
  rating: number;
  text: string;
  createdAt: string;
}

export interface MenuItemPayload {
  name: string;
  nameEN?: string;
  description?: string;
  priceXAF: number;
  category?: string;
  imageUrl?: string;
  isAvailable?: boolean;
  allergens?: string[];
}

export const restaurantsService = {
  async getNearby(lat: number, lng: number, radius = 5000): Promise<Restaurant[]> {
    const { data } = await apiClient.get<Restaurant[]>(ENDPOINTS.RESTAURANTS_NEARBY, {
      params: { lat, lng, radius },
    });
    return data;
  },

  async getDetail(restaurantId: string): Promise<Restaurant> {
    const { data } = await apiClient.get<Restaurant>(`${ENDPOINTS.RESTAURANT_DETAIL}/${restaurantId}`);
    return data;
  },

  async getMenu(restaurantId: string): Promise<MenuItem[]> {
    const { data } = await apiClient.get<MenuItem[]>(`${ENDPOINTS.RESTAURANT_MENU}/${restaurantId}/menu`);
    return data;
  },

  async getReviews(restaurantId: string): Promise<RestaurantReview[]> {
    const { data } = await apiClient.get<RestaurantReview[]>(`${ENDPOINTS.RESTAURANT_REVIEWS}/${restaurantId}/reviews`);
    return data;
  },

  async createReview(restaurantId: string, rating: number, comment?: string): Promise<void> {
    await apiClient.post(`${ENDPOINTS.RESTAURANT_REVIEWS}/${restaurantId}/reviews`, { rating, comment });
  },

  async createMenuItem(restaurantId: string, payload: MenuItemPayload): Promise<MenuItem> {
    const { data } = await apiClient.post<MenuItem>(`${ENDPOINTS.RESTAURANT_MENU}/${restaurantId}/menu`, payload);
    return data;
  },

  async updateMenuItem(restaurantId: string, itemId: string, payload: Partial<MenuItemPayload>): Promise<MenuItem> {
    const { data } = await apiClient.patch<MenuItem>(`${ENDPOINTS.RESTAURANT_MENU}/${restaurantId}/menu/${itemId}`, payload);
    return data;
  },

  async deleteMenuItem(restaurantId: string, itemId: string): Promise<void> {
    await apiClient.delete(`${ENDPOINTS.RESTAURANT_MENU}/${restaurantId}/menu/${itemId}`);
  },
};
