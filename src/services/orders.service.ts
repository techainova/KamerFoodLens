// src/services/orders.service.ts
import apiClient from './api.client';
import { ENDPOINTS } from './config';

// What we send to create an order — the backend looks up name/price from the menu
// item itself server-side, so only the id and quantity are accepted.
export interface CreateOrderItemInput {
  menuItemId: string;
  qty: number;
}

export type OrderMode = 'delivery' | 'pickup' | 'dine_in' | 'reservation';

export interface CreateOrderPayload {
  restaurantId: string;
  items: CreateOrderItemInput[];
  mode: OrderMode;
  note?: string;
  reservationAt?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';

// An item as it comes back on a persisted order — name/price are a snapshot taken
// at order-creation time, not live menu data.
export interface OrderItemView {
  id: string;
  menuItemId: string;
  name: string;
  priceXAF: number;
  qty: number;
}

export interface Order {
  id: string;
  ref: string;
  userId: string;
  restaurantId: string;
  status: OrderStatus;
  mode: OrderMode;
  totalXAF: number;
  kflFeeXAF: number;
  note: string | null;
  reservationAt: string | null;
  items: OrderItemView[];
  createdAt: string;
  updatedAt: string;
}

export const ordersService = {
  async create(payload: CreateOrderPayload): Promise<Order> {
    const { data } = await apiClient.post<Order>(ENDPOINTS.ORDERS, payload);
    return data;
  },

  async getList(page = 1): Promise<{ items: Order[]; total: number; page: number }> {
    const { data } = await apiClient.get(ENDPOINTS.ORDERS, { params: { page } });
    return data;
  },

  async getDetail(orderId: string): Promise<Order> {
    const { data } = await apiClient.get<Order>(`${ENDPOINTS.ORDERS}/${orderId}`);
    return data;
  },

  async cancel(orderId: string): Promise<Order> {
    const { data } = await apiClient.patch<Order>(`${ENDPOINTS.ORDERS}/${orderId}/cancel`);
    return data;
  },
};
