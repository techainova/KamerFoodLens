// src/screens/courses/Courses.tsx
// Catalogue formations — mes cours + populaires + filtres

import React, { useState } from 'react';
import {
  FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

type CourseLevel = 'all' | 'beginner' | 'intermediate' | 'expert' | 'free' | 'certified';

const LEVELS: { key: CourseLevel; label: string }[] = [
  { key: 'all',          label: 'Tous' },
  { key: 'beginner',     label: 'Débutant' },
  { key: 'intermediate', label: 'Inter.' },
  { key: 'expert',       label: 'Expert' },
  { key: 'free',         label: 'Gratuit' },
  { key: 'certified',    label: 'Certifié' },
];

const MOCK_MY_COURSES = [
  { id: '1', title: 'Cuisine du Littoral · Niveau 1', progress: 65, status: 'EN COURS' },
];

const MOCK_POPULAR = [
  { id: '1', title: 'Maîtriser les sauces camerounaises', instructor: 'Chef Lionel L.', level: 'Intermédiaire', duration: '5h30', price: '15 000 XAF', rating: 4.8, reviews: 312, certified: true },
  { id: '2', title: 'Cuisine végétarienne africaine', instructor: 'Chef Amina S.', level: 'Débutant', duration: '3h00', price: 'Gratuit', rating: 4.6, reviews: 189, certified: false },
  { id: '3', title: 'Techniques de fumage traditionnel', instructor: 'Chef Bienvenu N.', level: 'Expert', duration: '8h00', price: '25 000 XAF', rating: 4.9, reviews: 87, certified: true },
];

export default function Courses() {
  const [level, setLevel] = useState<CourseLevel>('all');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero banner */}
        <View style={styles.hero}>
          <View style={styles.heroLeft}>
            <Text style={styles.heroTitle}>Devenez un Chef</Text>
            <Text style={styles.heroSub}>Apprenez avec les meilleurs</Text>
            <TouchableOpacity style={styles.heroBtn}>
              <Text style={styles.heroBtnText}>Explorer</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.heroEmoji}>👨‍🍳</Text>
        </View>

        {/* Filtres niveaux */}
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={LEVELS}
          keyExtractor={(l) => l.key}
          contentContainerStyle={styles.levelsRow}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setLevel(item.key)}
              style={[styles.levelBtn, level === item.key && styles.levelBtnActive]}
            >
              <Text style={[styles.levelText, level === item.key && styles.levelTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />

        {/* Mes formations */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mes formations</Text>
        </View>
        {MOCK_MY_COURSES.map((course) => (
          <View key={course.id} style={styles.myCourseCard}>
            <View style={styles.myCourseImage}>
              <Text style={styles.myCourseEmoji}>🍳</Text>
            </View>
            <View style={styles.myCourseInfo}>
              <View style={styles.myCourseStatusRow}>
                <Text style={styles.myCourseStatus}>{course.status}</Text>
              </View>
              <Text style={styles.myCourseTitle}>{course.title}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${course.progress}%` }]} />
              </View>
              <Text style={styles.progressText}>{course.progress}%</Text>
            </View>
          </View>
        ))}

        {/* Populaires */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Populaires</Text>
          <TouchableOpacity><Text style={styles.seeAll}>Voir tout</Text></TouchableOpacity>
        </View>

        {MOCK_POPULAR.map((course) => (
          <TouchableOpacity key={course.id} style={styles.courseCard} accessibilityLabel={course.title}>
            <View style={styles.courseImage}>
              <Text style={styles.courseEmoji}>🎓</Text>
              <Text style={styles.courseDuration}>{course.duration}</Text>
            </View>
            <View style={styles.courseInfo}>
              {course.level === 'Intermédiaire' && (
                <View style={styles.courseLevelBadge}>
                  <Text style={styles.courseLevelText}>{course.level}</Text>
                </View>
              )}
              <Text style={styles.courseTitle}>{course.title}</Text>
              <Text style={styles.courseInstructor}>👤 {course.instructor}</Text>
              <View style={styles.courseMetaRow}>
                <Text style={styles.courseMeta}>⭐ {course.rating} ({course.reviews} avis)</Text>
                {course.certified && (
                  <View style={styles.certBadge}>
                    <Text style={styles.certText}>✓ Certificat</Text>
                  </View>
                )}
              </View>
              <View style={styles.coursePriceRow}>
                <Text style={styles.coursePrice}>{course.price}</Text>
                <TouchableOpacity style={styles.enrollBtn}>
                  <Text style={styles.enrollText}>S'inscrire</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.cream },
  hero:    { margin: spacing.md, backgroundColor: colors.ink, borderRadius: radius.lg, padding: spacing.lg, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  heroLeft:{ flex: 1 },
  heroTitle:{ fontFamily: fontFamily.serifBold, fontSize: fontSize.xl, color: colors.white, marginBottom: 4 },
  heroSub: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.inkMute, marginBottom: spacing.md },
  heroBtn: { backgroundColor: colors.primary, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, alignSelf: 'flex-start' },
  heroBtnText:{ fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: colors.white },
  heroEmoji:  { fontSize: 48 },

  levelsRow: { paddingHorizontal: spacing.md, paddingBottom: spacing.md, gap: spacing.sm },
  levelBtn:  { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  levelBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  levelText:      { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.inkMute },
  levelTextActive:{ color: colors.white },

  sectionHeader:{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, marginBottom: spacing.sm },
  sectionTitle: { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },
  seeAll:       { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.primary },

  myCourseCard: { flexDirection: 'row', marginHorizontal: spacing.md, marginBottom: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  myCourseImage:{ width: 80, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center' },
  myCourseEmoji:{ fontSize: 32 },
  myCourseInfo: { flex: 1, padding: spacing.md },
  myCourseStatusRow:{ marginBottom: 4 },
  myCourseStatus:   { fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.primary },
  myCourseTitle:    { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink, marginBottom: spacing.sm },
  progressBar:  { height: 6, backgroundColor: colors.surface2, borderRadius: 3, marginBottom: 4 },
  progressFill: { height: 6, backgroundColor: colors.success, borderRadius: 3 },
  progressText: { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute },

  courseCard:   { marginHorizontal: spacing.md, marginBottom: spacing.md, backgroundColor: colors.surface, borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  courseImage:  { height: 120, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  courseEmoji:  { fontSize: 48 },
  courseDuration:{ position: 'absolute', bottom: spacing.sm, right: spacing.sm, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2, fontFamily: fontFamily.mono, fontSize: fontSize.xs, color: colors.white },
  courseInfo:   { padding: spacing.md },
  courseLevelBadge: { alignSelf: 'flex-start', backgroundColor: colors.primarySoft, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 2, marginBottom: spacing.sm },
  courseLevelText:  { fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.primary },
  courseTitle:      { fontFamily: fontFamily.bold, fontSize: fontSize.lg, color: colors.ink, marginBottom: 4 },
  courseInstructor: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.inkMute, marginBottom: spacing.sm },
  courseMetaRow:    { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.sm },
  courseMeta:       { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.inkSoft },
  certBadge:        { backgroundColor: colors.successSoft, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  certText:         { fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.success },
  coursePriceRow:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  coursePrice:      { fontFamily: fontFamily.serifBold, fontSize: fontSize.lg, color: colors.ink },
  enrollBtn:        { backgroundColor: colors.primary, borderRadius: radius.full, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  enrollText:       { fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: colors.white },
});
