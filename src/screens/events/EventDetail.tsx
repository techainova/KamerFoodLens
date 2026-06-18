import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, SafeAreaView, StatusBar,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };

const DEFAULT_EVENT = {
  id: '1',
  title: 'Masterclass Mbongo Tchobi avec Chef Amina',
  type: 'En ligne',
  typeColor: '#1A237E',
  date: '22 Juin 2024',
  time: '14h00',
  duration: '2h',
  location: 'Zoom (lien envoyé après inscription)',
  price: 0,
  seats: 12,
  registered: false,
  organizer: 'Chef Amina Fouda',
  organizerInitials: 'CA',
  organizerColor: '#E8591A',
  organizerBio: 'Chef certifiée, spécialiste de la cuisine du Littoral camerounais. 15 ans d\'expérience.',
  tag: 'Technique',
  tagColor: '#2E7D32',
  description: 'Rejoignez Chef Amina pour une masterclass exclusive sur le Mbongo Tchobi traditionnel. Vous apprendrez les secrets des épices, la technique de cuisson longue et les variantes régionales.',
  program: [
    { time: '14h00', label: 'Introduction & présentation des ingrédients' },
    { time: '14h20', label: 'Préparation des épices : njansang, écorces HK' },
    { time: '14h50', label: 'Démonstration de cuisson — sauce noire' },
    { time: '15h20', label: 'Assemblage & ajustement des saveurs' },
    { time: '15h50', label: 'Q&R & dégustation virtuelle' },
  ],
  attendees: 38,
  totalSeats: 50,
};

export default function EventDetail() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const route = useRoute<any>();
  const event = { ...DEFAULT_EVENT, ...(route.params?.event ?? {}) };

  const [registered, setRegistered] = useState(event.registered);
  const [saved, setSaved] = useState(false);

  const progress = Math.min((event.attendees / event.totalSeats) * 100, 100);
  const remaining = event.totalSeats - event.attendees;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle="light-content" />

      {/* Hero */}
      <View style={{ height: 220, backgroundColor: '#2C1810', justifyContent: 'flex-end', padding: 20 }}>
        {/* Back & actions */}
        <View style={{ position: 'absolute', top: 16, left: 0, right: 0, flexDirection: 'row', paddingHorizontal: 16, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="ArrowLeft" size={20} color="#fff" />
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
          <TouchableOpacity onPress={() => setSaved(s => !s)} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
            <Icon name="Bookmark" size={18} color={saved ? '#F9A825' : '#fff'} fill={saved ? '#F9A825' : 'none'} />
          </TouchableOpacity>
          <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}>
            <Icon name="Share2" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Badges */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
          <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: event.typeColor }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>{event.type}</Text>
          </View>
          <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: event.tagColor }}>
            <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>{event.tag}</Text>
          </View>
          {event.price === 0 && (
            <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, backgroundColor: '#2E7D32' }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>Gratuit</Text>
            </View>
          )}
        </View>

        <Text style={{ fontSize: 20, fontFamily: 'PlayfairDisplay-Bold', color: '#fff', lineHeight: 28 }}>{event.title}</Text>
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>

        {/* Info chips */}
        <View style={{ backgroundColor: C.surface, paddingHorizontal: 16, paddingVertical: 16, borderBottomWidth: 1, borderColor: C.border, gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#E8591A15', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Calendar" size={15} color="#E8591A" />
            </View>
            <Text style={{ fontSize: 14, color: C.ink, fontWeight: '600' }}>{event.date} · {event.time}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#E8591A15', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="Clock" size={15} color="#E8591A" />
            </View>
            <Text style={{ fontSize: 14, color: C.inkSoft }}>Durée : {event.duration}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: '#E8591A15', alignItems: 'center', justifyContent: 'center' }}>
              <Icon name="MapPin" size={15} color="#E8591A" />
            </View>
            <Text style={{ fontSize: 14, color: C.inkSoft }} numberOfLines={1}>{event.location}</Text>
          </View>
        </View>

        {/* Seats progress */}
        <View style={{ marginHorizontal: 16, marginTop: 16, backgroundColor: C.surface, borderRadius: 16, padding: 14, borderWidth: 1, borderColor: C.border, ...SHADOW_SM }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: C.ink }}>Places disponibles</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: remaining <= 5 ? '#C62828' : '#2E7D32' }}>
              {remaining} restantes
            </Text>
          </View>
          <View style={{ height: 6, backgroundColor: C.surface2, borderRadius: 3, overflow: 'hidden' }}>
            <View style={{ height: '100%', width: `${progress}%`, backgroundColor: progress >= 80 ? '#C62828' : '#E8591A', borderRadius: 3 }} />
          </View>
          <Text style={{ fontSize: 11, color: C.inkMute, marginTop: 6 }}>{event.attendees}/{event.totalSeats} inscrits</Text>
        </View>

        {/* Description */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <Text style={{ fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 10 }}>Description</Text>
          <Text style={{ fontSize: 14, color: C.inkSoft, lineHeight: 22 }}>{event.description}</Text>
        </View>

        {/* Programme */}
        <View style={{ paddingHorizontal: 16, paddingTop: 20 }}>
          <Text style={{ fontSize: 16, fontFamily: 'PlayfairDisplay-Bold', color: C.ink, marginBottom: 12 }}>Programme</Text>
          <View style={{ gap: 0 }}>
            {event.program.map((item: { time: string; label: string }, i: number) => (
              <View key={i} style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ alignItems: 'center', width: 20 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#E8591A', marginTop: 4 }} />
                  {i < event.program.length - 1 && <View style={{ width: 1.5, flex: 1, backgroundColor: '#E5E0D8', marginTop: 2 }} />}
                </View>
                <View style={{ paddingBottom: 16 }}>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: '#E8591A', marginBottom: 2 }}>{item.time}</Text>
                  <Text style={{ fontSize: 14, color: C.ink }}>{item.label}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Organizer */}
        <View style={{ marginHorizontal: 16, marginTop: 20, backgroundColor: C.surface, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border, flexDirection: 'row', gap: 12, alignItems: 'flex-start', ...SHADOW_SM }}>
          <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: event.organizerColor + '20', borderWidth: 2, borderColor: event.organizerColor + '40', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: event.organizerColor }}>{event.organizerInitials[0]}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, marginBottom: 2 }}>{event.organizer}</Text>
            <Text style={{ fontSize: 12, color: C.inkSoft, lineHeight: 18 }}>{event.organizerBio}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: 16, backgroundColor: C.surface, borderTopWidth: 1, borderColor: C.border }}>
        {event.price > 0 && (
          <Text style={{ fontSize: 18, fontWeight: '700', color: C.ink, textAlign: 'center', marginBottom: 10 }}>
            {event.price.toLocaleString()} XAF
          </Text>
        )}
        <TouchableOpacity
          onPress={() => setRegistered((r: boolean) => !r)}
          style={{ height: 52, borderRadius: 16, backgroundColor: registered ? '#E3F0E4' : '#E8591A', alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8 }}
          activeOpacity={0.85}
        >
          <Icon name={registered ? 'Check' : 'Calendar'} size={18} color={registered ? '#2E7D32' : '#fff'} />
          <Text style={{ fontSize: 16, fontWeight: '700', color: registered ? '#2E7D32' : '#fff' }}>
            {registered ? 'Inscription confirmée' : "S'inscrire"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
