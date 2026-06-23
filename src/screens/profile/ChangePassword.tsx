import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

function getStrength(pw: string): 0 | 1 | 2 | 3 | 4 {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8)           score++;
  if (/[A-Z]/.test(pw))         score++;
  if (/[0-9]/.test(pw))         score++;
  if (/[^A-Za-z0-9]/.test(pw))  score++;
  return score as 0 | 1 | 2 | 3 | 4;
}

const STRENGTH_COLORS = ['#E5E0D8', '#C62828', '#F9A825', '#2E7D32', '#2E7D32'];

interface PwInputProps {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  borderColor: string;
}
function PwInput({ label, placeholder, value, onChangeText, borderColor }: PwInputProps) {
  const C = useColors();
  const [show, setShow] = useState(false);
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ fontSize: 12, fontWeight: '600', color: C.inkSoft, marginBottom: 6 }}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1.5, borderColor, borderRadius: 14, backgroundColor: C.surface, paddingHorizontal: 14, height: 50 }}>
        <Icon name="Lock" size={16} color={C.inkMute} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={C.inkMute}
          secureTextEntry={!show}
          style={{ flex: 1, marginHorizontal: 10, fontSize: 14, color: C.ink, fontFamily: 'Inter-Regular' }}
        />
        <TouchableOpacity onPress={() => setShow(s => !s)}>
          <Icon name={show ? 'EyeOff' : 'Eye'} size={16} color={C.inkMute} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function ChangePassword() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();

  const [current, setCurrent] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const strength = getStrength(newPw);
  const matches = newPw.length > 0 && newPw === confirm;
  const noMatch = confirm.length > 0 && newPw !== confirm;

  const strengthLabels: Record<1 | 2 | 3 | 4, string> = {
    1: t('changePassword.strength1'),
    2: t('changePassword.strength2'),
    3: t('changePassword.strength3'),
    4: t('changePassword.strength4'),
  };

  const handleSave = () => {
    if (!current || !newPw || !confirm || !matches) return;
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => navigation.goBack(), 1600);
    }, 1200);
  };

  if (success) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: C.successSoft, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
          <Icon name="Check" size={32} color="#2E7D32" />
        </View>
        <Text style={{ fontSize: 20, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 8 }}>{t('changePassword.successTitle')}</Text>
        <Text style={{ fontSize: 14, color: C.inkMute, textAlign: 'center', paddingHorizontal: 32 }}>{t('changePassword.successSub')}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('changePassword.title')}</Text>
        <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: C.successSoft }}>
          <Text style={{ fontSize: 11, fontWeight: '700', color: '#2E7D32' }}>{t('changePassword.aes')}</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        <PwInput
          label={t('changePassword.currentLabel')}
          placeholder={t('changePassword.currentPlaceholder')}
          value={current}
          onChangeText={setCurrent}
          borderColor={current.length > 0 ? '#E8591A' : '#E5E0D8'}
        />

        <PwInput
          label={t('changePassword.newLabel')}
          placeholder={t('changePassword.newPlaceholder')}
          value={newPw}
          onChangeText={setNewPw}
          borderColor={strength > 0 ? STRENGTH_COLORS[strength] : '#E5E0D8'}
        />
        {newPw.length > 0 && (
          <View style={{ marginTop: -8, marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', gap: 4, marginBottom: 4 }}>
              {[1, 2, 3, 4].map(i => (
                <View key={i} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: strength >= i ? STRENGTH_COLORS[strength] : '#E5E0D8' }} />
              ))}
            </View>
            {strength > 0 && (
              <Text style={{ fontSize: 11, color: STRENGTH_COLORS[strength], fontWeight: '600' }}>
                {strengthLabels[strength as 1 | 2 | 3 | 4]}
              </Text>
            )}
          </View>
        )}

        <PwInput
          label={t('changePassword.confirmLabel')}
          placeholder={t('changePassword.confirmPlaceholder')}
          value={confirm}
          onChangeText={setConfirm}
          borderColor={matches ? '#2E7D32' : noMatch ? '#C62828' : '#E5E0D8'}
        />
        {confirm.length > 0 && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: -8, marginBottom: 16 }}>
            <Icon name={matches ? 'Check' : 'X'} size={14} color={matches ? '#2E7D32' : '#C62828'} />
            <Text style={{ fontSize: 12, color: matches ? '#2E7D32' : '#C62828', fontWeight: '600' }}>
              {matches ? t('changePassword.match') : t('changePassword.noMatch')}
            </Text>
          </View>
        )}

        {/* Security note */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 10, backgroundColor: C.successSoft, borderRadius: 14, padding: 14, marginBottom: 20, borderWidth: 1, borderColor: '#2E7D3220' }}>
          <Icon name="Shield" size={16} color="#2E7D32" />
          <Text style={{ flex: 1, fontSize: 12, color: '#2E7D32', lineHeight: 18 }}>{t('changePassword.securityNote')}</Text>
        </View>

        {/* Safety tips */}
        <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink, marginBottom: 10 }}>{t('changePassword.tipsTitle')}</Text>
        <View style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, padding: 14, gap: 10, marginBottom: 24, ...SHADOW_SM }}>
          {(['tip1', 'tip2', 'tip3', 'tip4'] as const).map((key, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: C.navySoft, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name="Check" size={12} color="#1A237E" />
              </View>
              <Text style={{ flex: 1, fontSize: 13, color: C.inkSoft }}>{t(`changePassword.${key}`)}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleSave}
          style={{ height: 50, borderRadius: 25, backgroundColor: (!current || !matches) ? '#E5E0D8' : '#E8591A', alignItems: 'center', justifyContent: 'center' }}
          activeOpacity={0.85}
          disabled={!current || !matches || saving}
        >
          <Text style={{ fontSize: 15, fontWeight: '700', color: (!current || !matches) ? '#8C8278' : '#fff' }}>
            {saving ? t('changePassword.saving') : t('changePassword.save')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
