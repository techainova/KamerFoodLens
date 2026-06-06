// src/hooks/useFeed.ts
// Logique Food Feed — chargement posts + likes + navigation

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export interface FeedPost {
  id:          string;
  author:      string;
  authorLevel: string;
  avatar?:     string;
  timeAgo:     string;
  text:        string;
  imageCount:  number;
  tags:        string[];
  location?:   string;
  likes:       number;
  comments:    number;
  liked:       boolean;
}

const MOCK_POSTS: FeedPost[] = [
  {
    id: '1', author: 'Sami N.', authorLevel: 'Chef · niv. 4',
    timeAgo: '2h',
    text: 'J\'ai testé un nouveau Mbongo au poisson capitaine ce weekend à Édéa — vraiment incroyable !',
    imageCount: 1, tags: ['#Mbongo', '#Édéa'], likes: 128, comments: 24, liked: false,
  },
  {
    id: '2', author: 'Maman Pauline', authorLevel: 'Novice · niv. 1',
    timeAgo: '4h',
    text: 'Ma recette de Ndolé du dimanche, transmise par ma grand-mère. Le secret c\'est les écorces fraîches.',
    imageCount: 2, tags: ['#Ndolé', '#Traditionnel'], likes: 64, comments: 12, liked: true,
  },
  {
    id: '3', author: 'Chef Joëlle K.', authorLevel: 'Chef · niv. 7',
    timeAgo: '1j',
    text: 'Atelier Eru ce samedi à Douala. Places limitées, inscrivez-vous vite !',
    imageCount: 0, tags: ['#Eru', '#Atelier'], likes: 203, comments: 45, liked: false,
  },
];

export function useFeed() {
  const [posts, setPosts] = useState<FeedPost[]>(MOCK_POSTS);

  function toggleLike(id: string) {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 }
          : p,
      ),
    );
  }

  function loadMore() { /* TODO: pagination API */ }

  return { posts, toggleLike, loadMore };
}
