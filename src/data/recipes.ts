// src/data/recipes.ts
// Recettes populaires — données partagées entre HomeV1/V2/V3 et AllRecipes

export interface Recipe {
  id: string;
  name: string;
  region: string;
  time: string;
  diff: 'easy' | 'medium' | 'hard';
  scans: number;
  image?: number;
}

export const RECIPES: Recipe[] = [
  { id: 'ndole',    name: 'Ndolé',         region: 'Littoral',   time: '45 min', diff: 'easy',   scans: 420, image: require('../../assets/dishes/ndole.jpg') },
  { id: 'pouletdg', name: 'Poulet DG',     region: 'Centre',     time: '60 min', diff: 'medium', scans: 340, image: require('../../assets/dishes/pouletdg.jpg') },
  { id: 'mbongo',   name: 'Mbongo Tchobi', region: 'Sud',        time: '90 min', diff: 'hard',   scans: 260, image: require('../../assets/dishes/mbongo.jpg') },
  { id: 'eru',      name: 'Eru',           region: 'Sud-Ouest',  time: '75 min', diff: 'medium', scans: 198, image: require('../../assets/dishes/eru.jpg') },
  { id: 'koki',     name: 'Koki',          region: 'Ouest',      time: '120 min', diff: 'hard',  scans: 154 },
  { id: 'achu',     name: 'Achu',          region: 'Nord-Ouest', time: '100 min', diff: 'hard',  scans: 132 },
];

export const DIFF_LABELS: Record<Recipe['diff'], string> = {
  easy: 'Facile',
  medium: 'Intermédiaire',
  hard: 'Difficile',
};
