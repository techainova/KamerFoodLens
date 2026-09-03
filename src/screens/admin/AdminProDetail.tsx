import React, { useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';

export default function AdminProDetail() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [status, setStatus] = useState<'active' | 'suspended'>('active');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#1A237E' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12, padding: 4 }}>
          <Icon name="ArrowLeft" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', flex: 1 }}>{t('admin.proDetail')}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 110 }} showsVerticalScrollIndicator={false}>

        {/* Pro info card */}
        <View style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, marginBottom: 16, ...SHADOW_SM }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <View style={{ width: 56, height: 56, borderRadius: 16, backgroundColor: C.surface2, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="ChefHat" size={24} color="rgba(140,130,120,0.5)" />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ fontSize: 15, fontWeight: '700', color: C.ink }}>Chez Mama Pauline</Text>
                <View style={{ backgroundColor: '#F9A825', paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8 }}>
                  <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>{t('pro.badge')}</Text>
                </View>
              </View>
              <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 2 }}>Maman Pauline · @chef_mama_pauline</Text>
              <Text style={{ fontSize: 12, color: C.inkMute }}>Cuisine camerounaise · Douala</Text>
            </View>
          </View>

          {[
            { l: t('admin.userId'),           v: '#PRO-0124' },
            { l: t('auth.email'),             v: 'pauline@restaurant.cm' },
            { l: t('admin.phone'),            v: '+237 67 00 00 00' },
            { l: t('admin.registeredOn'),     v: '3 Jan 2026' },
            { l: t('admin.subscriptionLabel'), v: '3 000 XAF/mois · ' + t('common.active') },
          ].map((row, i) => (
            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: i < 4 ? 1 : 0, borderColor: C.border }}>
              <Text style={{ fontSize: 13, color: C.inkMute }}>{row.l}</Text>
              <Text style={{ fontSize: 13, fontWeight: '500', color: C.ink }}>{row.v}</Text>
            </View>
          ))}
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          {[
            { v: '47',   l: t('admin.ordersPerMonth'), color: '#E8591A' },
            { v: '195k', l: t('admin.revenuesXaf'),    color: '#2E7D32' },
            { v: '4.8',  l: t('proAnalytics.avgRating'), color: '#F9A825' },
          ].map((stat, i) => (
            <View key={i} style={{ flex: 1, padding: 12, borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, alignItems: 'center', ...SHADOW_SM }}>
              <Text style={{ fontSize: 15, fontWeight: '700', color: stat.color }}>{stat.v}</Text>
              <Text style={{ fontSize: 10, color: C.inkMute, textAlign: 'center', marginTop: 2 }}>{stat.l}</Text>
            </View>
          ))}
        </View>

        {/* Status control */}
        <View style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 }}>{t('admin.accountStatus')}</Text>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              onPress={() => setStatus('active')}
              style={{ flex: 1, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: status === 'active' ? 1.5 : 1, borderColor: status === 'active' ? '#2E7D32' : C.border, backgroundColor: status === 'active' ? '#E3F0E4' : C.surface }}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: status === 'active' ? '#2E7D32' : C.inkMute }}>{t('admin.statusActive')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setStatus('suspended')}
              style={{ flex: 1, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', borderWidth: status === 'suspended' ? 1.5 : 1, borderColor: status === 'suspended' ? '#C62828' : C.border, backgroundColor: status === 'suspended' ? '#FBDCDC' : C.surface }}
            >
              <Text style={{ fontSize: 13, fontWeight: '600', color: status === 'suspended' ? '#C62828' : C.inkMute }}>{t('admin.statusSuspended')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Bottom actions */}
      <View style={{ flexDirection: 'row', gap: 10, paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        <TouchableOpacity style={{ flex: 1, height: 44, borderWidth: 1, borderColor: C.border, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, color: C.inkSoft }}>{t('admin.impersonateAction')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, height: 44, backgroundColor: '#1A237E', borderRadius: 22, alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.85}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#fff' }}>{t('common.save')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
