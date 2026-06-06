// App.tsx — KmerFoodLens v4.0
// Point d'entrée avec mock auth pour tester sans backend

import '@/i18n';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';

// Auth screens
import Splash     from '@/screens/auth/Splash';
import Onboarding from '@/screens/auth/Onboarding';
import Login      from '@/screens/auth/Login';
import Signup     from '@/screens/auth/Signup';
import OTP        from '@/screens/auth/OTP';

// App navigator (après connexion)
import { AppNavigator } from '@/navigation/AppNavigator';

const Stack  = createNativeStackNavigator();
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
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={client}>
          <RootNavigator />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}








// import '@/i18n';
// import React from 'react';
// import { NavigationContainer } from '@react-navigation/native';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { SafeAreaProvider } from 'react-native-safe-area-context';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// // Écrans Auth
// import Splash     from '@/screens/auth/Splash';
// import Onboarding from '@/screens/auth/Onboarding';
// import Login      from '@/screens/auth/Login';
// import Signup     from '@/screens/auth/Signup';
// import OTP        from '@/screens/auth/OTP';

// const Stack  = createNativeStackNavigator();
// const client = new QueryClient();

// export default function App() {
//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <SafeAreaProvider>
//         <QueryClientProvider client={client}>
//           <NavigationContainer>
//             <Stack.Navigator
//               initialRouteName="Splash"
//               screenOptions={{ headerShown: false, animation: 'fade' }}
//             >
//               <Stack.Screen name="Splash"     component={Splash} />
//               <Stack.Screen name="Onboarding" component={Onboarding} />
//               <Stack.Screen name="Login"      component={Login} />
//               <Stack.Screen name="Signup"     component={Signup} />
//               <Stack.Screen name="OTP"        component={OTP as any} />
//             </Stack.Navigator>
//           </NavigationContainer>
//         </QueryClientProvider>
//       </SafeAreaProvider>
//     </GestureHandlerRootView>
//   );
// }