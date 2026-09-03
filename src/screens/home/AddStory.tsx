import React, { useEffect, useState } from 'react';
import {
  View, TouchableOpacity, TextInput, Image, StatusBar, Alert, ActivityIndicator, type LayoutChangeEvent,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import * as ImagePicker from 'expo-image-picker';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useStoriesStore } from '@/store/stories.store';
import type { HomeStackParams } from '@/navigation/types';
import type { CreateStoryPayload, CreateStoryStickersPayload, CreateStoryTextOverlayPayload } from '@/services/community.service';
import StickerEditor from './story-stickers/StickerEditor';
import StoryFilterBar from './story-stickers/StoryFilterBar';
import StoryTextTool, { type DraftTextOverlay } from './story-stickers/StoryTextTool';
import DraggableOverlay from './story-stickers/DraggableOverlay';
import { getStoryFilterOverlay, STORY_BACKGROUNDS } from './story-stickers/storyFilters';

type Route = RouteProp<HomeStackParams, 'AddStory'>;

interface DraftOverlay {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  align: 'left' | 'center' | 'right';
  backgroundColor?: string;
}

function stickerSummary(s: CreateStoryStickersPayload): string {
  if (s.poll) return `🗳️ ${s.poll.question}`;
  if (s.quiz) return `❓ ${s.quiz.question}`;
  if (s.slider) return `${s.slider.emoji} ${s.slider.question}`;
  return '';
}

function withStickerPos(s: CreateStoryStickersPayload, x: number, y: number): CreateStoryStickersPayload {
  if (s.poll) return { poll: { ...s.poll, x, y } };
  if (s.quiz) return { quiz: { ...s.quiz, x, y } };
  if (s.slider) return { slider: { ...s.slider, x, y } };
  return s;
}

export default function AddStory() {
  const navigation = useNavigation<any>();
  const route = useRoute<Route>();
  const C = useColors();
  const { t } = useTranslation();
  const addStory = useStoriesStore((s) => s.addStory);

  const [uri, setUri] = useState<string | null>(route.params?.uri ?? null);
  const [base64, setBase64] = useState<string | null>(route.params?.base64 ?? null);
  const [manualTextOnly, setManualTextOnly] = useState(false);
  const [caption, setCaption] = useState('');
  const [filter, setFilter] = useState('none');
  const [backgroundIndex, setBackgroundIndex] = useState(0);
  const [overlays, setOverlays] = useState<DraftOverlay[]>([]);
  const [textToolVisible, setTextToolVisible] = useState(false);
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 });
  const [stickers, setStickers] = useState<CreateStoryStickersPayload | undefined>(undefined);
  const [stickerPos, setStickerPos] = useState({ x: 0.5, y: 0.64 });
  const [stickerEditorKey, setStickerEditorKey] = useState(0);
  const [publishing, setPublishing] = useState(false);

  const wantsText = (route.params?.textOnly ?? false) || manualTextOnly;
  const mode: 'image' | 'text' | 'pick' = uri ? 'image' : wantsText ? 'text' : 'pick';
  const background = STORY_BACKGROUNDS[backgroundIndex];

  useEffect(() => {
    if (route.params?.textOnly) setTextToolVisible(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only react to the initial nav param, once
  }, []);

  const pickFrom = async (source: 'camera' | 'gallery') => {
    const result = source === 'camera'
      ? await ImagePicker.launchCameraAsync({ quality: 0.8, mediaTypes: ['images'], base64: true })
      : await ImagePicker.launchImageLibraryAsync({ quality: 0.8, mediaTypes: ['images'], base64: true });
    if (!result.canceled && result.assets?.[0]) {
      setUri(result.assets[0].uri);
      setBase64(result.assets[0].base64 ?? null);
    }
  };

  const handlePreviewLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setPreviewSize({ width, height });
  };

  const handleTextConfirm = (draft: DraftTextOverlay) => {
    setOverlays((prev) => [
      ...prev,
      { id: `${Date.now()}`, text: draft.text, color: draft.color, align: draft.align, backgroundColor: draft.backgroundColor, x: 0.5, y: 0.4 + prev.length * 0.08 },
    ]);
    setTextToolVisible(false);
  };

  const updateOverlayPos = (id: string, x: number, y: number) => {
    setOverlays((prev) => prev.map((o) => (o.id === id ? { ...o, x, y } : o)));
  };

  const removeOverlay = (id: string) => setOverlays((prev) => prev.filter((o) => o.id !== id));

  const removeSticker = () => {
    setStickers(undefined);
    setStickerPos({ x: 0.5, y: 0.64 });
    setStickerEditorKey((k) => k + 1); // remonte StickerEditor pour réinitialiser son type sélectionné
  };

  const handlePublish = async () => {
    if (mode === 'pick' || (mode === 'image' && (!uri || !base64))) {
      Alert.alert(t('home.addStoryNoImageTitle'), t('home.addStoryNoImageMsg'));
      return;
    }

    const textOverlays: CreateStoryTextOverlayPayload[] = overlays.map((o) => ({
      text: o.text, x: o.x, y: o.y, color: o.color, align: o.align, backgroundColor: o.backgroundColor,
    }));
    const positionedStickers = stickers ? withStickerPos(stickers, stickerPos.x, stickerPos.y) : undefined;

    const payload: CreateStoryPayload = mode === 'image'
      ? {
          imageBase64: base64!,
          mimeType: 'image/jpeg',
          mediaType: 'image',
          filter: filter !== 'none' ? filter : undefined,
          caption: caption.trim() || undefined,
          textOverlays,
          stickers: positionedStickers,
        }
      : {
          mediaType: 'text',
          backgroundColor: background.solid,
          gradient: background.gradient,
          textOverlays,
          stickers: positionedStickers,
        };

    setPublishing(true);
    try {
      await addStory(payload);
      navigation.goBack();
    } catch {
      Alert.alert(t('common.error'), t('community.postError'));
    } finally {
      setPublishing(false);
    }
  };

  const renderOverlays = () => previewSize.width > 0 && (
    <>
      {overlays.map((o) => (
        <DraggableOverlay
          key={o.id}
          initialX={o.x}
          initialY={o.y}
          containerWidth={previewSize.width}
          containerHeight={previewSize.height}
          onPositionChange={(x, y) => updateOverlayPos(o.id, x, y)}
          onDelete={() => removeOverlay(o.id)}
        >
          <View style={{ backgroundColor: o.backgroundColor, borderRadius: 8, paddingHorizontal: o.backgroundColor ? 8 : 0, paddingVertical: o.backgroundColor ? 4 : 0, maxWidth: 240 }}>
            <Text style={{ color: o.color, fontSize: 22, fontWeight: '700', textAlign: o.align }}>{o.text}</Text>
          </View>
        </DraggableOverlay>
      ))}
      {stickers && (
        <DraggableOverlay
          initialX={stickerPos.x}
          initialY={stickerPos.y}
          containerWidth={previewSize.width}
          containerHeight={previewSize.height}
          onPositionChange={(x, y) => setStickerPos({ x, y })}
          onDelete={removeSticker}
        >
          <View style={{ backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, maxWidth: 220 }}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{stickerSummary(stickers)}</Text>
          </View>
        </DraggableOverlay>
      )}
    </>
  );

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
        {mode === 'image' && (
          <View onLayout={handlePreviewLayout} style={{ flex: 1, borderRadius: 20, overflow: 'hidden', backgroundColor: C.surface2 }}>
            <Image source={{ uri: uri! }} style={{ flex: 1 }} resizeMode="cover" />
            {filter !== 'none' && (
              <View pointerEvents="none" style={{ position: 'absolute', inset: 0, backgroundColor: getStoryFilterOverlay(filter) }} />
            )}
            <TouchableOpacity
              onPress={() => { setUri(null); setBase64(null); }}
              style={{ position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="X" size={16} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTextToolVisible(true)}
              style={{ position: 'absolute', top: 12, left: 12, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="Type" size={16} color="#fff" />
            </TouchableOpacity>
            {renderOverlays()}
          </View>
        )}

        {mode === 'text' && (
          <View onLayout={handlePreviewLayout} style={{ flex: 1, borderRadius: 20, overflow: 'hidden' }}>
            {background.gradient ? (
              <LinearGradient colors={background.gradient as [string, string]} style={{ flex: 1 }} />
            ) : (
              <View style={{ flex: 1, backgroundColor: background.solid }} />
            )}
            <TouchableOpacity
              onPress={() => setBackgroundIndex((i) => (i + 1) % STORY_BACKGROUNDS.length)}
              style={{ position: 'absolute', top: 12, left: 12, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="RefreshCw" size={16} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setTextToolVisible(true)}
              style={{ position: 'absolute', top: 12, right: 12, width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}
            >
              <Icon name="Type" size={16} color="#fff" />
            </TouchableOpacity>
            {renderOverlays()}
          </View>
        )}

        {mode === 'pick' && (
          <View style={{ flex: 1, borderRadius: 20, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <Icon name="Camera" size={40} color={C.inkMute} />
            <Text style={{ color: C.inkMute, fontSize: 13 }}>{t('home.addStoryPlaceholder')}</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity onPress={() => void pickFrom('camera')} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 42, paddingHorizontal: 16, borderRadius: 21, backgroundColor: C.primary }}>
                <Icon name="Camera" size={16} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{t('scanner.takePhoto')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => void pickFrom('gallery')} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, height: 42, paddingHorizontal: 16, borderRadius: 21, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
                <Icon name="Bookmark" size={16} color={C.inkSoft} />
                <Text style={{ color: C.inkSoft, fontSize: 13, fontWeight: '600' }}>{t('scanner.fromGallery')}</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={() => setManualTextOnly(true)}>
              <Text style={{ color: C.primary, fontSize: 13, fontWeight: '600' }}>{t('home.storyTextOnly')}</Text>
            </TouchableOpacity>
          </View>
        )}

        {mode === 'image' && (
          <StoryFilterBar uri={uri!} selected={filter} onSelect={setFilter} />
        )}

        {mode !== 'pick' && (
          <View style={{ marginTop: mode === 'image' ? 0 : 16 }}>
            {mode === 'image' && (
              <>
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
              </>
            )}

            <StickerEditor key={stickerEditorKey} onChange={setStickers} />

            <TouchableOpacity
              onPress={() => void handlePublish()}
              disabled={publishing}
              style={{ marginTop: 16, height: 52, borderRadius: 26, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
              activeOpacity={0.85}
            >
              {publishing && <ActivityIndicator size="small" color="#fff" />}
              <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>
                {publishing ? t('home.addStoryPublishing') : t('home.addStoryPublish')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <StoryTextTool visible={textToolVisible} onClose={() => setTextToolVisible(false)} onConfirm={handleTextConfirm} />
    </SafeAreaView>
  );
}
