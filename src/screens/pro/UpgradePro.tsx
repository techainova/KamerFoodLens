import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const PLANS = [
  { id: 'monthly', label: 'Mensuel', price: '3 000',  period: '/mois', popular: false, badge: null       },
  { id: 'annual',  label: 'Annuel',  price: '27 000', period: '/an',   popular: true,  badge: '−25%' },
];

const FEATURES = [
  'Dashboard Pro avec analytics',
  'Commandes en ligne illimitées',
  'Gestion menu restaurant',
  'Messagerie clients',
  'Promotions & campagnes',
  'Formations & ateliers',
  'Badge certifié KFL Pro',
  'Support prioritaire 24/7',
];

export default function UpgradePro() {
  const navigation = useNavigation<any>();
  const [selectedPlan, setSelectedPlan] = useState('annual');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Passer à Pro</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <View style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: '#FBF3DC', borderWidth: 2, borderColor: '#F9A825', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Icon name="Star" size={30} color="#F9A825" fill="#F9A825" />
          </View>
          <Text style={{ fontSize: 22, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', textAlign: 'center' }}>KmerFoodLens Pro</Text>
          <Text style={{ fontSize: 14, color: '#8C8278', textAlign: 'center', marginTop: 4 }}>Développez votre activité culinaire au Cameroun</Text>
        </View>

        {/* Plans */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          {PLANS.map((plan) => (
            <TouchableOpacity
              key={plan.id}
              onPress={() => setSelectedPlan(plan.id)}
              style={{ flex: 1, padding: 16, borderRadius: 18, borderWidth: 2, borderColor: selectedPlan === plan.id ? '#F9A825' : '#E5E0D8', backgroundColor: selectedPlan === plan.id ? '#FBF3DC' : '#fff', overflow: 'hidden' }}
              activeOpacity={0.85}
            >
              {plan.badge && (
                <View style={{ position: 'absolute', top: 0, right: 0, backgroundColor: '#F9A825', paddingHorizontal: 8, paddingVertical: 3, borderBottomLeftRadius: 10 }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{plan.badge}</Text>
                </View>
              )}
              <Text style={{ fontSize: 13, fontWeight: '600', color: selectedPlan === plan.id ? '#F9A825' : '#8C8278', marginBottom: 4 }}>{plan.label}</Text>
              <Text style={{ fontSize: 24, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810' }}>{plan.price}</Text>
              <Text style={{ fontSize: 11, color: '#8C8278' }}>XAF {plan.period}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Features */}
        <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E5E0D8', marginBottom: 20, ...SHADOW_SM }}>
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#2C1810', marginBottom: 12 }}>Ce qui est inclus</Text>
          {FEATURES.map((feat, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 8, borderBottomWidth: i < FEATURES.length - 1 ? 1 : 0, borderColor: '#F5F0EB' }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: '#E3F0E4', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Check" size={11} color="#2E7D32" />
              </View>
              <Text style={{ fontSize: 14, color: '#2C1810' }}>{feat}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ProConfirmation')}
          style={{ height: 52, backgroundColor: '#F9A825', borderRadius: 26, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 10 }}
          activeOpacity={0.85}
        >
          <Icon name="Star" size={18} color="#fff" fill="#fff" />
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
            Activer KFL Pro · {selectedPlan === 'annual' ? '27 000' : '3 000'} XAF/{selectedPlan === 'annual' ? 'an' : 'mois'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
