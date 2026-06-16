import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const PRO_ITEMS: { l: string; icon: IconName }[] = [
  { l: 'Mon restaurant',     icon: 'ChefHat'     },
  { l: 'Modes de paiement',  icon: 'CreditCard'  },
  { l: 'Mes commandes',      icon: 'ShoppingBag' },
  { l: 'Statistiques',       icon: 'BarChart2'   },
];

export default function SettingsProActive() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Paramètres</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

        {/* Pro active badge */}
        <View style={{ padding: 20, borderRadius: 24, backgroundColor: '#1A237E', marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <Icon name="Star" size={14} color="#F9A825" fill="#F9A825" />
            <View style={{ backgroundColor: '#F9A825', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 }}>
              <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>PRO ACTIF</Text>
            </View>
          </View>
          <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'PlayfairDisplay-Bold', marginBottom: 4 }}>Chez Mama Pauline</Text>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginBottom: 16 }}>Abonnement Pro · Renouvellement le 15 Jul 2026</Text>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {[
              { v: '47',   l: 'Commandes ce mois', vColor: '#fff'     },
              { v: '195k', l: 'Revenus XAF',        vColor: '#F9A825' },
            ].map((s, i) => (
              <View key={i} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 12, alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '700', color: s.vColor }}>{s.v}</Text>
                <Text style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>{s.l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Pro settings */}
        <Text style={{ fontSize: 11, fontWeight: '600', color: '#8C8278', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingHorizontal: 4 }}>Dashboard Pro</Text>
        <View style={{ borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', overflow: 'hidden', marginBottom: 16, ...SHADOW_SM }}>
          {PRO_ITEMS.map((item, i) => (
            <TouchableOpacity key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: i < PRO_ITEMS.length - 1 ? 1 : 0, borderColor: '#F5F0EB' }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#E8EAF6', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={item.icon} size={16} color="#1A237E" />
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: '#2C1810' }}>{item.l}</Text>
              <Icon name="ChevronRight" size={16} color="#8C8278" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Subscription mgmt */}
        <Text style={{ fontSize: 11, fontWeight: '600', color: '#8C8278', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingHorizontal: 4 }}>Abonnement</Text>
        <View style={{ borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', overflow: 'hidden', marginBottom: 16, ...SHADOW_SM }}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderColor: '#F5F0EB' }}>
            <Text style={{ flex: 1, fontSize: 14, color: '#2C1810' }}>Facturation & Reçus</Text>
            <Icon name="ChevronRight" size={16} color="#8C8278" />
          </TouchableOpacity>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 }}>
            <Text style={{ flex: 1, fontSize: 14, color: '#C62828' }}>Annuler l'abonnement</Text>
            <Icon name="ChevronRight" size={16} color="#C62828" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={{ height: 44, borderWidth: 1, borderColor: 'rgba(198,40,40,0.3)', borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, color: '#C62828' }}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
