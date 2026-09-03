// src/screens/home/story-stickers/AddToHighlightSheet.tsx
import React, { useEffect, useState } from 'react';
import { View, Modal, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Alert, Image } from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useAuthStore } from '@/store/auth.store';
import { useStoriesStore } from '@/store/stories.store';

interface Props {
  visible: boolean;
  storyId: string;
  onClose: () => void;
}

export default function AddToHighlightSheet({ visible, storyId, onClose }: Props) {
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const highlights = useStoriesStore((s) => s.highlights);
  const fetchHighlights = useStoriesStore((s) => s.fetchHighlights);
  const createHighlight = useStoriesStore((s) => s.createHighlight);
  const addStoryToHighlight = useStoriesStore((s) => s.addStoryToHighlight);

  const [loading, setLoading] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!visible || !user?.id) return;
    setLoading(true);
    void fetchHighlights(user.id).finally(() => setLoading(false));
  }, [visible, user?.id, fetchHighlights]);

  const handleAddExisting = async (highlightId: string) => {
    setSaving(true);
    try {
      await addStoryToHighlight(highlightId, storyId);
      onClose();
    } catch {
      Alert.alert(t('common.error'), t('community.postError'));
    } finally {
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    if (!newTitle.trim()) return;
    setSaving(true);
    try {
      await createHighlight(newTitle.trim(), storyId);
      setNewTitle('');
      onClose();
    } catch {
      Alert.alert(t('common.error'), t('community.postError'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} activeOpacity={1} onPress={onClose}>
        <View style={{ marginTop: 'auto', maxHeight: '70%', backgroundColor: '#1c1c1e', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingTop: 12, paddingBottom: 24 }}>
          <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)', alignSelf: 'center', marginBottom: 12 }} />
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', textAlign: 'center', marginBottom: 12 }}>
            {t('home.storyAddToHighlightTitle')}
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, marginBottom: 14 }}>
            <TextInput
              value={newTitle}
              onChangeText={setNewTitle}
              placeholder={t('home.storyNewHighlightPlaceholder')}
              placeholderTextColor="rgba(255,255,255,0.5)"
              style={{ flex: 1, height: 42, borderRadius: 21, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', paddingHorizontal: 16, color: '#fff', fontSize: 13 }}
            />
            <TouchableOpacity
              onPress={() => void handleCreate()}
              disabled={!newTitle.trim() || saving}
              style={{ width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: newTitle.trim() ? '#E8591A' : 'rgba(255,255,255,0.15)' }}
            >
              <Icon name="Plus" size={18} color="#fff" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator color="#fff" style={{ marginVertical: 20 }} />
          ) : highlights.length > 0 && (
            <FlatList
              data={highlights}
              keyExtractor={(h) => h.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => void handleAddExisting(item.id)} disabled={saving} style={{ alignItems: 'center', gap: 6, width: 70 }}>
                  <View style={{ width: 60, height: 60, borderRadius: 30, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    {item.coverImageUrl && (
                      <Image source={{ uri: item.coverImageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                    )}
                  </View>
                  <Text numberOfLines={1} style={{ color: '#fff', fontSize: 11 }}>{item.title}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </TouchableOpacity>
    </Modal>
  );
}
