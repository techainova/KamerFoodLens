import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, TextInput, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { useForumStore } from '@/store/forum.store';
import { useAuthStore } from '@/store/auth.store';

const CAT_COLORS: Record<string, string> = {
  Recettes:      '#E8591A',
  Restaurants:   '#1A237E',
  Ingrédients:   '#2E7D32',
  Astuces:       '#9C27B0',
  Événements:    '#F9A825',
  Général:       '#8C8278',
};

export default function ForumDetail() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const route = useRoute<any>();
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  const threadId: string | undefined = route.params?.threadId;

  const threadDetails = useForumStore(s => s.threadDetails);
  const fetchThreadDetail = useForumStore(s => s.fetchThreadDetail);
  const addReply = useForumStore(s => s.addReply);
  const toggleThreadLike = useForumStore(s => s.toggleThreadLike);
  const toggleReplyLike = useForumStore(s => s.toggleReplyLike);
  const user = useAuthStore(s => s.user);

  const thread = threadId ? threadDetails[threadId] : undefined;

  const timeAgo = (iso: string): string => {
    const diff = Date.now() - new Date(iso).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return t('community.justNow');
    if (h < 24) return `${h}h`;
    return `${Math.floor(h / 24)}j`;
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!threadId) { setLoading(false); return; }
      setLoading(true);
      try {
        await fetchThreadDetail(threadId);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [threadId]);

  const catColor = thread ? (CAT_COLORS[thread.category] ?? '#E8591A') : '#E8591A';
  const likedByMe = !!user && !!thread && thread.likes.includes(user.id);

  const sendReply = async () => {
    if (!replyText.trim() || !threadId || sending) return;
    setSending(true);
    try {
      await addReply(threadId, replyText.trim());
      setReplyText('');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
        <StatusBar barStyle={C.statusBar} />
        <ActivityIndicator color="#E8591A" />
      </SafeAreaView>
    );
  }

  if (!thread) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: C.inkMute }}>{t('community.threadNotFound')}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border, gap: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'Inter-Bold', fontSize: 15, color: C.ink }} numberOfLines={1}>{t('community.discussion')}</Text>
        <TouchableOpacity onPress={() => void toggleThreadLike(threadId!)} style={{ padding: 4, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon name="Heart" size={18} color={likedByMe ? '#E8591A' : '#6D4C41'} fill={likedByMe ? '#E8591A' : 'none'} />
          <Text style={{ fontSize: 12, color: likedByMe ? '#E8591A' : '#6D4C41' }}>{thread.likes.length}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>

          {/* Thread header */}
          <View style={{ backgroundColor: C.surface, padding: 16, borderBottomWidth: 1, borderColor: C.border }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: catColor + '15' }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: catColor }}>{thread.category}</Text>
              </View>
            </View>

            <Text style={{ fontSize: 18, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, lineHeight: 26, marginBottom: 10 }}>
              {thread.title}
            </Text>

            <Text style={{ fontSize: 14, color: C.ink, lineHeight: 22, marginBottom: 12 }}>
              {thread.content}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: thread.avatarColor + '20', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: thread.avatarColor + '40' }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: thread.avatarColor }}>{thread.initials[0]}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink }}>{thread.authorName}</Text>
                <Text style={{ fontSize: 11, color: C.inkMute }}>{timeAgo(thread.createdAt)}</Text>
              </View>
              <View style={{ flex: 1 }} />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="MessageCircle" size={14} color="#8C8278" />
                  <Text style={{ fontSize: 12, color: C.inkMute }}>{thread.replies.length}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="Eye" size={14} color="#8C8278" />
                  <Text style={{ fontSize: 12, color: C.inkMute }}>{thread.views}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Replies */}
          <View style={{ paddingHorizontal: 16, paddingTop: 12, gap: 12 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: C.inkSoft, marginBottom: 4 }}>{t('community.replyCount', { count: thread.replies.length })}</Text>

            {thread.replies.length === 0 && (
              <View style={{ alignItems: 'center', paddingVertical: 32 }}>
                <Icon name="MessageCircle" size={36} color="rgba(140,130,120,0.3)" />
                <Text style={{ color: C.inkMute, marginTop: 10 }}>{t('community.beFirstToReply')}</Text>
              </View>
            )}

            {thread.replies.map((reply) => {
              const replyLikedByMe = !!user && reply.likes.includes(user.id);
              return (
                <View key={reply.id} style={{ backgroundColor: C.surface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: '#E5E0D8', ...SHADOW_SM }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: reply.avatarColor + '20', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: reply.avatarColor + '40' }}>
                      <Text style={{ fontSize: 12, fontWeight: '700', color: reply.avatarColor }}>{reply.initials[0]}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink }}>{reply.authorName}</Text>
                      <Text style={{ fontSize: 11, color: C.inkMute }}>{timeAgo(reply.createdAt)}</Text>
                    </View>
                  </View>

                  <Text style={{ fontSize: 14, color: C.ink, lineHeight: 21, marginBottom: 10 }}>{reply.content}</Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                    <TouchableOpacity onPress={() => void toggleReplyLike(threadId!, reply.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                      <Icon name="Heart" size={16} color={replyLikedByMe ? '#E8591A' : '#8C8278'} fill={replyLikedByMe ? '#E8591A' : 'none'} />
                      <Text style={{ fontSize: 13, color: replyLikedByMe ? '#E8591A' : '#8C8278', fontWeight: '500' }}>{reply.likes.length}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setReplyText(`@${reply.authorName} `)} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                      <Icon name="MessageCircle" size={16} color="#8C8278" />
                      <Text style={{ fontSize: 13, color: C.inkMute, fontWeight: '500' }}>{t('community.replyAction')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </ScrollView>

        {/* Reply input */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: C.surface, borderTopWidth: 1, borderColor: C.border, flexDirection: 'row', alignItems: 'flex-end', gap: 10 }}>
          <View style={{ flex: 1, backgroundColor: C.surface2, borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, minHeight: 42 }}>
            <TextInput
              value={replyText}
              onChangeText={setReplyText}
              placeholder={t('community.replyPlaceholder')}
              placeholderTextColor="#8C8278"
              multiline
              style={{ fontSize: 14, color: C.ink, maxHeight: 100 }}
            />
          </View>
          <TouchableOpacity
            onPress={() => void sendReply()}
            style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: replyText.trim() ? '#E8591A' : '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}
            disabled={!replyText.trim() || sending}
          >
            {sending ? <ActivityIndicator size="small" color="#fff" /> : <Icon name="Send" size={18} color="#fff" />}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
