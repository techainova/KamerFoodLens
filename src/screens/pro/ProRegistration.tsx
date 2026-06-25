// src/screens/pro/ProRegistration.tsx
// PRO-INS — Inscription établissement Pro en 5 étapes :
// Infos -> Localisation -> Menu -> Plan -> Aperçu, puis paiement.

import React, { useState } from 'react';
import {
  View, TextInput, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

type MenuMode = 'daily' | 'weekly' | 'monthly';
type PlanId = 'monthly' | 'yearly' | 'enterprise';

const BUSINESS_TYPES = ['Restaurant', 'Food court', 'École hôtelière', 'Chef indépendant', 'Traiteur', 'Autre'];
const REGIONS = ['Centre', 'Littoral', 'Ouest', 'Sud-Ouest', 'Nord-Ouest', 'Adamaoua', 'Nord', 'Extrême-Nord', 'Est', 'Sud'];
const CATEGORIES = ['Entrées', 'Plats principaux', 'Soupes', 'Grillades', 'Boissons', 'Desserts', 'Végétarien', 'Spécialités régionales'];
const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

const PLANS: { id: PlanId; price: string; amount: number | null; period: string }[] = [
  { id: 'monthly',    price: '3 000 XAF',  amount: 3000,  period: '/ mois' },
  { id: 'yearly',     price: '27 000 XAF', amount: 27000, period: '/ an' },
  { id: 'enterprise', price: 'Sur devis',  amount: null,  period: '' },
];

export default function ProRegistration() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();

  const [step, setStep] = useState(0);
  const STEPS = [t('proRegistration.stepInfo'), t('proRegistration.stepLocation'), t('proRegistration.stepMenu'), t('proRegistration.stepPlan'), t('proRegistration.stepPreview')];

  // Step 0 — Infos
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState(BUSINESS_TYPES[0]);
  const [phone, setPhone] = useState('');
  const [description, setDescription] = useState('');

  // Step 1 — Localisation
  const [address, setAddress] = useState('');
  const [region, setRegion] = useState(REGIONS[1]);

  // Step 2 — Menu
  const [menuMode, setMenuMode] = useState<MenuMode>('weekly');
  const [categories, setCategories] = useState<string[]>(['Plats principaux']);
  const toggleCategory = (c: string) => setCategories((prev) => prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]);

  // Step 3 — Plan
  const [selectedPlan, setSelectedPlan] = useState<PlanId>('yearly');

  const canProceed = () => {
    if (step === 0) return businessName.trim().length > 0;
    if (step === 1) return address.trim().length > 0;
    return true;
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else handleFinish();
  };
  const handleBack = () => {
    if (step > 0) setStep(step - 1);
    else navigation.goBack();
  };

  const handleFinish = () => {
    const plan = PLANS.find((p) => p.id === selectedPlan)!;
    if (plan.amount === null) {
      navigation.navigate('ProConfirmation');
      return;
    }
    navigation.navigate('Payment', {
      purpose: 'pro-upgrade',
      amount: plan.amount,
      label: `${businessName} · ${t(`proRegistration.plan_${plan.id}`)}`,
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={handleBack} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('proRegistration.title')}</Text>
      </View>

      {/* Stepper */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 16, paddingVertical: 12, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        {STEPS.map((label, i) => (
          <View key={label} style={{ flex: 1, alignItems: 'center' }}>
            <View style={{
              width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
              backgroundColor: i < step ? C.success : i === step ? C.primary : C.surface2,
            }}>
              {i < step ? (
                <Icon name="Check" size={12} color="#fff" />
              ) : (
                <Text style={{ fontSize: 11, fontWeight: '700', color: i === step ? '#fff' : C.inkMute }}>{i + 1}</Text>
              )}
            </View>
            <Text style={{ fontSize: 9, fontWeight: '600', color: i === step ? C.primary : C.inkMute, marginTop: 3, textAlign: 'center' }} numberOfLines={1}>{label}</Text>
          </View>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Step 0 — Infos */}
        {step === 0 && (
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

            <FieldLabel C={C} text={t('proRegistration.description')} />
            <TextInput value={description} onChangeText={setDescription} placeholder={t('proRegistration.descriptionPlaceholder')} placeholderTextColor={C.inkMute} multiline
              style={{ minHeight: 70, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, padding: 12, fontSize: 13, color: C.ink, textAlignVertical: 'top' }} />
          </View>
        )}

        {/* Step 1 — Localisation */}
        {step === 1 && (
          <View style={{ gap: 14 }}>
            <FieldLabel C={C} text={t('proRegistration.address')} />
            <View style={{ flexDirection: 'row', alignItems: 'center', height: 48, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, paddingHorizontal: 14, gap: 10 }}>
              <Icon name="MapPin" size={16} color={C.inkMute} />
              <TextInput value={address} onChangeText={setAddress} placeholder={t('proRegistration.addressPlaceholder')} placeholderTextColor={C.inkMute} style={{ flex: 1, fontSize: 14, color: C.ink }} />
            </View>

            <FieldLabel C={C} text={t('proRegistration.region')} />
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {REGIONS.map((r) => (
                  <Chip key={r} label={r} active={r === region} onPress={() => setRegion(r)} C={C} />
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Step 2 — Menu */}
        {step === 2 && (
          <View style={{ gap: 14 }}>
            <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 17, color: C.ink }}>{t('proRegistration.menuQuestion')}</Text>
            <View style={{ gap: 8 }}>
              {([
                { mode: 'daily' as MenuMode, emoji: '📅', label: t('proRegistration.menuDaily'), desc: t('proRegistration.menuDailyDesc') },
                { mode: 'weekly' as MenuMode, emoji: '📆', label: t('proRegistration.menuWeekly'), desc: t('proRegistration.menuWeeklyDesc') },
                { mode: 'monthly' as MenuMode, emoji: '🗓', label: t('proRegistration.menuMonthly'), desc: t('proRegistration.menuMonthlyDesc') },
              ]).map((m) => {
                const active = menuMode === m.mode;
                return (
                  <TouchableOpacity key={m.mode} onPress={() => setMenuMode(m.mode)}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 12, padding: 12, borderRadius: 12, borderWidth: active ? 1.5 : 1, borderColor: active ? C.primary : C.border, backgroundColor: active ? C.goldSoft : C.surface }}>
                    <Radio active={active} C={C} />
                    <Text style={{ fontSize: 20 }}>{m.emoji}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: '700', fontSize: 13, color: C.ink }}>{m.label}</Text>
                      <Text style={{ fontSize: 11, color: C.inkMute }}>{m.desc}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            {menuMode === 'weekly' && (
              <View style={{ marginTop: 4, gap: 6 }}>
                {DAYS.map((d) => (
                  <View key={d} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10, borderRadius: 10, backgroundColor: C.surface2 }}>
                    <Text style={{ fontWeight: '700', fontSize: 13, color: C.ink }}>{t(`proRegistration.day_${d}`)}</Text>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('RestaurantMenuEdit', {})}
                      style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: C.primary, alignItems: 'center', justifyContent: 'center' }}
                    >
                      <Icon name="Plus" size={14} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}

            <FieldLabel C={C} text={t('proRegistration.categories')} />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {CATEGORIES.map((c) => (
                <Chip key={c} label={c} active={categories.includes(c)} onPress={() => toggleCategory(c)} C={C} />
              ))}
            </View>

            <View style={{ flexDirection: 'row', gap: 10, padding: 10, borderRadius: 10, backgroundColor: 'rgba(232,89,26,0.06)', borderLeftWidth: 3, borderLeftColor: C.primary }}>
              <Text style={{ fontSize: 11, color: C.inkSoft, lineHeight: 17, flex: 1, fontStyle: 'italic' }}>{t('proRegistration.menuTip')}</Text>
            </View>
          </View>
        )}

        {/* Step 3 — Plan */}
        {step === 3 && (
          <View style={{ gap: 10 }}>
            {PLANS.map((plan) => {
              const active = selectedPlan === plan.id;
              return (
                <TouchableOpacity key={plan.id} onPress={() => setSelectedPlan(plan.id)}
                  style={{ flexDirection: 'row', alignItems: 'center', padding: 14, borderRadius: 14, borderWidth: active ? 2 : 1, borderColor: active ? C.gold : C.border, backgroundColor: active ? C.goldSoft : C.surface }}>
                  <Radio active={active} C={C} color={C.gold} />
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text style={{ fontWeight: '700', fontSize: 14, color: C.ink }}>{t(`proRegistration.plan_${plan.id}`)}</Text>
                    {!!plan.period && <Text style={{ fontSize: 11, color: C.inkMute }}>{plan.period}</Text>}
                  </View>
                  <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 16, fontWeight: '700', color: active ? C.primary : C.ink }}>{plan.price}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Step 4 — Aperçu */}
        {step === 4 && (
          <View style={{ gap: 12 }}>
            <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 18, color: C.ink }}>{t('proRegistration.previewTitle')}</Text>
            <SummaryRow C={C} label={t('proRegistration.businessName')} value={businessName || '—'} />
            <SummaryRow C={C} label={t('proRegistration.businessType')} value={businessType ?? '—'} />
            <SummaryRow C={C} label={t('proRegistration.address')} value={address || '—'} />
            <SummaryRow C={C} label={t('proRegistration.region')} value={region ?? '—'} />
            <SummaryRow C={C} label={t('proRegistration.stepMenu')} value={t(`proRegistration.menu${menuMode[0]!.toUpperCase()}${menuMode.slice(1)}`)} />
            <SummaryRow C={C} label={t('proRegistration.stepPlan')} value={t(`proRegistration.plan_${selectedPlan}`)} />
          </View>
        )}
      </ScrollView>

      {/* Footer nav */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: C.surface, borderTopWidth: 1, borderColor: C.border, flexDirection: 'row', gap: 8 }}>
        <TouchableOpacity onPress={handleBack} style={{ flex: 1, height: 50, borderRadius: 25, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: C.inkSoft }}>{t('common.back', 'Retour')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleNext}
          disabled={!canProceed()}
          style={{ flex: 1.6, height: 50, borderRadius: 25, backgroundColor: canProceed() ? C.primary : C.border, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 14, fontWeight: '700', color: '#fff' }}>
            {step === STEPS.length - 1 ? t('proRegistration.finish') : t('common.next', 'Suivant')}
          </Text>
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

function Radio({ active, C, color }: { active: boolean; C: ReturnType<typeof useColors>; color?: string }) {
  const tint = color ?? C.primary;
  return (
    <View style={{ width: 18, height: 18, borderRadius: 9, borderWidth: 1.5, borderColor: active ? tint : C.border, alignItems: 'center', justifyContent: 'center' }}>
      {active && <View style={{ width: 9, height: 9, borderRadius: 4.5, backgroundColor: tint }} />}
    </View>
  );
}

function SummaryRow({ C, label, value }: { C: ReturnType<typeof useColors>; label: string; value: string }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderColor: C.border }}>
      <Text style={{ fontSize: 12, color: C.inkMute }}>{label}</Text>
      <Text style={{ fontSize: 13, fontWeight: '600', color: C.ink }}>{value}</Text>
    </View>
  );
}
