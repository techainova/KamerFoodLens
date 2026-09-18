import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { coursesService, type Course } from '@/services/courses.service';

export default function ProFormationsList() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    coursesService.getManaged()
      .then((c) => { if (!cancelled) setCourses(c); })
      .catch(() => { if (!cancelled) setCourses([]); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

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

      {loading ? (
        <ActivityIndicator color={C.primary} style={{ marginTop: 30 }} />
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 12 }} showsVerticalScrollIndicator={false}>
          {courses.length === 0 ? (
            <Text style={{ fontSize: 13, color: C.inkMute, textAlign: 'center', marginTop: 24 }}>{t('proFormationsList.noCourses')}</Text>
          ) : (
            courses.map((course) => (
              <TouchableOpacity
                key={course.id}
                onPress={() => navigation.navigate('ProFormationManage', { courseId: course.id })}
                style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}
                activeOpacity={0.85}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: C.ink, marginRight: 8 }}>{course.title}</Text>
                  <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: C.successSoft }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: C.success }}>{t('proFormationsList.active')}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon name="Users" size={12} color={C.inkMute} />
                    <Text style={{ fontSize: 12, color: C.inkMute }}>{course.studentsCount} {t('proFormationsList.students')}</Text>
                  </View>
                  {course.priceXAF > 0 && (
                    <Text style={{ fontSize: 12, fontWeight: '600', color: C.gold }}>{(course.studentsCount * course.priceXAF).toLocaleString()} XAF</Text>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
