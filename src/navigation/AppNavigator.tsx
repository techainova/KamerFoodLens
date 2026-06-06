// src/navigation/AppNavigator.tsx — Navigation complete phases 3 a 7

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AppTabParams } from './types';

import HomeV1        from '@/screens/home/HomeV1';
import Search        from '@/screens/home/Search';
import Notifications from '@/screens/home/Notifications';
import Camera    from '@/screens/scanner/Camera';
import AudioText from '@/screens/scanner/AudioText';
import ResultV1  from '@/screens/scanner/ResultV1';
import RecipeV1  from '@/screens/scanner/RecipeV1';
import MapScreen from '@/screens/map/MapScreen';
import Feed  from '@/screens/community/Feed';
import Forum from '@/screens/community/Forum';
import Events  from '@/screens/events/Events';
import Courses from '@/screens/courses/Courses';
import Games   from '@/screens/games/Games';
import ProfileScreen   from '@/screens/profile/ProfileScreen';
import FavoritesScreen from '@/screens/profile/FavoritesScreen';
import UpgradePro   from '@/screens/pro/UpgradePro';
import ProDashboard from '@/screens/pro/ProDashboard';
import OrderMenu    from '@/screens/order/OrderMenu';
import OrderInvoice from '@/screens/order/OrderInvoice';
import AdminLogin     from '@/screens/admin/AdminLogin';
import AdminDashboard from '@/screens/admin/AdminDashboard';
import AdminUsers     from '@/screens/admin/AdminUsers';
import AdminProList   from '@/screens/admin/AdminProList';
import AdminPayouts   from '@/screens/admin/AdminPayouts';
import AdminPush      from '@/screens/admin/AdminPush';

import { WFBottomNav } from '@/components/ui';
import type { TabName } from '@/components/ui';

const Tab = createBottomTabNavigator<AppTabParams>();
const HomeStack    = createNativeStackNavigator();
const ScannerStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

function HomeStackNav() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeScreen"     component={HomeV1} />
      <HomeStack.Screen name="Notifications"  component={Notifications} />
      <HomeStack.Screen name="Feed"           component={Feed} />
      <HomeStack.Screen name="Forum"          component={Forum} />
      <HomeStack.Screen name="Events"         component={Events} />
      <HomeStack.Screen name="Courses"        component={Courses} />
      <HomeStack.Screen name="Games"          component={Games} />
      <HomeStack.Screen name="MapScreen"      component={MapScreen} />
      <HomeStack.Screen name="UpgradePro"     component={UpgradePro} />
      <HomeStack.Screen name="ProDashboard"   component={ProDashboard} />
      <HomeStack.Screen name="OrderMenu"      component={OrderMenu} />
      <HomeStack.Screen name="OrderInvoice"   component={OrderInvoice} />
      <HomeStack.Screen name="AdminLogin"     component={AdminLogin} />
      <HomeStack.Screen name="AdminDashboard" component={AdminDashboard} />
      <HomeStack.Screen name="AdminUsers"     component={AdminUsers} />
      <HomeStack.Screen name="AdminProList"   component={AdminProList} />
      <HomeStack.Screen name="AdminPayouts"   component={AdminPayouts} />
      <HomeStack.Screen name="AdminPush"      component={AdminPush} />
    </HomeStack.Navigator>
  );
}

function ScannerStackNav() {
  return (
    <ScannerStack.Navigator screenOptions={{ headerShown: false }}>
      <ScannerStack.Screen name="Camera"    component={Camera} />
      <ScannerStack.Screen name="AudioText" component={AudioText} />
      <ScannerStack.Screen name="Result"    component={ResultV1} />
      <ScannerStack.Screen name="Recipe"    component={RecipeV1} />
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
            const idx = TAB_NAMES.indexOf(tab);
            if (idx >= 0) navigation.navigate(ROUTE_NAMES[idx]);
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
