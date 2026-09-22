// src/navigation/AppNavigator.tsx — Navigation complète KFL (phases 3–9 + sous-écrans)

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StackActions, getFocusedRouteNameFromRoute } from '@react-navigation/native';
import type { AppTabParams } from './types';
import { useAuthStore } from '@/store/auth.store';

// ── Core ────────────────────────────────────────────────────────────────────
import HomeV1        from '@/screens/home/HomeV1';
import HomeV2        from '@/screens/home/HomeV2';
import HomeV3        from '@/screens/home/HomeV3';
import Restos         from '@/screens/restaurants/Restos';
import VideoFeed       from '@/screens/videos/VideoFeed';
import VideoComments   from '@/screens/videos/VideoComments';
import CreateVideo     from '@/screens/videos/CreateVideo';
import StoriesViewer  from '@/screens/home/StoriesViewer';
import StoryCreatorCamera from '@/screens/home/StoryCreatorCamera';
import AddStory       from '@/screens/home/AddStory';
import AllRecipes     from '@/screens/home/AllRecipes';
import AllEvents      from '@/screens/home/AllEvents';
import AllStories     from '@/screens/home/AllStories';
import Search        from '@/screens/home/Search';
import Notifications from '@/screens/home/Notifications';

// ── Scanner ─────────────────────────────────────────────────────────────────
import ScannerHome from '@/screens/scanner/ScannerHome';
import Camera    from '@/screens/scanner/Camera';
import AudioText from '@/screens/scanner/AudioText';
import ResultV1  from '@/screens/scanner/ResultV1';
import RecipeV1  from '@/screens/scanner/RecipeV1';

// ── Auth (accessible depuis Settings pour replay) ────────────────────────────
import Onboarding      from '@/screens/auth/Onboarding';
import SignupProAware  from '@/screens/auth/SignupProAware';

// ── Map ─────────────────────────────────────────────────────────────────────
import MapScreen from '@/screens/map/MapScreen';

// ── Messagerie ──────────────────────────────────────────────────────────────
import ConversationsList from '@/screens/messages/ConversationsList';
import ChatThread from '@/screens/messages/ChatThread';

// ── Community ───────────────────────────────────────────────────────────────
import Feed        from '@/screens/community/Feed';
import Forum       from '@/screens/community/Forum';
import ForumDetail from '@/screens/community/ForumDetail';
import CreateThread from '@/screens/community/CreateThread';
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
import Games          from '@/screens/games/Games';
import Quiz           from '@/screens/games/Quiz';
import Tombola        from '@/screens/games/Tombola';
import Badges         from '@/screens/games/Badges';
import SpeedChallenge from '@/screens/games/SpeedChallenge';
import LeaderboardFull from '@/screens/games/LeaderboardFull';

// ── Profile ──────────────────────────────────────────────────────────────────
import ProfileScreen   from '@/screens/profile/ProfileScreen';
import FavoritesScreen from '@/screens/profile/FavoritesScreen';
import EditProfile     from '@/screens/profile/EditProfile';
import SettingsScreen  from '@/screens/profile/Settings';
import History         from '@/screens/profile/History';
import HistoryStoriesViewer from '@/screens/profile/HistoryStoriesViewer';
import ChangePassword  from '@/screens/profile/ChangePassword';
import PrivacySettings from '@/screens/profile/PrivacySettings';
import LanguagePicker  from '@/screens/profile/LanguagePicker';
import ThemePicker     from '@/screens/profile/ThemePicker';
import AboutKFL        from '@/screens/profile/AboutKFL';
import FAQScreen       from '@/screens/profile/FAQScreen';
import TermsScreen     from '@/screens/profile/TermsScreen';

// ── Payment ──────────────────────────────────────────────────────────────────
import Payment              from '@/screens/payment/Payment';
import PaymentSuccess       from '@/screens/payment/PaymentSuccess';
import WalletScreen         from '@/screens/payment/WalletScreen';
import TransactionHistory   from '@/screens/payment/TransactionHistory';
import MobileMoneyConfirm   from '@/screens/payment/MobileMoneyConfirm';

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
import ProRegistration     from '@/screens/pro/ProRegistration';
import ProCreateHub        from '@/screens/pro/ProCreateHub';
import ProOffers           from '@/screens/pro/ProOffers';
import CreateEvent         from '@/screens/pro/CreateEvent';
import ManageEvent         from '@/screens/pro/ManageEvent';
import EventAttendees      from '@/screens/pro/EventAttendees';
import MessageAttendees    from '@/screens/pro/MessageAttendees';
import EventStats          from '@/screens/pro/EventStats';
import CreateCourse        from '@/screens/pro/CreateCourse';
import ManageCommunity     from '@/screens/pro/ManageCommunity';

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
import JournalStoriesViewer  from '@/screens/user_v3/JournalStoriesViewer';
import SearchByIngredients   from '@/screens/user_v3/SearchByIngredients';
import AccessibilitySettings from '@/screens/user_v3/AccessibilitySettings';
import SettingsProEntry      from '@/screens/user_v3/SettingsProEntry';
import SettingsProActive     from '@/screens/user_v3/SettingsProActive';
import ProfilePro            from '@/screens/user_v3/ProfilePro';
import HomeProAware          from '@/screens/user_v3/HomeProAware';

import { WFBottomNav, WFProBottomNav } from '@/components/ui';
import type { TabName, ProTabName } from '@/components/ui';
import { resetTabBarVisibility } from './tabBarScroll';

const Tab = createBottomTabNavigator<AppTabParams>();
const HomeStack    = createNativeStackNavigator();
const RestoStack   = createNativeStackNavigator();
const ScannerStack = createNativeStackNavigator();
const VideoStack   = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();
const DashStack    = createNativeStackNavigator();
const OrdersStack  = createNativeStackNavigator();
const CreateStack  = createNativeStackNavigator();
const OffersStack  = createNativeStackNavigator();
const PageStack    = createNativeStackNavigator();

function HomeStackNav() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      {/* ── Core ──────────────────────────────────────────────────── */}
      <HomeStack.Screen name="HomeScreen" component={HomeV1} />
      <HomeStack.Screen name="HomeV2"     component={HomeV2} />
      <HomeStack.Screen name="HomeV3"     component={HomeV3} />
      <HomeStack.Screen name="StoriesViewer" component={StoriesViewer} />
      <HomeStack.Screen name="StoryCreatorCamera" component={StoryCreatorCamera} />
      <HomeStack.Screen name="AddStory"      component={AddStory} />
      <HomeStack.Screen name="AllRecipes"    component={AllRecipes} />
      <HomeStack.Screen name="AllEvents"     component={AllEvents} />
      <HomeStack.Screen name="AllStories"    component={AllStories} />
      <HomeStack.Screen name="Onboarding"     component={Onboarding as React.ComponentType<Record<string, unknown>>} />
      <HomeStack.Screen name="SignupProAware" component={SignupProAware as React.ComponentType<Record<string, unknown>>} />
      <HomeStack.Screen name="Notifications" component={Notifications} />
      <HomeStack.Screen name="Feed"          component={Feed} />
      <HomeStack.Screen name="Forum"         component={Forum} />
      <HomeStack.Screen name="Events"        component={Events} />
      <HomeStack.Screen name="Courses"       component={Courses} />
      <HomeStack.Screen name="Games"         component={Games} />
      <HomeStack.Screen name="MapScreen"     component={MapScreen} />

      {/* ── Messagerie ────────────────────────────────────────────── */}
      <HomeStack.Screen name="ConversationsList" component={ConversationsList} />
      <HomeStack.Screen name="ChatThread"        component={ChatThread} />

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
      <HomeStack.Screen name="CreateThread"  component={CreateThread} />
      <HomeStack.Screen name="CreatePost"    component={CreatePost} />

      {/* ── Events sub-screens ──────────────────────────────────────── */}
      <HomeStack.Screen name="EventDetail"   component={EventDetail} />
      <HomeStack.Screen name="Live"          component={Live} />

      {/* ── Courses sub-screens ─────────────────────────────────────── */}
      <HomeStack.Screen name="CourseDetail"  component={CourseDetail} />
      <HomeStack.Screen name="CoursePlayer"  component={CoursePlayer} />

      {/* ── Games sub-screens ───────────────────────────────────────── */}
      <HomeStack.Screen name="Quiz"            component={Quiz} />
      <HomeStack.Screen name="Tombola"         component={Tombola} />
      <HomeStack.Screen name="Badges"          component={Badges} />
      <HomeStack.Screen name="SpeedChallenge"  component={SpeedChallenge} />
      <HomeStack.Screen name="LeaderboardFull" component={LeaderboardFull} />

      {/* ── Profile sub-screens ─────────────────────────────────────── */}
      <HomeStack.Screen name="EditProfile"      component={EditProfile} />
      <HomeStack.Screen name="Settings"         component={SettingsScreen} />
      <HomeStack.Screen name="History"          component={History} />
      <HomeStack.Screen name="HistoryStoriesViewer" component={HistoryStoriesViewer} />
      <HomeStack.Screen name="ChangePassword"   component={ChangePassword} />
      <HomeStack.Screen name="PrivacySettings"  component={PrivacySettings} />
      <HomeStack.Screen name="LanguagePicker"   component={LanguagePicker} />
      <HomeStack.Screen name="AboutKFL"         component={AboutKFL} />
      <HomeStack.Screen name="FAQScreen"        component={FAQScreen} />
      <HomeStack.Screen name="TermsScreen"      component={TermsScreen} />

      {/* ── Payment ─────────────────────────────────────────────────── */}
      <HomeStack.Screen name="Payment"              component={Payment} />
      <HomeStack.Screen name="PaymentSuccess"       component={PaymentSuccess} />
      <HomeStack.Screen name="WalletScreen"         component={WalletScreen} />
      <HomeStack.Screen name="TransactionHistory"   component={TransactionHistory} />
      <HomeStack.Screen name="MobileMoneyConfirm"   component={MobileMoneyConfirm} />

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
      <HomeStack.Screen name="ProRegistration"     component={ProRegistration} />
      <HomeStack.Screen name="CreateEvent"         component={CreateEvent} />
      <HomeStack.Screen name="ManageEvent"         component={ManageEvent} />
      <HomeStack.Screen name="EventAttendees"      component={EventAttendees} />
      <HomeStack.Screen name="MessageAttendees"    component={MessageAttendees} />
      <HomeStack.Screen name="EventStats"          component={EventStats} />
      <HomeStack.Screen name="CreateCourse"        component={CreateCourse} />
      <HomeStack.Screen name="ManageCommunity"     component={ManageCommunity} />

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
      <HomeStack.Screen name="JournalStoriesViewer"  component={JournalStoriesViewer} />
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
      <ScannerStack.Screen name="ScannerHome" component={ScannerHome} />
      <ScannerStack.Screen name="Camera"     component={Camera} />
      <ScannerStack.Screen name="AudioText"  component={AudioText} />
      <ScannerStack.Screen name="Result"     component={ResultV1} />
      <ScannerStack.Screen name="Recipe"     component={RecipeV1} />
      <ScannerStack.Screen name="MapScreen"  component={MapScreen} />
      <ScannerStack.Screen name="Restaurant" component={Restaurant} />
      <ScannerStack.Screen name="CreatePost" component={CreatePost} />
      <ScannerStack.Screen name="ChatThread" component={ChatThread} />
    </ScannerStack.Navigator>
  );
}

function RestoStackNav() {
  return (
    <RestoStack.Navigator screenOptions={{ headerShown: false }}>
      <RestoStack.Screen name="Restos"       component={Restos} />
      <RestoStack.Screen name="Restaurant"   component={Restaurant} />
      <RestoStack.Screen name="OrderMenu"    component={OrderMenu} />
      <RestoStack.Screen name="OrderSummary" component={OrderSummary} />
      <RestoStack.Screen name="OrderPayment" component={OrderPayment} />
      <RestoStack.Screen name="OrderInvoice" component={OrderInvoice} />
      <RestoStack.Screen name="OrderHistory" component={OrderHistory} />
      <RestoStack.Screen name="MapScreen"    component={MapScreen} />
      <RestoStack.Screen name="ChatThread"   component={ChatThread} />
    </RestoStack.Navigator>
  );
}

function VideoStackNav() {
  return (
    <VideoStack.Navigator screenOptions={{ headerShown: false }}>
      <VideoStack.Screen name="VideoFeed"     component={VideoFeed} />
      <VideoStack.Screen name="VideoComments" component={VideoComments} options={{ presentation: 'modal' }} />
      <VideoStack.Screen name="CreateVideo"   component={CreateVideo} options={{ presentation: 'modal' }} />
      <VideoStack.Screen name="CourseDetail"  component={CourseDetail} />
      <VideoStack.Screen name="EventDetail"   component={EventDetail} />
      <VideoStack.Screen name="WalletScreen"  component={WalletScreen} />
    </VideoStack.Navigator>
  );
}

function ProfileStackNav() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      {/* ── Root ──────────────────────────────────────────────────── */}
      <ProfileStack.Screen name="ProfileScreen"      component={ProfileScreen} />
      <ProfileStack.Screen name="FavoritesScreen"    component={FavoritesScreen} />
      <ProfileStack.Screen name="EditProfile"        component={EditProfile} />
      <ProfileStack.Screen name="Settings"           component={SettingsScreen} />
      <ProfileStack.Screen name="History"            component={History} />
      <ProfileStack.Screen name="HistoryStoriesViewer" component={HistoryStoriesViewer} />

      {/* ── Settings sub-screens ──────────────────────────────────── */}
      <ProfileStack.Screen name="ChangePassword"     component={ChangePassword} />
      <ProfileStack.Screen name="PrivacySettings"    component={PrivacySettings} />
      <ProfileStack.Screen name="LanguagePicker"     component={LanguagePicker} />
      <ProfileStack.Screen name="ThemePicker"        component={ThemePicker} />
      <ProfileStack.Screen name="AboutKFL"           component={AboutKFL} />
      <ProfileStack.Screen name="FAQScreen"          component={FAQScreen} />
      <ProfileStack.Screen name="TermsScreen"        component={TermsScreen} />
      <ProfileStack.Screen name="AccessibilitySettings" component={AccessibilitySettings} />
      <ProfileStack.Screen name="FoodJournal"        component={FoodJournal} />
      <ProfileStack.Screen name="JournalStats"       component={JournalStats} />
      <ProfileStack.Screen name="JournalStoriesViewer" component={JournalStoriesViewer} />

      {/* ── Wallet & payment reachable from Profile ────────────────── */}
      <ProfileStack.Screen name="WalletScreen"       component={WalletScreen} />
      <ProfileStack.Screen name="TransactionHistory" component={TransactionHistory} />
      <ProfileStack.Screen name="Payment"            component={Payment} />
      <ProfileStack.Screen name="PaymentSuccess"     component={PaymentSuccess} />
      <ProfileStack.Screen name="MobileMoneyConfirm" component={MobileMoneyConfirm} />

      {/* ── Admin reachable from Profile ─────────────────────────── */}
      <ProfileStack.Screen name="AdminLogin"         component={AdminLogin} />
      <ProfileStack.Screen name="AdminDashboard"     component={AdminDashboard} />
      <ProfileStack.Screen name="AdminDashUnified"   component={AdminDashUnified} />
      <ProfileStack.Screen name="AdminUsers"         component={AdminUsers} />
      <ProfileStack.Screen name="AdminUserDetail"    component={AdminUserDetail} />
      <ProfileStack.Screen name="AdminModeration"    component={AdminModeration} />
      <ProfileStack.Screen name="AdminEvents"        component={AdminEvents} />
      <ProfileStack.Screen name="AdminTombola"       component={AdminTombola} />
      <ProfileStack.Screen name="AdminFinance"       component={AdminFinance} />
      <ProfileStack.Screen name="AdminSettings"      component={AdminSettings} />
      <ProfileStack.Screen name="AdminLogs"          component={AdminLogs} />
      <ProfileStack.Screen name="AdminProList"       component={AdminProList} />
      <ProfileStack.Screen name="AdminProDetail"     component={AdminProDetail} />
      <ProfileStack.Screen name="AdminPayouts"       component={AdminPayouts} />
      <ProfileStack.Screen name="AdminPush"          component={AdminPush} />

      {/* ── Pro reachable from Profile ────────────────────────────── */}
      <ProfileStack.Screen name="UpgradePro"         component={UpgradePro} />
      <ProfileStack.Screen name="ProRegistration"    component={ProRegistration} />
      <ProfileStack.Screen name="ProDashboard"       component={ProDashboard} />
      <ProfileStack.Screen name="SettingsProEntry"   component={SettingsProEntry} />
      <ProfileStack.Screen name="SettingsProActive"  component={SettingsProActive} />
      <ProfileStack.Screen name="ProfilePro"         component={ProfilePro} />
      <ProfileStack.Screen name="Badges"             component={Badges} />
      <ProfileStack.Screen name="RestaurantMenu"     component={RestaurantMenu} />
      <ProfileStack.Screen name="RestaurantMenuEdit" component={RestaurantMenuEdit} />
      <ProfileStack.Screen name="ProRevenues"        component={ProRevenues} />
      <ProfileStack.Screen name="ProFormationsList"  component={ProFormationsList} />
      <ProfileStack.Screen name="ProFormationManage" component={ProFormationManage} />
      <ProfileStack.Screen name="ProMessages"        component={ProMessages} />
      <ProfileStack.Screen name="ProMessageDetail"   component={ProMessageDetail} />
      <ProfileStack.Screen name="ProPromos"          component={ProPromos} />
      <ProfileStack.Screen name="ProAnalytics"       component={ProAnalytics} />
      <ProfileStack.Screen name="ProSubscription"    component={ProSubscription} />
      <ProfileStack.Screen name="ProPaymentSetup"    component={ProPaymentSetup} />
      <ProfileStack.Screen name="ProOrders"          component={ProOrders} />
      <ProfileStack.Screen name="ProOrderDetail"     component={ProOrderDetail} />
      <ProfileStack.Screen name="ProConfirmation"    component={ProConfirmation} />
      <ProfileStack.Screen name="CreateEvent"        component={CreateEvent} />
      <ProfileStack.Screen name="ManageEvent"        component={ManageEvent} />
      <ProfileStack.Screen name="EventAttendees"     component={EventAttendees} />
      <ProfileStack.Screen name="MessageAttendees"   component={MessageAttendees} />
      <ProfileStack.Screen name="EventStats"         component={EventStats} />
      <ProfileStack.Screen name="CreateCourse"       component={CreateCourse} />
      <ProfileStack.Screen name="ManageCommunity"    component={ManageCommunity} />
      <ProfileStack.Screen name="OrderMenu"          component={OrderMenu} />
      <ProfileStack.Screen name="OrderSummary"       component={OrderSummary} />
      <ProfileStack.Screen name="OrderPayment"       component={OrderPayment} />
      <ProfileStack.Screen name="OrderInvoice"       component={OrderInvoice} />
      <ProfileStack.Screen name="OrderHistory"       component={OrderHistory} />
      <ProfileStack.Screen name="Restaurant"         component={Restaurant} />
      <ProfileStack.Screen name="Courses"            component={Courses} />
      <ProfileStack.Screen name="CourseDetail"       component={CourseDetail} />
      <ProfileStack.Screen name="CoursePlayer"       component={CoursePlayer} />
      <ProfileStack.Screen name="Events"             component={Events} />
      <ProfileStack.Screen name="EventDetail"        component={EventDetail} />
      <ProfileStack.Screen name="Recipe"             component={RecipeV1} />
      <ProfileStack.Screen name="ChatThread"         component={ChatThread} />
      <ProfileStack.Screen name="ConversationsList"  component={ConversationsList} />
      <ProfileStack.Screen name="Forum"              component={Forum} />
      <ProfileStack.Screen name="AllRecipes"         component={AllRecipes} />
    </ProfileStack.Navigator>
  );
}

// ── Compte Pro — 5 stacks indépendantes, une par onglet ──────────────────────
function DashStackNav() {
  return (
    <DashStack.Navigator screenOptions={{ headerShown: false }}>
      <DashStack.Screen name="ProDashboard"       component={ProDashboard} />
      <DashStack.Screen name="RestaurantMenu"     component={RestaurantMenu} />
      <DashStack.Screen name="RestaurantMenuEdit" component={RestaurantMenuEdit} />
      <DashStack.Screen name="ProOrders"          component={ProOrders} />
      <DashStack.Screen name="ProOffers"          component={ProOffers} />
      <DashStack.Screen name="ProRevenues"        component={ProRevenues} />
      <DashStack.Screen name="ProAnalytics"       component={ProAnalytics} />
      <DashStack.Screen name="ProMessages"        component={ProMessages} />
      <DashStack.Screen name="ProMessageDetail"   component={ProMessageDetail} />
      <DashStack.Screen name="ProSubscription"    component={ProSubscription} />
      <DashStack.Screen name="ProPaymentSetup"    component={ProPaymentSetup} />
      <DashStack.Screen name="ProOrderDetail"     component={ProOrderDetail} />
      <DashStack.Screen name="ManageCommunity"    component={ManageCommunity} />
      <DashStack.Screen name="ManageEvent"        component={ManageEvent} />
      <DashStack.Screen name="EventAttendees"     component={EventAttendees} />
      <DashStack.Screen name="MessageAttendees"   component={MessageAttendees} />
      <DashStack.Screen name="EventStats"         component={EventStats} />
      <DashStack.Screen name="SettingsProActive"  component={SettingsProActive} />
      <DashStack.Screen name="ProCreateHub"       component={ProCreateHub} />
      <DashStack.Screen name="CreatePost"         component={CreatePost} />
      <DashStack.Screen name="CreateEvent"        component={CreateEvent} />
      <DashStack.Screen name="CreateCourse"       component={CreateCourse} />
      <DashStack.Screen name="CreateVideo"        component={CreateVideo} />
    </DashStack.Navigator>
  );
}

function OrdersStackNav() {
  return (
    <OrdersStack.Navigator screenOptions={{ headerShown: false }}>
      <OrdersStack.Screen name="ProOrders"      component={ProOrders} />
      <OrdersStack.Screen name="ProOrderDetail" component={ProOrderDetail} />
    </OrdersStack.Navigator>
  );
}

function CreateStackNav() {
  return (
    <CreateStack.Navigator screenOptions={{ headerShown: false }}>
      <CreateStack.Screen name="ProCreateHub"       component={ProCreateHub} />
      <CreateStack.Screen name="CreatePost"         component={CreatePost} />
      <CreateStack.Screen name="CreateEvent"        component={CreateEvent} />
      <CreateStack.Screen name="CreateCourse"       component={CreateCourse} />
      <CreateStack.Screen name="CreateVideo"        component={CreateVideo} />
      <CreateStack.Screen name="ProPromos"          component={ProPromos} />
      <CreateStack.Screen name="RestaurantMenuEdit" component={RestaurantMenuEdit} />
      <CreateStack.Screen name="RestaurantMenu"     component={RestaurantMenu} />
    </CreateStack.Navigator>
  );
}

function OffersStackNav() {
  return (
    <OffersStack.Navigator screenOptions={{ headerShown: false }}>
      <OffersStack.Screen name="ProOffers"          component={ProOffers} />
      <OffersStack.Screen name="ProFormationsList"  component={ProFormationsList} />
      <OffersStack.Screen name="ProFormationManage" component={ProFormationManage} />
      <OffersStack.Screen name="ManageEvent"        component={ManageEvent} />
      <OffersStack.Screen name="EventAttendees"     component={EventAttendees} />
      <OffersStack.Screen name="MessageAttendees"   component={MessageAttendees} />
      <OffersStack.Screen name="EventStats"         component={EventStats} />
      <OffersStack.Screen name="CreateEvent"        component={CreateEvent} />
      <OffersStack.Screen name="CreateCourse"       component={CreateCourse} />
      <OffersStack.Screen name="ProCreateHub"       component={ProCreateHub} />
    </OffersStack.Navigator>
  );
}

function PageStackNav() {
  return (
    <PageStack.Navigator screenOptions={{ headerShown: false }}>
      <PageStack.Screen name="ProfilePro"         component={ProfilePro} />
      <PageStack.Screen name="EditProfile"        component={EditProfile} />
      <PageStack.Screen name="Settings"           component={SettingsScreen} />
      <PageStack.Screen name="SettingsProActive"  component={SettingsProActive} />
      <PageStack.Screen name="ProPromos"          component={ProPromos} />
      <PageStack.Screen name="ProSubscription"    component={ProSubscription} />
      <PageStack.Screen name="ProRevenues"        component={ProRevenues} />
      <PageStack.Screen name="RestaurantMenu"     component={RestaurantMenu} />
      <PageStack.Screen name="RestaurantMenuEdit" component={RestaurantMenuEdit} />
      <PageStack.Screen name="Badges"             component={Badges} />
      <PageStack.Screen name="WalletScreen"       component={WalletScreen} />
      <PageStack.Screen name="Payment"             component={Payment} />
      <PageStack.Screen name="TransactionHistory"  component={TransactionHistory} />
      <PageStack.Screen name="ConversationsList"  component={ConversationsList} />
      <PageStack.Screen name="ChatThread"         component={ChatThread} />
      <PageStack.Screen name="ProMessages"        component={ProMessages} />
      <PageStack.Screen name="ProMessageDetail"   component={ProMessageDetail} />
      <PageStack.Screen name="CreateEvent"        component={CreateEvent} />
      <PageStack.Screen name="ManageEvent"        component={ManageEvent} />
      <PageStack.Screen name="EventAttendees"     component={EventAttendees} />
      <PageStack.Screen name="MessageAttendees"   component={MessageAttendees} />
      <PageStack.Screen name="EventStats"         component={EventStats} />
      <PageStack.Screen name="ProFormationsList"  component={ProFormationsList} />
      <PageStack.Screen name="ProFormationManage" component={ProFormationManage} />
      <PageStack.Screen name="CreateCourse"       component={CreateCourse} />
      <PageStack.Screen name="ScannerHome"        component={ScannerHome} />
      <PageStack.Screen name="Camera"              component={Camera} />
      <PageStack.Screen name="AudioText"           component={AudioText} />
      <PageStack.Screen name="Result"              component={ResultV1} />
      <PageStack.Screen name="Recipe"              component={RecipeV1} />
      <PageStack.Screen name="MapScreen"            component={MapScreen} />
      <PageStack.Screen name="Restaurant"           component={Restaurant} />
      <PageStack.Screen name="CreatePost"           component={CreatePost} />
      <PageStack.Screen name="StoryCreatorCamera"   component={StoryCreatorCamera} />
      <PageStack.Screen name="AddStory"             component={AddStory} />
    </PageStack.Navigator>
  );
}

// Compte standard : 5 icônes nues (fil Instagram-like) — voir WFBottomNav.
const TAB_NAMES_STANDARD: TabName[] = ['home', 'resto', 'scan', 'video', 'profile'];
const ROUTE_NAMES_STANDARD = ['HomeTab', 'RestoTab', 'ScanTab', 'VideoTab', 'ProfileTab'];

// Compte Pro : barre distincte avec labels — voir WFProBottomNav.
const TAB_NAMES_PRO: ProTabName[] = ['dash', 'orders', 'create', 'offers', 'page'];
const ROUTE_NAMES_PRO = ['DashTab', 'OrdersTab', 'CreateTab', 'OffersTab', 'PageTab'];

// Écran racine de chaque onglet — la barre ne s'affiche que là. Dès qu'on
// pousse un écran par-dessus (Settings, EditProfile, ProDashboard...), cet
// écran a son propre bouton retour dans son en-tête, donc la barre de menu
// flottante n'a plus sa place par-dessus.
const TAB_ROOT_SCREEN: Record<string, string> = {
  HomeTab: 'HomeScreen',
  RestoTab: 'Restos',
  ScanTab: 'ScannerHome',
  VideoTab: 'VideoFeed',
  ProfileTab: 'ProfileScreen',
  DashTab: 'ProDashboard',
  OrdersTab: 'ProOrders',
  CreateTab: 'ProCreateHub',
  OffersTab: 'ProOffers',
  PageTab: 'ProfilePro',
};

export function AppNavigator() {
  const isPro = useAuthStore((s) => s.user?.role === 'pro');
  const avatarUri = useAuthStore((s) => s.user?.avatar);

  if (isPro) {
    return (
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={({ navigation, state }) => {
          const activeRoute = state.routes[state.index];
          const focusedRouteName = getFocusedRouteNameFromRoute(activeRoute);
          const expectedRoot = TAB_ROOT_SCREEN[activeRoute.name];
          const isAtTabRoot = focusedRouteName === undefined || focusedRouteName === expectedRoot;
          if (!isAtTabRoot) return null;
          const ordersBadge = 0;
          return (
            <WFProBottomNav
              activeTab={(TAB_NAMES_PRO[state.index] ?? 'dash')}
              ordersBadge={ordersBadge}
              onTabPress={(tab) => {
                resetTabBarVisibility();
                const idx = TAB_NAMES_PRO.indexOf(tab);
                if (idx < 0) return;
                const routeName = ROUTE_NAMES_PRO[idx]!;
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
          );
        }}
      >
        <Tab.Screen name="DashTab"   component={DashStackNav} />
        <Tab.Screen name="OrdersTab" component={OrdersStackNav} />
        <Tab.Screen name="CreateTab" component={CreateStackNav} />
        <Tab.Screen name="OffersTab" component={OffersStackNav} />
        <Tab.Screen name="PageTab"   component={PageStackNav} />
      </Tab.Navigator>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={({ navigation, state }) => {
        const activeRoute = state.routes[state.index];
        // Le Scanner occupe tout l'écran, façon Claude — jamais de barre de
        // menu par-dessus, y compris sur son écran racine.
        if (activeRoute.name === 'ScanTab') return null;
        const focusedRouteName = getFocusedRouteNameFromRoute(activeRoute);
        const expectedRoot = TAB_ROOT_SCREEN[activeRoute.name];
        const isAtTabRoot = focusedRouteName === undefined || focusedRouteName === expectedRoot;
        if (!isAtTabRoot) return null;
        return (
          <WFBottomNav
            activeTab={TAB_NAMES_STANDARD[state.index] ?? 'home'}
            avatarUri={avatarUri}
            onTabPress={(tab) => {
              // Le nouvel onglet démarre en haut de son contenu : la barre ne
              // doit pas rester cachée à cause du défilement de l'onglet précédent.
              resetTabBarVisibility();
              const idx = TAB_NAMES_STANDARD.indexOf(tab);
              if (idx < 0) return;
              const routeName = ROUTE_NAMES_STANDARD[idx]!;
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
        );
      }}
    >
      <Tab.Screen name="HomeTab"    component={HomeStackNav} />
      <Tab.Screen name="RestoTab"   component={RestoStackNav} />
      <Tab.Screen name="ScanTab"    component={ScannerStackNav} />
      <Tab.Screen name="VideoTab"   component={VideoStackNav} />
      <Tab.Screen name="ProfileTab" component={ProfileStackNav} />
    </Tab.Navigator>
  );
}
