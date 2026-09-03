import React, { useState } from 'react';
import {
  View, TextInput, ScrollView, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, Image, Alert, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useFeedStore } from '@/store/feed.store';
import type { CreatePostPayload } from '@/services/community.service';

const SUGGESTED_TAGS = ['#Mbongo', '#Ndolé', '#PouletDG', '#Kpwem', '#Achu', '#Cameroun', '#Recette'];

export default function CreatePost() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();

  const POST_TYPES: { key: CreatePostPayload['type']; label: string }[] = [
    { key: 'post', label: t('community.postTypePost') },
    { key: 'recipe', label: t('community.postTypeRecipe') },
    { key: 'review', label: t('community.postTypeReview') },
  ];

  const [postType, setPostType] = useState<CreatePostPayload['type']>('post');
  const [text, setText] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  const createPost = useFeedStore(s => s.createPost);

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) setTags(prev => [...prev, tag]);
  };

  const removeTag = (tag: string) => setTags(prev => prev.filter(x => x !== tag));

  const canPublish = text.trim().length > 0 && !publishing;

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.8, mediaTypes: ['images'], base64: true });
    if (!result.canceled && result.assets?.[0]) {
      setImageUri(result.assets[0].uri);
      setImageBase64(result.assets[0].base64 ?? null);
    }
  };

  const handlePublish = async () => {
    if (!canPublish) return;
    setPublishing(true);
    try {
      const content = tags.length > 0 ? `${text.trim()}\n\n${tags.join(' ')}` : text.trim();
      await createPost({
        content,
        type: postType,
        imageBase64: imageBase64 ?? undefined,
        mimeType: imageBase64 ? 'image/jpeg' : undefined,
      });
      navigation.goBack();
    } catch {
      Alert.alert(t('common.error'), t('community.postError'));
    } finally {
      setPublishing(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border, gap: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="X" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: C.ink }}>{t('community.newPostTitle')}</Text>
        <TouchableOpacity
          onPress={() => void handlePublish()}
          style={{ paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: canPublish ? '#E8591A' : '#E5E0D8', flexDirection: 'row', alignItems: 'center', gap: 6 }}
          disabled={!canPublish}
        >
          {publishing && <ActivityIndicator size="small" color="#fff" />}
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>{t('community.publish')}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

          {/* Type selector */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {POST_TYPES.map(({ key, label }) => (
                <TouchableOpacity
                  key={key}
                  onPress={() => setPostType(key)}
                  style={{ paddingHorizontal: 16, paddingVertical: 7, borderRadius: 20, backgroundColor: key === postType ? '#E8591A15' : '#F5F0EB', borderWidth: 1.5, borderColor: key === postType ? '#E8591A' : '#E5E0D8' }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '600', color: key === postType ? '#E8591A' : '#6D4C41' }}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Text input */}
          <View style={{ backgroundColor: C.surface, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8, borderBottomWidth: 1, borderColor: C.border }}>
            <TextInput
              value={text}
              onChangeText={setText}
              placeholder={postType === 'recipe' ? t('community.postPlaceholderRecipe') : t('community.postPlaceholderPost')}
              placeholderTextColor="#8C8278"
              multiline
              style={{ fontSize: 15, color: C.ink, lineHeight: 24, minHeight: 140, textAlignVertical: 'top' }}
            />
            <Text style={{ fontSize: 11, color: text.length > 500 ? '#C62828' : '#8C8278', textAlign: 'right', marginTop: 6 }}>{text.length}/500</Text>
          </View>

          {/* Media */}
          <View style={{ backgroundColor: C.surface, padding: 16, borderBottomWidth: 1, borderColor: C.border }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: C.inkSoft, marginBottom: 10 }}>{t('community.photosVideo')}</Text>
            {imageUri ? (
              <View style={{ width: 100, height: 100, borderRadius: 12, overflow: 'hidden' }}>
                <Image source={{ uri: imageUri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                <TouchableOpacity
                  onPress={() => { setImageUri(null); setImageBase64(null); }}
                  style={{ position: 'absolute', top: 4, right: 4, width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}
                >
                  <Icon name="X" size={12} color="#fff" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity onPress={() => void pickImage()} style={{ width: 80, height: 80, borderRadius: 12, backgroundColor: C.surface2, borderWidth: 1.5, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Camera" size={22} color="#8C8278" />
              </TouchableOpacity>
            )}
          </View>

          {/* Tags */}
          <View style={{ backgroundColor: C.surface, padding: 16, borderBottomWidth: 1, borderColor: C.border }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: C.inkSoft, marginBottom: 10 }}>{t('community.keywords')}</Text>

            {tags.length > 0 && (
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                {tags.map(tag => (
                  <TouchableOpacity key={tag} onPress={() => removeTag(tag)} style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, backgroundColor: '#E8591A15', borderWidth: 1, borderColor: '#E8591A40' }}>
                    <Text style={{ fontSize: 12, color: '#E8591A', fontWeight: '600' }}>{tag}</Text>
                    <Icon name="X" size={11} color="#E8591A" />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <Text style={{ fontSize: 12, color: C.inkMute, marginBottom: 8 }}>{t('community.suggestions')} :</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {SUGGESTED_TAGS.filter(tag => !tags.includes(tag)).map(tag => (
                <TouchableOpacity key={tag} onPress={() => addTag(tag)} style={{ paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border }}>
                  <Text style={{ fontSize: 12, color: C.inkSoft, fontWeight: '500' }}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
