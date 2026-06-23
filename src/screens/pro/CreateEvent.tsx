import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, StatusBar, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

export default function CreateEvent() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const { t } = useTranslation();
  const [step] = useState(0);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [desc, setDesc] = useState('');
  const [error, setError] = useState('');

  const STEPS = [t('createEvent.stepInfo'), t('createEvent.stepDetails'), t('createEvent.stepTickets'), t('createEvent.stepPreview')];

  const fields = [
    { label: t('createEvent.fieldTitle'),    val: title,    set: setTitle,    placeholder: t('createEvent.fieldTitlePlaceholder') },
    { label: t('createEvent.fieldDate'),     val: date,     set: setDate,     placeholder: t('createEvent.fieldDatePlaceholder') },
    { label: t('createEvent.fieldLocation'), val: location, set: setLocation, placeholder: t('createEvent.fieldLocationPlaceholder') },
  ];

  const handleSubmit = () => {
    if (!title.trim()) {
      setError(t('createEvent.errorTitleRequired'));
      return;
    }
    if (!date.trim()) {
      setError(t('createEvent.errorDateRequired'));
      return;
    }
    setError('');
    Alert.alert(t('createEvent.successTitle'), t('createEvent.successMessage'), [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color={C.ink} />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>{t('createEvent.title')}</Text>
      </View>

      {/* Stepper */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        {STEPS.map((s, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={{ width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: i === step ? C.gold : i < step ? C.success : C.border }}>
              {i < step
                ? <Icon name="Check" size={14} color="#fff" />
                : <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{i + 1}</Text>
              }
            </View>
            {i < STEPS.length - 1 && <View style={{ flex: 1, height: 2, marginHorizontal: 4, backgroundColor: i < step ? C.success : C.border }} />}
          </View>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 16 }}>{t('createEvent.sectionTitle', { step: STEPS[step] })}</Text>

        {fields.map((field, i) => (
          <View key={i} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>{field.label}</Text>
            <View style={{ height: 48, borderWidth: 1, borderColor: C.border, borderRadius: 16, backgroundColor: C.surface, paddingHorizontal: 14, justifyContent: 'center' }}>
              <TextInput value={field.val} onChangeText={field.set} placeholder={field.placeholder} placeholderTextColor={C.inkMute} style={{ fontSize: 14, color: C.ink }} />
            </View>
          </View>
        ))}

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>{t('createEvent.fieldDescription')}</Text>
          <View style={{ borderWidth: 1, borderColor: C.border, borderRadius: 16, backgroundColor: C.surface, paddingHorizontal: 14, paddingVertical: 12, minHeight: 100 }}>
            <TextInput value={desc} onChangeText={setDesc} placeholder={t('createEvent.fieldDescriptionPlaceholder')} placeholderTextColor={C.inkMute} multiline numberOfLines={4} style={{ fontSize: 14, color: C.ink }} />
          </View>
        </View>

        {!!error && (
          <Text style={{ fontSize: 13, color: C.error, marginBottom: 8 }}>{error}</Text>
        )}
      </ScrollView>

      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderColor: C.border, backgroundColor: C.surface }}>
        <TouchableOpacity style={{ flex: 1, height: 44, borderWidth: 1, borderColor: C.border, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, color: C.inkSoft }}>{t('createEvent.draft')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSubmit}
          style={{ flex: 2, height: 44, backgroundColor: C.gold, borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}
          activeOpacity={0.85}
        >
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>{t('createEvent.next')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
