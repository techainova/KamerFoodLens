import React, { useEffect, useState } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { Alert } from '@/utils/alert';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { coursesService, type CourseDetail } from '@/services/courses.service';

export default function ProFormationManage() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const C = useColors();
  const { t } = useTranslation();
  const courseId: string | undefined = route.params?.courseId;

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [courseTitle, setCourseTitle] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!courseId) { setLoading(false); return; }
    let cancelled = false;
    coursesService.getDetail(courseId)
      .then((c) => { if (!cancelled) { setCourse(c); setCourseTitle(c.title); } })
      .catch(() => { if (!cancelled) setCourse(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [courseId]);

  const handleSave = async () => {
    if (!courseId || !courseTitle.trim()) return;
    setSaving(true);
    try {
      await coursesService.update(courseId, { title: courseTitle.trim() });
      setCourse((c) => (c ? { ...c, title: courseTitle.trim() } : c));
      Alert.alert(t('proFormationManage.savedSuccess'));
    } catch {
      Alert.alert(t('common.error', 'Erreur'), t('proFormationManage.saveError', 'Impossible de sauvegarder.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={C.primary} />
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 15, color: C.inkSoft, textAlign: 'center' }}>{t('restaurant.notFound', 'Introuvable.')}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          <Text style={{ color: C.primary, fontWeight: '600' }}>{t('common.goBack', 'Retour')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('proFormationManage.title')}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Course hero — vraies données */}
        <View style={{ padding: 16, borderRadius: 20, backgroundColor: C.navy, marginBottom: 16 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'PlayfairDisplay-Bold' }}>{course.title}</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            {[
              { v: String(course.studentsCount), l: t('proFormationManage.students') },
              { v: String(course.lessonsCount), l: t('createCourse.lessons', 'Leçons') },
              { v: course.priceXAF > 0 ? `${(course.studentsCount * course.priceXAF).toLocaleString()}` : '0', l: t('proFormationManage.revenueXaf') },
            ].map((s, i) => (
              <View key={i} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 10, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>{s.v}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>{s.l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Editable title */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>{t('proFormationManage.fieldTitle')}</Text>
          <View style={{ height: 48, borderWidth: 1, borderColor: C.border, borderRadius: 16, backgroundColor: C.surface, paddingHorizontal: 14, justifyContent: 'center' }}>
            <TextInput value={courseTitle} onChangeText={setCourseTitle} style={{ fontSize: 14, color: C.ink }} />
          </View>
        </View>

        {/* Étudiants inscrits — pas de suivi de progression individuelle exposé
            par le backend pour l'instant, on affiche donc le total réel plutôt
            qu'une liste nominative inventée. */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>
          {t('proFormationManage.enrolledStudents', { count: course.studentsCount })}
        </Text>
        <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, padding: 16, marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Icon name="Users" size={20} color={C.inkMute} />
          <Text style={{ fontSize: 13, color: C.inkSoft }}>
            {course.studentsCount > 0
              ? `${course.studentsCount} étudiant(s) inscrit(s) à ce jour.`
              : t('proFormationManage.noStudentsYet', 'Aucun étudiant inscrit pour le moment.')}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => void handleSave()}
          disabled={saving || !courseTitle.trim()}
          style={{ height: 48, backgroundColor: C.gold, borderRadius: 24, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
          activeOpacity={0.85}
        >
          {saving && <ActivityIndicator size="small" color="#fff" />}
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>{t('proFormationManage.save')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
