import React, { useEffect, useMemo, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
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

export default function CoursePlayer() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const route = useRoute<any>();
  const courseId: string | undefined = route.params?.courseId;

  const [loading, setLoading] = useState(true);
  const [currentLessonId, setCurrentLessonId] = useState<string | undefined>(route.params?.lessonId);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
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
      setProgress(0);
      setPlaying(false);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentLessonId(lessons[currentIndex - 1]!.id);
      setProgress(0);
      setPlaying(false);
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

      {/* Video area (visuel uniquement — pas de lecture vidéo réelle) */}
      <View style={{ backgroundColor: '#1A1A1A', aspectRatio: 16 / 9, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', padding: 12, zIndex: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 6 }}>
            <Icon name="ArrowLeft" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => setPlaying(p => !p)}
          style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(232,89,26,0.9)', alignItems: 'center', justifyContent: 'center' }}
          activeOpacity={0.85}
        >
          <Icon name={playing ? 'Pause' : 'Play'} size={28} color="#fff" fill="#fff" />
        </TouchableOpacity>

        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12 }}>
          <TouchableOpacity
            style={{ height: 3, backgroundColor: 'rgba(255,255,255,0.3)', borderRadius: 2, marginBottom: 10, overflow: 'hidden' }}
            activeOpacity={1}
            onPress={() => setProgress(prev => Math.min(1, prev + 0.1))}
          >
            <View style={{ height: '100%', width: `${progress * 100}%`, backgroundColor: '#E8591A', borderRadius: 2 }} />
          </TouchableOpacity>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <TouchableOpacity onPress={goPrev} style={{ padding: 4 }}>
              <Icon name="SkipBack" size={22} color={currentIndex === 0 ? 'rgba(255,255,255,0.3)' : '#fff'} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setPlaying(p => !p)} style={{ padding: 4 }}>
              <Icon name={playing ? 'Pause' : 'Play'} size={22} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => void goNext()} style={{ padding: 4 }}>
              <Icon name="SkipForward" size={22} color={currentIndex === lessons.length - 1 ? 'rgba(255,255,255,0.3)' : '#fff'} />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
              {formatLessonDuration(currentLesson.duration)}
            </Text>
          </View>
        </View>
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
                return (
                  <TouchableOpacity
                    key={lesson.id}
                    onPress={() => { setCurrentLessonId(lesson.id); setProgress(0); setPlaying(false); }}
                    style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: i > 0 ? 1 : 0, borderColor: C.border, backgroundColor: isCurrent ? '#FFF8F5' : '#fff', gap: 10 }}
                    activeOpacity={0.7}
                  >
                    <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: isCompleted ? '#E3F0E4' : (isCurrent ? '#E8591A15' : '#F5F0EB'), alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={isCompleted ? 'Check' : (isCurrent ? 'Play' : 'Circle')} size={12} color={isCompleted ? '#2E7D32' : (isCurrent ? '#E8591A' : '#8C8278')} fill={isCurrent ? '#E8591A' : 'none'} />
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
