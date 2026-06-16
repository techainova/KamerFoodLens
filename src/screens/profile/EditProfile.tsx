import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

export default function EditProfile() {
  const navigation = useNavigation<any>();
  const [firstName, setFirstName] = useState('Sami');
  const [lastName, setLastName]   = useState('Nguimfack');
  const [bio, setBio]             = useState('Passionné de cuisine camerounaise. Amateur de Ndolé et de Poulet DG.');
  const [email, setEmail]         = useState('sami@kfl.cm');
  const [phone, setPhone]         = useState('+237 6 90 00 00 00');
  const [lang, setLang]           = useState(0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Modifier le profil</Text>
        <TouchableOpacity style={{ height: 32, paddingHorizontal: 14, backgroundColor: '#E8591A', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 13, fontWeight: '600' }}>Enregistrer</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

        {/* Avatar */}
        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <View style={{ position: 'relative' }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#F5F0EB', borderWidth: 2, borderColor: '#E8591A', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 28, fontWeight: '700', color: '#E8591A' }}>S</Text>
            </View>
            <TouchableOpacity style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, backgroundColor: '#E8591A', borderRadius: 14, borderWidth: 2, borderColor: '#fff', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Camera" size={13} color="#fff" />
            </TouchableOpacity>
          </View>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#E8591A', marginTop: 8 }}>Changer la photo</Text>
        </View>

        {/* Name row */}
        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
          {[
            { label: 'Prénom', val: firstName, set: setFirstName },
            { label: 'Nom',    val: lastName,  set: setLastName  },
          ].map((f, i) => (
            <View key={i} style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, fontWeight: '600', color: '#8C8278', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>{f.label}</Text>
              <View style={{ height: 48, borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 16, backgroundColor: '#fff', paddingHorizontal: 14, justifyContent: 'center' }}>
                <TextInput value={f.val} onChangeText={f.set} style={{ fontSize: 14, color: '#2C1810' }} />
              </View>
            </View>
          ))}
        </View>

        {/* Bio */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#8C8278', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>Bio</Text>
          <View style={{ borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 16, backgroundColor: '#fff', paddingHorizontal: 14, paddingVertical: 12, minHeight: 80 }}>
            <TextInput value={bio} onChangeText={setBio} multiline numberOfLines={3} style={{ fontSize: 14, color: '#2C1810', lineHeight: 20 }} />
          </View>
          <Text style={{ fontSize: 12, color: '#8C8278', marginTop: 4, textAlign: 'right' }}>{bio.length}/150</Text>
        </View>

        {/* Email */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#8C8278', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>Email</Text>
          <View style={{ height: 48, borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 16, backgroundColor: '#fff', paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Icon name="Mail" size={16} color="#8C8278" />
            <TextInput value={email} onChangeText={setEmail} style={{ flex: 1, fontSize: 14, color: '#2C1810' }} keyboardType="email-address" />
          </View>
        </View>

        {/* Phone */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#8C8278', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 }}>Téléphone</Text>
          <View style={{ height: 48, borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 16, backgroundColor: '#fff', paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <Icon name="Phone" size={16} color="#8C8278" />
            <TextInput value={phone} onChangeText={setPhone} style={{ flex: 1, fontSize: 14, color: '#2C1810' }} keyboardType="phone-pad" />
          </View>
        </View>

        {/* Language */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#8C8278', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Langue / Language</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['Français', 'English'].map((l, i) => (
              <TouchableOpacity key={i} onPress={() => setLang(i)}
                style={{ flex: 1, height: 48, borderRadius: 16, borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: lang === i ? '#FEF3EC' : '#fff', borderColor: lang === i ? '#E8591A' : '#E5E0D8' }}>
                <Text style={{ fontSize: 14, fontWeight: '500', color: lang === i ? '#E8591A' : '#6D4C41' }}>{l}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Danger zone */}
        <View style={{ padding: 16, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(198,40,40,0.2)', backgroundColor: 'rgba(251,220,220,0.3)' }}>
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#C62828', marginBottom: 8 }}>Zone dangereuse</Text>
          <TouchableOpacity style={{ height: 40, borderWidth: 1, borderColor: 'rgba(198,40,40,0.4)', borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 14, color: '#C62828' }}>Supprimer mon compte</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
