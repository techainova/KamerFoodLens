import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const DEFAULT_COURSE = {
  id: '3',
  title: 'Maîtriser le Mbongo Tchobi',
  instructor: 'Chef Paul Biya N.',
  instructorInitials: 'PB',
  instructorColor: '#E8591A',
  instructorBio: 'Chef certifié · 15 ans d\'expérience · Spécialiste cuisine du Littoral',
  level: 'Expert',
  levelColor: '#C62828',
  lessons: 12,
  duration: '5h30',
  rating: 4.9,
  students: 1240,
  price: 25000,
  description: 'Maîtrisez l\'art du Mbongo Tchobi — le plat signature du Littoral camerounais. De la sélection des épices à la cuisson lente, apprenez chaque étape avec un chef certifié.',
  tags: ['Sauce noire', 'Littoral', 'Poisson'],
  curriculum: [
    { section: 'Introduction', lessons: [
      { id: 'l1', title: 'Présentation du cours et du chef', duration: '12min', free: true },
      { id: 'l2', title: 'Histoire et origine du Mbongo Tchobi', duration: '18min', free: true },
    ]},
    { section: 'Les Épices & Ingrédients', lessons: [
      { id: 'l3', title: 'Identifier le njansang et l\'écorce HK', duration: '25min', free: false },
      { id: 'l4', title: 'Torréfaction et broyage des épices', duration: '30min', free: false },
      { id: 'l5', title: 'Choix du poisson : capitaine vs carpe', duration: '20min', free: false },
    ]},
    { section: 'La Sauce Noire', lessons: [
      { id: 'l6', title: 'Préparation de la base — oignon et tomate', duration: '22min', free: false },
      { id: 'l7', title: 'Incorporation des épices — timing et ordre', duration: '28min', free: false },
      { id: 'l8', title: 'La coloration noire — secret et technique', duration: '35min', free: false },
    ]},
    { section: 'Cuisson & Finitions', lessons: [
      { id: 'l9', title: 'Cuisson longue — 2h30 à feu doux', duration: '40min', free: false },
      { id: 'l10', title: 'Ajustement des saveurs en fin de cuisson', duration: '18min', free: false },
      { id: 'l11', title: 'Dressage et présentation', duration: '22min', free: false },
      { id: 'l12', title: 'Variantes régionales et créatives', duration: '30min', free: false },
    ]},
  ],
};

export default function CourseDetail() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const route = useRoute<any>();
  const course = { ...DEFAULT_COURSE, ...(route.params?.course ?? {}) };

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['Introduction']));
  const [enrolled, setEnrolled] = useState(false);
  const [saved, setSaved] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle="light-content" />

      {/* Hero */}
      <View style={{ height: 200, backgroundColor: '#2C1810', justifyContent: 'flex-end', padding: 20 }}>
        <View style={{ position: 'absolute', top: 16, left: 0, right: 0, flexDirection: 'row', paddingHorizontal: 16 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="ArrowLeft" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => setSaved(s => !s)} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
            <Icon name="Bookmark" size={18} color={saved ? '#F9A825' : '#fff'} fill={saved ? '#F9A825' : 'none'} />
          </TouchableOpacity>
          <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Share2" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: course.levelColor }}>
            <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>{course.level}</Text>
          </View>
          {course.price === 0 && (
            <View style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: '#2E7D32' }}>
              <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>Gratuit</Text>
            </View>
          )}
        </View>
        <Text style={{ fontSize: 20, fontFamily: 'PlayfairDisplay-Bold', color: '#fff', lineHeight: 28 }}>{course.title}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

        {/* Stats row */}
        <View style={{ backgroundColor: C.surface, paddingHorizontal: 16, paddingVertical: 14, flexDirection: 'row', gap: 0, borderBottomWidth: 1, borderColor: C.border }}>
          {[
            { icon: 'Star' as const, value: String(course.rating), label: 'Note', color: '#F9A825', fill: '#F9A825' },
            { icon: 'Users' as const, value: String(course.students.toLocaleString()), label: 'Élèves', color: C.inkMute },
            { icon: 'Clock' as const, value: course.duration, label: 'Durée', color: C.inkMute },
            { icon: 'List' as const, value: String(course.lessons), label: 'Leçons', color: C.inkMute },
          ].map((stat, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center' }}>
              <Icon name={stat.icon} size={18} color={stat.color} fill={stat.fill} />
              <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, marginTop: 3 }}>{stat.value}</Text>
              <Text style={{ fontSize: 10, color: C.inkMute }}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Instructor */}
        <View style={{ marginHorizontal: 16, marginTop: 16, backgroundColor: C.surface, borderRadius: 16, padding: 14, flexDirection: 'row', gap: 12, alignItems: 'center', borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: course.instructorColor + '20', borderWidth: 1.5, borderColor: course.instructorColor + '40', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: course.instructorColor }}>{course.instructorInitials[0]}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink }}>{course.instructor}</Text>
            <Text style={{ fontSize: 12, color: C.inkSoft }}>{course.instructorBio}</Text>
          </View>
        </View>

        {/* Description */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <Text style={{ fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 8 }}>Description</Text>
          <Text style={{ fontSize: 14, color: C.inkSoft, lineHeight: 22 }}>{course.description}</Text>
        </View>

        {/* Tags */}
        <View style={{ paddingHorizontal: 16, paddingTop: 12, flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {course.tags.map((tag: string) => (
            <View key={tag} style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border }}>
              <Text style={{ fontSize: 12, color: C.inkSoft, fontWeight: '500' }}>{tag}</Text>
            </View>
          ))}
        </View>

        {/* Curriculum */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <Text style={{ fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>Programme ({course.lessons} leçons)</Text>
          <View style={{ gap: 10 }}>
            {course.curriculum.map((section: { section: string; lessons: { id: string; title: string; duration: string; free: boolean }[] }) => (
              <View key={section.section} style={{ backgroundColor: C.surface, borderRadius: 14, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
                <TouchableOpacity
                  onPress={() => toggleSection(section.section)}
                  style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 12 }}
                  activeOpacity={0.8}
                >
                  <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: C.ink }}>{section.section}</Text>
                  <Text style={{ fontSize: 12, color: C.inkMute, marginRight: 8 }}>{section.lessons.length} leçons</Text>
                  <Icon name={expandedSections.has(section.section) ? 'ChevronUp' : 'ChevronDown'} size={16} color="#8C8278" />
                </TouchableOpacity>

                {expandedSections.has(section.section) && (
                  <View style={{ borderTopWidth: 1, borderColor: C.border }}>
                    {section.lessons.map((lesson: { id: string; title: string; duration: string; free: boolean }, i: number) => (
                      <TouchableOpacity
                        key={lesson.id}
                        onPress={() => navigation.navigate('CoursePlayer', { course, lessonId: lesson.id })}
                        style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 11, borderTopWidth: i > 0 ? 1 : 0, borderColor: C.border, gap: 10 }}
                        activeOpacity={0.7}
                      >
                        <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: lesson.free ? '#E3F0E4' : '#F5F0EB', alignItems: 'center', justifyContent: 'center' }}>
                          <Icon name={lesson.free ? 'Play' : 'Lock'} size={12} color={lesson.free ? '#2E7D32' : '#8C8278'} fill={lesson.free ? '#2E7D32' : 'none'} />
                        </View>
                        <Text style={{ flex: 1, fontSize: 13, color: lesson.free ? '#2C1810' : '#6D4C41' }}>{lesson.title}</Text>
                        {lesson.free && (
                          <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, backgroundColor: C.successSoft }}>
                            <Text style={{ fontSize: 9, fontWeight: '700', color: '#2E7D32' }}>GRATUIT</Text>
                          </View>
                        )}
                        <Text style={{ fontSize: 11, color: C.inkMute }}>{lesson.duration}</Text>
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
        {course.price > 0 && !enrolled && (
          <Text style={{ fontSize: 20, fontWeight: '700', color: C.ink, textAlign: 'center', marginBottom: 10 }}>
            {course.price.toLocaleString()} XAF
          </Text>
        )}
        <TouchableOpacity
          onPress={() => {
            if (enrolled) navigation.navigate('CoursePlayer', { course });
            else setEnrolled(true);
          }}
          style={{ height: 52, borderRadius: 16, backgroundColor: enrolled ? '#E8591A' : '#2C1810', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
          activeOpacity={0.85}
        >
          <Icon name={enrolled ? 'Play' : 'Award'} size={18} color="#fff" fill={enrolled ? '#fff' : 'none'} />
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
            {enrolled ? 'Commencer la formation' : (course.price === 0 ? 'S\'inscrire gratuitement' : 'Acheter la formation')}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
