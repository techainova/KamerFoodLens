import React, { useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, TextInput, StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { proService, type ProPromo, type ProRestaurant } from '@/services/pro.service';

type DiscountType = 'percent' | 'amount';
const DURATIONS = [3, 7, 14, 30];

function promoStatus(promo: ProPromo, C: ReturnType<typeof useColors>): { label: string; color: string; bg: string } {
  const now = Date.now();
  const from = new Date(promo.validFrom).getTime();
  const until = new Date(promo.validUntil).getTime();
  if (now < from) return { label: 'scheduled', color: C.navy, bg: C.navySoft };
  if (now > until) return { label: 'expired', color: C.inkMute, bg: C.surface2 };
  return { label: 'active', color: C.success, bg: C.successSoft };
}

export default function ProPromos() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [title, setTitle] = useState('');
  const [discountType, setDiscountType] = useState<DiscountType>('percent');
  const [discountValue, setDiscountValue] = useState('');
  const [duration, setDuration] = useState(7);
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { data: promos = [], isLoading } = useQuery<ProPromo[]>({
    queryKey: ['pro-promos'],
    queryFn: () => proService.getPromos(),
    staleTime: 60_000,
  });

  const { data: restaurants = [] } = useQuery<ProRestaurant[]>({
    queryKey: ['pro-restaurants'],
    queryFn: () => proService.getMyRestaurants(),
    staleTime: 5 * 60 * 1000,
  });

  const restaurantId = selectedRestaurantId ?? restaurants[0]?.id ?? null;

  const resetForm = () => {
    setTitle('');
    setDiscountValue('');
    setDiscountType('percent');
    setDuration(7);
    setShowCreateForm(false);
  };

  const handleCreate = async () => {
    const value = parseInt(discountValue, 10);
    if (!title.trim() || !value || value <= 0 || !restaurantId) return;
    if (discountType === 'percent' && value > 100) return;

    setSubmitting(true);
    try {
      const validFrom = new Date();
      const validUntil = new Date(validFrom.getTime() + duration * 24 * 60 * 60 * 1000);
      await proService.createPromo({
        restaurantId,
        title: title.trim(),
        discountPercent: discountType === 'percent' ? value : undefined,
        discountXAF: discountType === 'amount' ? value : undefined,
        validFrom: validFrom.toISOString(),
        validUntil: validUntil.toISOString(),
      });
      await queryClient.invalidateQueries({ queryKey: ['pro-promos'] });
      resetForm();
    } catch {
      Alert.alert(t('common.error'), t('proPromos.createError'));
    } finally {
      setSubmitting(false);
    }
  };

  const activeCount = promos.filter(p => promoStatus(p, C).label === 'active').length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('proPromos.title')}</Text>
        <TouchableOpacity
          onPress={() => setShowCreateForm(v => !v)}
          disabled={!restaurantId}
          style={{ height: 32, paddingHorizontal: 12, backgroundColor: restaurantId ? C.gold : C.surface2, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4 }}
        >
          <Icon name="Plus" size={12} color={restaurantId ? '#fff' : C.inkMute} />
          <Text style={{ color: restaurantId ? '#fff' : C.inkMute, fontSize: 12, fontWeight: '600' }}>{t('proPromos.create')}</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.primary} size="large" />
        </View>
      ) : (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

          {showCreateForm && (
            <View style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.gold, marginBottom: 16, gap: 10, ...SHADOW_SM }}>
              {restaurants.length > 1 && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {restaurants.map(r => (
                    <TouchableOpacity
                      key={r.id}
                      onPress={() => setSelectedRestaurantId(r.id)}
                      style={{
                        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14,
                        backgroundColor: restaurantId === r.id ? C.gold : C.surface2,
                        borderWidth: 1, borderColor: restaurantId === r.id ? C.gold : C.border,
                      }}
                    >
                      <Text style={{ fontSize: 12, fontWeight: '600', color: restaurantId === r.id ? '#fff' : C.inkSoft }}>{r.name}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder={t('proPromos.titlePlaceholder')}
                placeholderTextColor={C.inkMute}
                style={{ height: 42, borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingHorizontal: 12, fontSize: 14, color: C.ink, backgroundColor: C.surface2 }}
              />

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  onPress={() => setDiscountType('percent')}
                  style={{ flex: 1, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: discountType === 'percent' ? C.navy : C.surface2, borderWidth: 1, borderColor: discountType === 'percent' ? C.navy : C.border }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: discountType === 'percent' ? '#fff' : C.inkSoft }}>{t('proPromos.percentOff')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setDiscountType('amount')}
                  style={{ flex: 1, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: discountType === 'amount' ? C.navy : C.surface2, borderWidth: 1, borderColor: discountType === 'amount' ? C.navy : C.border }}
                >
                  <Text style={{ fontSize: 12, fontWeight: '600', color: discountType === 'amount' ? '#fff' : C.inkSoft }}>{t('proPromos.amountOff')}</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                value={discountValue}
                onChangeText={setDiscountValue}
                placeholder={discountType === 'percent' ? t('proPromos.percentPlaceholder') : t('proPromos.amountPlaceholder')}
                placeholderTextColor={C.inkMute}
                keyboardType="numeric"
                style={{ height: 42, borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingHorizontal: 12, fontSize: 14, color: C.ink, backgroundColor: C.surface2 }}
              />

              <Text style={{ fontSize: 12, color: C.inkMute }}>{t('proPromos.duration')}</Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {DURATIONS.map(d => (
                  <TouchableOpacity
                    key={d}
                    onPress={() => setDuration(d)}
                    style={{ flex: 1, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', backgroundColor: duration === d ? C.gold : C.surface2, borderWidth: 1, borderColor: duration === d ? C.gold : C.border }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '600', color: duration === d ? '#fff' : C.inkSoft }}>{t('proPromos.days', { count: d })}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={{ flexDirection: 'row', gap: 10 }}>
                <TouchableOpacity
                  onPress={resetForm}
                  style={{ flex: 1, height: 40, borderRadius: 10, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '600', color: C.inkSoft }}>{t('proPromos.cancel')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => void handleCreate()}
                  disabled={submitting}
                  style={{ flex: 1, height: 40, borderRadius: 10, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center' }}
                >
                  {submitting ? <ActivityIndicator color="#fff" /> : <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>{t('proPromos.confirm')}</Text>}
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Stats */}
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
            <View style={{ flex: 1, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 12, alignItems: 'center', ...SHADOW_SM }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: C.gold }}>{activeCount}</Text>
              <Text style={{ fontSize: 10, color: C.inkMute, textAlign: 'center', marginTop: 2 }}>{t('proPromos.activePromos')}</Text>
            </View>
            <View style={{ flex: 1, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 12, alignItems: 'center', ...SHADOW_SM }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: C.gold }}>{promos.length}</Text>
              <Text style={{ fontSize: 10, color: C.inkMute, textAlign: 'center', marginTop: 2 }}>{t('proPromos.total')}</Text>
            </View>
          </View>

          {/* Promo list */}
          <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>{t('proPromos.promoList')}</Text>

          {promos.length === 0 ? (
            <Text style={{ fontSize: 13, color: C.inkMute, textAlign: 'center', paddingVertical: 24 }}>{t('proPromos.empty')}</Text>
          ) : (
            <View style={{ gap: 12 }}>
              {promos.map((promo) => {
                const status = promoStatus(promo, C);
                return (
                  <View key={promo.id} style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 }}>
                        <View style={{ backgroundColor: C.navy, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                          <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>
                            {promo.discountPercent != null ? `-${promo.discountPercent}%` : `-${promo.discountXAF?.toLocaleString()} XAF`}
                          </Text>
                        </View>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink, flex: 1 }} numberOfLines={1}>{promo.title}</Text>
                      </View>
                      <View style={{ backgroundColor: status.bg, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 }}>
                        <Text style={{ fontSize: 10, fontWeight: '700', color: status.color }}>{t(`proPromos.status_${status.label}`)}</Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Icon name="Clock" size={12} color={C.inkMute} />
                      <Text style={{ fontSize: 12, color: C.inkMute }}>
                        {new Date(promo.validFrom).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                        {' – '}
                        {new Date(promo.validUntil).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
