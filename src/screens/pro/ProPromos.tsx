import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, TextInput, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

type Promo = { code: string; discount: string; uses: number; max: number | null; active: boolean; expires: string };

const PROMOS_INITIAL: Promo[] = [
  { code: 'BIENVENUE20', discount: '20%', uses: 34,  max: 100,  active: true,  expires: '31 Jan' },
  { code: 'NOEL2025',    discount: '15%', uses: 87,  max: 100,  active: false, expires: '26 Déc' },
  { code: 'FIDELITE10',  discount: '10%', uses: 12,  max: null, active: true,  expires: 'Illimité' },
];

export default function ProPromos() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [promos, setPromos] = useState<Promo[]>(PROMOS_INITIAL);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCode, setNewCode] = useState('');
  const [newDiscount, setNewDiscount] = useState('');

  const toggle = (i: number) => setPromos(prev => prev.map((p, idx) => idx === i ? { ...p, active: !p.active } : p));
  const removePromo = (i: number) => setPromos(prev => prev.filter((_, idx) => idx !== i));

  const confirmCreate = () => {
    if (!newCode.trim() || !newDiscount.trim()) return;
    setPromos(prev => [
      { code: newCode.trim().toUpperCase(), discount: `${newDiscount.trim()}%`, uses: 0, max: null, active: true, expires: t('proPromos.unlimited') },
      ...prev,
    ]);
    setNewCode('');
    setNewDiscount('');
    setShowCreateForm(false);
  };

  const cancelCreate = () => {
    setNewCode('');
    setNewDiscount('');
    setShowCreateForm(false);
  };

  const activeCount = promos.filter(p => p.active).length;
  const totalUses = promos.reduce((sum, p) => sum + p.uses, 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('proPromos.title')}</Text>
        <TouchableOpacity
          onPress={() => setShowCreateForm(v => !v)}
          style={{ height: 32, paddingHorizontal: 12, backgroundColor: C.gold, borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4 }}
        >
          <Icon name="Plus" size={12} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{t('proPromos.create')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {showCreateForm && (
          <View style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.gold, marginBottom: 16, gap: 10, ...SHADOW_SM }}>
            <TextInput
              value={newCode}
              onChangeText={setNewCode}
              placeholder={t('proPromos.codePlaceholder')}
              placeholderTextColor={C.inkMute}
              autoCapitalize="characters"
              style={{ height: 42, borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingHorizontal: 12, fontSize: 14, color: C.ink, backgroundColor: C.surface2 }}
            />
            <TextInput
              value={newDiscount}
              onChangeText={setNewDiscount}
              placeholder={t('proPromos.discountPlaceholder')}
              placeholderTextColor={C.inkMute}
              keyboardType="numeric"
              style={{ height: 42, borderWidth: 1, borderColor: C.border, borderRadius: 10, paddingHorizontal: 12, fontSize: 14, color: C.ink, backgroundColor: C.surface2 }}
            />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity
                onPress={cancelCreate}
                style={{ flex: 1, height: 40, borderRadius: 10, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ fontSize: 13, fontWeight: '600', color: C.inkSoft }}>{t('proPromos.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmCreate}
                style={{ flex: 1, height: 40, borderRadius: 10, backgroundColor: C.gold, alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ fontSize: 13, fontWeight: '700', color: '#fff' }}>{t('proPromos.confirm')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Stats */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          {[
            { v: String(activeCount), l: t('proPromos.activePromos') },
            { v: String(totalUses), l: t('proPromos.uses') },
            { v: '−12%', l: t('proPromos.avgDiscount') },
          ].map((s, i) => (
            <View key={i} style={{ flex: 1, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 16, padding: 12, alignItems: 'center', ...SHADOW_SM }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: C.gold }}>{s.v}</Text>
              <Text style={{ fontSize: 10, color: C.inkMute, textAlign: 'center', marginTop: 2 }}>{s.l}</Text>
            </View>
          ))}
        </View>

        {/* Promo codes */}
        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>{t('proPromos.promoCodes')}</Text>
        <View style={{ gap: 12 }}>
          {promos.map((promo, i) => (
            <View key={`${promo.code}-${i}`} style={{ padding: 16, borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
              <TouchableOpacity
                onPress={() => removePromo(i)}
                style={{ position: 'absolute', top: 10, right: 10, width: 24, height: 24, borderRadius: 12, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center', zIndex: 1 }}
              >
                <Icon name="X" size={12} color={C.inkMute} />
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, paddingRight: 28 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ backgroundColor: C.goldSoft, borderWidth: 1, borderColor: '#F9A82530', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                    <Text style={{ color: C.gold, fontWeight: '700', fontSize: 13, fontFamily: 'JetBrainsMono-Regular' }}>{promo.code}</Text>
                  </View>
                  <View style={{ backgroundColor: C.navy, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{promo.discount}</Text>
                  </View>
                </View>
                <Switch
                  value={promo.active} onValueChange={() => toggle(i)}
                  trackColor={{ false: C.border, true: C.gold }} thumbColor="#fff"
                />
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="Users" size={12} color={C.inkMute} />
                  <Text style={{ fontSize: 12, color: C.inkMute }}>{promo.uses}{promo.max ? `/${promo.max}` : ''} {t('proPromos.usesLabel')}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Icon name="Clock" size={12} color={C.inkMute} />
                  <Text style={{ fontSize: 12, color: C.inkMute }}>{promo.expires}</Text>
                </View>
              </View>
              {promo.max && (
                <View style={{ height: 3, backgroundColor: C.surface2, borderRadius: 2, marginTop: 10, overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: `${(promo.uses / promo.max) * 100}%`, backgroundColor: C.gold, borderRadius: 2 }} />
                </View>
              )}
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
