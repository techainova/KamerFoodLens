import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

export default function CreateCourse() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [step] = useState(1);
  const [courseTitle, setCourseTitle] = useState('Maîtrisez le Ndolé');
  const [level, setLevel] = useState(1);
  const [lessons, setLessons] = useState(['Introduction', 'Les ingrédients', 'La préparation']);
  const [error, setError] = useState('');

  const STEPS = [t('createCourse.stepInfo'), t('createCourse.stepContent'), t('createCourse.stepPrice'), t('createCourse.stepPreview')];
  const LEVELS = [t('createCourse.levelBeginner'), t('createCourse.levelIntermediate'), t('createCourse.levelAdvanced')];

  const handleSubmit = () => {
    if (!courseTitle.trim()) {
      setError(t('createCourse.errorTitleRequired'));
      return;
    }
    if (lessons.length === 0) {
      setError(t('createCourse.errorLessonRequired'));
      return;
    }
    setError('');
    Alert.alert(t('createCourse.successTitle'), t('createCourse.successMessage'), [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('createCourse.title')}</Text>
      </View>

      {/* Stepper */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        {STEPS.map((s, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={{ width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: i === step ? C.gold : i < step ? C.success : C.border }}>
              {i < step
                ? <Icon name="Check" size={14} color="#fff" />
                : <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{i + 1}</Text>
              }
            </View>
            {i < STEPS.length - 1 && <View style={{ flex: 1, height: 2, marginHorizontal: 4, backgroundColor: i < step ? C.success : C.border }} />}
          </View>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 16 }}>{t('createCourse.sectionTitle')}</Text>

        {/* Title */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>{t('createCourse.fieldTitle')}</Text>
          <View style={{ height: 48, borderWidth: 1, borderColor: C.border, borderRadius: 16, backgroundColor: C.surface, paddingHorizontal: 14, justifyContent: 'center' }}>
            <TextInput value={courseTitle} onChangeText={setCourseTitle} style={{ fontSize: 14, color: C.ink }} />
          </View>
        </View>

        {/* Level */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>{t('createCourse.fieldLevel')}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {LEVELS.map((l, i) => (
              <TouchableOpacity key={i} onPress={() => setLevel(i)}
                style={{ flex: 1, height: 40, borderRadius: 12, borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: level === i ? C.goldSoft : C.surface, borderColor: level === i ? C.gold : C.border }}>
                <Text style={{ fontSize: 12, fontWeight: '500', color: level === i ? C.gold : C.inkSoft }}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Lessons */}
        <View style={{ marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.8 }}>{t('createCourse.lessonsCount', { count: lessons.length })}</Text>
            <TouchableOpacity
              onPress={() => setLessons([...lessons, t('createCourse.newLessonName', { number: lessons.length + 1 })])}
              style={{ height: 28, paddingHorizontal: 12, backgroundColor: C.gold, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4 }}>
              <Icon name="Plus" size={12} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{t('createCourse.addLesson')}</Text>
            </TouchableOpacity>
          </View>
          <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
            {lessons.map((lesson, i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: i < lessons.length - 1 ? 1 : 0, borderColor: C.surface2 }}>
                <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: C.inkSoft, fontSize: 11, fontWeight: '700' }}>{i + 1}</Text>
                </View>
                <Text style={{ flex: 1, fontSize: 14, color: C.ink }}>{lesson}</Text>
                <Icon name="Menu" size={16} color={C.inkMute} />
              </View>
            ))}
          </View>
        </View>

        {!!error && (
          <Text style={{ fontSize: 13, color: C.error, marginBottom: 8 }}>{error}</Text>
        )}
      </ScrollView>

      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        <TouchableOpacity style={{ flex: 1, height: 44, borderWidth: 1, borderColor: C.border, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, color: C.inkSoft }}>{t('createCourse.back')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit}
          style={{ flex: 2, height: 44, backgroundColor: C.gold, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}
          activeOpacity={0.85}
        >
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{t('createCourse.next')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
