// Compte Pro — création d'un événement (gratuit ou payant), en 3 étapes :
// infos, billetterie, aperçu — publie réellement via POST /events.
import React, { useEffect, useState } from 'react';
import { View, TextInput, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Image } from 'react-native';
import { Alert } from '@/utils/alert';
import * as ImagePicker from 'expo-image-picker';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { eventsService } from '@/services/events.service';
import { useEventsStore } from '@/store/events.store';

const CATEGORIES = ['Atelier', 'Festival', 'Dégustation', 'Conférence', 'Live'];
const STEPS = ['Infos', 'Billetterie', 'Aperçu'];

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  const C = useColors();
  return (
    <View style={{ marginBottom: 16 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
        <Text style={{ fontSize: 11.5, fontWeight: '700', color: C.inkSoft }}>{label}</Text>
        {hint && <Text style={{ fontSize: 10.5, color: C.inkMute }}>{hint}</Text>}
      </View>
      {children}
    </View>
  );
}

function Input({ value, onChangeText, placeholder, suffix, keyboardType }: { value: string; onChangeText: (v: string) => void; placeholder?: string; suffix?: string; keyboardType?: 'default' | 'numeric' }) {
  const C = useColors();
  return (
    <View style={{ height: 46, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 13 }}>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={C.inkMute} keyboardType={keyboardType} style={{ flex: 1, fontSize: 14, color: C.ink }} />
      {suffix && <Text style={{ fontSize: 12.5, fontWeight: '700', color: C.inkMute }}>{suffix}</Text>}
    </View>
  );
}

export default function CreateEvent() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const C = useColors();
  const receiveEvent = useEventsStore((s) => s.receiveEvent);
  const eventId: string | undefined = route.params?.eventId;
  const isEditMode = !!eventId;

  const [step, setStep] = useState(0);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [priceXAF, setPriceXAF] = useState('');
  const [maxSeats, setMaxSeats] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [loadingExisting, setLoadingExisting] = useState(isEditMode);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!eventId) return;
    let cancelled = false;
    eventsService.getDetail(eventId)
      .then((e) => {
        if (cancelled) return;
        setTitle(e.title);
        setCategory(e.category || CATEGORIES[0]);
        setDescription(e.description || '');
        setDate(e.startAt.slice(0, 10));
        setTime(e.startAt.slice(11, 16));
        setLocation(e.location || '');
        setIsOnline(e.isOnline);
        setIsPaid(!e.isFree);
        setPriceXAF(e.isFree ? '' : String(e.price));
        setMaxSeats(e.maxAttendees ? String(e.maxAttendees) : '');
        setImageUrl(e.imageUrl ?? '');
      })
      .catch(() => { if (!cancelled) setError("Impossible de charger l'événement."); })
      .finally(() => { if (!cancelled) setLoadingExisting(false); });
    return () => { cancelled = true; };
  }, [eventId]);

  const uploadImageFromAsset = async (asset: ImagePicker.ImagePickerAsset) => {
    if (!asset.base64) return;
    setUploadingImage(true);
    try {
      const { url } = await eventsService.uploadImage(asset.base64, asset.mimeType ?? 'image/jpeg');
      setImageUrl(url);
    } catch {
      Alert.alert('Erreur', "L'envoi de la photo a échoué. Réessayez plus tard.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePickFromLibrary = async () => {
    if (uploadingImage) return;
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission requise', "Autorisez l'accès pour ajouter une photo de couverture.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.7,
      allowsEditing: true,
      aspect: [16, 9],
      base64: true,
    });
    if (result.canceled || !result.assets?.[0]) return;
    await uploadImageFromAsset(result.assets[0]);
  };

  const handlePickFromCamera = async () => {
    if (uploadingImage) return;
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission requise', "Autorisez l'accès pour ajouter une photo de couverture.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ quality: 0.7, base64: true, allowsEditing: true, aspect: [16, 9] });
    if (result.canceled || !result.assets?.[0]) return;
    await uploadImageFromAsset(result.assets[0]);
  };

  const stepValid = () => {
    if (step === 0) return title.trim().length > 0 && date.trim().length > 0 && time.trim().length > 0;
    if (step === 1) return !isPaid || (Number(priceXAF) > 0 && Number(maxSeats) > 0);
    return true;
  };

  const buildIso = (): { startAt: string; endAt: string } | null => {
    const iso = `${date}T${time}:00`;
    const startDate = new Date(iso);
    if (Number.isNaN(startDate.getTime())) return null;
    const endDate = new Date(startDate.getTime() + 3 * 60 * 60 * 1000);
    return { startAt: startDate.toISOString(), endAt: endDate.toISOString() };
  };

  const handlePublish = async () => {
    const dates = buildIso();
    if (!dates) {
      setError('Date invalide — utilisez le format AAAA-MM-JJ pour la date et HH:MM pour l\'heure.');
      return;
    }
    setPublishing(true);
    setError('');
    const payload = {
      title: title.trim(),
      description: description.trim() || undefined,
      category,
      location: location.trim() || undefined,
      isOnline,
      startAt: dates.startAt,
      endAt: dates.endAt,
      priceXAF: isPaid ? Number(priceXAF) : 0,
      maxSeats: maxSeats ? Number(maxSeats) : undefined,
      imageUrl: imageUrl || undefined,
    };
    try {
      if (isEditMode && eventId) {
        const updated = await eventsService.update(eventId, payload);
        receiveEvent(updated);
        Alert.alert('Événement modifié', 'Vos changements ont été enregistrés.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
      } else {
        const created = await eventsService.create(payload);
        receiveEvent(created);
        Alert.alert('Événement publié', 'Votre événement est en ligne.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
      }
    } catch {
      setError(isEditMode ? "Impossible d'enregistrer les modifications. Réessayez." : "Impossible de publier l'événement. Réessayez.");
    } finally {
      setPublishing(false);
    }
  };

  const potentialRevenue = isPaid ? Number(priceXAF || 0) * Number(maxSeats || 0) : 0;

  if (loadingExisting) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={C.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => (step === 0 ? navigation.goBack() : setStep(step - 1))} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontSize: 17, fontWeight: '700', color: C.ink }}>{isEditMode ? "Modifier l'événement" : 'Nouvel événement'}</Text>
      </View>

      {/* Étapes */}
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
            <Field label="Photo de couverture">
              <View style={{ height: 140, borderRadius: 14, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', marginBottom: 10 }}>
                {uploadingImage ? (
                  <ActivityIndicator color={C.primary} size="large" />
                ) : imageUrl ? (
                  <Image source={{ uri: imageUrl }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                ) : (
                  <Icon name="Image" size={28} color={C.inkMute} />
                )}
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  onPress={() => void handlePickFromLibrary()}
                  disabled={uploadingImage}
                  style={{ flex: 1, height: 40, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <Icon name="Image" size={15} color={C.inkSoft} />
                  <Text style={{ fontSize: 12.5, fontWeight: '600', color: C.inkSoft }}>Galerie</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => void handlePickFromCamera()}
                  disabled={uploadingImage}
                  style={{ flex: 1, height: 40, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 }}
                >
                  <Icon name="Camera" size={15} color={C.inkSoft} />
                  <Text style={{ fontSize: 12.5, fontWeight: '600', color: C.inkSoft }}>Appareil photo</Text>
                </TouchableOpacity>
              </View>
            </Field>
            <Field label="Titre de l'événement">
              <Input value={title} onChangeText={setTitle} placeholder="Atelier Ndolé traditionnel" />
            </Field>
            <Field label="Type">
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {CATEGORIES.map((c) => (
                  <TouchableOpacity key={c} onPress={() => setCategory(c)} style={{ height: 32, paddingHorizontal: 13, borderRadius: 16, justifyContent: 'center', backgroundColor: category === c ? C.ink : C.surface, borderWidth: category === c ? 0 : 1, borderColor: C.border }}>
                    <Text style={{ fontSize: 12.5, fontWeight: '600', color: category === c ? C.cream : C.inkSoft }}>{c}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Field>
            <Field label="Description" hint={`${description.length} / 500`}>
              <View style={{ minHeight: 88, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, padding: 12 }}>
                <TextInput value={description} onChangeText={setDescription} multiline maxLength={500} placeholder="Décrivez le déroulé de l'événement…" placeholderTextColor={C.inkMute} style={{ fontSize: 13.5, color: C.ink, lineHeight: 20 }} />
              </View>
            </Field>
            <View style={{ flexDirection: 'row', gap: 9 }}>
              <View style={{ flex: 1 }}><Field label="Date"><Input value={date} onChangeText={setDate} placeholder="2026-09-28" /></Field></View>
              <View style={{ flex: 1 }}><Field label="Heure"><Input value={time} onChangeText={setTime} placeholder="14:00" /></Field></View>
            </View>
            <Field label="Lieu">
              <Input value={location} onChangeText={setLocation} placeholder="Esplanade Bonanjo, Douala" />
            </Field>
            <TouchableOpacity onPress={() => setIsOnline(!isOnline)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 13, borderRadius: 12, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13.5, fontWeight: '600', color: C.ink }}>Événement en ligne</Text>
                <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 1 }}>Lien de visio envoyé aux inscrits</Text>
              </View>
              <View style={{ width: 42, height: 25, borderRadius: 13, backgroundColor: isOnline ? C.success : C.borderStrong, justifyContent: 'center' }}>
                <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#fff', marginLeft: isOnline ? 19.5 : 2.5 }} />
              </View>
            </TouchableOpacity>
          </>
        )}

        {step === 1 && (
          <>
            <Text style={{ fontSize: 13, fontWeight: '700', color: C.inkSoft, marginBottom: 10 }}>Billetterie</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
              {[{ label: 'Gratuit', sub: 'Inscription simple', v: false }, { label: 'Payant', sub: 'Souscription requise', v: true }].map((m) => (
                <TouchableOpacity key={m.label} onPress={() => setIsPaid(m.v)} style={{ flex: 1, padding: 13, borderRadius: 14, alignItems: 'center', backgroundColor: isPaid === m.v ? C.primarySoft : C.surface, borderWidth: isPaid === m.v ? 1.6 : 1, borderColor: isPaid === m.v ? C.primary : C.border }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: isPaid === m.v ? C.primary : C.ink }}>{m.label}</Text>
                  <Text style={{ fontSize: 10.5, color: C.inkMute, marginTop: 2 }}>{m.sub}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: 'row', gap: 9 }}>
              <View style={{ flex: 1 }}><Field label="Prix du billet"><Input value={priceXAF} onChangeText={setPriceXAF} placeholder="5000" suffix="XAF" keyboardType="numeric" /></Field></View>
              <View style={{ flex: 1 }}><Field label="Places max"><Input value={maxSeats} onChangeText={setMaxSeats} placeholder="30" keyboardType="numeric" /></Field></View>
            </View>
            {isPaid && potentialRevenue > 0 && (
              <View style={{ padding: 13, borderRadius: 14, backgroundColor: C.surface2, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 12.5, color: C.inkSoft }}>Revenu potentiel ({maxSeats} places)</Text>
                <Text style={{ fontSize: 12.5, fontWeight: '700', color: C.success }}>{potentialRevenue.toLocaleString()} XAF</Text>
              </View>
            )}
            <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 12, lineHeight: 16 }}>
              Les inscriptions payantes débitent le portefeuille KFL de l'utilisateur (rechargeable via Mobile Money/carte).
            </Text>
          </>
        )}

        {step === 2 && (
          <View style={{ borderRadius: 16, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden' }}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={{ width: '100%', height: 140 }} resizeMode="cover" />
            ) : null}
            <View style={{ padding: 16 }}>
            <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{title || 'Titre de l\'événement'}</Text>
            <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 4 }}>{category} · {date} {time} · {location || 'Lieu à préciser'}</Text>
            <Text style={{ fontSize: 13, color: C.inkSoft, marginTop: 10, lineHeight: 19 }}>{description || 'Aucune description.'}</Text>
            <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderColor: C.border, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink }}>{isPaid ? `${Number(priceXAF || 0).toLocaleString()} XAF` : 'Gratuit'}</Text>
              <Text style={{ fontSize: 12, color: C.inkMute }}>{maxSeats || '—'} places</Text>
            </View>
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
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>{step < 2 ? 'Suivant' : (isEditMode ? 'Enregistrer' : 'Publier')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
