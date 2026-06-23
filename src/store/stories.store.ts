// src/store/stories.store.ts
// Histoires de plats — données partagées entre HomeV1, AllStories, StoriesViewer, AddStory.
// Chaque histoire appartient à un auteur (utilisateur ou restaurant) et expire après 24h.

import { create } from 'zustand';

export const ONE_DAY_MS = 24 * 60 * 60 * 1000;

export function isStoryActive(createdAt: number): boolean {
  return Date.now() - createdAt < ONE_DAY_MS;
}

export interface DishStory {
  id: string;
  authorId: string;
  authorName: string;
  dishName: string;
  region: string;
  image: number;
  caption: string;
  createdAt: number;
}

const now = Date.now();

// Histoires de référence KFL — postées par des restaurants partenaires, "fraîches" (< 24h)
export const SEED_STORIES: DishStory[] = [
  { id: 'ndole',    authorId: 'mama-pauline', authorName: 'Chez Mama Pauline', dishName: 'Ndolé',     region: 'Littoral',  image: require('../../assets/dishes/ndole.jpg'),    caption: 'Le plat national camerounais, mijoté avec amour depuis des générations.', createdAt: now - 2 * 60 * 60 * 1000 },
  { id: 'pouletdg', authorId: 'resto-etoile', authorName: 'Restaurant Étoile', dishName: 'Poulet DG', region: 'Centre',    image: require('../../assets/dishes/pouletdg.jpg'), caption: 'Poulet sauté aux plantains, un classique des grandes occasions.', createdAt: now - 5 * 60 * 60 * 1000 },
  { id: 'mbongo',   authorId: 'saveurs-sud',  authorName: 'Saveurs du Sud',    dishName: 'Mbongo',    region: 'Sud',       image: require('../../assets/dishes/mbongo.jpg'),   caption: 'La sauce noire mystérieuse et fumée du Sud Cameroun.', createdAt: now - 8 * 60 * 60 * 1000 },
  { id: 'eru',      authorId: 'chef-joel',    authorName: 'Chef Joël',        dishName: 'Eru',       region: 'Sud-Ouest', image: require('../../assets/dishes/eru.jpg'),      caption: "Feuilles d'eru et fufu de manioc, spécialité du Sud-Ouest.", createdAt: now - 14 * 60 * 60 * 1000 },
];

export interface MyStory {
  id: string;
  uri: string;
  caption: string;
  createdAt: number;
}

export interface StoryGroup {
  authorId: string;
  authorName: string;
  isMine: boolean;
  stories: { id: string; image: number | string; caption: string; createdAt: number; dishName: string; region: string }[];
}

interface StoriesState {
  myStories: MyStory[];
  addMyStory: (s: Omit<MyStory, 'id'>) => void;
  deleteMyStory: (id: string) => void;
}

export const useStoriesStore = create<StoriesState>((set) => ({
  myStories: [],
  addMyStory: (s) => set((state) => ({
    myStories: [...state.myStories, { ...s, id: `me-${Date.now()}` }],
  })),
  deleteMyStory: (id) => set((state) => ({
    myStories: state.myStories.filter((s) => s.id !== id),
  })),
}));

export function getActiveSeedStories(): DishStory[] {
  return SEED_STORIES.filter((s) => isStoryActive(s.createdAt));
}

export function buildStoryGroups(myStories: MyStory[]): StoryGroup[] {
  const groups: StoryGroup[] = [];

  const activeMine = myStories.filter((s) => isStoryActive(s.createdAt));
  if (activeMine.length > 0) {
    groups.push({
      authorId: 'me',
      authorName: 'Vous',
      isMine: true,
      stories: activeMine
        .sort((a, b) => a.createdAt - b.createdAt)
        .map((s) => ({ id: s.id, image: s.uri, caption: s.caption, createdAt: s.createdAt, dishName: '', region: '' })),
    });
  }

  const byAuthor = new Map<string, DishStory[]>();
  for (const s of getActiveSeedStories()) {
    const list = byAuthor.get(s.authorId) ?? [];
    list.push(s);
    byAuthor.set(s.authorId, list);
  }
  for (const [authorId, stories] of byAuthor) {
    groups.push({
      authorId,
      authorName: stories[0].authorName,
      isMine: false,
      stories: stories
        .sort((a, b) => a.createdAt - b.createdAt)
        .map((s) => ({ id: s.id, image: s.image, caption: s.caption, createdAt: s.createdAt, dishName: s.dishName, region: s.region })),
    });
  }

  return groups;
}
