// src/ai/dishDescriptions.ts
// Charge et expose les descriptions détaillées des plats reconnus.

import data from './data/dish_descriptions.json';

export interface DishDescription {
  nomFR: string;
  nomEN: string;
  region: string;
  description: string;
  ingredients: string[];
  tempsPreparationMin: number;
  niveauEpice: number;
  accompagnements: string[];
}

type DishDescriptionsMap = Record<string, DishDescription>;

const DISH_DESCRIPTIONS = data as DishDescriptionsMap;

/**
 * Retourne la description détaillée d'un plat à partir de son identifiant
 * de classe (ex: "ndole"). Retourne null si la classe est absente du
 * référentiel — c'est toujours le cas pour la classe "inconnu".
 */
export function getDishDescription(classId: string): DishDescription | null {
  return DISH_DESCRIPTIONS[classId] ?? null;
}
