// src/services/payments.service.ts
import apiClient from './api.client';
import { ENDPOINTS } from './config';

// Matches the backend's PaymentMethod enum exactly. Mobile Money (MTN/Orange) both route
// through CinetPay's hosted checkout — the backend has no separate mtn_momo/orange_money
// method, CinetPay's own payment page is what lets the customer pick/enter their number.
export type PaymentMethod = 'cinetpay' | 'stripe' | 'wallet';
export type PaymentStatus = 'pending' | 'succeeded' | 'failed' | 'refunded';

export interface InitiatePaymentPayload {
  orderId: string;
  method: PaymentMethod;
}

export interface InitiatePaymentResult {
  paymentId: string;
  paymentUrl?: string;
  paymentIntentId?: string;
}

export type WalletTransactionType = 'credit' | 'debit';

export interface WalletTransaction {
  id: string;
  type: WalletTransactionType;
  amountXAF: number;
  description: string | null;
  createdAt: string;
}

export interface WalletBalance {
  id: string;
  userId: string;
  balanceXAF: number;
  createdAt: string;
  updatedAt: string;
}

export interface PayoutRequestPayload {
  amountXAF: number;
  method: PaymentMethod;
  phone: string;
}

export const paymentsService = {
  async initiate(payload: InitiatePaymentPayload): Promise<InitiatePaymentResult> {
    const { data } = await apiClient.post<InitiatePaymentResult>(ENDPOINTS.PAYMENT_INIT, payload);
    return data;
  },

  async getWallet(): Promise<WalletBalance> {
    const { data } = await apiClient.get<WalletBalance>(ENDPOINTS.WALLET);
    return data;
  },

  async getTransactions(page = 1): Promise<{ items: WalletTransaction[]; total: number }> {
    const { data } = await apiClient.get(ENDPOINTS.TRANSACTIONS, { params: { page } });
    return data;
  },

  async requestPayout(payload: PayoutRequestPayload): Promise<{ message: string; requestId: string }> {
    const { data } = await apiClient.post(ENDPOINTS.PAYOUT_REQUEST, payload);
    return data;
  },
};
