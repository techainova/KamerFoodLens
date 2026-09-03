// src/ai/text/matchDishByDescription.ts
// Reconnaissance d'un plat à partir d'une description texte libre (saisie au
// clavier ou transcrite depuis la voix), sans modèle ML.
// La base `dish_descriptions.json` liste les plats camerounais connus.
// L'interface est identique à celle attendue par l'écran Résultat (`classId`
// + `confidence`), ce qui permet un futur remplacement par un modèle
// d'embeddings sans toucher au reste de l'app.

import dishDescriptions from '../data/dish_descriptions.json';
import { UNKNOWN_CLASS } from '../interpretResult';

interface DishEntry {
  nomFR: string;
  nomEN: string;
  ingredients: string[];
  aliases?: string[];
}

const DB = dishDescriptions as Record<string, DishEntry>;

const STOPWORDS = new Set([
  'de', 'des', 'du', 'la', 'le', 'les', 'un', 'une', 'et', 'avec', 'dans',
  'pour', 'au', 'aux', 'en', 'sur', 'ou', 'qui', 'que', 'ce', 'cette', 'ca',
  'je', 'cherche', 'recherche', 'plat', 'contient', 'contenant', 'fait',
  'tres', 'plus', 'comme', 'cest', 'il', 'y', 'a', 'est', 'sont', 'voir',
  'mange', 'manger', 'veux', 'voudrais', 'voulez',
]);

// Common Whisper transcription errors for Cameroonian words
const PHONETIC_MAP: Record<string, string> = {
  'endolé': 'ndolé',
  'andole': 'ndole',
  'un dolé': 'ndole',
  'un dole': 'ndole',
  'indole': 'ndole',
  'ndolée': 'ndole',
  'aidole': 'ndole',
  'palme': 'palme',
  'poulet dg': 'poulet dg',
  'poulet tg': 'poulet dg',
  'poule dg': 'poulet dg',
  'mbongot': 'mbongo',
  'mboncho': 'mbongo',
  'mbonjo': 'mbongo',
  'woakye': 'waakye',
  'waki': 'waakye',
  'waaki': 'waakye',
  'écoang': 'ekwang',
  'écouang': 'ekwang',
  'aquang': 'ekwang',
  'jolloff': 'jollof',
  'joloff': 'jollof',
  'cocoyam': 'cocoyam',
};

function applyPhoneticFixes(s: string): string {
  let result = s;
  for (const [typo, correct] of Object.entries(PHONETIC_MAP)) {
    result = result.replace(new RegExp(typo, 'gi'), correct);
  }
  return result;
}

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
 * Compare une description libre (FR ou EN) à la base de plats connus de KFL
 * et retourne le plat le plus probable, ou `UNKNOWN_CLASS` ("inconnu") si aucun
 * recouvrement suffisant n'est trouvé. Gère les variantes phonétiques
 * issues des transcriptions Whisper de l'accent camerounais.
 */
export function matchDishByDescription(rawText: string): DescriptionMatch {
  const fixed = applyPhoneticFixes(rawText);
  const inputNorm = normalize(fixed);
  if (!inputNorm) return { classId: UNKNOWN_CLASS, confidence: 0 };
  const inputTokens = new Set(significantTokens(fixed));

  let bestId: string | null = null;
  let bestScore = 0;

  for (const [id, dish] of Object.entries(DB)) {
    let score = 0;

    // 1. Direct alias / name match — strongest signal (+5 for exact alias)
    const allAliases = dish.aliases ?? [];
    for (const alias of allAliases) {
      const aliasNorm = normalize(alias);
      if (aliasNorm && inputNorm.includes(aliasNorm)) {
        score += 5;
        break;
      }
    }

    // 2. French / English name match (+4 exact, or partial token)
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

    // 3. Ingredient match (+3 for full phrase, +1 per overlapping token, cap 2)
    for (const ingredient of dish.ingredients) {
      const ingNorm = normalize(ingredient);
      if (ingNorm && inputNorm.includes(ingNorm)) {
        score += 3;
        continue;
      }
      const ingTokens = significantTokens(ingredient);
      const hits = ingTokens.filter((tok) => inputTokens.has(tok)).length;
      score += Math.min(hits, 2);
    }

    if (score > bestScore) {
      bestScore = score;
      bestId = id;
    }
  }

  // Threshold: need at least 2 points to avoid spurious matches
  if (!bestId || bestScore < 2) {
    return { classId: UNKNOWN_CLASS, confidence: 0 };
  }

  const confidence = Math.max(0.35, Math.min(0.95, 0.35 + bestScore * 0.07));
  return { classId: bestId, confidence };
}
