import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Switch, StatusBar, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import type { IconName } from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

type ToggleKey = 'publicProfile' | 'showActivity' | 'shareAnalytics' | 'locationServices' | 'partnerData';
type PrivacyItem = { key: ToggleKey; icon: IconName; labelKey: string; descKey: string };

export default function PrivacySettings() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();

  const [toggles, setToggles] = useState<Record<ToggleKey, boolean>>({
    publicProfile:    true,
    showActivity:     true,
    shareAnalytics:   false,
    locationServices: true,
    partnerData:      false,
  });

  const set = (key: ToggleKey, val: boolean) =>
    setToggles(prev => ({ ...prev, [key]: val }));

  const VISIBILITY_ITEMS: PrivacyItem[] = [
    { key: 'publicProfile',    icon: 'Eye',       labelKey: 'privacy.publicProfile',    descKey: 'privacy.publicProfileDesc'    },
    { key: 'showActivity',     icon: 'BarChart2', labelKey: 'privacy.showActivity',     descKey: 'privacy.showActivityDesc'     },
  ];
  const ANALYTICS_ITEMS: PrivacyItem[] = [
    { key: 'shareAnalytics',   icon: 'Globe',     labelKey: 'privacy.shareAnalytics',   descKey: 'privacy.shareAnalyticsDesc'   },
    { key: 'locationServices', icon: 'MapPin',    labelKey: 'privacy.locationServices', descKey: 'privacy.locationServicesDesc' },
    { key: 'partnerData',      icon: 'Share2',    labelKey: 'privacy.partnerData',      descKey: 'privacy.partnerDataDesc'      },
  ];

  const RGPD_KEYS = ['privacy.rgpd1', 'privacy.rgpd2', 'privacy.rgpd3', 'privacy.rgpd4'] as const;

  const handleDelete = () => {
    Alert.alert(
      t('privacy.deleteDialogTitle'),
      t('privacy.deleteDialogMsg'),
      [
        { text: t('privacy.deleteDialogCancel'), style: 'cancel' },
        { text: t('privacy.deleteDialogContact'), style: 'destructive' },
      ],
    );
  };

  const renderGroup = (items: PrivacyItem[]) => (
    <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
      {items.map((item, ii) => (
        <View
          key={item.key}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: ii < items.length - 1 ? 1 : 0, borderColor: C.border }}
        >
          <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
            <Icon name={item.icon} size={16} color="#6D4C41" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink, marginBottom: 2 }}>{t(item.labelKey)}</Text>
            <Text style={{ fontSize: 12, color: C.inkMute, lineHeight: 16 }}>{t(item.descKey)}</Text>
          </View>
          <Switch
            value={toggles[item.key]}
            onValueChange={(val) => set(item.key, val)}
            trackColor={{ false: '#E5E0D8', true: '#E8591A' }}
            thumbColor="#fff"
          />
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('privacy.title')}</Text>
        <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: C.successSoft }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#2E7D32' }}>{t('privacy.protected')}</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Info note */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: C.navySoft, borderRadius: 14, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: '#1A237E20' }}>
          <Icon name="Shield" size={16} color="#1A237E" />
          <Text style={{ flex: 1, fontSize: 12, color: '#1A237E', lineHeight: 18 }}>{t('privacy.infoNote')}</Text>
        </View>

        {/* Profile visibility group */}
        <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingHorizontal: 4 }}>
          {t('privacy.visibilityGroup')}
        </Text>
        {renderGroup(VISIBILITY_ITEMS)}

        {/* Analytics group */}
        <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginTop: 20, marginBottom: 8, paddingHorizontal: 4 }}>
          {t('privacy.analyticsGroup')}
        </Text>
        {renderGroup(ANALYTICS_ITEMS)}

        {/* RGPD rights */}
        <View style={{ marginTop: 20, backgroundColor: C.surface, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 16, ...SHADOW_SM }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, marginBottom: 12 }}>{t('privacy.rgpdTitle')}</Text>
          {RGPD_KEYS.map((key, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: i < RGPD_KEYS.length - 1 ? 10 : 0 }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: C.successSoft, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Check" size={12} color="#2E7D32" />
              </View>
              <Text style={{ flex: 1, fontSize: 13, color: C.inkSoft }}>{t(key)}</Text>
            </View>
          ))}
        </View>

        {/* Delete account */}
        <TouchableOpacity
          onPress={handleDelete}
          style={{ marginTop: 20, borderRadius: 16, backgroundColor: C.errorSoft, borderWidth: 1, borderColor: '#C6282830', padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12, ...SHADOW_SM }}
          activeOpacity={0.85}
        >
          <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: '#C62828', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="AlertTriangle" size={16} color="#fff" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#C62828', marginBottom: 2 }}>{t('privacy.deleteTitle')}</Text>
            <Text style={{ fontSize: 12, color: C.inkMute }}>{t('privacy.deleteSub')}</Text>
          </View>
          <Icon name="ChevronRight" size={16} color="#C62828" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
