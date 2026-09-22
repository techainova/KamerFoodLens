// Compte Pro — liste des inscrits à un événement, avec pointage à l'entrée :
// soit manuellement (appui sur la ligne), soit via scan d'un QR code affiché
// par l'inscrit (CameraView + détection de code-barres native expo-camera).
import React, { useCallback, useState } from 'react';
import { View, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Modal } from 'react-native';
import { Alert } from '@/utils/alert';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { CameraView, useCameraPermissions } from 'expo-camera';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { eventsService, type EventAttendee } from '@/services/events.service';

export default function EventAttendees() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const C = useColors();
  const { t } = useTranslation();
  const eventId: string | undefined = route.params?.eventId;

  const [attendees, setAttendees] = useState<EventAttendee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [scannerOpen, setScannerOpen] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const [scanLock, setScanLock] = useState(false);

  const load = useCallback(() => {
    if (!eventId) { setIsLoading(false); return; }
    setIsLoading(true);
    eventsService.getAttendees(eventId)
      .then(setAttendees)
      .catch(() => setAttendees([]))
      .finally(() => setIsLoading(false));
  }, [eventId]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const checkedInCount = attendees.filter((a) => a.checkedInAt).length;

  const performCheckIn = async (registrationId: string) => {
    if (!eventId) return;
    try {
      const result = await eventsService.checkInAttendee(eventId, registrationId);
      setAttendees((prev) => prev.map((a) => (a.registrationId === registrationId ? { ...a, checkedInAt: result.checkedInAt } : a)));
      if (result.alreadyCheckedIn) {
        Alert.alert(t('eventAttendees.alreadyCheckedIn', 'Déjà enregistré'), result.attendeeName);
      } else {
        Alert.alert(t('eventAttendees.checkedIn', 'Entrée validée'), result.attendeeName);
      }
    } catch {
      Alert.alert(t('common.error', 'Erreur'), t('eventAttendees.checkInError', "Impossible de valider cette entrée."));
    }
  };

  const handleManualCheckIn = (attendee: EventAttendee) => {
    if (attendee.checkedInAt) {
      Alert.alert(t('eventAttendees.alreadyCheckedIn', 'Déjà enregistré'), attendee.name);
      return;
    }
    Alert.alert(
      t('eventAttendees.confirmCheckIn', "Valider l'entrée ?"),
      attendee.name,
      [
        { text: t('manageEvent.cancelConfirmNo'), style: 'cancel' },
        {
          text: t('eventAttendees.checkIn', 'Valider'),
          onPress: async () => {
            setBusyId(attendee.registrationId);
            await performCheckIn(attendee.registrationId);
            setBusyId(null);
          },
        },
      ],
    );
  };

  const handleOpenScanner = async () => {
    if (!permission?.granted) {
      const res = await requestPermission();
      if (!res.granted) {
        Alert.alert(t('eventAttendees.cameraDenied', 'Accès caméra refusé'), t('eventAttendees.cameraDeniedMsg', "Autorisez l'accès à la caméra pour scanner les billets."));
        return;
      }
    }
    setScanLock(false);
    setScannerOpen(true);
  };

  const handleBarcodeScanned = ({ data }: { data: string }) => {
    if (scanLock) return;
    setScanLock(true);
    setScannerOpen(false);
    void performCheckIn(data.trim()).finally(() => setScanLock(false));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('manageEvent.attendeesList')}</Text>
        <TouchableOpacity onPress={() => void handleOpenScanner()} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.navySoft, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="ScanLine" size={17} color={C.navy} />
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: 'row', gap: 10, padding: 16, paddingBottom: 8 }}>
        <View style={{ flex: 1, padding: 12, borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, alignItems: 'center', ...SHADOW_SM }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: C.ink }}>{attendees.length}</Text>
          <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 2 }}>{t('manageEvent.registered')}</Text>
        </View>
        <View style={{ flex: 1, padding: 12, borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, alignItems: 'center', ...SHADOW_SM }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: C.success }}>{checkedInCount}</Text>
          <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 2 }}>{t('eventAttendees.checkedInLabel', 'Entrées validées')}</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingTop: 8, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <ActivityIndicator color={C.primary} style={{ marginTop: 30 }} />
        ) : attendees.length === 0 ? (
          <Text style={{ fontSize: 13, color: C.inkMute, textAlign: 'center', marginTop: 24 }}>{t('eventAttendees.noAttendees', 'Aucun inscrit pour le moment.')}</Text>
        ) : (
          <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
            {attendees.map((a, i) => (
              <TouchableOpacity
                key={a.registrationId}
                onPress={() => handleManualCheckIn(a)}
                disabled={busyId === a.registrationId}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: i < attendees.length - 1 ? 1 : 0, borderColor: C.surface2, opacity: busyId === a.registrationId ? 0.6 : 1 }}
              >
                <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: C.inkSoft }}>{a.name[0]?.toUpperCase() ?? '?'}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{a.name}</Text>
                  <Text style={{ fontSize: 12, color: C.inkMute }}>{new Date(a.registeredAt).toLocaleDateString()}</Text>
                </View>
                {a.checkedInAt ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10, backgroundColor: C.successSoft }}>
                    <Icon name="Check" size={12} color={C.success} />
                    <Text style={{ fontSize: 11, color: C.success, fontWeight: '600' }}>{t('eventAttendees.in', 'Entré')}</Text>
                  </View>
                ) : (
                  <Icon name="ChevronRight" size={16} color={C.inkMute} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <Modal visible={scannerOpen} animationType="slide" onRequestClose={() => setScannerOpen(false)}>
        <View style={{ flex: 1, backgroundColor: '#0B0B0B' }}>
          <StatusBar barStyle="light-content" />
          {permission?.granted && (
            <CameraView
              style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
              facing="back"
              barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
              onBarcodeScanned={scanLock ? undefined : handleBarcodeScanned}
            />
          )}
          <SafeAreaView style={{ flex: 1, justifyContent: 'space-between' }}>
            <View style={{ paddingHorizontal: 20, paddingTop: 8, alignItems: 'flex-end' }}>
              <TouchableOpacity
                style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: 'rgba(0,0,0,0.45)', alignItems: 'center', justifyContent: 'center' }}
                onPress={() => setScannerOpen(false)}
              >
                <Icon name="X" size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            <View style={{ alignItems: 'center', paddingBottom: 60 }}>
              <View style={{ width: 240, height: 240, borderRadius: 20, borderWidth: 2, borderColor: 'rgba(255,255,255,0.6)' }} />
              <Text style={{ color: '#fff', fontSize: 13, marginTop: 20, textAlign: 'center', paddingHorizontal: 30 }}>
                {t('eventAttendees.scanHint', "Visez le QR code du billet de l'inscrit")}
              </Text>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
