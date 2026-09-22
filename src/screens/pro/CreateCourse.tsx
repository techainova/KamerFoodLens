// Compte Pro — création d'une formation (gratuite ou payante), en 3 étapes :
// contenu, tarif, publication — publie réellement via POST /courses.
import React, { useState } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { Alert } from '@/utils/alert';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { coursesService, type CreateLessonPayload } from '@/services/courses.service';
import type { CourseLevel } from '@/services/courses.service';

const STEPS = ['Contenu', 'Tarif', 'Publication'];
const LEVELS: { key: CourseLevel; label: string }[] = [
  { key: 'beginner', label: 'Débutant' },
  { key: 'intermediate', label: 'Intermédiaire' },
  { key: 'advanced', label: 'Expert' },
];

export default function CreateCourse() {
  const navigation = useNavigation<any>();
  const C = useColors();

  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<CourseLevel>('beginner');
  const [lessons, setLessons] = useState<{ title: string; videoUrl: string }[]>([{ title: '', videoUrl: '' }]);
  const [isPaid, setIsPaid] = useState(false);
  const [priceXAF, setPriceXAF] = useState('');
  const [isCertified, setIsCertified] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState('');

  const validLessons = lessons.filter((l) => l.title.trim().length > 0);

  const stepValid = () => {
    if (step === 0) return title.trim().length > 0 && validLessons.length > 0;
    if (step === 1) return !isPaid || Number(priceXAF) > 0;
    return true;
  };

  const updateLesson = (i: number, field: 'title' | 'videoUrl', value: string) => {
    setLessons((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)));
  };

  const removeLesson = (i: number) => setLessons((prev) => prev.filter((_, idx) => idx !== i));

  const handlePublish = async () => {
    setPublishing(true);
    setError('');
    try {
      const payloadLessons: CreateLessonPayload[] = validLessons.map((l, i) => ({
        title: l.title.trim(),
        videoUrl: l.videoUrl.trim() || undefined,
        order: i,
      }));
      await coursesService.create({
        title: title.trim(),
        description: description.trim() || undefined,
        level,
        priceXAF: isPaid ? Number(priceXAF) : 0,
        isCertified,
        lessons: payloadLessons,
      });
      Alert.alert('Formation publiée', 'Elle sera vérifiée sous 48h par l\'équipe KFL avant mise en ligne.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch {
      setError('Impossible de publier la formation. Réessayez.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => (step === 0 ? navigation.goBack() : setStep(step - 1))} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 17, fontWeight: '700', color: C.ink }}>Nouvelle formation</Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 5, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: C.surface, borderBottomWidth: 0.5, borderColor: C.border }}>
        {STEPS.map((s, i) => (
          <View key={s} style={{ flex: 1 }}>
            <View style={{ height: 3, borderRadius: 2, backgroundColor: i <= step ? C.primary : C.divider }} />
            <Text style={{ fontSize: 10.5, fontWeight: i === step ? '700' : '600', color: i === step ? C.primary : C.inkMute, marginTop: 5 }}>{s}</Text>
          </View>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        {step === 0 && (
          <>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              <View style={{ flex: 1, padding: 13, borderRadius: 14, borderWidth: 1.6, borderColor: C.primary, backgroundColor: C.primarySoft }}>
                <Icon name="Video" size={21} color={C.primary} />
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.primary, marginTop: 6 }}>Vidéos</Text>
                <Text style={{ fontSize: 10.5, color: C.inkMute, marginTop: 2 }}>Série publiée sur votre page</Text>
              </View>
              <View style={{ flex: 1, padding: 13, borderRadius: 14, borderWidth: 1, borderColor: C.border, opacity: 0.5 }}>
                <Icon name="Radio" size={21} color={C.inkSoft} />
                <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, marginTop: 6 }}>En direct</Text>
                <Text style={{ fontSize: 10.5, color: C.inkMute, marginTop: 2 }}>Bientôt disponible</Text>
              </View>
            </View>

            <Text style={{ fontSize: 11.5, fontWeight: '700', color: C.inkSoft, marginBottom: 6 }}>TITRE</Text>
            <View style={{ height: 46, borderWidth: 1, borderColor: C.border, borderRadius: 12, backgroundColor: C.surface, paddingHorizontal: 13, justifyContent: 'center', marginBottom: 14 }}>
              <TextInput value={title} onChangeText={setTitle} placeholder="Maîtriser les sauces camerounaises" placeholderTextColor={C.inkMute} style={{ fontSize: 14, color: C.ink }} />
            </View>

            <Text style={{ fontSize: 11.5, fontWeight: '700', color: C.inkSoft, marginBottom: 6 }}>DESCRIPTION</Text>
            <View style={{ minHeight: 70, borderWidth: 1, borderColor: C.border, borderRadius: 12, backgroundColor: C.surface, padding: 12, marginBottom: 14 }}>
              <TextInput value={description} onChangeText={setDescription} multiline placeholder="Ce que les inscrits vont apprendre…" placeholderTextColor={C.inkMute} style={{ fontSize: 13.5, color: C.ink, lineHeight: 20 }} />
            </View>

            <Text style={{ fontSize: 11.5, fontWeight: '700', color: C.inkSoft, marginBottom: 8 }}>NIVEAU</Text>
            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 18 }}>
              {LEVELS.map((l) => (
                <TouchableOpacity key={l.key} onPress={() => setLevel(l.key)} style={{ height: 32, paddingHorizontal: 13, borderRadius: 16, justifyContent: 'center', backgroundColor: level === l.key ? C.ink : C.surface, borderWidth: level === l.key ? 0 : 1, borderColor: C.border }}>
                  <Text style={{ fontSize: 12.5, fontWeight: '600', color: level === l.key ? C.cream : C.inkSoft }}>{l.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontSize: 11.5, fontWeight: '700', color: C.inkSoft }}>LEÇONS ({validLessons.length})</Text>
              <TouchableOpacity onPress={() => setLessons([...lessons, { title: '', videoUrl: '' }])} style={{ height: 28, paddingHorizontal: 12, backgroundColor: C.primary, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="Plus" size={12} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Ajouter</Text>
              </TouchableOpacity>
            </View>
            <View style={{ borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
              {lessons.map((lesson, i) => (
                <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 13, paddingVertical: 11, borderBottomWidth: i < lessons.length - 1 ? 1 : 0, borderColor: C.surface2 }}>
                  <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: C.inkSoft, fontSize: 11, fontWeight: '700' }}>{i + 1}</Text>
                  </View>
                  <TextInput
                    value={lesson.title}
                    onChangeText={(v) => updateLesson(i, 'title', v)}
                    placeholder={`Titre de la leçon ${i + 1}`}
                    placeholderTextColor={C.inkMute}
                    style={{ flex: 1, fontSize: 13.5, color: C.ink }}
                  />
                  {lessons.length > 1 && (
                    <TouchableOpacity onPress={() => removeLesson(i)}>
                      <Icon name="X" size={15} color={C.inkMute} />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
            </View>
          </>
        )}

        {step === 1 && (
          <>
            <Text style={{ fontSize: 13, fontWeight: '700', color: C.inkSoft, marginBottom: 12 }}>Tarification</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
              {[{ label: 'Gratuite', v: false }, { label: 'Payante', v: true }].map((m) => (
                <TouchableOpacity key={m.label} onPress={() => setIsPaid(m.v)} style={{ flex: 1, height: 44, borderRadius: 13, alignItems: 'center', justifyContent: 'center', backgroundColor: isPaid === m.v ? C.primarySoft : C.surface, borderWidth: isPaid === m.v ? 1.6 : 1, borderColor: isPaid === m.v ? C.primary : C.border }}>
                  <Text style={{ fontSize: 13.5, fontWeight: '700', color: isPaid === m.v ? C.primary : C.ink }}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {isPaid && (
              <View style={{ height: 46, borderWidth: 1, borderColor: C.border, borderRadius: 12, backgroundColor: C.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13, marginBottom: 14 }}>
                <TextInput value={priceXAF} onChangeText={setPriceXAF} keyboardType="numeric" placeholder="15000" placeholderTextColor={C.inkMute} style={{ flex: 1, fontSize: 14, color: C.ink }} />
                <Text style={{ fontSize: 12.5, fontWeight: '700', color: C.inkMute }}>XAF</Text>
              </View>
            )}
            <TouchableOpacity onPress={() => setIsCertified(!isCertified)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13, borderRadius: 12, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13.5, fontWeight: '600', color: C.ink }}>Certificat inclus</Text>
                <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 1 }}>Délivré à 100% de complétion</Text>
              </View>
              <View style={{ width: 42, height: 25, borderRadius: 13, backgroundColor: isCertified ? C.success : C.borderStrong, justifyContent: 'center' }}>
                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff', marginLeft: isCertified ? 19.5 : 2.5 }} />
              </View>
            </TouchableOpacity>
            <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 14, lineHeight: 16, fontStyle: 'italic' }}>
              ⓘ Votre formation sera vérifiée par l'équipe KFL sous 48h avant publication. Commission plateforme : 10%.
            </Text>
          </>
        )}

        {step === 2 && (
          <View style={{ borderRadius: 16, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, padding: 16 }}>
            <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{title || 'Titre de la formation'}</Text>
            <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 4 }}>{LEVELS.find((l) => l.key === level)?.label} · {validLessons.length} leçons</Text>
            <Text style={{ fontSize: 13, color: C.inkSoft, marginTop: 10, lineHeight: 19 }}>{description || 'Aucune description.'}</Text>
            <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderColor: C.border, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink }}>{isPaid ? `${Number(priceXAF || 0).toLocaleString()} XAF` : 'Gratuite'}</Text>
              {isCertified && <Text style={{ fontSize: 12, color: C.success, fontWeight: '600' }}>Certificat inclus</Text>}
            </View>
          </View>
        )}

        {!!error && <Text style={{ fontSize: 13, color: C.error, marginTop: 12 }}>{error}</Text>}
      </ScrollView>

      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ flex: 1, height: 46, borderWidth: 1, borderColor: C.border, borderRadius: 23, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, color: C.inkSoft }}>Annuler</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => (step < 2 ? stepValid() && setStep(step + 1) : void handlePublish())}
          disabled={!stepValid() || publishing}
          style={{ flex: 1.7, height: 46, borderRadius: 23, backgroundColor: stepValid() ? C.primary : C.border, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
        >
          {publishing && <ActivityIndicator color="#fff" size="small" />}
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>{step < 2 ? 'Suivant' : 'Soumettre'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
