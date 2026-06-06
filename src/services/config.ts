// src/services/config.ts
// Configuration de base pour les appels API

export const API_CONFIG = {
  BASE_URL:    __DEV__
    ? 'http://localhost:3000/api'
    : 'https://api.kmerfoodlens.com/api',

  GRAPHQL_URL: __DEV__
    ? 'http://localhost:3000/graphql'
    : 'https://api.kmerfoodlens.com/graphql',

  TIMEOUT:     15_000, // 15 secondes

  HEADERS: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
    'X-App-Version': '4.0.0',
    'X-Platform':    'mobile',
  },
} as const;

// Endpoints REST
export const ENDPOINTS = {
  // Auth
  LOGIN:          '/auth/login',
  SIGNUP:         '/auth/signup',
  OTP_VERIFY:     '/auth/otp/verify',
  REFRESH:        '/auth/refresh',
  LOGOUT:         '/auth/logout',

  // Scanner IA (payload chiffré AES-256-GCM)
  SCAN_IMAGE:     '/scan/image',
  SCAN_AUDIO:     '/scan/audio',
  SCAN_TEXT:      '/scan/text',

  // Restaurants
  RESTAURANTS_NEARBY: '/restaurants/nearby',
  RESTAURANT_MENU:    '/restaurants/menu',

  // Commandes
  ORDERS:         '/orders',
  ORDER_INVOICE:  '/orders/invoice',

  // Paiement
  PAYMENT_INIT:    '/payments/initiate',
  PAYMENT_WEBHOOK: '/payments/webhook',
  PAYOUT_REQUEST:  '/payouts/request',
} as const;
