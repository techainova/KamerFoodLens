// src/store/stories.store.ts
import { create } from 'zustand';
import {
  communityService,
  type Story,
  type CreateStoryPayload,
  type StoryViewerView,
  type StoryReplyView,
  type StoryHighlightSummary,
  type StoryHighlightDetail,
} from '@/services/community.service';

export interface StoryGroup {
  authorId: string;
  authorName: string;
  isMine: boolean;
  stories: Story[];
}

interface StoriesState {
  stories: Story[];
  isLoading: boolean;
  highlights: StoryHighlightSummary[];
  fetchAll: () => Promise<void>;
  addStory: (payload: CreateStoryPayload) => Promise<void>;
  removeStory: (storyId: string) => Promise<void>;
  viewStory: (storyId: string) => Promise<void>;
  reactToStory: (storyId: string, emoji: string) => Promise<void>;
  replyToStory: (storyId: string, text: string) => Promise<void>;
  voteStoryPoll: (storyId: string, optionIndex: number) => Promise<void>;
  answerStoryQuiz: (storyId: string, optionIndex: number) => Promise<void>;
  rateStorySlider: (storyId: string, value: number) => Promise<void>;
  getStoryViewers: (storyId: string) => Promise<StoryViewerView[]>;
  getStoryReplies: (storyId: string) => Promise<StoryReplyView[]>;
  fetchHighlights: (userId: string) => Promise<void>;
  createHighlight: (title: string, storyId: string, coverImageUrl?: string) => Promise<void>;
  addStoryToHighlight: (highlightId: string, storyId: string) => Promise<void>;
  removeStoryFromHighlight: (highlightId: string, storyId: string) => Promise<void>;
  deleteHighlight: (highlightId: string) => Promise<void>;
  getHighlightDetail: (highlightId: string) => Promise<StoryHighlightDetail>;
}

export const useStoriesStore = create<StoriesState>((set, get) => ({
  stories: [],
  isLoading: false,
  highlights: [],

  fetchAll: async () => {
    set({ isLoading: true });
    try {
      const { items } = await communityService.getStories();
      set({ stories: items });
    } finally {
      set({ isLoading: false });
    }
  },

  addStory: async (payload) => {
    const created = await communityService.createStory(payload);
    set((s) => ({ stories: [created, ...s.stories] }));
  },

  removeStory: async (storyId) => {
    const previous = get().stories;
    set((s) => ({ stories: s.stories.filter((story) => story.id !== storyId) }));
    try {
      await communityService.deleteStory(storyId);
    } catch (err) {
      set({ stories: previous });
      throw err;
    }
  },

  viewStory: async (storyId) => {
    try {
      await communityService.viewStory(storyId);
    } catch {
      // Silencieux — le compteur de vues n'est pas critique côté viewer.
    }
  },

  reactToStory: async (storyId, emoji) => {
    const updated = await communityService.reactToStory(storyId, emoji);
    set((s) => ({ stories: s.stories.map((story) => (story.id === storyId ? updated : story)) }));
  },

  replyToStory: async (storyId, text) => {
    await communityService.replyToStory(storyId, text);
    set((s) => ({
      stories: s.stories.map((story) =>
        story.id === storyId ? { ...story, repliesCount: story.repliesCount + 1 } : story,
      ),
    }));
  },

  voteStoryPoll: async (storyId, optionIndex) => {
    const updated = await communityService.voteStoryPoll(storyId, optionIndex);
    set((s) => ({ stories: s.stories.map((story) => (story.id === storyId ? updated : story)) }));
  },

  answerStoryQuiz: async (storyId, optionIndex) => {
    const updated = await communityService.answerStoryQuiz(storyId, optionIndex);
    set((s) => ({ stories: s.stories.map((story) => (story.id === storyId ? updated : story)) }));
  },

  rateStorySlider: async (storyId, value) => {
    const updated = await communityService.rateStorySlider(storyId, value);
    set((s) => ({ stories: s.stories.map((story) => (story.id === storyId ? updated : story)) }));
  },

  getStoryViewers: async (storyId) => {
    return communityService.getStoryViewers(storyId);
  },

  getStoryReplies: async (storyId) => {
    return communityService.getStoryReplies(storyId);
  },

  fetchHighlights: async (userId) => {
    const highlights = await communityService.getUserHighlights(userId);
    set({ highlights });
  },

  createHighlight: async (title, storyId, coverImageUrl) => {
    const created = await communityService.createHighlight(title, storyId, coverImageUrl);
    set((s) => ({
      highlights: [created, ...s.highlights],
      stories: s.stories.filter((story) => story.id !== storyId),
    }));
  },

  addStoryToHighlight: async (highlightId, storyId) => {
    const updated = await communityService.addStoryToHighlight(highlightId, storyId);
    set((s) => ({
      highlights: s.highlights.map((h) => (h.id === highlightId ? updated : h)),
      stories: s.stories.filter((story) => story.id !== storyId),
    }));
  },

  removeStoryFromHighlight: async (highlightId, storyId) => {
    const updated = await communityService.removeStoryFromHighlight(highlightId, storyId);
    set((s) => ({ highlights: s.highlights.map((h) => (h.id === highlightId ? updated : h)) }));
  },

  deleteHighlight: async (highlightId) => {
    const previous = get().highlights;
    set((s) => ({ highlights: s.highlights.filter((h) => h.id !== highlightId) }));
    try {
      await communityService.deleteHighlight(highlightId);
    } catch (err) {
      set({ highlights: previous });
      throw err;
    }
  },

  getHighlightDetail: async (highlightId) => {
    return communityService.getHighlightDetail(highlightId);
  },
}));

export function buildStoryGroups(stories: Story[], currentUserId: string | undefined): StoryGroup[] {
  const order: string[] = [];
  const byAuthor = new Map<string, Story[]>();

  for (const story of [...stories].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())) {
    if (!byAuthor.has(story.authorId)) { byAuthor.set(story.authorId, []); order.push(story.authorId); }
    byAuthor.get(story.authorId)!.push(story);
  }

  return order.map((authorId) => {
    const authorStories = byAuthor.get(authorId)!;
    return {
      authorId,
      authorName: authorStories[0].authorName,
      isMine: authorId === currentUserId,
      stories: authorStories,
    };
  });
}
