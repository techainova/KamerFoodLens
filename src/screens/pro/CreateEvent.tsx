import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const STEPS = ['Infos', 'Détails', 'Billets', 'Aperçu'];

export default function CreateEvent() {
  const navigation = useNavigation<any>();
  const [step] = useState(0);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [location, setLocation] = useState('');
  const [desc, setDesc] = useState('');

  const fields = [
    { label: "Titre de l'événement", val: title,    set: setTitle,    placeholder: 'Festival des saveurs...' },
    { label: 'Date & heure',         val: date,     set: setDate,     placeholder: '22 Jun 2026 · 10h00' },
    { label: 'Lieu',                 val: location, set: setLocation, placeholder: 'Palais des Congrès, Yaoundé' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Créer un événement</Text>
      </View>

      {/* Stepper */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        {STEPS.map((s, i) => (
          <View key={i} style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
            <View style={{ width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', backgroundColor: i === step ? '#F9A825' : i < step ? '#2E7D32' : '#E5E0D8' }}>
              {i < step
                ? <Icon name="Check" size={14} color="#fff" />
                : <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>{i + 1}</Text>
              }
            </View>
            {i < STEPS.length - 1 && <View style={{ flex: 1, height: 2, marginHorizontal: 4, backgroundColor: i < step ? '#2E7D32' : '#E5E0D8' }} />}
          </View>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 90 }} showsVerticalScrollIndicator={false}>
        <Text style={{ fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', marginBottom: 16 }}>{STEPS[step]} de l'événement</Text>

        {fields.map((field, i) => (
          <View key={i} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#8C8278', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>{field.label}</Text>
            <View style={{ height: 48, borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 16, backgroundColor: '#fff', paddingHorizontal: 14, justifyContent: 'center' }}>
              <TextInput value={field.val} onChangeText={field.set} placeholder={field.placeholder} placeholderTextColor="#8C8278" style={{ fontSize: 14, color: '#2C1810' }} />
            </View>
          </View>
        ))}

        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#8C8278', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>Description</Text>
          <View style={{ borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 16, backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 12, minHeight: 100 }}>
            <TextInput value={desc} onChangeText={setDesc} placeholder="Décrivez votre événement..." placeholderTextColor="#8C8278" multiline numberOfLines={4} style={{ fontSize: 14, color: '#2C1810' }} />
          </View>
        </View>
      </ScrollView>

      <View style={{ flexDirection: 'row', gap: 8, paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff' }}>
        <TouchableOpacity style={{ flex: 1, height: 44, borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, color: '#6D4C41' }}>Brouillon</Text>
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 2, height: 44, backgroundColor: '#F9A825', borderRadius: 22, alignItems: 'center', justifyContent: 'center' }} activeOpacity={0.85}>
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Suivant</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
