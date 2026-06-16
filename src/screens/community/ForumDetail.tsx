import React, { useState } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView,
  StatusBar, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const REPLIES = [
  {
    id: '1',
    user: 'Chef Amina',
    initials: 'CA',
    initColor: '#E8591A',
    badge: 'Chef certifié',
    badgeColor: '#E8591A',
    time: '1h',
    text: "La clé c'est les écorces fraîches de HK combinées avec le njansang légèrement torréfié. Et la cuisson lente — minimum 2h30 à feu doux pour que la viande s'imbibe bien.",
    likes: 45,
    liked: false,
    isBest: true,
  },
  {
    id: '2',
    user: 'Pierre Nkolo',
    initials: 'PN',
    initColor: '#1A237E',
    badge: 'Membre',
    badgeColor: '#8C8278',
    time: '45min',
    text: "J'ajoute toujours un peu de poivre de Penja en fin de cuisson, ça change tout ! Et pour le poisson, le capitaine frais de préférence.",
    likes: 23,
    liked: false,
    isBest: false,
  },
  {
    id: '3',
    user: 'Maman Caro',
    initials: 'MC',
    initColor: '#2E7D32',
    badge: 'Experte',
    badgeColor: '#2E7D32',
    time: '20min',
    text: "Merci pour ces conseils ! J'ai une question : est-ce qu'on peut remplacer les écorces fraîches par des séchées si on n'est pas au Cameroun ?",
    likes: 8,
    liked: false,
    isBest: false,
  },
];

export default function ForumDetail() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const thread = route.params?.thread ?? {
    title: 'Comment reproduire le Mbongo Tchobi authentique à la maison ?',
    category: 'Recettes',
    catColor: '#E8591A',
    user: 'Chef Paul',
    initials: 'CP',
    initColor: '#E8591A',
    time: '2h',
    replies: 34,
    views: 428,
  };

  const [replies, setReplies] = useState(REPLIES);
  const [replyText, setReplyText] = useState('');

  const toggleLike = (id: string) => {
    setReplies(prev => prev.map(r => r.id === id ? { ...r, liked: !r.liked, likes: r.liked ? r.likes - 1 : r.likes + 1 } : r));
  };

  const sendReply = () => {
    if (!replyText.trim()) return;
    setReplies(prev => [...prev, {
      id: String(prev.length + 1),
      user: 'Moi',
      initials: 'MO',
      initColor: '#E8591A',
      badge: 'Membre',
      badgeColor: '#8C8278',
      time: 'maintenant',
      text: replyText.trim(),
      likes: 0,
      liked: false,
      isBest: false,
    }]);
    setReplyText('');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8', gap: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'Inter-Bold', fontSize: 15, color: '#2C1810' }} numberOfLines={1}>Discussion</Text>
        <TouchableOpacity style={{ padding: 4 }}>
          <Icon name="Share2" size={18} color="#6D4C41" />
        </TouchableOpacity>
        <TouchableOpacity style={{ padding: 4 }}>
          <Icon name="Bookmark" size={18} color="#6D4C41" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={80}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>

          {/* Thread header */}
          <View style={{ backgroundColor: '#fff', padding: 16, borderBottomWidth: 1, borderColor: '#F5F0EB' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: thread.catColor + '15' }}>
                <Text style={{ fontSize: 10, fontWeight: '700', color: thread.catColor }}>{thread.category}</Text>
              </View>
            </View>

            <Text style={{ fontSize: 18, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', lineHeight: 26, marginBottom: 12 }}>
              {thread.title}
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: thread.initColor + '20', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: thread.initColor + '40' }}>
                <Text style={{ fontSize: 12, fontWeight: '700', color: thread.initColor }}>{thread.initials[0]}</Text>
              </View>
              <View>
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#2C1810' }}>{thread.user}</Text>
                <Text style={{ fontSize: 11, color: '#8C8278' }}>{thread.time}</Text>
              </View>
              <View style={{ flex: 1 }} />
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="MessageCircle" size={14} color="#8C8278" />
                  <Text style={{ fontSize: 12, color: '#8C8278' }}>{thread.replies}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="Eye" size={14} color="#8C8278" />
                  <Text style={{ fontSize: 12, color: '#8C8278' }}>{thread.views}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Replies */}
          <View style={{ paddingHorizontal: 16, paddingTop: 12, gap: 12 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#6D4C41', marginBottom: 4 }}>{replies.length} réponses</Text>

            {replies.map(reply => (
              <View key={reply.id} style={{ backgroundColor: '#fff', borderRadius: 16, padding: 14, borderWidth: reply.isBest ? 1.5 : 1, borderColor: reply.isBest ? '#2E7D32' + '60' : '#E5E0D8', ...SHADOW_SM }}>
                {reply.isBest && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 8, paddingBottom: 8, borderBottomWidth: 1, borderColor: '#E3F0E4' }}>
                    <Icon name="Award" size={13} color="#2E7D32" />
                    <Text style={{ fontSize: 11, fontWeight: '700', color: '#2E7D32' }}>Meilleure réponse</Text>
                  </View>
                )}

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <View style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: reply.initColor + '20', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: reply.initColor + '40' }}>
                    <Text style={{ fontSize: 12, fontWeight: '700', color: reply.initColor }}>{reply.initials[0]}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#2C1810' }}>{reply.user}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <View style={{ paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6, backgroundColor: reply.badgeColor + '15' }}>
                        <Text style={{ fontSize: 9, fontWeight: '700', color: reply.badgeColor }}>{reply.badge}</Text>
                      </View>
                      <Text style={{ fontSize: 11, color: '#8C8278' }}>· {reply.time}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={{ padding: 4 }}>
                    <Icon name="MoreHorizontal" size={16} color="#8C8278" />
                  </TouchableOpacity>
                </View>

                <Text style={{ fontSize: 14, color: '#2C1810', lineHeight: 21, marginBottom: 10 }}>{reply.text}</Text>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  <TouchableOpacity onPress={() => toggleLike(reply.id)} style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Icon name="Heart" size={16} color={reply.liked ? '#E8591A' : '#8C8278'} fill={reply.liked ? '#E8591A' : 'none'} />
                    <Text style={{ fontSize: 13, color: reply.liked ? '#E8591A' : '#8C8278', fontWeight: '500' }}>{reply.likes}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Icon name="MessageCircle" size={16} color="#8C8278" />
                    <Text style={{ fontSize: 13, color: '#8C8278', fontWeight: '500' }}>Répondre</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Reply input */}
        <View style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#E5E0D8', flexDirection: 'row', alignItems: 'flex-end', gap: 10 }}>
          <View style={{ flex: 1, backgroundColor: '#F5F0EB', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 10, minHeight: 42 }}>
            <TextInput
              value={replyText}
              onChangeText={setReplyText}
              placeholder="Votre réponse..."
              placeholderTextColor="#8C8278"
              multiline
              style={{ fontSize: 14, color: '#2C1810', maxHeight: 100 }}
            />
          </View>
          <TouchableOpacity
            onPress={sendReply}
            style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: replyText.trim() ? '#E8591A' : '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}
            disabled={!replyText.trim()}
          >
            <Icon name="Send" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
