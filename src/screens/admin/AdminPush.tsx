// src/screens/admin/AdminPush.tsx
// Envoi notifications push depuis l'admin

import React, { useState } from 'react';
import {
  ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { WFButton } from '@/components/ui';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

type Audience = 'all' | 'standard' | 'pro' | 'segment';

export default function AdminPush() {
  const navigation  = useNavigation();
  const [audience, setAudience] = useState<Audience>('all');
  const [title, setTitle]       = useState('');
  const [message, setMessage]   = useState('');
  const [sent, setSent]         = useState(false);

  const AUDIENCE_OPTIONS: { key: Audience; label: string; count: string }[] = [
    { key: 'all',      label: 'Tous les utilisateurs', count: '12 847' },
    { key: 'standard', label: 'Standard uniquement',   count: '12 505' },
    { key: 'pro',      label: 'Pro uniquement',        count: '342' },
    { key: 'segment',  label: 'Segment personnalise',  count: '—' },
  ];

  function handleSend() {
    if (!title.trim() || !message.trim()) return;
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backIcon}>x</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Notification Push</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.form}>

        {/* Audience */}
        <Text style={styles.label}>AUDIENCE</Text>
        {AUDIENCE_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            onPress={() => setAudience(opt.key)}
            style={[styles.audienceRow, audience === opt.key && styles.audienceRowActive]}
            accessibilityLabel={opt.label}
          >
            <View style={[styles.radio, audience === opt.key && styles.radioActive]}>
              {audience === opt.key && <View style={styles.radioInner} />}
            </View>
            <Text style={styles.audienceLabel}>{opt.label}</Text>
            <Text style={styles.audienceCount}>{opt.count}</Text>
          </TouchableOpacity>
        ))}

        {/* Titre */}
        <Text style={[styles.label, { marginTop: spacing.lg }]}>TITRE</Text>
        <TextInput
          style={styles.inputField}
          value={title}
          onChangeText={setTitle}
          placeholder="Titre de la notification"
          placeholderTextColor={colors.inkMute}
          maxLength={60}
          accessibilityLabel="Titre"
        />
        <Text style={styles.charCount}>{title.length}/60</Text>

        {/* Message */}
        <Text style={styles.label}>MESSAGE</Text>
        <TextInput
          style={[styles.inputField, styles.messageField]}
          value={message}
          onChangeText={setMessage}
          placeholder="Contenu de la notification..."
          placeholderTextColor={colors.inkMute}
          multiline
          maxLength={150}
          textAlignVertical="top"
          accessibilityLabel="Message"
        />
        <Text style={styles.charCount}>{message.length}/150</Text>

        {/* Preview */}
        {(title || message) ? (
          <View style={styles.preview}>
            <Text style={styles.previewLabel}>APERCU / Preview</Text>
            <View style={styles.previewCard}>
              <Text style={styles.previewTitle}>{title || 'Titre...'}</Text>
              <Text style={styles.previewMessage}>{message || 'Message...'}</Text>
            </View>
          </View>
        ) : null}

        {/* Actions */}
        {sent ? (
          <View style={styles.successMsg}>
            <Text style={styles.successText}>Notification envoyee avec succes !</Text>
          </View>
        ) : (
          <View style={styles.actionBtns}>
            <TouchableOpacity style={styles.scheduleBtn}>
              <Text style={styles.scheduleBtnText}>Planifier</Text>
            </TouchableOpacity>
            <View style={styles.sendBtnWrap}>
              <WFButton
                label="Envoyer maintenant"
                onPress={handleSend}
                disabled={!title.trim() || !message.trim()}
                fullWidth
              />
            </View>
          </View>
        )}

        <View style={{ height: 60 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.cream },
  header:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: colors.navy },
  backBtn: { padding: spacing.xs },
  backIcon:{ fontSize: 18, color: colors.white, fontWeight: 'bold' },
  title:   { fontFamily: fontFamily.bold, fontSize: fontSize.lg, color: colors.white },
  form:    { padding: spacing.md },
  label:   { fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.inkMute, letterSpacing: 1, marginBottom: spacing.sm },

  audienceRow:     { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface, borderRadius: radius.md, padding: spacing.md, marginBottom: spacing.sm, borderWidth: 1, borderColor: colors.border, gap: spacing.md },
  audienceRowActive:{ borderColor: colors.primary, backgroundColor: colors.primarySoft },
  radio:           { width: 18, height: 18, borderRadius: 9, borderWidth: 2, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  radioActive:     { borderColor: colors.primary },
  radioInner:      { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  audienceLabel:   { flex: 1, fontFamily: fontFamily.medium, fontSize: fontSize.md, color: colors.ink },
  audienceCount:   { fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: colors.primary },

  inputField: { backgroundColor: colors.surface, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, fontFamily: fontFamily.regular, fontSize: fontSize.base, color: colors.ink, marginBottom: 4 },
  messageField:   { height: 100, textAlignVertical: 'top' },
  charCount:      { fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute, textAlign: 'right', marginBottom: spacing.md },

  preview:        { marginTop: spacing.md, marginBottom: spacing.md },
  previewLabel:   { fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.inkMute, letterSpacing: 1, marginBottom: spacing.sm },
  previewCard:    { backgroundColor: colors.ink, borderRadius: radius.md, padding: spacing.md },
  previewTitle:   { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.white, marginBottom: 4 },
  previewMessage: { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: 'rgba(255,255,255,0.7)' },

  actionBtns:     { flexDirection: 'row', gap: spacing.sm, alignItems: 'center', marginTop: spacing.md },
  scheduleBtn:    { borderWidth: 1.5, borderColor: colors.border, borderRadius: radius.full, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm },
  scheduleBtnText:{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.inkSoft },
  sendBtnWrap:    { flex: 1 },

  successMsg:  { backgroundColor: colors.successSoft, borderRadius: radius.md, padding: spacing.md, alignItems: 'center', marginTop: spacing.md },
  successText: { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.success },
});
