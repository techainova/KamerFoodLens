import React, { useEffect, useState } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator } from 'react-native';
import { Alert } from '@/utils/alert';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useVideoPlayer, VideoView } from 'expo-video';
import * as ImagePicker from 'expo-image-picker';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { useVideosStore } from '@/store/videos.store';
import { useAuthStore } from '@/store/auth.store';
import { coursesService, type Course } from '@/services/courses.service';
import { eventsService, type KflEvent } from '@/services/events.service';
import { readUriAsBase64 } from '@/utils/readUriAsBase64';

export default function CreateVideo() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const isPro = useAuthStore((s) => s.user?.role === 'pro');
  const publish = useVideosStore((s) => s.publish);

  const [videoUri, setVideoUri] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [myEvents, setMyEvents] = useState<KflEvent[]>([]);
  const [linkedCourseId, setLinkedCourseId] = useState<string | null>(null);
  const [linkedEventId, setLinkedEventId] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);

  // Créé une seule fois sans source — useVideoPlayer n'observe pas les
  // changements de son 1er argument après le montage, il faut appeler
  // .replace() nous-mêmes quand l'utilisateur choisit une vidéo.
  const player = useVideoPlayer(null, (p) => { p.loop = true; });

  useEffect(() => {
    if (!isPro) return;
    void coursesService.getManaged().then(setMyCourses).catch(() => setMyCourses([]));
    void eventsService.getManaged().then(setMyEvents).catch(() => setMyEvents([]));
  }, [isPro]);

  // Une vidéo ne fait la promotion que d'une seule chose à la fois — choisir
  // un événement désélectionne la formation, et inversement.
  const selectCourse = (id: string) => {
    setLinkedCourseId((prev) => (prev === id ? null : id));
    setLinkedEventId(null);
  };
  const selectEvent = (id: string) => {
    setLinkedEventId((prev) => (prev === id ? null : id));
    setLinkedCourseId(null);
  };

  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['videos'], quality: 0.7, videoMaxDuration: 90 });
    if (!result.canceled && result.assets?.[0]) {
      const uri = result.assets[0].uri;
      setVideoUri(uri);
      player.replace(uri);
      player.play();
    }
  };

  const canPublish = !!videoUri && caption.trim().length > 0 && !publishing;

  const handlePublish = async () => {
    if (!canPublish || !videoUri) return;
    setPublishing(true);
    try {
      const base64 = await readUriAsBase64(videoUri);
      await publish({
        videoBase64: base64,
        mimeType: 'video/mp4',
        caption: caption.trim(),
        linkedCourseId: linkedCourseId ?? undefined,
        linkedEventId: linkedEventId ?? undefined,
      });
      navigation.goBack();
    } catch {
      Alert.alert('Erreur', "Impossible de publier la vidéo. Réessayez.");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border, gap: 10 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="X" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: C.ink }}>Nouvelle vidéo</Text>
        <TouchableOpacity
          onPress={() => void handlePublish()}
          disabled={!canPublish}
          style={{ paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: canPublish ? C.primary : C.border, flexDirection: 'row', alignItems: 'center', gap: 6 }}
        >
          {publishing && <ActivityIndicator size="small" color="#fff" />}
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>Publier</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, gap: 16 }}>
        {videoUri ? (
          <TouchableOpacity onPress={pickVideo} style={{ width: '100%', aspectRatio: 9 / 16, maxHeight: 380, borderRadius: 16, overflow: 'hidden', backgroundColor: '#000' }}>
            <VideoView player={player} style={{ width: '100%', height: '100%' }} contentFit="cover" nativeControls={false} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={pickVideo}
            style={{ width: '100%', aspectRatio: 9 / 16, maxHeight: 380, borderRadius: 16, backgroundColor: C.surface2, borderWidth: 1.5, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center', gap: 8 }}
          >
            <Icon name="Video" size={32} color={C.inkMute} />
            <Text style={{ fontSize: 13, color: C.inkMute, fontWeight: '600' }}>Choisir une vidéo (90s max)</Text>
          </TouchableOpacity>
        )}

        <TextInput
          value={caption}
          onChangeText={setCaption}
          placeholder="Une légende pour cette vidéo…"
          placeholderTextColor={C.inkMute}
          multiline
          style={{ minHeight: 80, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 14, padding: 14, fontSize: 14, color: C.ink, lineHeight: 20, textAlignVertical: 'top' }}
        />

        {isPro && myCourses.length > 0 && (
          <View>
            <Text style={{ fontSize: 13, fontWeight: '700', color: C.inkSoft, marginBottom: 8 }}>Lier une formation (optionnel)</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {myCourses.map((c) => (
                <TouchableOpacity
                  key={c.id}
                  onPress={() => selectCourse(c.id)}
                  style={{
                    paddingHorizontal: 13, paddingVertical: 8, borderRadius: 16,
                    backgroundColor: linkedCourseId === c.id ? C.primarySoft : C.surface,
                    borderWidth: 1, borderColor: linkedCourseId === c.id ? C.primary : C.border,
                  }}
                >
                  <Text style={{ fontSize: 12.5, fontWeight: '600', color: linkedCourseId === c.id ? C.primary : C.inkSoft }}>{c.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {isPro && myEvents.length > 0 && (
          <View>
            <Text style={{ fontSize: 13, fontWeight: '700', color: C.inkSoft, marginBottom: 8 }}>Lier un événement (optionnel)</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {myEvents.map((e) => (
                <TouchableOpacity
                  key={e.id}
                  onPress={() => selectEvent(e.id)}
                  style={{
                    paddingHorizontal: 13, paddingVertical: 8, borderRadius: 16,
                    backgroundColor: linkedEventId === e.id ? C.primarySoft : C.surface,
                    borderWidth: 1, borderColor: linkedEventId === e.id ? C.primary : C.border,
                  }}
                >
                  <Text style={{ fontSize: 12.5, fontWeight: '600', color: linkedEventId === e.id ? C.primary : C.inkSoft }}>{e.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
