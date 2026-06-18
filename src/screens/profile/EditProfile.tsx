import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import i18n from '@/i18n';

export default function EditProfile() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();

  const [firstName, setFirstName] = useState('Sami');
  const [lastName, setLastName]   = useState('Nguimfack');
  const [bio, setBio]             = useState('Passionné de cuisine camerounaise. Amateur de Ndolé et de Poulet DG.');
  const [email, setEmail]         = useState('sami@kfl.cm');
  const [phone, setPhone]         = useState('+237 6 90 00 00 00');
  const [lang, setLang]           = useState<'fr' | 'en'>(i18n.language === 'en' ? 'en' : 'fr');
  const [saving, setSaving]       = useState(false);

  const handleSave = () => {
    setSaving(true);
    i18n.changeLanguage(lang);
    setTimeout(() => {
      setSaving(false);
      Alert.alert(t('editProfile.savedTitle'), t('editProfile.savedMsg'), [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }, 600);
  };

  const handleChangePhoto = () => {
    Alert.alert(t('editProfile.changePhoto'), undefined);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t('editProfile.deleteConfirmTitle'),
      t('editProfile.deleteConfirmMsg'),
      [
        { text: t('editProfile.deleteConfirmCancel'), style: 'cancel' },
        { text: t('editProfile.deleteConfirmAction'), style: 'destructive', onPress: () => navigation.navigate('Login') },
      ],
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('editProfile.title')}</Text>
        <TouchableOpacity onPress={handleSave} disabled={saving} style={{ height: 32, paddingHorizontal: 14, backgroundColor: C.primary, borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>{saving ? t('editProfile.saving') : t('editProfile.save')}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

        {/* Avatar */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <View style={{ position: 'relative' }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: C.surface2, borderWidth: 2, borderColor: C.primary, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 28, fontWeight: '700', color: C.primary }}>{firstName.charAt(0)}</Text>
            </View>
            <TouchableOpacity onPress={handleChangePhoto} style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, backgroundColor: C.primary, borderRadius: 14, borderWidth: 2, borderColor: C.surface, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Camera" size={13} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleChangePhoto}>
            <Text style={{ fontSize: 14, fontWeight: '500', color: C.primary, marginTop: 8 }}>{t('editProfile.changePhoto')}</Text>
          </TouchableOpacity>
        </View>

        {/* Name row */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
          {[
            { label: t('editProfile.firstName'), val: firstName, set: setFirstName },
            { label: t('editProfile.lastName'),  val: lastName,  set: setLastName  },
          ].map((f, i) => (
            <View key={i} style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>{f.label}</Text>
              <View style={{ height: 48, borderWidth: 1, borderColor: C.border, borderRadius: 16, backgroundColor: C.surface, paddingHorizontal: 14, justifyContent: 'center' }}>
                <TextInput value={f.val} onChangeText={f.set} style={{ fontSize: 14, color: C.ink }} />
              </View>
            </View>
          ))}
        </View>

        {/* Bio */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>{t('editProfile.bio')}</Text>
          <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 16, backgroundColor: C.surface, paddingHorizontal: 14, paddingVertical: 12, minHeight: 80 }}>
            <TextInput value={bio} onChangeText={setBio} multiline numberOfLines={3} maxLength={150} style={{ fontSize: 14, color: C.ink, lineHeight: 20 }} />
          </View>
          <Text style={{ fontSize: 12, color: C.inkMute, marginTop: 4, textAlign: 'right' }}>{bio.length}/150</Text>
        </View>

        {/* Email */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>{t('editProfile.email')}</Text>
          <View style={{ height: 48, borderWidth: 1, borderColor: C.border, borderRadius: 16, backgroundColor: C.surface, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Icon name="Mail" size={16} color={C.inkMute} />
            <TextInput value={email} onChangeText={setEmail} style={{ flex: 1, fontSize: 14, color: C.ink }} keyboardType="email-address" />
          </View>
        </View>

        {/* Phone */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>{t('editProfile.phone')}</Text>
          <View style={{ height: 48, borderWidth: 1, borderColor: C.border, borderRadius: 16, backgroundColor: C.surface, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Icon name="Phone" size={16} color={C.inkMute} />
            <TextInput value={phone} onChangeText={setPhone} style={{ flex: 1, fontSize: 14, color: C.ink }} keyboardType="phone-pad" />
          </View>
        </View>

        {/* Language */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>{t('editProfile.language')}</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {([{ code: 'fr' as const, label: t('editProfile.french') }, { code: 'en' as const, label: t('editProfile.english') }]).map((l) => (
              <TouchableOpacity key={l.code} onPress={() => setLang(l.code)}
                style={{ flex: 1, height: 48, borderRadius: 16, borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: lang === l.code ? C.goldSoft : C.surface, borderColor: lang === l.code ? C.primary : C.border }}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: lang === l.code ? C.primary : C.inkSoft }}>{l.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Danger zone */}
        <View style={{ padding: 16, borderRadius: 18, borderWidth: 1, borderColor: C.error, backgroundColor: C.errorSoft }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: C.error, marginBottom: 8 }}>{t('editProfile.dangerZone')}</Text>
          <TouchableOpacity onPress={handleDeleteAccount} style={{ height: 40, borderWidth: 1, borderColor: C.error, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 14, color: C.error }}>{t('editProfile.deleteAccount')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
