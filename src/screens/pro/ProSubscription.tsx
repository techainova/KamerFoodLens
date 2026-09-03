import React from 'react';
import {
  ScrollView, StatusBar, TouchableOpacity, View, ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { useColors } from '@/hooks/useAppTheme';
import Icon from '@/components/ui/Icon';
import { fontFamily, fontSize, radius, spacing } from '@/constants/theme';
import { SHADOW_SM } from '@/constants/theme';
import { proService } from '@/services/pro.service';

export default function ProSubscription() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();

  const { data, isLoading } = useQuery({
    queryKey: ['pro-subscription'],
    queryFn: () => proService.getSubscription(),
    staleTime: 5 * 60 * 1000,
  });

  const isActive = data?.status === 'active';
  const profile = data?.proProfile ?? null;

  const SUB_FEATURES = [
    t('pro.subFeature1'), t('pro.subFeature2'), t('pro.subFeature3'), t('pro.subFeature4'),
    t('pro.subFeature5'), t('pro.subFeature6'), t('pro.subFeature7'), t('pro.subFeature8'),
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }} edges={['top']}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border, ...SHADOW_SM }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: spacing.xs }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.lg, color: C.ink }}>{t('pro.subscriptionTitle')}</Text>
        <View style={{ width: 38 }} />
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.primary} size="large" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Status hero */}
          <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.md }}>
            <View style={{
              backgroundColor: isActive ? C.goldSoft : C.surface2,
              borderRadius: radius.lg, borderWidth: 1.5, borderColor: isActive ? C.gold : C.border,
              padding: spacing.lg, ...SHADOW_SM,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
                <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: isActive ? C.gold : C.inkMute, alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name="Star" size={22} color={C.surface} strokeWidth={2} />
                </View>
                <View style={{ backgroundColor: isActive ? C.gold : C.inkMute, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }}>
                  <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: C.surface, letterSpacing: 1 }}>
                    {isActive ? t('pro.activePlanBadge') : t('pro.inactiveBadge')}
                  </Text>
                </View>
              </View>
              <Text style={{ fontFamily: fontFamily.serifBold, fontSize: fontSize.xl, color: C.ink, marginBottom: 4 }}>
                {profile?.businessName ?? t('pro.proAccountTitle')}
              </Text>
              {isActive ? (
                <Text style={{ fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: C.inkSoft }}>{t('pro.subscriptionActiveDesc')}</Text>
              ) : (
                <Text style={{ fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: C.inkSoft }}>{t('pro.subscriptionInactiveDesc')}</Text>
              )}
            </View>
          </View>

          {/* Stats */}
          {profile && (
            <View style={{ flexDirection: 'row', paddingHorizontal: spacing.md, marginTop: spacing.md, gap: spacing.sm }}>
              <View style={{ flex: 1, backgroundColor: C.surface, borderRadius: radius.md, padding: spacing.sm, borderWidth: 1, borderColor: C.border, alignItems: 'center', ...SHADOW_SM }}>
                <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: C.gold, marginBottom: 2 }}>{profile.rating.toFixed(1)}</Text>
                <Text style={{ fontFamily: fontFamily.regular, fontSize: 10, color: C.inkMute, textAlign: 'center' }}>{t('proAnalytics.avgRating')}</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: C.surface, borderRadius: radius.md, padding: spacing.sm, borderWidth: 1, borderColor: C.border, alignItems: 'center', ...SHADOW_SM }}>
                <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: C.primary, marginBottom: 2 }}>{profile.totalOrders}</Text>
                <Text style={{ fontFamily: fontFamily.regular, fontSize: 10, color: C.inkMute, textAlign: 'center' }}>{t('pro.orders')}</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: C.surface, borderRadius: radius.md, padding: spacing.sm, borderWidth: 1, borderColor: C.border, alignItems: 'center', ...SHADOW_SM }}>
                <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: C.success, marginBottom: 2 }}>{profile.totalRevenueXAF.toLocaleString()}</Text>
                <Text style={{ fontFamily: fontFamily.regular, fontSize: 10, color: C.inkMute, textAlign: 'center' }}>XAF</Text>
              </View>
            </View>
          )}

          {/* Included features */}
          <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg, marginBottom: spacing.xxl }}>
            <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: C.ink, marginBottom: spacing.sm }}>{t('pro.includedFeatures')}</Text>
            <View style={{ backgroundColor: C.surface, borderRadius: radius.md, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
              {SUB_FEATURES.map((feature, i) => (
                <View key={feature} style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: C.border, gap: spacing.sm }}>
                  <View style={{ width: 28, height: 28, borderRadius: radius.sm, backgroundColor: isActive ? C.goldSoft : C.surface2, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon name="Check" size={14} color={isActive ? C.gold : C.inkMute} strokeWidth={2.5} />
                  </View>
                  <Text style={{ fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: isActive ? C.ink : C.inkMute, flex: 1 }}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
