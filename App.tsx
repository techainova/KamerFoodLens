// App.tsx — KmerFoodLens v4.0
import '@/i18n';
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
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

import { useUIStore } from '@/store/ui.store';
import { useAuthStore } from '@/store/auth.store';
import { useMessagesStore } from '@/store/messages.store';
import { useNotificationsStore } from '@/store/notifications.store';
import i18n from '@/i18n';
import { RootNavigator } from '@/navigation/RootNavigator';
import { socketService } from '@/services/socket.service';

const client = new QueryClient();

export default function App() {
  // Langue persistée (réglages) -> i18n, indépendant de la navigation.
  const language = useUIStore((s) => s.language);
  useEffect(() => {
    if (language && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [language]);

  // Diffusion temps réel (nouvelles stories/événements) pour toute la durée
  // de vie de l'app, invités compris — voir socket.service.ts#connectContentFeed.
  useEffect(() => {
    socketService.connectContentFeed();
    return () => socketService.disconnectContentFeed();
  }, []);

  // Messagerie : exige un compte (contrairement au fil ci-dessus) — connectée
  // dès la connexion de l'utilisateur, coupée à la déconnexion.
  const userId = useAuthStore((s) => s.user?.id);
  useEffect(() => {
    if (!userId) { socketService.disconnectMessaging(); return; }
    socketService.connectMessaging(userId);
    // Sans cet appel initial, le badge "non lus" (icônes Accueil/ProfilePro)
    // reste à 0 tant que l'utilisateur n'a pas ouvert une fois la liste des
    // conversations — les mises à jour temps réel arrivent bien via le socket
    // ci-dessus, mais seulement pour les conversations déjà connues.
    void useMessagesStore.getState().fetchConversations();
    return () => socketService.disconnectMessaging();
  }, [userId]);

  // Notifications : même principe que la messagerie ci-dessus — connectée dès
  // qu'un compte est présent, pour recevoir commandes/paiements/… en direct.
  useEffect(() => {
    if (!userId) { socketService.disconnectNotifications(); return; }
    socketService.connectNotifications(userId);
    void useNotificationsStore.getState().fetchFirstPage();
    return () => socketService.disconnectNotifications();
  }, [userId]);

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
