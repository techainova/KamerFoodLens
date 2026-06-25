import React, { useState } from 'react';
import {
  View, TextInput, ScrollView, TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';
import i18n from '@/i18n';
import { useAuthStore } from '@/store/auth.store';

const FOOD_PREFS = ['prefCamerounais', 'prefEpice', 'prefAfricain', 'prefVegetarien', 'prefSansGluten', 'prefHalal', 'prefInternational'] as const;
const DEFAULT_ACTIVE_PREFS = ['prefCamerounais', 'prefEpice', 'prefAfricain'];

export default function EditProfile() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);

  const [firstName, setFirstName] = useState(user?.firstName ?? '');
  const [lastName, setLastName]   = useState(user?.lastName ?? '');
  const [username, setUsername]   = useState(user?.username ?? '');
  const [bio, setBio]             = useState(user?.bio ?? '');
  const [phone, setPhone]         = useState(user?.phone ?? '');
  const [email, setEmail]         = useState(user?.email ?? '');
  const [location, setLocation]   = useState(user?.location ?? '');
  const [lang, setLang]           = useState<'fr' | 'en'>(i18n.language === 'en' ? 'en' : 'fr');
  const [activePrefs, setActivePrefs] = useState<string[]>(DEFAULT_ACTIVE_PREFS);
  const [saving, setSaving]       = useState(false);

  const togglePref = (key: string) => {
    setActivePrefs((prev) => prev.includes(key) ? prev.filter((p) => p !== key) : [...prev, key]);
  };

  const handleSave = () => {
    setSaving(true);
    i18n.changeLanguage(lang);
    setTimeout(() => {
      setSaving(false);
      if (user) {
        setUser({ ...user, firstName, lastName, username, bio, phone, email, location });
      }
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
        { text: t('editProfile.deleteConfirmAction'), style: 'destructive', onPress: () => clearAuth() },
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
            <View style={{ width: 96, height: 96, borderRadius: 48, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 30, fontWeight: '600', color: C.inkMute }}>{(firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || '?'}</Text>
            </View>
            <TouchableOpacity onPress={handleChangePhoto} style={{ position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, backgroundColor: C.primary, borderRadius: 16, borderWidth: 2, borderColor: C.cream, alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Camera" size={15} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ gap: 14 }}>
          {/* Name row */}
          <View style={{ flexDirection: 'row', gap: 10 }}>
            {[
              { label: t('editProfile.firstName'), val: firstName, set: setFirstName },
              { label: t('editProfile.lastName'),  val: lastName,  set: setLastName  },
            ].map((f, i) => (
              <View key={i} style={{ flex: 1, gap: 6 }}>
                <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkSoft, textTransform: 'uppercase', letterSpacing: 0.4 }}>{f.label}</Text>
                <View style={{ height: 48, borderWidth: 1, borderColor: C.border, borderRadius: 12, backgroundColor: C.surface, paddingHorizontal: 14, justifyContent: 'center' }}>
                  <TextInput value={f.val} onChangeText={f.set} style={{ fontSize: 14, color: C.ink }} />
                </View>
              </View>
            ))}
          </View>

          {/* Username */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkSoft, textTransform: 'uppercase', letterSpacing: 0.4 }}>{t('editProfile.username')}</Text>
            <View style={{ height: 48, borderWidth: 1, borderColor: C.border, borderRadius: 12, backgroundColor: C.surface, paddingHorizontal: 14, justifyContent: 'center' }}>
              <TextInput value={username} onChangeText={setUsername} autoCapitalize="none" style={{ fontSize: 14, color: C.ink }} />
            </View>
          </View>

          {/* Bio */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkSoft, textTransform: 'uppercase', letterSpacing: 0.4 }}>{t('editProfile.bio')}</Text>
            <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 12, backgroundColor: C.surface, paddingHorizontal: 14, paddingVertical: 12, minHeight: 70 }}>
              <TextInput value={bio} onChangeText={setBio} multiline numberOfLines={3} maxLength={150} style={{ fontSize: 13, color: C.inkSoft, lineHeight: 19 }} />
            </View>
          </View>

          {/* Phone */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkSoft, textTransform: 'uppercase', letterSpacing: 0.4 }}>{t('editProfile.phone')}</Text>
            <View style={{ height: 48, borderWidth: 1, borderColor: C.border, borderRadius: 12, backgroundColor: C.surface, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Icon name="Phone" size={16} color={C.inkMute} />
              <TextInput value={phone} onChangeText={setPhone} style={{ flex: 1, fontSize: 14, color: C.ink }} keyboardType="phone-pad" />
            </View>
          </View>

          {/* Email */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkSoft, textTransform: 'uppercase', letterSpacing: 0.4 }}>{t('editProfile.email')}</Text>
            <View style={{ height: 48, borderWidth: 1, borderColor: C.border, borderRadius: 12, backgroundColor: C.surface, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Icon name="Mail" size={16} color={C.inkMute} />
              <TextInput value={email} onChangeText={setEmail} style={{ flex: 1, fontSize: 14, color: C.ink }} keyboardType="email-address" autoCapitalize="none" />
            </View>
          </View>

          {/* Location */}
          <View style={{ gap: 6 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkSoft, textTransform: 'uppercase', letterSpacing: 0.4 }}>{t('editProfile.location')}</Text>
            <View style={{ height: 48, borderWidth: 1, borderColor: C.border, borderRadius: 12, backgroundColor: C.surface, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Icon name="MapPin" size={16} color={C.inkMute} />
              <TextInput value={location} onChangeText={setLocation} style={{ flex: 1, fontSize: 14, color: C.ink }} />
            </View>
          </View>

          {/* Food preferences */}
          <View>
            <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkSoft, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8 }}>
              {t('editProfile.foodPreferencesTitle')}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
              {FOOD_PREFS.map((key) => {
                const active = activePrefs.includes(key);
                return (
                  <TouchableOpacity
                    key={key}
                    onPress={() => togglePref(key)}
                    style={{
                      height: 30, paddingHorizontal: 12, borderRadius: 15,
                      backgroundColor: active ? C.goldSoft : 'transparent',
                      borderWidth: 1, borderColor: active ? C.primary : C.border,
                      alignItems: 'center', justifyContent: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 12, fontWeight: active ? '600' : '500', color: active ? C.primary : C.inkSoft }}>
                      {t(`editProfile.${key}`)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Language */}
          <View>
            <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkSoft, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: 8 }}>
              {t('editProfile.language')}
            </Text>
            <View style={{ flexDirection: 'row', borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: C.border }}>
              {(['fr', 'en'] as const).map((code) => (
                <TouchableOpacity
                  key={code}
                  onPress={() => setLang(code)}
                  style={{ flex: 1, paddingVertical: 10, alignItems: 'center', backgroundColor: lang === code ? C.primary : 'transparent' }}
                >
                  <Text style={{ fontWeight: '600', color: lang === code ? '#fff' : C.inkMute }}>{code.toUpperCase()}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Lien vers les paramètres */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={{ marginTop: 8, height: 48, borderRadius: 12, borderWidth: 1, borderColor: C.border, backgroundColor: C.surface, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, gap: 10 }}
          >
            <Icon name="Settings" size={16} color={C.inkSoft} />
            <Text style={{ flex: 1, fontSize: 14, fontWeight: '600', color: C.ink }}>{t('editProfile.goToSettings')}</Text>
            <Icon name="ChevronRight" size={16} color={C.inkMute} />
          </TouchableOpacity>

          {/* Danger */}
          <View style={{ marginTop: 8, paddingTop: 16, borderTopWidth: 1, borderColor: C.border }}>
            <TouchableOpacity onPress={handleDeleteAccount}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: C.error }}>{t('editProfile.deleteAccount')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
