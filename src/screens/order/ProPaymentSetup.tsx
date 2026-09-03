import React, { useEffect, useState } from 'react';
import {
  View, TextInput, ScrollView, TouchableOpacity, Switch, StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { SHADOW_SM } from '@/constants/theme';
import { proService } from '@/services/pro.service';

type MethodId = 'mtn' | 'orange' | 'card' | 'cash';

export default function ProPaymentSetup() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [mtnPhone, setMtnPhone] = useState('');
  const [orangePhone, setOrangePhone] = useState('');
  const [enabled, setEnabled] = useState<Record<MethodId, boolean>>({
    mtn: false, orange: false, card: false, cash: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const methods = await proService.getPaymentMethods();
        setMtnPhone(methods.mtnPhone ?? '');
        setOrangePhone(methods.orangePhone ?? '');
        setEnabled({
          mtn: methods.acceptsMtn, orange: methods.acceptsOrange,
          card: methods.acceptsCard, cash: methods.acceptsCash,
        });
      } catch {
        // Not a Pro user yet, or request failed — keep the empty defaults above.
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await proService.updatePaymentMethods({
        acceptsMtn: enabled.mtn,
        acceptsOrange: enabled.orange,
        acceptsCard: enabled.card,
        acceptsCash: enabled.cash,
        mtnPhone: mtnPhone || undefined,
        orangePhone: orangePhone || undefined,
      });
      Alert.alert(t('common.saved', 'Enregistré'), t('pro.paymentMethodsSaved', 'Vos moyens de paiement ont été mis à jour.'));
    } catch {
      Alert.alert(t('common.error', 'Erreur'), t('pro.paymentMethodsSaveFailed', 'Impossible d\'enregistrer pour le moment. Réessayez plus tard.'));
    } finally {
      setSaving(false);
    }
  };

  const METHODS: { id: MethodId; label: string; color: string; icon: string }[] = [
    { id: 'mtn',    label: 'MTN Mobile Money',    color: '#F9A825', icon: 'Smartphone' },
    { id: 'orange', label: 'Orange Money',         color: '#E8591A', icon: 'Smartphone' },
    { id: 'card',   label: t('payment.card'),      color: '#1A237E', icon: 'CreditCard' },
    { id: 'cash',   label: t('payment.cash'),      color: '#2E7D32', icon: 'DollarSign' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('pro.paymentMethods')}</Text>
        <TouchableOpacity
          onPress={handleSave}
          disabled={saving || loading}
          style={{ height: 32, paddingHorizontal: 14, backgroundColor: '#F9A825', borderRadius: 16, alignItems: 'center', justifyContent: 'center', opacity: saving || loading ? 0.6 : 1 }}
        >
          {saving ? <ActivityIndicator size="small" color="#fff" /> : <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{t('common.save')}</Text>}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={C.primary} />
        </View>
      ) : (
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

        {/* Info banner */}
        <View style={{ padding: 16, borderRadius: 18, backgroundColor: C.goldSoft, borderWidth: 1, borderColor: 'rgba(249,168,37,0.4)', marginBottom: 20, flexDirection: 'row', alignItems: 'flex-start', gap: 10 }}>
          <Icon name="Settings" size={16} color="#F9A825" />
          <Text style={{ flex: 1, fontSize: 14, color: C.ink }}>{t('pro.configurePayments')}</Text>
        </View>

        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>{t('pro.acceptedModes')}</Text>

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
                  <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 8, marginBottom: 6 }}>{t('pro.accountNumber')}</Text>
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
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#1A237E', marginBottom: 4 }}>{t('pro.kflCommission')}</Text>
          <Text style={{ fontSize: 14, color: C.inkSoft, lineHeight: 20 }}>{t('pro.commissionDesc')}</Text>
        </View>
      </ScrollView>
      )}
    </SafeAreaView>
  );
}
