import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, TextInput, Image, StatusBar, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useStoriesStore } from '@/store/stories.store';

export default function AddStory() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const addMyStory = useStoriesStore((s) => s.addMyStory);

  const [uri, setUri] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [publishing, setPublishing] = useState(false);

  const pickFrom = async (source: 'camera' | 'gallery') => {
    const result = source === 'camera'
      ? await ImagePicker.launchCameraAsync({ quality: 0.9, mediaTypes: ['images'] })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.9, mediaTypes: ['images'] });
    if (!result.canceled && result.assets?.[0]) setUri(result.assets[0].uri);
  };

  const handlePublish = () => {
    if (!uri) {
      Alert.alert(t('home.addStoryNoImageTitle'), t('home.addStoryNoImageMsg'));
      return;
    }
    setPublishing(true);
    setTimeout(() => {
      addMyStory({ uri, caption: caption.trim() || t('home.addStoryDefaultCaption'), createdAt: Date.now() });
      setPublishing(false);
      navigation.goBack();
    }, 500);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('home.addStoryTitle')}</Text>
      </View>

      <View style={{ flex: 1, padding: 16 }}>
        {uri ? (
          <View style={{ flex: 1, borderRadius: 20, overflow: 'hidden', backgroundColor: C.surface2 }}>
            <Image source={{ uri }} style={{ flex: 1 }} resizeMode="cover" />
            <TouchableOpacity
              onPress={() => setUri(null)}
              style={{ position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="X" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <View style={{ flex: 1, borderRadius: 20, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <Icon name="Camera" size={40} color={C.inkMute} />
            <Text style={{ color: C.inkMute, fontSize: 13 }}>{t('home.addStoryPlaceholder')}</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity onPress={() => pickFrom('camera')} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 42, paddingHorizontal: 16, borderRadius: 21, backgroundColor: C.primary }}>
                <Icon name="Camera" size={16} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{t('scanner.takePhoto')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => pickFrom('gallery')} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 42, paddingHorizontal: 16, borderRadius: 21, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
                <Icon name="Bookmark" size={16} color={C.inkSoft} />
                <Text style={{ color: C.inkSoft, fontSize: 13, fontWeight: '600' }}>{t('scanner.fromGallery')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
            {t('home.addStoryCaptionLabel')}
          </Text>
          <TextInput
            value={caption}
            onChangeText={setCaption}
            placeholder={t('home.addStoryCaptionPlaceholder')}
            placeholderTextColor={C.inkMute}
            multiline
            style={{ minHeight: 60, borderWidth: 1, borderColor: C.border, borderRadius: 14, backgroundColor: C.surface, padding: 12, fontSize: 14, color: C.ink }}
          />
        </View>

        <TouchableOpacity
          onPress={handlePublish}
          disabled={publishing}
          style={{ marginTop: 16, height: 52, borderRadius: 26, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }}
          activeOpacity={0.85}
        >
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>
            {publishing ? t('home.addStoryPublishing') : t('home.addStoryPublish')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
