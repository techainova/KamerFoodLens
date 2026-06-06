// src/screens/scanner/RecipeV1.tsx
// Fiche recette — onglets Ingrédients / Étapes / Nutrition / Avis

import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useRecipe, type RecipeTab } from '@/hooks/useRecipe';
import { WFButton, WFChip } from '@/components/ui';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

const TABS: { key: RecipeTab; label: string }[] = [
  { key: 'ingredients', label: 'Ingrédients' },
  { key: 'steps',       label: 'Étapes' },
  { key: 'nutrition',   label: 'Nutrition' },
  { key: 'reviews',     label: 'Avis' },
];

export default function RecipeV1() {
  const { t }        = useTranslation();
  const navigation   = useNavigation();
  const {
    recipe, activeTab, servings, checkedItems,
    setActiveTab, toggleIngredient,
    incrementServings, decrementServings, startCookMode,
  } = useRecipe();

  if (recipe.isLoading) {
    return <View style={styles.loading}><ActivityIndicator color={colors.primary} /></View>;
  }

  const data = recipe.data ?? MOCK_RECIPE;

  return (
    <View style={styles.container}>
      {/* Video hero */}
      <View style={styles.video}>
        <Text style={styles.videoPlaceholder}>▶</Text>
        <Text style={styles.videoDuration}>7:45</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.content}>

          {/* Titre */}
          <Text style={styles.title}>{data.name}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.metaItem}>⏱ {data.duration} min</Text>
            <Text style={styles.metaItem}>· Moyen · </Text>
            <Text style={styles.metaItem}>⭐ {data.rating} ({data.ratingCount})</Text>
          </View>

          {/* Onglets */}
          <View style={styles.tabs}>
            {TABS.map((tab) => (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[styles.tab, activeTab === tab.key && styles.tabActive]}
                accessibilityLabel={tab.label}
              >
                <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* INGRÉDIENTS */}
          {activeTab === 'ingredients' && (
            <>
              <View style={styles.portionsRow}>
                <Text style={styles.portionsLabel}>Portions / Servings</Text>
                <View style={styles.portionsControl}>
                  <TouchableOpacity onPress={decrementServings} style={styles.portionBtn}>
                    <Text style={styles.portionBtnText}>−</Text>
                  </TouchableOpacity>
                  <Text style={styles.portionValue}>{servings}</Text>
                  <TouchableOpacity onPress={incrementServings} style={styles.portionBtn}>
                    <Text style={styles.portionBtnText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {data.ingredients.map((ing) => (
                <TouchableOpacity
                  key={ing.id}
                  onPress={() => toggleIngredient(ing.id)}
                  style={styles.ingredientRow}
                  accessibilityLabel={`${ing.qty} ${ing.unit} ${ing.name}`}
                >
                  <View style={[styles.checkbox, checkedItems.has(ing.id) && styles.checkboxDone]}>
                    {checkedItems.has(ing.id) && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={[styles.ingQty, checkedItems.has(ing.id) && styles.ingDone]}>
                    {ing.qty}{ing.unit}
                  </Text>
                  <Text style={[styles.ingName, checkedItems.has(ing.id) && styles.ingDone]}>
                    {ing.name}
                  </Text>
                  <Text style={styles.ingNameEN}>{ing.nameEN}</Text>
                </TouchableOpacity>
              ))}

              <View style={{ height: spacing.md }} />
              <WFButton label="Ajouter à ma liste de courses" onPress={() => {}} variant="secondary" fullWidth />
            </>
          )}

          {/* ÉTAPES */}
          {activeTab === 'steps' && (
            <>
              {data.steps.map((step) => (
                <View key={step.number} style={styles.stepRow}>
                  <View style={styles.stepNum}>
                    <Text style={styles.stepNumText}>{step.number}</Text>
                  </View>
                  <Text style={styles.stepText}>{step.text}</Text>
                </View>
              ))}
            </>
          )}

          {/* NUTRITION */}
          {activeTab === 'nutrition' && (
            <View style={styles.nutritionGrid}>
              {[
                { label: 'Calories', value: `${data.calories} Kcal` },
                { label: 'Protéines', value: '24g' },
                { label: 'Glucides', value: '18g' },
                { label: 'Lipides', value: '12g' },
              ].map((n) => (
                <View key={n.label} style={styles.nutritionItem}>
                  <Text style={styles.nutritionValue}>{n.value}</Text>
                  <Text style={styles.nutritionLabel}>{n.label}</Text>
                </View>
              ))}
            </View>
          )}

          {/* AVIS */}
          {activeTab === 'reviews' && (
            <Text style={styles.placeholder}>Avis disponibles prochainement</Text>
          )}

          <View style={{ height: spacing.xl }} />
          <WFButton label="Mode cuisson ›" onPress={startCookMode} fullWidth size="lg" />
          <View style={{ height: 40 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const MOCK_RECIPE = {
  id: '1', name: 'Ndolé traditionnel', region: 'Littoral',
  duration: 90, servings: 4, calories: 480, rating: 4.9, ratingCount: 312,
  ingredients: [
    { id: '1', qty: '500', unit: 'g', name: 'feuilles de ndolé fraîches', nameEN: 'fresh ndolé leaves', checked: false },
    { id: '2', qty: '300', unit: 'g', name: 'pâte d\'arachide', nameEN: 'peanut paste', checked: false },
    { id: '3', qty: '400', unit: 'g', name: 'poisson fumé', nameEN: 'smoked fish', checked: false },
    { id: '4', qty: '200', unit: 'g', name: 'viande de bœuf', nameEN: 'beef', checked: false },
    { id: '5', qty: '4', unit: '', name: 'crevettes séchées', nameEN: 'dried shrimps', checked: false },
    { id: '6', qty: '1', unit: '', name: 'oignon', nameEN: 'onion', checked: false },
  ],
  steps: [
    { number: 1, text: 'Lavez les feuilles de ndolé.', duration: 5 },
    { number: 2, text: 'Faites cuire la viande avec oignons et ail pendant 20 minutes.', duration: 20 },
    { number: 3, text: 'Ajoutez le poisson fumé et laissez mijoter 20 min.', duration: 20 },
    { number: 4, text: 'Incorporez la pâte d\'arachide diluée dans 2 verres d\'eau.', duration: 10 },
    { number: 5, text: 'Ajoutez les feuilles de ndolé et remuez constamment 30 min.', duration: 30 },
  ],
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.cream },
  loading:   { flex: 1, alignItems: 'center', justifyContent: 'center' },
  video:     {
    height: 220, backgroundColor: colors.ink,
    alignItems: 'center', justifyContent: 'center', position: 'relative',
  },
  videoPlaceholder: { fontSize: 48, color: colors.white, opacity: 0.8 },
  videoDuration:    {
    position: 'absolute', bottom: spacing.sm, left: spacing.md,
    fontFamily: fontFamily.mono, fontSize: fontSize.sm, color: colors.white,
    backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: spacing.sm, borderRadius: radius.sm,
  },
  backBtn:   { position: 'absolute', top: spacing.lg, left: spacing.md, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  backIcon:  { fontSize: 24, color: colors.white },
  content:   { padding: spacing.md },
  title:     { fontFamily: fontFamily.serifBold, fontSize: fontSize.xxl, color: colors.ink, marginBottom: spacing.sm },
  metaRow:   { flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md },
  metaItem:  { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.inkMute },

  tabs:        { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: colors.border, marginBottom: spacing.md },
  tab:         { flex: 1, paddingVertical: spacing.sm, alignItems: 'center' },
  tabActive:   { borderBottomWidth: 2, borderBottomColor: colors.primary },
  tabText:     { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.inkMute },
  tabTextActive:{ color: colors.primary, fontFamily: fontFamily.bold },

  portionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
  portionsLabel:{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },
  portionsControl:{ flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  portionBtn:  { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  portionBtnText:{ fontSize: 18, color: colors.ink, lineHeight: 22 },
  portionValue:{ fontFamily: fontFamily.bold, fontSize: fontSize.lg, color: colors.ink, minWidth: 24, textAlign: 'center' },

  ingredientRow:{ flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border, gap: spacing.sm },
  checkbox:     { width: 20, height: 20, borderRadius: 4, borderWidth: 1.5, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  checkboxDone: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkmark:    { color: colors.white, fontSize: 12 },
  ingQty:       { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink, minWidth: 44 },
  ingName:      { flex: 1, fontFamily: fontFamily.regular, fontSize: fontSize.md, color: colors.ink },
  ingNameEN:    { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute, fontStyle: 'italic' },
  ingDone:      { textDecorationLine: 'line-through', color: colors.inkMute },

  stepRow:     { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.md, alignItems: 'flex-start' },
  stepNum:     { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  stepNumText: { fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: colors.white },
  stepText:    { flex: 1, fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.inkSoft, lineHeight: 22, paddingTop: 4 },

  nutritionGrid:{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.md },
  nutritionItem:{ width: '45%', backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  nutritionValue:{ fontFamily: fontFamily.serifBold, fontSize: fontSize.xxl, color: colors.primary },
  nutritionLabel:{ fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.inkMute },

  placeholder: { fontFamily: fontFamily.regular, fontSize: fontSize.md, color: colors.inkMute, textAlign: 'center', paddingVertical: spacing.xl },
});
