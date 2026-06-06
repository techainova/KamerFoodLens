// src/hooks/useSearch.ts
// Logique recherche avancée — filtres + résultats + onglets

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '@/services/api.client';

export type SearchTab = 'dishes' | 'recipes' | 'restaurants' | 'events';

export interface SearchResult {
  id:         string;
  type:       SearchTab;
  name:       string;
  subtitle?:  string;
  imageUrl?:  string;
  score?:     number; // % de correspondance
}

async function search(query: string, tab: SearchTab): Promise<SearchResult[]> {
  if (!query.trim()) return [];
  const { data } = await apiClient.get('/search', { params: { q: query, type: tab } });
  return data;
}

export function useSearch() {
  const [query, setQuery]       = useState('');
  const [activeTab, setActiveTab] = useState<SearchTab>('dishes');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce 400ms
  let debounceTimer: ReturnType<typeof setTimeout>;
  function onQueryChange(text: string) {
    setQuery(text);
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => setDebouncedQuery(text), 400);
  }

  const results = useQuery({
    queryKey: ['search', debouncedQuery, activeTab],
    queryFn:  () => search(debouncedQuery, activeTab),
    enabled:  debouncedQuery.length >= 2,
  });

  function clearSearch() {
    setQuery('');
    setDebouncedQuery('');
  }

  return { query, activeTab, results, onQueryChange, setActiveTab, clearSearch };
}
