// src/hooks/useHome.ts
// Logique écran Home — données tendances + recettes populaires + navigation

import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeStackParams } from '@/navigation/types';
import apiClient from '@/services/api.client';

type Nav = NativeStackNavigationProp<HomeStackParams, 'HomeScreen'>;

export interface TrendingItem {
  rank:       number;
  dishId:     string;
  name:       string;
  scansWeek:  number;
  region:     string;
  imageUrl?:  string;
}

export interface RecipeCard {
  id:         string;
  name:       string;
  region:     string;
  imageUrl?:  string;
  duration:   number;
}

async function fetchTrending(): Promise<TrendingItem[]> {
  const { data } = await apiClient.get('/dishes/trending');
  return data;
}

async function fetchPopularRecipes(): Promise<RecipeCard[]> {
  const { data } = await apiClient.get('/recipes/popular');
  return data;
}

export function useHome() {
  const navigation = useNavigation<Nav>();

  const trending = useQuery({
    queryKey: ['trending'],
    queryFn:  fetchTrending,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const recipes = useQuery({
    queryKey: ['popularRecipes'],
    queryFn:  fetchPopularRecipes,
    staleTime: 5 * 60 * 1000,
  });

  function goScanner()                    { navigation.navigate('Scanner' as any); }
  function goSearch()                     { navigation.navigate('Search'  as any); }
  function goNotifications()              { navigation.navigate('Notifications'); }
  function goDishDetail(dishId: string)   { navigation.navigate('DishDetail', { dishId }); }

  return {
    trending,
    recipes,
    goScanner,
    goSearch,
    goNotifications,
    goDishDetail,
  };
}
