// src/screens/auth/OTP.tsx
// Vérification email — 4 chiffres + countdown renvoi

import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useOTP } from '@/hooks/useOTP';
import { WFButton } from '@/components/ui';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

export default function OTP() {
  const {
    maskedEmail, code, error, loading, countdown,
    inputRefs, onChangeDigit, onKeyPress, resendCode, changeEmail,
  } = useOTP();

  return (
    <View style={styles.container}>
      {/* Icône email */}
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>✉️</Text>
        <View style={styles.successDot}>
          <Text style={styles.successCheck}>✓</Text>
        </View>
      </View>

      {/* Titre */}
      <Text style={styles.title}>Vérifiez votre email</Text>
      <Text style={styles.titleEN}>Verify your email</Text>

      <Text style={styles.subtitle}>
        Code envoyé à {maskedEmail}
      </Text>
      <Text style={styles.subtitleEN}>Code sent to {maskedEmail}</Text>

      {/* Champs OTP */}
      <View style={styles.codeRow}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => { inputRefs.current[index] = ref; }}
            style={[
              styles.codeInput,
              digit ? styles.codeInputFilled : null,
              error ? styles.codeInputError : null,
            ]}
            value={digit}
            onChangeText={(v) => onChangeDigit(index, v)}
            onKeyPress={({ nativeEvent }) => onKeyPress(index, nativeEvent.key)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
            selectTextOnFocus
            accessibilityLabel={`Chiffre ${index + 1}`}
          />
        ))}
      </View>

      {/* Erreur */}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Loading */}
      {loading && (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      )}

      {/* Bouton vérifier */}
      <WFButton
        label="Vérifier / Verify"
        onPress={() => {}}
        fullWidth
        size="lg"
        disabled={code.join('').length < 4 || loading}
      />

      {/* Renvoi */}
      <View style={styles.resendRow}>
        <Text style={styles.resendHint}>
          {countdown > 0
            ? `Renvoyer dans ${countdown}s / Resend in ${countdown}s`
            : ''}
        </Text>
        {countdown === 0 && (
          <TouchableOpacity onPress={resendCode}>
            <Text style={styles.resendLink}>
              Renvoyer le code / Resend code
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Changer email */}
      <TouchableOpacity onPress={changeEmail} style={styles.changeEmail}>
        <Text style={styles.changeEmailText}>
          Changer d'email / Change email
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex:              1,
    backgroundColor:   colors.cream,
    alignItems:        'center',
    paddingHorizontal: spacing.xl,
    paddingTop:        80,
  },
  iconWrap: {
    position:     'relative',
    marginBottom: spacing.lg,
  },
  icon: { fontSize: 64 },
  successDot: {
    position:        'absolute',
    bottom:          0,
    right:           -4,
    width:           24,
    height:          24,
    borderRadius:    12,
    backgroundColor: colors.success,
    alignItems:      'center',
    justifyContent:  'center',
    borderWidth:     2,
    borderColor:     colors.cream,
  },
  successCheck: { color: colors.white, fontSize: 12, fontFamily: 'bold' },
  title: {
    fontFamily:   fontFamily.serifBold,
    fontSize:     fontSize.xxl,
    color:        colors.ink,
    marginBottom: 4,
    textAlign:    'center',
  },
  titleEN: {
    fontFamily:   fontFamily.regular,
    fontSize:     fontSize.md,
    color:        colors.inkMute,
    fontStyle:    'italic',
    marginBottom: spacing.sm,
    textAlign:    'center',
  },
  subtitle: {
    fontFamily: fontFamily.regular,
    fontSize:   fontSize.base,
    color:      colors.inkSoft,
    textAlign:  'center',
  },
  subtitleEN: {
    fontFamily:   fontFamily.regular,
    fontSize:     fontSize.sm,
    color:        colors.inkMute,
    fontStyle:    'italic',
    textAlign:    'center',
    marginBottom: spacing.xl,
  },
  codeRow: {
    flexDirection:   'row',
    gap:             spacing.md,
    marginBottom:    spacing.md,
  },
  codeInput: {
    width:           56,
    height:          64,
    borderRadius:    radius.md,
    borderWidth:     1.5,
    borderColor:     colors.border,
    backgroundColor: colors.surface,
    fontFamily:      fontFamily.serifBold,
    fontSize:        fontSize.xxl,
    color:           colors.ink,
  },
  codeInputFilled: { borderColor: colors.primary },
  codeInputError:  { borderColor: colors.error },
  error: {
    fontFamily:   fontFamily.regular,
    fontSize:     fontSize.sm,
    color:        colors.error,
    marginBottom: spacing.md,
    textAlign:    'center',
  },
  loader:       { marginBottom: spacing.md },
  resendRow:    { marginTop: spacing.lg, alignItems: 'center' },
  resendHint: {
    fontFamily: fontFamily.regular,
    fontSize:   fontSize.sm,
    color:      colors.inkMute,
  },
  resendLink: {
    fontFamily: fontFamily.bold,
    fontSize:   fontSize.md,
    color:      colors.primary,
  },
  changeEmail: { marginTop: spacing.lg },
  changeEmailText: {
    fontFamily: fontFamily.medium,
    fontSize:   fontSize.md,
    color:      colors.inkSoft,
  },
});
