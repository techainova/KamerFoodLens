// src/screens/admin/AdminLogin.tsx
// Connexion admin — email + mot de passe + 2FA TOTP 6 chiffres

import React, { useState, useRef } from 'react';
import {
  StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { WFInput } from '@/components/ui';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

const ADMIN_EMAIL    = 'admin@kmerfoodlens.com';
const ADMIN_PASSWORD = 'admin2026';
const ADMIN_TOTP     = '482';

export default function AdminLogin() {
  const navigation  = useNavigation();
  const [step, setStep]         = useState<1 | 2>(1);
  const [email, setEmail]       = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState(ADMIN_PASSWORD);
  const [code, setCode]         = useState(['', '', '', '', '', '']);
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  function validateStep1() {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setStep(2);
      setError('');
    } else {
      setError('Identifiants incorrects');
    }
  }

  function onCodeChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (index === 5 && value) {
      validateTOTP([...newCode]);
    }
  }

  async function validateTOTP(digits: string[]) {
    const entered = digits.join('');
    if (entered.length < 6) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    if (entered === ADMIN_TOTP + '000'.slice(0, 6 - ADMIN_TOTP.length)) {
      navigation.navigate('AdminDashboard' as never);
    } else if (digits.slice(0, 3).join('') === ADMIN_TOTP) {
      navigation.navigate('AdminDashboard' as never);
    } else {
      setError('Code TOTP incorrect. Utilisez : 482XXX');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.container}>

        {/* Logo */}
        <View style={styles.logoBlock}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>KFL</Text>
          </View>
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>ADMIN</Text>
          </View>
        </View>

        <Text style={styles.title}>Panneau d'administration</Text>
        <Text style={styles.sub}>TechAINova — Acces restreint</Text>

        {/* Etape 1 — Identifiants */}
        {step === 1 && (
          <View style={styles.form}>
            <WFInput
              label="EMAIL"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="admin@kmerfoodlens.com"
            />
            <WFInput
              label="MOT DE PASSE"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholder="••••••••"
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TouchableOpacity
              style={styles.submitBtn}
              onPress={validateStep1}
              accessibilityLabel="Continuer"
            >
              <Text style={styles.submitText}>Continuer</Text>
            </TouchableOpacity>
            <Text style={styles.hint}>
              Test : {ADMIN_EMAIL} / {ADMIN_PASSWORD}
            </Text>
          </View>
        )}

        {/* Etape 2 — Code TOTP */}
        {step === 2 && (
          <View style={styles.totpBlock}>
            <Text style={styles.totpTitle}>Verification 2FA</Text>
            <Text style={styles.totpSub}>
              Entrez le code de votre application d'authentification
            </Text>

            <View style={styles.codeRow}>
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => { inputRefs.current[index] = ref; }}
                  style={[styles.codeInput, digit && styles.codeInputFilled]}
                  value={digit}
                  onChangeText={(v) => onCodeChange(index, v)}
                  keyboardType="number-pad"
                  maxLength={1}
                  textAlign="center"
                  autoFocus={index === 0}
                  accessibilityLabel={`Chiffre ${index + 1}`}
                />
              ))}
            </View>

            {error ? <Text style={styles.error}>{error}</Text> : null}
            {loading && <ActivityIndicator color={colors.primary} style={styles.loader} />}
            <Text style={styles.hint}>Code de test : 482 (+ 3 chiffres quelconques)</Text>

            <TouchableOpacity onPress={() => { setStep(1); setCode(['','','','','','']); setError(''); }}>
              <Text style={styles.backLink}>Retour</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:       { flex: 1, backgroundColor: colors.ink },
  container:  { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  logoBlock:  { position: 'relative', marginBottom: spacing.lg },
  logoCircle: { width: 80, height: 80, borderRadius: 40, borderWidth: 2, borderColor: colors.white, alignItems: 'center', justifyContent: 'center' },
  logoText:   { fontFamily: fontFamily.serifBold, fontSize: 24, color: colors.white },
  adminBadge: { position: 'absolute', bottom: -8, alignSelf: 'center', backgroundColor: colors.primary, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  adminBadgeText: { fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.white },
  title:  { fontFamily: fontFamily.serifBold, fontSize: fontSize.xl, color: colors.white, textAlign: 'center', marginBottom: 4 },
  sub:    { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.inkMute, textAlign: 'center', marginBottom: spacing.xl },
  form:   { width: '100%', gap: spacing.sm },
  error:  { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.error, textAlign: 'center' },
  submitBtn: { backgroundColor: colors.primary, borderRadius: radius.full, paddingVertical: spacing.md, alignItems: 'center', marginTop: spacing.sm },
  submitText:{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.white },
  hint:   { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute, textAlign: 'center', marginTop: spacing.sm },
  totpBlock:  { width: '100%', alignItems: 'center', gap: spacing.md },
  totpTitle:  { fontFamily: fontFamily.bold, fontSize: fontSize.lg, color: colors.white },
  totpSub:    { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.inkMute, textAlign: 'center' },
  codeRow:    { flexDirection: 'row', gap: spacing.sm },
  codeInput:  { width: 44, height: 52, borderRadius: radius.md, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)', backgroundColor: 'rgba(255,255,255,0.05)', fontFamily: fontFamily.serifBold, fontSize: fontSize.xl, color: colors.white },
  codeInputFilled: { borderColor: colors.primary, backgroundColor: 'rgba(232,89,26,0.1)' },
  loader:     { marginTop: spacing.sm },
  backLink:   { fontFamily: fontFamily.medium, fontSize: fontSize.md, color: colors.inkMute, marginTop: spacing.sm },
});
