// src/screens/auth/Onboarding.tsx
// Slides d'introduction — 3 slides avec pagination + boutons

import React from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useOnboarding, SLIDES } from '@/hooks/useOnboarding';
import { WFButton } from '@/components/ui';
import { colors, fontFamily, fontSize, spacing, radius } from '@/constants/theme';

const { width: SCREEN_W } = Dimensions.get('window');

export default function Onboarding() {
  const { flatListRef, activeIndex, isLast, goNext, goPrev, skip, onScrollEnd } =
    useOnboarding();

  return (
    <View style={styles.container}>
      {/* Bouton Passer */}
      <TouchableOpacity
        style={styles.skipBtn}
        onPress={skip}
        accessibilityLabel="Passer l'introduction"
      >
        <Text style={styles.skipText}>Passer / Skip</Text>
      </TouchableOpacity>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / SCREEN_W);
          onScrollEnd(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={styles.title}>{item.titleFR}</Text>
            <Text style={styles.titleEN}>{item.titleEN}</Text>
            <Text style={styles.desc}>{item.descFR}</Text>
            <Text style={styles.descEN}>{item.descEN}</Text>
          </View>
        )}
      />

      {/* Pagination dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View
            key={i}
            style={[styles.dot, i === activeIndex && styles.dotActive]}
          />
        ))}
      </View>

      {/* Boutons navigation */}
      <View style={styles.actions}>
        {activeIndex > 0 && (
          <TouchableOpacity onPress={goPrev} style={styles.prevBtn}>
            <Text style={styles.prevText}>‹</Text>
          </TouchableOpacity>
        )}

        <View style={styles.nextWrapper}>
          <WFButton
            label={isLast ? 'Commencer / Get Started' : 'Suivant / Next →'}
            onPress={goNext}
            fullWidth
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: colors.cream,
  },
  skipBtn: {
    position: 'absolute',
    top:      52,
    right:    spacing.lg,
    zIndex:   10,
  },
  skipText: {
    fontFamily: fontFamily.medium,
    fontSize:   fontSize.md,
    color:      colors.inkMute,
  },
  slide: {
    width:           SCREEN_W,
    flex:            1,
    alignItems:      'center',
    justifyContent:  'center',
    paddingHorizontal: 40,
    paddingTop:      80,
  },
  emoji: {
    fontSize:     80,
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: fontFamily.serifBold,
    fontSize:   fontSize.xxl,
    color:      colors.ink,
    textAlign:  'center',
    marginBottom: 4,
  },
  titleEN: {
    fontFamily: fontFamily.regular,
    fontSize:   fontSize.lg,
    color:      colors.inkSoft,
    textAlign:  'center',
    fontStyle:  'italic',
    marginBottom: spacing.md,
  },
  desc: {
    fontFamily:  fontFamily.regular,
    fontSize:    fontSize.base,
    color:       colors.inkSoft,
    textAlign:   'center',
    lineHeight:  22,
    marginBottom: 6,
  },
  descEN: {
    fontFamily: fontFamily.regular,
    fontSize:   fontSize.md,
    color:      colors.inkMute,
    textAlign:  'center',
    lineHeight: 20,
    fontStyle:  'italic',
  },
  dots: {
    flexDirection:  'row',
    justifyContent: 'center',
    marginBottom:   spacing.lg,
    gap:            8,
  },
  dot: {
    width:        8,
    height:       8,
    borderRadius: radius.full,
    backgroundColor: colors.border,
  },
  dotActive: {
    width:           20,
    backgroundColor: colors.primary,
  },
  actions: {
    flexDirection:   'row',
    alignItems:      'center',
    paddingHorizontal: spacing.lg,
    paddingBottom:   48,
    gap:             spacing.md,
  },
  prevBtn: {
    width:           44,
    height:          44,
    borderRadius:    radius.full,
    borderWidth:     1.5,
    borderColor:     colors.border,
    alignItems:      'center',
    justifyContent:  'center',
  },
  prevText: {
    fontSize:   24,
    color:      colors.inkSoft,
    lineHeight: 28,
  },
  nextWrapper: { flex: 1 },
});
