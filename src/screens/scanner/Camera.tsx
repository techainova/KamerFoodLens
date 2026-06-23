import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, TouchableOpacity, StatusBar, Animated,
  SafeAreaView, Easing, Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { ScannerStackParams } from '@/navigation/types';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useFoodScanner } from '@/hooks/useFoodScanner';

type CameraNav = NativeStackNavigationProp<ScannerStackParams, 'Camera'>;
type Mode = 'photo' | 'audio' | 'text';

const FRAME_HEIGHT = 300;
const CORNER_SIZE  = 28;
const CORNER_W     = 4;
const SUCCESS_GREEN = '#2E7D32';
const ORANGE        = '#E8591A';

function CornerBrackets() {
  const positions = [
    { top: -2, left: -2,  borderTopWidth: CORNER_W, borderLeftWidth: CORNER_W },
    { top: -2, right: -2, borderTopWidth: CORNER_W, borderRightWidth: CORNER_W },
    { bottom: -2, left: -2,  borderBottomWidth: CORNER_W, borderLeftWidth: CORNER_W },
    { bottom: -2, right: -2, borderBottomWidth: CORNER_W, borderRightWidth: CORNER_W },
  ] as const;

  return (
    <>
      {positions.map((pos, i) => (
        <View
          key={i}
          style={{
            position: 'absolute',
            width: CORNER_SIZE,
            height: CORNER_SIZE,
            borderColor: SUCCESS_GREEN,
            borderRadius: 6,
            ...pos,
          }}
        />
      ))}
    </>
  );
}

export default function Camera() {
  const navigation = useNavigation<CameraNav>();
  const C = useColors();
  const { t } = useTranslation();
  const { isLoading, scanImage } = useFoodScanner();

  const [mode, setMode]         = useState<Mode>('photo');
  const [flashOn, setFlashOn]   = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) {
      requestPermission();
    }
  }, [permission, requestPermission]);

  // Scan line animation
  const scanAnim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: FRAME_HEIGHT - 2,
          duration: 2200,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.delay(200),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [scanAnim]);

  // Analyzing pulse animation
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (!isLoading) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => { loop.stop(); pulseAnim.setValue(1); };
  }, [isLoading, pulseAnim]);

  const handleScanResult = async (imageUri: string) => {
    try {
      const result = await scanImage(imageUri);
      navigation.navigate('Result', {
        scanId: `scan-${Date.now()}`,
        classId: result.classId,
        confidence: result.confidence,
        imageUri,
      });
    } catch (err) {
      const detail = __DEV__ && err instanceof Error ? `\n\n${err.message}` : '';
      Alert.alert(t('scanner.errorTitle'), t('scanner.errorMsg') + detail);
    }
  };

  const handleCapture = async () => {
    if (isLoading || !cameraRef.current) return;
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });
      if (photo?.uri) await handleScanResult(photo.uri);
    } catch {
      Alert.alert(t('scanner.errorTitle'), t('scanner.errorMsg'));
    }
  };

  const handlePickFromGallery = async () => {
    if (isLoading) return;
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) return;

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
    });
    if (pickerResult.canceled || !pickerResult.assets?.[0]) return;
    await handleScanResult(pickerResult.assets[0].uri);
  };

  const handleModeChange = (m: Mode) => {
    if (m === 'audio' || m === 'text') {
      navigation.navigate('AudioText');
      return;
    }
    setMode(m);
  };

  const MODES: { key: Mode; label: string }[] = [
    { key: 'photo', label: t('scanner.photo') },
    { key: 'audio', label: t('scanner.audio') },
    { key: 'text',  label: t('scanner.text') },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: '#0B0B0B' }}>
      <StatusBar barStyle="light-content" />

      {/* Caméra réelle (aperçu live) */}
      {permission?.granted ? (
        <CameraView
          ref={cameraRef}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          facing="back"
          flash={flashOn ? 'on' : 'off'}
        />
      ) : (
        <View style={{ position: 'absolute', inset: 0, backgroundColor: '#1A1410' }} />
      )}

      {/* Top bar */}
      <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }}>
        <View style={{ paddingHorizontal: 20, paddingTop: 8, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Close */}
          <TouchableOpacity
            style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.45)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }}
            onPress={() => navigation.goBack()}
          >
            <Icon name="X" size={18} color="#fff" />
          </TouchableOpacity>

          {/* KFL brand */}
          <Text style={{ fontFamily: 'PlayfairDisplay-Bold', color: '#fff', fontSize: 18, letterSpacing: 1 }}>KFL</Text>

          {/* Flash */}
          <TouchableOpacity
            style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: flashOn ? ORANGE : 'rgba(0,0,0,0.45)', borderWidth: 1, borderColor: flashOn ? ORANGE : 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center' }}
            onPress={() => setFlashOn(!flashOn)}
          >
            <Icon name="Zap" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Scanner frame */}
      <View style={{ position: 'absolute', top: 170, left: 36, right: 36, height: FRAME_HEIGHT }}>
        <View style={{ flex: 1, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(46,125,50,0.3)' }}>
          <CornerBrackets />

          {/* Animated scan line */}
          <Animated.View style={{
            position: 'absolute', left: 8, right: 8, height: 2,
            backgroundColor: SUCCESS_GREEN,
            opacity: 0.85,
            transform: [{ translateY: scanAnim }],
          }}>
            {/* Glow */}
            <View style={{ position: 'absolute', top: -4, left: 0, right: 0, height: 10, backgroundColor: SUCCESS_GREEN, opacity: 0.25, borderRadius: 5 }} />
          </Animated.View>
        </View>
      </View>

      {/* Instruction text */}
      <View style={{ position: 'absolute', top: 488, left: 0, right: 0, alignItems: 'center', paddingHorizontal: 40 }}>
        {isLoading ? (
          <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
            <View style={{ backgroundColor: 'rgba(0,0,0,0.65)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: SUCCESS_GREEN }} />
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{t('scanner.analyzing')}</Text>
            </View>
          </Animated.View>
        ) : (
          <View style={{ backgroundColor: 'rgba(0,0,0,0.55)', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 }}>
            <Text style={{ color: '#fff', fontSize: 13, textAlign: 'center', lineHeight: 18 }}>{t('scanner.frame')}</Text>
          </View>
        )}
      </View>

      {/* Mode selector */}
      <View style={{ position: 'absolute', bottom: 138, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 }}>
        {MODES.map((m) => (
          <TouchableOpacity
            key={m.key}
            onPress={() => handleModeChange(m.key)}
            style={{
              paddingHorizontal: 18, paddingVertical: 7, borderRadius: 20,
              backgroundColor: mode === m.key ? ORANGE : 'rgba(255,255,255,0.12)',
              borderWidth: 1, borderColor: mode === m.key ? ORANGE : 'rgba(255,255,255,0.25)',
            }}
          >
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: mode === m.key ? '700' : '500' }}>
              {m.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Bottom controls */}
      <View style={{ position: 'absolute', bottom: 40, left: 0, right: 0, paddingHorizontal: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Gallery */}
        <TouchableOpacity onPress={handlePickFromGallery} disabled={isLoading} style={{ alignItems: 'center', gap: 6 }}>
          <View style={{ width: 50, height: 50, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Bookmark" size={22} color="rgba(255,255,255,0.7)" />
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>{t('scanner.gallery')}</Text>
        </TouchableOpacity>

        {/* Capture button */}
        <TouchableOpacity
          onPress={handleCapture}
          disabled={isLoading}
          style={{ alignItems: 'center', justifyContent: 'center' }}
          activeOpacity={0.85}
        >
          <View style={{ width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: SUCCESS_GREEN, padding: 5, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ flex: 1, width: '100%', borderRadius: 35, backgroundColor: isLoading ? 'rgba(255,255,255,0.4)' : '#fff' }} />
          </View>
        </TouchableOpacity>

        {/* Audio/Text toggle */}
        <TouchableOpacity
          style={{ alignItems: 'center', gap: 6 }}
          onPress={() => navigation.navigate('AudioText')}
        >
          <View style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Mic" size={22} color="rgba(255,255,255,0.7)" />
          </View>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>{t('scanner.audio')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
