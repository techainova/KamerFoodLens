// src/components/ui/FoodCard.tsx
import React from 'react';
import {
  Image, Pressable, StyleSheet, View,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { colors, fontFamily, fontSize, radius, shadows, spacing2 } from '@/constants/theme';
import { ConfidenceBar } from './ConfidenceBar';
import { Tag } from './Tag';

interface FoodCardProps {
  image?:       string;
  dishName:     string;
  region:       string;
  duration?:    string;
  confidence?:  number;
  vegetarian?:  boolean;
  onPress:      () => void;
}

export function FoodCard({
  image,
  dishName,
  region,
  duration,
  confidence,
  vegetarian = false,
  onPress,
}: FoodCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.card, shadows.elev1]}
      accessibilityRole="button"
      accessibilityLabel={`Voir la fiche ${dishName}, région ${region}`}
      accessible
    >
      {/* Image */}
      <View style={styles.imageWrap}>
        {image ? (
          <Image
            source={{ uri: image }}
            style={styles.image}
            accessibilityLabel={dishName}
            accessibilityRole="image"
          />
        ) : (
          <View style={styles.imagePlaceholder} />
        )}
        {vegetarian && (
          <View style={styles.vegBadge}>
            <Tag label="Végé" tone="veg" />
          </View>
        )}
      </View>

      {/* Contenu */}
      <View style={styles.body}>
        <Text style={styles.dishName} numberOfLines={2}>{dishName}</Text>

        <View style={styles.meta}>
          <Tag label={region} tone="region" />
          {duration ? (
            <Text style={styles.duration}>{duration}</Text>
          ) : null}
        </View>

        {confidence !== undefined && (
          <View style={styles.confidence}>
            <ConfidenceBar score={confidence} size="sm" />
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius:    radius.md,
    overflow:        'hidden',
    width:           160,
  },
  imageWrap: {
    height:   120,
    position: 'relative',
  },
  image: {
    width:      '100%',
    height:     '100%',
    resizeMode: 'cover',
  },
  imagePlaceholder: {
    flex:            1,
    backgroundColor: colors.surfaceSunken,
  },
  vegBadge: {
    position: 'absolute',
    top:      spacing2.xs,
    left:     spacing2.xs,
  },
  body: { padding: spacing2.sm },
  dishName: {
    fontFamily:   fontFamily.serif,
    fontSize:     fontSize.h3,
    color:        colors.fg,
    marginBottom: 6,
  },
  meta: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           6,
    marginBottom:  6,
  },
  duration: {
    fontFamily: fontFamily.regular,
    fontSize:   fontSize.caption,
    color:      colors.fgMuted,
  },
  confidence: { marginTop: 4 },
});
