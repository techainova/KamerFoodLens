import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };
const SHADOW_MD = { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 6, elevation: 4 };

const MY_TICKETS = [
  { id: 'KFL-7842', date: '14 Juin 2024', lucky: false },
  { id: 'KFL-7843', date: '14 Juin 2024', lucky: true },
  { id: 'KFL-9021', date: '18 Juin 2024', lucky: false },
];

const PRIZES = [
  { rank: '1er', prize: 'Masterclass privée avec Chef Amina (5h)', value: '150 000 XAF', icon: 'Trophy' as const, color: '#F9A825' },
  { rank: '2ème', prize: 'Abonnement KFL Pro — 6 mois', value: '45 000 XAF', icon: 'Award' as const, color: '#8C8278' },
  { rank: '3ème', prize: 'Panier d\'épices camerounaises premium', value: '25 000 XAF', icon: 'Gift' as const, color: '#E8591A' },
  { rank: 'x10', prize: 'Accès 30 jours aux formations KFL', value: '12 000 XAF', icon: 'GraduationCap' as const, color: '#2E7D32' },
];

export default function Tombola() {
  const navigation = useNavigation<any>();
  const [ticketCount, setTicketCount] = useState(1);
  const TICKET_PRICE = 500;
  const total = ticketCount * TICKET_PRICE;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFAF5' }}>
      <StatusBar barStyle="dark-content" />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#E5E0D8' }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: '#2C1810' }}>Tombola</Text>
        <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: '#FBF3DC' }}>
          <Text style={{ fontSize: 12, fontWeight: '700', color: '#F9A825' }}>J-12</Text>
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

        {/* Countdown hero */}
        <View style={{ margin: 16, borderRadius: 20, backgroundColor: '#F9A825', padding: 20, ...SHADOW_MD }}>
          <Text style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Prochain tirage</Text>
          <Text style={{ fontSize: 22, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', marginBottom: 16 }}>30 Juin 2024 à 20h00</Text>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            {[{ v: '11', l: 'JOURS' }, { v: '23', l: 'HEURES' }, { v: '15', l: 'MIN' }, { v: '44', l: 'SEC' }].map(({ v, l }) => (
              <View key={l} style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.12)', borderRadius: 12, paddingVertical: 10, alignItems: 'center' }}>
                <Text style={{ fontSize: 22, fontWeight: '700', color: '#2C1810', fontFamily: 'JetBrainsMono-Regular' }}>{v}</Text>
                <Text style={{ fontSize: 9, color: 'rgba(0,0,0,0.5)', letterSpacing: 0.5 }}>{l}</Text>
              </View>
            ))}
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14 }}>
            <Icon name="Ticket" size={15} color="rgba(0,0,0,0.5)" />
            <Text style={{ fontSize: 12, color: 'rgba(0,0,0,0.5)' }}>1 247 participants · 3 718 billets vendus</Text>
          </View>
        </View>

        {/* My tickets */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ flex: 1, fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810' }}>Mes billets ({MY_TICKETS.length})</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            {MY_TICKETS.map(ticket => (
              <View
                key={ticket.id}
                style={{ width: 170, backgroundColor: ticket.lucky ? '#F9A825' : '#fff', borderRadius: 16, padding: 14, borderWidth: 1.5, borderColor: ticket.lucky ? '#F9A825' : '#E5E0D8', ...SHADOW_SM }}
              >
                {ticket.lucky && (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 8 }}>
                    <Icon name="Star" size={11} color="#2C1810" fill="#2C1810" />
                    <Text style={{ fontSize: 9, fontWeight: '700', color: '#2C1810', textTransform: 'uppercase' }}>Chanceux</Text>
                  </View>
                )}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <Icon name="Ticket" size={18} color={ticket.lucky ? '#2C1810' : '#E8591A'} />
                  <Text style={{ fontSize: 12, fontWeight: '700', color: ticket.lucky ? '#2C1810' : '#2C1810', fontFamily: 'JetBrainsMono-Regular' }}>{ticket.id}</Text>
                </View>
                <Text style={{ fontSize: 10, color: ticket.lucky ? 'rgba(0,0,0,0.5)' : '#8C8278' }}>Acheté le {ticket.date}</Text>
                <View style={{ marginTop: 8, height: 3, backgroundColor: ticket.lucky ? 'rgba(0,0,0,0.15)' : '#E5E0D8', borderRadius: 2 }}>
                  <View style={{ height: '100%', width: '100%', backgroundColor: ticket.lucky ? '#2C1810' : '#E8591A30', borderRadius: 2 }} />
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Prizes */}
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
          <Text style={{ fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: '#2C1810', marginBottom: 12 }}>Lots à gagner</Text>
          <View style={{ gap: 10 }}>
            {PRIZES.map((prize, i) => (
              <View key={i} style={{ backgroundColor: '#fff', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12, borderWidth: 1, borderColor: '#E5E0D8', ...SHADOW_SM }}>
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: prize.color + '15', borderWidth: 1.5, borderColor: prize.color + '40', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon name={prize.icon} size={20} color={prize.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                    <View style={{ paddingHorizontal: 7, paddingVertical: 2, borderRadius: 7, backgroundColor: prize.color + '15' }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: prize.color }}>{prize.rank}</Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#2C1810', marginBottom: 1 }}>{prize.prize}</Text>
                  <Text style={{ fontSize: 11, color: '#8C8278' }}>Valeur : {prize.value}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Buy ticket footer */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#E5E0D8', padding: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <Text style={{ flex: 1, fontSize: 14, color: '#6D4C41' }}>Quantité de billets</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 0 }}>
            <TouchableOpacity onPress={() => setTicketCount(n => Math.max(1, n - 1))} style={{ width: 36, height: 36, borderRadius: 10, borderWidth: 1.5, borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="ChevronLeft" size={18} color="#6D4C41" />
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#2C1810', width: 40, textAlign: 'center' }}>{ticketCount}</Text>
            <TouchableOpacity onPress={() => setTicketCount(n => Math.min(10, n + 1))} style={{ width: 36, height: 36, borderRadius: 10, borderWidth: 1.5, borderColor: '#E5E0D8', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="ChevronRight" size={18} color="#6D4C41" />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity style={{ height: 52, borderRadius: 16, backgroundColor: '#F9A825', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }} activeOpacity={0.85}>
          <Icon name="Ticket" size={18} color="#2C1810" />
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#2C1810' }}>
            Acheter {ticketCount} billet{ticketCount > 1 ? 's' : ''} · {total.toLocaleString()} XAF
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
