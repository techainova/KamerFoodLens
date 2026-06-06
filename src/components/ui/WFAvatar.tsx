// src/components/ui/WFAvatar.tsx
// Avatar utilisateur — image ou initiales

import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { colors, fontFamily, fontSize } from '@/constants/theme';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE_MAP: Record<AvatarSize, number> = {
  xs: 24,
  sm: 32,
  md: 40,
  lg: 56,
  xl: 80,
};

interface Props {
  uri?:     string;
  initials?: string;
  size?:    AvatarSize;
  online?:  boolean;
}

export function WFAvatar({
  uri,
  initials = '?',
  size     = 'md',
  online   = false,
}: Props) {
  const dim = SIZE_MAP[size];

  return (
    <View style={{ width: dim, height: dim }}>
      {uri ? (
        <Image
          source={{ uri }}
          style={[styles.image, { width: dim, height: dim, borderRadius: dim / 2 }]}
          accessibilityLabel="Avatar utilisateur"
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            { width: dim, height: dim, borderRadius: dim / 2 },
          ]}
        >
          <Text style={[styles.initials, { fontSize: dim * 0.35 }]}>
            {initials.slice(0, 2).toUpperCase()}
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
  image: {
    resizeMode: 'cover',
  },
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
