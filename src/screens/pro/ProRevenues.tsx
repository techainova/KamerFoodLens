// src/screens/pro/ProRevenues.tsx
// Analytiques de revenus Pro — v2.0

import React from 'react';
import {
  Alert, ScrollView, StatusBar, TouchableOpacity, View,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useColors } from '@/hooks/useAppTheme';
import Icon from '@/components/ui/Icon';
import { fontFamily, fontSize, radius, spacing } from '@/constants/theme';

const SHADOW_SM = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.07,
  shadowRadius: 4,
  elevation: 2,
};

const BAR_DAYS = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const BAR_HEIGHTS = [48, 78, 54, 96, 66, 108, 36];
const BAR_ACTIVE_IDX = 5;

const PAYMENT_MODES = [
  { label: 'MTN Mobile Money', pct: 45, color: '#F9A825' },
  { label: 'Orange Money',     pct: 32, color: '#E8591A' },
  { label: 'Espèces',          pct: 15, color: '#2E7D32' },
  { label: 'Carte',            pct: 8,  color: '#E5E0D8' },
];

const PAYOUTS = [
  { id: '1', date: '01 Juin 2026', amount: '65 000 XAF', status: 'Effectué' },
  { id: '2', date: '15 Mai 2026',  amount: '72 000 XAF', status: 'Effectué' },
  { id: '3', date: '01 Juil 2026', amount: '58 400 XAF', status: 'Planifié' },
];

function payoutStatusColor(status: string, C: ReturnType<typeof useColors>): string {
  if (status === 'Effectué') return C.success;
  if (status === 'En cours') return C.gold;
  return C.inkMute;
}

function payoutStatusBg(status: string, C: ReturnType<typeof useColors>): string {
  if (status === 'Effectué') return C.successSoft;
  if (status === 'En cours') return C.goldSoft;
  return C.surface2;
}

export default function ProRevenues() {
  const navigation = useNavigation<any>();
  const C = useColors();

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
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: spacing.xs }} accessibilityLabel="Retour">
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>

        <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.lg, color: C.ink }}>
          Revenus
        </Text>

        <TouchableOpacity
          style={{
            flexDirection: 'row', alignItems: 'center', gap: 4,
            backgroundColor: C.surface2, borderRadius: radius.sm,
            paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
          }}
          accessibilityLabel="Sélectionner le mois"
        >
          <Text style={{ fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: C.ink }}>
            Juin 2026
          </Text>
          <Icon name="ChevronDown" size={14} color={C.inkSoft} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero card */}
        <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.md }}>
          <View style={{ backgroundColor: C.navy, borderRadius: radius.lg, padding: spacing.lg, ...SHADOW_SM }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: 'rgba(255,255,255,0.65)', marginBottom: 4 }}>
                  Total Juin 2026
                </Text>
                <Text style={{ fontFamily: fontFamily.serifBold, fontSize: fontSize.h2, color: C.surface }}>
                  195 400 XAF
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: C.successSoft, borderRadius: radius.full,
                  paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
                  flexDirection: 'row', alignItems: 'center', gap: 4,
                }}
              >
                <Icon name="TrendingUp" size={12} color={C.success} strokeWidth={2.5} />
                <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: C.success }}>
                  +12% vs mai
                </Text>
              </View>
            </View>

            <View
              style={{
                flexDirection: 'row', marginTop: spacing.lg,
                borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)',
                paddingTop: spacing.md, gap: spacing.sm,
              }}
            >
              {[
                { label: 'Commandes',    value: '47' },
                { label: 'Panier moy.',  value: '4 157 XAF' },
                { label: 'Taux accept.', value: '98%' },
              ].map((s, i) => (
                <View key={s.label} style={{ flex: 1, alignItems: 'center', borderRightWidth: i < 2 ? 1 : 0, borderRightColor: 'rgba(255,255,255,0.15)' }}>
                  <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.base, color: C.surface }}>
                    {s.value}
                  </Text>
                  <Text style={{ fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: 'rgba(255,255,255,0.55)', marginTop: 2, textAlign: 'center' }}>
                    {s.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Bar chart */}
        <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}>
          <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: C.ink, marginBottom: spacing.md }}>
            Activité de la semaine
          </Text>
          <View style={{ backgroundColor: C.surface, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', height: 136, paddingBottom: 28 }}>
              {BAR_DAYS.map((day, i) => {
                const isActive = i === BAR_ACTIVE_IDX;
                const barH = BAR_HEIGHTS[i];
                return (
                  <View key={`${day}-${i}`} style={{ alignItems: 'center', flex: 1 }}>
                    {isActive && (
                      <View style={{ backgroundColor: C.primary, borderRadius: radius.sm, paddingHorizontal: 5, paddingVertical: 2, marginBottom: 4 }}>
                        <Text style={{ fontFamily: fontFamily.bold, fontSize: 9, color: C.surface }}>34K</Text>
                      </View>
                    )}
                    <View style={{ width: 22, height: barH, backgroundColor: isActive ? C.primary : C.navySoft, borderRadius: radius.sm }} />
                    <Text style={{ fontFamily: fontFamily.medium, fontSize: fontSize.xs, color: isActive ? C.primary : C.inkMute, marginTop: 6 }}>
                      {day}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* Répartition paiement */}
        <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}>
          <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: C.ink, marginBottom: spacing.md }}>
            Répartition par mode de paiement
          </Text>
          <View style={{ backgroundColor: C.surface, borderRadius: radius.md, padding: spacing.md, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
            {PAYMENT_MODES.map((pm) => (
              <View key={pm.label} style={{ marginBottom: spacing.md }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: C.ink }}>
                    {pm.label}
                  </Text>
                  <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: pm.color === '#E5E0D8' ? C.inkMute : pm.color }}>
                    {pm.pct}%
                  </Text>
                </View>
                <View style={{ height: 8, backgroundColor: C.surface2, borderRadius: radius.full, overflow: 'hidden' }}>
                  <View style={{ height: 8, width: `${pm.pct}%`, backgroundColor: pm.color, borderRadius: radius.full }} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Historique des virements */}
        <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}>
          <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: C.ink, marginBottom: spacing.md }}>
            Historique des virements
          </Text>
          <View style={{ backgroundColor: C.surface, borderRadius: radius.md, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
            {PAYOUTS.map((p, i) => (
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
                    {p.amount}
                  </Text>
                  <Text style={{ fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: C.inkMute, marginTop: 2 }}>
                    {p.date}
                  </Text>
                </View>
                <View style={{ backgroundColor: payoutStatusBg(p.status, C), borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }}>
                  <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: payoutStatusColor(p.status, C) }}>
                    {p.status}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* CTA virement */}
        <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg, marginBottom: spacing.xxl }}>
          <TouchableOpacity
            style={{
              backgroundColor: C.primary, borderRadius: radius.md, paddingVertical: spacing.md,
              alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: spacing.sm,
              ...SHADOW_SM,
            }}
            onPress={() => {
              Alert.alert(
                'Demande de virement',
                'Votre demande sera traitée sous 24–48h ouvrées.',
                [
                  { text: 'Annuler', style: 'cancel' },
                  { text: 'Confirmer', onPress: () => navigation.navigate('AdminPayouts') },
                ],
              );
            }}
            accessibilityLabel="Demander un virement"
          >
            <Icon name="DollarSign" size={18} color={C.surface} strokeWidth={2.5} />
            <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.base, color: C.surface }}>
              Demander un virement
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
