import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const MESSAGES = [
  { from: 'client', text: 'Bonjour, ma commande est-elle prête ?',          time: '14:28' },
  { from: 'pro',    text: 'Bonjour ! Oui, elle sera prête dans 10 minutes.', time: '14:30' },
  { from: 'client', text: 'Super merci ! J\'arrive.',                        time: '14:31' },
  { from: 'client', text: 'Avez-vous ajouté la sauce extra comme demandé ?', time: '14:32' },
];

export default function ProMessageDetail() {
  const navigation = useNavigation<any>();
  const [msg, setMsg] = useState('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontFamily: 'PlayfairDisplay-Bold', fontSize: 17, color: '#2C1810', lineHeight: 20 }}>Sami Nguimfack</Text>
          <Text style={{ fontSize: 12, color: '#8C8278' }}>Commande #KFL-4825</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} contentContainerStyle={{ paddingVertical: 12, paddingBottom: 10 }} showsVerticalScrollIndicator={false}>
        {MESSAGES.map((m, i) => (
          <View key={i} style={{ marginBottom: 10, alignItems: m.from === 'pro' ? 'flex-end' : 'flex-start' }}>
            <View style={{
              maxWidth: '75%', padding: 12, borderRadius: 18,
              backgroundColor: m.from === 'pro' ? '#F9A825' : '#fff',
              borderWidth: m.from === 'pro' ? 0 : 1,
              borderColor: '#E5E0D8',
              borderTopRightRadius: m.from === 'pro' ? 4 : 18,
              borderTopLeftRadius: m.from === 'pro' ? 18 : 4,
            }}>
              <Text style={{ fontSize: 14, color: m.from === 'pro' ? '#fff' : '#2C1810' }}>{m.text}</Text>
            </View>
            <Text style={{ fontSize: 11, color: '#8C8278', marginTop: 3 }}>{m.time}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff' }}>
        <View style={{ flex: 1, height: 40, backgroundColor: '#F5F0EB', borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 20, paddingHorizontal: 14, justifyContent: 'center' }}>
          <TextInput
            value={msg} onChangeText={setMsg}
            placeholder="Votre réponse..." placeholderTextColor="#8C8278"
            style={{ fontSize: 14, color: '#2C1810' }}
          />
        </View>
        <TouchableOpacity style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#F9A825', alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="Send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
