// src/services/games.service.ts
import apiClient from './api.client';
import { ENDPOINTS } from './config';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  category: string | null;
  difficulty: string | null;
}

export interface QuizAnswer {
  questionId: string;
  selectedIndex: number;
  timeMs: number;
}

export interface QuizSubmitPayload {
  sessionId: string;
  answers: QuizAnswer[];
}

export interface QuizResult {
  score: number;
  total: number;
  xpEarned: number;
  correctAnswers: number;
}

export interface TombolaPrize {
  rank: number;
  label: string;
  description: string;
  value: string;
  icon: string;
}

export interface Tombola {
  id: string;
  title: string;
  drawAt: string;
  pricePerTicketXAF: number;
  maxTickets: number;
  prizes: TombolaPrize[];
  isActive: boolean;
  soldCount: number;
}

export interface TombolaTicket {
  id: string;
  tombolaId: string;
  userId: string;
  ticketNumber: number;
  purchasedAt: string;
}

export interface LeaderboardEntry {
  userId: string;
  firstName: string;
  lastName: string;
  points: number;
  rank: number;
}

export interface Badge {
  id: string;
  name: string;
  nameEN?: string;
  description: string;
  descriptionEN?: string;
  icon: string;
  color: string;
  category: string;
  xpReward: number;
  earnedAt?: string;
  isEarned: boolean;
}

export const gamesService = {
  async getQuizQuestions(category?: string, count = 10): Promise<QuizQuestion[]> {
    const { data } = await apiClient.get<QuizQuestion[]>(ENDPOINTS.QUIZ_QUESTIONS, {
      params: { category, count },
    });
    return data;
  },

  async submitQuiz(payload: QuizSubmitPayload): Promise<QuizResult> {
    const { data } = await apiClient.post<QuizResult>(ENDPOINTS.QUIZ_SUBMIT, payload);
    return data;
  },

  async getActiveTombola(): Promise<Tombola | null> {
    const { data } = await apiClient.get<Tombola | null>(ENDPOINTS.TOMBOLA);
    return data;
  },

  async getMyTickets(tombolaId: string): Promise<TombolaTicket[]> {
    const { data } = await apiClient.get<TombolaTicket[]>(ENDPOINTS.TOMBOLA_TICKETS, {
      params: { tombolaId },
    });
    return data;
  },

  async buyTicket(tombolaId: string, qty = 1): Promise<TombolaTicket[]> {
    const { data } = await apiClient.post<TombolaTicket[]>(ENDPOINTS.TOMBOLA_BUY, { tombolaId, qty });
    return data;
  },

  async getLeaderboard(period: 'week' | 'month' | 'all' = 'week'): Promise<LeaderboardEntry[]> {
    const { data } = await apiClient.get<LeaderboardEntry[]>(ENDPOINTS.LEADERBOARD, { params: { period } });
    return data;
  },

  async getMyBadges(): Promise<Badge[]> {
    const { data } = await apiClient.get<Badge[]>(ENDPOINTS.BADGES);
    return data;
  },
};
