import React from 'react';
import {
  ScrollView, StatusBar, TouchableOpacity, View,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM, SHADOW_MD } from '@/constants/theme';

export default function UpgradePro() {
  const C = useColors();
  const navigation = useNavigation<any>();
  const { t } = useTranslation();

  const FEATURES = [
    { icon: 'BarChart2',     title: t('pro.featureAnalytics'),  sub: t('pro.featureAnalyticsSub')  },
    { icon: 'ShoppingBag',   title: t('pro.featureOrders'),     sub: t('pro.featureOrdersSub')     },
    { icon: 'ChefHat',       title: t('pro.featureMenu'),       sub: t('pro.featureMenuSub')       },
    { icon: 'Award',         title: t('pro.featureCourses'),    sub: t('pro.featureCoursesSub')    },
    { icon: 'MessageSquare', title: t('pro.featureMessages'),   sub: t('pro.featureMessagesSub')   },
    { icon: 'Tag',           title: t('pro.featurePromos'),     sub: t('pro.featurePromosSub')     },
    { icon: 'TrendingUp',    title: t('pro.featureStats'),      sub: t('pro.featureStatsSub')      },
    { icon: 'Headphones',    title: t('pro.featureSupport'),    sub: t('pro.featureSupportSub')    },
  ] as const;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }} edges={['bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={C.navy} />

      {/* Header navy */}
      <View style={{ backgroundColor: C.navy, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 48, paddingBottom: 16 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 40, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.12)' }}>
          <Icon name="ArrowLeft" size={20} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>
        <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: '#FFFFFF' }}>{t('pro.proAccountTitle')}</Text>
        <View style={{ backgroundColor: C.gold, borderRadius: 9999, paddingHorizontal: 10, paddingVertical: 4 }}>
          <Text style={{ fontFamily: 'Inter-Bold', fontSize: 11, color: '#FFFFFF', letterSpacing: 0.8 }}>{t('pro.badge')}</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={{ alignItems: 'center', paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24, backgroundColor: C.navySoft }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: C.goldSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 16, ...SHADOW_SM }}>
            <Icon name="Star" size={40} color={C.gold} strokeWidth={1.5} />
          </View>
          <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 26, color: C.navy, textAlign: 'center', lineHeight: 34, marginBottom: 10 }}>{t('pro.upgradeHeroTitle')}</Text>
          <Text style={{ fontFamily: 'Inter-Regular', fontSize: 15, color: C.inkSoft, textAlign: 'center', lineHeight: 22 }}>{t('pro.upgradeHeroDesc')}</Text>
        </View>

        {/* Features */}
        <View style={{ paddingTop: 24, paddingBottom: 8 }}>
          <Text style={{ fontFamily: 'Inter-Bold', fontSize: 16, color: C.ink, paddingHorizontal: 16, marginBottom: 12 }}>{t('pro.unlockFeatures')}</Text>
          {FEATURES.map((feature) => (
            <View key={feature.title} style={{ flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border, gap: 12 }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: C.goldSoft, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={feature.icon as any} size={20} color={C.gold} strokeWidth={2} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 14, color: C.ink, marginBottom: 2 }}>{feature.title}</Text>
                <Text style={{ fontFamily: 'Inter-Regular', fontSize: 13, color: C.inkMute, lineHeight: 18 }}>{feature.sub}</Text>
              </View>
              <Icon name="Check" size={16} color={C.success} strokeWidth={2.5} />
            </View>
          ))}
        </View>

        {/* CTA */}
        <View style={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 12 }}>
          <TouchableOpacity onPress={() => navigation.navigate('ProRegistration')} activeOpacity={0.85} style={{ backgroundColor: C.primary, borderRadius: 9999, paddingVertical: 16, alignItems: 'center', ...SHADOW_MD }}>
            <Text style={{ fontFamily: 'Inter-Bold', fontSize: 16, color: '#FFFFFF', letterSpacing: 0.2 }}>{t('pro.continueSignup')}</Text>
          </TouchableOpacity>
          <Text style={{ fontFamily: 'Inter-Regular', fontSize: 13, color: C.inkMute, textAlign: 'center', marginTop: 10 }}>{t('pro.activationNote')}</Text>
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
