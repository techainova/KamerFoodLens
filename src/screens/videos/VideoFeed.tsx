// Onglet Vidéo — fil vertical façon Reels, orienté gastronomie camerounaise.
import React, { useEffect, useRef, useState } from 'react';
import {
  View, TouchableOpacity, FlatList, Dimensions, StatusBar, ActivityIndicator, Share, Platform, type ViewToken,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useAuthGate } from '@/hooks/useAuthGate';
import { useVideosStore } from '@/store/videos.store';
import { useAuthStore } from '@/store/auth.store';
import type { VideoPost } from '@/services/videos.service';

const { height: SH, width: SW } = Dimensions.get('window');

function VideoItem({ item, active }: { item: VideoPost; active: boolean }) {
  const nav = useNavigation<any>();
  const { requireAuth } = useAuthGate();
  const toggleLike = useVideosStore((s) => s.toggleLike);
  const registerView = useVideosStore((s) => s.registerView);
  const myId = useAuthStore((s) => s.user?.id);
  const liked = !!myId && item.likes.includes(myId);
  const isFocused = useIsFocused();

  const player = useVideoPlayer(item.videoUrl, (p) => {
    p.loop = true;
    p.muted = false;
  });

  useEffect(() => {
    if (active && isFocused) {
      player.play();
      registerView(item.id);
    } else {
      player.pause();
    }
  }, [active, isFocused, player, registerView, item.id]);

  const handleShare = () => {
    const message = `${item.authorName} sur KamerFoodLens : ${item.caption}`.slice(0, 500);
    if (Platform.OS === 'web') {
      const nav = (globalThis as {
        navigator?: { share?: (data: { text: string }) => Promise<void>; clipboard?: { writeText: (t: string) => Promise<void> } };
      }).navigator;
      if (nav?.share) {
        void nav.share({ text: message }).catch(() => {});
      } else if (nav?.clipboard) {
        void nav.clipboard.writeText(message).catch(() => {});
      }
      return;
    }
    void Share.share({ message });
  };

  return (
    <View style={{ width: SW, height: SH, backgroundColor: '#0C0A09' }}>
      <VideoView player={player} style={{ width: '100%', height: '100%' }} contentFit="cover" nativeControls={false} />
      <View pointerEvents="none" style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.15)' }} />

      {/* Colonne d'actions */}
      <View style={{ position: 'absolute', right: 12, bottom: 118, alignItems: 'center', gap: 19 }}>
        <TouchableOpacity onPress={() => requireAuth(() => void toggleLike(item.id))} style={{ alignItems: 'center' }}>
          <Icon name="Heart" size={27} color={liked ? '#E8591A' : '#fff'} fill={liked ? '#E8591A' : 'none'} />
          <Text style={{ color: '#fff', fontSize: 10.5, fontWeight: '700', marginTop: 2 }}>{item.likes.length}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => nav.navigate('VideoComments', { videoId: item.id })} style={{ alignItems: 'center' }}>
          <Icon name="MessageCircle" size={26} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 10.5, fontWeight: '700', marginTop: 2 }}>{item.commentsCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleShare} style={{ alignItems: 'center' }}>
          <Icon name="Send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Infos bas d'écran */}
      <View style={{ position: 'absolute', left: 14, right: 66, bottom: 100 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
          <View style={{ width: 33, height: 33, borderRadius: 16.5, backgroundColor: item.avatarColor, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: '#fff' }}>
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{item.initials}</Text>
          </View>
          <Text style={{ color: '#fff', fontSize: 13.5, fontWeight: '700' }}>{item.authorName}</Text>
          {item.authorRole === 'pro' && <Icon name="CheckCircle" size={13} color="#fff" />}
        </View>
        <Text style={{ color: '#fff', fontSize: 13, marginTop: 9, lineHeight: 19 }} numberOfLines={3}>
          {item.caption}
        </Text>
        {item.linkedCourse && (
          <TouchableOpacity
            onPress={() => nav.navigate('CourseDetail', { courseId: item.linkedCourse!.id })}
            style={{
              marginTop: 10, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6,
              paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.16)',
            }}
          >
            <Icon name="GraduationCap" size={14} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>
              Formation liée · {item.linkedCourse.priceXAF > 0 ? `${item.linkedCourse.priceXAF.toLocaleString()} XAF` : 'Gratuite'}
            </Text>
          </TouchableOpacity>
        )}
        {item.linkedEvent && (
          <TouchableOpacity
            onPress={() => nav.navigate('EventDetail', { eventId: item.linkedEvent!.id })}
            style={{
              marginTop: 10, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 6,
              paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.16)',
            }}
          >
            <Icon name="Calendar" size={14} color="#fff" />
            <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>
              Événement lié · {item.linkedEvent.priceXAF > 0 ? `${item.linkedEvent.priceXAF.toLocaleString()} XAF` : 'Gratuit'}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

export default function VideoFeed() {
  const nav = useNavigation<any>();
  const { requireAuth } = useAuthGate();
  const videos = useVideosStore((s) => s.videos);
  const fetchFirstPage = useVideosStore((s) => s.fetchFirstPage);
  const fetchNextPage = useVideosStore((s) => s.fetchNextPage);
  const isLoading = useVideosStore((s) => s.isLoading);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => { void fetchFirstPage(); }, [fetchFirstPage]);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0 && viewableItems[0].index !== null) {
      setActiveIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({ itemVisiblePercentThreshold: 70 }).current;

  return (
    <View style={{ flex: 1, backgroundColor: '#0C0A09' }}>
      <StatusBar barStyle="light-content" />

      {videos.length === 0 && isLoading ? (
        <ActivityIndicator color="#fff" style={{ flex: 1 }} />
      ) : (
        <FlatList
          data={videos}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <VideoItem item={item} active={index === activeIndex} />}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          onEndReached={() => void fetchNextPage()}
          onEndReachedThreshold={1.2}
          getItemLayout={(_, index) => ({ length: SH, offset: SH * index, index })}
        />
      )}

      {/* Barre du haut */}
      <View style={{ position: 'absolute', top: 48, left: 14, right: 14, flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 19, color: '#fff' }}>Vidéos</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => requireAuth(() => nav.navigate('CreateVideo'))}>
          <Icon name="Camera" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
