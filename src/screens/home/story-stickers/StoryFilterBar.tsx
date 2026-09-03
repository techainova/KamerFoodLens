// src/screens/home/story-stickers/StoryFilterBar.tsx
import React from 'react';
import { View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { STORY_FILTERS } from './storyFilters';

interface Props {
  uri: string;
  selected: string;
  onSelect: (key: string) => void;
}

export default function StoryFilterBar({ uri, selected, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 10, paddingHorizontal: 16, paddingVertical: 10 }}
    >
      {STORY_FILTERS.map((f) => (
        <TouchableOpacity key={f.key} onPress={() => onSelect(f.key)} style={{ alignItems: 'center', gap: 4 }}>
          <View style={{
            width: 52, height: 52, borderRadius: 12, overflow: 'hidden',
            borderWidth: selected === f.key ? 2 : 0, borderColor: '#fff',
          }}
          >
            <Image source={{ uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
            {f.overlayColor !== 'transparent' && (
              <View style={{ position: 'absolute', inset: 0, backgroundColor: f.overlayColor }} />
            )}
          </View>
          <Text style={{ color: '#fff', fontSize: 10, fontWeight: selected === f.key ? '700' : '500' }}>
            {f.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
