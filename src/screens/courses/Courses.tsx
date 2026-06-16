import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };
const SHADOW_MD = { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 6, elevation: 4 };

const CATEGORIES = ['Tous', 'Débutant', 'Intermédiaire', 'Expert', 'Pro'];

const IN_PROGRESS = [
  {
    id: '1',
    title: 'Maîtriser le Ndolé en 7 étapes',
    instructor: 'Chef Amina',
    instructorInitials: 'CA',
    instructorColor: '#E8591A',
    level: 'Intermédiaire',
    progress: 0.4,
    currentLesson: 3,
    totalLessons: 7,
    duration: '3h20',
  },
  {
    id: '2',
    title: 'Les sauces camerounaises',
    instructor: 'Chef Joël',
    instructorInitials: 'CJ',
    instructorColor: '#F9A825',
    level: 'Débutant',
    progress: 0.72,
    currentLesson: 5,
    totalLessons: 7,
    duration: '2h15',
  },
];

const ALL_COURSES = [
  {
    id: '3',
    title: 'Maîtriser le Mbongo Tchobi',
    instructor: 'Chef Paul Biya N.',
    instructorInitials: 'PB',
    instructorColor: '#E8591A',
    level: 'Expert',
    levelColor: '#C62828',
    lessons: 12,
    duration: '5h30',
    rating: 4.9,
    students: 1240,
    price: 25000,
    tags: ['Sauce noire', 'Littoral', 'Poisson'],
  },
  {
    id: '4',
    title: 'Introduction à la cuisine camerounaise',
    instructor: 'Chef Marie K.',
    instructorInitials: 'MK',
    instructorColor: '#2E7D32',
    level: 'Débutant',
    levelColor: '#2E7D32',
    lessons: 8,
    duration: '3h00',
    rating: 4.7,
    students: 3456,
    price: 0,
    tags: ['Bases', 'Épices', 'Techniques'],
  },
  {
    id: '5',
    title: 'Poulet DG — La recette parfaite',
    instructor: 'Chef Joël',
    instructorInitials: 'CJ',
    instructorColor: '#F9A825',
    level: 'Intermédiaire',
    levelColor: '#F9A825',
    lessons: 6,
    duration: '2h45',
    rating: 4.8,
    students: 892,
    price: 15000,
    tags: ['Plantain', 'Poulet', 'Grillé'],
  },
  {
    id: '6',
    title: 'Achu Soup & Taro — Techniques avancées',
    instructor: 'Chef Charlotte',
    instructorInitials: 'CC',
    instructorColor: '#1A237E',
    level: 'Expert',
    levelColor: '#C62828',
    lessons: 10,
    duration: '4h15',
    rating: 5.0,
    students: 421,
    price: 35000,
    tags: ['Achu', 'NW', 'Taro'],
  },
];

export default function Courses() {
  const navigation = useNavigation<any>();
  const [activeCategory, setActiveCategory] = useState('Tous');

  const filtered = ALL_COURSES.filter(c => {
    if (activeCategory === 'Tous') return true;
    return c.level === activeCategory;
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Formations</Text>
        <TouchableOpacity style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="Search" size={17} color="#6D4C41" />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* In progress */}
        {IN_PROGRESS.length > 0 && (
          <View style={{ paddingTop: 16 }}>
            <Text style={{ paddingHorizontal: 16, fontSize: 13, fontWeight: '600', color: '#6D4C41', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>En cours</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 14, paddingBottom: 4 }}>
              {IN_PROGRESS.map(course => (
                <TouchableOpacity
                  key={course.id}
                  onPress={() => navigation.navigate('CourseDetail', { course })}
                  activeOpacity={0.85}
                  style={{ width: 230, backgroundColor: '#fff', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E5E0D8', ...SHADOW_MD }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: course.instructorColor + '20', borderWidth: 1.5, borderColor: course.instructorColor + '40', alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontSize: 15, fontWeight: '700', color: course.instructorColor }}>{course.instructorInitials[0]}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 13, fontWeight: '700', color: '#2C1810' }} numberOfLines={2}>{course.title}</Text>
                      <Text style={{ fontSize: 11, color: '#8C8278', marginTop: 1 }}>{course.instructor}</Text>
                    </View>
                  </View>

                  {/* Progress */}
                  <View style={{ marginBottom: 8 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                      <Text style={{ fontSize: 11, color: '#6D4C41' }}>Leçon {course.currentLesson}/{course.totalLessons}</Text>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: '#E8591A' }}>{Math.round(course.progress * 100)}%</Text>
                    </View>
                    <View style={{ height: 5, backgroundColor: '#F5F0EB', borderRadius: 3, overflow: 'hidden' }}>
                      <View style={{ height: '100%', width: `${course.progress * 100}%`, backgroundColor: '#E8591A', borderRadius: 3 }} />
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => navigation.navigate('CoursePlayer', { course })}
                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 8, borderRadius: 10, backgroundColor: '#E8591A15', gap: 6, borderWidth: 1, borderColor: '#E8591A30' }}
                  >
                    <Icon name="Play" size={13} color="#E8591A" fill="#E8591A" />
                    <Text style={{ fontSize: 12, fontWeight: '700', color: '#E8591A' }}>Continuer</Text>
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
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: cat === activeCategory ? '#E8591A' : '#F5F0EB', borderWidth: 1, borderColor: cat === activeCategory ? '#E8591A' : '#E5E0D8' }}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: cat === activeCategory ? '#fff' : '#6D4C41' }}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* All courses */}
        <View style={{ paddingHorizontal: 16, gap: 14 }}>
          {filtered.map(course => (
            <TouchableOpacity
              key={course.id}
              onPress={() => navigation.navigate('CourseDetail', { course })}
              activeOpacity={0.85}
              style={{ backgroundColor: '#fff', borderRadius: 18, borderWidth: 1, borderColor: '#E5E0D8', overflow: 'hidden', ...SHADOW_SM }}
            >
              {/* Thumbnail */}
              <View style={{ height: 120, backgroundColor: '#F5F0EB', alignItems: 'center', justifyContent: 'center' }}>
                <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: course.instructorColor + '20', borderWidth: 2, borderColor: course.instructorColor + '40', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 20, fontWeight: '700', color: course.instructorColor }}>{course.instructorInitials[0]}</Text>
                </View>
                {/* Level badge */}
                <View style={{ position: 'absolute', top: 10, left: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: course.levelColor + '20', borderWidth: 1, borderColor: course.levelColor + '40' }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: course.levelColor }}>{course.level}</Text>
                </View>
                {/* Price badge */}
                <View style={{ position: 'absolute', top: 10, right: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: course.price === 0 ? '#E3F0E4' : '#2C1810' }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: course.price === 0 ? '#2E7D32' : '#fff' }}>
                    {course.price === 0 ? 'Gratuit' : `${course.price.toLocaleString()} XAF`}
                  </Text>
                </View>
              </View>

              <View style={{ padding: 14 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#2C1810', marginBottom: 4 }} numberOfLines={2}>{course.title}</Text>
                <Text style={{ fontSize: 12, color: '#8C8278', marginBottom: 10 }}>{course.instructor}</Text>

                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
                  {course.tags.map(tag => (
                    <View key={tag} style={{ paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: '#F5F0EB', borderWidth: 1, borderColor: '#E5E0D8' }}>
                      <Text style={{ fontSize: 10, color: '#6D4C41', fontWeight: '500' }}>{tag}</Text>
                    </View>
                  ))}
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon name="Star" size={13} color="#F9A825" fill="#F9A825" />
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#2C1810' }}>{course.rating}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon name="Users" size={13} color="#8C8278" />
                    <Text style={{ fontSize: 12, color: '#8C8278' }}>{course.students.toLocaleString()}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon name="Clock" size={13} color="#8C8278" />
                    <Text style={{ fontSize: 12, color: '#8C8278' }}>{course.duration}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon name="List" size={13} color="#8C8278" />
                    <Text style={{ fontSize: 12, color: '#8C8278' }}>{course.lessons} leçons</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
