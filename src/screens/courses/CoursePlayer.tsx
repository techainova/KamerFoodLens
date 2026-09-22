import React, { useEffect, useMemo, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Image, Linking,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useVideoPlayer, VideoView } from 'expo-video';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { useCoursesStore } from '@/store/courses.store';
import type { CourseDetail, CourseLesson } from '@/services/courses.service';

function formatLessonDuration(seconds: number | null): string {
  if (!seconds) return '';
  const min = Math.round(seconds / 60);
  return `${min}min`;
}

// Remonté (key={lesson.id} côté appelant) à chaque changement de leçon, pour que
// useVideoPlayer reparte toujours d'un lecteur propre sur la bonne source.
function LessonMedia({ lesson }: { lesson: CourseLesson }) {
  const C = useColors();

  if (lesson.type === 'document') {
    return (
      <View style={{ backgroundColor: '#1A1A1A', aspectRatio: 16 / 9, alignItems: 'center', justifyContent: 'center', gap: 12, padding: 20 }}>
        <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(232,89,26,0.15)', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="FileText" size={28} color="#E8591A" />
        </View>
        {lesson.documentUrl ? (
          <TouchableOpacity
            onPress={() => void Linking.openURL(lesson.documentUrl!)}
            style={{ height: 40, paddingHorizontal: 18, borderRadius: 20, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
          >
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>Ouvrir le document</Text>
          </TouchableOpacity>
        ) : (
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Aucun document disponible.</Text>
        )}
      </View>
    );
  }

  if (lesson.type === 'text') {
    return (
      <View style={{ backgroundColor: C.surface, padding: 16, borderBottomWidth: 1, borderColor: C.border }}>
        {!!lesson.textImageUrl && (
          <Image source={{ uri: lesson.textImageUrl }} style={{ width: '100%', height: 180, borderRadius: 12, marginBottom: 12 }} resizeMode="cover" />
        )}
        <Text style={{ fontSize: 14, color: C.inkSoft, lineHeight: 22 }}>
          {lesson.textContent || 'Aucun contenu pour cette leçon.'}
        </Text>
      </View>
    );
  }

  if (lesson.videoUrl) {
    return <VideoLesson videoUrl={lesson.videoUrl} />;
  }

  return (
    <View style={{ backgroundColor: '#1A1A1A', aspectRatio: 16 / 9, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Aucune vidéo disponible.</Text>
    </View>
  );
}

function VideoLesson({ videoUrl }: { videoUrl: string }) {
  const player = useVideoPlayer(videoUrl, (p) => {
    p.loop = false;
  });

  useEffect(() => {
    player.play();
    return () => player.pause();
  }, [player]);

  return (
    <View style={{ backgroundColor: '#000', aspectRatio: 16 / 9 }}>
      <VideoView player={player} style={{ width: '100%', height: '100%' }} contentFit="contain" nativeControls />
    </View>
  );
}

export default function CoursePlayer() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const route = useRoute<any>();
  const courseId: string | undefined = route.params?.courseId;

  const [loading, setLoading] = useState(true);
  const [currentLessonId, setCurrentLessonId] = useState<string | undefined>(route.params?.lessonId);
  const [showList, setShowList] = useState(false);

  const details = useCoursesStore((s) => s.details);
  const completedLessonIds = useCoursesStore((s) => s.completedLessonIds);
  const fetchDetail = useCoursesStore((s) => s.fetchDetail);
  const fetchProgress = useCoursesStore((s) => s.fetchProgress);
  const completeLesson = useCoursesStore((s) => s.completeLesson);

  const course: CourseDetail | undefined = courseId ? details[courseId] : undefined;
  const completed = useMemo(() => new Set(courseId ? completedLessonIds[courseId] ?? [] : []), [courseId, completedLessonIds]);

  const lessons: CourseLesson[] = useMemo(
    () => (course ? course.sections.flatMap((s) => s.lessons) : []),
    [course],
  );

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!courseId) { setLoading(false); return; }
      setLoading(true);
      try {
        const detail = details[courseId] ?? await fetchDetail(courseId);
        await fetchProgress(courseId);
        if (!cancelled) {
          setCurrentLessonId((id) => id ?? detail.sections[0]?.lessons[0]?.id);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const currentIndex = lessons.findIndex((l) => l.id === currentLessonId);
  const currentLesson = lessons[currentIndex];
  const totalCompleted = lessons.filter((l) => completed.has(l.id)).length;
  const overallProgress = lessons.length > 0 ? totalCompleted / lessons.length : 0;

  const goNext = async () => {
    if (!courseId || !currentLesson) return;
    await completeLesson(courseId, currentLesson.id);
    if (currentIndex < lessons.length - 1) {
      setCurrentLessonId(lessons[currentIndex + 1]!.id);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentLessonId(lessons[currentIndex - 1]!.id);
    }
  };

  if (loading || !course || !currentLesson) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0A0A', alignItems: 'center', justifyContent: 'center' }}>
        <StatusBar barStyle="light-content" />
        <ActivityIndicator color="#E8591A" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      <StatusBar barStyle="light-content" />

      <View>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', padding: 12, zIndex: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 6, backgroundColor: 'rgba(0,0,0,0.35)', borderRadius: 16 }}>
            <Icon name="ArrowLeft" size={22} color="#fff" />
          </TouchableOpacity>
        </View>
        <LessonMedia key={currentLesson.id} lesson={currentLesson} />
      </View>

      <View style={{ flex: 1, backgroundColor: C.cream }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>

          {/* Lesson info */}
          <View style={{ backgroundColor: C.surface, padding: 16, borderBottomWidth: 1, borderColor: C.border }}>
            <Text style={{ fontSize: 17, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 4 }}>
              {currentLesson.title}
            </Text>
            <Text style={{ fontSize: 13, color: C.inkMute }}>
              {course.title} · {t('courses.lesson')} {currentIndex + 1}/{lessons.length}
              {currentLesson.duration ? ` · ${formatLessonDuration(currentLesson.duration)}` : ''}
            </Text>

            <View style={{ marginTop: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                <Text style={{ fontSize: 12, color: C.inkSoft }}>{t('courses.progress')}</Text>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#E8591A' }}>{Math.round(overallProgress * 100)}%</Text>
              </View>
              <View style={{ height: 5, backgroundColor: C.surface2, borderRadius: 3, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${overallProgress * 100}%`, backgroundColor: '#E8591A', borderRadius: 3 }} />
              </View>
            </View>
          </View>

          {/* Lesson list toggle */}
          <TouchableOpacity
            onPress={() => setShowList(s => !s)}
            style={{ margin: 16, backgroundColor: C.surface, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}
          >
            <Icon name="List" size={18} color="#2C1810" />
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: C.ink }}>{t('courses.lessons')}</Text>
            <Text style={{ fontSize: 12, color: C.inkMute }}>{totalCompleted}/{lessons.length}</Text>
            <Icon name={showList ? 'ChevronUp' : 'ChevronDown'} size={16} color="#8C8278" />
          </TouchableOpacity>

          {showList && (
            <View style={{ marginHorizontal: 16, marginTop: -8, marginBottom: 8, backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
              {lessons.map((lesson, i) => {
                const isCompleted = completed.has(lesson.id);
                const isCurrent = lesson.id === currentLessonId;
                const typeIcon = lesson.type === 'document' ? 'FileText' : lesson.type === 'text' ? 'Type' : 'Play';
                return (
                  <TouchableOpacity
                    key={lesson.id}
                    onPress={() => setCurrentLessonId(lesson.id)}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: i > 0 ? 1 : 0, borderColor: C.border, backgroundColor: isCurrent ? '#FFF8F5' : '#fff', gap: 10 }}
                    activeOpacity={0.7}
                  >
                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: isCompleted ? '#E3F0E4' : (isCurrent ? '#E8591A15' : '#F5F0EB'), alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={isCompleted ? 'Check' : typeIcon} size={12} color={isCompleted ? '#2E7D32' : (isCurrent ? '#E8591A' : '#8C8278')} fill={isCurrent && lesson.type !== 'document' && lesson.type !== 'text' ? '#E8591A' : 'none'} />
                    </View>
                    <Text style={{ flex: 1, fontSize: 13, color: isCurrent ? '#E8591A' : '#2C1810', fontWeight: isCurrent ? '700' : '400' }} numberOfLines={2}>
                      {lesson.title}
                    </Text>
                    <Text style={{ fontSize: 11, color: C.inkMute }}>{formatLessonDuration(lesson.duration)}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </ScrollView>

        {/* Bottom nav */}
        <View style={{ flexDirection: 'row', padding: 12, gap: 10, backgroundColor: C.surface, borderTopWidth: 1, borderColor: C.border }}>
          <TouchableOpacity
            onPress={goPrev}
            style={{ flex: 1, height: 46, borderRadius: 14, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}
            disabled={currentIndex === 0}
          >
            <Icon name="SkipBack" size={16} color={currentIndex === 0 ? '#E5E0D8' : '#2C1810'} />
            <Text style={{ fontSize: 14, fontWeight: '600', color: currentIndex === 0 ? '#E5E0D8' : '#2C1810' }}>{t('common.previous')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => void goNext()}
            style={{ flex: 1, height: 46, borderRadius: 14, backgroundColor: currentIndex === lessons.length - 1 ? '#E5E0D8' : '#E8591A', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}
            disabled={currentIndex === lessons.length - 1}
          >
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>{t('common.next')}</Text>
            <Icon name="SkipForward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
