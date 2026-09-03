// src/screens/home/story-stickers/StickerEditor.tsx
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, TextInput } from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import type { CreateStoryStickersPayload } from '@/services/community.service';

type StickerType = 'none' | 'poll' | 'quiz' | 'slider';

const SLIDER_EMOJIS = ['❤️', '🔥', '😍', '😮', '👍', '😂'];
const MAX_OPTIONS = 4;

interface Props {
  onChange: (value: CreateStoryStickersPayload | undefined) => void;
}

export default function StickerEditor({ onChange }: Props) {
  const { t } = useTranslation();
  const C = useColors();

  const [type, setType] = useState<StickerType>('none');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [sliderEmoji, setSliderEmoji] = useState(SLIDER_EMOJIS[0]);

  useEffect(() => {
    const trimmedQuestion = question.trim();
    const trimmedOptions = options.map((o) => o.trim()).filter(Boolean);

    if (type === 'poll' && trimmedQuestion && trimmedOptions.length >= 2) {
      onChange({ poll: { question: trimmedQuestion, options: trimmedOptions } });
    } else if (type === 'quiz' && trimmedQuestion && trimmedOptions.length >= 2 && correctIndex < trimmedOptions.length) {
      onChange({ quiz: { question: trimmedQuestion, options: trimmedOptions, correctIndex } });
    } else if (type === 'slider' && trimmedQuestion) {
      onChange({ slider: { question: trimmedQuestion, emoji: sliderEmoji } });
    } else {
      onChange(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, question, options, correctIndex, sliderEmoji]);

  const setType_ = (next: StickerType) => {
    setType(next);
    setQuestion('');
    setOptions(['', '']);
    setCorrectIndex(0);
    setSliderEmoji(SLIDER_EMOJIS[0]);
  };

  const setOption = (index: number, text: string) => {
    setOptions((prev) => prev.map((o, i) => (i === index ? text : o)));
  };

  const addOption = () => {
    if (options.length < MAX_OPTIONS) setOptions((prev) => [...prev, '']);
  };

  const removeOption = (index: number) => {
    if (options.length <= 2) return;
    setOptions((prev) => prev.filter((_, i) => i !== index));
    if (correctIndex >= index && correctIndex > 0) setCorrectIndex((c) => c - 1);
  };

  const chips: { key: StickerType; label: string }[] = [
    { key: 'none', label: t('home.addStoryStickerNone') },
    { key: 'poll', label: t('home.addStoryStickerPoll') },
    { key: 'quiz', label: t('home.addStoryStickerQuiz') },
    { key: 'slider', label: t('home.addStoryStickerSlider') },
  ];

  return (
    <View style={{ marginTop: 16 }}>
      <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
        {t('home.addStoryStickerLabel')}
      </Text>

      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        {chips.map((chip) => (
          <TouchableOpacity
            key={chip.key}
            onPress={() => setType_(chip.key)}
            style={{
              paddingVertical: 8, paddingHorizontal: 14, borderRadius: 18,
              backgroundColor: type === chip.key ? C.primary : C.surface,
              borderWidth: 1, borderColor: type === chip.key ? C.primary : C.border,
            }}
          >
            <Text style={{ fontSize: 12, fontWeight: '600', color: type === chip.key ? '#fff' : C.inkSoft }}>
              {chip.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {type !== 'none' && (
        <View style={{ gap: 10 }}>
          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder={
              type === 'slider' ? t('home.addStoryCaptionPlaceholder') : t('home.addStoryPollQuestionPlaceholder')
            }
            placeholderTextColor={C.inkMute}
            style={{ height: 44, borderWidth: 1, borderColor: C.border, borderRadius: 12, backgroundColor: C.surface, paddingHorizontal: 12, fontSize: 13, color: C.ink }}
          />

          {(type === 'poll' || type === 'quiz') && (
            <View style={{ gap: 8 }}>
              {options.map((option, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  {type === 'quiz' && (
                    <TouchableOpacity
                      onPress={() => setCorrectIndex(index)}
                      style={{
                        width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center',
                        borderWidth: 2, borderColor: correctIndex === index ? C.primary : C.border,
                        backgroundColor: correctIndex === index ? C.primary : 'transparent',
                      }}
                    >
                      {correctIndex === index && <Icon name="Check" size={12} color="#fff" />}
                    </TouchableOpacity>
                  )}
                  <TextInput
                    value={option}
                    onChangeText={(text) => setOption(index, text)}
                    placeholder={t('home.addStoryPollOptionPlaceholder', { index: index + 1 })}
                    placeholderTextColor={C.inkMute}
                    style={{ flex: 1, height: 42, borderWidth: 1, borderColor: C.border, borderRadius: 12, backgroundColor: C.surface, paddingHorizontal: 12, fontSize: 13, color: C.ink }}
                  />
                  {options.length > 2 && (
                    <TouchableOpacity onPress={() => removeOption(index)} style={{ padding: 6 }}>
                      <Icon name="X" size={16} color={C.inkMute} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              {type === 'quiz' && (
                <Text style={{ fontSize: 11, color: C.inkMute }}>{t('home.addStoryQuizCorrectLabel')}</Text>
              )}
              {options.length < MAX_OPTIONS && (
                <TouchableOpacity onPress={addOption} style={{ flexDirection: 'row', alignItems: 'center', gap: 6, alignSelf: 'flex-start' }}>
                  <Icon name="Plus" size={14} color={C.primary} />
                  <Text style={{ fontSize: 12, fontWeight: '600', color: C.primary }}>{t('home.addStoryAddOption')}</Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {type === 'slider' && (
            <View>
              <Text style={{ fontSize: 11, color: C.inkMute, marginBottom: 6 }}>{t('home.addStorySliderEmojiLabel')}</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {SLIDER_EMOJIS.map((emoji) => (
                  <TouchableOpacity
                    key={emoji}
                    onPress={() => setSliderEmoji(emoji)}
                    style={{
                      width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center',
                      backgroundColor: sliderEmoji === emoji ? C.primary + '30' : C.surface,
                      borderWidth: 1, borderColor: sliderEmoji === emoji ? C.primary : C.border,
                    }}
                  >
                    <Text style={{ fontSize: 16 }}>{emoji}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
