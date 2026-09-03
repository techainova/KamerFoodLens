// src/store/restaurant.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import { restaurantsService, type Restaurant as RestaurantDto, type MenuItem as MenuItemDto } from '@/services/restaurants.service';

const _mmkv = createMMKV({ id: 'kfl-restaurant-store' });
const mmkvStorage = {
  setItem:    (key: string, value: string) => _mmkv.set(key, value),
  getItem:    (key: string) => _mmkv.getString(key) ?? null,
  removeItem: (key: string) => { _mmkv.remove(key); },
};

export interface MenuItem {
  id:       string;
  name:     string;
  desc:     string;
  price:    number;
  category: string;
  imageUrl?: string;
  popular?: boolean;
}

export interface Restaurant {
  id:           string;
  name:         string;
  type:         string;
  rating:       number;
  reviewCount:  number;
  distance:     string;
  deliveryTime: string;
  freeDelivery: number;
  isOpen:       boolean;
  price:        '€' | '€€' | '€€€';
  menu:         MenuItem[];
  followers:    number;
  lat:          number;
  lng:          number;
  specialties:  string[];
  isVerified:   boolean;
  hoursLabel:   string;
  address:      string;
  phone:        string;
  imageUrl?:    string;
}

function priceRangeToSymbol(priceRange: 1 | 2 | 3): '€' | '€€' | '€€€' {
  return priceRange === 1 ? '€' : priceRange === 3 ? '€€€' : '€€';
}

function estimateDeliveryMinutes(distanceKm: number | undefined): string {
  return String(Math.round(15 + (distanceKm ?? 2) * 3));
}

function toStoreMenuItem(item: MenuItemDto): MenuItem {
  return {
    id: item.id,
    name: item.name,
    desc: item.description ?? '',
    price: item.priceXAF,
    category: item.category,
    imageUrl: item.imageUrl,
    popular: false,
  };
}

function toStoreRestaurant(dto: RestaurantDto, menuItems: MenuItemDto[]): Restaurant {
  return {
    id: dto.id,
    name: dto.name,
    type: dto.type,
    rating: dto.rating,
    reviewCount: dto.reviewCount,
    distance: dto.distance !== undefined ? `${dto.distance} km` : '',
    deliveryTime: estimateDeliveryMinutes(dto.distance),
    freeDelivery: 5000,
    isOpen: dto.isOpen,
    price: priceRangeToSymbol(dto.priceRange),
    followers: 0,
    lat: dto.lat,
    lng: dto.lng,
    specialties: dto.specialties,
    isVerified: dto.isVerified,
    hoursLabel: dto.hoursLabel ?? '',
    address: dto.address,
    phone: dto.phone ?? '',
    imageUrl: dto.imageUrl,
    menu: menuItems.map(toStoreMenuItem),
  };
}

// Douala, Cameroun — default center used when no restaurants are loaded yet and no GPS fix is available.
const DEFAULT_LAT = 4.0511;
const DEFAULT_LNG = 9.7679;

interface RestaurantState {
  restaurants:   Restaurant[];
  isLoading:     boolean;
  fetchNearby:   (lat: number, lng: number, radiusMeters?: number) => Promise<void>;
  fetchById:     (id: string) => Promise<Restaurant | undefined>;
  getById:       (id: string) => Restaurant | undefined;
  ensureLoaded:  () => void;
}

export const useRestaurantStore = create<RestaurantState>()(
  persist(
    (set, get) => ({
      restaurants: [],
      isLoading:   false,

      fetchNearby: async (lat, lng, radiusMeters = 5000) => {
        set({ isLoading: true });
        try {
          const items = await restaurantsService.getNearby(lat, lng, radiusMeters);
          const withMenus = await Promise.all(
            items.map(async (r) => {
              const menuItems = await restaurantsService.getMenu(r.id).catch(() => []);
              return toStoreRestaurant(r, menuItems);
            }),
          );
          set({ restaurants: withMenus });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchById: async (id) => {
        const existing = get().restaurants.find((r) => r.id === id);
        if (existing) {
          return existing;
        }

        const [detail, menuItems] = await Promise.all([
          restaurantsService.getDetail(id),
          restaurantsService.getMenu(id).catch(() => []),
        ]);

        const restaurant = toStoreRestaurant(detail, menuItems);
        set((s) => ({ restaurants: [...s.restaurants, restaurant] }));
        return restaurant;
      },

      getById: (id) => get().restaurants.find(r => r.id === id),

      ensureLoaded: () => {
        const { restaurants, isLoading, fetchNearby } = get();
        if (restaurants.length === 0 && !isLoading) {
          void fetchNearby(DEFAULT_LAT, DEFAULT_LNG);
        }
      },
    }),
    {
      name: 'kfl-restaurant',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: () => ({}),
    }
  )
);
