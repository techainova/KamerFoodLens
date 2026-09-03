import React from 'react';
import {
  View, TouchableOpacity, StatusBar,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_MD } from '@/constants/theme';

export default function ProConfirmation() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const C = useColors();
  const { t } = useTranslation();
  const businessName = (route.params as { businessName?: string } | undefined)?.businessName;

  const rows = [
    { l: t('proConfirmation.businessName'), v: businessName || '—' },
    { l: t('proConfirmation.status'),       v: t('proConfirmation.statusPending') },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
      <StatusBar barStyle={C.statusBar} />

      {/* Hero */}
      <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: C.goldSoft, borderWidth: 4, borderColor: C.gold, alignItems: 'center', justifyContent: 'center', marginBottom: 20, ...SHADOW_MD }}>
        <Icon name="Clock" size={44} color={C.gold} />
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
            <Text style={{ fontSize: 13, fontWeight: '600', color: C.ink }}>{row.v}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={() => navigation.popToTop()}
        style={{ width: '100%', height: 48, backgroundColor: C.gold, borderRadius: 24, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
        activeOpacity={0.85}
      >
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>{t('proConfirmation.cta')}</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
