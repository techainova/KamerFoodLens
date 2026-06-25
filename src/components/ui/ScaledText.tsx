// src/components/ui/ScaledText.tsx
// Remplace le `Text` natif partout dans l'app (voir metro/script de migration)
// pour appliquer globalement les réglages d'accessibilité :
//  - taille du texte (0=Petit … 3=Très grand) — multiplie tout `fontSize` explicite
//  - police du corps de texte (Inter par défaut, ou JetBrains Mono)
//
// On ne touche QUE les styles qui définissent déjà un `fontSize`/`fontFamily`
// explicite, pour ne jamais casser l'héritage natif des <Text> imbriqués
// sans style propre (ex. <Text>Bonjour <Text style={{fontWeight:'bold'}}>Amah</Text></Text>).

import React from 'react';
import { Text as RNText, StyleSheet, type TextProps, type TextStyle } from 'react-native';
import { useAccessibilityStore } from '@/store/accessibility.store';

const SCALE_BY_SIZE: Record<number, number> = { 0: 0.9, 1: 1, 2: 1.15, 3: 1.3 };

function mapFontFamily(family: string | undefined, useMono: boolean): string | undefined {
  if (!useMono || !family || !family.startsWith('Inter-')) return undefined;
  const weight = family.slice('Inter-'.length);
  const mapped = weight === 'Regular' || weight === 'Medium' ? 'JetBrainsMono-Regular' : 'JetBrainsMono-Bold';
  return mapped === family ? undefined : mapped;
}

export function Text(props: TextProps) {
  const textSize = useAccessibilityStore((s) => s.textSize);
  const bodyFont = useAccessibilityStore((s) => s.bodyFont);

  const flat = (StyleSheet.flatten(props.style) ?? {}) as TextStyle;
  const scale = SCALE_BY_SIZE[textSize] ?? 1;

  const override: TextStyle = {};
  if (typeof flat.fontSize === 'number') {
    override.fontSize = flat.fontSize * scale;
  }
  const mappedFamily = mapFontFamily(flat.fontFamily, bodyFont === 'mono');
  if (mappedFamily) {
    override.fontFamily = mappedFamily;
  }

  if (Object.keys(override).length === 0) {
    return <RNText {...props} />;
  }

  return <RNText {...props} style={[props.style, override]} />;
}

export default Text;
