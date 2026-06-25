import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Image, TouchableOpacity, Animated, StatusBar, Pressable, Alert, Dimensions,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParams } from '@/navigation/types';
import Icon from '@/components/ui/Icon';
import { useStoriesStore, buildStoryGroups } from '@/store/stories.store';

type Nav = NativeStackNavigationProp<HomeStackParams, 'StoriesViewer'>;
type Route = RouteProp<HomeStackParams, 'StoriesViewer'>;

const DURATION_MS = 5000;
const SCREEN_W = Dimensions.get('window').width;

export default function StoriesViewer() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const myStories = useStoriesStore((s) => s.myStories);
  const deleteMyStory = useStoriesStore((s) => s.deleteMyStory);

  const groups = useMemo(() => buildStoryGroups(myStories), [myStories]);

  const initialGroupIndex = Math.max(0, groups.findIndex((g) => g.authorId === route.params?.authorId));
  const [groupIndex, setGroupIndex] = useState(initialGroupIndex === -1 ? 0 : initialGroupIndex);
  const [storyIndex, setStoryIndex] = useState(0);

  const progress = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);
  const segmentStartRef = useRef(Date.now());
  const remainingRef = useRef(DURATION_MS);
  const pressStartRef = useRef(0);

  const group = groups[groupIndex];
  const story = group?.stories[storyIndex];

  const closeViewer = () => navigation.goBack();

  const goNext = (direction: 'group' | 'story' = 'story') => {
    if (!group) return closeViewer();
    if (storyIndex < group.stories.length - 1) {
      setStoryIndex((i) => i + 1);
      return;
    }
    if (groupIndex < groups.length - 1) {
      slideAnim.setValue(SCREEN_W);
      setGroupIndex((i) => i + 1);
      setStoryIndex(0);
      Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }).start();
      return;
    }
    closeViewer();
  };

  const goPrev = () => {
    if (storyIndex > 0) {
      setStoryIndex((i) => i - 1);
      return;
    }
    if (groupIndex > 0) {
      const prevGroup = groups[groupIndex - 1];
      slideAnim.setValue(-SCREEN_W);
      setGroupIndex((i) => i - 1);
      setStoryIndex(prevGroup.stories.length - 1);
      Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }).start();
    }
  };

  const startTiming = (duration: number) => {
    segmentStartRef.current = Date.now();
    const anim = Animated.timing(progress, { toValue: 1, duration, useNativeDriver: false });
    animRef.current = anim;
    anim.start(({ finished }) => { if (finished) goNext(); });
  };

  useEffect(() => {
    progress.setValue(0);
    remainingRef.current = DURATION_MS;
    startTiming(DURATION_MS);
    return () => animRef.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupIndex, storyIndex]);

  const handlePressIn = () => {
    pressStartRef.current = Date.now();
    animRef.current?.stop();
    const elapsed = Date.now() - segmentStartRef.current;
    remainingRef.current = Math.max(0, remainingRef.current - elapsed);
  };

  const handlePressOut = () => {
    if (remainingRef.current <= 0) {
      goNext();
      return;
    }
    startTiming(remainingRef.current);
  };

  const HOLD_THRESHOLD_MS = 250;
  const handleTapPrev = () => {
    if (Date.now() - pressStartRef.current > HOLD_THRESHOLD_MS) return;
    goPrev();
  };
  const handleTapNext = () => {
    if (Date.now() - pressStartRef.current > HOLD_THRESHOLD_MS) return;
    goNext();
  };

  const handleDelete = () => {
    if (!story) return;
    Alert.alert(
      'Supprimer cette histoire ?',
      'Cette action est irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: () => {
            deleteMyStory(story.id);
            const remaining = group.stories.length - 1;
            if (remaining <= 0) {
              if (groups.length > 1) {
                if (groupIndex >= groups.length - 1) {
                  setGroupIndex((i) => Math.max(0, i - 1));
                }
                setStoryIndex(0);
              } else {
                closeViewer();
              }
            } else if (storyIndex >= remaining) {
              setStoryIndex(remaining - 1);
            }
          },
        },
      ],
    );
  };

  if (!group || !story) return null;

  const imageSource = typeof story.image === 'string' ? { uri: story.image } : story.image;

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={{ flex: 1, transform: [{ translateX: slideAnim }] }}>
        <Image source={imageSource} style={{ flex: 1 }} resizeMode="cover" />
        <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.25)' }} />
      </Animated.View>

      {/* Tap zones — appui court = navigue, appui maintenu = figer (comme WhatsApp) */}
      <View style={{ position: 'absolute', inset: 0, flexDirection: 'row' }}>
        <Pressable style={{ flex: 1 }} onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handleTapPrev} />
        <Pressable style={{ flex: 1.4 }} onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handleTapNext} />
      </View>

      <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
        {/* Progress bars — un segment par histoire du groupe courant */}
        <View style={{ flexDirection: 'row', gap: 4, paddingHorizontal: 12, paddingTop: 8 }}>
          {group.stories.map((s, i) => (
            <View key={s.id} style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' }}>
              <Animated.View
                style={{
                  height: 3, backgroundColor: '#fff', borderRadius: 2,
                  width: i < storyIndex ? '100%' : i === storyIndex
                    ? progress.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] })
                    : '0%',
                }}
              />
            </View>
          ))}
        </View>

        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
              <Icon name="ChefHat" size={16} color="#fff" />
            </View>
            <View>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>{group.authorName}</Text>
              {!!story.dishName && (
                <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11 }}>{story.dishName} · {story.region}</Text>
              )}
            </View>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            {group.isMine && (
              <TouchableOpacity onPress={handleDelete} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Trash2" size={16} color="#fff" />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={closeViewer} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="X" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* Caption */}
      <View style={{ position: 'absolute', bottom: 32, left: 16, right: 16 }}>
        <Text style={{ color: '#fff', fontSize: 14, lineHeight: 20, textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 6 }}>
          {story.caption}
        </Text>
      </View>
    </View>
  );
}
