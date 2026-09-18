import React, { useEffect, useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar, Alert, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { eventsService, type KflEvent } from '@/services/events.service';

export default function ManageEvent() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const C = useColors();
  const { t } = useTranslation();
  const eventId: string | undefined = route.params?.eventId;

  const [event, setEvent] = useState<KflEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!eventId) { setLoading(false); return; }
    let cancelled = false;
    eventsService.getDetail(eventId)
      .then((e) => { if (!cancelled) setEvent(e); })
      .catch(() => { if (!cancelled) setEvent(null); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [eventId]);

  // Ces actions demandent des capacités backend qui n'existent pas encore
  // (liste des inscrits, messagerie de masse, scan de billets, stats dédiées) —
  // on le dit clairement plutôt que d'afficher un bouton mort sans retour.
  const notYetAvailable = () => Alert.alert(t('settings.comingSoonTitle', 'Bientôt disponible'), t('settings.comingSoonMsg', 'Cette fonctionnalité arrive dans une prochaine mise à jour.'));

  const ACTIONS = [
    { l: t('manageEvent.attendeesList'),     icon: 'Users'      as const },
    { l: t('manageEvent.messageAttendees'),  icon: 'Megaphone'  as const },
    { l: t('manageEvent.editEvent'),         icon: 'Edit'       as const },
    { l: t('manageEvent.scanTickets'),       icon: 'ScanLine'   as const },
    { l: t('manageEvent.eventStats'),        icon: 'BarChart2'  as const },
  ];

  const handleCancelEvent = () => {
    if (!eventId) return;
    Alert.alert(
      t('manageEvent.cancelConfirmTitle'),
      t('manageEvent.cancelConfirmMessage'),
      [
        { text: t('manageEvent.cancelConfirmNo'), style: 'cancel' },
        {
          text: t('manageEvent.cancelConfirmYes'),
          style: 'destructive',
          onPress: async () => {
            setCancelling(true);
            try {
              await eventsService.remove(eventId);
              Alert.alert(t('manageEvent.eventCancelled'));
              navigation.goBack();
            } catch {
              Alert.alert(t('common.error', 'Erreur'), t('manageEvent.cancelError', "Impossible d'annuler l'événement."));
            } finally {
              setCancelling(false);
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={C.primary} />
      </SafeAreaView>
    );
  }

  if (!event) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <Text style={{ fontSize: 15, color: C.inkSoft, textAlign: 'center' }}>{t('restaurant.notFound', 'Introuvable.')}</Text>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginTop: 16 }}>
          <Text style={{ color: C.primary, fontWeight: '600' }}>{t('common.goBack', 'Retour')}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const remaining = Math.max(0, event.maxAttendees - event.registeredCount);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('manageEvent.title')}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Event hero — vraies données */}
        <View style={{ padding: 16, borderRadius: 20, backgroundColor: C.navy, marginBottom: 16 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'PlayfairDisplay-Bold' }}>{event.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <Icon name="Calendar" size={12} color="rgba(255,255,255,0.6)" />
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{event.date} · {event.time}{event.location ? ` · ${event.location}` : ''}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            {[
              { v: String(event.registeredCount), l: t('manageEvent.registered') },
              { v: String(remaining), l: t('manageEvent.remaining') },
              { v: String(event.maxAttendees || event.registeredCount), l: t('manageEvent.capacity') },
            ].map((s, i) => (
              <View key={i} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 10, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>{s.v}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>{s.l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={{ gap: 10 }}>
          {ACTIONS.map((a, i) => (
            <TouchableOpacity key={i} onPress={notYetAvailable} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: C.navySoft, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={a.icon} size={16} color={C.navy} />
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: C.ink }}>{a.l}</Text>
              <Icon name="ChevronRight" size={16} color={C.inkMute} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleCancelEvent}
          disabled={cancelling}
          style={{ marginTop: 20, height: 44, borderWidth: 1, borderColor: '#C6282830', borderRadius: 22, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
        >
          {cancelling && <ActivityIndicator size="small" color={C.error} />}
          <Text style={{ fontSize: 14, color: C.error }}>{t('manageEvent.cancelEvent')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
