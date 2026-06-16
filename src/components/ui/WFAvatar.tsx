// src/components/ui/WFAvatar.tsx
import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily } from '@/constants/theme';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<AvatarSize, number> = {
  xs: 24, sm: 32, md: 40, lg: 56, xl: 80,
};

function resolveSize(size: AvatarSize | number): number {
  if (typeof size === 'number') return size;
  return SIZE_MAP[size];
}

function nameToInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase() || '?';
}

interface WFAvatarProps {
  uri?:      string;
  name?:     string;
  initials?: string;
  size?:     AvatarSize | number;
  online?:   boolean;
}

export function WFAvatar({ uri, name, initials, size = 'md', online = false }: WFAvatarProps) {
  const dim      = resolveSize(size);
  const computed = initials ?? (name ? nameToInitials(name) : '?');

  return (
    <View style={{ width: dim, height: dim }}>
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: dim, height: dim, borderRadius: dim / 2 }}
          accessibilityLabel="Avatar utilisateur"
          accessibilityRole="image"
        />
      ) : (
        <View
          style={[styles.placeholder, { width: dim, height: dim, borderRadius: dim / 2 }]}
          accessible
          accessibilityLabel={`Avatar ${computed}`}
          accessibilityRole="image"
        >
          <Text style={[styles.initials, { fontSize: dim * 0.35 }]}>
            {computed.slice(0, 2)}
          </Text>
        </View>
      )}

      {online && (
        <View
          style={[
            styles.onlineDot,
            { width: dim * 0.28, height: dim * 0.28, borderRadius: dim * 0.14 },
          ]}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    backgroundColor: colors.primarySoft,
    alignItems:      'center',
    justifyContent:  'center',
  },
  initials: {
    fontFamily: fontFamily.bold,
    color:      colors.primary,
  },
  onlineDot: {
    position:        'absolute',
    bottom:          0,
    right:           0,
    backgroundColor: colors.success,
    borderWidth:     2,
    borderColor:     colors.surface,
  },
});
