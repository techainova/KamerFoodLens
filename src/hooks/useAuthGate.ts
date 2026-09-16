// src/hooks/useAuthGate.ts
// Point d'entrée unique pour toute action réservée aux comptes connectés.
// Un écran n'a jamais à lire isAuthenticated lui-même : il enveloppe l'action
// dans requireAuth(...) et n'a pas à savoir où mène l'écran de connexion.
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@/store/auth.store';

export function useAuthGate() {
  const navigation = useNavigation<any>();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const requireAuth = (action: () => void): void => {
    if (isAuthenticated) {
      action();
      return;
    }
    navigation.navigate('Login');
  };

  return { isAuthenticated, requireAuth };
}
