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

export type AppTabParams = {
  HomeTab:      undefined;
  SearchTab:    undefined;
  ScannerTab:   undefined;
  FavoritesTab: undefined;
  ProTab:       undefined;
  ProfileTab:   undefined;
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
  Result:             undefined;
  RecipeV1:           undefined;
  Recipe:             undefined;
  Feed:               undefined;
  Forum:              undefined;
  ForumDetail:        undefined;
  CreatePost:         undefined;
  Restaurant:         undefined;
  Events:             undefined;
  EventDetail:        undefined;
  Live:               undefined;
  Courses:            undefined;
  CourseDetail:       undefined;
  CoursePlayer:       undefined;
  Games:              undefined;
  Quiz:               undefined;
  Tombola:            undefined;
  Badges:             undefined;
  MapScreen:          undefined;
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
  StoriesViewer:        { authorId?: string };
  AddStory:             undefined;
  AllRecipes:           undefined;
  AllEvents:            undefined;
  AllStories:           undefined;
};

export type HomeStackParamList = HomeStackParams;

export type ScannerStackParams = {
  Camera:    undefined;
  AudioText: undefined;
  Result:    { scanId: string; classId?: string; confidence?: number; imageUri?: string };
  Recipe:    { dishId: string };
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

export type ProStackParams = {
  UpgradePro:         undefined;
  ProDashboard:       undefined;
  RestaurantMenu:     undefined;
  RestaurantMenuEdit: { itemId?: string };
  ProRevenues:        undefined;
  ProFormations:      undefined;
  ProFormationManage: { courseId: string };
  ProMessages:        undefined;
  ProMessageDetail:   { userId: string };
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

export type RootStackParams = {
  Auth: undefined;
  App:  undefined;
};

export type RootStackParamList = {
  Splash:          undefined;
  Onboarding:      undefined;
  Login:           undefined;
  Signup:          undefined;
  SignupProAware:  undefined;
  OTP:             { email: string; isBusiness?: boolean };
  App:             undefined;
};
