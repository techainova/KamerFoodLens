import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator,
} from 'react-native';
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
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
          <View style={{ backgroundColor: C.surface, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 16 }}>
            <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 16, color: C.ink, marginBottom: 10 }}>
              {message.subject}
            </Text>
            <Text style={{ fontSize: 14, color: C.ink, lineHeight: 21 }}>
              {message.body}
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
