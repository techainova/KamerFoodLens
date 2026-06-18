// src/screens/pro/UpgradePro.tsx
// Page "Devenir Pro" — abonnement, avantages, plans tarifaires

import React, { useState } from 'react';
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.07,
  shadowRadius: 4,
  elevation: 2,
};

const SHADOW_MD = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.10,
  shadowRadius: 6,
  elevation: 4,
};

type FeatureItem = {
  icon: 'BarChart2' | 'ShoppingBag' | 'ChefHat' | 'MessageSquare' | 'Tag' | 'TrendingUp' | 'Award' | 'Headphones';
  title: string;
  sub: string;
};

const FEATURES: FeatureItem[] = [
  { icon: 'BarChart2',     title: 'Dashboard analytics',      sub: 'Vues, revenus, engagement en temps réel' },
  { icon: 'ShoppingBag',   title: 'Gestion des commandes',     sub: 'Panier, paiement, facture numérique QR' },
  { icon: 'ChefHat',       title: 'Menu digital interactif',   sub: 'Mise à jour instantanée, photos HD' },
  { icon: 'Award',         title: 'Module de formation',       sub: 'Monétisation directe, certificats KFL' },
  { icon: 'MessageSquare', title: 'Messagerie clients',        sub: 'Chat intégré, historique complet' },
  { icon: 'Tag',           title: 'Promos & offres spéciales', sub: 'Codes promo, réductions ciblées' },
  { icon: 'TrendingUp',    title: 'Statistiques avancées',     sub: 'Rapports exportables, benchmarks secteur' },
  { icon: 'Headphones',    title: 'Support prioritaire',       sub: 'Réponse < 4h, gestionnaire dédié' },
];

type PlanId = 'monthly' | 'yearly' | 'enterprise';

type Plan = {
  id: PlanId;
  label: string;
  price: string;
  period: string;
  savingsBadge?: string;
};

const PLANS: Plan[] = [
  { id: 'monthly',    label: 'Mensuel',    price: '3 000 XAF',  period: '/ mois' },
  { id: 'yearly',     label: 'Annuel',     price: '27 000 XAF', period: '/ an', savingsBadge: 'Économisez 25 %' },
  { id: 'enterprise', label: 'Entreprise', price: 'Sur devis',  period: '' },
];

export default function UpgradePro() {
  const C = useColors();
  const navigation = useNavigation<any>();

  const [selectedPlan, setSelectedPlan] = useState<PlanId>('yearly');

  const handleCTA = () => {
    navigation.navigate('MobileMoneyConfirm', {
      provider: 'MTN',
      amount: 3000,
      phone: '',
    });
  };

  const planBorderColor = (plan: Plan): string => {
    if (selectedPlan === plan.id) return C.gold;
    if (plan.id === 'yearly') return C.gold;
    return C.border;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }} edges={['bottom']}>
      <StatusBar barStyle="light-content" backgroundColor={C.navy} />

      {/* Header navy */}
      <View
        style={{
          backgroundColor: C.navy,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 16,
          paddingTop: 48,
          paddingBottom: 16,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityLabel="Retour"
          style={{
            width: 40,
            height: 40,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 20,
            backgroundColor: 'rgba(255,255,255,0.12)',
          }}
        >
          <Icon name="ArrowLeft" size={20} color="#FFFFFF" strokeWidth={2} />
        </TouchableOpacity>

        <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: '#FFFFFF' }}>
          Compte Pro
        </Text>

        <View style={{ backgroundColor: C.gold, borderRadius: 9999, paddingHorizontal: 10, paddingVertical: 4 }}>
          <Text style={{ fontFamily: 'Inter-Bold', fontSize: 11, color: '#FFFFFF', letterSpacing: 0.8 }}>
            PRO
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={{ alignItems: 'center', paddingHorizontal: 24, paddingTop: 32, paddingBottom: 24, backgroundColor: C.navySoft }}>
          <View
            style={{
              width: 80, height: 80, borderRadius: 40,
              backgroundColor: C.goldSoft,
              alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
              ...SHADOW_SM,
            }}
          >
            <Icon name="Star" size={40} color={C.gold} strokeWidth={1.5} />
          </View>

          <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 26, color: C.navy, textAlign: 'center', lineHeight: 34, marginBottom: 10 }}>
            Devenez acteur culinaire
          </Text>

          <Text style={{ fontFamily: 'Inter-Regular', fontSize: 15, color: C.inkSoft, textAlign: 'center', lineHeight: 22 }}>
            Restaurants, chefs et écoles de cuisine — touchez la communauté KFL et monétisez votre savoir-faire culinaire.
          </Text>
        </View>

        {/* Avantages */}
        <View style={{ paddingTop: 24, paddingBottom: 8 }}>
          <Text style={{ fontFamily: 'Inter-Bold', fontSize: 16, color: C.ink, paddingHorizontal: 16, marginBottom: 12 }}>
            Ce que vous débloquez
          </Text>

          {FEATURES.map((feature) => (
            <View
              key={feature.title}
              style={{
                flexDirection: 'row', alignItems: 'flex-start',
                paddingHorizontal: 16, paddingVertical: 12,
                borderBottomWidth: 1, borderBottomColor: C.border,
                gap: 12,
              }}
            >
              <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: C.goldSoft, alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon name={feature.icon} size={20} color={C.gold} strokeWidth={2} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ fontFamily: 'Inter-SemiBold', fontSize: 14, color: C.ink, marginBottom: 2 }}>
                  {feature.title}
                </Text>
                <Text style={{ fontFamily: 'Inter-Regular', fontSize: 13, color: C.inkMute, lineHeight: 18 }}>
                  {feature.sub}
                </Text>
              </View>

              <Icon name="Check" size={16} color={C.success} strokeWidth={2.5} />
            </View>
          ))}
        </View>

        {/* Plans */}
        <View style={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 8 }}>
          <Text style={{ fontFamily: 'Inter-Bold', fontSize: 16, color: C.ink, marginBottom: 14 }}>
            Choisissez votre plan
          </Text>

          {PLANS.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            const borderColor = planBorderColor(plan);
            const borderWidth = isSelected ? 2.5 : 1.5;
            const cardBg = isSelected ? C.goldSoft : C.surface;

            return (
              <TouchableOpacity
                key={plan.id}
                onPress={() => setSelectedPlan(plan.id)}
                accessibilityLabel={plan.label}
                activeOpacity={0.8}
                style={{
                  flexDirection: 'row', alignItems: 'center',
                  backgroundColor: cardBg,
                  borderRadius: 16, borderWidth, borderColor,
                  padding: 16, marginBottom: 12,
                  position: 'relative',
                  ...(isSelected ? SHADOW_MD : SHADOW_SM),
                }}
              >
                {plan.savingsBadge && (
                  <View
                    style={{
                      position: 'absolute', top: -10, right: 14,
                      backgroundColor: C.success,
                      borderRadius: 9999, paddingHorizontal: 10, paddingVertical: 3,
                    }}
                  >
                    <Text style={{ fontFamily: 'Inter-Bold', fontSize: 11, color: '#FFFFFF' }}>
                      {plan.savingsBadge}
                    </Text>
                  </View>
                )}

                <View
                  style={{
                    width: 22, height: 22, borderRadius: 11,
                    borderWidth: 2, borderColor: isSelected ? C.gold : C.border,
                    alignItems: 'center', justifyContent: 'center',
                    marginRight: 14,
                  }}
                >
                  {isSelected && (
                    <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: C.gold }} />
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: 'Inter-Bold', fontSize: 15, color: C.ink }}>
                    {plan.label}
                  </Text>
                  {plan.period ? (
                    <Text style={{ fontFamily: 'Inter-Regular', fontSize: 12, color: C.inkMute, marginTop: 2 }}>
                      {plan.period}
                    </Text>
                  ) : null}
                </View>

                <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 17, color: isSelected ? C.navy : C.ink }}>
                  {plan.price}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* CTA */}
        <View style={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 12 }}>
          <TouchableOpacity
            onPress={handleCTA}
            activeOpacity={0.85}
            accessibilityRole="button"
            accessibilityLabel="Démarrer l'essai gratuit 7 jours"
            style={{
              backgroundColor: C.primary,
              borderRadius: 9999, paddingVertical: 16,
              alignItems: 'center',
              ...SHADOW_MD,
            }}
          >
            <Text style={{ fontFamily: 'Inter-Bold', fontSize: 16, color: '#FFFFFF', letterSpacing: 0.2 }}>
              Démarrer l'essai gratuit 7 jours
            </Text>
          </TouchableOpacity>

          <Text style={{ fontFamily: 'Inter-Regular', fontSize: 13, color: C.inkMute, textAlign: 'center', marginTop: 10 }}>
            Sans engagement · Annulez à tout moment
          </Text>
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
