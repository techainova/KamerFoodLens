// src/screens/home/story-stickers/StoryPollSticker.tsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { useTranslation } from 'react-i18next';
import type { StoryPollView } from '@/services/community.service';

interface Props {
  poll: StoryPollView;
  onVote: (optionIndex: number) => void;
}

export default function StoryPollSticker({ poll, onVote }: Props) {
  const { t } = useTranslation();
  const hasVoted = poll.myVoteIndex !== undefined;

  return (
    <View style={{ backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 18, padding: 14, gap: 8 }}>
      <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700', textAlign: 'center', marginBottom: 4 }}>
        {poll.question}
      </Text>
      {poll.options.map((option, index) => {
        const pct = poll.totalVotes > 0 ? Math.round((option.votes / poll.totalVotes) * 100) : 0;
        const isMine = poll.myVoteIndex === index;
        return (
          <TouchableOpacity
            key={`${option.label}-${index}`}
            disabled={hasVoted}
            onPress={() => onVote(index)}
            activeOpacity={0.85}
            style={{
              borderRadius: 20,
              overflow: 'hidden',
              backgroundColor: 'rgba(255,255,255,0.18)',
              borderWidth: isMine ? 2 : 0,
              borderColor: '#fff',
            }}
          >
            {hasVoted && (
              <View
                style={{
                  position: 'absolute', left: 0, top: 0, bottom: 0,
                  width: `${pct}%`, backgroundColor: 'rgba(255,255,255,0.35)',
                }}
              />
            )}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10, paddingHorizontal: 16 }}>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{option.label}</Text>
              {hasVoted && <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{pct}%</Text>}
            </View>
          </TouchableOpacity>
        );
      })}
      {hasVoted && (
        <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, textAlign: 'center' }}>
          {t('home.storyPollVotes', { count: poll.totalVotes })}
        </Text>
      )}
    </View>
  );
}
