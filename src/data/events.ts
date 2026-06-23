// src/data/events.ts
// Événements de la semaine — données partagées entre HomeV1 et AllEvents

export interface WeeklyEvent {
  id: string;
  title: string;
  location: string;
  dateLabel: string;
  timeRange: string;
  attendees: number;
  image?: number;
}

export const WEEKLY_EVENTS: WeeklyEvent[] = [
  { id: 'festival-ndole', title: 'Festival du Ndolé · Douala', location: 'Bonanjo, Douala', dateLabel: 'SAM. 28 NOV', timeRange: '14h–22h', attendees: 248, image: require('../../assets/dishes/festival.jpg') },
  { id: 'atelier-eru',    title: "Atelier cuisine : l'Eru",     location: 'Buea, Sud-Ouest',  dateLabel: 'DIM. 29 NOV', timeRange: '10h–13h', attendees: 64 },
  { id: 'marche-nuit',    title: 'Marché nocturne des saveurs',  location: 'Yaoundé, Centre',  dateLabel: 'VEN. 4 DÉC',  timeRange: '17h–23h', attendees: 312 },
  { id: 'concours-chef',  title: 'Concours du meilleur jeune chef', location: 'Bafoussam, Ouest', dateLabel: 'SAM. 12 DÉC', timeRange: '12h–18h', attendees: 97 },
];
