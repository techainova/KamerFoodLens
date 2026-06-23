import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import type { IconName } from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const PRO_ITEMS: { labelKey: string; icon: IconName; screen: string }[] = [
  { labelKey: 'settingsProActive.myRestaurant',    icon: 'ChefHat',     screen: 'RestaurantMenu' },
  { labelKey: 'settingsProActive.paymentMethods',  icon: 'CreditCard',  screen: 'ProPaymentSetup' },
  { labelKey: 'settingsProActive.myOrders',        icon: 'ShoppingBag', screen: 'ProOrders' },
  { labelKey: 'settingsProActive.statistics',      icon: 'BarChart2',   screen: 'ProAnalytics' },
];

export default function SettingsProActive() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();

  const handleCancelSubscription = () => {
    Alert.alert(
      t('settingsProActive.cancelConfirmTitle'),
      t('settingsProActive.cancelConfirmMsg'),
      [
        { text: t('settingsProActive.cancelConfirmCancel'), style: 'cancel' },
        { text: t('settingsProActive.cancelConfirmAction'), style: 'destructive', onPress: () => navigation.navigate('ProSubscription') },
      ],
    );
  };

  const handleLogout = () => {
    Alert.alert(
      t('settingsProActive.logoutConfirmTitle'),
      undefined,
      [
        { text: t('settingsProActive.logoutConfirmCancel'), style: 'cancel' },
        { text: t('settingsProActive.logoutConfirmAction'), style: 'destructive', onPress: () => navigation.navigate('Login') },
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
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('settingsProActive.title')}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

        {/* Pro active badge */}
        <View style={{ padding: 20, borderRadius: 24, backgroundColor: C.navy, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Icon name="Star" size={14} color={C.gold} fill={C.gold} />
            <View style={{ backgroundColor: C.gold, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{t('settingsProActive.proActiveBadge')}</Text>
            </View>
          </View>
          <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'PlayfairDisplay-Bold', marginBottom: 4 }}>Chez Mama Pauline</Text>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 16 }}>
            {t('settingsProActive.renewalNote', { date: '15 Jul 2026' })}
          </Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {[
              { v: '47',   l: t('settingsProActive.ordersThisMonth'), vColor: '#fff'  },
              { v: '195k', l: t('settingsProActive.revenueXaf'),       vColor: C.gold },
            ].map((s, i) => (
              <View key={i} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: s.vColor }}>{s.v}</Text>
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{s.l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pro settings */}
        <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingHorizontal: 4 }}>{t('settingsProActive.dashboardSection')}</Text>
        <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden', marginBottom: 16, ...SHADOW_SM }}>
          {PRO_ITEMS.map((item, i) => (
            <TouchableOpacity key={i} onPress={() => navigation.navigate(item.screen)} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: i < PRO_ITEMS.length - 1 ? 1 : 0, borderColor: C.border }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: C.navySoft, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={item.icon} size={16} color={C.navy} />
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: C.ink }}>{t(item.labelKey)}</Text>
              <Icon name="ChevronRight" size={16} color={C.inkMute} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Subscription mgmt */}
        <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingHorizontal: 4 }}>{t('settingsProActive.subscriptionSection')}</Text>
        <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden', marginBottom: 16, ...SHADOW_SM }}>
          <TouchableOpacity onPress={() => navigation.navigate('ProSubscription')} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderColor: C.border }}>
            <Text style={{ flex: 1, fontSize: 14, color: C.ink }}>{t('settingsProActive.billing')}</Text>
            <Icon name="ChevronRight" size={16} color={C.inkMute} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleCancelSubscription} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 }}>
            <Text style={{ flex: 1, fontSize: 14, color: C.error }}>{t('settingsProActive.cancelSubscription')}</Text>
            <Icon name="ChevronRight" size={16} color={C.error} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={handleLogout} style={{ height: 44, borderWidth: 1, borderColor: C.error, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, color: C.error }}>{t('settingsProActive.logout')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
