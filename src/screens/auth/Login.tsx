// src/screens/auth/Login.tsx
// Écran de connexion — email + mot de passe + OAuth

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
import { useLogin } from '@/hooks/useLogin';
import { WFButton, WFInput } from '@/components/ui';
import { colors, fontFamily, fontSize, spacing } from '@/constants/theme';

export default function Login() {
  const { form, errors, loading, updateField, submit, goSignup } = useLogin();

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
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.titleEN}>Sign in to continue</Text>
        </View>

        {/* Formulaire */}
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
          label="MOT DE PASSE / Password"
          placeholder="••••••••"
          value={form.password}
          onChangeText={(v) => updateField('password', v)}
          secureTextEntry
          error={errors.password}
        />

        {/* Mot de passe oublié */}
        <TouchableOpacity style={styles.forgotRow}>
          <Text style={styles.forgotText}>
            Mot de passe oublié ? / Forgot password?
          </Text>
        </TouchableOpacity>

        {/* Erreur générale */}
        {errors.general ? (
          <Text style={styles.errorGeneral}>{errors.general}</Text>
        ) : null}

        {/* Bouton connexion */}
        <WFButton
          label="Se Connecter / Sign In"
          onPress={submit}
          loading={loading}
          fullWidth
          size="lg"
        />

        {/* Séparateur */}
        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>— OU / OR —</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* OAuth */}
        <WFButton
          label="Continuer avec Google / Continue with Google"
          onPress={() => {}}
          variant="secondary"
          fullWidth
          size="lg"
        />

        <View style={{ height: spacing.sm }} />

        <WFButton
          label="Continuer avec Apple / Continue with Apple"
          onPress={() => {}}
          variant="ghost"
          fullWidth
          size="lg"
        />

        {/* Lien inscription */}
        <View style={styles.signupRow}>
          <Text style={styles.signupHint}>
            Pas de compte ? / No account?{' '}
          </Text>
          <TouchableOpacity onPress={goSignup}>
            <Text style={styles.signupLink}>S'inscrire / Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex:      { flex: 1, backgroundColor: colors.cream },
  container: {
    flexGrow:          1,
    paddingHorizontal: spacing.lg,
    paddingTop:        60,
    paddingBottom:     40,
  },
  header: { marginBottom: spacing.xl },
  title: {
    fontFamily:   fontFamily.serifBold,
    fontSize:     fontSize.h2,
    color:        colors.ink,
    marginBottom: 4,
  },
  titleEN: {
    fontFamily: fontFamily.regular,
    fontSize:   fontSize.md,
    color:      colors.inkMute,
    fontStyle:  'italic',
  },
  forgotRow: { alignItems: 'flex-end', marginTop: -spacing.sm, marginBottom: spacing.lg },
  forgotText: {
    fontFamily: fontFamily.medium,
    fontSize:   fontSize.sm,
    color:      colors.primary,
  },
  errorGeneral: {
    fontFamily:   fontFamily.regular,
    fontSize:     fontSize.sm,
    color:        colors.error,
    textAlign:    'center',
    marginBottom: spacing.md,
  },
  separator: {
    flexDirection:  'row',
    alignItems:     'center',
    marginVertical: spacing.lg,
    gap:            spacing.sm,
  },
  separatorLine: { flex: 1, height: 1, backgroundColor: colors.border },
  separatorText: {
    fontFamily: fontFamily.regular,
    fontSize:   fontSize.sm,
    color:      colors.inkMute,
  },
  signupRow: {
    flexDirection:  'row',
    justifyContent: 'center',
    marginTop:      spacing.xl,
  },
  signupHint: {
    fontFamily: fontFamily.regular,
    fontSize:   fontSize.md,
    color:      colors.inkSoft,
  },
  signupLink: {
    fontFamily: fontFamily.bold,
    fontSize:   fontSize.md,
    color:      colors.primary,
  },
});
