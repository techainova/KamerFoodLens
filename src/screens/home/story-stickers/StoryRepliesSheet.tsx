// src/screens/home/story-stickers/StoryRepliesSheet.tsx
import React, { useEffect, useState } from 'react';
import { View, Modal, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { useTranslation } from 'react-i18next';
import type { StoryReplyView } from '@/services/community.service';

interface Props {
  visible: boolean;
  onClose: () => void;
  loadReplies: () => Promise<StoryReplyView[]>;
}

export default function StoryRepliesSheet({ visible, onClose, loadReplies }: Props) {
  const { t } = useTranslation();
  const [replies, setReplies] = useState<StoryReplyView[] | null>(null);

  useEffect(() => {
    if (!visible) { setReplies(null); return; }
    let cancelled = false;
    void loadReplies().then((items) => { if (!cancelled) setReplies(items); });
    return () => { cancelled = true; };
  }, [visible, loadReplies]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} activeOpacity={1} onPress={onClose}>
        <View style={{ marginTop: 'auto', maxHeight: '60%', backgroundColor: '#1c1c1e', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 12, paddingBottom: 24 }}>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)', alignSelf: 'center', marginBottom: 12 }} />
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', textAlign: 'center', marginBottom: 8 }}>
            {t('home.storyRepliesTitle')}
          </Text>

          {replies === null ? (
            <ActivityIndicator color="#fff" style={{ marginVertical: 24 }} />
          ) : replies.length === 0 ? (
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, textAlign: 'center', marginVertical: 24 }}>
              {t('home.storyNoReplies')}
            </Text>
          ) : (
            <FlatList
              data={replies}
              keyExtractor={(r, i) => `${r.userId}-${i}`}
              style={{ paddingHorizontal: 16 }}
              renderItem={({ item }) => (
                <View style={{ paddingVertical: 10, borderBottomWidth: 1, borderColor: 'rgba(255,255,255,0.08)' }}>
                  <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>{item.name}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 2 }}>{item.text}</Text>
                </View>
              )}
            />
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
