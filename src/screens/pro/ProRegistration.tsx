// src/screens/pro/ProRegistration.tsx
import React, { useState } from 'react';
import {
  View, TextInput, ScrollView, TouchableOpacity, StatusBar, ActivityIndicator, Alert,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import { proService } from '@/services/pro.service';

const BUSINESS_TYPES = ['Restaurant', 'Food court', 'École hôtelière', 'Chef indépendant', 'Traiteur', 'Autre'];

export default function ProRegistration() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();

  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]!);
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = businessName.trim().length > 0 && phone.trim().length > 0 && address.trim().length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await proService.upgrade({
        businessName: businessName.trim(),
        businessType,
        phone: phone.trim(),
        address: address.trim(),
        description: description.trim() || undefined,
      });
      navigation.navigate('ProConfirmation', { businessName: businessName.trim() });
    } catch {
      Alert.alert(t('common.error'), t('proRegistration.submitError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('proRegistration.title')}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 13, color: C.inkSoft, lineHeight: 19, marginBottom: 20 }}>{t('proRegistration.intro')}</Text>

        <View style={{ gap: 14 }}>
          <FieldLabel C={C} text={t('proRegistration.businessName')} />
          <TextInput value={businessName} onChangeText={setBusinessName} placeholder="Chez Maman Pauline" placeholderTextColor={C.inkMute}
            style={{ height: 48, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, paddingHorizontal: 14, fontSize: 14, color: C.ink }} />

          <FieldLabel C={C} text={t('proRegistration.businessType')} />
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
            {BUSINESS_TYPES.map((type) => (
              <Chip key={type} label={type} active={type === businessType} onPress={() => setBusinessType(type)} C={C} />
            ))}
          </View>

          <FieldLabel C={C} text={t('proRegistration.businessPhone')} />
          <View style={{ flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, paddingHorizontal: 14, gap: 10 }}>
            <Icon name="Phone" size={16} color={C.inkMute} />
            <TextInput value={phone} onChangeText={setPhone} placeholder="+237 6XX XX XX XX" placeholderTextColor={C.inkMute} keyboardType="phone-pad" style={{ flex: 1, fontSize: 14, color: C.ink }} />
          </View>

          <FieldLabel C={C} text={t('proRegistration.address')} />
          <View style={{ flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, paddingHorizontal: 14, gap: 10 }}>
            <Icon name="MapPin" size={16} color={C.inkMute} />
            <TextInput value={address} onChangeText={setAddress} placeholder={t('proRegistration.addressPlaceholder')} placeholderTextColor={C.inkMute} style={{ flex: 1, fontSize: 14, color: C.ink }} />
          </View>

          <FieldLabel C={C} text={t('proRegistration.description')} />
          <TextInput value={description} onChangeText={setDescription} placeholder={t('proRegistration.descriptionPlaceholder')} placeholderTextColor={C.inkMute} multiline
            style={{ minHeight: 70, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, padding: 12, fontSize: 13, color: C.ink, textAlignVertical: 'top' }} />
        </View>

        <View style={{ flexDirection: 'row', gap: 10, padding: 12, borderRadius: 10, backgroundColor: 'rgba(232,89,26,0.06)', borderLeftWidth: 3, borderLeftColor: C.primary, marginTop: 20 }}>
          <Text style={{ fontSize: 11, color: C.inkSoft, lineHeight: 17, flex: 1, fontStyle: 'italic' }}>{t('proRegistration.reviewNote')}</Text>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: C.surface, borderTopWidth: 1, borderColor: C.border }}>
        <TouchableOpacity
          onPress={() => void handleSubmit()}
          disabled={!canSubmit || submitting}
          style={{ height: 50, borderRadius: 25, backgroundColor: canSubmit ? C.primary : C.border, alignItems: 'center', justifyContent: 'center' }}
        >
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>{t('proRegistration.submit')}</Text>}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function FieldLabel({ C, text }: { C: ReturnType<typeof useColors>; text: string }) {
  return <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkSoft, textTransform: 'uppercase', letterSpacing: 0.4 }}>{text}</Text>;
}

function Chip({ label, active, onPress, C }: { label: string; active: boolean; onPress: () => void; C: ReturnType<typeof useColors> }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ height: 32, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: active ? C.primary : C.surface, borderColor: active ? C.primary : C.border }}>
      <Text style={{ fontSize: 12, fontWeight: '600', color: active ? '#fff' : C.inkSoft }}>{label}</Text>
    </TouchableOpacity>
  );
}
