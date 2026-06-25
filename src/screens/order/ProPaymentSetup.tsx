import React, { useState } from 'react';
import {
  View, TextInput, ScrollView, TouchableOpacity, Switch, StatusBar,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

type MethodId = 'mtn' | 'orange' | 'card' | 'cash';

const METHODS: { id: MethodId; label: string; color: string; icon: string }[] = [
  { id: 'mtn',    label: 'MTN Mobile Money',      color: '#F9A825', icon: 'Smartphone' },
  { id: 'orange', label: 'Orange Money',           color: '#E8591A', icon: 'Smartphone' },
  { id: 'card',   label: 'Carte bancaire',         color: '#1A237E', icon: 'CreditCard' },
  { id: 'cash',   label: 'Paiement en espèces',   color: '#2E7D32', icon: 'DollarSign' },
];

export default function ProPaymentSetup() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const [mtnPhone, setMtnPhone] = useState('+237 67 00 00 00');
  const [orangePhone, setOrangePhone] = useState('+237 69 00 00 00');
  const [enabled, setEnabled] = useState<Record<MethodId, boolean>>({
    mtn: true, orange: true, card: false, cash: true,
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>Moyens de paiement</Text>
        <TouchableOpacity style={{ height: 32, paddingHorizontal: 14, backgroundColor: '#F9A825', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Enregistrer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

        {/* Info banner */}
        <View style={{ padding: 16, borderRadius: 18, backgroundColor: C.goldSoft, borderWidth: 1, borderColor: 'rgba(249,168,37,0.4)', marginBottom: 20, flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
          <Icon name="Settings" size={16} color="#F9A825" />
          <Text style={{ flex: 1, fontSize: 14, color: C.ink }}>Configurez les modes de paiement acceptés par votre restaurant.</Text>
        </View>

        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>Modes acceptés</Text>

        <View style={{ gap: 10, marginBottom: 20 }}>
          {METHODS.map((method) => (
            <View key={method.id} style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16 }}>
                <View style={{ width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center', backgroundColor: method.color + '20' }}>
                  <Icon name={method.icon as any} size={20} color={method.color} />
                </View>
                <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: C.ink }}>{method.label}</Text>
                <Switch
                  value={enabled[method.id]}
                  onValueChange={(val) => setEnabled(prev => ({ ...prev, [method.id]: val }))}
                  trackColor={{ false: '#E5E0D8', true: '#F9A825' }}
                  thumbColor="#fff"
                />
              </View>
              {enabled[method.id] && (method.id === 'mtn' || method.id === 'orange') && (
                <View style={{ paddingHorizontal: 16, paddingBottom: 16, borderTopWidth: 1, borderColor: C.border }}>
                  <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 8, marginBottom: 6 }}>Numéro de compte</Text>
                  <View style={{ height: 40, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 12, justifyContent: 'center' }}>
                    <TextInput
                      value={method.id === 'mtn' ? mtnPhone : orangePhone}
                      onChangeText={method.id === 'mtn' ? setMtnPhone : setOrangePhone}
                      style={{ fontSize: 14, color: C.ink }}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Commission info */}
        <View style={{ padding: 16, borderRadius: 18, backgroundColor: C.navySoft, borderWidth: 1, borderColor: 'rgba(26,35,126,0.2)' }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A237E', marginBottom: 4 }}>Commission KFL</Text>
          <Text style={{ fontSize: 14, color: C.inkSoft, lineHeight: 20 }}>
            KFL prélève une commission de{' '}
            <Text style={{ fontWeight: '700', color: '#1A237E' }}>5%</Text>
            {' '}sur chaque commande payée via la plateforme.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
