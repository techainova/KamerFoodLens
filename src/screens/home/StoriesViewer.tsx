// src/screens/home/StoriesViewer.tsx
// Matche le comportement Instagram réel : swipe bas pour fermer (suit le doigt,
// s'estompe), swipe latéral pour sauter directement au groupe voisin, appui
// maintenu qui fige le défilement et estompe l'interface. Peut aussi afficher
// les histoires d'un highlight permanent (route.params.highlightId) au lieu
// du fil éphémère.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Image, TouchableOpacity, Animated, StatusBar, Pressable, Alert, Dimensions,
  TextInput, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParams } from '@/navigation/types';
import { useTranslation } from 'react-i18next';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from '@/components/ui/Icon';
import { useStoriesStore, buildStoryGroups, type StoryGroup } from '@/store/stories.store';
import { useAuthStore } from '@/store/auth.store';
import StoryPollSticker from './story-stickers/StoryPollSticker';
import StoryQuizSticker from './story-stickers/StoryQuizSticker';
import StorySliderSticker from './story-stickers/StorySliderSticker';
import StoryViewersSheet from './story-stickers/StoryViewersSheet';
import StoryRepliesSheet from './story-stickers/StoryRepliesSheet';
import AddToHighlightSheet from './story-stickers/AddToHighlightSheet';
import { getStoryFilterOverlay } from './story-stickers/storyFilters';

type Nav = NativeStackNavigationProp<HomeStackParams, 'StoriesViewer'>;
type Route = RouteProp<HomeStackParams, 'StoriesViewer'>;

const DURATION_MS = 5000;
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const QUICK_REACTIONS = ['❤️', '😂', '😮', '😢', '🔥', '👍'];
const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 800;
const SWIPE_GROUP_DISTANCE = 80;
const SWIPE_GROUP_VELOCITY = 800;

export default function StoriesViewer() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { t } = useTranslation();
  const highlightId = route.params?.highlightId;

  const liveStories = useStoriesStore((s) => s.stories);
  const removeStory = useStoriesStore((s) => s.removeStory);
  const viewStory = useStoriesStore((s) => s.viewStory);
  const reactToStory = useStoriesStore((s) => s.reactToStory);
  const replyToStory = useStoriesStore((s) => s.replyToStory);
  const voteStoryPoll = useStoriesStore((s) => s.voteStoryPoll);
  const answerStoryQuiz = useStoriesStore((s) => s.answerStoryQuiz);
  const rateStorySlider = useStoriesStore((s) => s.rateStorySlider);
  const getStoryViewers = useStoriesStore((s) => s.getStoryViewers);
  const getStoryReplies = useStoriesStore((s) => s.getStoryReplies);
  const getHighlightDetail = useStoriesStore((s) => s.getHighlightDetail);
  const user = useAuthStore((s) => s.user);

  const [highlightGroup, setHighlightGroup] = useState<StoryGroup | null>(null);

  useEffect(() => {
    if (!highlightId) { setHighlightGroup(null); return; }
    void getHighlightDetail(highlightId).then((detail) => {
      setHighlightGroup({
        authorId: detail.stories[0]?.authorId ?? '',
        authorName: detail.title,
        isMine: detail.stories[0]?.authorId === user?.id,
        stories: detail.stories,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [highlightId]);

  const groups = useMemo(
    () => (highlightId ? (highlightGroup ? [highlightGroup] : []) : buildStoryGroups(liveStories, user?.id)),
    [highlightId, highlightGroup, liveStories, user?.id],
  );

  const initialGroupIndex = Math.max(0, groups.findIndex((g) => g.authorId === route.params?.authorId));
  const [groupIndex, setGroupIndex] = useState(initialGroupIndex === -1 ? 0 : initialGroupIndex);
  const [storyIndex, setStoryIndex] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [sendingReply, setSendingReply] = useState(false);
  const [viewersVisible, setViewersVisible] = useState(false);
  const [repliesVisible, setRepliesVisible] = useState(false);
  const [highlightSheetVisible, setHighlightSheetVisible] = useState(false);

  const progress = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);
  const segmentStartRef = useRef(Date.now());
  const remainingRef = useRef(DURATION_MS);
  const pressStartRef = useRef(0);
  const viewedRef = useRef<Set<string>>(new Set());

  const group = groups[groupIndex];
  const story = group?.stories[storyIndex];

  const closeViewer = () => navigation.goBack();

  const goNext = () => {
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

  const jumpToGroup = (direction: 1 | -1) => {
    const nextIndex = groupIndex + direction;
    if (nextIndex < 0 || nextIndex >= groups.length) {
      resumeOrReplay();
      return;
    }
    slideAnim.setValue(direction * SCREEN_W);
    setGroupIndex(nextIndex);
    setStoryIndex(0);
    Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }).start();
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

  useEffect(() => {
    setReplyText('');
    if (story && !group?.isMine && !viewedRef.current.has(story.id)) {
      viewedRef.current.add(story.id);
      void viewStory(story.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [story?.id]);

  const pauseTimer = () => {
    animRef.current?.stop();
    const elapsed = Date.now() - segmentStartRef.current;
    remainingRef.current = Math.max(0, remainingRef.current - elapsed);
  };

  const resumeOrReplay = () => {
    if (remainingRef.current <= 0) {
      goNext();
      return;
    }
    startTiming(remainingRef.current);
  };

  const handlePressIn = () => {
    pressStartRef.current = Date.now();
    pauseTimer();
    Animated.timing(headerOpacity, { toValue: 0, duration: 180, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.timing(headerOpacity, { toValue: 1, duration: 180, useNativeDriver: true }).start();
    resumeOrReplay();
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

  // Un seul geste gère les deux axes : le glissement vertical suit le doigt et ferme
  // au-delà d'un seuil (vrai "swipe down" Instagram) ; l'horizontal saute directement
  // au groupe voisin. minDistance évite d'avaler les taps/appuis maintenus des Pressables.
  const panGesture = Gesture.Pan()
    .minDistance(15)
    .runOnJS(true)
    .onBegin(() => { pauseTimer(); })
    .onUpdate((e) => {
      if (Math.abs(e.translationY) > Math.abs(e.translationX)) {
        const dy = Math.max(0, e.translationY);
        translateY.setValue(dy);
        contentOpacity.setValue(1 - Math.min(dy / 500, 0.55));
      }
    })
    .onEnd((e) => {
      const isVertical = Math.abs(e.translationY) > Math.abs(e.translationX);
      if (isVertical) {
        if (e.translationY > DISMISS_DISTANCE || e.velocityY > DISMISS_VELOCITY) {
          Animated.timing(translateY, { toValue: SCREEN_H, duration: 200, useNativeDriver: true }).start(closeViewer);
          return;
        }
        Animated.spring(translateY, { toValue: 0, useNativeDriver: true, friction: 8 }).start();
        Animated.timing(contentOpacity, { toValue: 1, duration: 150, useNativeDriver: true }).start();
        resumeOrReplay();
        return;
      }

      if (e.translationX < -SWIPE_GROUP_DISTANCE || e.velocityX < -SWIPE_GROUP_VELOCITY) {
        jumpToGroup(1);
      } else if (e.translationX > SWIPE_GROUP_DISTANCE || e.velocityX > SWIPE_GROUP_VELOCITY) {
        jumpToGroup(-1);
      } else {
        resumeOrReplay();
      }
    });

  const handleDelete = () => {
    if (!story) return;
    Alert.alert(
      t('home.deleteStoryTitle'),
      t('home.deleteStoryMsg'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            void removeStory(story.id);
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

  const handleSendReply = async () => {
    if (!story || !replyText.trim() || sendingReply) return;
    const text = replyText.trim();
    setSendingReply(true);
    try {
      await replyToStory(story.id, text);
      setReplyText('');
    } catch {
      Alert.alert(t('common.error'), t('community.postError'));
    } finally {
      setSendingReply(false);
    }
  };

  if (!group || !story) return null;

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={{ flex: 1, backgroundColor: '#000', transform: [{ translateY }], opacity: contentOpacity }}>
        <StatusBar barStyle="light-content" />
        <Animated.View style={{ flex: 1, transform: [{ translateX: slideAnim }] }}>
          {story.mediaType === 'text' ? (
            story.gradient && story.gradient.length >= 2 ? (
              <LinearGradient colors={story.gradient as [string, string]} style={{ flex: 1 }} />
            ) : (
              <View style={{ flex: 1, backgroundColor: story.backgroundColor ?? '#1A237E' }} />
            )
          ) : (
            <>
              <Image source={{ uri: story.imageUrl ?? '' }} style={{ flex: 1 }} resizeMode="cover" />
              {!!story.filter && <View style={{ position: 'absolute', inset: 0, backgroundColor: getStoryFilterOverlay(story.filter) }} />}
            </>
          )}
          <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.25)' }} />
        </Animated.View>

        {/* Superpositions de texte libres, positionnées en % d'écran */}
        {story.textOverlays.map((overlay, i) => (
          <View
            key={i}
            pointerEvents="none"
            style={{ position: 'absolute', left: `${overlay.x * 100}%`, top: `${overlay.y * 100}%`, maxWidth: 240 }}
          >
            <View style={{ backgroundColor: overlay.backgroundColor, borderRadius: 8, paddingHorizontal: overlay.backgroundColor ? 8 : 0, paddingVertical: overlay.backgroundColor ? 4 : 0 }}>
              <Text style={{ color: overlay.color, fontSize: overlay.fontSize, fontWeight: overlay.fontWeight as any, textAlign: overlay.align as any }}>
                {overlay.text}
              </Text>
            </View>
          </View>
        ))}

        {/* Tap zones — appui court = navigue, appui maintenu = figer + estomper l'UI (comme Instagram) */}
        <View style={{ position: 'absolute', inset: 0, flexDirection: 'row' }}>
          <Pressable style={{ flex: 1 }} onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handleTapPrev} />
          <Pressable style={{ flex: 1.4 }} onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handleTapNext} />
        </View>

        <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, opacity: headerOpacity }}>
          <SafeAreaView>
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
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: story.avatarColor + '40', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{story.initials[0]}</Text>
                </View>
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>{group.authorName}</Text>
                {!!highlightId && <Icon name="Award" size={14} color="#F9A825" />}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                {group.isMine && !highlightId && (
                  <TouchableOpacity onPress={() => setHighlightSheetVisible(true)} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name="Bookmark" size={16} color="#fff" />
                  </TouchableOpacity>
                )}
                {group.isMine && !highlightId && (
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
        </Animated.View>

        {/* Stickers interactifs — un seul type possible par histoire, positionné via sa coordonnée y */}
        {(story.poll || story.quiz || story.slider) && (
          <View
            style={{ position: 'absolute', left: 20, right: 20, top: `${(story.poll?.y ?? story.quiz?.y ?? story.slider?.y ?? 0.4) * 100}%` }}
            pointerEvents="box-none"
          >
            {story.poll && (
              <StoryPollSticker poll={story.poll} onVote={(optionIndex) => void voteStoryPoll(story.id, optionIndex)} />
            )}
            {story.quiz && (
              <StoryQuizSticker quiz={story.quiz} onAnswer={(optionIndex) => void answerStoryQuiz(story.id, optionIndex)} />
            )}
            {story.slider && (
              <StorySliderSticker slider={story.slider} onRate={(value) => void rateStorySlider(story.id, value)} />
            )}
          </View>
        )}

        {/* Caption */}
        {!!story.caption && (
          <Animated.View style={{ position: 'absolute', bottom: group.isMine ? 96 : 108, left: 16, right: 16, opacity: headerOpacity }}>
            <Text style={{ color: '#fff', fontSize: 14, lineHeight: 20, textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 6 }}>
              {story.caption}
            </Text>
          </Animated.View>
        )}

        {/* Bas d'écran : vues/réponses (propriétaire) ou réactions + réponse (autres) */}
        {group.isMine ? (
          <Animated.View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, opacity: headerOpacity }}>
            <SafeAreaView edges={['bottom']}>
              <View style={{ flexDirection: 'row', gap: 8, marginLeft: 16, marginBottom: 14 }}>
                <TouchableOpacity
                  onPress={() => setViewersVisible(true)}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.35)' }}
                >
                  <Icon name="Eye" size={16} color="#fff" />
                  <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>
                    {t('home.storyViewsCount', { count: story.viewsCount })}
                  </Text>
                </TouchableOpacity>
                {story.repliesCount > 0 && (
                  <TouchableOpacity
                    onPress={() => setRepliesVisible(true)}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.35)' }}
                  >
                    <Icon name="MessageCircle" size={16} color="#fff" />
                    <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{story.repliesCount}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </SafeAreaView>
          </Animated.View>
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}
          >
            <Animated.View style={{ opacity: headerOpacity }}>
              <SafeAreaView edges={['bottom']}>
                <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, marginBottom: 10 }}>
                  {QUICK_REACTIONS.map((emoji) => (
                    <TouchableOpacity
                      key={emoji}
                      onPress={() => void reactToStory(story.id, emoji)}
                      style={{
                        width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center',
                        backgroundColor: story.myReactionEmoji === emoji ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)',
                        borderWidth: story.myReactionEmoji === emoji ? 1 : 0, borderColor: '#fff',
                      }}
                    >
                      <Text style={{ fontSize: 18 }}>{emoji}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingBottom: 14 }}>
                  <TextInput
                    value={replyText}
                    onChangeText={setReplyText}
                    onFocus={handlePressIn}
                    onBlur={handlePressOut}
                    placeholder={t('home.storyReplyPlaceholder')}
                    placeholderTextColor="rgba(255,255,255,0.6)"
                    style={{
                      flex: 1, height: 42, borderRadius: 21, borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)',
                      paddingHorizontal: 16, color: '#fff', fontSize: 13,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => void handleSendReply()}
                    disabled={!replyText.trim() || sendingReply}
                    style={{
                      width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center',
                      backgroundColor: replyText.trim() ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.25)',
                    }}
                  >
                    <Icon name="Send" size={18} color={replyText.trim() ? '#000' : '#fff'} />
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </Animated.View>
          </KeyboardAvoidingView>
        )}

        <StoryViewersSheet
          visible={viewersVisible}
          onClose={() => setViewersVisible(false)}
          loadViewers={() => getStoryViewers(story.id)}
        />
        <StoryRepliesSheet
          visible={repliesVisible}
          onClose={() => setRepliesVisible(false)}
          loadReplies={() => getStoryReplies(story.id)}
        />
        <AddToHighlightSheet
          visible={highlightSheetVisible}
          storyId={story.id}
          onClose={() => setHighlightSheetVisible(false)}
        />
      </Animated.View>
    </GestureDetector>
  );
}
