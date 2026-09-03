import React, { useEffect, useMemo, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Image,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM, SHADOW_MD } from '@/constants/theme';
import { useCoursesStore } from '@/store/courses.store';
import type { CourseLevel } from '@/services/courses.service';

type FilterId = 'all' | CourseLevel;

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

export default function Courses() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();

  const CATEGORIES: Array<{ id: FilterId; label: string }> = [
    { id: 'all',          label: t('common.all') },
    { id: 'beginner',     label: t('courses.beginner') },
    { id: 'intermediate', label: t('courses.intermediate') },
    { id: 'advanced',     label: t('courses.expert') },
  ];

  const [activeCategory, setActiveCategory] = useState<FilterId>('all');

  const courses = useCoursesStore((s) => s.courses);
  const myCourses = useCoursesStore((s) => s.myCourses);
  const isLoading = useCoursesStore((s) => s.isLoading);
  const fetchAll = useCoursesStore((s) => s.fetchAll);
  const fetchMyCourses = useCoursesStore((s) => s.fetchMyCourses);

  useEffect(() => {
    void fetchAll();
    void fetchMyCourses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const inProgress = useMemo(
    () => myCourses.filter((c) => c.progressPct > 0 && c.progressPct < 100),
    [myCourses],
  );

  const filtered = courses.filter(c => activeCategory === 'all' || c.level === activeCategory);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('courses.title')}</Text>
      </View>

      {isLoading && courses.length === 0 ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color="#E8591A" />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

          {/* In progress */}
          {inProgress.length > 0 && (
            <View style={{ paddingTop: 16 }}>
              <Text style={{ paddingHorizontal: 16, fontSize: 13, fontWeight: '600', color: C.inkSoft, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>{t('courses.inProgress')}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 14, paddingBottom: 4 }}>
                {inProgress.map(course => (
                  <TouchableOpacity
                    key={course.id}
                    onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
                    activeOpacity={0.85}
                    style={{ width: 230, backgroundColor: C.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: C.border, ...SHADOW_MD }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                      <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: LEVEL_COLOR[course.level] + '20', borderWidth: 1.5, borderColor: LEVEL_COLOR[course.level] + '40', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                        {course.instructorAvatar ? (
                          <Image source={{ uri: course.instructorAvatar }} style={{ width: '100%', height: '100%' }} />
                        ) : (
                          <Text style={{ fontSize: 15, fontWeight: '700', color: LEVEL_COLOR[course.level] }}>{course.instructorName[0]}</Text>
                        )}
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink }} numberOfLines={2}>{course.title}</Text>
                        <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 1 }}>{course.instructorName}</Text>
                      </View>
                    </View>

                    <View style={{ marginBottom: 8 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                        <Text style={{ fontSize: 11, color: C.inkSoft }}>{t('courses.lessonProgress', { n: course.completedLessons, total: course.lessonsCount })}</Text>
                        <Text style={{ fontSize: 11, fontWeight: '700', color: '#E8591A' }}>{course.progressPct}%</Text>
                      </View>
                      <View style={{ height: 5, backgroundColor: C.surface2, borderRadius: 3, overflow: 'hidden' }}>
                        <View style={{ height: '100%', width: `${course.progressPct}%`, backgroundColor: '#E8591A', borderRadius: 3 }} />
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => navigation.navigate('CoursePlayer', { courseId: course.id })}
                      style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 10, backgroundColor: '#E8591A15', gap: 6, borderWidth: 1, borderColor: '#E8591A30' }}
                    >
                      <Icon name="Play" size={13} color="#E8591A" fill="#E8591A" />
                      <Text style={{ fontSize: 12, fontWeight: '700', color: '#E8591A' }}>{t('courses.continue')}</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Category filter */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 14, gap: 8 }}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setActiveCategory(cat.id)}
                style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: cat.id === activeCategory ? '#E8591A' : '#F5F0EB', borderWidth: 1, borderColor: cat.id === activeCategory ? '#E8591A' : '#E5E0D8' }}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', color: cat.id === activeCategory ? '#fff' : '#6D4C41' }}>{cat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* All courses */}
          <View style={{ paddingHorizontal: 16, gap: 14 }}>
            {filtered.map(course => (
              <TouchableOpacity
                key={course.id}
                onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
                activeOpacity={0.85}
                style={{ backgroundColor: C.surface, borderRadius: 18, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}
              >
                {/* Thumbnail */}
                <View style={{ height: 120, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                  {course.imageUrl ? (
                    <Image source={{ uri: course.imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  ) : (
                    <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: LEVEL_COLOR[course.level] + '20', borderWidth: 2, borderColor: LEVEL_COLOR[course.level] + '40', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 20, fontWeight: '700', color: LEVEL_COLOR[course.level] }}>{course.instructorName[0]}</Text>
                    </View>
                  )}
                  <View style={{ position: 'absolute', top: 10, left: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: LEVEL_COLOR[course.level] + '20', borderWidth: 1, borderColor: LEVEL_COLOR[course.level] + '40' }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: LEVEL_COLOR[course.level] }}>
                      {CATEGORIES.find(c => c.id === course.level)?.label ?? course.level}
                    </Text>
                  </View>
                  <View style={{ position: 'absolute', top: 10, right: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: course.isFree ? '#E3F0E4' : '#2C1810' }}>
                    <Text style={{ fontSize: 10, fontWeight: '700', color: course.isFree ? '#2E7D32' : '#fff' }}>
                      {course.isFree ? t('courses.free') : `${course.priceXAF.toLocaleString()} XAF`}
                    </Text>
                  </View>
                </View>

                <View style={{ padding: 14 }}>
                  <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink, marginBottom: 4 }} numberOfLines={2}>{course.title}</Text>
                  <Text style={{ fontSize: 12, color: C.inkMute, marginBottom: 10 }}>{course.instructorName}</Text>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Icon name="Users" size={13} color="#8C8278" />
                      <Text style={{ fontSize: 12, color: C.inkMute }}>{course.studentsCount.toLocaleString()}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Icon name="Clock" size={13} color="#8C8278" />
                      <Text style={{ fontSize: 12, color: C.inkMute }}>{formatDuration(course.durationMin)}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Icon name="List" size={13} color="#8C8278" />
                      <Text style={{ fontSize: 12, color: C.inkMute }}>{course.lessonsCount} {t('courses.lessons')}</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
