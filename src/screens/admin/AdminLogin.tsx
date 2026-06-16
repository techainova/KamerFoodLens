import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

export default function AdminLogin() {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [totp, setTotp] = useState('');
  const [step, setStep] = useState<'credentials' | 'totp'>('credentials');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0D0E1A', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 }}>
      <StatusBar barStyle="light-content" />

      {/* Logo */}
      <View style={{ width: 64, height: 64, borderRadius: 18, backgroundColor: '#1A237E', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
        <Icon name="Shield" size={28} color="#fff" />
      </View>
      <Text style={{ color: '#fff', fontSize: 24, fontFamily: 'PlayfairDisplay-Bold', marginBottom: 4 }}>Admin KFL</Text>
      <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13, marginBottom: 32 }}>Panneau d'administration sécurisé</Text>

      {step === 'credentials' ? (
        <View style={{ width: '100%', gap: 12 }}>
          <View style={{ height: 48, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Icon name="Mail" size={16} color="rgba(255,255,255,0.4)" />
            <TextInput
              value={email} onChangeText={setEmail}
              placeholder="Email admin" placeholderTextColor="rgba(255,255,255,0.3)"
              style={{ flex: 1, fontSize: 14, color: '#fff' }}
              keyboardType="email-address" autoCapitalize="none"
            />
          </View>
          <View style={{ height: 48, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.15)', borderRadius: 16, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Icon name="Lock" size={16} color="rgba(255,255,255,0.4)" />
            <TextInput
              value={password} onChangeText={setPassword}
              placeholder="Mot de passe" placeholderTextColor="rgba(255,255,255,0.3)"
              style={{ flex: 1, fontSize: 14, color: '#fff' }}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(p => !p)} style={{ padding: 4 }}>
              <Icon name={showPass ? 'EyeOff' : 'Eye'} size={16} color="rgba(255,255,255,0.4)" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={() => setStep('totp')}
            style={{ height: 48, backgroundColor: '#1A237E', borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginTop: 8 }}
            activeOpacity={0.85}
          >
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Continuer</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ alignItems: 'center', marginTop: 8 }}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Annuler</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ width: '100%', alignItems: 'center', gap: 16 }}>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, textAlign: 'center' }}>Code TOTP (6 chiffres)</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <View key={i} style={{ width: 44, height: 56, backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 1, borderColor: totp[i] ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.15)', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 20, fontWeight: '700' }}>{totp[i] ?? ''}</Text>
              </View>
            ))}
          </View>
          <TextInput
            value={totp}
            onChangeText={v => setTotp(v.replace(/[^0-9]/g, '').slice(0, 6))}
            keyboardType="number-pad"
            style={{ opacity: 0, position: 'absolute', height: 1, width: 1 }}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('AdminDashboard')}
            style={{ height: 48, backgroundColor: '#1A237E', borderRadius: 24, alignItems: 'center', justifyContent: 'center', width: '100%' }}
            activeOpacity={0.85}
          >
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Accéder au panel</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setStep('credentials')}>
            <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>← Retour</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
