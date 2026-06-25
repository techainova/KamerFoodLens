// App.tsx — KmerFoodLens v4.0
import '@/i18n';
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_700Bold,
} from '@expo-google-fonts/playfair-display';
import {
  JetBrainsMono_400Regular,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';

import { useAuthStore } from '@/store/auth.store';
import Splash     from '@/screens/auth/Splash';
import Onboarding from '@/screens/auth/Onboarding';
import Login      from '@/screens/auth/Login';
import Signup     from '@/screens/auth/Signup';
import OTP        from '@/screens/auth/OTP';
import { AppNavigator } from '@/navigation/AppNavigator';
import type { RootStackParamList } from '@/navigation/types';

const Stack  = createNativeStackNavigator<RootStackParamList>();
const client = new QueryClient();

function RootNavigator() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="App" component={AppNavigator} />
        ) : (
          <>
            <Stack.Screen name="Splash"     component={Splash}     options={{ animation: 'fade' }} />
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="Login"      component={Login} />
            <Stack.Screen name="Signup"     component={Signup} />
            <Stack.Screen name="OTP"        component={OTP as any} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    'Inter-Regular':              Inter_400Regular,
    'Inter-Medium':               Inter_500Medium,
    'Inter-SemiBold':             Inter_600SemiBold,
    'Inter-Bold':                 Inter_700Bold,
    'PlusJakartaSans-SemiBold':   PlusJakartaSans_600SemiBold,
    'PlusJakartaSans-Bold':       PlusJakartaSans_700Bold,
    'PlusJakartaSans-ExtraBold':  PlusJakartaSans_800ExtraBold,
    'PlayfairDisplay-Regular':    PlayfairDisplay_400Regular,
    'PlayfairDisplay-Bold':       PlayfairDisplay_700Bold,
    'JetBrainsMono-Regular':      JetBrainsMono_400Regular,
    'JetBrainsMono-Bold':         JetBrainsMono_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0D2B6E' }}>
        <ActivityIndicator color="#FFFFFF" size="large" />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <QueryClientProvider client={client}>
          <RootNavigator />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
