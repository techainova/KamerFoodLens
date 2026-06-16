import React from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_MD = { shadowColor: '#F9A825', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 8 };

export default function ProConfirmation() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
      <StatusBar barStyle="dark-content" />

      {/* Star hero */}
      <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: '#FBF3DC', borderWidth: 4, borderColor: '#F9A825', alignItems: 'center', justifyContent: 'center', marginBottom: 20, ...SHADOW_MD }}>
        <Icon name="Star" size={44} color="#F9A825" fill="#F9A825" />
      </View>

      <Text style={{ fontSize: 24, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', textAlign: 'center', marginBottom: 6 }}>
        Bienvenue dans KFL Pro !
      </Text>
      <Text style={{ fontSize: 12, fontStyle: 'italic', color: '#8C8278', textAlign: 'center', marginBottom: 10 }}>Welcome to KFL Pro!</Text>
      <Text style={{ fontSize: 14, color: '#6D4C41', textAlign: 'center', lineHeight: 22, marginBottom: 32 }}>
        Votre compte Pro est actif. Commencez dès maintenant à gérer votre restaurant, vos cours et vos événements sur KmerFoodLens.
      </Text>

      {/* Summary card */}
      <View style={{ width: '100%', backgroundColor: '#fff', borderRadius: 18, padding: 16, borderWidth: 1, borderColor: '#E5E0D8', marginBottom: 24 }}>
        {[
          { l: 'Plan',          v: 'Pro Annuel',    green: false },
          { l: 'Prix',          v: '27 000 XAF/an', green: false },
          { l: 'Renouvellement',v: '15 Jun 2027',   green: false },
          { l: 'Statut',        v: 'Actif',         green: true  },
        ].map((row, i) => (
          <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: i < 3 ? 1 : 0, borderColor: '#F5F0EB' }}>
            <Text style={{ fontSize: 13, color: '#8C8278' }}>{row.l}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              {row.green && <Icon name="Check" size={12} color="#2E7D32" />}
              <Text style={{ fontSize: 13, fontWeight: '600', color: row.green ? '#2E7D32' : '#2C1810' }}>{row.v}</Text>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity
        onPress={() => navigation.navigate('ProDashboard')}
        style={{ width: '100%', height: 48, backgroundColor: '#F9A825', borderRadius: 24, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
        activeOpacity={0.85}
      >
        <Icon name="BarChart2" size={18} color="#fff" />
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>Accéder à mon Dashboard Pro</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
