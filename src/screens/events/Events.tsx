// src/screens/events/Events.tsx
// Liste événements — calendrier + filtres + inscriptions

import React, { useState } from 'react';
import {
  FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WFButton } from '@/components/ui';
import { colors, fontFamily, fontSize, radius, spacing } from '@/constants/theme';

type EventType = 'all' | 'conference' | 'workshop' | 'live' | 'festival';

const DAYS = ['Lun 24', 'Mar 25', 'Mer 26', 'Jeu 27', 'Ven 28', 'Sam 29', 'Dim 30'];

const MOCK_EVENTS = [
  {
    id: '1', type: 'festival', date: 'Sam 29 Nov', time: '14h00 — 22h00',
    title: 'Festival du Ndolé', org: 'Cameroon Food Heritage',
    location: 'Bonanjo, Douala', price: '5 000 XAF', spots: 248,
    badge: 'FESTIVAL',
  },
  {
    id: '2', type: 'workshop', date: 'Dim 30 Nov', time: '10h00 — 13h00',
    title: 'Atelier cuisson Mbongo', org: 'Chef Joëlle K.',
    location: 'En ligne', price: 'Gratuit', spots: 64,
    badge: 'ATELIER',
  },
  {
    id: '3', type: 'live', date: 'Lun 24 Nov', time: '20h00',
    title: 'Conférence Cuisine du Littoral', org: 'TechAINova',
    location: 'Live stream', price: 'Gratuit', spots: 500,
    badge: 'LIVE',
  },
];

const BADGE_COLORS: Record<string, string> = {
  FESTIVAL: colors.gold,
  ATELIER:  colors.green,
  LIVE:     colors.error,
};

export default function Events() {
  const [activeDay, setActiveDay]   = useState(2); // Mer 26
  const [activeType, setActiveType] = useState<EventType>('all');

  const TYPES: { key: EventType; label: string }[] = [
    { key: 'all',         label: 'Tous' },
    { key: 'conference',  label: 'Conférences' },
    { key: 'workshop',    label: 'Ateliers' },
    { key: 'live',        label: 'Lives' },
    { key: 'festival',    label: 'Festivals' },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      {/* AppBar */}
      <View style={styles.appBar}>
        <View style={styles.logo}>
          <View style={styles.logoCircle}><Text style={styles.logoText}>KFL</Text></View>
          <Text style={styles.title}>Événements</Text>
        </View>
        <TouchableOpacity accessibilityLabel="Filtrer"><Text style={styles.filterIcon}>⚙️</Text></TouchableOpacity>
      </View>

      {/* Calendrier horizontal */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={DAYS}
        keyExtractor={(d) => d}
        contentContainerStyle={styles.daysRow}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => setActiveDay(index)}
            style={[styles.dayBtn, index === activeDay && styles.dayBtnActive]}
            accessibilityLabel={item}
          >
            <Text style={[styles.dayNum, index === activeDay && styles.dayNumActive]}>
              {item.split(' ')[1]}
            </Text>
            <Text style={[styles.dayLabel, index === activeDay && styles.dayLabelActive]}>
              {item.split(' ')[0]}
            </Text>
            {index === 4 && <View style={styles.dayDot} />}
          </TouchableOpacity>
        )}
      />

      {/* Filtres type */}
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={TYPES}
        keyExtractor={(t) => t.key}
        contentContainerStyle={styles.filtersRow}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => setActiveType(item.key)}
            style={[styles.filterBtn, activeType === item.key && styles.filterBtnActive]}
          >
            <Text style={[styles.filterText, activeType === item.key && styles.filterTextActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Section Cette semaine */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.list}>
        <Text style={styles.sectionTitle}>Cette semaine / This week</Text>

        {MOCK_EVENTS.map((event) => (
          <View key={event.id} style={styles.eventCard}>
            {/* Image placeholder */}
            <View style={styles.eventImage}>
              <Text style={styles.eventEmoji}>📅</Text>
              <View style={[styles.eventBadge, { backgroundColor: BADGE_COLORS[event.badge] ?? colors.primary }]}>
                <Text style={styles.eventBadgeText}>{event.badge}</Text>
              </View>
              <View style={styles.dateBadge}>
                <Text style={styles.dateBadgeText}>{event.date.split(' ')[1]} {event.date.split(' ')[2]}</Text>
              </View>
            </View>

            {/* Infos */}
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{event.title}</Text>
              <Text style={styles.eventOrg}>Organisé par {event.org}</Text>

              <View style={styles.eventDetails}>
                <Text style={styles.eventDetail}>📅 {event.date}</Text>
                <Text style={styles.eventDetail}>⏰ {event.time}</Text>
                <Text style={styles.eventDetail}>📍 {event.location}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.eventSpots}>👥 {event.spots}</Text>
                  <WFButton
                    label={`S'inscrire — ${event.price}`}
                    onPress={() => {}}
                    size="sm"
                  />
                </View>
              </View>
            </View>
          </View>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: colors.cream },
  appBar:  { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  logo:    { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
  logoCircle: { width: 28, height: 28, borderRadius: 14, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontFamily: fontFamily.serifBold, fontSize: 10, color: colors.white },
  title:   { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink },
  filterIcon: { fontSize: 20, padding: spacing.xs },

  daysRow: { paddingHorizontal: spacing.md, paddingBottom: spacing.sm, gap: spacing.sm },
  dayBtn:  { width: 44, alignItems: 'center', paddingVertical: spacing.sm, borderRadius: radius.md },
  dayBtnActive:{ backgroundColor: colors.primary },
  dayNum:  { fontFamily: fontFamily.bold, fontSize: fontSize.lg, color: colors.ink },
  dayNumActive: { color: colors.white },
  dayLabel:{ fontFamily: fontFamily.regular, fontSize: fontSize.xs, color: colors.inkMute },
  dayLabelActive:{ color: colors.white },
  dayDot:  { width: 4, height: 4, borderRadius: 2, backgroundColor: colors.primary, marginTop: 2 },

  filtersRow: { paddingHorizontal: spacing.md, paddingBottom: spacing.md, gap: spacing.sm },
  filterBtn:  { paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface },
  filterBtnActive:{ backgroundColor: colors.primary, borderColor: colors.primary },
  filterText:     { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.inkMute },
  filterTextActive:{ color: colors.white },

  list:         { paddingHorizontal: spacing.md },
  sectionTitle: { fontFamily: fontFamily.bold, fontSize: fontSize.md, color: colors.ink, marginBottom: spacing.md },

  eventCard:    { backgroundColor: colors.surface, borderRadius: radius.lg, marginBottom: spacing.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  eventImage:   { height: 140, backgroundColor: colors.surface2, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  eventEmoji:   { fontSize: 48 },
  eventBadge:   { position: 'absolute', top: spacing.sm, left: spacing.sm, borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  eventBadgeText:{ fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.white },
  dateBadge:    { position: 'absolute', top: spacing.sm, right: spacing.sm, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: radius.sm, paddingHorizontal: spacing.sm, paddingVertical: 2 },
  dateBadgeText:{ fontFamily: fontFamily.bold, fontSize: fontSize.xs, color: colors.white },

  eventInfo:    { padding: spacing.md },
  eventTitle:   { fontFamily: fontFamily.serifBold, fontSize: fontSize.xl, color: colors.ink, marginBottom: 4 },
  eventOrg:     { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.inkMute, marginBottom: spacing.md },
  eventDetails: { gap: spacing.xs },
  eventDetail:  { fontFamily: fontFamily.regular, fontSize: fontSize.sm, color: colors.inkSoft },
  priceRow:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: spacing.sm },
  eventSpots:   { fontFamily: fontFamily.medium, fontSize: fontSize.sm, color: colors.inkMute },
});
