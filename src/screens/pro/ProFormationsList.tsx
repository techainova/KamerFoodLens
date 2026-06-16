import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const COURSES = [
  { title: 'Maîtrisez le Ndolé',      students: 124, rating: 4.9, revenue: 372000, status: 'active' },
  { title: 'Cuisine du Littoral',      students: 58,  rating: 4.7, revenue: 116000, status: 'active' },
  { title: 'Épices camerounaises',     students: 12,  rating: 0,   revenue: 0,      status: 'draft'  },
];

export default function ProFormationsList() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Mes formations</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateCourse')}
          style={{ height: 32, paddingHorizontal: 12, backgroundColor: '#F9A825', borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4 }}
        >
          <Icon name="Plus" size={12} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Créer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 12 }} showsVerticalScrollIndicator={false}>
        {COURSES.map((course, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => navigation.navigate('ProFormationManage', { courseId: String(i) })}
            style={{ padding: 16, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', ...SHADOW_SM }}
            activeOpacity={0.85}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
              <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: '#2C1810', marginRight: 8 }}>{course.title}</Text>
              <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: course.status === 'active' ? '#E3F0E4' : '#F5F0EB' }}>
                <Text style={{ fontSize: 11, fontWeight: '600', color: course.status === 'active' ? '#2E7D32' : '#8C8278' }}>
                  {course.status === 'active' ? 'Actif' : 'Brouillon'}
                </Text>
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="Users" size={12} color="#8C8278" />
                <Text style={{ fontSize: 12, color: '#8C8278' }}>{course.students} élèves</Text>
              </View>
              {course.rating > 0 && (
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="Star" size={12} color="#F9A825" fill="#F9A825" />
                  <Text style={{ fontSize: 12, color: '#8C8278' }}>{course.rating}</Text>
                </View>
              )}
              {course.revenue > 0 && (
                <Text style={{ fontSize: 12, fontWeight: '600', color: '#F9A825' }}>{course.revenue.toLocaleString()} XAF</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
