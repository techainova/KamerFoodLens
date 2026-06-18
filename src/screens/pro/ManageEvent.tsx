import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

export default function ManageEvent() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();

  const ACTIONS = [
    { l: t('manageEvent.attendeesList'),     icon: 'Users'      as const },
    { l: t('manageEvent.messageAttendees'),  icon: 'Megaphone'  as const },
    { l: t('manageEvent.editEvent'),         icon: 'Edit'       as const },
    { l: t('manageEvent.scanTickets'),       icon: 'ScanLine'   as const },
    { l: t('manageEvent.eventStats'),        icon: 'BarChart2'  as const },
  ];

  const handleCancelEvent = () => {
    Alert.alert(
      t('manageEvent.cancelConfirmTitle'),
      t('manageEvent.cancelConfirmMessage'),
      [
        { text: t('manageEvent.cancelConfirmNo'), style: 'cancel' },
        {
          text: t('manageEvent.cancelConfirmYes'),
          style: 'destructive',
          onPress: () => {
            Alert.alert(t('manageEvent.eventCancelled'));
            navigation.goBack();
          },
        },
      ],
    );
  };

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

        {/* Event hero */}
        <View style={{ padding: 16, borderRadius: 20, backgroundColor: C.navy, marginBottom: 16 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'PlayfairDisplay-Bold' }}>Festival des saveurs camerounaises</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
            <Icon name="Calendar" size={12} color="rgba(255,255,255,0.6)" />
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>Sam 22 Jun 2026 · 10h00 – 20h00</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            {[{ v: '847', l: t('manageEvent.registered') }, { v: '153', l: t('manageEvent.remaining') }, { v: '1000', l: t('manageEvent.capacity') }].map((s, i) => (
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
            <TouchableOpacity key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
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
          style={{ marginTop: 20, height: 44, borderWidth: 1, borderColor: '#C6282830', borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 14, color: C.error }}>{t('manageEvent.cancelEvent')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
