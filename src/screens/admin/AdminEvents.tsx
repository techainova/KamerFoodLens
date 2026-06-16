import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const EVENTS = [
  { title: 'Festival des saveurs',  date: '22 Jun 2026', status: 'published', attendees: 847 },
  { title: 'Masterclass Ndolé',     date: '25 Jun 2026', status: 'pending',   attendees: 124 },
  { title: 'Concours de recettes',  date: '28 Jun 2026', status: 'draft',     attendees: 56  },
];

const STATUS_CONF: Record<string, { label: string; color: string; bg: string }> = {
  published: { label: 'Publié',     color: '#2E7D32', bg: '#E3F0E4' },
  pending:   { label: 'En attente', color: '#F9A825', bg: '#FBF3DC' },
  draft:     { label: 'Brouillon',  color: '#8C8278', bg: '#F5F0EB' },
};

export default function AdminEvents() {
  const navigation = useNavigation<any>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#1A237E' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12, padding: 4 }}>
          <Icon name="ArrowLeft" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', flex: 1 }}>Gestion des événements</Text>
        <TouchableOpacity style={{ height: 32, paddingHorizontal: 12, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 16, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 4 }}>
          <Icon name="Plus" size={12} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>Nouveau</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={{ gap: 12 }}>
          {EVENTS.map((event, i) => {
            const s = STATUS_CONF[event.status];
            return (
              <View key={i} style={{ padding: 16, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#E5E0D8', ...SHADOW_SM }}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                  <Text style={{ flex: 1, fontSize: 14, fontWeight: '700', color: '#2C1810', marginRight: 8 }}>{event.title}</Text>
                  <View style={{ paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, backgroundColor: s.bg }}>
                    <Text style={{ fontSize: 11, fontWeight: '600', color: s.color }}>{s.label}</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon name="Calendar" size={12} color="#8C8278" />
                    <Text style={{ fontSize: 12, color: '#8C8278' }}>{event.date}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                    <Icon name="Users" size={12} color="#8C8278" />
                    <Text style={{ fontSize: 12, color: '#8C8278' }}>{event.attendees} inscrits</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity style={{ height: 32, paddingHorizontal: 12, backgroundColor: '#E8EAF6', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#1A237E', fontSize: 12, fontWeight: '600' }}>Modifier</Text>
                  </TouchableOpacity>
                  {event.status === 'pending' && (
                    <TouchableOpacity style={{ height: 32, paddingHorizontal: 12, backgroundColor: '#E3F0E4', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                      <Text style={{ color: '#2E7D32', fontSize: 12, fontWeight: '600' }}>Approuver</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity style={{ height: 32, paddingHorizontal: 12, backgroundColor: '#FBDCDC', borderRadius: 16, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#C62828', fontSize: 12, fontWeight: '600' }}>Supprimer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
