import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, TextInput, TouchableOpacity, StatusBar, ActivityIndicator, Image,
} from 'react-native';
import { Alert } from '@/utils/alert';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { usersService, type UserSearchResult } from '@/services/users.service';
import { messagesService } from '@/services/messages.service';

export default function NewConversation() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [startingId, setStartingId] = useState<string | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setSearching(true);
    const handle = setTimeout(() => {
      usersService.searchUsers(trimmed)
        .then((r) => { if (!cancelled) setResults(r); })
        .catch(() => { if (!cancelled) setResults([]); })
        .finally(() => { if (!cancelled) setSearching(false); });
    }, 300);
    return () => { cancelled = true; clearTimeout(handle); };
  }, [query]);

  const handleSelect = async (user: UserSearchResult) => {
    if (startingId) return;
    setStartingId(user.id);
    try {
      const conversation = await messagesService.getOrCreateConversation(user.id);
      navigation.replace('ChatThread', { conversationId: conversation.id, otherUser: conversation.otherUser });
    } catch {
      Alert.alert(t('common.error'), t('messages.startConversationError', "Impossible de démarrer la conversation."));
    } finally {
      setStartingId(null);
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
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>
          {t('messages.newConversation', 'Nouveau message')}
        </Text>
      </View>

      <View style={{ paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 }}>
        <View style={{ height: 46, flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 14, paddingHorizontal: 14, gap: 10 }}>
          <Icon name="Search" size={16} color={C.inkMute} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder={t('messages.searchUserPlaceholder', 'Nom ou pseudo...')}
            placeholderTextColor={C.inkMute}
            autoFocus
            style={{ flex: 1, fontSize: 14, color: C.ink }}
          />
          {searching && <ActivityIndicator size="small" color={C.primary} />}
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {query.trim().length >= 2 && !searching && results.length === 0 && (
          <View style={{ alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 }}>
            <Icon name="Users" size={36} color={C.inkMute} />
            <Text style={{ color: C.inkMute, fontSize: 13, marginTop: 10, textAlign: 'center' }}>
              {t('messages.noUsersFound', 'Aucun utilisateur trouvé.')}
            </Text>
          </View>
        )}
        {query.trim().length < 2 && (
          <View style={{ alignItems: 'center', paddingTop: 60, paddingHorizontal: 40 }}>
            <Icon name="Search" size={36} color={C.inkMute} />
            <Text style={{ color: C.inkMute, fontSize: 13, marginTop: 10, textAlign: 'center' }}>
              {t('messages.searchUserHint', 'Recherchez une personne par son nom ou son pseudo pour lui écrire.')}
            </Text>
          </View>
        )}
        {results.map((user) => (
          <TouchableOpacity
            key={user.id}
            onPress={() => void handleSelect(user)}
            disabled={!!startingId}
            activeOpacity={0.75}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: C.border, backgroundColor: C.surface }}
          >
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#E8591A18', borderWidth: 1.5, borderColor: '#E8591A40', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              {user.avatar ? (
                <Image source={{ uri: user.avatar }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
              ) : (
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#E8591A' }}>{user.name.charAt(0).toUpperCase()}</Text>
              )}
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }} numberOfLines={1}>{user.name}</Text>
                {user.role === 'pro' && <Text style={{ fontSize: 12 }}>✅</Text>}
              </View>
              {!!user.username && <Text style={{ fontSize: 12, color: C.inkMute }}>@{user.username}</Text>}
            </View>
            {startingId === user.id ? (
              <ActivityIndicator size="small" color={C.primary} />
            ) : (
              <Icon name="ChevronRight" size={17} color={C.inkMute} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
