import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

export default function SettingsProEntry() {
  const navigation = useNavigation<any>();
  const [push, setPush]           = useState(true);
  const [newsletter, setNewsletter] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Paramètres</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 60 }} showsVerticalScrollIndicator={false}>

        {/* Pro upgrade banner */}
        <TouchableOpacity style={{ padding: 20, borderRadius: 24, backgroundColor: '#1A237E', overflow: 'hidden', marginBottom: 20 }} activeOpacity={0.9}>
          <View style={{ position: 'absolute', top: -16, right: -16, width: 128, height: 128, borderRadius: 64, backgroundColor: 'rgba(249,168,37,0.1)' }} />
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
            <Icon name="Star" size={14} color="#F9A825" fill="#F9A825" />
            <Text style={{ color: '#F9A825', fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8 }}>KFL Pro</Text>
          </View>
          <Text style={{ color: '#fff', fontSize: 20, fontFamily: 'PlayfairDisplay-Bold', marginBottom: 4 }}>Passez à Pro</Text>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 20, marginBottom: 16 }}>
            Accédez aux analytics, au dashboard Pro et débloquez toutes les fonctionnalités.
          </Text>
          <View style={{ backgroundColor: '#F9A825', alignSelf: 'flex-start', paddingHorizontal: 20, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 13, fontWeight: '700' }}>Passer à Pro · 3 000 XAF/mois</Text>
          </View>
        </TouchableOpacity>

        {/* Current plan */}
        <View style={{ padding: 16, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', marginBottom: 16, ...SHADOW_SM }}>
          <Text style={{ fontSize: 11, fontWeight: '600', color: '#8C8278', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Plan actuel</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#F5F0EB', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="User" size={16} color="#6D4C41" />
            </View>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#2C1810' }}>Standard · Gratuit</Text>
          </View>
        </View>

        {/* Notifications */}
        <Text style={{ fontSize: 11, fontWeight: '600', color: '#8C8278', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingHorizontal: 4 }}>Notifications</Text>
        <View style={{ borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', overflow: 'hidden', marginBottom: 16, ...SHADOW_SM }}>
          {[
            { l: 'Notifications push', icon: 'Bell' as const, value: push,       set: setPush       },
            { l: 'Newsletter',          icon: 'Mail' as const, value: newsletter, set: setNewsletter },
          ].map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: i === 0 ? 1 : 0, borderColor: '#F5F0EB' }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#F5F0EB', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={item.icon} size={16} color="#6D4C41" />
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: '#2C1810' }}>{item.l}</Text>
              <Switch value={item.value} onValueChange={item.set} trackColor={{ false: '#E5E0D8', true: '#E8591A' }} thumbColor="#fff" />
            </View>
          ))}
        </View>

        {/* Links */}
        <View style={{ borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', overflow: 'hidden', ...SHADOW_SM }}>
          {["Confidentialité", "Conditions d'utilisation", 'À propos · v1.0.0'].map((link, i) => (
            <TouchableOpacity key={i} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: i < 2 ? 1 : 0, borderColor: '#F5F0EB' }}>
              <Text style={{ flex: 1, fontSize: 14, color: '#2C1810' }}>{link}</Text>
              <Icon name="ChevronRight" size={16} color="#8C8278" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={{ marginTop: 16, height: 44, borderWidth: 1, borderColor: 'rgba(198,40,40,0.3)', borderRadius: 22, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ fontSize: 14, color: '#C62828' }}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
