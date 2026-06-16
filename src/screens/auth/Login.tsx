import React, { useState } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, SafeAreaView,
  TextInput, Modal, Alert, ActivityIndicator,
} from 'react-native';
import Svg, { Path, G, ClipPath, Rect, Defs } from 'react-native-svg';
import { useTranslation } from 'react-i18next';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/navigation/types';
import { useAuthStore } from '@/store/auth.store';
import LangSwitch from '@/components/auth/LangSwitch';
import KFLLogo from '@/components/ui/KFLLogo';
import Icon from '@/components/ui/Icon';

function GoogleLogo({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <Path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <Path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <Path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </Svg>
  );
}

function AppleLogo({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Defs>
        <ClipPath id="apple-rainbow">
          <Path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.087 1.013 1.454 2.208 3.096 3.792 3.039 1.52-.065 2.09-.987 3.925-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.64-2.316-4.43-2.355-1.261-.13-2.48.428-3.359.974z M14.279 4.204c.845-1.026 1.41-2.442 1.258-3.872-1.219.052-2.688.813-3.559 1.826-.779.91-1.467 2.372-1.285 3.76 1.369.104 2.769-.688 3.586-1.714z" />
        </ClipPath>
      </Defs>
      <G clipPath="url(#apple-rainbow)">
        <Rect x="0" y="0"  width="24" height="4" fill="#5ABE20" />
        <Rect x="0" y="4"  width="24" height="4" fill="#F7C800" />
        <Rect x="0" y="8"  width="24" height="4" fill="#FF6900" />
        <Rect x="0" y="12" width="24" height="4" fill="#FF3A00" />
        <Rect x="0" y="16" width="24" height="4" fill="#8900CC" />
        <Rect x="0" y="20" width="24" height="4" fill="#006EAF" />
      </G>
    </Svg>
  );
}

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function Login({ navigation }: Props) {
  const { t } = useTranslation();
  const [email, setEmail] = useState('amah@example.com');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  // Forgot password
  const [forgotVisible, setForgotVisible] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  const setUser = useAuthStore((s) => s.setUser);

  async function handleLogin() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setUser({ id: '1', email, firstName: 'Amah', lastName: 'Ndzié', username: 'amah.n', role: 'standard', xpPoints: 1250, level: 2 });
  }

  async function handleForgotSend() {
    if (!forgotEmail.includes('@')) return;
    setForgotLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setForgotLoading(false);
    setForgotSent(true);
  }

  async function handleGoogle() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    Alert.alert(
      t('auth.continueWithGoogle'),
      'OAuth Google — intégration avec expo-auth-session requise.',
      [{ text: 'OK' }],
    );
  }

  async function handleApple() {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    Alert.alert(
      t('auth.continueWithApple'),
      'OAuth Apple — intégration avec expo-apple-authentication requise.',
      [{ text: 'OK' }],
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }} keyboardShouldPersistTaps="handled">

        {/* Top: logo + lang switch */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <KFLLogo size={40} />
          <LangSwitch />
        </View>

        {/* Title */}
        <View style={{ marginTop: 32 }}>
          <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontWeight: '700', fontSize: 26, color: '#2C1810', lineHeight: 30 }}>
            {t('auth.login')}
          </Text>
          <Text style={{ fontSize: 13, color: '#8C8278', fontStyle: 'italic', marginTop: 2 }}>
            {t('auth.loginSubtitle')}
          </Text>
        </View>

        {/* Image slot */}
        <View style={{ marginTop: 20, height: 120, borderRadius: 16, backgroundColor: '#F5F0EB', borderWidth: 1, borderStyle: 'dashed', borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#8C8278', fontSize: 11, fontStyle: 'italic' }}>ambiance culinaire</Text>
        </View>

        {/* Form */}
        <View style={{ marginTop: 24, gap: 14 }}>
          {/* Email */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#6D4C41', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {t('auth.email')}
            </Text>
            <View style={{ height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 }}>
              <Text style={{ color: '#8C8278', fontSize: 16 }}>✉</Text>
              <TextInput
                style={{ flex: 1, fontSize: 14, color: '#2C1810' }}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholder="amah@example.com"
                placeholderTextColor="#8C8278"
              />
            </View>
          </View>

          {/* Password */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#6D4C41', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              {t('auth.password')}
            </Text>
            <View style={{ height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 }}>
              <Text style={{ color: '#8C8278', fontSize: 16 }}>🔒</Text>
              <TextInput
                style={{ flex: 1, fontSize: 14, color: '#2C1810' }}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPw}
                placeholder="••••••••"
                placeholderTextColor="#8C8278"
              />
              <TouchableOpacity onPress={() => setShowPw(!showPw)}>
                <Text style={{ color: '#8C8278', fontSize: 16 }}>{showPw ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot password */}
          <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => { setForgotVisible(true); setForgotSent(false); setForgotEmail(email); }}>
            <Text style={{ color: '#E8591A', fontSize: 12, fontWeight: '600' }}>
              {t('auth.forgotPassword')}
            </Text>
          </TouchableOpacity>

          {/* CTA login */}
          <TouchableOpacity
            style={{ height: 56, backgroundColor: '#E8591A', borderRadius: 28, alignItems: 'center', justifyContent: 'center', marginTop: 4 }}
            onPress={handleLogin}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>{t('auth.signIn')}</Text>
            }
          </TouchableOpacity>

          {/* Divider */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 4 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#E5E0D8' }} />
            <Text style={{ color: '#8C8278', fontSize: 11 }}>— {t('common.or')} —</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: '#E5E0D8' }} />
          </View>

          {/* Google */}
          <TouchableOpacity
            onPress={handleGoogle}
            style={{ height: 52, borderWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff', borderRadius: 26, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}
          >
            <GoogleLogo size={20} />
            <Text style={{ color: '#6D4C41', fontSize: 14, fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>
              {t('auth.continueWithGoogle')}
            </Text>
          </TouchableOpacity>

          {/* Apple */}
          <TouchableOpacity
            onPress={handleApple}
            style={{ height: 52, backgroundColor: '#1C1C1E', borderRadius: 26, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}
          >
            <AppleLogo size={20} />
            <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600', fontFamily: 'Inter-SemiBold' }}>
              {t('auth.continueWithApple')}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Signup link */}
        <TouchableOpacity style={{ marginTop: 24, alignItems: 'center' }} onPress={() => navigation.navigate('Signup')}>
          <Text style={{ color: '#8C8278', fontSize: 12 }}>
            {t('auth.noAccount')}{' '}
            <Text style={{ color: '#2E7D32', fontWeight: '600', textDecorationLine: 'underline' }}>
              {t('auth.signup')}
            </Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* ── Forgot Password Modal ── */}
      <Modal visible={forgotVisible} transparent animationType="slide" onRequestClose={() => setForgotVisible(false)}>
        <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <View style={{ backgroundColor: '#FFFAF5', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 28, paddingBottom: 48 }}>

            <View style={{ width: 40, height: 4, borderRadius: 2, backgroundColor: '#E5E0D8', alignSelf: 'center', marginBottom: 24 }} />

            {!forgotSent ? (
              <>
                <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontWeight: '700', fontSize: 22, color: '#2C1810', marginBottom: 8 }}>
                  {t('auth.forgotPassword')}
                </Text>
                <Text style={{ fontSize: 13, color: '#6D4C41', lineHeight: 20, marginBottom: 20 }}>
                  {t('auth.forgotPasswordDesc', 'Entrez votre email, nous vous enverrons un lien de réinitialisation.')}
                </Text>

                <View style={{ gap: 6, marginBottom: 20 }}>
                  <Text style={{ fontSize: 11, fontWeight: '600', color: '#6D4C41', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {t('auth.email')}
                  </Text>
                  <View style={{ height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 }}>
                    <Text style={{ color: '#8C8278', fontSize: 16 }}>✉</Text>
                    <TextInput
                      style={{ flex: 1, fontSize: 14, color: '#2C1810' }}
                      value={forgotEmail}
                      onChangeText={setForgotEmail}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      placeholder="votre@email.com"
                      placeholderTextColor="#8C8278"
                      autoFocus
                    />
                  </View>
                </View>

                <TouchableOpacity
                  style={{ height: 52, backgroundColor: '#E8591A', borderRadius: 26, alignItems: 'center', justifyContent: 'center' }}
                  onPress={handleForgotSend}
                  disabled={forgotLoading}
                >
                  {forgotLoading
                    ? <ActivityIndicator color="#fff" />
                    : <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>
                        {t('auth.sendResetLink', 'Envoyer le lien')}
                      </Text>
                  }
                </TouchableOpacity>

                <TouchableOpacity style={{ marginTop: 14, alignItems: 'center' }} onPress={() => setForgotVisible(false)}>
                  <Text style={{ color: '#8C8278', fontSize: 12 }}>{t('common.cancel')}</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <View style={{ alignItems: 'center', paddingVertical: 16 }}>
                  <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#E3F0E4', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                    <Text style={{ fontSize: 36 }}>✉</Text>
                  </View>
                  <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontWeight: '700', fontSize: 20, color: '#2C1810', textAlign: 'center', marginBottom: 10 }}>
                    {t('auth.checkYourEmail', 'Vérifiez votre email')}
                  </Text>
                  <Text style={{ fontSize: 13, color: '#6D4C41', textAlign: 'center', lineHeight: 20, marginBottom: 24 }}>
                    {t('auth.resetLinkSentTo', 'Lien envoyé à')} <Text style={{ fontWeight: '700' }}>{forgotEmail}</Text>
                  </Text>
                  <TouchableOpacity
                    style={{ height: 52, backgroundColor: '#2E7D32', borderRadius: 26, alignItems: 'center', justifyContent: 'center', width: '100%' }}
                    onPress={() => setForgotVisible(false)}
                  >
                    <Text style={{ color: '#fff', fontSize: 15, fontWeight: '600' }}>{t('common.done')}</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
