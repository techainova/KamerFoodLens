// src/screens/home/story-stickers/storyFilters.ts
// Recette de rendu partagée par l'éditeur ET le viewer — un filtre stocké côté
// story (juste un nom) doit produire le même overlay visuel aux deux endroits.

export interface StoryFilterDef {
  key: string;
  label: string;
  overlayColor: string;
}

export const STORY_FILTERS: StoryFilterDef[] = [
  { key: 'none', label: 'Normal', overlayColor: 'transparent' },
  { key: 'warm', label: 'Chaud', overlayColor: 'rgba(255,150,60,0.16)' },
  { key: 'cool', label: 'Frais', overlayColor: 'rgba(60,150,255,0.16)' },
  { key: 'vintage', label: 'Vintage', overlayColor: 'rgba(140,100,50,0.22)' },
  { key: 'mono', label: 'N&B', overlayColor: 'rgba(20,20,20,0.4)' },
  { key: 'fade', label: 'Estompé', overlayColor: 'rgba(255,255,255,0.28)' },
  { key: 'vivid', label: 'Vif', overlayColor: 'rgba(230,60,120,0.10)' },
  { key: 'dusk', label: 'Crépuscule', overlayColor: 'rgba(90,40,120,0.20)' },
];

export function getStoryFilterOverlay(key: string | undefined): string {
  return STORY_FILTERS.find((f) => f.key === key)?.overlayColor ?? 'transparent';
}

export const STORY_BACKGROUNDS: { solid?: string; gradient?: string[] }[] = [
  { solid: '#1A237E' },
  { solid: '#E8591A' },
  { solid: '#F9A825' },
  { solid: '#2C1810' },
  { gradient: ['#2E7D32', '#E8591A'] },
  { gradient: ['#1A237E', '#9C27B0'] },
  { gradient: ['#F9A825', '#E8591A'] },
];
