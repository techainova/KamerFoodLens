// src/services/recipes.service.ts
import apiClient from './api.client';
import { ENDPOINTS } from './config';

export interface RecipeIngredient {
  id: string;
  name: string;
  nameEN?: string;
  quantity: string;
  unit?: string;
  isChecked?: boolean;
}

export interface RecipeStep {
  id: string;
  order: number;
  title?: string;
  description: string;
  durationMin?: number;
  imageUrl?: string;
}

export interface Recipe {
  id: string;
  name: string;
  nameEN?: string;
  region: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  duration: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  calories?: number;
  rating: number;
  ratingCount: number;
  spiceLevel: 1 | 2 | 3 | 4 | 5;
  cookType: string;
  tags: string[];
  ingredients: RecipeIngredient[];
  steps: RecipeStep[];
  isFavorite?: boolean;
}

export interface TrendingDish {
  rank: number;
  dishId: string;
  name: string;
  nameEN?: string;
  scansWeek: number;
  region: string;
  imageUrl?: string;
}

export const recipesService = {
  async getTrending(): Promise<TrendingDish[]> {
    const { data } = await apiClient.get<TrendingDish[]>(ENDPOINTS.RECIPES_TRENDING);
    return data;
  },

  async getPopular(): Promise<Recipe[]> {
    const { data } = await apiClient.get<Recipe[]>(ENDPOINTS.RECIPES_POPULAR);
    return data;
  },

  async getDetail(recipeId: string): Promise<Recipe> {
    const { data } = await apiClient.get<Recipe>(`${ENDPOINTS.RECIPE_DETAIL}/${recipeId}`);
    return data;
  },

  async search(query: string, region?: string): Promise<Recipe[]> {
    const { data } = await apiClient.get<Recipe[]>(ENDPOINTS.RECIPES, { params: { q: query, region } });
    return data;
  },

  async searchByIngredients(ingredients: string[]): Promise<Recipe[]> {
    const { data } = await apiClient.post<Recipe[]>(`${ENDPOINTS.RECIPES}/by-ingredients`, { ingredients });
    return data;
  },

  async getSimilar(recipeId: string): Promise<Recipe[]> {
    const { data } = await apiClient.get<Recipe[]>(`${ENDPOINTS.RECIPE_DETAIL}/${recipeId}/similar`);
    return data;
  },
};
