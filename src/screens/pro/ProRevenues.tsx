import React, { useEffect, useState } from 'react';
import {
  Alert, ScrollView, StatusBar, TextInput, TouchableOpacity, View, ActivityIndicator,
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
import { proService, type ProPayout, type ProRevenueSummary } from '@/services/pro.service';

type Period = 'week' | 'month' | 'year';

const METHOD_LABELS: Record<string, string> = {
  cinetpay: 'CinetPay (Mobile Money)',
  stripe: 'Stripe (Carte)',
  wallet: 'Portefeuille KFL',
};

const METHOD_COLORS: Record<string, string> = {
  cinetpay: '#F9A825',
  stripe: '#1A237E',
  wallet: '#2E7D32',
};

function getPayoutStatusStyle(status: ProPayout['status'], C: ReturnType<typeof useColors>) {
  if (status === 'paid')     return { color: C.success, bg: C.successSoft };
  if (status === 'approved') return { color: C.navy,    bg: C.navySoft    };
  if (status === 'rejected') return { color: C.error,   bg: C.errorSoft   };
  return { color: C.gold, bg: C.goldSoft };
}

function buildBarHeights(data: ProRevenueSummary | undefined): number[] {
  if (!data?.revenueByDay?.length) return [];
  const max = Math.max(...data.revenueByDay.map(d => d.amount), 1);
  return data.revenueByDay.map(d => Math.round((d.amount / max) * 108) + 8);
}

export default function ProRevenues() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [period, setPeriod] = useState<Period>('month');
  const [showPayoutForm, setShowPayoutForm] = useState(false);
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutPhone, setPayoutPhone] = useState('');
  const [submittingPayout, setSubmittingPayout] = useState(false);

  const { data, isLoading } = useQuery<ProRevenueSummary>({
    queryKey: ['pro-revenues', period],
    queryFn: () => proService.getRevenues(period),
    staleTime: 5 * 60 * 1000,
  });

  const [payouts, setPayouts] = useState<ProPayout[]>([]);
  const [payoutsLoading, setPayoutsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setPayoutsLoading(true);
      try {
        const items = await proService.getPayouts();
        if (!cancelled) setPayouts(items);
      } finally {
        if (!cancelled) setPayoutsLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const barHeights = buildBarHeights(data);

  const handleRequestPayout = async () => {
    const amount = parseInt(payoutAmount, 10);
    if (!amount || amount <= 0 || !payoutPhone.trim()) return;
    setSubmittingPayout(true);
    try {
      await proService.requestPayout(amount, 'cinetpay', payoutPhone.trim());
      const items = await proService.getPayouts();
      setPayouts(items);
      setShowPayoutForm(false);
      setPayoutAmount('');
      setPayoutPhone('');
      Alert.alert(t('pro.payoutRequestTitle'), t('pro.payoutRequestSuccess'));
    } catch {
      Alert.alert(t('common.error'), t('pro.payoutRequestError'));
    } finally {
      setSubmittingPayout(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }} edges={['top']}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View
        style={{
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
          backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border,
          ...SHADOW_SM,
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: spacing.xs }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>

        <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.lg, color: C.ink }}>
          {t('pro.revenues')}
        </Text>

        <View style={{ flexDirection: 'row', gap: 4 }}>
          {(['week', 'month', 'year'] as Period[]).map(p => (
            <TouchableOpacity
              key={p}
              onPress={() => setPeriod(p)}
              style={{
                paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
                borderRadius: radius.sm,
                backgroundColor: p === period ? C.primary : C.surface2,
              }}
            >
              <Text style={{ fontFamily: fontFamily.medium, fontSize: fontSize.xs, color: p === period ? C.surface : C.inkSoft }}>
                {t(`pro.period${p.charAt(0).toUpperCase()}${p.slice(1)}`)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.primary} size="large" />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>

          {/* Hero card */}
          <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.md }}>
            <View style={{ backgroundColor: C.navy, borderRadius: radius.lg, padding: spacing.lg, ...SHADOW_SM }}>
              <Text style={{ fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: 'rgba(255,255,255,0.65)', marginBottom: 4 }}>
                {t('pro.totalPeriod', { period: t(`pro.period${period.charAt(0).toUpperCase()}${period.slice(1)}`) })}
              </Text>
              <Text style={{ fontFamily: fontFamily.serifBold, fontSize: fontSize.h2, color: C.surface }}>
                {(data?.totalXAF ?? 0).toLocaleString()} XAF
              </Text>

              <View
                style={{
                  flexDirection: 'row', marginTop: spacing.lg,
                  borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)',
                  paddingTop: spacing.md, gap: spacing.sm,
                }}
              >
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.base, color: C.surface }}>
                    {data?.ordersCount ?? 0}
                  </Text>
                  <Text style={{ fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
                    {t('pro.orders')}
                  </Text>
                </View>
                <View style={{ flex: 1, alignItems: 'center', borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.15)' }}>
                  <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.base, color: C.surface }}>
                    {data && data.ordersCount > 0 ? Math.round(data.totalXAF / data.ordersCount).toLocaleString() : '—'} XAF
                  </Text>
                  <Text style={{ fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>
                    {t('pro.avgCart')}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Bar chart */}
          {barHeights.length > 0 && (
            <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}>
              <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: C.ink, marginBottom: spacing.md }}>
                {t('pro.weeklyActivity')}
              </Text>
              <View style={{ backgroundColor: C.surface, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 136, paddingBottom: 4 }}>
                  {data!.revenueByDay.map((d, i) => (
                    <View key={d.date} style={{ alignItems: 'center', flex: 1 }}>
                      <View style={{ width: 18, height: barHeights[i] ?? 8, backgroundColor: C.primary, borderRadius: radius.sm }} />
                      <Text style={{ fontFamily: fontFamily.medium, fontSize: 9, color: C.inkMute, marginTop: 6 }}>
                        {new Date(d.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {/* Payment breakdown */}
          {(data?.paymentBreakdown?.length ?? 0) > 0 && (
            <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}>
              <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: C.ink, marginBottom: spacing.md }}>
                {t('pro.paymentBreakdown')}
              </Text>
              <View style={{ backgroundColor: C.surface, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
                {data!.paymentBreakdown.map((pm) => (
                  <View key={pm.method} style={{ marginBottom: spacing.md }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                      <Text style={{ fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: C.ink }}>
                        {METHOD_LABELS[pm.method] ?? pm.method}
                      </Text>
                      <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: METHOD_COLORS[pm.method] ?? C.inkMute }}>
                        {pm.pct}%
                      </Text>
                    </View>
                    <View style={{ height: 8, backgroundColor: C.surface2, borderRadius: radius.full, overflow: 'hidden' }}>
                      <View style={{ height: 8, width: `${pm.pct}%`, backgroundColor: METHOD_COLORS[pm.method] ?? C.inkMute, borderRadius: radius.full }} />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Payout history */}
          <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}>
            <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: C.ink, marginBottom: spacing.md }}>
              {t('pro.payoutHistory')}
            </Text>
            {payoutsLoading ? (
              <ActivityIndicator color={C.primary} />
            ) : payouts.length === 0 ? (
              <Text style={{ fontSize: 13, color: C.inkMute }}>{t('pro.noPayouts')}</Text>
            ) : (
              <View style={{ backgroundColor: C.surface, borderRadius: radius.md, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
                {payouts.map((p, i) => {
                  const st = getPayoutStatusStyle(p.status, C);
                  return (
                    <View
                      key={p.id}
                      style={{
                        flexDirection: 'row', alignItems: 'center', padding: spacing.md,
                        borderTopWidth: i > 0 ? 1 : 0, borderTopColor: C.border, gap: spacing.sm,
                      }}
                    >
                      <View style={{ width: 36, height: 36, borderRadius: radius.sm, backgroundColor: C.navySoft, alignItems: 'center', justifyContent: 'center' }}>
                        <Icon name="DollarSign" size={18} color={C.navy} strokeWidth={2} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: C.ink }}>
                          {p.amountXAF.toLocaleString()} XAF
                        </Text>
                        <Text style={{ fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: C.inkMute, marginTop: 2 }}>
                          {new Date(p.createdAt).toLocaleDateString()}
                        </Text>
                      </View>
                      <View style={{ backgroundColor: st.bg, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }}>
                        <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: st.color }}>
                          {t(`pro.payoutStatus_${p.status}`)}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>

          {/* Payout request form / CTA */}
          <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg, marginBottom: spacing.xxl }}>
            {showPayoutForm ? (
              <View style={{ backgroundColor: C.surface, borderRadius: radius.md, borderWidth: 1, borderColor: C.primary, padding: spacing.md, gap: 10 }}>
                <TextInput
                  value={payoutAmount}
                  onChangeText={setPayoutAmount}
                  placeholder={t('pro.payoutAmountPlaceholder')}
                  placeholderTextColor={C.inkMute}
                  keyboardType="numeric"
                  style={{ height: 42, borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingHorizontal: 12, fontSize: 14, color: C.ink }}
                />
                <TextInput
                  value={payoutPhone}
                  onChangeText={setPayoutPhone}
                  placeholder={t('pro.payoutPhonePlaceholder')}
                  placeholderTextColor={C.inkMute}
                  keyboardType="phone-pad"
                  style={{ height: 42, borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingHorizontal: 12, fontSize: 14, color: C.ink }}
                />
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <TouchableOpacity onPress={() => setShowPayoutForm(false)} style={{ flex: 1, height: 40, borderRadius: 10, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 13, fontWeight: '600', color: C.inkSoft }}>{t('common.cancel')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => void handleRequestPayout()}
                    disabled={submittingPayout}
                    style={{ flex: 1, height: 40, borderRadius: 10, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }}
                  >
                    {submittingPayout ? <ActivityIndicator color="#fff" /> : <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>{t('common.confirm')}</Text>}
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                style={{
                  backgroundColor: C.primary, borderRadius: radius.md, paddingVertical: spacing.md,
                  alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: spacing.sm,
                  ...SHADOW_SM,
                }}
                onPress={() => setShowPayoutForm(true)}
              >
                <Icon name="DollarSign" size={18} color={C.surface} strokeWidth={2.5} />
                <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.base, color: C.surface }}>
                  {t('pro.requestPayout')}
                </Text>
              </TouchableOpacity>
            )}
          </View>

        </ScrollView>
      )}
    </SafeAreaView>
  );
}
