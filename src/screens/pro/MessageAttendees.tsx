// Compte Pro — diffuse une notification à tous les inscrits d'un événement
// (réutilise le système de notifications existant côté back-end).
import React, { useState } from 'react';
import {
  View,
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
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { eventsService } from '@/services/events.service';

export default function MessageAttendees() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const C = useColors();
  const { t } = useTranslation();
  const eventId: string | undefined = route.params?.eventId;

  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);

  const canSend = title.trim().length > 0 && body.trim().length > 0 && !sending;

  const handleSend = async () => {
    if (!eventId) return;
    setSending(true);
    try {
      const result = await eventsService.notifyAttendees(eventId, title.trim(), body.trim());
      Alert.alert(
        t('messageAttendees.sentTitle', 'Message envoyé'),
        t('messageAttendees.sentBody', '{{count}} inscrit(s) notifié(s).', { count: result.notified }),
        [{ text: 'OK', onPress: () => navigation.goBack() }],
      );
    } catch {
      Alert.alert(t('common.error', 'Erreur'), t('messageAttendees.sendError', "Impossible d'envoyer le message."));
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('manageEvent.messageAttendees')}</Text>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ padding: 16, gap: 14 }}>
          <View>
            <Text style={{ fontSize: 11.5, fontWeight: '700', color: C.inkSoft, marginBottom: 6 }}>{t('messageAttendees.titleLabel', 'Titre')}</Text>
            <View style={{ height: 46, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, paddingHorizontal: 13, justifyContent: 'center' }}>
              <TextInput value={title} onChangeText={setTitle} maxLength={120} placeholder={t('messageAttendees.titlePlaceholder', "Changement de lieu…")} placeholderTextColor={C.inkMute} style={{ fontSize: 14, color: C.ink }} />
            </View>
          </View>
          <View>
            <Text style={{ fontSize: 11.5, fontWeight: '700', color: C.inkSoft, marginBottom: 6 }}>{t('messageAttendees.bodyLabel', 'Message')}</Text>
            <View style={{ minHeight: 120, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, padding: 13 }}>
              <TextInput value={body} onChangeText={setBody} multiline maxLength={500} placeholder={t('messageAttendees.bodyPlaceholder', 'Votre message aux inscrits…')} placeholderTextColor={C.inkMute} style={{ fontSize: 13.5, color: C.ink, lineHeight: 20 }} />
            </View>
            <Text style={{ fontSize: 10.5, color: C.inkMute, marginTop: 4, textAlign: 'right' }}>{body.length} / 500</Text>
          </View>
        </View>
      </KeyboardAvoidingView>

      <View style={{ paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        <TouchableOpacity
          onPress={() => void handleSend()}
          disabled={!canSend}
          style={{ height: 46, borderRadius: 23, backgroundColor: canSend ? C.primary : C.border, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
        >
          {sending && <ActivityIndicator color="#fff" size="small" />}
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>{t('messageAttendees.send', 'Envoyer à tous les inscrits')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
