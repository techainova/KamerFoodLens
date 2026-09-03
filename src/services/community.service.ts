// src/services/community.service.ts
import apiClient from './api.client';
import { ENDPOINTS } from './config';

export interface AuthorInfo {
  authorId: string;
  authorName: string;
  authorRole: 'standard' | 'pro' | 'admin';
  initials: string;
  avatarColor: string;
}

export interface PostComment extends AuthorInfo {
  text: string;
  createdAt: string;
}

export interface FeedPost extends AuthorInfo {
  id: string;
  content: string;
  imageUrl?: string;
  type: 'post' | 'recipe' | 'review';
  likes: string[];
  comments: PostComment[];
  createdAt: string;
}

export interface ForumThread extends AuthorInfo {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  likes: string[];
  views: number;
  replyCount: number;
  createdAt: string;
}

export interface ForumReply extends AuthorInfo {
  id: string;
  content: string;
  likes: string[];
  createdAt: string;
}

export interface ForumThreadDetail extends ForumThread {
  replies: ForumReply[];
}

export interface StoryPollOptionView {
  label: string;
  votes: number;
}

export interface StoryPollView {
  question: string;
  options: StoryPollOptionView[];
  totalVotes: number;
  myVoteIndex?: number;
  x?: number;
  y?: number;
}

export interface StoryQuizOptionView {
  label: string;
}

export interface StoryQuizView {
  question: string;
  options: StoryQuizOptionView[];
  totalAnswers: number;
  correctCount: number;
  myAnswerIndex?: number;
  correctIndex?: number;
  x?: number;
  y?: number;
}

export interface StorySliderView {
  question: string;
  emoji: string;
  votesCount: number;
  average?: number;
  myValue?: number;
  x?: number;
  y?: number;
}

export interface StoryViewerView {
  userId: string;
  name: string;
  viewedAt: string;
}

export interface StoryTextOverlay {
  text: string;
  x: number;
  y: number;
  fontSize: number;
  color: string;
  fontWeight: string;
  align: string;
  backgroundColor?: string;
}

export interface Story extends AuthorInfo {
  id: string;
  mediaType: 'image' | 'text';
  imageUrl?: string;
  filter?: string;
  backgroundColor?: string;
  gradient?: string[];
  textOverlays: StoryTextOverlay[];
  caption?: string;
  createdAt: string;
  reactionsCount: number;
  myReactionEmoji?: string;
  repliesCount: number;
  viewsCount: number;
  poll?: StoryPollView;
  quiz?: StoryQuizView;
  slider?: StorySliderView;
}

export interface CreatePostPayload {
  content: string;
  type: 'post' | 'recipe' | 'review';
  imageBase64?: string;
  mimeType?: string;
}

export interface CreateThreadPayload {
  title: string;
  content: string;
  tags: string[];
}

export interface CreateStoryPollPayload {
  question: string;
  options: string[];
  x?: number;
  y?: number;
}

export interface CreateStoryQuizPayload {
  question: string;
  options: string[];
  correctIndex: number;
  x?: number;
  y?: number;
}

export interface CreateStorySliderPayload {
  question: string;
  emoji: string;
  x?: number;
  y?: number;
}

export interface CreateStoryStickersPayload {
  poll?: CreateStoryPollPayload;
  quiz?: CreateStoryQuizPayload;
  slider?: CreateStorySliderPayload;
}

export interface CreateStoryTextOverlayPayload {
  text: string;
  x: number;
  y: number;
  fontSize?: number;
  color?: string;
  fontWeight?: string;
  align?: string;
  backgroundColor?: string;
}

export interface CreateStoryPayload {
  imageBase64?: string;
  mimeType?: string;
  mediaType?: 'image' | 'text';
  filter?: string;
  backgroundColor?: string;
  gradient?: string[];
  textOverlays?: CreateStoryTextOverlayPayload[];
  caption?: string;
  stickers?: CreateStoryStickersPayload;
}

export interface StoryReplyView {
  userId: string;
  name: string;
  text: string;
  createdAt: string;
}

export interface StoryHighlightSummary {
  id: string;
  title: string;
  coverImageUrl?: string;
  storiesCount: number;
}

export interface StoryHighlightDetail {
  id: string;
  title: string;
  coverImageUrl?: string;
  stories: Story[];
}

export const communityService = {
  // Feed
  async getFeed(page = 1): Promise<{ items: FeedPost[]; total: number; page: number }> {
    const { data } = await apiClient.get(ENDPOINTS.FEED, { params: { page } });
    return data;
  },

  async createPost(payload: CreatePostPayload): Promise<FeedPost> {
    const { data } = await apiClient.post<FeedPost>(ENDPOINTS.FEED_POST, payload);
    return data;
  },

  async likePost(postId: string): Promise<FeedPost> {
    const { data } = await apiClient.post<FeedPost>(`${ENDPOINTS.POST_LIKE}/${postId}/like`);
    return data;
  },

  async addComment(postId: string, text: string): Promise<FeedPost> {
    const { data } = await apiClient.post<FeedPost>(`${ENDPOINTS.POST_COMMENT}/${postId}/comments`, { text });
    return data;
  },

  // Forum
  async getThreads(page = 1): Promise<{ items: ForumThread[]; total: number; page: number }> {
    const { data } = await apiClient.get(ENDPOINTS.FORUM_THREADS, { params: { page } });
    return data;
  },

  async getThread(threadId: string): Promise<ForumThreadDetail> {
    const { data } = await apiClient.get<ForumThreadDetail>(`${ENDPOINTS.THREAD_DETAIL}/${threadId}`);
    return data;
  },

  async createThread(payload: CreateThreadPayload): Promise<ForumThread> {
    const { data } = await apiClient.post<ForumThread>(ENDPOINTS.FORUM_THREADS, payload);
    return data;
  },

  async replyThread(threadId: string, content: string): Promise<ForumReply> {
    const { data } = await apiClient.post<ForumReply>(`${ENDPOINTS.THREAD_REPLY}/${threadId}/reply`, { content });
    return data;
  },

  async likeThread(threadId: string): Promise<ForumThread> {
    const { data } = await apiClient.post<ForumThread>(`${ENDPOINTS.FORUM_THREADS}/${threadId}/like`);
    return data;
  },

  async likeReply(threadId: string, replyId: string): Promise<ForumReply> {
    const { data } = await apiClient.post<ForumReply>(`${ENDPOINTS.FORUM_THREADS}/${threadId}/reply/${replyId}/like`);
    return data;
  },

  // Stories
  async getStories(page = 1): Promise<{ items: Story[]; total: number; page: number }> {
    const { data } = await apiClient.get(ENDPOINTS.STORIES, { params: { page } });
    return data;
  },

  async createStory(payload: CreateStoryPayload): Promise<Story> {
    const { data } = await apiClient.post<Story>(ENDPOINTS.STORIES, payload);
    return data;
  },

  async deleteStory(storyId: string): Promise<void> {
    await apiClient.delete(`${ENDPOINTS.STORIES}/${storyId}`);
  },

  async viewStory(storyId: string): Promise<void> {
    await apiClient.post(`${ENDPOINTS.STORIES}/${storyId}/view`);
  },

  async reactToStory(storyId: string, emoji: string): Promise<Story> {
    const { data } = await apiClient.post<Story>(`${ENDPOINTS.STORIES}/${storyId}/react`, { emoji });
    return data;
  },

  async replyToStory(storyId: string, text: string): Promise<void> {
    await apiClient.post(`${ENDPOINTS.STORIES}/${storyId}/reply`, { text });
  },

  async voteStoryPoll(storyId: string, optionIndex: number): Promise<Story> {
    const { data } = await apiClient.post<Story>(`${ENDPOINTS.STORIES}/${storyId}/poll/vote`, { optionIndex });
    return data;
  },

  async answerStoryQuiz(storyId: string, optionIndex: number): Promise<Story> {
    const { data } = await apiClient.post<Story>(`${ENDPOINTS.STORIES}/${storyId}/quiz/answer`, { optionIndex });
    return data;
  },

  async rateStorySlider(storyId: string, value: number): Promise<Story> {
    const { data } = await apiClient.post<Story>(`${ENDPOINTS.STORIES}/${storyId}/slider/rate`, { value });
    return data;
  },

  async getStoryViewers(storyId: string): Promise<StoryViewerView[]> {
    const { data } = await apiClient.get<StoryViewerView[]>(`${ENDPOINTS.STORIES}/${storyId}/viewers`);
    return data;
  },

  async getStoryReplies(storyId: string): Promise<StoryReplyView[]> {
    const { data } = await apiClient.get<StoryReplyView[]>(`${ENDPOINTS.STORIES}/${storyId}/replies`);
    return data;
  },

  // Highlights
  async createHighlight(title: string, storyId: string, coverImageUrl?: string): Promise<StoryHighlightSummary> {
    const { data } = await apiClient.post<StoryHighlightSummary>(ENDPOINTS.HIGHLIGHTS, { title, storyId, coverImageUrl });
    return data;
  },

  async addStoryToHighlight(highlightId: string, storyId: string): Promise<StoryHighlightSummary> {
    const { data } = await apiClient.post<StoryHighlightSummary>(`${ENDPOINTS.HIGHLIGHTS}/${highlightId}/stories`, { storyId });
    return data;
  },

  async removeStoryFromHighlight(highlightId: string, storyId: string): Promise<StoryHighlightSummary> {
    const { data } = await apiClient.delete<StoryHighlightSummary>(`${ENDPOINTS.HIGHLIGHTS}/${highlightId}/stories/${storyId}`);
    return data;
  },

  async getUserHighlights(userId: string): Promise<StoryHighlightSummary[]> {
    const { data } = await apiClient.get<StoryHighlightSummary[]>(`${ENDPOINTS.HIGHLIGHTS}/user/${userId}`);
    return data;
  },

  async getHighlightDetail(highlightId: string): Promise<StoryHighlightDetail> {
    const { data } = await apiClient.get<StoryHighlightDetail>(`${ENDPOINTS.HIGHLIGHTS}/${highlightId}`);
    return data;
  },

  async deleteHighlight(highlightId: string): Promise<void> {
    await apiClient.delete(`${ENDPOINTS.HIGHLIGHTS}/${highlightId}`);
  },
};
