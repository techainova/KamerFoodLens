// src/store/orders.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';

const _mmkv = createMMKV({ id: 'kfl-orders-store' });
const mmkvStorage = {
  setItem:    (key: string, value: string) => _mmkv.set(key, value),
  getItem:    (key: string) => _mmkv.getString(key) ?? null,
  removeItem: (key: string) => { _mmkv.remove(key); },
};

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface OrderItem {
  id:    string;
  name:  string;
  qty:   number;
  price: number;
  note?: string;
}

export interface Order {
  id:             string;
  ref:            string;
  restaurantId:   string;
  restaurantName: string;
  items:          OrderItem[];
  subtotal:       number;
  delivery:       number;
  total:          number;
  deliveryMode:   'delivery' | 'pickup';
  paymentMethod:  string;
  note:           string;
  status:         OrderStatus;
  createdAt:      string;
  updatedAt:      string;
}

const SEED_ORDERS: Order[] = [
  {
    id: 'ord-001', ref: '#KFL-4821',
    restaurantId: 'resto-001', restaurantName: 'Chez Mama Pauline',
    items: [
      { id: 'ndole', name: 'Ndolé traditionnel', qty: 2, price: 4500 },
      { id: 'miondo', name: 'Miondo (x3)', qty: 1, price: 1500 },
      { id: 'jus-gingembre', name: 'Jus de gingembre', qty: 2, price: 1000 },
    ],
    subtotal: 12000, delivery: 1000, total: 13000,
    deliveryMode: 'delivery', paymentMethod: 'MTN Mobile Money', note: '',
    status: 'delivered', createdAt: '2026-06-15T14:35:00Z', updatedAt: '2026-06-15T15:10:00Z',
  },
  {
    id: 'ord-002', ref: '#KFL-4715',
    restaurantId: 'resto-002', restaurantName: "Restaurant L'Authenticité",
    items: [
      { id: 'poulet-dg', name: 'Poulet DG', qty: 1, price: 5500 },
      { id: 'eau', name: 'Eau minérale', qty: 2, price: 500 },
    ],
    subtotal: 6500, delivery: 0, total: 6500,
    deliveryMode: 'pickup', paymentMethod: 'Orange Money', note: 'Sans piment',
    status: 'preparing', createdAt: '2026-06-14T19:12:00Z', updatedAt: '2026-06-14T19:25:00Z',
  },
  {
    id: 'ord-003', ref: '#KFL-4632',
    restaurantId: 'resto-003', restaurantName: 'Kmer Saveurs',
    items: [
      { id: 'eru-fufu', name: 'Eru & Fufu', qty: 2, price: 4000 },
    ],
    subtotal: 8000, delivery: 0, total: 8000,
    deliveryMode: 'pickup', paymentMethod: 'MTN Mobile Money', note: '',
    status: 'cancelled', createdAt: '2026-06-12T12:05:00Z', updatedAt: '2026-06-12T12:30:00Z',
  },
];

let _orderCounter = 4830;

interface OrdersState {
  orders: Order[];
  placeOrder: (params: {
    restaurantId: string;
    restaurantName: string;
    items: OrderItem[];
    subtotal: number;
    delivery: number;
    total: number;
    deliveryMode: 'delivery' | 'pickup';
    paymentMethod: string;
    note: string;
  }) => Order;
  updateStatus: (orderId: string, status: OrderStatus) => void;
  cancelOrder:  (orderId: string) => void;
  getById:      (orderId: string) => Order | undefined;
}

export const useOrdersStore = create<OrdersState>()(
  persist(
    (set, get) => ({
      orders: SEED_ORDERS,

      placeOrder: (params) => {
        _orderCounter++;
        const now = new Date().toISOString();
        const newOrder: Order = {
          id:    `ord-${_orderCounter}`,
          ref:   `#KFL-${_orderCounter}`,
          ...params,
          status: 'confirmed',
          createdAt: now,
          updatedAt: now,
        };
        set(s => ({ orders: [newOrder, ...s.orders] }));
        return newOrder;
      },

      updateStatus: (orderId, status) => set(s => ({
        orders: s.orders.map(o => o.id === orderId
          ? { ...o, status, updatedAt: new Date().toISOString() }
          : o
        ),
      })),

      cancelOrder: (orderId) => set(s => ({
        orders: s.orders.map(o => o.id === orderId
          ? { ...o, status: 'cancelled', updatedAt: new Date().toISOString() }
          : o
        ),
      })),

      getById: (orderId) => get().orders.find(o => o.id === orderId),
    }),
    { name: 'kfl-orders', storage: createJSONStorage(() => mmkvStorage) }
  )
);
