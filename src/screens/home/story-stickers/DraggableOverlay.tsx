// src/screens/home/story-stickers/DraggableOverlay.tsx
// Positionnement libre en % d'écran (0..1). Ancré coin haut-gauche, pas de
// centrage automatique — volontairement simple, cohérent avec le reste de
// l'éditeur. initialX/initialY ne sont lus qu'au montage (non contrôlé ensuite).
//
// Le badge de suppression est un SIBLING du View pan-handled (pas un enfant) :
// un PanResponder avec onStartShouldSetPanResponder=true capte le touch dès
// qu'il touche n'importe quel descendant, donc un bouton "X" imbriqué dedans
// ne recevrait jamais son propre onPress. En le sortant du sous-arbre géré par
// panHandlers, il redevient un vrai bouton cliquable indépendant du drag.
import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, PanResponder, type GestureResponderEvent, type PanResponderGestureState } from 'react-native';
import Icon from '@/components/ui/Icon';

interface Props {
  initialX: number;
  initialY: number;
  containerWidth: number;
  containerHeight: number;
  onPositionChange: (x: number, y: number) => void;
  onDelete?: () => void;
  children: React.ReactNode;
}

export default function DraggableOverlay({
  initialX, initialY, containerWidth, containerHeight, onPositionChange, onDelete, children,
}: Props) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const grantOrigin = useRef(pos);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        setPos((current) => { grantOrigin.current = current; return current; });
      },
      onPanResponderMove: (_evt: GestureResponderEvent, gesture: PanResponderGestureState) => {
        const nx = Math.max(0, Math.min(1, grantOrigin.current.x + gesture.dx / containerWidth));
        const ny = Math.max(0, Math.min(1, grantOrigin.current.y + gesture.dy / containerHeight));
        setPos({ x: nx, y: ny });
      },
      onPanResponderRelease: () => {
        setPos((current) => { onPositionChange(current.x, current.y); return current; });
      },
      onPanResponderTerminationRequest: () => false,
    }),
  ).current;

  return (
    <View style={{ position: 'absolute', left: `${pos.x * 100}%`, top: `${pos.y * 100}%` }}>
      <View {...panResponder.panHandlers}>{children}</View>
      {onDelete && (
        <TouchableOpacity
          onPress={onDelete}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          style={{
            position: 'absolute', top: -10, right: -10, width: 22, height: 22, borderRadius: 11,
            backgroundColor: 'rgba(0,0,0,0.7)', borderWidth: 1, borderColor: '#fff',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Icon name="X" size={12} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}
