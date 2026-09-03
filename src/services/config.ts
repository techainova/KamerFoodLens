// src/services/config.ts
// Configuration de base pour les appels API — alignée sur le backend NestJS KFL

export const API_CONFIG = {
  BASE_URL: __DEV__
    ? 'http://localhost:3000'
    : 'https://api.kmerfoodlens.com',

  GRAPHQL_URL: __DEV__
    ? 'http://localhost:3000/graphql'
    : 'https://api.kmerfoodlens.com/graphql',

  SOCKET_URL: __DEV__
    ? 'http://localhost:3000'
    : 'https://api.kmerfoodlens.com',

  TIMEOUT: 15_000,

  HEADERS: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
    'X-App-Version': '4.0.0',
    'X-Platform':    'mobile',
  },
} as const;

// Endpoints REST — correspondent aux routes du backend NestJS
export const ENDPOINTS = {
  // Auth
  LOGIN:           '/auth/login',
  SIGNUP:          '/auth/register',       // backend: /auth/register (pas /signup)
  OTP_VERIFY:      '/auth/otp/verify',
  OTP_RESEND:      '/auth/otp/resend',
  REFRESH:         '/auth/refresh',
  LOGOUT:          '/auth/logout',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD:  '/auth/reset-password',
  PASSWORD_CHANGE: '/auth/change-password',
  GOOGLE_TOKEN:    '/auth/google/token',

  // Scanner IA (payload chiffré AES-256-GCM côté serveur)
  SCAN_IMAGE:     '/scan/image',
  SCAN_AUDIO:     '/scan/audio',
  SCAN_TEXT:      '/scan/text',
  SCAN_HISTORY:   '/scan/history',
  SCAN_RESULT:    '/scan/result',

  // Restaurants
  RESTAURANTS_NEARBY:  '/restaurants',            // ?lat&lng&radius&cuisine&page
  RESTAURANT_DETAIL:   '/restaurants',            // + /:id
  RESTAURANT_MENU:     '/restaurants',            // + /:id/menu
  RESTAURANT_REVIEWS:  '/restaurants',            // + /:id/reviews

  // Commandes
  ORDERS:        '/orders',
  ORDER_DETAIL:  '/orders',                       // + /:id
  ORDER_INVOICE: '/orders',                       // + /:id (client-side PDF)

  // Paiement (AES-256-GCM sur /payments/initiate)
  PAYMENT_INIT:    '/payments/initiate',
  WALLET:          '/payments/wallet',
  WALLET_TOPUP:    '/payments/wallet/topup',
  TRANSACTIONS:    '/payments/transactions',
  PAYOUT_REQUEST:  '/pro/payouts/request',

  // Recettes (module séparé si disponible)
  RECIPES:          '/recipes',
  RECIPE_DETAIL:    '/recipes',
  RECIPES_TRENDING: '/dishes/trending',
  RECIPES_POPULAR:  '/recipes/popular',

  // Profil utilisateur
  PROFILE_ME:     '/users/me',
  PROFILE_UPDATE: '/users/me',
  AVATAR_UPLOAD:  '/users/me/avatar',
  PUSH_TOKEN:     '/users/me/push-token',           // + /:token (DELETE)

  // Badges & Notifications
  BADGES:             '/users/badges',
  NOTIFICATIONS:      '/users/notifications',     // backend: /users/notifications
  NOTIFICATIONS_READ: '/users/notifications/read',

  // Favoris
  FAVORITES:       '/users/favorites',
  FAVORITE_ADD:    '/users/favorites',
  FAVORITE_REMOVE: '/users/favorites',

  // Journal alimentaire
  FOOD_JOURNAL:  '/users/journal',                // backend: /users/journal
  JOURNAL_ENTRY: '/users/journal',

  // Événements
  EVENTS:           '/events',
  EVENT_DETAIL:     '/events',                    // + /:id
  EVENT_REGISTER:   '/events',                    // + /:id/register
  EVENT_UNREGISTER: '/events',                    // + /:id/register (DELETE)

  // Formations
  COURSES:         '/courses',
  COURSE_DETAIL:   '/courses',                    // + /:id
  COURSE_ENROLL:   '/courses',                    // + /:id/enroll
  COURSE_PROGRESS: '/courses',                    // + /:id/progress

  // Jeux & Tombola
  QUIZ_QUESTIONS:  '/games/quiz/questions',       // backend: /games/quiz/questions
  QUIZ_SUBMIT:     '/games/quiz/submit',
  TOMBOLA:         '/games/tombola',
  TOMBOLA_TICKETS: '/games/tombola/tickets',
  TOMBOLA_BUY:     '/games/tombola/buy',
  LEADERBOARD:     '/games/leaderboard',

  // Communauté
  FEED:          '/community/posts',              // backend: /community/posts
  FEED_POST:     '/community/posts',
  POST_LIKE:     '/community/posts',              // + /:id/like
  POST_COMMENT:  '/community/posts',              // + /:id/comments

  FORUM_THREADS: '/community/forum',              // backend: /community/forum
  THREAD_DETAIL: '/community/forum',              // + /:id
  THREAD_REPLY:  '/community/forum',              // + /:id/reply
  STORIES:       '/community/stories',
  HIGHLIGHTS:    '/community/highlights',

  // Pro
  PRO_DASHBOARD:    '/pro/dashboard',
  PRO_UPGRADE:      '/pro/upgrade',
  PRO_REVENUES:     '/pro/revenues',
  PRO_ANALYTICS:    '/pro/analytics',
  PRO_MESSAGES:     '/pro/messages',
  PRO_PROMOS:       '/pro/promos',
  PRO_SUBSCRIPTION: '/pro/subscription',
  PRO_ORDERS:       '/pro/orders',
  PRO_RESTAURANTS:  '/pro/restaurants',
  PRO_PAYOUTS:      '/pro/payouts',
  PRO_PAYMENT_METHODS: '/pro/payment-methods',

  // Admin
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_USERS:     '/admin/users',
  ADMIN_PRO_LIST:  '/admin/pro-requests',
  ADMIN_EVENTS:    '/admin/events',
  ADMIN_FINANCE:   '/admin/finance',
  ADMIN_PAYOUTS:   '/admin/payouts',
  ADMIN_PUSH:      '/admin/push',
  ADMIN_LOGS:      '/admin/logs',
  ADMIN_SETTINGS:  '/admin/settings',
  ADMIN_TOMBOLA:   '/admin/tombola',
  ADMIN_METRICS:   '/admin/dashboard',
} as const;
