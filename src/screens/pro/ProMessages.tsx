import React, { useState } from 'react';
import {
  View, ScrollView, TextInput, TouchableOpacity, StatusBar, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { proService } from '@/services/pro.service';

function formatMessageDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })
    + ' · ' + new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}

export default function ProMessages() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['pro-messages', 1],
    queryFn: () => proService.getMessages(1),
    staleTime: 60_000,
  });

  const messages = data?.items ?? [];
  const q = query.trim().toLowerCase();
  const filtered = q
    ? messages.filter(m => m.senderName.toLowerCase().includes(q) || m.subject.toLowerCase().includes(q))
    : messages;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('proMessages.title')}</Text>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 40, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 12, gap: 8 }}>
          <Icon name="Search" size={15} color={C.inkMute} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('proMessages.searchPlaceholder')}
            placeholderTextColor={C.inkMute}
            style={{ flex: 1, fontSize: 14, color: C.ink }}
          />
        </View>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.primary} size="large" />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
          {filtered.length === 0 ? (
            <View style={{ alignItems: 'center', paddingTop: 60, gap: 10 }}>
              <Icon name="Search" size={32} color={C.inkMute} />
              <Text style={{ fontSize: 13, color: C.inkMute }}>
                {messages.length === 0 ? t('proMessages.empty') : t('proMessages.noResults')}
              </Text>
            </View>
          ) : (
            filtered.map((m) => (
              <TouchableOpacity
                key={m.id}
                onPress={() => navigation.navigate('ProMessageDetail', { messageId: m.id })}
                style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderColor: C.border, backgroundColor: m.isRead ? C.surface : '#FEF3EC' }}
              >
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center', marginTop: 2 }}>
                  <Text style={{ color: C.inkSoft, fontSize: 16, fontWeight: '600' }}>{m.senderName[0]?.toUpperCase() ?? '?'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 14, fontWeight: m.isRead ? '500' : '700', color: C.ink }}>{m.senderName}</Text>
                    <Text style={{ fontSize: 11, color: C.inkMute }}>{formatMessageDate(m.createdAt)}</Text>
                  </View>
                  <Text style={{ fontSize: 13, color: C.ink, fontWeight: m.isRead ? '400' : '600', marginTop: 3 }} numberOfLines={1}>{m.subject}</Text>
                  <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 2 }} numberOfLines={1}>{m.body}</Text>
                </View>
                {!m.isRead && (
                  <View style={{ width: 9, height: 9, borderRadius: 5, backgroundColor: C.primary, marginTop: 6 }} />
                )}
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
