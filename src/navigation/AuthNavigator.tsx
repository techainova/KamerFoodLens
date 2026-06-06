// src/navigation/AuthNavigator.tsx
// Stack d'authentification : Splash → Onboarding → Login → Signup → OTP

import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { AuthStackParams } from './types';

// Imports des écrans (seront créés en Phase 2)
const SplashScreen     = React.lazy(() => import('@/screens/auth/Splash'));
const OnboardingScreen = React.lazy(() => import('@/screens/auth/Onboarding'));
const LoginScreen      = React.lazy(() => import('@/screens/auth/Login'));
const SignupScreen      = React.lazy(() => import('@/screens/auth/Signup'));
const OTPScreen        = React.lazy(() => import('@/screens/auth/OTP'));

const Stack = createNativeStackNavigator<AuthStackParams>();

export function AuthNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{ headerShown: false, animation: 'fade' }}
    >
      <Stack.Screen name="Splash"      component={SplashScreen as any} />
      <Stack.Screen name="Onboarding"  component={OnboardingScreen as any} />
      <Stack.Screen name="Login"       component={LoginScreen as any} />
      <Stack.Screen name="Signup"      component={SignupScreen as any} />
      <Stack.Screen name="OTP"         component={OTPScreen as any} />
    </Stack.Navigator>
  );
}
