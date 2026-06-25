import React from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const COURSES = [
  { title: 'Maîtrisez le Ndolé',      students: 124, rating: 4.9, revenue: 372000, status: 'active' },
  { title: 'Cuisine du Littoral',      students: 58,  rating: 4.7, revenue: 116000, status: 'active' },
  { title: 'Épices camerounaises',     students: 12,  rating: 0,   revenue: 0,      status: 'draft'  },
];

export default function ProFormationsList() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('proFormationsList.title')}</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('CreateCourse')}
          style={{ height: 32, paddingHorizontal: 12, backgroundColor: C.gold, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4 }}
        >
          <Icon name="Plus" size={12} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{t('proFormationsList.create')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 12 }} showsVerticalScrollIndicator={false}>
        {COURSES.length === 0 ? (
          <Text style={{ fontSize: 13, color: C.inkMute, textAlign: 'center', marginTop: 24 }}>{t('proFormationsList.noCourses')}</Text>
        ) : (
          COURSES.map((course, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => navigation.navigate('ProFormationManage', { courseId: String(i) })}
              style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}
              activeOpacity={0.85}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: C.ink, marginRight: 8 }}>{course.title}</Text>
                <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: course.status === 'active' ? C.successSoft : C.surface2 }}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: course.status === 'active' ? C.success : C.inkMute }}>
                    {course.status === 'active' ? t('proFormationsList.active') : t('proFormationsList.draft')}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 16 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="Users" size={12} color={C.inkMute} />
                  <Text style={{ fontSize: 12, color: C.inkMute }}>{course.students} {t('proFormationsList.students')}</Text>
                </View>
                {course.rating > 0 && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon name="Star" size={12} color={C.gold} fill="#F9A825" />
                    <Text style={{ fontSize: 12, color: C.inkMute }}>{course.rating}</Text>
                  </View>
                )}
                {course.revenue > 0 && (
                  <Text style={{ fontSize: 12, fontWeight: '600', color: C.gold }}>{course.revenue.toLocaleString()} XAF</Text>
                )}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
