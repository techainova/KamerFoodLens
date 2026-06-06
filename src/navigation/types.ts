// src/navigation/types.ts
// Tous les types TypeScript de navigation KFL

export type AuthStackParams = {
  Splash:     undefined;
  Onboarding: undefined;
  Login:      undefined;
  Signup:     undefined;
  OTP:        { email: string };
};

export type AppTabParams = {
  Home:      undefined;
  Search:    undefined;
  Scanner:   undefined;
  Favorites: undefined;
  Profile:   undefined;
};

export type HomeStackParams = {
  HomeScreen:    undefined;
  Notifications: undefined;
  DishDetail:    { dishId: string };
};

export type ScannerStackParams = {
  Camera:    undefined;
  AudioText: undefined;
  Result:    { scanId: string };
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
  AdminUsers:         undefined;
  AdminUserDetail:    { userId: string };
  AdminProList:       undefined;
  AdminProDetail:     { restaurantId: string };
  AdminPayouts:       undefined;
  AdminPush:          undefined;
};

export type RootStackParams = {
  Auth: undefined;
  App:  undefined;
};
