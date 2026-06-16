// src/navigation/AppNavigator.tsx — Navigation complète KFL (phases 3–9 + sous-écrans)

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackActions } from '@react-navigation/native';
import type { AppTabParams } from './types';

// ── Core ────────────────────────────────────────────────────────────────────
import HomeV1        from '@/screens/home/HomeV1';
import HomeV2        from '@/screens/home/HomeV2';
import HomeV3        from '@/screens/home/HomeV3';
import Search        from '@/screens/home/Search';
import Notifications from '@/screens/home/Notifications';

// ── Scanner ─────────────────────────────────────────────────────────────────
import Camera    from '@/screens/scanner/Camera';
import AudioText from '@/screens/scanner/AudioText';
import ResultV1  from '@/screens/scanner/ResultV1';
import RecipeV1  from '@/screens/scanner/RecipeV1';

// ── Auth (accessible depuis Settings pour replay) ────────────────────────────
import Onboarding      from '@/screens/auth/Onboarding';
import SignupProAware  from '@/screens/auth/SignupProAware';

// ── Map ─────────────────────────────────────────────────────────────────────
import MapScreen from '@/screens/map/MapScreen';

// ── Community ───────────────────────────────────────────────────────────────
import Feed        from '@/screens/community/Feed';
import Forum       from '@/screens/community/Forum';
import ForumDetail from '@/screens/community/ForumDetail';
import Restaurant  from '@/screens/community/Restaurant';
import CreatePost  from '@/screens/community/CreatePost';

// ── Events ──────────────────────────────────────────────────────────────────
import Events      from '@/screens/events/Events';
import EventDetail from '@/screens/events/EventDetail';
import Live        from '@/screens/events/Live';

// ── Courses ─────────────────────────────────────────────────────────────────
import Courses      from '@/screens/courses/Courses';
import CourseDetail from '@/screens/courses/CourseDetail';
import CoursePlayer from '@/screens/courses/CoursePlayer';

// ── Games ────────────────────────────────────────────────────────────────────
import Games   from '@/screens/games/Games';
import Quiz    from '@/screens/games/Quiz';
import Tombola from '@/screens/games/Tombola';
import Badges  from '@/screens/games/Badges';

// ── Profile ──────────────────────────────────────────────────────────────────
import ProfileScreen   from '@/screens/profile/ProfileScreen';
import FavoritesScreen from '@/screens/profile/FavoritesScreen';
import EditProfile     from '@/screens/profile/EditProfile';
import SettingsScreen  from '@/screens/profile/Settings';
import History         from '@/screens/profile/History';

// ── Payment ──────────────────────────────────────────────────────────────────
import Payment        from '@/screens/payment/Payment';
import PaymentSuccess from '@/screens/payment/PaymentSuccess';

// ── Order ────────────────────────────────────────────────────────────────────
import OrderMenu    from '@/screens/order/OrderMenu';
import OrderSummary from '@/screens/order/OrderSummary';
import OrderPayment from '@/screens/order/OrderPayment';
import OrderInvoice from '@/screens/order/OrderInvoice';
import OrderHistory from '@/screens/order/OrderHistory';

// ── Pro ──────────────────────────────────────────────────────────────────────
import UpgradePro          from '@/screens/pro/UpgradePro';
import ProDashboard        from '@/screens/pro/ProDashboard';
import RestaurantMenu      from '@/screens/pro/RestaurantMenu';
import RestaurantMenuEdit  from '@/screens/pro/RestaurantMenuEdit';
import ProRevenues         from '@/screens/pro/ProRevenues';
import ProFormationsList   from '@/screens/pro/ProFormationsList';
import ProFormationManage  from '@/screens/pro/ProFormationManage';
import ProMessages         from '@/screens/pro/ProMessages';
import ProMessageDetail    from '@/screens/pro/ProMessageDetail';
import ProPromos           from '@/screens/pro/ProPromos';
import ProAnalytics        from '@/screens/pro/ProAnalytics';
import ProSubscription     from '@/screens/pro/ProSubscription';
import ProPaymentSetup     from '@/screens/order/ProPaymentSetup';
import ProOrders           from '@/screens/order/ProOrders';
import ProOrderDetail      from '@/screens/order/ProOrderDetail';
import ProConfirmation     from '@/screens/pro/ProConfirmation';
import CreateEvent         from '@/screens/pro/CreateEvent';
import ManageEvent         from '@/screens/pro/ManageEvent';
import CreateCourse        from '@/screens/pro/CreateCourse';
import ManageCommunity     from '@/screens/pro/ManageCommunity';
import RestaurantPublicV4  from '@/screens/order/RestaurantPublicV4';

// ── Admin ────────────────────────────────────────────────────────────────────
import AdminLogin        from '@/screens/admin/AdminLogin';
import AdminDashboard    from '@/screens/admin/AdminDashboard';
import AdminDashUnified  from '@/screens/admin/AdminDashUnified';
import AdminUsers        from '@/screens/admin/AdminUsers';
import AdminUserDetail   from '@/screens/admin/AdminUserDetail';
import AdminModeration   from '@/screens/admin/AdminModeration';
import AdminEvents       from '@/screens/admin/AdminEvents';
import AdminTombola      from '@/screens/admin/AdminTombola';
import AdminFinance      from '@/screens/admin/AdminFinance';
import AdminSettings     from '@/screens/admin/AdminSettings';
import AdminLogs         from '@/screens/admin/AdminLogs';
import AdminProList      from '@/screens/admin/AdminProList';
import AdminProDetail    from '@/screens/admin/AdminProDetail';
import AdminPayouts      from '@/screens/admin/AdminPayouts';
import AdminPush         from '@/screens/admin/AdminPush';

// ── User V3 ──────────────────────────────────────────────────────────────────
import FoodJournal           from '@/screens/user_v3/FoodJournal';
import JournalStats          from '@/screens/user_v3/JournalStats';
import SearchByIngredients   from '@/screens/user_v3/SearchByIngredients';
import AccessibilitySettings from '@/screens/user_v3/AccessibilitySettings';
import SettingsProEntry      from '@/screens/user_v3/SettingsProEntry';
import SettingsProActive     from '@/screens/user_v3/SettingsProActive';
import ProfilePro            from '@/screens/user_v3/ProfilePro';
import HomeProAware          from '@/screens/user_v3/HomeProAware';

import { WFBottomNav } from '@/components/ui';
import type { TabName } from '@/components/ui';

const Tab = createBottomTabNavigator<AppTabParams>();
const HomeStack    = createNativeStackNavigator();
const ScannerStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function HomeStackNav() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      {/* ── Core ──────────────────────────────────────────────────── */}
      <HomeStack.Screen name="HomeScreen" component={HomeV1} />
      <HomeStack.Screen name="HomeV2"     component={HomeV2} />
      <HomeStack.Screen name="HomeV3"     component={HomeV3} />
      <HomeStack.Screen name="Onboarding"     component={Onboarding as React.ComponentType<Record<string, unknown>>} />
      <HomeStack.Screen name="SignupProAware" component={SignupProAware as React.ComponentType<Record<string, unknown>>} />
      <HomeStack.Screen name="Notifications" component={Notifications} />
      <HomeStack.Screen name="Feed"          component={Feed} />
      <HomeStack.Screen name="Forum"         component={Forum} />
      <HomeStack.Screen name="Events"        component={Events} />
      <HomeStack.Screen name="Courses"       component={Courses} />
      <HomeStack.Screen name="Games"         component={Games} />
      <HomeStack.Screen name="MapScreen"     component={MapScreen} />

      {/* ── Recherche (accessible via navigate depuis HomeStack) ────── */}
      <HomeStack.Screen name="Search"        component={Search} />

      {/* ── Scanner (Camera enregistré ici pour CTA Home) ──────────── */}
      <HomeStack.Screen name="Camera"        component={Camera} />
      <HomeStack.Screen name="AudioText"     component={AudioText} />
      <HomeStack.Screen name="Result"        component={ResultV1} />
      <HomeStack.Screen name="RecipeV1"      component={RecipeV1} />
      <HomeStack.Screen name="Recipe"        component={RecipeV1} />

      {/* ── Community sub-screens ───────────────────────────────────── */}
      <HomeStack.Screen name="Restaurant"    component={Restaurant} />
      <HomeStack.Screen name="ForumDetail"   component={ForumDetail} />
      <HomeStack.Screen name="CreatePost"    component={CreatePost} />

      {/* ── Events sub-screens ──────────────────────────────────────── */}
      <HomeStack.Screen name="EventDetail"   component={EventDetail} />
      <HomeStack.Screen name="Live"          component={Live} />

      {/* ── Courses sub-screens ─────────────────────────────────────── */}
      <HomeStack.Screen name="CourseDetail"  component={CourseDetail} />
      <HomeStack.Screen name="CoursePlayer"  component={CoursePlayer} />

      {/* ── Games sub-screens ───────────────────────────────────────── */}
      <HomeStack.Screen name="Quiz"          component={Quiz} />
      <HomeStack.Screen name="Tombola"       component={Tombola} />
      <HomeStack.Screen name="Badges"        component={Badges} />

      {/* ── Profile sub-screens ─────────────────────────────────────── */}
      <HomeStack.Screen name="EditProfile"   component={EditProfile} />
      <HomeStack.Screen name="Settings"      component={SettingsScreen} />
      <HomeStack.Screen name="History"       component={History} />

      {/* ── Payment ─────────────────────────────────────────────────── */}
      <HomeStack.Screen name="Payment"        component={Payment} />
      <HomeStack.Screen name="PaymentSuccess" component={PaymentSuccess} />

      {/* ── Order ───────────────────────────────────────────────────── */}
      <HomeStack.Screen name="OrderMenu"     component={OrderMenu} />
      <HomeStack.Screen name="OrderSummary"  component={OrderSummary} />
      <HomeStack.Screen name="OrderPayment"  component={OrderPayment} />
      <HomeStack.Screen name="OrderInvoice"  component={OrderInvoice} />
      <HomeStack.Screen name="OrderHistory"  component={OrderHistory} />

      {/* ── Pro ─────────────────────────────────────────────────────── */}
      <HomeStack.Screen name="UpgradePro"         component={UpgradePro} />
      <HomeStack.Screen name="ProDashboard"        component={ProDashboard} />
      <HomeStack.Screen name="RestaurantMenu"      component={RestaurantMenu} />
      <HomeStack.Screen name="RestaurantMenuEdit"  component={RestaurantMenuEdit} />
      <HomeStack.Screen name="ProRevenues"         component={ProRevenues} />
      <HomeStack.Screen name="ProFormationsList"   component={ProFormationsList} />
      <HomeStack.Screen name="ProFormationManage"  component={ProFormationManage} />
      <HomeStack.Screen name="ProMessages"         component={ProMessages} />
      <HomeStack.Screen name="ProMessageDetail"    component={ProMessageDetail} />
      <HomeStack.Screen name="ProPromos"           component={ProPromos} />
      <HomeStack.Screen name="ProAnalytics"        component={ProAnalytics} />
      <HomeStack.Screen name="ProSubscription"     component={ProSubscription} />
      <HomeStack.Screen name="ProPaymentSetup"     component={ProPaymentSetup} />
      <HomeStack.Screen name="ProOrders"           component={ProOrders} />
      <HomeStack.Screen name="ProOrderDetail"      component={ProOrderDetail} />
      <HomeStack.Screen name="ProConfirmation"     component={ProConfirmation} />
      <HomeStack.Screen name="CreateEvent"         component={CreateEvent} />
      <HomeStack.Screen name="ManageEvent"         component={ManageEvent} />
      <HomeStack.Screen name="CreateCourse"        component={CreateCourse} />
      <HomeStack.Screen name="ManageCommunity"     component={ManageCommunity} />
      <HomeStack.Screen name="RestaurantPublicV4"  component={RestaurantPublicV4} />

      {/* ── Admin ───────────────────────────────────────────────────── */}
      <HomeStack.Screen name="AdminLogin"       component={AdminLogin} />
      <HomeStack.Screen name="AdminDashboard"   component={AdminDashboard} />
      <HomeStack.Screen name="AdminDashUnified" component={AdminDashUnified} />
      <HomeStack.Screen name="AdminUsers"       component={AdminUsers} />
      <HomeStack.Screen name="AdminUserDetail"  component={AdminUserDetail} />
      <HomeStack.Screen name="AdminModeration"  component={AdminModeration} />
      <HomeStack.Screen name="AdminEvents"      component={AdminEvents} />
      <HomeStack.Screen name="AdminTombola"     component={AdminTombola} />
      <HomeStack.Screen name="AdminFinance"     component={AdminFinance} />
      <HomeStack.Screen name="AdminSettings"    component={AdminSettings} />
      <HomeStack.Screen name="AdminLogs"        component={AdminLogs} />
      <HomeStack.Screen name="AdminProList"     component={AdminProList} />
      <HomeStack.Screen name="AdminProDetail"   component={AdminProDetail} />
      <HomeStack.Screen name="AdminPayouts"     component={AdminPayouts} />
      <HomeStack.Screen name="AdminPush"        component={AdminPush} />

      {/* ── User V3 ─────────────────────────────────────────────────── */}
      <HomeStack.Screen name="FoodJournal"           component={FoodJournal} />
      <HomeStack.Screen name="JournalStats"          component={JournalStats} />
      <HomeStack.Screen name="SearchByIngredients"   component={SearchByIngredients} />
      <HomeStack.Screen name="AccessibilitySettings" component={AccessibilitySettings} />
      <HomeStack.Screen name="SettingsProEntry"      component={SettingsProEntry} />
      <HomeStack.Screen name="SettingsProActive"     component={SettingsProActive} />
      <HomeStack.Screen name="ProfilePro"            component={ProfilePro} />
      <HomeStack.Screen name="HomeProAware"          component={HomeProAware} />
    </HomeStack.Navigator>
  );
}

function ScannerStackNav() {
  return (
    <ScannerStack.Navigator screenOptions={{ headerShown: false }}>
      <ScannerStack.Screen name="Camera"     component={Camera} />
      <ScannerStack.Screen name="AudioText"  component={AudioText} />
      <ScannerStack.Screen name="Result"     component={ResultV1} />
      <ScannerStack.Screen name="Recipe"     component={RecipeV1} />
      <ScannerStack.Screen name="MapScreen"  component={MapScreen} />
      <ScannerStack.Screen name="Restaurant" component={Restaurant} />
    </ScannerStack.Navigator>
  );
}

function ProfileStackNav() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileScreen"   component={ProfileScreen} />
      <ProfileStack.Screen name="FavoritesScreen" component={FavoritesScreen} />
    </ProfileStack.Navigator>
  );
}

const TAB_NAMES: TabName[] = ['home', 'search', 'scanner', 'favorites', 'profile'];
const ROUTE_NAMES = ['HomeTab', 'SearchTab', 'ScannerTab', 'FavoritesTab', 'ProfileTab'];

export function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={({ navigation, state }) => (
        <WFBottomNav
          activeTab={TAB_NAMES[state.index] ?? 'home'}
          onTabPress={(tab) => {
            if (tab === 'pro') {
              navigation.navigate('HomeTab' as never);
              return;
            }
            const idx = TAB_NAMES.indexOf(tab);
            if (idx < 0) return;
            const routeName = ROUTE_NAMES[idx]!;
            const currentRoute = state.routes[state.index];
            const isAlreadyOnThisTab = currentRoute?.name === routeName;
            if (isAlreadyOnThisTab) {
              const innerKey = currentRoute.state?.key;
              if (innerKey) {
                navigation.dispatch({ ...StackActions.popToTop(), target: innerKey });
              }
              return;
            }
            navigation.navigate(routeName as never);
          }}
        />
      )}
    >
      <Tab.Screen name="HomeTab"      component={HomeStackNav} />
      <Tab.Screen name="SearchTab"    component={Search} />
      <Tab.Screen name="ScannerTab"   component={ScannerStackNav} />
      <Tab.Screen name="FavoritesTab" component={FavoritesScreen} />
      <Tab.Screen name="ProfileTab"   component={ProfileStackNav} />
    </Tab.Navigator>
  );
}
