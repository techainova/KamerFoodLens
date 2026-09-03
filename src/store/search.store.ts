// src/store/search.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import { useRestaurantStore } from './restaurant.store';

const _mmkv = createMMKV({ id: 'kfl-search-store' });
const mmkvStorage = {
  setItem:    (key: string, value: string) => _mmkv.set(key, value),
  getItem:    (key: string) => _mmkv.getString(key) ?? null,
  removeItem: (key: string) => { _mmkv.remove(key); },
};

export type SearchResultType = 'restaurant' | 'dish' | 'post';

export interface SearchResult {
  id:       string;
  type:     SearchResultType;
  title:    string;
  subtitle: string;
  meta?:    string;
}

const MAX_HISTORY = 10;

interface SearchState {
  history:       string[];
  addToHistory:  (query: string) => void;
  removeFromHistory:(query: string) => void;
  clearHistory:  () => void;
  search:        (query: string) => SearchResult[];
}

function normalize(s: string): string {
  return s.toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .trim();
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      history: [],

      addToHistory: (query) => {
        const q = query.trim();
        if (!q) return;
        set(s => {
          const filtered = s.history.filter(h => h !== q);
          return { history: [q, ...filtered].slice(0, MAX_HISTORY) };
        });
      },

      removeFromHistory: (query) => set(s => ({
        history: s.history.filter(h => h !== query),
      })),

      clearHistory: () => set({ history: [] }),

      search: (query: string): SearchResult[] => {
        const q = normalize(query);
        if (!q) return [];
        const results: SearchResult[] = [];

        // Search restaurants already fetched into the restaurant store (MapScreen populates it via getNearby)
        for (const r of useRestaurantStore.getState().restaurants) {
          if (normalize(r.name).includes(q) || normalize(r.type).includes(q)) {
            results.push({
              id:       r.id,
              type:     'restaurant',
              title:    r.name,
              subtitle: r.type,
              meta:     `${r.rating}★ · ${r.distance}`,
            });
          }
          // Search menu items
          for (const item of r.menu) {
            if (normalize(item.name).includes(q) || normalize(item.desc).includes(q)) {
              results.push({
                id:       `${r.id}:${item.id}`,
                type:     'dish',
                title:    item.name,
                subtitle: r.name,
                meta:     `${item.price.toLocaleString()} FCFA`,
              });
            }
          }
        }

        return results.slice(0, 20);
      },
    }),
    { name: 'kfl-search', storage: createJSONStorage(() => mmkvStorage), partialize: s => ({ history: s.history }) }
  )
);
