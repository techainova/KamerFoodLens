// src/components/ui/WFInput.tsx
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import { colors, fontFamily, fontSize, radius, spacing2 } from '@/constants/theme';

interface WFInputProps extends TextInputProps {
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
  editable = true,
  ...rest
}: WFInputProps) {
  const [focused, setFocused] = useState(false);

  const borderColor = error
    ? colors.error
    : focused
    ? colors.borderFocus
    : colors.border;

  const borderWidth = (error || focused) ? 1.5 : 1;

  return (
    <View style={styles.wrapper}>
      {label ? (
        <Text style={styles.label} accessibilityRole="text">{label}</Text>
      ) : null}

      <View
        style={[
          styles.inputRow,
          { borderColor, borderWidth },
          !editable && styles.disabled,
        ]}
      >
        {icon ? <View style={styles.iconLeft}>{icon}</View> : null}

        <TextInput
          style={[styles.input, icon ? styles.inputWithIcon : null, style]}
          placeholderTextColor={colors.fgDisabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={editable}
          accessible
          {...rest}
        />

        {trailing ? <View style={styles.trailing}>{trailing}</View> : null}
      </View>

      {error ? (
        <Text style={styles.error} accessibilityRole="text">{error}</Text>
      ) : hint ? (
        <Text style={styles.hint}>{hint}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing2.md },
  label: {
    fontFamily:   fontFamily.medium,
    fontSize:     fontSize.body,
    color:        colors.fg,
    marginBottom: spacing2.xs,
  },
  inputRow: {
    flexDirection:   'row',
    alignItems:      'center',
    borderRadius:    radius.sm,
    backgroundColor: colors.surface,
    minHeight:       48,
  },
  disabled: { opacity: 0.4 },
  iconLeft:  { paddingLeft: spacing2.md },
  input: {
    flex:             1,
    fontFamily:       fontFamily.regular,
    fontSize:         fontSize.body,
    color:            colors.fg,
    paddingHorizontal: spacing2.md,
    paddingVertical:   spacing2.sm,
  },
  inputWithIcon: { paddingLeft: spacing2.sm },
  trailing:  { paddingRight: spacing2.md },
  error: {
    fontFamily: fontFamily.regular,
    fontSize:   fontSize.caption,
    color:      colors.error,
    marginTop:  spacing2.xs,
  },
  hint: {
    fontFamily: fontFamily.regular,
    fontSize:   fontSize.caption,
    color:      colors.fgMuted,
    marginTop:  spacing2.xs,
  },
});
