// Compte Pro — création d'une formation (gratuite ou payante), en 3 étapes :
// contenu, tarif, publication — publie réellement via POST /courses.
import React, { useState } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Image } from 'react-native';
import { Alert } from '@/utils/alert';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { coursesService, type CreateLessonPayload, type LessonType } from '@/services/courses.service';
import type { CourseLevel } from '@/services/courses.service';
import { readUriAsBase64 } from '@/utils/readUriAsBase64';

const STEPS = ['Contenu', 'Tarif', 'Publication'];
const LEVELS: { key: CourseLevel; label: string }[] = [
  { key: 'beginner', label: 'Débutant' },
  { key: 'intermediate', label: 'Intermédiaire' },
  { key: 'advanced', label: 'Expert' },
];
const LESSON_TYPES: { key: LessonType; label: string; icon: Parameters<typeof Icon>[0]['name'] }[] = [
  { key: 'video', label: 'Vidéo', icon: 'Video' },
  { key: 'document', label: 'Document', icon: 'FileText' },
  { key: 'text', label: 'Texte', icon: 'Type' },
];

interface LessonDraft {
  title: string;
  type: LessonType;
  videoUrl: string;
  documentUrl: string;
  documentName: string;
  textContent: string;
  textImageUrl: string;
  durationMin: string;
  uploading: boolean;
}

function emptyLesson(): LessonDraft {
  return {
    title: '', type: 'video', videoUrl: '', documentUrl: '', documentName: '',
    textContent: '', textImageUrl: '', durationMin: '', uploading: false,
  };
}

export default function CreateCourse() {
  const navigation = useNavigation<any>();
  const C = useColors();

  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [level, setLevel] = useState<CourseLevel>('beginner');
  const [lessons, setLessons] = useState<LessonDraft[]>([emptyLesson()]);
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

  const patchLesson = (i: number, patch: Partial<LessonDraft>) => {
    setLessons((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));
  };

  const removeLesson = (i: number) => setLessons((prev) => prev.filter((_, idx) => idx !== i));

  const pickLessonVideo = async (i: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['videos'], quality: 0.7, base64: true });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    patchLesson(i, { uploading: true });
    try {
      const base64 = asset.base64 ?? (await readUriAsBase64(asset.uri));
      const { url } = await coursesService.uploadMedia(base64, asset.mimeType ?? 'video/mp4');
      patchLesson(i, { videoUrl: url, uploading: false });
    } catch {
      patchLesson(i, { uploading: false });
      Alert.alert('Erreur', "L'envoi de la vidéo a échoué. Réessayez plus tard.");
    }
  };

  const pickLessonDocument = async (i: number) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      copyToCacheDirectory: true,
    });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    patchLesson(i, { uploading: true });
    try {
      const base64 = await readUriAsBase64(asset.uri);
      const { url } = await coursesService.uploadMedia(base64, asset.mimeType ?? 'application/pdf');
      patchLesson(i, { documentUrl: url, documentName: asset.name, uploading: false });
    } catch {
      patchLesson(i, { uploading: false });
      Alert.alert('Erreur', "L'envoi du document a échoué. Réessayez plus tard.");
    }
  };

  const pickLessonTextImage = async (i: number) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission requise', "Autorisez l'accès pour ajouter une image.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.7, base64: true, allowsEditing: true });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    patchLesson(i, { uploading: true });
    try {
      const base64 = asset.base64 ?? (await readUriAsBase64(asset.uri));
      const { url } = await coursesService.uploadMedia(base64, asset.mimeType ?? 'image/jpeg');
      patchLesson(i, { textImageUrl: url, uploading: false });
    } catch {
      patchLesson(i, { uploading: false });
      Alert.alert('Erreur', "L'envoi de l'image a échoué. Réessayez plus tard.");
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    setError('');
    try {
      const payloadLessons: CreateLessonPayload[] = validLessons.map((l, i) => ({
        title: l.title.trim(),
        type: l.type,
        videoUrl: l.type === 'video' ? (l.videoUrl.trim() || undefined) : undefined,
        documentUrl: l.type === 'document' ? (l.documentUrl.trim() || undefined) : undefined,
        textContent: l.type === 'text' ? (l.textContent.trim() || undefined) : undefined,
        textImageUrl: l.type === 'text' ? (l.textImageUrl.trim() || undefined) : undefined,
        duration: l.durationMin ? Math.round(Number(l.durationMin) * 60) : undefined,
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
      Alert.alert('Formation publiée', 'Elle est en ligne et visible immédiatement par tous les utilisateurs.', [
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
              <TouchableOpacity onPress={() => setLessons([...lessons, emptyLesson()])} style={{ height: 28, paddingHorizontal: 12, backgroundColor: C.primary, borderRadius: 14, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                <Icon name="Plus" size={12} color="#fff" />
                <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Ajouter</Text>
              </TouchableOpacity>
            </View>

            <View style={{ gap: 10 }}>
              {lessons.map((lesson, i) => (
                <View key={i} style={{ borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, padding: 12, ...SHADOW_SM }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <View style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: C.inkSoft, fontSize: 11, fontWeight: '700' }}>{i + 1}</Text>
                    </View>
                    <TextInput
                      value={lesson.title}
                      onChangeText={(v) => patchLesson(i, { title: v })}
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

                  {/* Type de contenu */}
                  <View style={{ flexDirection: 'row', gap: 6, marginBottom: 10 }}>
                    {LESSON_TYPES.map((lt) => (
                      <TouchableOpacity
                        key={lt.key}
                        onPress={() => patchLesson(i, { type: lt.key })}
                        style={{ flex: 1, height: 34, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 5, backgroundColor: lesson.type === lt.key ? C.primarySoft : C.surface2, borderWidth: 1, borderColor: lesson.type === lt.key ? C.primary : C.border }}
                      >
                        <Icon name={lt.icon} size={13} color={lesson.type === lt.key ? C.primary : C.inkMute} />
                        <Text style={{ fontSize: 12, fontWeight: '600', color: lesson.type === lt.key ? C.primary : C.inkSoft }}>{lt.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Contenu selon le type */}
                  {lesson.type === 'video' && (
                    <View style={{ marginBottom: 10 }}>
                      <TouchableOpacity
                        onPress={() => void pickLessonVideo(i)}
                        disabled={lesson.uploading}
                        style={{ height: 40, borderRadius: 10, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 8 }}
                      >
                        {lesson.uploading ? <ActivityIndicator size="small" color={C.primary} /> : <Icon name="Video" size={14} color={C.inkSoft} />}
                        <Text style={{ fontSize: 12.5, fontWeight: '600', color: C.inkSoft }}>{lesson.videoUrl ? 'Remplacer la vidéo' : 'Choisir une vidéo'}</Text>
                      </TouchableOpacity>
                      {!!lesson.videoUrl && (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          <Icon name="CheckCircle" size={13} color={C.success} />
                          <Text style={{ fontSize: 11.5, color: C.success }} numberOfLines={1}>Vidéo ajoutée</Text>
                        </View>
                      )}
                      <Text style={{ fontSize: 10.5, color: C.inkMute, marginTop: 6, marginBottom: 4 }}>Ou collez un lien (YouTube, Vimeo…)</Text>
                      <View style={{ height: 38, borderWidth: 1, borderColor: C.border, borderRadius: 10, backgroundColor: C.surface2, paddingHorizontal: 11, justifyContent: 'center' }}>
                        <TextInput
                          value={lesson.videoUrl}
                          onChangeText={(v) => patchLesson(i, { videoUrl: v })}
                          placeholder="https://…"
                          placeholderTextColor={C.inkMute}
                          style={{ fontSize: 12.5, color: C.ink }}
                        />
                      </View>
                    </View>
                  )}

                  {lesson.type === 'document' && (
                    <View style={{ marginBottom: 10 }}>
                      <TouchableOpacity
                        onPress={() => void pickLessonDocument(i)}
                        disabled={lesson.uploading}
                        style={{ height: 40, borderRadius: 10, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                      >
                        {lesson.uploading ? <ActivityIndicator size="small" color={C.primary} /> : <Icon name="FileText" size={14} color={C.inkSoft} />}
                        <Text style={{ fontSize: 12.5, fontWeight: '600', color: C.inkSoft }} numberOfLines={1}>
                          {lesson.documentName || 'Choisir un document (PDF, Word)'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {lesson.type === 'text' && (
                    <View style={{ marginBottom: 10 }}>
                      <View style={{ minHeight: 70, borderWidth: 1, borderColor: C.border, borderRadius: 10, backgroundColor: C.surface2, padding: 10, marginBottom: 8 }}>
                        <TextInput
                          value={lesson.textContent}
                          onChangeText={(v) => patchLesson(i, { textContent: v })}
                          multiline
                          placeholder="Contenu écrit de la leçon…"
                          placeholderTextColor={C.inkMute}
                          style={{ fontSize: 12.5, color: C.ink, lineHeight: 18 }}
                        />
                      </View>
                      {lesson.textImageUrl ? (
                        <View style={{ marginBottom: 8 }}>
                          <Image source={{ uri: lesson.textImageUrl }} style={{ width: '100%', height: 100, borderRadius: 10 }} resizeMode="cover" />
                          <TouchableOpacity onPress={() => patchLesson(i, { textImageUrl: '' })} style={{ position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(0,0,0,0.55)', alignItems: 'center', justifyContent: 'center' }}>
                            <Icon name="X" size={12} color="#fff" />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          onPress={() => void pickLessonTextImage(i)}
                          disabled={lesson.uploading}
                          style={{ height: 36, borderRadius: 10, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                        >
                          {lesson.uploading ? <ActivityIndicator size="small" color={C.primary} /> : <Icon name="Image" size={13} color={C.inkSoft} />}
                          <Text style={{ fontSize: 12, fontWeight: '600', color: C.inkSoft }}>Ajouter une image (optionnel)</Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  )}

                  {/* Durée — pour tous les types */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <Icon name="Clock" size={13} color={C.inkMute} />
                    <View style={{ height: 34, width: 80, borderWidth: 1, borderColor: C.border, borderRadius: 9, backgroundColor: C.surface2, paddingHorizontal: 10, justifyContent: 'center' }}>
                      <TextInput
                        value={lesson.durationMin}
                        onChangeText={(v) => patchLesson(i, { durationMin: v })}
                        keyboardType="numeric"
                        placeholder="10"
                        placeholderTextColor={C.inkMute}
                        style={{ fontSize: 12.5, color: C.ink }}
                      />
                    </View>
                    <Text style={{ fontSize: 11.5, color: C.inkMute }}>minutes</Text>
                  </View>
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
              ⓘ Votre formation sera publiée immédiatement et visible par tous les utilisateurs. Commission plateforme : 10%.
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
