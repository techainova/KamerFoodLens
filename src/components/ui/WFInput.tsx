// src/components/ui/WFInput.tsx
// Champ de saisie KFL — label + input + erreur + hint

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

interface Props extends TextInputProps {
  label?:    string;
  error?:    string;
  hint?:     string;
  icon?:     React.ReactNode;
  trailing?: React.ReactNode;
}

export function WFInput({
  label,
  error,
  hint,
  icon,
  trailing,
  style,
  ...rest
}: Props) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.error
    : focused
    ? colors.primary
    : colors.border;

  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={[styles.inputRow, { borderColor }]}>
        {icon ? <View style={styles.iconLeft}>{icon}</View> : null}

        <TextInput
          style={[styles.input, icon ? styles.inputWithIcon : null, style]}
          placeholderTextColor={colors.inkMute}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />

        {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
      </View>

      {error ? (
        <Text style={styles.error}>{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper:       { marginBottom: spacing.md },
  label: {
    fontFamily:    fontFamily.semiBold,
    fontSize:      fontSize.sm,
    color:         colors.ink,
    marginBottom:  spacing.xs,
  },
  inputRow: {
    flexDirection:   'row',
    alignItems:      'center',
    borderWidth:     1.5,
    borderRadius:    radius.md,
    backgroundColor: colors.surface,
    minHeight:       48,
  },
  iconLeft:  { paddingLeft: spacing.md },
  input: {
    flex:       1,
    fontFamily: fontFamily.regular,
    fontSize:   fontSize.base,
    color:      colors.ink,
    paddingHorizontal: spacing.md,
    paddingVertical:   spacing.sm,
  },
  inputWithIcon: { paddingLeft: spacing.sm },
  trailing:  { paddingRight: spacing.md },
  error: {
    fontFamily: fontFamily.regular,
    fontSize:   fontSize.xs,
    color:      colors.error,
    marginTop:  spacing.xs,
  },
  hint: {
    fontFamily: fontFamily.regular,
    fontSize:   fontSize.xs,
    color:      colors.inkMute,
    marginTop:  spacing.xs,
  },
});
