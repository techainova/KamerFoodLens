import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView, StatusBar, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const ENROLLEES = [
  { name: 'Sami Nguimfack', progress: 65, joined: '10 Jan' },
  { name: 'Adèle Biya',     progress: 100, joined: '15 Jan' },
  { name: 'Ngo Mireille',   progress: 30,  joined: '20 Jan' },
  { name: 'Kevin Bah',      progress: 45,  joined: '25 Jan' },
];

export default function ProFormationManage() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [courseTitle, setCourseTitle] = useState('Maîtrisez le Ndolé');

  const handleSave = () => {
    Alert.alert(t('proFormationManage.savedSuccess'));
  };

  const handleDelete = () => {
    Alert.alert(
      t('proFormationManage.deleteConfirmTitle'),
      t('proFormationManage.deleteConfirmMessage'),
      [
        { text: t('proFormationManage.deleteConfirmNo'), style: 'cancel' },
        {
          text: t('proFormationManage.deleteConfirmYes'),
          style: 'destructive',
          onPress: () => {
            Alert.alert(t('proFormationManage.deletedSuccess'));
            navigation.goBack();
          },
        },
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
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('proFormationManage.title')}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Course hero */}
        <View style={{ padding: 16, borderRadius: 20, backgroundColor: C.navy, marginBottom: 16 }}>
          <Text style={{ color: '#fff', fontSize: 18, fontFamily: 'PlayfairDisplay-Bold' }}>{courseTitle}</Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
            {[{ v: '124', l: t('proFormationManage.students') }, { v: '4.9', l: t('proFormationManage.rating') }, { v: '372k', l: t('proFormationManage.revenueXaf') }].map((s, i) => (
              <View key={i} style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 12, padding: 10, alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>{s.v}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>{s.l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Editable title */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>{t('proFormationManage.fieldTitle')}</Text>
          <View style={{ height: 48, borderWidth: 1, borderColor: C.border, borderRadius: 16, backgroundColor: C.surface, paddingHorizontal: 14, justifyContent: 'center' }}>
            <TextInput value={courseTitle} onChangeText={setCourseTitle} style={{ fontSize: 14, color: C.ink }} />
          </View>
        </View>

        <Text style={{ fontSize: 15, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>
          {t('proFormationManage.enrolledStudents', { count: ENROLLEES.length })}
        </Text>

        <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM, marginBottom: 20 }}>
          {ENROLLEES.map((e, i) => (
            <View key={i} style={{ paddingHorizontal: 16, paddingVertical: 13, borderBottomWidth: i < ENROLLEES.length - 1 ? 1 : 0, borderColor: C.surface2 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: C.inkSoft, fontSize: 12, fontWeight: '600' }}>{e.name[0]}</Text>
                </View>
                <Text style={{ flex: 1, fontSize: 14, color: C.ink, fontWeight: '600' }}>{e.name}</Text>
                <Text style={{ fontSize: 12, color: C.inkMute }}>{e.joined}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ flex: 1, height: 6, backgroundColor: C.border, borderRadius: 3, overflow: 'hidden' }}>
                  <View style={{ height: '100%', width: `${e.progress}%`, backgroundColor: e.progress === 100 ? '#2E7D32' : '#F9A825', borderRadius: 3 }} />
                </View>
                <Text style={{ fontSize: 12, fontWeight: '700', color: e.progress === 100 ? '#2E7D32' : '#F9A825', minWidth: 36, textAlign: 'right' }}>{e.progress}%</Text>
              </View>
            </View>
          ))}
        </View>

        <TouchableOpacity
          onPress={handleSave}
          style={{ height: 48, backgroundColor: C.gold, borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}
          activeOpacity={0.85}
        >
          <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700' }}>{t('proFormationManage.save')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDelete}
          style={{ height: 44, borderWidth: 1, borderColor: '#C6282830', borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}
        >
          <Text style={{ fontSize: 14, color: C.error }}>{t('proFormationManage.delete')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
