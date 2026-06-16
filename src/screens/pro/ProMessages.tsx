import React from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const CONVOS = [
  { name: 'Sami Nguimfack', last: 'Bonjour, ma commande est-elle prête ?', time: '14:32', unread: 2 },
  { name: 'Adèle Biya',     last: 'Merci pour la livraison rapide !',      time: '11:15', unread: 0 },
  { name: 'Ngo Mireille',   last: 'Avez-vous le Ndolé sans piment ?',      time: 'Hier',  unread: 1 },
];

export default function ProMessages() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Messages</Text>
      </View>

      {/* Search */}
      <View style={{ paddingHorizontal: 16, paddingVertical: 10, borderBottomWidth: 1, borderColor: '#E5E0D8', backgroundColor: '#fff' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: 40, backgroundColor: '#F5F0EB', borderWidth: 1, borderColor: '#E5E0D8', borderRadius: 12, paddingHorizontal: 12, gap: 8 }}>
          <Icon name="Search" size={15} color="#8C8278" />
          <TextInput placeholder="Rechercher une conversation..." placeholderTextColor="#8C8278" style={{ flex: 1, fontSize: 14, color: '#2C1810' }} />
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        {CONVOS.map((convo, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => navigation.navigate('ProMessageDetail', { userId: convo.name })}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderColor: '#F5F0EB', backgroundColor: convo.unread > 0 ? '#FEF3EC' : '#fff' }}
          >
            <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: '#F5F0EB', borderWidth: 1, borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#6D4C41', fontSize: 16, fontWeight: '600' }}>{convo.name[0]}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#2C1810' }}>{convo.name}</Text>
              <Text style={{ fontSize: 12, color: convo.unread > 0 ? '#2C1810' : '#8C8278', fontWeight: convo.unread > 0 ? '500' : '400', marginTop: 2 }} numberOfLines={1}>{convo.last}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 6 }}>
              <Text style={{ fontSize: 11, color: '#8C8278' }}>{convo.time}</Text>
              {convo.unread > 0 && (
                <View style={{ width: 20, height: 20, backgroundColor: '#E8591A', borderRadius: 10, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{convo.unread}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
