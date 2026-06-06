// src/screens/auth/Splash.tsx
// Écran de démarrage — logo KFL + animation + navigation auto

import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useSplashAnimation } from '@/hooks/useSplashAnimation';
import { colors, fontFamily, fontSize } from '@/constants/theme';

export default function Splash() {
  const { opacity, translateY } = useSplashAnimation();

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.logoBlock, { opacity, transform: [{ translateY }] }]}>

        {/* Cercle logo */}
        <View style={styles.logoCircle}>
          <Text style={styles.logoText}>KFL</Text>
        </View>

        {/* Nom app */}
        <Text style={styles.appName}>KmerFoodLens</Text>
        <Text style={styles.tagline}>La saveur du Cameroun à portée de main</Text>
        <Text style={styles.taglineEN}>Cameroon's flavors at your fingertips</Text>
      </Animated.View>

      {/* Bouton CTA (apparaît après le fade) */}
      <Animated.View style={[styles.ctaBlock, { opacity }]}>
        <Text style={styles.ctaHint}>— animation : fade-in 1.5s → slide-up CTA —</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: colors.ink,
    alignItems:      'center',
    justifyContent:  'center',
    paddingHorizontal: 32,
  },
  logoBlock: {
    alignItems: 'center',
  },
  logoCircle: {
    width:           100,
    height:          100,
    borderRadius:    50,
    borderWidth:     2,
    borderColor:     colors.white,
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    20,
  },
  logoText: {
    fontFamily: fontFamily.serifBold,
    fontSize:   32,
    color:      colors.white,
  },
  appName: {
    fontFamily: fontFamily.serifBold,
    fontSize:   fontSize.xxl,
    color:      colors.white,
    marginBottom: 8,
  },
  tagline: {
    fontFamily: fontFamily.regular,
    fontSize:   fontSize.md,
    color:      colors.inkMute,
    textAlign:  'center',
  },
  taglineEN: {
    fontFamily: fontFamily.regular,
    fontSize:   fontSize.sm,
    color:      colors.inkMute,
    textAlign:  'center',
    fontStyle:  'italic',
    marginTop:  4,
  },
  ctaBlock: {
    position: 'absolute',
    bottom:   60,
  },
  ctaHint: {
    fontFamily: fontFamily.regular,
    fontSize:   fontSize.xs,
    color:      colors.inkMute,
    fontStyle:  'italic',
  },
});
