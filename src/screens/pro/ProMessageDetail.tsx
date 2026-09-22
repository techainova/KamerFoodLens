import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Alert } from '@/utils/alert';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { proService, type ProMessage } from '@/services/pro.service';

export default function ProMessageDetail() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const queryClient = useQueryClient();
  const C = useColors();
  const { t } = useTranslation();
  const { messageId } = route.params as { messageId: string };

  const [message, setMessage] = useState<ProMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const result = await proService.markMessageRead(messageId);
        if (!cancelled) setMessage(result);
        queryClient.invalidateQueries({ queryKey: ['pro-messages'] });
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [messageId]);

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setSending(true);
    try {
      await proService.replyToMessage(messageId, replyText.trim());
      setReplyText('');
      setSent(true);
    } catch {
      Alert.alert(t('common.error', 'Erreur'), t('proMessages.replyError', "Impossible d'envoyer la réponse."));
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 17, color: C.ink, lineHeight: 20 }} numberOfLines={1}>
            {message?.senderName ?? ''}
          </Text>
          {message && (
            <Text style={{ fontSize: 12, color: C.inkMute }}>
              {new Date(message.createdAt).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
            </Text>
          )}
        </View>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.primary} size="large" />
        </View>
      ) : !message ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ fontSize: 13, color: C.inkMute }}>{t('proMessages.notFound')}</Text>
        </View>
      ) : (
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
            <View style={{ backgroundColor: C.surface, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 16 }}>
              <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 16, color: C.ink, marginBottom: 10 }}>
                {message.subject}
              </Text>
              <Text style={{ fontSize: 14, color: C.ink, lineHeight: 21 }}>
                {message.body}
              </Text>
            </View>

            {sent && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14, padding: 12, borderRadius: 14, backgroundColor: C.successSoft }}>
                <Icon name="Check" size={14} color={C.success} />
                <Text style={{ fontSize: 12.5, color: C.success }}>{t('proMessages.replySent', 'Réponse envoyée — retrouvez la conversation dans votre messagerie.')}</Text>
              </View>
            )}
          </ScrollView>

          {message.senderId ? (
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', gap: 10, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
              <View style={{ flex: 1, minHeight: 44, maxHeight: 100, borderRadius: 20, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface2, paddingHorizontal: 14, paddingVertical: 10, justifyContent: 'center' }}>
                <TextInput
                  value={replyText}
                  onChangeText={setReplyText}
                  multiline
                  maxLength={2000}
                  placeholder={t('proMessages.replyPlaceholder', 'Écrire une réponse…')}
                  placeholderTextColor={C.inkMute}
                  style={{ fontSize: 14, color: C.ink }}
                />
              </View>
              <TouchableOpacity
                onPress={() => void handleSendReply()}
                disabled={sending || !replyText.trim()}
                style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: replyText.trim() ? C.primary : C.border, alignItems: 'center', justifyContent: 'center' }}
              >
                {sending ? <ActivityIndicator color="#fff" size="small" /> : <Icon name="Send" size={17} color="#fff" />}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{ padding: 14, borderTopWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
              <Text style={{ fontSize: 12, color: C.inkMute, textAlign: 'center' }}>
                {t('proMessages.noReplyPossible', "Ce message système n'a pas d'expéditeur identifiable — impossible d'y répondre directement.")}
              </Text>
            </View>
          )}
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
}
