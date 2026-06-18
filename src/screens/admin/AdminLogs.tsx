import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const LOGS = [
  { level: 'WARN',  msg: 'Tentative de connexion suspecte', user: 'IP: 197.xxx.xx.xx', time: '14:38:21', color: '#F9A825', bg: '#FBF3DC' },
  { level: 'ERROR', msg: 'Paiement MTN échoué',             user: '#TX-4820',          time: '14:21:05', color: '#C62828', bg: '#FBDCDC' },
  { level: 'INFO',  msg: 'Nouvel utilisateur Pro inscrit',  user: 'Adèle Biya',        time: '13:55:10', color: '#1A237E', bg: '#E8EAF6' },
  { level: 'INFO',  msg: 'Scan réussi · Ndolé 97%',        user: 'Sami N.',           time: '13:22:44', color: '#2E7D32', bg: '#E3F0E4' },
  { level: 'WARN',  msg: 'Contenu signalé 3×',             user: 'Post #4521',        time: '12:15:33', color: '#F9A825', bg: '#FBF3DC' },
];

type LevelFilter = string | null;

export default function AdminLogs() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const [filter, setFilter] = useState<LevelFilter>(null);

  const filtered = filter ? LOGS.filter(l => l.level === filter) : LOGS;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#1A237E' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12, padding: 4 }}>
          <Icon name="ArrowLeft" size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: '#fff', fontSize: 15, fontWeight: '700', flex: 1 }}>Logs & Alertes</Text>
      </View>

      {/* Level filters */}
      <View style={{ flexDirection: 'row', gap: 6, paddingHorizontal: 16, paddingVertical: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        {([null, 'INFO', 'WARN', 'ERROR'] as LevelFilter[]).map((level, i) => (
          <TouchableOpacity
            key={i} onPress={() => setFilter(level)}
            style={{ height: 28, paddingHorizontal: 10, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: filter === level ? '#1A237E' : '#F5F0EB', borderColor: filter === level ? '#1A237E' : '#E5E0D8' }}
          >
            <Text style={{ fontSize: 11, fontWeight: '500', color: filter === level ? '#fff' : '#6D4C41' }}>{level ?? 'Tous'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        <View style={{ borderRadius: 18, backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, overflow: 'hidden' }}>
          {filtered.map((log, i) => (
            <View key={i} style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: i < filtered.length - 1 ? 1 : 0, borderColor: C.border }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <View style={{ paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, backgroundColor: log.bg }}>
                  <Text style={{ fontSize: 10, fontWeight: '700', color: log.color }}>{log.level}</Text>
                </View>
                <Text style={{ color: C.inkMute, fontSize: 11, fontFamily: 'JetBrainsMono-Regular' }}>{log.time}</Text>
              </View>
              <Text style={{ fontSize: 14, color: C.ink, marginBottom: 2 }}>{log.msg}</Text>
              <Text style={{ fontSize: 12, color: C.inkMute }}>{log.user}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
