// Fenêtre de commentaires d'un post — lecture des commentaires existants +
// ajout d'une réponse, comme le tiroir de commentaires d'Instagram.
import React, { useState } from 'react';
import {
  View, FlatList, TextInput, TouchableOpacity, Modal, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useFeedStore } from '@/store/feed.store';
import { useAuthGate } from '@/hooks/useAuthGate';
import { timeAgo } from '@/utils/timeAgo';
import type { FeedPost, PostComment } from '@/services/community.service';

interface Props {
  post: FeedPost | null;
  onClose: () => void;
}

export default function PostCommentsModal({ post, onClose }: Props) {
  const C = useColors();
  const { requireAuth } = useAuthGate();
  const addComment = useFeedStore((s) => s.addComment);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = () => {
    if (!post || !text.trim() || sending) return;
    requireAuth(async () => {
      setSending(true);
      try {
        await addComment(post.id, text.trim());
        setText('');
      } finally {
        setSending(false);
      }
    });
  };

  return (
    <Modal visible={!!post} animationType="slide" transparent onRequestClose={onClose}>
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
        <View style={{ height: '75%', backgroundColor: C.cream, borderTopLeftRadius: 20, borderTopRightRadius: 20, overflow: 'hidden' }}>
          <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: C.border, alignSelf: 'center', marginTop: 10, marginBottom: 6 }} />
            <View style={{ height: 46, alignItems: 'center', justifyContent: 'center', borderBottomWidth: 0.5, borderColor: C.border }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>Commentaires</Text>
              <TouchableOpacity onPress={onClose} style={{ position: 'absolute', right: 14, top: 10 }}>
                <Icon name="X" size={20} color={C.inkSoft} />
              </TouchableOpacity>
            </View>

            <FlatList<PostComment>
              data={post?.comments ?? []}
              keyExtractor={(_, i) => String(i)}
              contentContainerStyle={{ padding: 16, gap: 16, flexGrow: 1 }}
              ListEmptyComponent={
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 40 }}>
                  <Icon name="MessageCircle" size={32} color={C.border} />
                  <Text style={{ fontSize: 13, color: C.inkMute, marginTop: 10 }}>Aucun commentaire pour le moment.</Text>
                  <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 2 }}>Soyez le premier à répondre !</Text>
                </View>
              }
              renderItem={({ item }) => (
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: item.avatarColor + '25', borderWidth: 1, borderColor: item.avatarColor + '50', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: item.avatarColor, fontSize: 11, fontWeight: '700' }}>{item.initials}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, lineHeight: 18 }}>
                      <Text style={{ fontWeight: '700', color: C.ink }}>{item.authorName}</Text>{' '}
                      <Text style={{ color: C.inkSoft }}>{item.text}</Text>
                    </Text>
                    <Text style={{ fontSize: 10.5, color: C.inkMute, marginTop: 3 }}>{timeAgo(item.createdAt)}</Text>
                  </View>
                </View>
              )}
            />

            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderTopWidth: 0.5, borderColor: C.border, backgroundColor: C.surface }}>
                <TextInput
                  value={text}
                  onChangeText={setText}
                  placeholder="Ajouter un commentaire…"
                  placeholderTextColor={C.inkMute}
                  style={{ flex: 1, height: 40, borderRadius: 20, backgroundColor: C.surface2, paddingHorizontal: 15, fontSize: 13.5, color: C.ink }}
                  onSubmitEditing={handleSend}
                />
                <TouchableOpacity
                  onPress={handleSend}
                  disabled={!text.trim() || sending}
                  style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: text.trim() ? C.primary : C.border, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Icon name="Send" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </SafeAreaView>
        </View>
      </View>
    </Modal>
  );
}
