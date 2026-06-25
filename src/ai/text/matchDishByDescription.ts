// src/ai/text/matchDishByDescription.ts
// Reconnaissance d'un plat à partir d'une description texte libre (saisie au
// clavier ou transcrite depuis la voix), sans modèle ML — un plat de KFL n'a
// que quelques dizaines de variantes possibles, et la base de référence
// (`assets/.../dish_descriptions.json` via `src/ai/data/dish_descriptions.json`)
// ne contient que 6 entrées : un classifieur par recouvrement de mots-clés
// (ingrédients + nom du plat) est instantané, 100% local, et largement plus
// fiable ici qu'un modèle d'embeddings généraliste téléchargé pour l'occasion
// (qui ajouterait des dizaines de Mo et de la latence pour un gain nul sur un
// référentiel aussi petit). L'interface est volontairement la même que celle
// attendue par l'écran Résultat (`classId` + `confidence`), donc un vrai
// modèle de similarité sémantique pourra remplacer cette fonction plus tard
// sans toucher au reste de l'app.

import dishDescriptions from '../data/dish_descriptions.json';
import { UNKNOWN_CLASS } from '../interpretResult';

interface DishEntry {
  nomFR: string;
  nomEN: string;
  ingredients: string[];
}

const DB = dishDescriptions as Record<string, DishEntry>;

const STOPWORDS = new Set([
  'de', 'des', 'du', 'la', 'le', 'les', 'un', 'une', 'et', 'avec', 'dans',
  'pour', 'au', 'aux', 'en', 'sur', 'ou', 'qui', 'que', 'ce', 'cette', 'ca',
  'je', 'cherche', 'recherche', 'plat', 'contient', 'contenant', 'fait',
  'avec', 'tres', 'plus', 'comme', 'cest', 'il', 'y', 'a',
]);

function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function significantTokens(s: string): string[] {
  return normalize(s).split(' ').filter((tok) => tok.length > 2 && !STOPWORDS.has(tok));
}

export interface DescriptionMatch {
  classId: string;
  confidence: number; // heuristique, 0..1 — pour affichage uniquement
}

/**
 * Compare une description libre (FR) à la base de plats connus de KFL et
 * retourne le plat le plus probable, ou `UNKNOWN_CLASS` ("inconnu") si aucun
 * recouvrement suffisant n'est trouvé.
 */
export function matchDishByDescription(text: string): DescriptionMatch {
  const inputNorm = normalize(text);
  if (!inputNorm) return { classId: UNKNOWN_CLASS, confidence: 0 };
  const inputTokens = new Set(significantTokens(text));

  let bestId: string | null = null;
  let bestScore = 0;

  for (const [id, dish] of Object.entries(DB)) {
    let score = 0;

    // Mention directe du nom du plat — signal le plus fort. On teste la
    // phrase complète (ex. "ndolé") puis, si elle ne matche pas telle quelle
    // (ex. nom suivi d'un qualificatif régional comme "Riz Jollof (Ghana)"),
    // un recouvrement par mot-clé du nom (ex. juste "jollof").
    for (const name of [dish.nomFR, dish.nomEN]) {
      const nameNorm = normalize(name);
      if (!nameNorm) continue;
      if (inputNorm.includes(nameNorm)) {
        score += 4;
      } else {
        const nameTokens = significantTokens(name);
        const hits = nameTokens.filter((tok) => inputTokens.has(tok)).length;
        score += Math.min(hits * 2, 4);
      }
    }

    for (const ingredient of dish.ingredients) {
      const ingNorm = normalize(ingredient);
      if (ingNorm && inputNorm.includes(ingNorm)) {
        score += 3; // phrase ingrédient complète retrouvée telle quelle
        continue;
      }
      const ingTokens = significantTokens(ingredient);
      const hits = ingTokens.filter((tok) => inputTokens.has(tok)).length;
      score += Math.min(hits, 2); // recouvrement partiel, plafonné
    }

    if (score > bestScore) {
      bestScore = score;
      bestId = id;
    }
  }

  // Sous ce seuil, le recouvrement est trop faible pour être fiable.
  if (!bestId || bestScore < 2) {
    return { classId: UNKNOWN_CLASS, confidence: 0 };
  }

  const confidence = Math.max(0.35, Math.min(0.95, 0.35 + bestScore * 0.08));
  return { classId: bestId, confidence };
}
