import React, { useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, Switch, StatusBar, Alert,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

export default function SettingsProEntry() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [push, setPush]             = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  const handleLogout = () => {
    Alert.alert(t('settingsProEntry.logout'), undefined, [
      { text: t('common.cancel', 'Annuler'), style: 'cancel' },
      { text: t('settingsProEntry.logout'), style: 'destructive', onPress: () => navigation.navigate('Login') },
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
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('settingsProEntry.title')}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

        {/* Pro upgrade banner */}
        <TouchableOpacity onPress={() => navigation.navigate('UpgradePro')} style={{ padding: 20, borderRadius: 24, backgroundColor: C.navy, overflow: 'hidden', marginBottom: 20 }} activeOpacity={0.9}>
          <View style={{ position: 'absolute', top: -16, right: -16, width: 128, height: 128, borderRadius: 64, backgroundColor: 'rgba(249,168,37,0.1)' }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Icon name="Star" size={14} color={C.gold} fill={C.gold} />
            <Text style={{ color: C.gold, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 }}>{t('settingsProEntry.upgradeBadge')}</Text>
          </View>
          <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'PlayfairDisplay-Bold', marginBottom: 4 }}>{t('settingsProEntry.upgradeTitle')}</Text>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 20, marginBottom: 16 }}>
            {t('settingsProEntry.upgradeDesc')}
          </Text>
          <View style={{ backgroundColor: C.gold, alignSelf: 'flex-start', paddingHorizontal: 20, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>{t('settingsProEntry.upgradeCta')}</Text>
          </View>
        </TouchableOpacity>

        {/* Current plan */}
        <View style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, marginBottom: 16, ...SHADOW_SM }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>{t('settingsProEntry.currentPlanLabel')}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="User" size={16} color={C.inkSoft} />
            </View>
            <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{t('settingsProEntry.currentPlanValue')}</Text>
          </View>
        </View>

        {/* Notifications */}
        <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingHorizontal: 4 }}>{t('settingsProEntry.notifications')}</Text>
        <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden', marginBottom: 16, ...SHADOW_SM }}>
          {[
            { l: t('settingsProEntry.pushNotif'),  icon: 'Bell' as const, value: push,       set: setPush       },
            { l: t('settingsProEntry.newsletter'), icon: 'Mail' as const, value: newsletter, set: setNewsletter },
          ].map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: i === 0 ? 1 : 0, borderColor: C.border }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={item.icon} size={16} color={C.inkSoft} />
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: C.ink }}>{item.l}</Text>
              <Switch value={item.value} onValueChange={item.set} trackColor={{ false: C.border, true: C.primary }} thumbColor="#fff" />
            </View>
          ))}
        </View>

        {/* Links */}
        <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
          {[
            { label: t('settingsProEntry.privacy'), screen: 'PrivacySettings' },
            { label: t('settingsProEntry.terms'),   screen: null },
            { label: t('settingsProEntry.about'),   screen: 'AboutKFL' },
          ].map((link, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => link.screen ? navigation.navigate(link.screen) : Alert.alert(link.label)}
              style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: i < 2 ? 1 : 0, borderColor: C.border }}
            >
              <Text style={{ flex: 1, fontSize: 14, color: C.ink }}>{link.label}</Text>
              <Icon name="ChevronRight" size={16} color={C.inkMute} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity onPress={handleLogout} style={{ marginTop: 16, height: 44, borderWidth: 1, borderColor: C.error, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, color: C.error }}>{t('settingsProEntry.logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
