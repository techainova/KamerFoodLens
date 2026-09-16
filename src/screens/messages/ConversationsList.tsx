import React, { useEffect } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useMessagesStore } from '@/store/messages.store';
import { timeAgo } from '@/utils/timeAgo';

export default function ConversationsList() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();

  const conversations = useMessagesStore((s) => s.conversations);
  const isLoading = useMessagesStore((s) => s.isLoading);
  const fetchConversations = useMessagesStore((s) => s.fetchConversations);

  useEffect(() => {
    void fetchConversations();
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>
          {t('messages.title')}
        </Text>
      </View>

      {isLoading && conversations.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#E8591A" />
        </View>
      ) : conversations.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40, gap: 10 }}>
          <Icon name="MessageSquare" size={40} color="#E5E0D8" />
          <Text style={{ color: C.inkMute, fontSize: 13, textAlign: 'center', lineHeight: 20 }}>
            {t('messages.empty')}
          </Text>
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          {conversations.map((conv) => (
            <TouchableOpacity
              key={conv.id}
              onPress={() => navigation.navigate('ChatThread', { conversationId: conv.id, otherUser: conv.otherUser })}
              activeOpacity={0.75}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderColor: C.border, backgroundColor: C.surface }}
            >
              <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: '#E8591A18', borderWidth: 1.5, borderColor: '#E8591A40', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#E8591A' }}>{conv.otherUser.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Text style={{ fontSize: 14, fontWeight: conv.unreadCount > 0 ? '700' : '600', color: C.ink }} numberOfLines={1}>
                    {conv.otherUser.name}
                  </Text>
                  {conv.otherUser.role === 'pro' && <Text style={{ fontSize: 12 }}>✅</Text>}
                </View>
                <Text
                  numberOfLines={1}
                  style={{ fontSize: 12.5, color: conv.unreadCount > 0 ? C.ink : C.inkMute, fontWeight: conv.unreadCount > 0 ? '600' : '400', marginTop: 2 }}
                >
                  {conv.lastMessage?.text ?? t('messages.noMessagesYet')}
                </Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 6 }}>
                <Text style={{ fontSize: 11, color: C.inkMute }}>{timeAgo(conv.updatedAt)}</Text>
                {conv.unreadCount > 0 && (
                  <View style={{ minWidth: 20, height: 20, borderRadius: 10, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>{conv.unreadCount}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
