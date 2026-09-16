// src/navigation/RootNavigator.tsx
// Racine unique : l'app (onglets) est toujours montée — on parcourt en invité
// par défaut. Les écrans d'auth sont enregistrés une seule fois ici, en modal,
// et atteignables depuis n'importe quel écran imbriqué via navigation.navigate
// ('Login'|'SignupProAware'|'OTP') — voir useAuthGate.ts pour le point d'entrée unique.

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuthStore } from '@/store/auth.store';
import { AppNavigator } from './AppNavigator';
import { navigationRef } from './navigationRef';
import type { RootStackParamList } from './types';

const SplashScreen           = React.lazy(() => import('@/screens/auth/Splash'));
const OnboardingScreen       = React.lazy(() => import('@/screens/auth/Onboarding'));
const LoginScreen            = React.lazy(() => import('@/screens/auth/Login'));
const SignupProAwareScreen   = React.lazy(() => import('@/screens/auth/SignupProAware'));
const ProRegistrationScreen  = React.lazy(() => import('@/screens/pro/ProRegistration'));
const OTPScreen              = React.lazy(() => import('@/screens/auth/OTP'));

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  // Attend la réhydratation MMKV avant de choisir l'écran initial, pour ne
  // jamais flasher un état "invité" pendant la lecture du token persisté.
  const hasHydrated = useAuthStore((s) => s.hasHydrated);
  if (!hasHydrated) return null;

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen as any} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen as any} />
        <Stack.Screen name="App" component={AppNavigator} />

        {/* Seul Login ouvre un vrai modal (le point d'entrée unique de useAuthGate) —
            SignupProAware/OTP s'enchaînent par un push classique À L'INTÉRIEUR
            de ce même modal, pour éviter d'empiler plusieurs feuilles modales. */}
        <Stack.Screen
          name="Login"
          component={LoginScreen as any}
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen name="SignupProAware" component={SignupProAwareScreen as any} />
        <Stack.Screen name="ProRegistration" component={ProRegistrationScreen as any} />
        <Stack.Screen name="OTP" component={OTPScreen as any} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
