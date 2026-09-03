// src/screens/home/story-stickers/StorySliderSticker.tsx
import React, { useRef, useState } from 'react';
import { View, PanResponder, type GestureResponderEvent } from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { useTranslation } from 'react-i18next';
import type { StorySliderView } from '@/services/community.service';

interface Props {
  slider: StorySliderView;
  onRate: (value: number) => void;
}

export default function StorySliderSticker({ slider, onRate }: Props) {
  const { t } = useTranslation();
  const trackWidthRef = useRef(0);
  const rated = slider.myValue !== undefined;
  const [value, setValue] = useState(slider.myValue ?? 0.5);

  const ratioFromEvent = (evt: GestureResponderEvent): number | null => {
    const width = trackWidthRef.current;
    if (width <= 0) return null;
    return Math.max(0, Math.min(1, evt.nativeEvent.locationX / width));
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const ratio = ratioFromEvent(evt);
        if (ratio !== null) setValue(ratio);
      },
      onPanResponderMove: (evt) => {
        const ratio = ratioFromEvent(evt);
        if (ratio !== null) setValue(ratio);
      },
      onPanResponderRelease: (evt) => {
        const ratio = ratioFromEvent(evt);
        if (ratio !== null) {
          setValue(ratio);
          onRate(ratio);
        }
      },
    }),
  ).current;

  const pct = Math.round(value * 100);

  return (
    <View style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 18, padding: 14, alignItems: 'center', gap: 10 }}>
      <Text style={{ fontSize: 22 }}>{slider.emoji}</Text>
      <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700', textAlign: 'center' }}>{slider.question}</Text>

      <View
        onLayout={(e) => { trackWidthRef.current = e.nativeEvent.layout.width; }}
        {...panResponder.panHandlers}
        style={{ width: '100%', height: 32, justifyContent: 'center' }}
      >
        <View style={{ height: 8, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.25)', overflow: 'hidden' }}>
          <View style={{ height: 8, borderRadius: 4, backgroundColor: '#fff', width: `${pct}%` }} />
        </View>
        <View
          pointerEvents="none"
          style={{
            position: 'absolute', top: 4, left: `${pct}%`, marginLeft: -12,
            width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff',
            alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 12 }}>{slider.emoji}</Text>
        </View>
      </View>

      <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>
        {rated && slider.average !== undefined
          ? t('home.storySliderAverage', { pct: Math.round(slider.average * 100) })
          : t('home.storySliderHint')}
      </Text>
    </View>
  );
}
