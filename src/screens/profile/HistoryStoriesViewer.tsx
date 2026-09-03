// src/screens/profile/HistoryStoriesViewer.tsx
// Full-screen "Instagram Stories"-style viewer for the scan history ("Historique"). Matches
// real Instagram behavior: swipe down to dismiss (follows finger, fades out), swipe
// left/right to jump straight to another day, hold to pause (dims the header/progress UI
// while held), and a loading spinner that holds the timer until the photo is ready.
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View, Image, TouchableOpacity, Animated, StatusBar, Pressable, Dimensions, ActivityIndicator,
} from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParams } from '@/navigation/types';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { scannerService, buildScanDayGroups } from '@/services/scanner.service';
import type { ScanHistoryItem } from '@/services/scanner.service';

type Nav = NativeStackNavigationProp<HomeStackParams, 'HistoryStoriesViewer'>;
type Route = RouteProp<HomeStackParams, 'HistoryStoriesViewer'>;

const DURATION_MS = 5000;
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
const DISMISS_DISTANCE = 120;
const DISMISS_VELOCITY = 800;
const SWIPE_GROUP_DISTANCE = 80;
const SWIPE_GROUP_VELOCITY = 800;

export default function HistoryStoriesViewer() {
  const navigation = useNavigation<Nav>();
  const route = useRoute<Route>();
  const { t } = useTranslation();
  const [items, setItems] = useState<ScanHistoryItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    void scannerService.getHistory(1, 100).then(({ items: fetched }) => {
      if (!cancelled) setItems(fetched);
    });
    return () => { cancelled = true; };
  }, []);

  const groups = useMemo(() => buildScanDayGroups(items), [items]);

  const initialGroupIndex = Math.max(0, groups.findIndex((g) => g.dayKey === route.params?.dayKey));
  const [groupIndex, setGroupIndex] = useState(initialGroupIndex === -1 ? 0 : initialGroupIndex);
  const [itemIndex, setItemIndex] = useState(0);
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
  const item = group?.items[itemIndex];

  const closeViewer = () => navigation.goBack();

  const goNext = () => {
    if (!group) return closeViewer();
    if (itemIndex < group.items.length - 1) {
      setItemIndex((i) => i + 1);
      return;
    }
    if (groupIndex < groups.length - 1) {
      slideAnim.setValue(SCREEN_W);
      setGroupIndex((i) => i + 1);
      setItemIndex(0);
      Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }).start();
      return;
    }
    closeViewer();
  };

  const goPrev = () => {
    if (itemIndex > 0) {
      setItemIndex((i) => i - 1);
      return;
    }
    if (groupIndex > 0) {
      const prevGroup = groups[groupIndex - 1];
      slideAnim.setValue(-SCREEN_W);
      setGroupIndex((i) => i - 1);
      setItemIndex(prevGroup.items.length - 1);
      Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }).start();
    }
  };

  // Swipe left/right jumps straight to the neighbouring day (not just one scan at a time).
  const jumpToGroup = (direction: 1 | -1) => {
    const nextIndex = groupIndex + direction;
    if (nextIndex < 0 || nextIndex >= groups.length) {
      resumeOrReplay();
      return;
    }
    slideAnim.setValue(direction * SCREEN_W);
    setGroupIndex(nextIndex);
    setItemIndex(0);
    Animated.timing(slideAnim, { toValue: 0, duration: 220, useNativeDriver: true }).start();
  };

  const startTiming = (duration: number) => {
    segmentStartRef.current = Date.now();
    const anim = Animated.timing(progress, { toValue: 1, duration, useNativeDriver: false });
    animRef.current = anim;
    anim.start(({ finished }) => { if (finished) goNext(); });
  };

  useEffect(() => {
    if (!item) return;
    setImageLoading(!!item.imageUrl);
    progress.setValue(0);
    remainingRef.current = DURATION_MS;
    if (!item.imageUrl) {
      startTiming(DURATION_MS);
    }
    return () => animRef.current?.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupIndex, itemIndex, !!item]);

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
    if (imageLoading) return;
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

  const handleViewDetails = () => {
    if (!item) return;
    navigation.navigate('Result', {
      scanId: item.scanId,
      classId: item.classId,
      confidence: item.confidence,
      imageUri: item.imageUrl,
    });
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

  if (!group || !item) return null;

  const timeLabel = new Date(item.scannedAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const confidencePct = Math.round(item.confidence * 100);
  const confidenceColor = confidencePct >= 70 ? '#2E7D32' : confidencePct >= 50 ? '#E8591A' : '#C62828';

  return (
    <GestureDetector gesture={panGesture}>
      <Animated.View style={{ flex: 1, backgroundColor: '#000', transform: [{ translateY }], opacity: contentOpacity }}>
        <StatusBar barStyle="light-content" />
        <Animated.View style={{ flex: 1, transform: [{ translateX: slideAnim }] }}>
          {item.imageUrl ? (
            <Image source={{ uri: item.imageUrl }} style={{ flex: 1 }} resizeMode="cover" onLoad={onImageLoad} />
          ) : (
            <View style={{ flex: 1, backgroundColor: '#2C1810', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Camera" size={72} color="rgba(255,255,255,0.25)" />
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
            {/* Progress bars — un segment par scan du jour courant */}
            <View style={{ flexDirection: 'row', gap: 4, paddingHorizontal: 12, paddingTop: 8 }}>
              {group.items.map((it, i) => (
                <View key={it.scanId} style={{ flex: 1, height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)', overflow: 'hidden' }}>
                  <Animated.View
                    style={{
                      height: 3, backgroundColor: '#fff', borderRadius: 2,
                      width: i < itemIndex ? '100%' : i === itemIndex
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
                  <Icon name="Camera" size={15} color="#fff" />
                </View>
                <View>
                  <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>{group.dateLabel}</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 10.5 }}>{timeLabel}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View style={{ paddingHorizontal: 8, height: 22, borderRadius: 11, backgroundColor: confidenceColor, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>{confidencePct}%</Text>
                </View>
                <TouchableOpacity onPress={closeViewer} style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="X" size={18} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </SafeAreaView>
        </Animated.View>

        {/* Caption + CTA */}
        <Animated.View style={{ position: 'absolute', bottom: 32, left: 16, right: 16, opacity: headerOpacity }}>
          <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'PlayfairDisplay-Bold', textShadowColor: 'rgba(0,0,0,0.6)', textShadowRadius: 6, marginBottom: 14 }}>
            {item.dishName}
          </Text>
          <TouchableOpacity
            onPress={handleViewDetails}
            style={{ height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.95)', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
          >
            <Icon name="ChevronRight" size={16} color="#2C1810" />
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#2C1810' }}>{t('history.viewDetails', 'Voir les détails')}</Text>
          </TouchableOpacity>
        </Animated.View>
      </Animated.View>
    </GestureDetector>
  );
}
