// src/screens/pro/ProSubscription.tsx
// Gestion d'abonnement Pro — v2.0

import React from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
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

const FEATURES = [
  'Commandes en ligne illimitées',
  'Page restaurant officielle',
  'Analytics & revenus en temps réel',
  'Gestion de menu avancée',
  'Support Pro prioritaire',
  'Billetterie événements',
  'Création de formations payantes',
  'Badge Pro vérifié',
];

const INVOICES = [
  { id: '1', month: 'Janvier 2026', amount: '27 000 XAF', status: 'Payé' },
  { id: '2', month: 'Février 2026', amount: '27 000 XAF', status: 'Payé' },
  { id: '3', month: 'Mars 2026',    amount: '27 000 XAF', status: 'Payé' },
];

export default function ProSubscription() {
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
          Mon Abonnement
        </Text>

        <View style={{ width: 38 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Active plan hero */}
        <View style={{ paddingHorizontal: spacing.md, paddingTop: spacing.md }}>
          <View
            style={{
              backgroundColor: C.goldSoft, borderRadius: radius.lg,
              borderWidth: 1.5, borderColor: C.gold, padding: spacing.lg,
              ...SHADOW_SM,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing.md }}>
              <View style={{ width: 44, height: 44, borderRadius: radius.md, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Star" size={22} color={C.surface} strokeWidth={2} />
              </View>
              <View style={{ backgroundColor: C.gold, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }}>
                <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: C.surface, letterSpacing: 1 }}>
                  ACTIF
                </Text>
              </View>
            </View>

            <Text style={{ fontFamily: fontFamily.serifBold, fontSize: fontSize.xl, color: C.ink, marginBottom: 4 }}>
              Plan Annuel Actif
            </Text>
            <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.h2, color: C.gold, marginBottom: 4 }}>
              27 000 XAF
              <Text style={{ fontFamily: fontFamily.regular, fontSize: fontSize.base, color: C.inkSoft }}> / an</Text>
            </Text>
            <Text style={{ fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: C.inkSoft, marginBottom: spacing.md }}>
              Actif jusqu'au 15 Juin 2027
            </Text>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.xs }}>
              {['Commandes illimitées', 'Analytics', 'Support Pro'].map((item) => (
                <View
                  key={item}
                  style={{
                    flexDirection: 'row', alignItems: 'center', gap: 4,
                    backgroundColor: C.surface, borderRadius: radius.full,
                    paddingHorizontal: spacing.sm, paddingVertical: spacing.xs,
                    borderWidth: 1, borderColor: C.gold,
                  }}
                >
                  <Icon name="Check" size={12} color={C.gold} strokeWidth={2.5} />
                  <Text style={{ fontFamily: fontFamily.medium, fontSize: fontSize.xs, color: C.ink }}>
                    {item}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={{ flexDirection: 'row', paddingHorizontal: spacing.md, marginTop: spacing.md, gap: spacing.sm }}>
          {[
            { label: 'Jours restants',   value: '365',        color: C.gold },
            { label: 'Écon. vs mensuel', value: '9 000 XAF',  color: C.success },
            { label: 'Commandes ce mois', value: '47',        color: C.primary },
          ].map((s) => (
            <View
              key={s.label}
              style={{ flex: 1, backgroundColor: C.surface, borderRadius: radius.md, padding: spacing.sm, borderWidth: 1, borderColor: C.border, alignItems: 'center', ...SHADOW_SM }}
            >
              <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: s.color, marginBottom: 2 }}>
                {s.value}
              </Text>
              <Text style={{ fontFamily: fontFamily.regular, fontSize: 10, color: C.inkMute, textAlign: 'center' }}>
                {s.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Fonctionnalités */}
        <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}>
          <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: C.ink, marginBottom: spacing.sm }}>
            Fonctionnalités incluses
          </Text>
          <View style={{ backgroundColor: C.surface, borderRadius: radius.md, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
            {FEATURES.map((feature, i) => (
              <View
                key={feature}
                style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: C.border, gap: spacing.sm }}
              >
                <View style={{ width: 28, height: 28, borderRadius: radius.sm, backgroundColor: C.goldSoft, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="Check" size={14} color={C.gold} strokeWidth={2.5} />
                </View>
                <Text style={{ fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: C.ink, flex: 1 }}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Modifier l'abonnement */}
        <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}>
          <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: C.ink, marginBottom: spacing.sm }}>
            Modifier mon abonnement
          </Text>
          <View style={{ backgroundColor: C.surface, borderRadius: radius.md, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.sm }} accessibilityLabel="Passer au plan mensuel">
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: C.ink }}>
                  Passer au mensuel
                </Text>
                <Text style={{ fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: C.inkMute, marginTop: 2 }}>
                  3 000 XAF / mois — plus coûteux sur l'année
                </Text>
              </View>
              <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: C.error }}>
                3 000 XAF
              </Text>
              <Icon name="ChevronRight" size={16} color={C.inkMute} />
            </TouchableOpacity>

            <View style={{ height: 1, backgroundColor: C.border, marginHorizontal: spacing.md }} />

            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.md, gap: spacing.sm }} accessibilityLabel="Offre entreprise">
              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: C.ink }}>
                  Offre Entreprise
                </Text>
                <Text style={{ fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: C.inkMute, marginTop: 2 }}>
                  Sur devis — pour les chaînes de restaurants
                </Text>
              </View>
              <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: C.navy }}>
                Devis
              </Text>
              <Icon name="ChevronRight" size={16} color={C.inkMute} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Facturation */}
        <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg }}>
          <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.md, color: C.ink, marginBottom: spacing.sm }}>
            Facturation
          </Text>
          <View style={{ backgroundColor: C.surface, borderRadius: radius.md, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
            {INVOICES.map((inv, i) => (
              <TouchableOpacity
                key={inv.id}
                style={{ flexDirection: 'row', alignItems: 'center', padding: spacing.md, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: C.border, gap: spacing.sm }}
                accessibilityLabel={`Facture ${inv.month}`}
              >
                <View style={{ width: 36, height: 36, borderRadius: radius.sm, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon name="FileText" size={18} color={C.inkSoft} strokeWidth={1.5} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.sm, color: C.ink }}>
                    {inv.month}
                  </Text>
                  <Text style={{ fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: C.inkMute, marginTop: 2 }}>
                    {inv.amount}
                  </Text>
                </View>
                <View style={{ backgroundColor: C.successSoft, borderRadius: radius.full, paddingHorizontal: spacing.sm, paddingVertical: spacing.xs }}>
                  <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: C.success }}>
                    {inv.status}
                  </Text>
                </View>
                <Icon name="ChevronRight" size={16} color={C.inkMute} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Annuler */}
        <View style={{ paddingHorizontal: spacing.md, marginTop: spacing.lg, marginBottom: spacing.xxl }}>
          <TouchableOpacity
            style={{
              borderRadius: radius.md, borderWidth: 1.5, borderColor: C.error,
              paddingVertical: spacing.md, alignItems: 'center',
              flexDirection: 'row', justifyContent: 'center', gap: spacing.sm,
              backgroundColor: C.surface,
            }}
            onPress={() =>
              Alert.alert(
                "Annuler l'abonnement",
                "Attention : vous perdrez l'accès à toutes les fonctionnalités Pro à la fin de la période en cours (15 Juin 2027). Cette action est irréversible.",
                [
                  { text: 'Conserver mon abonnement', style: 'cancel' },
                  { text: "Annuler l'abonnement", style: 'destructive', onPress: () => {} },
                ],
              )
            }
            accessibilityLabel="Annuler l'abonnement"
          >
            <Icon name="AlertTriangle" size={18} color={C.error} strokeWidth={2} />
            <Text style={{ fontFamily: fontFamily.bold, fontSize: fontSize.base, color: C.error }}>
              Annuler l'abonnement
            </Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
