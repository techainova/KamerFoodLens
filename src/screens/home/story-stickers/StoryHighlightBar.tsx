// src/screens/home/story-stickers/StoryHighlightBar.tsx
import React from 'react';
import { View, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useStoriesStore } from '@/store/stories.store';
import type { StoryHighlightSummary } from '@/services/community.service';

interface Props {
  highlights: StoryHighlightSummary[];
  isMine: boolean;
  myAuthorId?: string;
  onOpenHighlight: (highlightId: string) => void;
}

export default function StoryHighlightBar({ highlights, isMine, myAuthorId, onOpenHighlight }: Props) {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const stories = useStoriesStore((s) => s.stories);

  if (!isMine && highlights.length === 0) return null;

  const handleCreate = () => {
    const hasActiveStory = stories.some((s) => s.authorId === myAuthorId);
    if (!hasActiveStory) {
      Alert.alert(t('home.storyNoActiveStoryTitle'), t('home.storyNoActiveStoryMsg'));
      return;
    }
    navigation.navigate('StoriesViewer', { authorId: myAuthorId });
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 16, paddingVertical: 4 }}>
      {isMine && (
        <TouchableOpacity onPress={handleCreate} style={{ alignItems: 'center', gap: 6, width: 64 }}>
          <View style={{ width: 58, height: 58, borderRadius: 29, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Plus" size={20} color={C.inkMute} />
          </View>
          <Text numberOfLines={1} style={{ fontSize: 11, color: C.inkSoft }}>{t('home.storyNewHighlight')}</Text>
        </TouchableOpacity>
      )}
      {highlights.map((h) => (
        <TouchableOpacity key={h.id} onPress={() => onOpenHighlight(h.id)} style={{ alignItems: 'center', gap: 6, width: 64 }}>
          <View style={{ width: 58, height: 58, borderRadius: 29, borderWidth: 1, borderColor: C.border, overflow: 'hidden', backgroundColor: C.surface2 }}>
            {h.coverImageUrl && (
              <Image source={{ uri: h.coverImageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            )}
          </View>
          <Text numberOfLines={1} style={{ fontSize: 11, color: C.inkSoft }}>{h.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
