import React, { useEffect, useState } from 'react';
import {
  View, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useAuthGate } from '@/hooks/useAuthGate';
import { useVideosStore } from '@/store/videos.store';
import { videosService, type VideoComment } from '@/services/videos.service';
import { timeAgo } from '@/utils/timeAgo';

export default function VideoComments() {
  const C = useColors();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const videoId: string = route.params?.videoId;
  const { requireAuth } = useAuthGate();
  const addComment = useVideosStore((s) => s.addComment);

  const [comments, setComments] = useState<VideoComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);

  const loadComments = () => videosService.getComments(videoId).then(setComments);

  useEffect(() => {
    let cancelled = false;
    videosService.getComments(videoId).then((items) => { if (!cancelled) setComments(items); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [videoId]);

  const handleSend = () => {
    if (!text.trim() || sending) return;
    requireAuth(async () => {
      setSending(true);
      try {
        await addComment(videoId, text.trim());
        // Le store ne renvoie que le compteur (commentsCount), pas le commentaire
        // détaillé — on relit la liste pour afficher le vrai nom/avatar persisté
        // au lieu d'un placeholder local qui désynchroniserait de la base.
        await loadComments();
        setText('');
      } finally {
        setSending(false);
      }
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <View style={{ height: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, borderBottomWidth: 1, borderColor: C.border }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink }}>Commentaires</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="X" size={22} color={C.ink} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={C.primary} style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={{ padding: 16, gap: 14 }}
          ListEmptyComponent={<Text style={{ textAlign: 'center', color: C.inkMute, fontSize: 13 }}>Aucun commentaire pour le moment.</Text>}
          renderItem={({ item }) => (
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: item.avatarColor, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{item.initials}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13 }}><Text style={{ fontWeight: '700', color: C.ink }}>{item.authorName}</Text> <Text style={{ color: C.inkSoft }}>{item.text}</Text></Text>
                <Text style={{ fontSize: 10.5, color: C.inkMute, marginTop: 2 }}>{timeAgo(item.createdAt)}</Text>
              </View>
            </View>
          )}
        />
      )}

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderTopWidth: 1, borderColor: C.border }}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Ajouter un commentaire…"
            placeholderTextColor={C.inkMute}
            style={{ flex: 1, height: 40, borderRadius: 20, backgroundColor: C.surface2, paddingHorizontal: 15, fontSize: 13.5, color: C.ink }}
          />
          <TouchableOpacity onPress={handleSend} disabled={!text.trim() || sending} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: text.trim() ? C.primary : C.border, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Send" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
