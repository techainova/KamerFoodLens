// src/store/favorites.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import { usersService, type FavoriteItem } from '@/services/users.service';

const _mmkv = createMMKV({ id: 'kfl-favorites-store' });
const mmkvStorage = {
  setItem:    (key: string, value: string) => _mmkv.set(key, value),
  getItem:    (key: string) => _mmkv.getString(key) ?? null,
  removeItem: (key: string) => { _mmkv.remove(key); },
};

interface FavoritesState {
  favorites:  FavoriteItem[];
  isLoading:  boolean;
  fetchAll:   () => Promise<void>;
  toggle:     (type: FavoriteItem['type'], itemId: string) => Promise<void>;
  isSaved:    (itemId: string) => boolean;
  getByType:  (type: FavoriteItem['type']) => FavoriteItem[];
}

// Not currently selected this way anywhere, but memoized preemptively: this is the same
// filter-returns-new-array-every-call shape that caused an infinite-render-loop crash in
// events.store.ts when a component selected the invoked result instead of the function.
let byTypeCache: { favorites: FavoriteItem[]; type: FavoriteItem['type']; result: FavoriteItem[] } | null = null;

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favorites: [],
      isLoading: false,

      fetchAll: async () => {
        set({ isLoading: true });
        try {
          const favorites = await usersService.getFavorites();
          set({ favorites });
        } finally {
          set({ isLoading: false });
        }
      },

      toggle: async (type, itemId) => {
        const existing = get().favorites.find((f) => f.type === type && f.itemId === itemId);

        if (existing) {
          set((s) => ({ favorites: s.favorites.filter((f) => f.id !== existing.id) }));
          try {
            await usersService.removeFavorite(existing.id);
          } catch (err) {
            set((s) => ({ favorites: [...s.favorites, existing] }));
            throw err;
          }
          return;
        }

        try {
          const created = await usersService.addFavorite(type, itemId);
          set((s) => ({ favorites: [created, ...s.favorites] }));
        } catch (err) {
          throw err;
        }
      },

      isSaved: (itemId) => get().favorites.some((f) => f.itemId === itemId),

      getByType: (type) => {
        const favorites = get().favorites;
        if (byTypeCache && byTypeCache.favorites === favorites && byTypeCache.type === type) {
          return byTypeCache.result;
        }
        const result = favorites.filter((f) => f.type === type);
        byTypeCache = { favorites, type, result };
        return result;
      },
    }),
    { name: 'kfl-favorites', storage: createJSONStorage(() => mmkvStorage), partialize: () => ({}) }
  )
);
