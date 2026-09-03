import React, { useState } from 'react';
import {
  View, TextInput, ScrollView, TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, Alert, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useForumStore, FORUM_CATEGORIES } from '@/store/forum.store';

export default function CreateThread() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();

  const [category, setCategory] = useState(FORUM_CATEGORIES[0]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [publishing, setPublishing] = useState(false);

  const createThread = useForumStore(s => s.createThread);

  const canPublish = title.trim().length > 0 && content.trim().length > 0 && !publishing;

  const handlePublish = async () => {
    if (!canPublish) return;
    setPublishing(true);
    try {
      const thread = await createThread({ title: title.trim(), content: content.trim(), tags: [category] });
      navigation.replace('ForumDetail', { threadId: thread.id });
    } catch {
      Alert.alert(t('common.error'), t('community.postError'));
    } finally {
      setPublishing(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border, gap: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="X" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: C.ink }}>{t('community.newThreadTitle')}</Text>
        <TouchableOpacity
          onPress={() => void handlePublish()}
          style={{ paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: canPublish ? '#E8591A' : '#E5E0D8', flexDirection: 'row', alignItems: 'center', gap: 6 }}
          disabled={!canPublish}
        >
          {publishing && <ActivityIndicator size="small" color="#fff" />}
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>{t('community.publishThread')}</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

          {/* Category selector */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: C.inkSoft, marginBottom: 10 }}>{t('community.selectCategory')}</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {FORUM_CATEGORIES.map(cat => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: cat === category ? '#E8591A15' : '#F5F0EB', borderWidth: 1.5, borderColor: cat === category ? '#E8591A' : '#E5E0D8' }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '600', color: cat === category ? '#E8591A' : '#6D4C41' }}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Title */}
          <View style={{ backgroundColor: C.surface, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderColor: C.border }}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder={t('community.threadTitlePlaceholder')}
              placeholderTextColor="#8C8278"
              style={{ fontSize: 16, fontWeight: '700', color: C.ink }}
            />
          </View>

          {/* Body */}
          <View style={{ backgroundColor: C.surface, paddingHorizontal: 16, paddingTop: 14, paddingBottom: 8 }}>
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder={t('community.threadBodyPlaceholder')}
              placeholderTextColor="#8C8278"
              multiline
              style={{ fontSize: 15, color: C.ink, lineHeight: 24, minHeight: 160, textAlignVertical: 'top' }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
