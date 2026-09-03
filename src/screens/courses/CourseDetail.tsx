import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Image, Alert,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { useCoursesStore } from '@/store/courses.store';
import type { CourseDetail as CourseDetailData, CourseLevel } from '@/services/courses.service';

const LEVEL_COLOR: Record<CourseLevel, string> = {
  beginner: '#2E7D32',
  intermediate: '#F9A825',
  advanced: '#C62828',
};

function formatDuration(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h${String(m).padStart(2, '0')}`;
}

export default function CourseDetail() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const route = useRoute<any>();
  const courseId: string | undefined = route.params?.courseId;

  const [course, setCourse] = useState<CourseDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const fetchDetail = useCoursesStore((s) => s.fetchDetail);
  const fetchProgress = useCoursesStore((s) => s.fetchProgress);
  const enroll = useCoursesStore((s) => s.enroll);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!courseId) { setLoading(false); return; }
      setLoading(true);
      try {
        const detail = await fetchDetail(courseId);
        if (cancelled) return;
        setCourse(detail);
        setExpandedSections(new Set(detail.sections.slice(0, 1).map((s) => s.sectionTitle)));
        try {
          await fetchProgress(courseId);
          if (!cancelled) setIsEnrolled(true);
        } catch {
          if (!cancelled) setIsEnrolled(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const handleEnroll = async () => {
    if (!courseId || enrolling) return;
    setEnrolling(true);
    try {
      await enroll(courseId);
      setIsEnrolled(true);
    } catch {
      Alert.alert(t('common.error'), t('courses.enrollError'));
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
        <StatusBar barStyle={C.statusBar} />
        <ActivityIndicator color="#E8591A" />
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Icon name="BookOpen" size={48} color={C.inkMute} />
        <Text style={{ fontSize: 15, color: C.inkSoft, textAlign: 'center', marginTop: 16 }}>{t('courses.notFound')}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          <Text style={{ color: '#E8591A', fontWeight: '600' }}>{t('common.goBack')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const levelColor = LEVEL_COLOR[course.level];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle="light-content" />

      {/* Hero */}
      <View style={{ height: 200, backgroundColor: '#2C1810', justifyContent: 'flex-end', padding: 20 }}>
        {!!course.imageUrl && (
          <Image source={{ uri: course.imageUrl }} style={{ position: 'absolute', inset: 0 }} resizeMode="cover" />
        )}
        <View style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(44,24,16,0.35)' }} />
        <View style={{ position: 'absolute', top: 16, left: 0, right: 0, flexDirection: 'row', paddingHorizontal: 16 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="ArrowLeft" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: levelColor }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>{t(`courses.${course.level === 'advanced' ? 'expert' : course.level}`)}</Text>
          </View>
          {course.isFree && (
            <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: '#2E7D32' }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>{t('courses.free')}</Text>
            </View>
          )}
          {course.isCertified && (
            <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: '#F9A825', flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="Award" size={11} color="#fff" />
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>{t('courses.certified')}</Text>
            </View>
          )}
        </View>
        <Text style={{ fontSize: 20, fontFamily: 'PlayfairDisplay-Bold', color: '#fff', lineHeight: 28 }}>{course.title}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

        {/* Stats row */}
        <View style={{ backgroundColor: C.surface, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', borderBottomWidth: 1, borderColor: C.border }}>
          {[
            { icon: 'Users' as const, value: course.studentsCount.toLocaleString(), label: t('courses.studentsLabel') },
            { icon: 'Clock' as const, value: formatDuration(course.durationMin), label: t('courses.durationLabel') },
            { icon: 'List' as const, value: String(course.lessonsCount), label: t('courses.lessonsLabel') },
          ].map((stat, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center' }}>
              <Icon name={stat.icon} size={18} color={C.inkMute} />
              <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, marginTop: 3 }}>{stat.value}</Text>
              <Text style={{ fontSize: 10, color: C.inkMute }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Instructor */}
        <View style={{ marginHorizontal: 16, marginTop: 16, backgroundColor: C.surface, borderRadius: 16, padding: 14, flexDirection: 'row', gap: 12, alignItems: 'center', borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: levelColor + '20', borderWidth: 1.5, borderColor: levelColor + '40', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
            {course.instructorAvatar ? (
              <Image source={{ uri: course.instructorAvatar }} style={{ width: '100%', height: '100%' }} />
            ) : (
              <Text style={{ fontSize: 16, fontWeight: '700', color: levelColor }}>{course.instructorName[0]}</Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>{course.instructorName}</Text>
            {!!course.instructorBio && <Text style={{ fontSize: 12, color: C.inkSoft }}>{course.instructorBio}</Text>}
          </View>
        </View>

        {/* Description */}
        {!!course.description && (
          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <Text style={{ fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 8 }}>{t('events.description')}</Text>
            <Text style={{ fontSize: 14, color: C.inkSoft, lineHeight: 22 }}>{course.description}</Text>
          </View>
        )}

        {/* Curriculum */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <Text style={{ fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>{t('courses.curriculumTitle', { count: course.lessonsCount })}</Text>
          <View style={{ gap: 10 }}>
            {course.sections.map((section) => (
              <View key={section.sectionTitle} style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
                <TouchableOpacity
                  onPress={() => toggleSection(section.sectionTitle)}
                  style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12 }}
                  activeOpacity={0.8}
                >
                  <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: C.ink }}>{section.sectionTitle}</Text>
                  <Text style={{ fontSize: 12, color: C.inkMute, marginRight: 8 }}>{t('courses.lessonCount', { count: section.lessons.length })}</Text>
                  <Icon name={expandedSections.has(section.sectionTitle) ? 'ChevronUp' : 'ChevronDown'} size={16} color="#8C8278" />
                </TouchableOpacity>

                {expandedSections.has(section.sectionTitle) && (
                  <View style={{ borderTopWidth: 1, borderColor: C.border }}>
                    {section.lessons.map((lesson, i) => (
                      <TouchableOpacity
                        key={lesson.id}
                        onPress={() => isEnrolled && navigation.navigate('CoursePlayer', { courseId, lessonId: lesson.id })}
                        disabled={!isEnrolled}
                        style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 11, borderTopWidth: i > 0 ? 1 : 0, borderColor: C.border, gap: 10 }}
                        activeOpacity={0.7}
                      >
                        <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: isEnrolled ? '#E3F0E4' : '#F5F0EB', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon name={isEnrolled ? 'Play' : 'Lock'} size={12} color={isEnrolled ? '#2E7D32' : '#8C8278'} fill={isEnrolled ? '#2E7D32' : 'none'} />
                        </View>
                        <Text style={{ flex: 1, fontSize: 13, color: isEnrolled ? '#2C1810' : '#6D4C41' }}>{lesson.title}</Text>
                        {!!lesson.duration && (
                          <Text style={{ fontSize: 11, color: C.inkMute }}>{Math.round(lesson.duration / 60)}min</Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: C.surface, borderTopWidth: 1, borderColor: C.border }}>
        {!course.isFree && !isEnrolled && (
          <Text style={{ fontSize: 20, fontWeight: '700', color: C.ink, textAlign: 'center', marginBottom: 10 }}>
            {course.priceXAF.toLocaleString()} XAF
          </Text>
        )}
        <TouchableOpacity
          onPress={() => {
            if (isEnrolled) navigation.navigate('CoursePlayer', { courseId });
            else void handleEnroll();
          }}
          disabled={enrolling}
          style={{ height: 52, borderRadius: 16, backgroundColor: isEnrolled ? '#E8591A' : '#2C1810', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
          activeOpacity={0.85}
        >
          {enrolling ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Icon name={isEnrolled ? 'Play' : 'Award'} size={18} color="#fff" fill={isEnrolled ? '#fff' : 'none'} />
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
                {isEnrolled ? t('courses.startCourse') : (course.isFree ? t('courses.enrollFree') : t('courses.buyCourse'))}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
