import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };
const SHADOW_MD = { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 6, elevation: 4 };

const TAB_KEYS = ['tabOverview', 'tabMenu', 'tabReviews'] as const;
const STATS = [
  { v: '4.8',  labelKey: 'statRating',   icon: 'Star'          as const },
  { v: '312',  labelKey: 'statReviews',  icon: 'MessageSquare' as const },
  { v: '1.4k', labelKey: 'statFollowers', icon: 'Users'        as const },
  { v: '47',   labelKey: 'statOrders',   icon: 'ShoppingBag'   as const },
];

export default function ProfilePro() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 18, fontFamily: 'PlayfairDisplay-Bold', color: C.ink }}>Chez Mama Pauline</Text>
            <View style={{ backgroundColor: C.gold, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 10 }}>
              <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>PRO</Text>
            </View>
          </View>
          <Text style={{ fontSize: 12, color: C.inkMute }}>@chef_mama_pauline</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('SettingsProActive')} style={{ width: 36, height: 36, borderWidth: 1, borderColor: C.border, borderRadius: 18, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="Settings" size={16} color={C.inkSoft} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Cover */}
        <View style={{ height: 144, backgroundColor: C.surface2, borderBottomWidth: 1, borderStyle: 'dashed', borderColor: C.border, position: 'relative' }}>
          <View style={{ position: 'absolute', bottom: 16, left: 16, flexDirection: 'row', alignItems: 'flex-end', gap: 12 }}>
            <View style={{ width: 80, height: 80, borderRadius: 18, backgroundColor: C.surface, borderWidth: 2, borderColor: C.gold, alignItems: 'center', justifyContent: 'center', ...SHADOW_MD }}>
              <Icon name="ChefHat" size={36} color={C.inkMute} />
            </View>
            <View style={{ marginBottom: 4 }}>
              <View style={{ height: 20, paddingHorizontal: 8, backgroundColor: C.success, borderRadius: 10, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4 }}>
                <View style={{ width: 5, height: 5, borderRadius: 3, backgroundColor: C.surface }} />
                <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{t('profilePro.openBadge')}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, paddingTop: 12, paddingBottom: 12, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
          <Text style={{ fontSize: 14, color: C.inkMute }}>Cuisine camerounaise traditionnelle · Douala · Littoral</Text>

          {/* Stats row */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderColor: C.border }}>
            {STATS.map((s, i) => (
              <View key={i} style={{ alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name={s.icon} size={14} color={C.inkMute} />
                  <Text style={{ fontSize: 16, fontWeight: '700', color: C.ink }}>{s.v}</Text>
                </View>
                <Text style={{ fontSize: 11, color: C.inkMute }}>{t(`profilePro.${s.labelKey}`)}</Text>
              </View>
            ))}
          </View>

          {/* Actions */}
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            <TouchableOpacity onPress={() => navigation.navigate('OrderMenu')} style={{ flex: 1, height: 40, backgroundColor: C.primary, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{t('profilePro.order')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert(t('profilePro.callComingSoon'))} style={{ height: 40, paddingHorizontal: 16, borderWidth: 1, borderColor: C.border, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Phone" size={18} color={C.inkSoft} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Alert.alert(t('profilePro.directionsComingSoon'))} style={{ height: 40, paddingHorizontal: 16, borderWidth: 1, borderColor: C.border, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="MapPin" size={18} color={C.inkSoft} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Revenue summary */}
        <TouchableOpacity onPress={() => navigation.navigate('ProDashboard')} style={{ marginHorizontal: 16, marginTop: 16, padding: 16, borderRadius: 18, backgroundColor: C.navy, marginBottom: 16 }} activeOpacity={0.9}>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>{t('profilePro.monthLabel')}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View>
              <Text style={{ color: '#fff', fontSize: 22, fontFamily: 'PlayfairDisplay-Bold' }}>195 400 XAF</Text>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>{t('profilePro.netRevenueDesc')}</Text>
            </View>
            <View style={{ backgroundColor: C.success, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 16, flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name="TrendingUp" size={12} color="#fff" />
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>+12%</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
          {TAB_KEYS.map((key, i) => (
            <TouchableOpacity key={key} onPress={() => setActiveTab(i)}
              style={{ flex: 1, paddingVertical: 12, borderBottomWidth: 2, borderColor: i === activeTab ? C.primary : 'transparent', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: i === activeTab ? '600' : '500', color: i === activeTab ? C.primary : C.inkMute }}>{t(`profilePro.${key}`)}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 0 && (
          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <Text style={{ fontSize: 14, color: C.ink, lineHeight: 22 }}>
              {t('profilePro.description')}
            </Text>
          </View>
        )}

        {activeTab === 1 && (
          <View style={{ paddingHorizontal: 16, paddingTop: 16, gap: 12 }}>
            {['Ndolé traditionnel · 4 500 XAF', 'Poulet DG · 5 500 XAF', 'Eru & Fufu · 4 000 XAF'].map((item, i) => (
              <TouchableOpacity key={i} onPress={() => navigation.navigate('RestaurantMenu')} style={{ flexDirection: 'row', gap: 12, alignItems: 'center', paddingBottom: 12, borderBottomWidth: 1, borderColor: C.border }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: C.surface2, borderWidth: 1, borderStyle: 'dashed', borderColor: C.border }} />
                <Text style={{ flex: 1, fontSize: 14, color: C.ink }}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === 2 && (
          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <Text style={{ fontSize: 14, color: C.inkMute }}>312 {t('profilePro.reviewsAvg')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 }}>
              {[1, 2, 3, 4, 5].map(s => <Icon key={s} name="Star" size={16} color={C.gold} fill={C.gold} />)}
              <Text style={{ fontSize: 16, fontWeight: '700', color: C.ink, marginLeft: 4 }}>4.8</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
