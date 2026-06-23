import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const METHODS = [
  { id: 'mtn',    label: 'MTN Mobile Money', subLabel: '+237 67 XX XX XX', color: '#F9A825' },
  { id: 'orange', label: 'Orange Money',      subLabel: '+237 69 XX XX XX', color: '#E8591A' },
];

export default function OrderPayment() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const [method, setMethod] = useState('mtn');
  const [phone, setPhone] = useState('');
  const total = 13000;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>Paiement commande</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>

        {/* Amount hero */}
        <View style={{ alignItems: 'center', paddingVertical: 24, marginBottom: 16 }}>
          <Text style={{ fontSize: 11, color: C.inkMute, textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 4 }}>Montant à payer</Text>
          <Text style={{ fontSize: 36, fontFamily: 'PlayfairDisplay-Bold', color: '#E8591A' }}>{total.toLocaleString()} XAF</Text>
          <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 4 }}>Commande #KFL-2026-4821</Text>
        </View>

        {/* Methods */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>Choisissez votre moyen de paiement</Text>
        <View style={{ gap: 10, marginBottom: 16 }}>
          {METHODS.map(m => (
            <TouchableOpacity key={m.id} onPress={() => setMethod(m.id)}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 18, borderWidth: 2, backgroundColor: method === m.id ? '#FEF3EC' : '#fff', borderColor: method === m.id ? '#E8591A' : '#E5E0D8', ...SHADOW_SM }}>
              <View style={{ width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: m.color + '20' }}>
                <Icon name="Smartphone" size={20} color={m.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: C.ink }}>{m.label}</Text>
                <Text style={{ fontSize: 12, color: C.inkMute }}>{m.subLabel}</Text>
              </View>
              <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center', borderColor: method === m.id ? '#E8591A' : '#E5E0D8' }}>
                {method === m.id && <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#E8591A' }} />}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Phone input */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>Numéro de téléphone</Text>
          <View style={{ height: 48, borderWidth: 1, borderColor: C.border, borderRadius: 16, backgroundColor: C.surface, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Icon name="Phone" size={16} color="#8C8278" />
            <TextInput value={phone} onChangeText={setPhone} placeholder="+237 6X XX XX XX" placeholderTextColor="#8C8278" keyboardType="phone-pad" style={{ flex: 1, fontSize: 14, color: C.ink }} />
          </View>
          <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 4 }}>Vous recevrez une notification de paiement.</Text>
        </View>

        {/* Security note */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon name="Lock" size={14} color="#2E7D32" />
          <Text style={{ fontSize: 12, color: C.inkMute }}>Paiement sécurisé AES-256-GCM</Text>
        </View>
      </ScrollView>

      <View style={{ paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        <TouchableOpacity style={{ height: 48, backgroundColor: '#E8591A', borderRadius: 24, alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.85}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Confirmer le paiement · {total.toLocaleString()} XAF</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
