// src/navigation/navigationRef.ts
// Permet de naviguer depuis en dehors de React (ex. un intercepteur Axios) —
// seul point d'accès à la navigation pour du code non-composant.
import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootStackParamList } from './types';

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export function navigateToLogin(): void {
  if (navigationRef.isReady()) {
    navigationRef.navigate('Login');
  }
}

// Vide toute la pile racine (Splash/Onboarding/Login/Signup/OTP...) et repart
// d'un seul écran — utilisé pour "revenir à l'app" depuis n'importe quel écran
// d'auth. Passe par le ref plutôt que par le `navigation` de l'écran appelant :
// plus fiable que `replace`/`navigate` sur un écran chargé via React.lazy à la
// racine (observé en pratique : REPLACE échouait par "not handled by any
// navigator" alors que l'écran cible était bien enregistré comme frère direct).
export function resetToRoute(name: 'App' | 'Onboarding'): void {
  if (navigationRef.isReady()) {
    navigationRef.reset({ index: 0, routes: [{ name }] });
  }
}

// Après une inscription "établissement" et l'envoi réussi de la demande Pro
// (voir OTP.tsx) : entre dans l'app directement sur l'écran de confirmation,
// plutôt que de laisser l'utilisateur le retrouver lui-même — la demande part
// en attente de validation admin, le compte reste "standard" jusqu'à approbation.
// Un seul reset() avec un état imbriqué complet, plutôt que reset() + navigate()
// séparés : évite de dépendre du fait que le premier dispatch soit déjà reflété
// dans l'état interne du navigateur au moment du second.
export function resetToProConfirmation(businessName: string): void {
  if (navigationRef.isReady()) {
    (navigationRef.reset as (state: unknown) => void)({
      index: 0,
      routes: [
        {
          name: 'App',
          state: {
            routes: [
              {
                name: 'HomeTab',
                // HomeScreen reste dessous dans la pile : le bouton "Retour à
                // l'accueil" de ProConfirmation (popToTop) a bien une cible.
                state: {
                  index: 1,
                  routes: [{ name: 'HomeScreen' }, { name: 'ProConfirmation', params: { businessName } }],
                },
              },
            ],
          },
        },
      ],
    });
  }
}
