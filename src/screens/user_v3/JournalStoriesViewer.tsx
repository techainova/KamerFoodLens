// src/screens/user_v3/JournalStoriesViewer.tsx
// Full-screen "Instagram Stories"-style viewer for the food journal (historique des plats).
// Matches real Instagram behavior: swipe down to dismiss (follows finger, fades out),
// swipe left/right to jump straight to another day, hold to pause (dims the header/progress
// UI while held), and a loading spinner that holds the timer until the photo is ready.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Image, TouchableOpacity, Animated, StatusBar, Pressable, Alert, Dimensions, ActivityIndicator,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParams } from '@/navigation/types';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';
import { useJournalStore, buildJournalDayGroups } from '@/store/journal.store';

type Nav = NativeStackNavigationProp<HomeStackParams, 'JournalStoriesViewer'>;
type Route = RouteProp<HomeStackParams, 'JournalStoriesViewer'>;

const DURATION_MS = 5000;
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 800;
const SWIPE_GROUP_DISTANCE = 80;
const SWIPE_GROUP_VELOCITY = 800;

const MEAL_ICON: Record<string, IconName> = {
  breakfast: 'Sun',
  lunch: 'ChefHat',
  dinner: 'Moon',
  snack: 'Zap',
};

export default function JournalStoriesViewer() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { t } = useTranslation();
  const entries = useJournalStore((s) => s.entries);
  const removeEntry = useJournalStore((s) => s.removeEntry);

  const groups = useMemo(() => buildJournalDayGroups(entries), [entries]);

  const initialGroupIndex = Math.max(0, groups.findIndex((g) => g.dayKey === route.params?.dayKey));
  const [groupIndex, setGroupIndex] = useState(initialGroupIndex === -1 ? 0 : initialGroupIndex);
  const [entryIndex, setEntryIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);

  const progress = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const headerOpacity = useRef(new Animated.Value(1)).current;
  const animRef = useRef<Animated.CompositeAnimation | null>(null);
  const segmentStartRef = useRef(Date.now());
  const remainingRef = useRef(DURATION_MS);
  const pressStartRef = useRef(0);

  const group = groups[groupIndex];
  const entry = group?.entries[entryIndex];

  const closeViewer = () => navigation.goBack();

  const goNext = () => {
    if (!group) return closeViewer();
    if (entryIndex < group.entries.length - 1) {
      setEntryIndex((i) => i + 1);
      return;
    }
    if (groupIndex < groups.length - 1) {
      slideAnim.setValue(SCREEN_W);
      setGroupIndex((i) => i + 1);
      setEntryIndex(0);
      Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }).start();
      return;
    }
    closeViewer();
  };

  const goPrev = () => {
    if (entryIndex > 0) {
      setEntryIndex((i) => i - 1);
      return;
    }
    if (groupIndex > 0) {
      const prevGroup = groups[groupIndex - 1];
      slideAnim.setValue(-SCREEN_W);
      setGroupIndex((i) => i - 1);
      setEntryIndex(prevGroup.entries.length - 1);
      Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }).start();
    }
  };

  // Swipe left/right jumps straight to the neighbouring day (not just one entry at a time).
  const jumpToGroup = (direction: 1 | -1) => {
    const nextIndex = groupIndex + direction;
    if (nextIndex < 0 || nextIndex >= groups.length) {
      resumeOrReplay();
      return;
    }
    slideAnim.setValue(direction * SCREEN_W);
    setGroupIndex(nextIndex);
    setEntryIndex(0);
    Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }).start();
  };

  const startTiming = (duration: number) => {
    segmentStartRef.current = Date.now();
    const anim = Animated.timing(progress, { toValue: 1, duration, useNativeDriver: false });
    animRef.current = anim;
    anim.start(({ finished }) => { if (finished) goNext(); });
  };

  useEffect(() => {
    setImageLoading(!!entry?.imageUrl);
    progress.setValue(0);
    remainingRef.current = DURATION_MS;
    if (!entry?.imageUrl) {
      startTiming(DURATION_MS);
    }
    // If there's a photo, startTiming is deferred to onImageLoad — no photo means nothing to wait for.
    return () => animRef.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupIndex, entryIndex]);

  const onImageLoad = () => {
    setImageLoading(false);
    startTiming(DURATION_MS);
  };

  const pauseTimer = () => {
    animRef.current?.stop();
    const elapsed = Date.now() - segmentStartRef.current;
    remainingRef.current = Math.max(0, remainingRef.current - elapsed);
  };

  const resumeOrReplay = () => {
    if (imageLoading) return; // still waiting on the photo — timer starts once it loads
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

  const handleDelete = () => {
    if (!entry) return;
    Alert.alert(
      t('journal.deleteEntryTitle', 'Supprimer cette entrée ?'),
      t('journal.deleteEntryMsg', 'Ce plat sera retiré de votre historique.'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: () => {
            void removeEntry(entry.id);
            const remaining = group.entries.length - 1;
            if (remaining <= 0) {
              if (groups.length > 1) {
                if (groupIndex >= groups.length - 1) {
                  setGroupIndex((i) => Math.max(0, i - 1));
                }
                setEntryIndex(0);
              } else {
                closeViewer();
              }
            } else if (entryIndex >= remaining) {
              setEntryIndex(remaining - 1);
            }
          },
        },
      ],
    );
  };

  // One gesture handles both axes: vertical drag follows the finger and dismisses past a
  // threshold (real Instagram "swipe down to close"); horizontal drag jumps straight to the
  // neighbouring day. minDistance keeps ordinary taps/holds on the Pressables underneath
  // from being swallowed by the gesture.
  const panGesture = Gesture.Pan()
    .minDistance(15)
    .runOnJS(true)
    .onBegin(() => {
      pauseTimer();
    })
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

  if (!group || !entry) return null;

  const timeLabel = new Date(entry.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const calories = entry.nutritionFacts?.calories;
  const mealIcon = MEAL_ICON[entry.mealType] ?? 'ChefHat';

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={{ flex: 1, backgroundColor: '#000', transform: [{ translateY }], opacity: contentOpacity }}>
        <StatusBar barStyle="light-content" />
        <Animated.View style={{ flex: 1, transform: [{ translateX: slideAnim }] }}>
          {entry.imageUrl ? (
            <Image source={{ uri: entry.imageUrl }} style={{ flex: 1 }} resizeMode="cover" onLoad={onImageLoad} />
          ) : (
            <View style={{ flex: 1, backgroundColor: '#2C1810', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="ChefHat" size={72} color="rgba(255,255,255,0.25)" />
            </View>
          )}
          <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.25)' }} />
          {imageLoading && (
            <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator color="#fff" size="large" />
            </View>
          )}
        </Animated.View>

        {/* Tap zones — appui court = navigue, appui maintenu = figer + estomper l'UI (comme Instagram) */}
        <View style={{ position: 'absolute', inset: 0, flexDirection: 'row' }}>
          <Pressable style={{ flex: 1 }} onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handleTapPrev} />
          <Pressable style={{ flex: 1.4 }} onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={handleTapNext} />
        </View>

        <Animated.View style={{ position: 'absolute', top: 0, left: 0, right: 0, opacity: headerOpacity }}>
          <SafeAreaView>
            {/* Progress bars — un segment par plat du jour courant */}
            <View style={{ flexDirection: 'row', gap: 4, paddingHorizontal: 12, paddingTop: 8 }}>
              {group.entries.map((e, i) => (
                <View key={e.id} style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' }}>
                  <Animated.View
                    style={{
                      height: 3, backgroundColor: '#fff', borderRadius: 2,
                      width: i < entryIndex ? '100%' : i === entryIndex
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
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={mealIcon} size={15} color="#fff" />
                </View>
                <View>
                  <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>{group.dateLabel}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10.5 }}>{t(`journal.${entry.mealType}`, entry.mealType)} · {timeLabel}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <TouchableOpacity onPress={handleDelete} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="Trash2" size={16} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity onPress={closeViewer} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="X" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Animated.View>

        {/* Caption — nom du plat, calories, note éventuelle */}
        <Animated.View style={{ position: 'absolute', bottom: 32, left: 16, right: 16, opacity: headerOpacity }}>
          <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'PlayfairDisplay-Bold', textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 6 }}>
            {entry.dishName}
          </Text>
          {!!calories && (
            <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, marginTop: 4, textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 6 }}>
              🔥 {calories} kcal
            </Text>
          )}
          {!!entry.note && (
            <Text style={{ color: '#fff', fontSize: 13, lineHeight: 19, marginTop: 6, textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 6 }}>
              {entry.note}
            </Text>
          )}
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}
