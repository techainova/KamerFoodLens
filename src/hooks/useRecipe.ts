// src/hooks/useRecipe.ts
// Logique fiche recette — chargement + onglets + portions + cook mode

import { useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import type { RouteProp } from '@react-navigation/native-stack';
import type { ScannerStackParams } from '@/navigation/types';
import apiClient from '@/services/api.client';

type Route = RouteProp<ScannerStackParams, 'Recipe'>;

export type RecipeTab = 'ingredients' | 'steps' | 'nutrition' | 'reviews';

export interface Ingredient {
  id:       string;
  qty:      string;
  unit:     string;
  name:     string;
  nameEN:   string;
  checked:  boolean;
}

export interface RecipeStep {
  number:   number;
  text:     string;
  duration?: number; // minutes
}

export interface RecipeData {
  id:          string;
  name:        string;
  region:      string;
  duration:    number;
  servings:    number;
  calories:    number;
  rating:      number;
  ratingCount: number;
  videoUrl?:   string;
  ingredients: Ingredient[];
  steps:       RecipeStep[];
}

async function fetchRecipe(dishId: string): Promise<RecipeData> {
  const { data } = await apiClient.get(`/recipes/${dishId}`);
  return data;
}

export function useRecipe() {
  const route       = useRoute<Route>();
  const { dishId }  = route.params;

  const [activeTab, setActiveTab]   = useState<RecipeTab>('ingredients');
  const [servings, setServings]     = useState(4);
  const [cookMode, setCookMode]     = useState(false);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const recipe = useQuery({
    queryKey: ['recipe', dishId],
    queryFn:  () => fetchRecipe(dishId),
  });

  function toggleIngredient(id: string) {
    setCheckedItems((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function incrementServings() { setServings((s) => Math.min(s + 1, 20)); }
  function decrementServings() { setServings((s) => Math.max(s - 1, 1)); }

  return {
    recipe, dishId, activeTab, servings, cookMode, checkedItems,
    setActiveTab, toggleIngredient,
    incrementServings, decrementServings,
    startCookMode: () => setCookMode(true),
    exitCookMode:  () => setCookMode(false),
  };
}
