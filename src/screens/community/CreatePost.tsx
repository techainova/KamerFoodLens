// Nouvelle publication — carrousel de plusieurs photos/vidéos comme sur
// Instagram, tags, et détection IA du plat quand on arrive depuis le Scanner.
import React, { useState } from 'react';
import {
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { Alert } from '@/utils/alert';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useFeedStore } from '@/store/feed.store';
import { useAuthStore } from '@/store/auth.store';
import type { CreatePostPayload, CreatePostMediaPayload } from '@/services/community.service';
import type { HomeStackParamList } from '@/navigation/types';
import { getDishDescription } from '@/ai/dishDescriptions';
import { UNKNOWN_CLASS } from '@/ai/interpretResult';
import { readUriAsBase64 } from '@/utils/readUriAsBase64';

const SUGGESTED_TAGS = ['#Mbongo', '#Ndolé', '#PouletDG', '#Kpwem', '#Achu', '#Cameroun', '#Recette'];
const MAX_MEDIA = 10;

interface MediaItem {
  id: string;
  uri: string;
  base64?: string;
  mimeType: string;
  kind: 'image' | 'video';
}

type CreatePostRoute = RouteProp<HomeStackParamList, 'CreatePost'>;

export default function CreatePost() {
  const navigation = useNavigation<any>();
  const route = useRoute<CreatePostRoute>();
  const C = useColors();
  const { t } = useTranslation();

  const isPro = useAuthStore((s) => s.user?.role === 'pro');

  // "Événement" réservé aux comptes pro (vérifié aussi côté serveur) — une
  // annonce légère dans le fil, distincte du module Events complet.
  const POST_TYPES: { key: CreatePostPayload['type']; label: string }[] = [
    { key: 'post', label: t('community.postTypePost') },
    { key: 'recipe', label: t('community.postTypeRecipe') },
    { key: 'review', label: t('community.postTypeReview') },
    ...(isPro ? [{ key: 'event' as const, label: t('community.postTypeEvent') }] : []),
  ];

  // Arrivée depuis le Scanner ("Publier" sur un plat identifié) — préremplit
  // la photo et propose de taguer le plat détecté par l'IA.
  const scanClassId = route.params?.classId;
  const scanConfidence = route.params?.confidence ?? 0;
  const detectedDish = scanClassId && scanClassId !== UNKNOWN_CLASS ? getDishDescription(scanClassId) : null;

  const [postType, setPostType] = useState<CreatePostPayload['type']>('post');
  const [text, setText] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [media, setMedia] = useState<MediaItem[]>(
    route.params?.imageUri ? [{ id: 'scan-0', uri: route.params.imageUri, base64: route.params.imageBase64, mimeType: route.params.mimeType ?? 'image/jpeg', kind: 'image' }] : [],
  );
  const [dishTagged, setDishTagged] = useState(false);
  const [dishSuggestionDismissed, setDishSuggestionDismissed] = useState(false);
  const [publishing, setPublishing] = useState(false);

  const createPost = useFeedStore(s => s.createPost);

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) setTags(prev => [...prev, tag]);
  };

  const removeTag = (tag: string) => setTags(prev => prev.filter(x => x !== tag));

  const canPublish = text.trim().length > 0 && !publishing;

  const tagDetectedDish = () => {
    if (!detectedDish) return;
    setDishTagged(true);
    addTag(`#${detectedDish.nomFR.replace(/\s+/g, '')}`);
    setText((prev) => prev.trim().length > 0 ? prev : `${detectedDish.nomFR} — identifié avec KFL Lens 📸`);
  };

  const addAssets = (assets: ImagePicker.ImagePickerAsset[]) => {
    setMedia((prev) => {
      const room = MAX_MEDIA - prev.length;
      const next = assets.slice(0, room).map((a, i) => ({
        id: `${Date.now()}-${i}`,
        uri: a.uri,
        base64: a.base64 ?? undefined,
        mimeType: a.mimeType ?? (a.type === 'video' ? 'video/mp4' : 'image/jpeg'),
        kind: (a.type === 'video' ? 'video' : 'image') as 'image' | 'video',
      }));
      return [...prev, ...next];
    });
  };

  const pickFromLibrary = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      quality: 0.8,
      mediaTypes: ['images', 'videos'],
      allowsMultipleSelection: true,
      selectionLimit: Math.max(1, MAX_MEDIA - media.length),
      base64: true,
    });
    if (!result.canceled && result.assets?.length) addAssets(result.assets);
  };

  const takePhoto = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) return;
    const result = await ImagePicker.launchCameraAsync({ quality: 0.8, base64: true });
    if (!result.canceled && result.assets?.length) addAssets(result.assets);
  };

  const removeMedia = (id: string) => setMedia((prev) => prev.filter((m) => m.id !== id));

  // Le carrousel peut mélanger des éléments choisis avec base64 (galerie/caméra)
  // et un élément arrivé du Scanner (uri locale seule) — on lit ceux-là nous-mêmes.
  const resolveMediaPayload = async (): Promise<CreatePostMediaPayload[]> => {
    const resolved = await Promise.all(media.map(async (m) => {
      if (m.base64) return { base64: m.base64, mimeType: m.mimeType };
      try {
        const base64 = await readUriAsBase64(m.uri);
        return { base64, mimeType: m.mimeType };
      } catch {
        return null;
      }
    }));
    return resolved.filter((r): r is CreatePostMediaPayload => r !== null);
  };

  const handlePublish = async () => {
    if (!canPublish) return;
    setPublishing(true);
    try {
      const content = tags.length > 0 ? `${text.trim()}\n\n${tags.join(' ')}` : text.trim();
      const mediaPayload = await resolveMediaPayload();
      await createPost({
        content,
        type: postType,
        media: mediaPayload.length > 0 ? mediaPayload : undefined,
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
              placeholder={
                postType === 'recipe' ? t('community.postPlaceholderRecipe')
                : postType === 'event' ? t('community.postPlaceholderEvent')
                : t('community.postPlaceholderPost')
              }
              placeholderTextColor="#8C8278"
              multiline
              style={{ fontSize: 15, color: C.ink, lineHeight: 24, minHeight: 140, textAlignVertical: 'top' }}
            />
            <Text style={{ fontSize: 11, color: text.length > 500 ? '#C62828' : '#8C8278', textAlign: 'right', marginTop: 6 }}>{text.length}/500</Text>
          </View>

          {/* Media — carrousel façon Instagram, plusieurs photos ET vidéos */}
          <View style={{ backgroundColor: C.surface, padding: 16, borderBottomWidth: 1, borderColor: C.border }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: C.inkSoft }}>
                {t('community.photosVideo')}{media.length > 0 ? ` (${media.length}/${MAX_MEDIA})` : ''}
              </Text>
              {media.length > 0 && media.length < MAX_MEDIA && (
                <TouchableOpacity onPress={() => void pickFromLibrary()}>
                  <Text style={{ fontSize: 12.5, fontWeight: '700', color: C.primary }}>{t('community.addMore', 'Ajouter')}</Text>
                </TouchableOpacity>
              )}
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 10, alignItems: 'center' }}>
              {media.map((m) => (
                <View key={m.id} style={{ width: 100, height: 100, borderRadius: 12, overflow: 'hidden', backgroundColor: C.surface2 }}>
                  <Image source={{ uri: m.uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  {m.kind === 'video' && (
                    <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.25)' }}>
                      <Icon name="Play" size={26} color="#fff" />
                    </View>
                  )}
                  <TouchableOpacity
                    onPress={() => removeMedia(m.id)}
                    style={{ position: 'absolute', top: 4, right: 4, width: 24, height: 24, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <Icon name="X" size={12} color="#fff" />
                  </TouchableOpacity>
                </View>
              ))}

              {media.length < MAX_MEDIA && (
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity onPress={() => void pickFromLibrary()} style={{ width: 80, height: 100, borderRadius: 12, backgroundColor: C.surface2, borderWidth: 1.5, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <Icon name="Image" size={20} color="#8C8278" />
                    <Text style={{ fontSize: 10, color: C.inkMute, fontWeight: '600' }}>{t('community.gallery', 'Galerie')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => void takePhoto()} style={{ width: 80, height: 100, borderRadius: 12, backgroundColor: C.surface2, borderWidth: 1.5, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                    <Icon name="Camera" size={20} color="#8C8278" />
                    <Text style={{ fontSize: 10, color: C.inkMute, fontWeight: '600' }}>{t('community.camera', 'Caméra')}</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
            {media.length > 1 && (
              <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 8 }}>
                {t('community.carouselHint', "Les gens pourront glisser pour voir toutes les photos/vidéos, comme un carrousel.")}
              </Text>
            )}
          </View>

          {/* Suggestion IA — plat détecté par le Scanner */}
          {detectedDish && !dishSuggestionDismissed && (
            <View style={{ margin: 16, marginBottom: 0, padding: 13, borderRadius: 14, backgroundColor: C.primarySoft, borderWidth: 1, borderColor: C.primary }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                <Icon name="Sparkles" size={17} color={C.primary} />
                <Text style={{ fontSize: 11, fontWeight: '800', color: C.primary, letterSpacing: 0.6 }}>DÉTECTÉ PAR L'IA KFL</Text>
              </View>
              <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: C.ink, marginTop: 6 }}>{detectedDish.nomFR}</Text>
              <Text style={{ fontSize: 11.5, color: C.inkSoft }}>{detectedDish.region} · Confiance {Math.round(scanConfidence * 100)}%</Text>
              <View style={{ flexDirection: 'row', gap: 7, marginTop: 10 }}>
                <TouchableOpacity
                  onPress={tagDetectedDish}
                  disabled={dishTagged}
                  style={{ height: 32, paddingHorizontal: 14, borderRadius: 16, backgroundColor: dishTagged ? C.success : C.primary, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}
                >
                  {dishTagged && <Icon name="Check" size={13} color="#fff" />}
                  <Text style={{ color: '#fff', fontSize: 12.5, fontWeight: '700' }}>{dishTagged ? 'Plat tagué' : 'Taguer ce plat'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setDishSuggestionDismissed(true)} style={{ height: 32, paddingHorizontal: 14, borderRadius: 16, borderWidth: 1, borderColor: C.primary, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: C.primary, fontSize: 12.5, fontWeight: '700' }}>Corriger</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

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
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ flexGrow: 0 }} contentContainerStyle={{ gap: 8, alignItems: 'center' }}>
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
