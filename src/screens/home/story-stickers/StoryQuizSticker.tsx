// src/screens/home/story-stickers/StoryQuizSticker.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { useTranslation } from 'react-i18next';
import type { StoryQuizView } from '@/services/community.service';

interface Props {
  quiz: StoryQuizView;
  onAnswer: (optionIndex: number) => void;
}

export default function StoryQuizSticker({ quiz, onAnswer }: Props) {
  const { t } = useTranslation();
  const answered = quiz.myAnswerIndex !== undefined;
  const correctPct = quiz.totalAnswers > 0 ? Math.round((quiz.correctCount / quiz.totalAnswers) * 100) : 0;

  return (
    <View style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 18, padding: 14, gap: 8 }}>
      <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700', textAlign: 'center', marginBottom: 4 }}>
        {quiz.question}
      </Text>
      {quiz.options.map((option, index) => {
        const isCorrect = answered && quiz.correctIndex === index;
        const isMineWrong = answered && quiz.myAnswerIndex === index && quiz.correctIndex !== index;
        const backgroundColor = isCorrect
          ? 'rgba(60,200,120,0.85)'
          : isMineWrong
            ? 'rgba(220,70,70,0.85)'
            : 'rgba(255,255,255,0.18)';
        return (
          <TouchableOpacity
            key={`${option.label}-${index}`}
            disabled={answered}
            onPress={() => onAnswer(index)}
            activeOpacity={0.85}
            style={{ borderRadius: 20, paddingVertical: 10, paddingHorizontal: 16, backgroundColor }}
          >
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{option.label}</Text>
          </TouchableOpacity>
        );
      })}
      {answered && (
        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, textAlign: 'center' }}>
          {t('home.storyQuizCorrectPct', { pct: correctPct })}
        </Text>
      )}
    </View>
  );
}
