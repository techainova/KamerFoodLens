import React, { useState } from 'react';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity, Switch, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

export default function AdminSettings() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [registrationsOpen, setRegistrationsOpen] = useState(true);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [commission, setCommission] = useState('5');

  const toggleItems = [
    { l: 'Mode maintenance',     icon: 'Wrench'       as const, v: maintenanceMode,    set: setMaintenanceMode    },
    { l: 'Inscriptions ouvertes',icon: 'CheckCircle'  as const, v: registrationsOpen,  set: setRegistrationsOpen  },
    { l: 'IA de reconnaissance', icon: 'Zap'          as const, v: aiEnabled,           set: setAiEnabled          },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#1A237E' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12, padding: 4 }}>
          <Icon name="ArrowLeft" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', flex: 1 }}>Paramètres globaux</Text>
        <TouchableOpacity style={{ height: 32, paddingHorizontal: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Sauvegarder</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>

        {/* Danger banner */}
        {maintenanceMode && (
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 12, borderRadius: 14, backgroundColor: C.errorSoft, borderWidth: 1, borderColor: '#C6282840', marginBottom: 16 }}>
            <Icon name="AlertTriangle" size={14} color="#C62828" />
            <Text style={{ flex: 1, color: '#C62828', fontSize: 13, fontWeight: '600' }}>Mode maintenance activé — L'app est hors ligne pour les utilisateurs.</Text>
          </View>
        )}

        {/* Access */}
        <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Accès & Disponibilité</Text>
        <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden', marginBottom: 16 }}>
          {toggleItems.map((item, i) => (
            <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: i < 2 ? 1 : 0, borderColor: C.border }}>
              <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={item.icon} size={15} color="#6D4C41" />
              </View>
              <Text style={{ flex: 1, fontSize: 14, color: C.ink }}>{item.l}</Text>
              <Switch
                value={item.v} onValueChange={item.set}
                trackColor={{ false: '#E5E0D8', true: '#1A237E' }} thumbColor="#fff"
              />
            </View>
          ))}
        </View>

        {/* Finance */}
        <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Finance</Text>
        <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, padding: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 14, color: C.ink, marginBottom: 8 }}>Commission KFL (%) sur commandes</Text>
          <View style={{ height: 48, borderWidth: 1, borderColor: C.border, borderRadius: 14, paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Icon name="Percent" size={16} color="#8C8278" />
            <TextInput
              value={commission} onChangeText={setCommission}
              keyboardType="numeric" style={{ flex: 1, fontSize: 14, color: C.ink }}
            />
            <Text style={{ color: C.inkMute, fontSize: 14 }}>%</Text>
          </View>
        </View>

        {/* App info */}
        <Text style={{ fontSize: 11, fontWeight: '600', color: C.inkMute, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>Infos app</Text>
        <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden' }}>
          {[
            { l: 'Version', v: '1.0.0 (build 42)' },
            { l: 'API',     v: 'v2.1.0' },
            { l: 'DB',      v: 'PostgreSQL 16 · prod' },
          ].map((row, i) => (
            <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: i < 2 ? 1 : 0, borderColor: C.border }}>
              <Text style={{ fontSize: 14, color: C.inkMute }}>{row.l}</Text>
              <Text style={{ fontSize: 13, color: C.ink, fontFamily: 'JetBrainsMono-Regular' }}>{row.v}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
