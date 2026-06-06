// src/screens/auth/Signup.tsx
// Écran d'inscription — formulaire 2 étapes

import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSignup } from '@/hooks/useSignup';
import { WFButton, WFInput } from '@/components/ui';
import { colors, fontFamily, fontSize, spacing } from '@/constants/theme';

const STRENGTH_COLOR: Record<string, string> = {
  weak:   colors.error,
  medium: colors.gold,
  strong: colors.success,
};

export default function Signup() {
  const {
    form, errors, loading, step,
    passwordStrength, updateField, nextStep, submit, goLogin,
  } = useSignup();

  const strength = passwordStrength();

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.stepLabel}>{step} / 2</Text>
          <Text style={styles.title}>Créer un compte</Text>
          <Text style={styles.titleEN}>Create Account</Text>

          {/* Barre progression */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: step === 1 ? '50%' : '100%' }]} />
          </View>
        </View>

        {/* ÉTAPE 1 */}
        {step === 1 && (
          <>
            <View style={styles.row}>
              <View style={styles.half}>
                <WFInput
                  label="PRÉNOM / First name"
                  placeholder="Amah"
                  value={form.firstName}
                  onChangeText={(v) => updateField('firstName', v)}
                  error={errors.firstName}
                />
              </View>
              <View style={styles.half}>
                <WFInput
                  label="NOM / Last name"
                  placeholder="Ndongo"
                  value={form.lastName}
                  onChangeText={(v) => updateField('lastName', v)}
                  error={errors.lastName}
                />
              </View>
            </View>

            <WFInput
              label="EMAIL / Email"
              placeholder="amah@example.com"
              value={form.email}
              onChangeText={(v) => updateField('email', v)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <WFInput
              label="TÉLÉPHONE / Phone"
              placeholder="+237 6XX XX XX XX"
              value={form.phone}
              onChangeText={(v) => updateField('phone', v)}
              keyboardType="phone-pad"
              error={errors.phone}
            />

            <WFButton label="Suivant / Next →" onPress={nextStep} fullWidth size="lg" />
          </>
        )}

        {/* ÉTAPE 2 */}
        {step === 2 && (
          <>
            <WFInput
              label="MOT DE PASSE / Password"
              placeholder="••••••••"
              value={form.password}
              onChangeText={(v) => updateField('password', v)}
              secureTextEntry
              error={errors.password}
            />

            {/* Indicateur de force */}
            {form.password.length > 0 && (
              <View style={styles.strengthRow}>
                <View style={[styles.strengthBar, { backgroundColor: STRENGTH_COLOR[strength] }]} />
                <Text style={[styles.strengthText, { color: STRENGTH_COLOR[strength] }]}>
                  Force : {strength === 'weak' ? 'Faible' : strength === 'medium' ? 'Moyenne' : 'Forte'}
                </Text>
              </View>
            )}

            <WFInput
              label="CONFIRMER / Confirm password"
              placeholder="••••••••"
              value={form.confirmPassword}
              onChangeText={(v) => updateField('confirmPassword', v)}
              secureTextEntry
              error={errors.confirmPassword}
            />

            {/* Checkbox CGU */}
            <TouchableOpacity
              style={styles.termsRow}
              onPress={() => updateField('acceptTerms', !form.acceptTerms)}
              accessibilityRole="checkbox"
            >
              <View style={[styles.checkbox, form.acceptTerms && styles.checkboxChecked]}>
                {form.acceptTerms && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.termsText}>
                J'accepte les{' '}
                <Text style={styles.termsLink}>CGU</Text>
                {' '}et la{' '}
                <Text style={styles.termsLink}>politique</Text>
              </Text>
            </TouchableOpacity>
            {errors.acceptTerms && (
              <Text style={styles.errorText}>{errors.acceptTerms}</Text>
            )}

            {errors.general && (
              <Text style={[styles.errorText, { textAlign: 'center', marginBottom: spacing.md }]}>
                {errors.general}
              </Text>
            )}

            <WFButton
              label="S'inscrire / Sign Up"
              onPress={submit}
              loading={loading}
              fullWidth
              size="lg"
            />
          </>
        )}

        {/* Lien connexion */}
        <View style={styles.loginRow}>
          <Text style={styles.loginHint}>Déjà un compte ? </Text>
          <TouchableOpacity onPress={goLogin}>
            <Text style={styles.loginLink}>Se connecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex:      { flex: 1, backgroundColor: colors.cream },
  container: { flexGrow: 1, paddingHorizontal: spacing.lg, paddingTop: 60, paddingBottom: 40 },
  header:    { marginBottom: spacing.xl },
  stepLabel: {
    fontFamily: fontFamily.medium,
    fontSize:   fontSize.sm,
    color:      colors.inkMute,
    marginBottom: 4,
  },
  title: {
    fontFamily:   fontFamily.serifBold,
    fontSize:     fontSize.xxl,
    color:        colors.ink,
    marginBottom: 2,
  },
  titleEN: {
    fontFamily:   fontFamily.regular,
    fontSize:     fontSize.md,
    color:        colors.inkMute,
    fontStyle:    'italic',
    marginBottom: spacing.md,
  },
  progressBar: {
    height: 4, backgroundColor: colors.border, borderRadius: 2,
  },
  progressFill: {
    height: 4, backgroundColor: colors.primary, borderRadius: 2,
  },
  row:  { flexDirection: 'row', gap: spacing.sm },
  half: { flex: 1 },
  strengthRow: {
    flexDirection: 'row', alignItems: 'center',
    marginTop: -spacing.sm, marginBottom: spacing.md, gap: spacing.sm,
  },
  strengthBar: { height: 4, flex: 1, borderRadius: 2 },
  strengthText: { fontFamily: fontFamily.medium, fontSize: fontSize.xs },
  termsRow: {
    flexDirection: 'row', alignItems: 'center',
    marginBottom: spacing.md, gap: spacing.sm,
  },
  checkbox: {
    width: 20, height: 20, borderRadius: 4,
    borderWidth: 1.5, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  checkboxChecked: { backgroundColor: colors.primary, borderColor: colors.primary },
  checkmark: { color: colors.white, fontSize: 12, fontFamily: fontFamily.bold },
  termsText: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.inkSoft, flex: 1 },
  termsLink: { color: colors.primary, fontFamily: fontFamily.bold },
  errorText: { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.error, marginBottom: spacing.sm },
  loginRow:  { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xl },
  loginHint: { fontFamily: fontFamily.regular, fontSize: fontSize.md, color: colors.inkSoft },
  loginLink: { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.primary },
});
