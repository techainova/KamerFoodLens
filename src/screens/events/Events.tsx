import React, { useState } from 'react';
import {
  View, ScrollView, TouchableOpacity, StatusBar,
} from 'react-native';
import { Text } from '@/components/ui/ScaledText';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Icon from '@/components/ui/Icon';
import { useColors } from '@/hooks/useAppTheme';

const SHADOW_SM = { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.07, shadowRadius: 4, elevation: 2 };
const SHADOW_MD = { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 6, elevation: 4 };

const FILTERS = ['Tous', 'En ligne', 'Présentiel', 'Gratuit', 'Cette semaine'];

const EVENTS = [
  {
    id: '1',
    title: 'Masterclass Mbongo Tchobi avec Chef Amina',
    type: 'En ligne',
    typeColor: '#1A237E',
    date: '22 Juin',
    time: '14h00',
    duration: '2h',
    location: 'Zoom',
    price: 0,
    seats: 12,
    registered: false,
    featured: true,
    organizer: 'Chef Amina',
    organizerInitials: 'CA',
    organizerColor: '#E8591A',
    tag: 'Technique',
    tagColor: '#2E7D32',
  },
  {
    id: '2',
    title: 'Festival de la gastronomie camerounaise — Douala',
    type: 'Présentiel',
    typeColor: '#E8591A',
    date: '28–30 Juin',
    time: '10h00',
    duration: '3 jours',
    location: 'Palais des Congrès, Douala',
    price: 5000,
    seats: 500,
    registered: true,
    featured: true,
    organizer: 'KFL & Partenaires',
    organizerInitials: 'KF',
    organizerColor: '#E8591A',
    tag: 'Festival',
    tagColor: '#F9A825',
  },
  {
    id: '3',
    title: 'Atelier Ndolé & Plantains — Yaoundé',
    type: 'Présentiel',
    typeColor: '#E8591A',
    date: '5 Juil.',
    time: '09h00',
    duration: '3h',
    location: 'Centre Culinaire, Yaoundé',
    price: 15000,
    seats: 8,
    registered: false,
    featured: false,
    organizer: 'École de Cuisine Cam',
    organizerInitials: 'EC',
    organizerColor: '#2E7D32',
    tag: 'Atelier',
    tagColor: '#E8591A',
  },
  {
    id: '4',
    title: 'Quiz Gastronomie Camerounaise — Live',
    type: 'En ligne',
    typeColor: '#1A237E',
    date: '12 Juil.',
    time: '19h00',
    duration: '1h30',
    location: 'KFL Live',
    price: 0,
    seats: 100,
    registered: false,
    featured: false,
    organizer: 'KFL Team',
    organizerInitials: 'KT',
    organizerColor: '#E8591A',
    tag: 'Jeu',
    tagColor: '#F9A825',
  },
];

export default function Events() {
  const navigation = useNavigation<any>();
  const C = useColors();
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [events, setEvents] = useState(EVENTS);

  const filtered = events.filter(e => {
    if (activeFilter === 'En ligne') return e.type === 'En ligne';
    if (activeFilter === 'Présentiel') return e.type === 'Présentiel';
    if (activeFilter === 'Gratuit') return e.price === 0;
    if (activeFilter === 'Cette semaine') return ['22 Juin', '28–30 Juin'].includes(e.date);
    return true;
  });

  const toggleRegister = (id: string) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, registered: !e.registered } : e));
  };

  const featured = filtered.filter(e => e.featured);
  const regular = filtered.filter(e => !e.featured);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.cream }}>
      <StatusBar barStyle={C.statusBar} />

      {/* AppBar */}
      <View style={{ height: 56, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.surface, borderBottomWidth: 1, borderColor: C.border }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ padding: 4 }}>
          <Icon name="ArrowLeft" size={22} color="#2C1810" />
        </TouchableOpacity>
        <Text style={{ flex: 1, fontFamily: 'PlayfairDisplay-Bold', fontSize: 20, color: C.ink }}>Événements</Text>
        <TouchableOpacity style={{ width: 38, height: 38, borderRadius: 19, borderWidth: 1, borderColor: C.border, alignItems: 'center', justifyContent: 'center' }}>
          <Icon name="Bell" size={17} color="#6D4C41" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10, gap: 8 }} style={{ backgroundColor: C.surface, maxHeight: 52, borderBottomWidth: 1, borderColor: C.border }}>
        {FILTERS.map(f => (
          <TouchableOpacity
            key={f}
            onPress={() => setActiveFilter(f)}
            style={{ paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: f === activeFilter ? '#E8591A' : '#F5F0EB', borderWidth: 1, borderColor: f === activeFilter ? '#E8591A' : '#E5E0D8' }}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: f === activeFilter ? '#fff' : '#6D4C41' }}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 100 }} showsVerticalScrollIndicator={false}>

        {/* Featured */}
        {featured.length > 0 && (
          <View style={{ paddingTop: 16 }}>
            <Text style={{ paddingHorizontal: 16, fontSize: 13, fontWeight: '600', color: C.inkSoft, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5 }}>À la une</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}>
              {featured.map(event => (
                <TouchableOpacity
                  key={event.id}
                  onPress={() => navigation.navigate('EventDetail', { event })}
                  activeOpacity={0.85}
                  style={{ width: 260, backgroundColor: C.surface, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: C.border, ...SHADOW_MD }}
                >
                  {/* Hero */}
                  <View style={{ height: 130, backgroundColor: C.surface2, alignItems: 'center', justifyContent: 'center' }}>
                    <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: event.organizerColor + '20', borderWidth: 2, borderColor: event.organizerColor + '40', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                      <Text style={{ fontSize: 20, fontWeight: '700', color: event.organizerColor }}>{event.organizerInitials[0]}</Text>
                    </View>
                    {/* Type badge */}
                    <View style={{ position: 'absolute', top: 10, left: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: event.typeColor }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff' }}>{event.type}</Text>
                    </View>
                    {/* Price badge */}
                    <View style={{ position: 'absolute', top: 10, right: 10, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, backgroundColor: event.price === 0 ? '#E3F0E4' : '#FBF3DC' }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: event.price === 0 ? '#2E7D32' : '#F9A825' }}>{event.price === 0 ? 'Gratuit' : `${event.price.toLocaleString()} XAF`}</Text>
                    </View>
                  </View>

                  <View style={{ padding: 14 }}>
                    <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, lineHeight: 20, marginBottom: 8 }} numberOfLines={2}>{event.title}</Text>

                    <View style={{ gap: 5, marginBottom: 12 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Icon name="Calendar" size={13} color="#E8591A" />
                        <Text style={{ fontSize: 12, color: C.inkSoft }}>{event.date} · {event.time}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        <Icon name="MapPin" size={13} color="#8C8278" />
                        <Text style={{ fontSize: 12, color: C.inkMute }} numberOfLines={1}>{event.location}</Text>
                      </View>
                    </View>

                    <TouchableOpacity
                      onPress={() => toggleRegister(event.id)}
                      style={{ paddingVertical: 9, borderRadius: 12, backgroundColor: event.registered ? '#E3F0E4' : '#E8591A', alignItems: 'center' }}
                    >
                      <Text style={{ fontSize: 13, fontWeight: '700', color: event.registered ? '#2E7D32' : '#fff' }}>
                        {event.registered ? 'Inscrit' : "S'inscrire"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Regular list */}
        {regular.length > 0 && (
          <View style={{ paddingHorizontal: 16, paddingTop: 20, gap: 12 }}>
            <Text style={{ fontSize: 13, fontWeight: '600', color: C.inkSoft, textTransform: 'uppercase', letterSpacing: 0.5 }}>Prochains événements</Text>

            {regular.map(event => (
              <TouchableOpacity
                key={event.id}
                onPress={() => navigation.navigate('EventDetail', { event })}
                activeOpacity={0.85}
                style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: 'hidden', ...SHADOW_SM }}
              >
                <View style={{ flexDirection: 'row' }}>
                  {/* Date column */}
                  <View style={{ width: 64, backgroundColor: '#E8591A', alignItems: 'center', justifyContent: 'center', paddingVertical: 16 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>{event.date.split(' ')[1] ?? ''}</Text>
                    <Text style={{ fontSize: 22, fontWeight: '700', color: '#fff', lineHeight: 26 }}>{event.date.split(' ')[0] ?? event.date}</Text>
                  </View>

                  {/* Info */}
                  <View style={{ flex: 1, padding: 14 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <View style={{ paddingHorizontal: 7, paddingVertical: 2, borderRadius: 7, backgroundColor: event.tagColor + '15' }}>
                        <Text style={{ fontSize: 10, fontWeight: '700', color: event.tagColor }}>{event.tag}</Text>
                      </View>
                      <View style={{ paddingHorizontal: 7, paddingVertical: 2, borderRadius: 7, backgroundColor: event.typeColor + '15' }}>
                        <Text style={{ fontSize: 10, fontWeight: '600', color: event.typeColor }}>{event.type}</Text>
                      </View>
                    </View>

                    <Text style={{ fontSize: 14, fontWeight: '700', color: C.ink, marginBottom: 6 }} numberOfLines={2}>{event.title}</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Icon name="Clock" size={12} color="#8C8278" />
                        <Text style={{ fontSize: 11, color: C.inkMute }}>{event.time} · {event.duration}</Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                        <Icon name="Users" size={12} color="#8C8278" />
                        <Text style={{ fontSize: 11, color: C.inkMute }}>{event.seats} places</Text>
                      </View>
                    </View>
                  </View>

                  <TouchableOpacity
                    onPress={() => toggleRegister(event.id)}
                    style={{ paddingRight: 14, justifyContent: 'center' }}
                  >
                    <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: event.registered ? '#E3F0E4' : '#E8591A15', borderWidth: 1.5, borderColor: event.registered ? '#2E7D32' : '#E8591A40', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name={event.registered ? 'Check' : 'Plus'} size={15} color={event.registered ? '#2E7D32' : '#E8591A'} />
                    </View>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {filtered.length === 0 && (
          <View style={{ alignItems: 'center', paddingTop: 80 }}>
            <Icon name="Calendar" size={48} color="rgba(140,130,120,0.3)" />
            <Text style={{ fontSize: 16, color: C.inkMute, marginTop: 12 }}>Aucun événement</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
