// src/screens/pro/UpgradePro.tsx
// Page upgrade vers compte Pro — avantages + CTA paiement

import React from 'react';
import {
  ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { WFButton } from '@/components/ui';
import { colors, fontFamily, fontSize, radius, spacing, shadows } from '@/constants/theme';

const FEATURES = [
  { emoji: '🏪', title: 'Page Restaurant officielle', sub: 'Profil vérifié avec menu, horaires et photos' },
  { emoji: '📅', title: 'Créer & gérer des événements', sub: 'Billetterie intégrée, paiement Mobile Money' },
  { emoji: '🎓', title: 'Organiser des formations', sub: 'Monétisation directe, certificats KFL' },
  { emoji: '👥', title: 'Créer votre communauté', sub: 'Groupe thématique, abonnés fidélisés' },
  { emoji: '📊', title: 'Dashboard analytics', sub: 'Vues, revenus, engagement en temps réel' },
  { emoji: '🛒', title: 'Commandes en ligne', sub: 'Panier, paiement, facture numérique QR' },
];

const PLANS = [
  { id: 'monthly', label: 'Mensuel', price: '5 000 XAF', per: '/ mois', highlight: false },
  { id: 'yearly',  label: 'Annuel',  price: '45 000 XAF', per: '/ an · économisez 15 000 XAF', highlight: true },
];

export default function UpgradePro() {
  const navigation = useNavigation();
  const [plan, setPlan] = React.useState('yearly');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backIcon}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Compte Pro</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Hero */}
        <View style={styles.hero}>
          <View style={styles.proBadge}><Text style={styles.proBadgeText}>⭐ PRO</Text></View>
          <Text style={styles.heroTitle}>Devenez un acteur culinaire</Text>
          <Text style={styles.heroSub}>
            Restaurants, chefs, écoles : touchez la communauté KFL et monétisez votre savoir-faire.
          </Text>
        </View>

        {/* Fonctionnalités */}
        <Text style={styles.sectionTitle}>Ce que vous débloquez</Text>
        {FEATURES.map((f) => (
          <View key={f.title} style={styles.featureRow}>
            <Text style={styles.featureEmoji}>{f.emoji}</Text>
            <View style={styles.featureInfo}>
              <Text style={styles.featureTitle}>{f.title}</Text>
              <Text style={styles.featureSub}>{f.sub}</Text>
            </View>
          </View>
        ))}

        {/* Plans */}
        <Text style={[styles.sectionTitle, { marginTop: spacing.xl }]}>Choisissez votre plan</Text>
        {PLANS.map((p) => (
          <TouchableOpacity
            key={p.id}
            onPress={() => setPlan(p.id)}
            style={[styles.planCard, plan === p.id && styles.planCardActive, p.highlight && styles.planCardHighlight]}
            accessibilityLabel={p.label}
          >
            {p.highlight && (
              <View style={styles.popularBadge}><Text style={styles.popularText}>Populaire</Text></View>
            )}
            <View style={styles.planRadio}>
              <View style={[styles.radioOuter, plan === p.id && styles.radioOuterActive]}>
                {plan === p.id && <View style={styles.radioInner} />}
              </View>
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planLabel}>{p.label}</Text>
              <Text style={styles.planPer}>{p.per}</Text>
            </View>
            <Text style={styles.planPrice}>{p.price}</Text>
          </TouchableOpacity>
        ))}

        {/* CTA */}
        <View style={styles.ctaBlock}>
          <WFButton
            label="Procéder au paiement →"
            onPress={() => navigation.navigate('ProDashboard' as never)}
            fullWidth
            size="lg"
          />
          <Text style={styles.ctaNote}>
            Paiement sécurisé · Orange Money / MTN / Carte
          </Text>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.cream },
  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  backBtn: { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  backIcon:{ fontSize: 28, color: colors.ink },
  headerTitle:{ fontFamily: fontFamily.bold, fontSize: fontSize.lg, color: colors.ink },

  hero:       { paddingHorizontal: spacing.lg, paddingVertical: spacing.xl, alignItems: 'center' },
  proBadge:   { backgroundColor: colors.gold, borderRadius: radius.full, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, marginBottom: spacing.md },
  proBadgeText:{ fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: colors.white },
  heroTitle:  { fontFamily: fontFamily.serifBold, fontSize: fontSize.xxl, color: colors.ink, textAlign: 'center', marginBottom: spacing.sm },
  heroSub:    { fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.inkSoft, textAlign: 'center', lineHeight: 22 },

  sectionTitle:{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink, paddingHorizontal: spacing.md, marginBottom: spacing.md },

  featureRow:  { flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderBottomWidth: 1, borderBottomColor: colors.border, gap: spacing.md },
  featureEmoji:{ fontSize: 24, width: 32, textAlign: 'center' },
  featureInfo: { flex: 1 },
  featureTitle:{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },
  featureSub:  { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.inkMute, marginTop: 2 },

  planCard:    { flexDirection: 'row', alignItems: 'center', marginHorizontal: spacing.md, marginBottom: spacing.sm, backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, borderWidth: 1.5, borderColor: colors.border, position: 'relative' },
  planCardActive:   { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  planCardHighlight:{ borderColor: colors.gold },
  popularBadge:{ position: 'absolute', top: -10, right: spacing.md, backgroundColor: colors.gold, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  popularText: { fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.white },
  planRadio:   { marginRight: spacing.md },
  radioOuter:  { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioOuterActive:{ borderColor: colors.primary },
  radioInner:  { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  planInfo:    { flex: 1 },
  planLabel:   { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },
  planPer:     { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute },
  planPrice:   { fontFamily: fontFamily.serifBold, fontSize: fontSize.lg, color: colors.ink },

  ctaBlock:  { paddingHorizontal: spacing.md, paddingTop: spacing.xl },
  ctaNote:   { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute, textAlign: 'center', marginTop: spacing.sm },
});
