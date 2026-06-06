// src/screens/scanner/AudioText.tsx
// Saisie description plat — voix ou texte

import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useScanner } from '@/hooks/useScanner';
import { WFButton } from '@/components/ui';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

export default function AudioText() {
  const { t }          = useTranslation();
  const navigation     = useNavigation();
  const [text, setText] = useState('');
  const [activeMode, setActiveMode] = useState<'voice' | 'text'>('text');

  const { status, scanAudioText } = useScanner();

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Retour">
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('scanner.title')}</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Modes */}
      <View style={styles.modesRow}>
        <TouchableOpacity
          style={[styles.modeBtn, activeMode === 'voice' && styles.modeBtnActive]}
          onPress={() => setActiveMode('voice')}
          accessibilityLabel="Mode vocal"
        >
          <Text style={styles.modeBtnText}>🎙 {t('scanner.audio')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeBtn, activeMode === 'text' && styles.modeBtnActive]}
          onPress={() => setActiveMode('text')}
          accessibilityLabel="Mode texte"
        >
          <Text style={styles.modeBtnText}>✏️ {t('scanner.text')}</Text>
        </TouchableOpacity>
      </View>

      {/* Zone saisie */}
      <View style={styles.inputArea}>
        {activeMode === 'text' ? (
          <TextInput
            style={styles.textInput}
            value={text}
            onChangeText={setText}
            placeholder={t('scanner.describeText')}
            placeholderTextColor={colors.inkMute}
            multiline
            autoFocus
            maxLength={500}
            accessibilityLabel={t('scanner.describeText')}
          />
        ) : (
          <View style={styles.voiceArea}>
            <TouchableOpacity
              style={styles.micBtn}
              accessibilityLabel={t('scanner.describeVoice')}
              accessibilityRole="button"
            >
              <Text style={styles.micIcon}>🎙</Text>
            </TouchableOpacity>
            <Text style={styles.voiceHint}>{t('scanner.describeVoice')}</Text>
          </View>
        )}
      </View>

      {/* Bouton analyser */}
      <View style={styles.footer}>
        {status === 'analyzing' ? (
          <View style={styles.analyzingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text style={styles.analyzingText}>{t('scanner.analyzing')}</Text>
          </View>
        ) : (
          <WFButton
            label="Scanner / Analyze"
            onPress={() => scanAudioText(text)}
            disabled={!text.trim() && activeMode === 'text'}
            fullWidth
            size="lg"
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.cream },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  backIcon:    { fontSize: 28, color: colors.ink },
  headerTitle: { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },
  modesRow:    { flexDirection: 'row', paddingHorizontal: spacing.md, gap: spacing.sm, marginBottom: spacing.md },
  modeBtn:     {
    flex: 1, paddingVertical: spacing.sm, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border, alignItems: 'center',
    backgroundColor: colors.surface,
  },
  modeBtnActive: { borderColor: colors.primary, backgroundColor: colors.primarySoft },
  modeBtnText:   { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.inkSoft },
  inputArea:   { flex: 1, marginHorizontal: spacing.md },
  textInput:   {
    flex: 1, fontFamily: fontFamily.regular, fontSize: fontSize.base,
    color: colors.ink, textAlignVertical: 'top', padding: spacing.md,
    backgroundColor: colors.surface, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border,
  },
  voiceArea:  { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.lg },
  micBtn:     {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  micIcon:    { fontSize: 40 },
  voiceHint:  { fontFamily: fontFamily.regular, fontSize: fontSize.md, color: colors.inkMute, textAlign: 'center' },
  footer:     { padding: spacing.md },
  analyzingRow:{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.md },
  analyzingText:{ fontFamily: fontFamily.medium, fontSize: fontSize.md, color: colors.inkSoft },
});
