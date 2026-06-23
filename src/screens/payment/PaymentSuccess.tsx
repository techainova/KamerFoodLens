import React from 'react';
import {
  View, Text, TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_MD = { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 6, elevation: 4 };

export default function PaymentSuccess() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const route = useRoute<any>();
  const total = route.params?.total ?? 14000;
  const ref = 'KFL-' + Math.floor(Math.random() * 90000 + 10000);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32 }}>

        {/* Success circle */}
        <View style={{ width: 110, height: 110, borderRadius: 55, backgroundColor: C.successSoft, borderWidth: 4, borderColor: '#2E7D32', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <Icon name="CheckCircle" size={52} color="#2E7D32" fill="none" />
        </View>

        <Text style={{ fontSize: 26, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 8, textAlign: 'center' }}>
          Paiement réussi !
        </Text>
        <Text style={{ fontSize: 15, color: C.inkSoft, textAlign: 'center', lineHeight: 22, marginBottom: 32 }}>
          Votre commande a été confirmée et est en cours de préparation.
        </Text>

        {/* Order details card */}
        <View style={{ width: '100%', backgroundColor: C.surface, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: C.border, marginBottom: 32, ...SHADOW_MD }}>
          {[
            { label: 'Référence', value: ref },
            { label: 'Montant payé', value: `${total.toLocaleString()} XAF` },
            { label: 'Méthode', value: 'MTN Mobile Money' },
            { label: 'Statut', value: 'Confirmé' },
          ].map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: i < 3 ? 1 : 0, borderColor: C.border }}>
              <Text style={{ fontSize: 13, color: C.inkMute }}>{item.label}</Text>
              <Text style={{ fontSize: 13, fontWeight: item.label === 'Statut' ? '700' : '600', color: item.label === 'Statut' ? '#2E7D32' : '#2C1810', fontFamily: item.label === 'Référence' ? 'JetBrainsMono-Regular' : 'Inter-SemiBold' }}>
                {item.value}
              </Text>
            </View>
          ))}
        </View>

        {/* CTAs */}
        <View style={{ width: '100%', gap: 12 }}>
          <TouchableOpacity
            style={{ height: 52, borderRadius: 16, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
            activeOpacity={0.85}
          >
            <Icon name="Navigation" size={18} color="#fff" />
            <Text style={{ fontSize: 15, fontWeight: '700', color: '#fff' }}>Suivre ma commande</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('HomeScreen')}
            style={{ height: 52, borderRadius: 16, borderWidth: 1.5, borderColor: C.border, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
            activeOpacity={0.85}
          >
            <Icon name="Home" size={18} color="#6D4C41" />
            <Text style={{ fontSize: 15, fontWeight: '600', color: C.inkSoft }}>Retour à l'accueil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
