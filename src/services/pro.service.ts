// src/services/pro.service.ts
import apiClient from './api.client';
import { ENDPOINTS } from './config';

export interface ProStats {
  revenueXAF: number;
  revenueChange: number;
  ordersCount: number;
  ordersChange: number;
  customersCount: number;
  avgOrderXAF: number;
  activeMenuItems: number;
  rating: number;
}

export interface ProMessage {
  id: string;
  senderName: string;
  subject: string;
  body: string;
  isRead: boolean;
  createdAt: string;
}

export interface ProPromo {
  id: string;
  restaurantId: string;
  title: string;
  discountPercent: number | null;
  discountXAF: number | null;
  validFrom: string;
  validUntil: string;
}

export interface RevenueDaySummary {
  date: string;
  amount: number;
}

export interface PaymentMethodBreakdown {
  method: string;
  amountXAF: number;
  pct: number;
}

export interface ProRevenueSummary {
  period: string;
  totalXAF: number;
  ordersCount: number;
  revenueByDay: RevenueDaySummary[];
  paymentBreakdown: PaymentMethodBreakdown[];
}

export interface ProAnalyticsSummary {
  period: string;
  ordersByStatus: Record<string, number>;
  topMenuItems: { name: string; qty: number }[];
}

export type ProOrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivering' | 'completed' | 'cancelled';

export interface ProOrderSummary {
  id: string;
  ref: string;
  clientName: string;
  status: ProOrderStatus;
  totalXAF: number;
  createdAt: string;
}

export interface ProOrderDetail extends ProOrderSummary {
  clientPhone: string | null;
  mode: string;
  note: string | null;
  kflFeeXAF: number;
  items: { name: string; qty: number; priceXAF: number }[];
  paymentMethod: string | null;
  paymentStatus: string | null;
}

export interface ProPayout {
  id: string;
  amountXAF: number;
  method: string;
  phone: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  createdAt: string;
}

export interface ProRestaurant {
  id: string;
  name: string;
}

export interface PaymentMethods {
  acceptsMtn: boolean;
  acceptsOrange: boolean;
  acceptsCard: boolean;
  acceptsCash: boolean;
  mtnPhone: string | null;
  orangePhone: string | null;
}

export interface UpgradeProPayload {
  businessName: string;
  businessType: string;
  phone: string;
  address: string;
  description?: string;
}

export interface CreatePromoPayload {
  restaurantId: string;
  title: string;
  discountPercent?: number;
  discountXAF?: number;
  validFrom: string;
  validUntil: string;
}

export const proService = {
  async getDashboard(): Promise<ProStats> {
    const { data } = await apiClient.get<ProStats>(ENDPOINTS.PRO_DASHBOARD);
    return data;
  },

  async upgrade(payload: UpgradeProPayload): Promise<{ id: string; status: string }> {
    const { data } = await apiClient.post(ENDPOINTS.PRO_UPGRADE, payload);
    return data;
  },

  async getRevenues(period: 'week' | 'month' | 'year' = 'month'): Promise<ProRevenueSummary> {
    const { data } = await apiClient.get<ProRevenueSummary>(ENDPOINTS.PRO_REVENUES, { params: { period } });
    return data;
  },

  async getAnalytics(period: 'week' | 'month' | 'year' = 'month'): Promise<ProAnalyticsSummary> {
    const { data } = await apiClient.get<ProAnalyticsSummary>(ENDPOINTS.PRO_ANALYTICS, { params: { period } });
    return data;
  },

  async getMessages(page = 1): Promise<{ items: ProMessage[]; total: number; page: number }> {
    const { data } = await apiClient.get(ENDPOINTS.PRO_MESSAGES, { params: { page } });
    return data;
  },

  async markMessageRead(messageId: string): Promise<ProMessage> {
    const { data } = await apiClient.patch<ProMessage>(`${ENDPOINTS.PRO_MESSAGES}/${messageId}/read`);
    return data;
  },

  async getPromos(): Promise<ProPromo[]> {
    const { data } = await apiClient.get<ProPromo[]>(ENDPOINTS.PRO_PROMOS);
    return data;
  },

  async createPromo(payload: CreatePromoPayload): Promise<ProPromo> {
    const { data } = await apiClient.post<ProPromo>(ENDPOINTS.PRO_PROMOS, payload);
    return data;
  },

  async getOrders(status?: string, page = 1): Promise<{ items: ProOrderSummary[]; total: number }> {
    const { data } = await apiClient.get<{ items: ProOrderSummary[]; total: number }>(ENDPOINTS.PRO_ORDERS, { params: { status, page } });
    return data;
  },

  async getOrderDetail(orderId: string): Promise<ProOrderDetail> {
    const { data } = await apiClient.get<ProOrderDetail>(`${ENDPOINTS.PRO_ORDERS}/${orderId}`);
    return data;
  },

  async updateOrderStatus(orderId: string, status: ProOrderStatus): Promise<ProOrderDetail> {
    const { data } = await apiClient.patch<ProOrderDetail>(`${ENDPOINTS.PRO_ORDERS}/${orderId}/status`, { status });
    return data;
  },

  async getMyRestaurants(): Promise<ProRestaurant[]> {
    const { data } = await apiClient.get<ProRestaurant[]>(ENDPOINTS.PRO_RESTAURANTS);
    return data;
  },

  async getPayouts(): Promise<ProPayout[]> {
    const { data } = await apiClient.get<ProPayout[]>(ENDPOINTS.PRO_PAYOUTS);
    return data;
  },

  async requestPayout(amountXAF: number, method: string, phone: string): Promise<{ message: string; requestId: string }> {
    const { data } = await apiClient.post(ENDPOINTS.PAYOUT_REQUEST, { amountXAF, method, phone });
    return data;
  },

  async getSubscription(): Promise<{ plan: string; status: 'active' | 'inactive'; proProfile: { businessName: string; rating: number; totalOrders: number; totalRevenueXAF: number } | null }> {
    const { data } = await apiClient.get(ENDPOINTS.PRO_SUBSCRIPTION);
    return data;
  },

  async getPaymentMethods(): Promise<PaymentMethods> {
    const { data } = await apiClient.get<PaymentMethods>(ENDPOINTS.PRO_PAYMENT_METHODS);
    return data;
  },

  async updatePaymentMethods(payload: Partial<PaymentMethods>): Promise<PaymentMethods> {
    const { data } = await apiClient.patch<PaymentMethods>(ENDPOINTS.PRO_PAYMENT_METHODS, payload);
    return data;
  },
};
