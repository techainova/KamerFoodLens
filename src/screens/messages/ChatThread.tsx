import React, { useEffect, useRef, useState } from 'react';
import {
  View, ScrollView, TextInput, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useMessagesStore } from '@/store/messages.store';
import { useAuthStore } from '@/store/auth.store';
import type { ConversationParticipant, KflMessage } from '@/services/messages.service';

const EMPTY_MESSAGES: KflMessage[] = [];

export default function ChatThread() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const C = useColors();
  const { t } = useTranslation();
  const scrollRef = useRef<ScrollView>(null);

  const conversationId: string = route.params?.conversationId;
  const otherUser: ConversationParticipant = route.params?.otherUser;

  const myId = useAuthStore((s) => s.user?.id);
  const messages = useMessagesStore((s) => s.activeMessages[conversationId] ?? EMPTY_MESSAGES);
  const fetchMessages = useMessagesStore((s) => s.fetchMessages);
  const markRead = useMessagesStore((s) => s.markRead);
  const sendMessage = useMessagesStore((s) => s.sendMessage);

  const [text, setText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        await fetchMessages(conversationId);
        await markRead(conversationId);
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  useEffect(() => {
    if (messages.length > 0) {
      requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
    }
  }, [messages.length]);

  // Un message entrant peut arriver en temps réel (socket) pendant que le fil
  // est déjà ouvert — sans ça, il resterait compté "non lu" tant que l'écran
  // n'est pas rouvert.
  const lastMessageId = messages[messages.length - 1]?.id;
  useEffect(() => {
    if (!loading && messages.length > 0 && messages[messages.length - 1].senderId !== myId) {
      void markRead(conversationId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessageId]);

  const handleSend = async () => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setText('');
    setSending(true);
    try {
      await sendMessage(conversationId, trimmed);
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: '#E8591A18', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: '#E8591A' }}>{(otherUser?.name ?? '?').charAt(0).toUpperCase()}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink }} numberOfLines={1}>{otherUser?.name}</Text>
          {otherUser?.role === 'pro' && <Text style={{ fontSize: 13 }}>✅</Text>}
        </View>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={56}>
        {loading ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color="#E8591A" />
          </View>
        ) : (
          <ScrollView ref={scrollRef} style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 8 }} showsVerticalScrollIndicator={false}>
            {messages.map((m) => {
              const isMine = m.senderId === myId;
              return (
                <View key={m.id} style={{ alignSelf: isMine ? 'flex-end' : 'flex-start', maxWidth: '78%' }}>
                  <View
                    style={{
                      backgroundColor: isMine ? '#E8591A' : C.surface,
                      borderWidth: isMine ? 0 : 1,
                      borderColor: C.border,
                      borderRadius: 16,
                      borderBottomRightRadius: isMine ? 4 : 16,
                      borderBottomLeftRadius: isMine ? 16 : 4,
                      paddingHorizontal: 14,
                      paddingVertical: 9,
                    }}
                  >
                    <Text style={{ fontSize: 14, color: isMine ? '#fff' : C.ink, lineHeight: 20 }}>{m.text}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
        )}

        {/* Input */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingVertical: 10, borderTopWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder={t('messages.placeholder')}
            placeholderTextColor={C.inkMute}
            multiline
            style={{ flex: 1, maxHeight: 100, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: C.cream, paddingHorizontal: 14, paddingVertical: 9, fontSize: 14, color: C.ink }}
          />
          <TouchableOpacity
            onPress={() => void handleSend()}
            disabled={!text.trim() || sending}
            style={{ width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center', backgroundColor: text.trim() ? '#E8591A' : C.border }}
          >
            <Icon name="Send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
