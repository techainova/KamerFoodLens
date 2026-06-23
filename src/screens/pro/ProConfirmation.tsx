import React from 'react';
import {
  View, Text, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_MD = { shadowColor: '#F9A825', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 8 };

export default function ProConfirmation() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();

  const rows = [
    { l: t('proConfirmation.plan'),     v: t('proConfirmation.planValue'),     green: false },
    { l: t('proConfirmation.price'),    v: t('proConfirmation.priceValue'),    green: false },
    { l: t('proConfirmation.renewal'),  v: t('proConfirmation.renewalValue'),  green: false },
    { l: t('proConfirmation.status'),   v: t('proConfirmation.statusActive'),  green: true  },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
      <StatusBar barStyle={C.statusBar} />

      {/* Star hero */}
      <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: C.goldSoft, borderWidth: 4, borderColor: '#F9A825', alignItems: 'center', justifyContent: 'center', marginBottom: 20, ...SHADOW_MD }}>
        <Icon name="Star" size={44} color={C.gold} fill="#F9A825" />
      </View>

      <Text style={{ fontSize: 24, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, textAlign: 'center', marginBottom: 6 }}>
        {t('proConfirmation.title')}
      </Text>
      <Text style={{ fontSize: 14, color: C.inkSoft, textAlign: 'center', lineHeight: 22, marginBottom: 32 }}>
        {t('proConfirmation.description')}
      </Text>

      {/* Summary card */}
      <View style={{ width: '100%', backgroundColor: C.surface, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: C.border, marginBottom: 24 }}>
        {rows.map((row, i) => (
          <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: i < rows.length - 1 ? 1 : 0, borderColor: C.surface2 }}>
            <Text style={{ fontSize: 13, color: C.inkMute }}>{row.l}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              {row.green && <Icon name="Check" size={12} color={C.success} />}
              <Text style={{ fontSize: 13, fontWeight: '600', color: row.green ? C.success : C.ink }}>{row.v}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('ProDashboard')}
        style={{ width: '100%', height: 48, backgroundColor: C.gold, borderRadius: 24, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
        activeOpacity={0.85}
      >
        <Icon name="BarChart2" size={18} color="#fff" />
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>{t('proConfirmation.cta')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
