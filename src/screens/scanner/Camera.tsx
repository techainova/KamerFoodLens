// src/screens/scanner/Camera.tsx
// Écran caméra scanner IA — capture + modes Photo/Audio/Texte

import React, { useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useScanner } from '@/hooks/useScanner';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

export default function Camera() {
  const { t }          = useTranslation();
  const navigation     = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<'back' | 'front'>('back');
  const cameraRef      = React.useRef<any>(null);

  const { mode, status, error, setMode, scanImage } = useScanner();

  // Permission non accordée
  if (!permission) {
    return <View style={styles.center}><ActivityIndicator color={colors.primary} /></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={styles.permText}>Accès à la caméra requis</Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Autoriser</Text>
        </TouchableOpacity>
      </View>
    );
  }

  async function takePhoto() {
    if (!cameraRef.current || status === 'analyzing') return;
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64:  true,
      });
      if (photo.base64) await scanImage(photo.base64);
    } catch {
      // Erreur gérée dans useScanner
    }
  }

  return (
    <View style={styles.container}>
      {/* Caméra */}
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.closeBtn}
            accessibilityLabel="Fermer"
          >
            <Text style={styles.closeBtnText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('scanner.title')}</Text>
          <TouchableOpacity
            onPress={() => setFacing(facing === 'back' ? 'front' : 'back')}
            style={styles.flipBtn}
            accessibilityLabel="Retourner la caméra"
          >
            <Text style={styles.flipIcon}>🔄</Text>
          </TouchableOpacity>
        </View>

        {/* Overlay laser */}
        <View style={styles.laserOverlay}>
          <View style={styles.laserBox}>
            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
        </View>

        {/* Indicateur analyse */}
        {status === 'analyzing' && (
          <View style={styles.analyzingBadge}>
            <ActivityIndicator color={colors.white} size="small" />
            <Text style={styles.analyzingText}>{t('scanner.analyzing')}</Text>
          </View>
        )}

        {/* Erreur */}
        {error ? (
          <View style={styles.errorBadge}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}
      </CameraView>

      {/* Contrôles bas */}
      <View style={styles.controls}>
        {/* Modes */}
        <View style={styles.modesRow}>
          {(['photo', 'audio', 'text'] as const).map((m) => (
            <TouchableOpacity
              key={m}
              onPress={() => setMode(m)}
              style={[styles.modeBtn, mode === m && styles.modeBtnActive]}
              accessibilityLabel={t(`scanner.${m}`)}
            >
              <Text style={[styles.modeBtnText, mode === m && styles.modeBtnTextActive]}>
                {m === 'photo' ? t('scanner.photo') : m === 'audio' ? t('scanner.audio') : t('scanner.text')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Bouton capture */}
        {mode === 'photo' && (
          <TouchableOpacity
            style={[styles.captureBtn, status === 'analyzing' && styles.captureBtnDisabled]}
            onPress={takePhoto}
            disabled={status === 'analyzing'}
            accessibilityRole="button"
            accessibilityLabel="Prendre une photo"
          >
            <View style={styles.captureInner} />
          </TouchableOpacity>
        )}

        {/* Audio / Texte */}
        {mode !== 'photo' && (
          <TouchableOpacity
            style={styles.altModeBtn}
            onPress={() => navigation.navigate('AudioText' as any)}
            accessibilityRole="button"
          >
            <Text style={styles.altModeBtnText}>
              {mode === 'audio' ? '🎙 ' + t('scanner.describeVoice') : '✏️ ' + t('scanner.describeText')}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const CORNER_SIZE = 24;

const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: colors.black },
  center:     { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.cream },
  permText:   { fontFamily: fontFamily.regular, fontSize: fontSize.md, color: colors.ink, marginBottom: spacing.md },
  permBtn:    { backgroundColor: colors.primary, borderRadius: radius.full, paddingHorizontal: spacing.xl, paddingVertical: spacing.sm },
  permBtnText:{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.white },

  camera: { flex: 1 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: 56, paddingHorizontal: spacing.md,
  },
  closeBtn:     { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' },
  closeBtnText: { fontSize: 16, color: colors.white },
  headerTitle:  { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.white },
  flipBtn:      { width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
  flipIcon:     { fontSize: 20 },

  laserOverlay: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  laserBox:     { width: 240, height: 240, position: 'relative' },
  corner:       { position: 'absolute', width: CORNER_SIZE, height: CORNER_SIZE, borderColor: colors.white, borderWidth: 3 },
  cornerTL:     { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0 },
  cornerTR:     { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0 },
  cornerBL:     { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0 },
  cornerBR:     { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0 },

  analyzingBadge:{
    position: 'absolute', bottom: 20, alignSelf: 'center',
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: 'rgba(0,0,0,0.7)', borderRadius: radius.full,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  analyzingText:{ fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.white },
  errorBadge:   {
    position: 'absolute', bottom: 20, alignSelf: 'center',
    backgroundColor: colors.error, borderRadius: radius.sm,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
  },
  errorText:    { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.white },

  controls: { backgroundColor: colors.ink, paddingBottom: 40, paddingTop: spacing.md },
  modesRow: { flexDirection: 'row', justifyContent: 'center', gap: spacing.sm, marginBottom: spacing.md },
  modeBtn:  { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)' },
  modeBtnActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  modeBtnText:   { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.inkMute },
  modeBtnTextActive: { color: colors.white },

  captureBtn: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: colors.white, alignSelf: 'center',
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 4, borderColor: 'rgba(255,255,255,0.3)',
  },
  captureBtnDisabled: { opacity: 0.5 },
  captureInner: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.white },

  altModeBtn: {
    marginHorizontal: spacing.xl, paddingVertical: spacing.md,
    backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: radius.md,
    alignItems: 'center',
  },
  altModeBtnText: { fontFamily: fontFamily.medium, fontSize: fontSize.md, color: colors.white },
});
