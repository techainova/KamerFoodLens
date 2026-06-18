import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, SafeAreaView, StatusBar, TextInput, Animated,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const COUNTDOWN = 120;

export default function MobileMoneyConfirm() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const route      = useRoute<any>();

  const provider = (route.params?.provider as string) ?? 'mtn';
  const amount   = (route.params?.amount   as number) ?? 14000;
  const phone    = (route.params?.phone    as string) ?? '+237 6XX XXX XXX';

  const isMTN  = provider === 'mtn';
  const color  = isMTN ? '#F9A825' : '#E8591A';
  const bgSoft = isMTN ? '#FBF3DC' : '#FEF3EC';
  const name   = isMTN ? 'MTN Mobile Money' : 'Orange Money';

  const [otp, setOtp]           = useState('');
  const [secs, setSecs]         = useState(COUNTDOWN);
  const [confirming, setConf]   = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.10, duration: 750, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 750, useNativeDriver: true }),
      ])
    );
    pulse.start();
    const timer = setInterval(() => {
      setSecs(prev => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => { pulse.stop(); clearInterval(timer); };
  }, [pulseAnim]);

  const mins = String(Math.floor(secs / 60)).padStart(2, '0');
  const secsStr = String(secs % 60).padStart(2, '0');

  const handleConfirm = () => {
    setConf(true);
    setTimeout(() => {
      setConf(false);
      navigation.navigate('PaymentSuccess');
    }, 1600);
  };

  const expired = secs === 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>Confirmation</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Icon name="Lock" size={13} color="#2E7D32" />
          <Text style={{ fontSize: 11, color: '#2E7D32', fontWeight: '600' }}>Sécurisé</Text>
        </View>
      </View>

      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 32, alignItems: 'center' }}>

        {/* Provider badge + pulsing icon */}
        <View style={{ marginBottom: 28, alignItems: 'center' }}>
          <Animated.View style={{
            transform: [{ scale: pulseAnim }],
            width: 96, height: 96, borderRadius: 48,
            backgroundColor: color + '20',
            borderWidth: 3, borderColor: color + '50',
            alignItems: 'center', justifyContent: 'center',
          }}>
            <Icon name="Smartphone" size={40} color={color} />
          </Animated.View>
          <View style={{ marginTop: -10, paddingHorizontal: 14, paddingVertical: 5, borderRadius: 14, backgroundColor: color, alignSelf: 'center' }}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: isMTN ? '#2C1810' : '#fff' }}>{name}</Text>
          </View>
        </View>

        <Text style={{ fontSize: 22, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, textAlign: 'center', marginBottom: 12 }}>
          En attente de confirmation
        </Text>

        <Text style={{ fontSize: 14, color: C.inkSoft, textAlign: 'center', lineHeight: 22, marginBottom: 22 }}>
          Une notification a été envoyée au{'\n'}
          <Text style={{ fontWeight: '700', color: C.ink }}>{phone}</Text>{'\n'}
          Validez pour confirmer{' '}
          <Text style={{ fontWeight: '700', color: '#E8591A' }}>{amount.toLocaleString()} XAF</Text>.
        </Text>

        {/* Countdown */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 9, borderRadius: 12, backgroundColor: expired ? '#FBDCDC' : '#F5F0EB', marginBottom: 28 }}>
          <Icon name="Clock" size={14} color={expired ? '#C62828' : '#8C8278'} />
          <Text style={{ fontSize: 15, fontWeight: '700', color: expired ? '#C62828' : '#2C1810', fontFamily: 'JetBrainsMono-Regular' }}>
            {mins}:{secsStr}
          </Text>
          <Text style={{ fontSize: 12, color: C.inkMute }}>restant</Text>
        </View>

        {/* Manual OTP */}
        <View style={{ width: '100%', marginBottom: 20 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: C.inkSoft, marginBottom: 8, textAlign: 'center' }}>
            Ou entrez votre code de confirmation
          </Text>
          <View style={{
            height: 52, borderRadius: 14, borderWidth: 1.5,
            borderColor: otp.length === 6 ? color : '#E5E0D8',
            backgroundColor: C.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10,
          }}>
            <Icon name="Lock" size={18} color={otp.length === 6 ? color : '#8C8278'} />
            <TextInput
              value={otp}
              onChangeText={t => setOtp(t.replace(/\D/g, '').slice(0, 6))}
              placeholder="123456"
              placeholderTextColor="#8C8278"
              keyboardType="numeric"
              style={{ flex: 1, fontSize: 22, color: C.ink, fontFamily: 'JetBrainsMono-Regular', letterSpacing: 6 }}
            />
            {otp.length === 6 && <Icon name="Check" size={18} color={color} />}
          </View>
        </View>

        {/* Confirm button */}
        <TouchableOpacity
          onPress={handleConfirm}
          disabled={confirming || expired}
          style={{ width: '100%', height: 54, borderRadius: 16, backgroundColor: (confirming || expired) ? '#C4BDB7' : '#E8591A', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, marginBottom: 12 }}
          activeOpacity={0.85}
        >
          <Icon name="Check" size={18} color="#fff" />
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#fff' }}>
            {confirming ? 'Vérification...' : expired ? 'Délai expiré' : 'Confirmer le paiement'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingVertical: 12 }}>
          <Text style={{ fontSize: 14, color: C.inkMute }}>Annuler</Text>
        </TouchableOpacity>

        {/* Help */}
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginTop: 14, backgroundColor: bgSoft, borderRadius: 12, padding: 12, borderWidth: 1, borderColor: color + '30', width: '100%' }}>
          <Icon name="Info" size={14} color={color} />
          <Text style={{ flex: 1, fontSize: 11, color: C.inkSoft, lineHeight: 17 }}>
            Si vous n'avez pas reçu la notification, vérifiez que votre numéro est actif et que vous disposez d'un solde suffisant.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
