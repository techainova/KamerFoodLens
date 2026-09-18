// src/navigation/types.ts
// Tous les types TypeScript de navigation KFL

export type AuthStackParams = {
  Splash:          undefined;
  Onboarding:      undefined;
  Login:           undefined;
  Signup:          undefined;
  SignupProAware:  undefined;
  OTP:             { email: string; isBusiness?: boolean };
};

// Compte standard (5 onglets icônes) : Accueil / Restaurant / Scanner / Vidéo / Profil.
// Compte Pro (5 onglets distincts) : Tableau / Commandes / Créer / Offres / Ma page.
export type AppTabParams = {
  HomeTab:    undefined;
  RestoTab:   undefined;
  ScanTab:    undefined;
  VideoTab:   undefined;
  ProfileTab: undefined;
  DashTab:    undefined;
  OrdersTab:  undefined;
  CreateTab:  undefined;
  OffersTab:  undefined;
  PageTab:    undefined;
};

export type HomeStackParams = {
  HomeScreen:         undefined;
  HomeV2:             undefined;
  HomeV3:             undefined;
  Notifications:      undefined;
  DishDetail:         { dishId: string };
  Search:             undefined;
  Camera:             undefined;
  AudioText:          undefined;
  Result:             { scanId: string; classId?: string; confidence?: number; imageUri?: string };
  RecipeV1:           undefined;
  Recipe:             undefined;
  Feed:               undefined;
  Forum:              undefined;
  ForumDetail:        { threadId: string };
  CreateThread:       undefined;
  CreatePost:         { imageUri?: string; imageBase64?: string; mimeType?: string; classId?: string; confidence?: number } | undefined;
  Restaurant:         { restaurantId?: string } | undefined;
  Events:             undefined;
  EventDetail:        { eventId?: string } | undefined;
  Live:               undefined;
  Courses:            undefined;
  CourseDetail:       { courseId?: string } | undefined;
  CoursePlayer:       { courseId?: string; lessonId?: string } | undefined;
  Games:              undefined;
  Quiz:               undefined;
  Tombola:            undefined;
  Badges:             undefined;
  MapScreen:          undefined;
  ConversationsList:  undefined;
  ChatThread:         { conversationId: string; otherUser: { id: string; name: string; avatar?: string; role: 'standard' | 'pro' | 'admin' } };
  ProfileScreen:      undefined;
  EditProfile:        undefined;
  Settings:           undefined;
  History:            undefined;
  FavoritesScreen:    undefined;
  Payment:            undefined;
  PaymentSuccess:     undefined;
  OrderMenu:          undefined;
  OrderSummary:       undefined;
  OrderPayment:       undefined;
  OrderInvoice:       undefined;
  OrderHistory:       undefined;
  UpgradePro:         undefined;
  ProDashboard:       undefined;
  AdminLogin:         undefined;
  FoodJournal:          undefined;
  SearchByIngredients:  undefined;
  SpeedChallenge:       undefined;
  LeaderboardFull:      undefined;
  WalletScreen:         undefined;
  TransactionHistory:   undefined;
  MobileMoneyConfirm:   { provider: string; amount: number; phone: string };
  ChangePassword:       undefined;
  PrivacySettings:      undefined;
  LanguagePicker:       undefined;
  ThemePicker:          undefined;
  AboutKFL:             undefined;
  StoriesViewer:        { authorId?: string; highlightId?: string };
  StoryCreatorCamera:   undefined;
  AddStory:             { uri?: string; base64?: string; textOnly?: boolean } | undefined;
  AllRecipes:           undefined;
  AllEvents:            undefined;
  AllStories:           undefined;
  JournalStoriesViewer: { dayKey?: string };
  HistoryStoriesViewer: { dayKey?: string };
};

export type HomeStackParamList = HomeStackParams;

export type ScannerStackParams = {
  ScannerHome: undefined;
  Camera:    undefined;
  AudioText: undefined;
  Result:    { scanId: string; classId?: string; confidence?: number; imageUri?: string; query?: string };
  Recipe:    { dishId: string };
  MapScreen: undefined;
  Restaurant: { restaurantId?: string } | undefined;
  CreatePost: { imageUri?: string; imageBase64?: string; mimeType?: string; classId?: string; confidence?: number } | undefined;
  Login:      undefined;
};

export type MapStackParams = {
  MapScreen:        undefined;
  RestaurantPublic: { restaurantId: string };
};

export type OrderStackParams = {
  OrderMenu:     { restaurantId: string };
  OrderSummary:  undefined;
  OrderPayment:  undefined;
  OrderInvoice:  { orderId: string };
  OrderHistory:  undefined;
};

// ── Onglet Restaurant (compte standard) ──────────────────────────────────────
export type RestoStackParams = {
  Restos:        undefined;
  Restaurant:    { restaurantId?: string } | undefined;
  OrderMenu:     { restaurantId: string };
  OrderSummary:  undefined;
  OrderPayment:  undefined;
  OrderInvoice:  { orderId: string };
  OrderHistory:  undefined;
  MapScreen:     undefined;
};

// ── Onglet Vidéo (compte standard) ───────────────────────────────────────────
export type VideoStackParams = {
  VideoFeed:     { startId?: string } | undefined;
  VideoComments: { videoId: string };
  CreateVideo:   undefined;
  CourseDetail:  { courseId?: string } | undefined;
  Login:         undefined;
};

export type ProStackParams = {
  UpgradePro:         undefined;
  ProDashboard:       undefined;
  ProCreateHub:       undefined;
  ProOffers:          undefined;
  RestaurantMenu:     undefined;
  RestaurantMenuEdit: { restaurantId: string; itemId?: string };
  ProRevenues:        undefined;
  ProFormations:      undefined;
  ProFormationManage: { courseId: string };
  ProMessages:        undefined;
  ProMessageDetail:   { messageId: string };
  ProPromos:          undefined;
  ProAnalytics:       undefined;
  ProSubscription:    undefined;
  ProPaymentSetup:    undefined;
  ProOrders:          undefined;
  ProOrderDetail:     { orderId: string };
};

export type AdminStackParams = {
  AdminLogin:         undefined;
  AdminDashboard:     undefined;
  AdminDashUnified:   undefined;
  AdminUsers:         undefined;
  AdminUserDetail:    { userId: string };
  AdminModeration:    undefined;
  AdminEvents:        undefined;
  AdminTombola:       undefined;
  AdminFinance:       undefined;
  AdminSettings:      undefined;
  AdminLogs:          undefined;
  AdminProList:       undefined;
  AdminProDetail:     { restaurantId: string };
  AdminPayouts:       undefined;
  AdminPush:          undefined;
};

export type UserV3StackParams = {
  FoodJournal:            undefined;
  JournalStats:           undefined;
  SearchByIngredients:    undefined;
  AccessibilitySettings:  undefined;
  SettingsProEntry:       undefined;
  SettingsProActive:      undefined;
  ProfilePro:             undefined;
  HomeProAware:           undefined;
};

// Racine unique : l'app (onglets) est toujours montée, les écrans d'auth sont
// des modaux atteignables depuis n'importe où via navigation.navigate('Login').
export type RootStackParamList = {
  Splash:          undefined;
  Onboarding:      undefined;
  Login:           undefined;
  SignupProAware:  undefined;
  // Étape établissement, avant l'OTP : le compte n'a pas encore de token, donc
  // ce formulaire ne peut pas encore appeler /pro/upgrade — il transmet ses
  // champs à OTP, qui les soumettra une fois le token obtenu.
  ProRegistration: { fromSignup: true; email: string } | undefined;
  OTP: {
    email: string;
    isBusiness?: boolean;
    businessName?: string;
    businessType?: string;
    businessPhone?: string;
    businessAddress?: string;
    businessDescription?: string;
  };
  App:             undefined;
};
