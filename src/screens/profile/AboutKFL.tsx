import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const TECH_CHIPS = ['React Native 0.85', 'Expo SDK 56', 'AI Vision', 'AES-256-GCM', 'TypeScript', 'NativeWind v4'];

export default function AboutKFL() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();

  const STATS = [
    { value: '1 200+', labelKey: 'about.dishesIndexed' },
    { value: '10',     labelKey: 'about.regionsCovered' },
    { value: '50k+',   labelKey: 'about.users'          },
  ];

  const LINKS = [
    { icon: 'Mail'     as const, labelKey: 'about.support',      valueKey: 'about.supportEmail', color: '#E8591A' },
    { icon: 'Globe'    as const, labelKey: 'about.website',      valueKey: 'about.websiteValue', color: '#1A237E' },
    { icon: 'FileText' as const, labelKey: 'about.terms',        valueKey: 'about.cguNote',      color: C.inkSoft },
    { icon: 'Shield'   as const, labelKey: 'about.privacyLink',  valueKey: 'about.privacyNote',  color: '#2E7D32' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('about.title')}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={{ alignItems: 'center', paddingVertical: 32, paddingHorizontal: 20, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
          <View style={{ width: 88, height: 88, borderRadius: 24, backgroundColor: '#E8591A15', borderWidth: 2, borderColor: '#E8591A30', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
            <Icon name="ChefHat" size={44} color="#E8591A" />
          </View>
          <Text style={{ fontSize: 24, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 4 }}>KmerFoodLens</Text>
          <Text style={{ fontSize: 14, color: C.inkMute, marginBottom: 4 }}>{t('about.version')}</Text>
          <Text style={{ fontSize: 12, color: C.inkSoft, marginBottom: 12 }}>{t('about.build')}</Text>
          <View style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#E8591A15', borderWidth: 1, borderColor: '#E8591A30' }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#E8591A' }}>{t('about.badge')}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border, paddingVertical: 20 }}>
          {STATS.map((stat, i) => (
            <View key={i} style={{ flex: 1, alignItems: 'center', borderRightWidth: i < 2 ? 1 : 0, borderColor: C.border }}>
              <Text style={{ fontSize: 22, fontWeight: '700', color: '#E8591A', fontFamily: 'Inter-Bold', marginBottom: 4 }}>{stat.value}</Text>
              <Text style={{ fontSize: 11, color: C.inkMute, textAlign: 'center' }}>{t(stat.labelKey)}</Text>
            </View>
          ))}
        </View>

        <View style={{ padding: 16, gap: 16 }}>

          {/* Mission */}
          <View style={{ backgroundColor: C.surface, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 16, ...SHADOW_SM }}>
            <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 10 }}>{t('about.missionTitle')}</Text>
            <Text style={{ fontSize: 13, color: C.inkSoft, lineHeight: 20 }}>{t('about.missionText')}</Text>
          </View>

          {/* Developer card */}
          <View style={{ backgroundColor: '#1A237E', borderRadius: 18, padding: 16, ...SHADOW_SM }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Sparkles" size={22} color="#F9A825" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginBottom: 2 }}>{t('about.developedBy')}</Text>
                <Text style={{ fontSize: 17, fontFamily: 'PlayfairDisplay-Bold', color: '#fff' }}>{t('about.company')}</Text>
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 2 }}>{t('about.copyright')}</Text>
              </View>
            </View>
          </View>

          {/* Technologies */}
          <View style={{ backgroundColor: C.surface, borderRadius: 18, borderWidth: 1, borderColor: C.border, padding: 16, ...SHADOW_SM }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, marginBottom: 12 }}>{t('about.techTitle')}</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {TECH_CHIPS.map((chip, i) => (
                <View key={i} style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border }}>
                  <Text style={{ fontSize: 12, fontWeight: '600', color: C.inkSoft }}>{chip}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Links */}
          <View style={{ backgroundColor: C.surface, borderRadius: 18, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
            {LINKS.map((link, i) => (
              <View
                key={i}
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: i < LINKS.length - 1 ? 1 : 0, borderColor: C.border }}
              >
                <View style={{ width: 34, height: 34, borderRadius: 10, backgroundColor: link.color + '15', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={link.icon} size={16} color={link.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{t(link.labelKey)}</Text>
                  <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 1 }}>{t(link.valueKey)}</Text>
                </View>
              </View>
            ))}
          </View>

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
