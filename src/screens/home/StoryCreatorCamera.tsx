// src/screens/home/StoryCreatorCamera.tsx
import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, StatusBar } from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParams } from '@/navigation/types';
import { useTranslation } from 'react-i18next';
import { CameraView, useCameraPermissions, type CameraType } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import Icon from '@/components/ui/Icon';

type Nav = NativeStackNavigationProp<HomeStackParams, 'StoryCreatorCamera'>;

export default function StoryCreatorCamera() {
  const navigation = useNavigation<Nav>();
  const isFocused = useIsFocused();
  const { t } = useTranslation();

  const [facing, setFacing] = useState<CameraType>('back');
  const [flashOn, setFlashOn] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [cameraKey, setCameraKey] = useState(0);

  useEffect(() => {
    if (permission && !permission.granted && permission.canAskAgain) requestPermission();
  }, [permission, requestPermission]);

  useEffect(() => { if (isFocused) setCameraKey((k) => k + 1); }, [isFocused]);

  const handleCapture = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.85, base64: true });
      if (photo?.uri && photo.base64) {
        navigation.navigate('AddStory', { uri: photo.uri, base64: photo.base64 });
      }
    } finally {
      setCapturing(false);
    }
  };

  const handleGallery = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) return;
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.85, mediaTypes: ['images'], base64: true });
    if (!result.canceled && result.assets?.[0]?.base64) {
      navigation.navigate('AddStory', { uri: result.assets[0].uri, base64: result.assets[0].base64 });
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" />

      {permission?.granted && isFocused ? (
        <CameraView
          key={cameraKey}
          ref={cameraRef}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          facing={facing}
          flash={flashOn ? 'on' : 'off'}
        />
      ) : (
        <View style={{ position: 'absolute', inset: 0, backgroundColor: '#1A1410' }} />
      )}

      <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 8 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="X" size={18} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setFlashOn((f) => !f)}
            style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: flashOn ? '#E8591A' : 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="Zap" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <View style={{ position: 'absolute', bottom: 40, left: 0, right: 0, paddingHorizontal: 32 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <TouchableOpacity
            onPress={() => void handleGallery()}
            style={{ width: 50, height: 50, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="Image" size={22} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => void handleCapture()} disabled={capturing} activeOpacity={0.85}>
            <View style={{ width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: '#fff', padding: 5 }}>
              <View style={{ flex: 1, borderRadius: 35, backgroundColor: capturing ? 'rgba(255,255,255,0.5)' : '#fff' }} />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setFacing((f) => (f === 'back' ? 'front' : 'back'))}
            style={{ width: 50, height: 50, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', backgroundColor: 'rgba(255,255,255,0.08)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Icon name="RefreshCw" size={22} color="rgba(255,255,255,0.8)" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('AddStory', { textOnly: true })}
          style={{ alignSelf: 'center', marginTop: 20, paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.15)' }}
        >
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{t('home.storyTextOnly')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
