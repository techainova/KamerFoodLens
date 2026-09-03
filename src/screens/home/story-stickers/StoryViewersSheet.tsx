// src/screens/home/story-stickers/StoryViewersSheet.tsx
import React, { useEffect, useState } from 'react';
import { View, Modal, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import type { StoryViewerView } from '@/services/community.service';

interface Props {
  visible: boolean;
  onClose: () => void;
  loadViewers: () => Promise<StoryViewerView[]>;
}

export default function StoryViewersSheet({ visible, onClose, loadViewers }: Props) {
  const { t } = useTranslation();
  const [viewers, setViewers] = useState<StoryViewerView[] | null>(null);

  useEffect(() => {
    if (!visible) { setViewers(null); return; }
    let cancelled = false;
    void loadViewers().then((items) => { if (!cancelled) setViewers(items); });
    return () => { cancelled = true; };
  }, [visible, loadViewers]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} activeOpacity={1} onPress={onClose}>
        <View style={{ marginTop: 'auto', maxHeight: '60%', backgroundColor: '#1c1c1e', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 12, paddingBottom: 24 }}>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)', alignSelf: 'center', marginBottom: 12 }} />
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', textAlign: 'center', marginBottom: 8 }}>
            {t('home.storyViewersTitle')}
          </Text>

          {viewers === null ? (
            <ActivityIndicator color="#fff" style={{ marginVertical: 24 }} />
          ) : viewers.length === 0 ? (
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, textAlign: 'center', marginVertical: 24 }}>
              {t('home.storyNoViewers')}
            </Text>
          ) : (
            <FlatList
              data={viewers}
              keyExtractor={(v) => v.userId}
              style={{ paddingHorizontal: 16 }}
              renderItem={({ item }) => (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10 }}>
                  <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="User" size={16} color="#fff" />
                  </View>
                  <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{item.name}</Text>
                </View>
              )}
            />
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
