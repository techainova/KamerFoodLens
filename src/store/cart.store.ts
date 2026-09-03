// src/store/cart.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';

const _mmkv = createMMKV({ id: 'kfl-cart-store' });
const mmkvStorage = {
  setItem:    (key: string, value: string) => _mmkv.set(key, value),
  getItem:    (key: string) => _mmkv.getString(key) ?? null,
  removeItem: (key: string) => { _mmkv.remove(key); },
};

export interface CartItem {
  id:       string;
  name:     string;
  price:    number;
  qty:      number;
  note?:    string;
}

export interface CartState {
  restaurantId:   string | null;
  restaurantName: string | null;
  items:          CartItem[];

  addItem:        (restaurantId: string, restaurantName: string, item: Omit<CartItem, 'qty'>) => void;
  removeItem:     (itemId: string) => void;
  updateQty:      (itemId: string, qty: number) => void;
  updateNote:     (itemId: string, note: string) => void;
  clearCart:      () => void;
  total:          () => number;
  count:          () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      restaurantId:   null,
      restaurantName: null,
      items:          [],

      addItem: (restaurantId, restaurantName, item) => set((s) => {
        // Si restaurant différent, vider le panier
        if (s.restaurantId && s.restaurantId !== restaurantId) {
          return {
            restaurantId,
            restaurantName,
            items: [{ ...item, qty: 1 }],
          };
        }
        const existing = s.items.find(i => i.id === item.id);
        if (existing) {
          return {
            restaurantId,
            restaurantName,
            items: s.items.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i),
          };
        }
        return {
          restaurantId,
          restaurantName,
          items: [...s.items, { ...item, qty: 1 }],
        };
      }),

      removeItem: (itemId) => set((s) => {
        const items = s.items.filter(i => i.id !== itemId);
        return { items, restaurantId: items.length ? s.restaurantId : null, restaurantName: items.length ? s.restaurantName : null };
      }),

      updateQty: (itemId, qty) => set((s) => {
        if (qty <= 0) {
          const items = s.items.filter(i => i.id !== itemId);
          return { items, restaurantId: items.length ? s.restaurantId : null, restaurantName: items.length ? s.restaurantName : null };
        }
        return { items: s.items.map(i => i.id === itemId ? { ...i, qty } : i) };
      }),

      updateNote: (itemId, note) => set((s) => ({
        items: s.items.map(i => i.id === itemId ? { ...i, note } : i),
      })),

      clearCart: () => set({ restaurantId: null, restaurantName: null, items: [] }),

      total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),

      count: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    { name: 'kfl-cart', storage: createJSONStorage(() => mmkvStorage) }
  )
);
