import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import type { IconName } from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

type ToggleItem = { label: string; icon: IconName; type: 'toggle'; key: string };
type NavItem    = { label: string; icon: IconName; type: 'nav'; value?: string };
type SettingItem = ToggleItem | NavItem;

const GROUPS: { title: string; items: SettingItem[] }[] = [
  {
    title: 'Préférences',
    items: [
      { label: 'Notifications push', icon: 'Bell',     type: 'toggle', key: 'push'    },
      { label: 'Mode hors ligne',    icon: 'Wifi',     type: 'toggle', key: 'offline' },
      { label: 'Langue',             icon: 'Globe',    type: 'nav',    value: 'Français' },
      { label: 'Thème',              icon: 'Sun',      type: 'nav',    value: 'Clair' },
    ],
  },
  {
    title: 'Compte',
    items: [
      { label: 'Changer de mot de passe', icon: 'Lock',   type: 'nav' },
      { label: 'Confidentialité',         icon: 'Shield', type: 'nav' },
      { label: 'Données & Export',        icon: 'BarChart2', type: 'nav' },
    ],
  },
  {
    title: 'Accessibilité',
    items: [
      { label: 'Taille du texte',      icon: 'Type',    type: 'nav',    value: 'Normal' },
      { label: 'Contraste élevé',      icon: 'Eye',     type: 'toggle', key: 'contrast'  },
      { label: 'Réduire animations',   icon: 'Pause',   type: 'toggle', key: 'animation' },
    ],
  },
  {
    title: 'Aide',
    items: [
      { label: "Centre d'aide",  icon: 'HelpCircle', type: 'nav' },
      { label: 'Signaler un bug', icon: 'AlertTriangle', type: 'nav' },
      { label: 'À propos de KFL', icon: 'Info',       type: 'nav', value: 'v1.0.0' },
    ],
  },
];

export default function ProfileSettings() {
  const navigation = useNavigation<any>();
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    push: true, offline: false, contrast: false, animation: false,
  });

  const setToggle = (key: string, val: boolean) => setToggles(prev => ({ ...prev, [key]: val }));

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

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {GROUPS.map((group, gi) => (
          <View key={gi} style={{ marginBottom: 16 }}>
            <Text style={{ fontSize: 11, fontWeight: '600', color: '#8C8278', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, paddingHorizontal: 4 }}>{group.title}</Text>
            <View style={{ borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', overflow: 'hidden', ...SHADOW_SM }}>
              {group.items.map((item, ii) => (
                <TouchableOpacity key={ii}
                  style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: ii < group.items.length - 1 ? 1 : 0, borderColor: '#F5F0EB' }}
                  onPress={() => item.type === 'toggle' && setToggle(item.key, !toggles[item.key])}>
                  <View style={{ width: 32, height: 32, borderRadius: 10, backgroundColor: '#F5F0EB', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon name={item.icon} size={16} color="#6D4C41" />
                  </View>
                  <Text style={{ flex: 1, fontSize: 14, color: '#2C1810' }}>{item.label}</Text>
                  {item.type === 'toggle' && (
                    <Switch
                      value={toggles[item.key]}
                      onValueChange={(val) => setToggle(item.key, val)}
                      trackColor={{ false: '#E5E0D8', true: '#E8591A' }}
                      thumbColor="#fff"
                    />
                  )}
                  {item.type === 'nav' && (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      {item.value ? <Text style={{ fontSize: 12, color: '#8C8278' }}>{item.value}</Text> : null}
                      <Icon name="ChevronRight" size={16} color="#8C8278" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout */}
        <TouchableOpacity style={{ height: 48, borderWidth: 1, borderColor: 'rgba(198,40,40,0.3)', borderRadius: 24, alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#C62828' }}>Se déconnecter</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
