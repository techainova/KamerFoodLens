// src/navigation/tabBarScroll.ts
// Valeur Animated partagée qui pilote la barre de menu flottante (translateY) —
// un singleton au niveau module plutôt qu'un contexte React ou un store Zustand :
// ça évite un re-render de l'arbre entier à chaque pixel défilé, et suit le même
// principe que navigationRef.ts (état impératif partagé, hors du cycle React).
import { Animated } from 'react-native';
import type { NativeSyntheticEvent, NativeScrollEvent } from 'react-native';

export const tabBarTranslateY = new Animated.Value(0);

// Doit dépasser la hauteur réelle de la barre + son décalage du bord bas
// (60 + ~14 + safe-area inset) pour la faire sortir entièrement de l'écran —
// une valeur généreuse ne coûte rien puisque la barre est en absolute.
const HIDDEN_Y = 160;
const DIRECTION_THRESHOLD = 6; // ignore le jitter du scroll (rebond, tremblement tactile)

let lastOffsetY = 0;
let isHidden = false;

function animateTo(value: number): void {
  Animated.timing(tabBarTranslateY, {
    toValue: value,
    duration: 220,
    useNativeDriver: true,
  }).start();
}

// À brancher sur le `onScroll` de n'importe quel ScrollView/FlatList sous la
// barre de menu (scrollEventThrottle={16} requis pour une fréquence fluide).
export function onTabBarScroll(event: NativeSyntheticEvent<NativeScrollEvent>): void {
  const offsetY = event.nativeEvent.contentOffset.y;
  const delta = offsetY - lastOffsetY;

  // Toujours visible tant qu'on est proche du haut (évite un flicker pendant
  // le rebond élastique iOS en overscroll négatif).
  if (offsetY <= 8) {
    if (isHidden) { isHidden = false; animateTo(0); }
    lastOffsetY = offsetY;
    return;
  }

  if (delta > DIRECTION_THRESHOLD && !isHidden) {
    isHidden = true;
    animateTo(HIDDEN_Y);
  } else if (delta < -DIRECTION_THRESHOLD && isHidden) {
    isHidden = false;
    animateTo(0);
  }
  lastOffsetY = offsetY;
}

// Reset explicite au changement d'onglet — sans ça, quitter un écran défilé
// vers le bas puis revenir sur un autre onglet garderait la barre cachée alors
// que le nouvel écran, lui, démarre en haut.
export function resetTabBarVisibility(): void {
  lastOffsetY = 0;
  if (isHidden) { isHidden = false; animateTo(0); }
}
