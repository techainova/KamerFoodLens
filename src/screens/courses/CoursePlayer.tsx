import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const LESSONS = [
  { id: 'l1', title: 'Présentation du cours et du chef', duration: '12min', completed: true, free: true },
  { id: 'l2', title: 'Histoire et origine du Mbongo Tchobi', duration: '18min', completed: true, free: true },
  { id: 'l3', title: 'Identifier le njansang et l\'écorce HK', duration: '25min', completed: false, free: false },
  { id: 'l4', title: 'Torréfaction et broyage des épices', duration: '30min', completed: false, free: false },
  { id: 'l5', title: 'Choix du poisson : capitaine vs carpe', duration: '20min', completed: false, free: false },
  { id: 'l6', title: 'Préparation de la base — oignon et tomate', duration: '22min', completed: false, free: false },
];

export default function CoursePlayer() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const route = useRoute<any>();
  const course = route.params?.course ?? { title: 'Maîtriser le Mbongo Tchobi', instructor: 'Chef Paul', instructorColor: '#E8591A' };
  const startId = route.params?.lessonId ?? 'l3';

  const [currentLessonId, setCurrentLessonId] = useState(startId);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0.0);
  const [lessons, setLessons] = useState(LESSONS);
  const [showList, setShowList] = useState(false);

  const currentIndex = lessons.findIndex(l => l.id === currentLessonId);
  const currentLesson = lessons[currentIndex] ?? lessons[0];
  const totalCompleted = lessons.filter(l => l.completed).length;

  const goNext = () => {
    if (currentIndex < lessons.length - 1) {
      setLessons(prev => prev.map(l => l.id === currentLessonId ? { ...l, completed: true } : l));
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

  const overallProgress = totalCompleted / lessons.length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0A0A0A' }}>
      <StatusBar barStyle="light-content" />

      {/* Video area */}
      <View style={{ backgroundColor: '#1A1A1A', aspectRatio: 16 / 9, justifyContent: 'center', alignItems: 'center' }}>
        {/* Back & fullscreen */}
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', padding: 12, zIndex: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 6 }}>
            <Icon name="ArrowLeft" size={22} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity style={{ padding: 6 }}>
            <Icon name="Maximize2" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Center play button */}
        <TouchableOpacity
          onPress={() => setPlaying(p => !p)}
          style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: 'rgba(232,89,26,0.9)', alignItems: 'center', justifyContent: 'center' }}
          activeOpacity={0.85}
        >
          <Icon name={playing ? 'Pause' : 'Play'} size={28} color="#fff" fill="#fff" />
        </TouchableOpacity>

        {/* Controls bar */}
        <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12 }}>
          {/* Progress bar */}
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
            <TouchableOpacity onPress={goNext} style={{ padding: 4 }}>
              <Icon name="SkipForward" size={22} color={currentIndex === lessons.length - 1 ? 'rgba(255,255,255,0.3)' : '#fff'} />
            </TouchableOpacity>
            <View style={{ flex: 1 }} />
            <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>
              {Math.floor(progress * 25)}:00 / {currentLesson?.duration ?? '25min'}
            </Text>
          </View>
        </View>
      </View>

      <View style={{ flex: 1, backgroundColor: C.cream }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 20 }} showsVerticalScrollIndicator={false}>

          {/* Lesson info */}
          <View style={{ backgroundColor: C.surface, padding: 16, borderBottomWidth: 1, borderColor: C.border }}>
            <Text style={{ fontSize: 17, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 4 }}>
              {currentLesson?.title ?? ''}
            </Text>
            <Text style={{ fontSize: 13, color: C.inkMute }}>
              {course.title} · Leçon {currentIndex + 1}/{lessons.length}
            </Text>

            {/* Overall progress */}
            <View style={{ marginTop: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                <Text style={{ fontSize: 12, color: C.inkSoft }}>Progression globale</Text>
                <Text style={{ fontSize: 12, fontWeight: '700', color: '#E8591A' }}>{Math.round(overallProgress * 100)}%</Text>
              </View>
              <View style={{ height: 5, backgroundColor: C.surface2, borderRadius: 3, overflow: 'hidden' }}>
                <View style={{ height: '100%', width: `${overallProgress * 100}%`, backgroundColor: '#E8591A', borderRadius: 3 }} />
              </View>
            </View>
          </View>

          {/* Notes & resources */}
          <View style={{ padding: 16, gap: 10 }}>
            <TouchableOpacity style={{ backgroundColor: C.surface, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#E8591A15', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Edit" size={16} color="#E8591A" />
              </View>
              <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: C.ink }}>Prendre des notes</Text>
              <Icon name="ChevronRight" size={16} color="#8C8278" />
            </TouchableOpacity>

            <TouchableOpacity style={{ backgroundColor: C.surface, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#1A237E15', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="FileText" size={16} color="#1A237E" />
              </View>
              <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: C.ink }}>Ressources de la leçon</Text>
              <Icon name="ChevronRight" size={16} color="#8C8278" />
            </TouchableOpacity>
          </View>

          {/* Lesson list toggle */}
          <TouchableOpacity
            onPress={() => setShowList(s => !s)}
            style={{ marginHorizontal: 16, backgroundColor: C.surface, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}
          >
            <Icon name="List" size={18} color="#2C1810" />
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: C.ink }}>Toutes les leçons</Text>
            <Text style={{ fontSize: 12, color: C.inkMute }}>{totalCompleted}/{lessons.length}</Text>
            <Icon name={showList ? 'ChevronUp' : 'ChevronDown'} size={16} color="#8C8278" />
          </TouchableOpacity>

          {showList && (
            <View style={{ marginHorizontal: 16, marginTop: 8, backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
              {lessons.map((lesson, i) => (
                <TouchableOpacity
                  key={lesson.id}
                  onPress={() => { setCurrentLessonId(lesson.id); setProgress(0); setPlaying(false); }}
                  style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: i > 0 ? 1 : 0, borderColor: C.border, backgroundColor: lesson.id === currentLessonId ? '#FFF8F5' : '#fff', gap: 10 }}
                  activeOpacity={0.7}
                >
                  <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: lesson.completed ? '#E3F0E4' : (lesson.id === currentLessonId ? '#E8591A15' : '#F5F0EB'), alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={lesson.completed ? 'Check' : (lesson.id === currentLessonId ? 'Play' : 'Lock')} size={12} color={lesson.completed ? '#2E7D32' : (lesson.id === currentLessonId ? '#E8591A' : '#8C8278')} fill={lesson.id === currentLessonId ? '#E8591A' : 'none'} />
                  </View>
                  <Text style={{ flex: 1, fontSize: 13, color: lesson.id === currentLessonId ? '#E8591A' : '#2C1810', fontWeight: lesson.id === currentLessonId ? '700' : '400' }} numberOfLines={2}>
                    {lesson.title}
                  </Text>
                  <Text style={{ fontSize: 11, color: C.inkMute }}>{lesson.duration}</Text>
                </TouchableOpacity>
              ))}
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
            <Text style={{ fontSize: 14, fontWeight: '600', color: currentIndex === 0 ? '#E5E0D8' : '#2C1810' }}>Précédente</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={goNext}
            style={{ flex: 1, height: 46, borderRadius: 14, backgroundColor: currentIndex === lessons.length - 1 ? '#E5E0D8' : '#E8591A', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 6 }}
            disabled={currentIndex === lessons.length - 1}
          >
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>Suivante</Text>
            <Icon name="SkipForward" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
