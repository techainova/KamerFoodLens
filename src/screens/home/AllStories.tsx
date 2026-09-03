import React, { useEffect, useMemo } from 'react';
import {
  View, ScrollView, TouchableOpacity, Image, StatusBar, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useStoriesStore, buildStoryGroups } from '@/store/stories.store';
import { useAuthStore } from '@/store/auth.store';
import { SHADOW_SM } from '@/constants/theme';

function timeAgo(iso: string): string {
  const diffMin = Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (diffMin < 60) return `il y a ${diffMin} min`;
  const diffH = Math.round(diffMin / 60);
  return `il y a ${diffH}h`;
}

export default function AllStories() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const stories = useStoriesStore((s) => s.stories);
  const isLoading = useStoriesStore((s) => s.isLoading);
  const fetchAll = useStoriesStore((s) => s.fetchAll);
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    void fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const groups = useMemo(() => buildStoryGroups(stories, user?.id), [stories, user?.id]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('home.dishStories')}</Text>
        <TouchableOpacity onPress={() => navigation.navigate('StoryCreatorCamera')} style={{ padding: 4 }}>
          <Icon name="Plus" size={22} color={C.primary} />
        </TouchableOpacity>
      </View>

      {isLoading && stories.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#E8591A" />
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }} showsVerticalScrollIndicator={false}>
          {groups.length === 0 ? (
            <View style={{ alignItems: 'center', paddingTop: 60 }}>
              <Icon name="Camera" size={36} color={C.inkMute} />
              <Text style={{ color: C.inkMute, marginTop: 10 }}>{t('home.noStories')}</Text>
            </View>
          ) : (
            groups.map((g) => {
              const last = g.stories[g.stories.length - 1];
              return (
                <TouchableOpacity
                  key={g.authorId}
                  onPress={() => navigation.navigate('StoriesViewer', { authorId: g.authorId })}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 12, ...SHADOW_SM }}
                  activeOpacity={0.8}
                >
                  <View style={{ width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: g.isMine ? C.gold : C.primary, padding: 2, overflow: 'hidden' }}>
                    {last.imageUrl ? (
                      <Image source={{ uri: last.imageUrl }} style={{ width: '100%', height: '100%', borderRadius: 24 }} resizeMode="cover" />
                    ) : (
                      <View style={{ width: '100%', height: '100%', borderRadius: 24, backgroundColor: last.backgroundColor ?? C.navy }} />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, fontFamily: 'Inter-Bold' }}>{g.authorName}</Text>
                    <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 2 }}>
                      {g.stories.length > 1 ? `${g.stories.length} histoires · ` : ''}{timeAgo(last.createdAt)}
                    </Text>
                  </View>
                  <Icon name="ChevronRight" size={16} color={C.inkMute} />
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
