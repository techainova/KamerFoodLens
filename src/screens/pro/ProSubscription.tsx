import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const FEATURES = [
  'Scanner illimité',
  'Dashboard Pro complet',
  'Gestion de commandes',
  'Analytics avancées',
  'Formations & cours',
  'Évènements & tombola',
  'Support prioritaire',
];

const INVOICES = [
  { date: '01 Jan 2026', amount: '9 900 XAF', status: 'Payée' },
  { date: '01 Déc 2025', amount: '9 900 XAF', status: 'Payée' },
  { date: '01 Nov 2025', amount: '9 900 XAF', status: 'Payée' },
];

export default function ProSubscription() {
  const navigation = useNavigation<any>();
  const [showCancel, setShowCancel] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Mon abonnement Pro</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Active plan card */}
        <View style={{ padding: 20, borderRadius: 20, backgroundColor: '#1A237E', marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <View>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.8 }}>Plan actuel</Text>
              <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'PlayfairDisplay-Bold', marginTop: 2 }}>KFL Pro Mensuel</Text>
            </View>
            <View style={{ backgroundColor: '#F9A825', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 }}>
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>ACTIF</Text>
            </View>
          </View>
          <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: 12 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {[
              { l: 'Prochain débit', v: '01 Fév 2026' },
              { l: 'Montant', v: '9 900 XAF/mois' },
              { l: 'Paiement', v: 'MTN MoMo' },
            ].map((item, i) => (
              <View key={i}>
                <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>{item.l}</Text>
                <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600', marginTop: 2 }}>{item.v}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Features */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', marginBottom: 12 }}>Inclus dans votre plan</Text>
        <View style={{ padding: 4, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', marginBottom: 20, ...SHADOW_SM }}>
          {FEATURES.map((f, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: i < FEATURES.length - 1 ? 1 : 0, borderColor: '#F5F0EB' }}>
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: '#E3F0E4', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Check" size={12} color="#2E7D32" />
              </View>
              <Text style={{ fontSize: 14, color: '#2C1810' }}>{f}</Text>
            </View>
          ))}
        </View>

        {/* Upgrade to annual */}
        <View style={{ padding: 16, borderRadius: 18, backgroundColor: '#FBF3DC', borderWidth: 1, borderColor: 'rgba(249,168,37,0.3)', marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Icon name="Star" size={18} color="#F9A825" fill="#F9A825" />
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#2C1810' }}>Passer à l'annuel — économisez 25%</Text>
          </View>
          <Text style={{ fontSize: 12, color: '#6D4C41', marginBottom: 12 }}>Payez 89 100 XAF/an au lieu de 118 800 XAF</Text>
          <TouchableOpacity style={{ height: 40, backgroundColor: '#F9A825', borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700' }}>Changer de plan</Text>
          </TouchableOpacity>
        </View>

        {/* Invoices */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', marginBottom: 12 }}>Historique de paiements</Text>
        <View style={{ borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', overflow: 'hidden', marginBottom: 20, ...SHADOW_SM }}>
          {INVOICES.map((inv, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: i < INVOICES.length - 1 ? 1 : 0, borderColor: '#F5F0EB' }}>
              <Text style={{ flex: 1, fontSize: 14, color: '#2C1810' }}>{inv.date}</Text>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#2C1810', marginRight: 12 }}>{inv.amount}</Text>
              <View style={{ backgroundColor: '#E3F0E4', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
                <Text style={{ fontSize: 11, fontWeight: '600', color: '#2E7D32' }}>{inv.status}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Cancel */}
        <TouchableOpacity onPress={() => setShowCancel(!showCancel)} style={{ height: 44, borderWidth: 1, borderColor: 'rgba(198,40,40,0.3)', borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, color: '#C62828' }}>Annuler l'abonnement</Text>
        </TouchableOpacity>
        {showCancel && (
          <View style={{ marginTop: 12, padding: 16, borderRadius: 18, backgroundColor: '#FBDCDC', borderWidth: 1, borderColor: 'rgba(198,40,40,0.2)' }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#C62828', marginBottom: 4 }}>Confirmer l'annulation ?</Text>
            <Text style={{ fontSize: 12, color: 'rgba(198,40,40,0.8)', marginBottom: 12 }}>Votre accès Pro prendra fin le 01 Fév 2026. Vous ne serez plus débité.</Text>
            <TouchableOpacity style={{ height: 36, backgroundColor: '#C62828', borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>Oui, annuler</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
