import api from './api';

export interface AdventureSummary {
  id: string;
  title: string;
  summary: string;
  difficulty: string;
  language: string;
  status: string;
  authorUsername: string;
  tags: string[];
  chapterCount: number;
  totalReads: number;
  publishedAt: string;
  isFavorited: boolean;
}

export interface AdventureCatalogueParams {
  search?: string;
  tag?: string;
  difficulty?: string;
  language?: string;
  sort?: string;
}

export interface AdventureDetail {
  id: string;
  title: string;
  summary: string;
  language: string;
  difficulty: string;
  estimatedDurationMinutes: number;
  status: string;
  allowBacktrack: boolean;
  createdAt: string;
  publishedAt: string;
  authorUsername: string;
  authorId: string;
  tags: string[];
  chapterCount: number;
  stats: {
    totalReads: number;
    totalCompletions: number;
    abandonmentCount: number;
    avgCompletionTime: number;
    favoriteCount: number;
  };
  isFavorited: boolean;
}

export interface ChapterDetail {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  isStart: boolean;
  isEnding: boolean;
  endingType: string;
  positionX: number;
  positionY: number;
  choices: ChoiceDetail[];
}

export interface ChoiceDetail {
  id: string;
  label: string;
  toChapterId: string;
  toChapterTitle: string;
  displayOrder: number;
  requiresConfirmation: boolean;
  isAvailable: boolean;
}

export interface SaveAdventureChapterPayload {
  tempId: string;
  title: string;
  content: string;
  imageUrl: string | null;
  type: string;
  isEnding: boolean;
  positionX: number;
  positionY: number;
}

export interface SaveAdventureEdgePayload {
  sourceId: string;
  targetId: string;
  label: string;
}

export interface SaveAdventurePayload {
  title: string;
  summary: string;
  language: string;
  difficulty: string;
  estimatedDurationMinutes?: number;
  allowBacktrack: boolean;
  tags: string[];
  chapters: SaveAdventureChapterPayload[];
  edges: SaveAdventureEdgePayload[];
}

export const adventureService = {
  async getCatalogue(params?: AdventureCatalogueParams): Promise<AdventureSummary[]> {
    const res = await api.get<AdventureSummary[]>('/adventures', { params });
    return res.data;
  },

  async getById(id: string): Promise<AdventureDetail> {
    const res = await api.get<AdventureDetail>(`/adventures/${id}`);
    return res.data;
  },

  async getChapters(id: string): Promise<ChapterDetail[]> {
    const res = await api.get<ChapterDetail[]>(`/adventures/${id}/chapters`);
    return res.data;
  },

  async getMyAdventures(): Promise<AdventureSummary[]> {
    const res = await api.get<AdventureSummary[]>('/adventures/mine');
    return res.data;
  },

  async saveComplete(data: SaveAdventurePayload, adventureId?: string): Promise<AdventureDetail> {
    const params = adventureId ? { adventureId } : {};
    const res = await api.post<AdventureDetail>('/adventures/save', data, { params });
    return res.data;
  },

  async publish(id: string): Promise<AdventureDetail> {
    const res = await api.post<AdventureDetail>(`/adventures/${id}/publish`);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/adventures/${id}`);
  },
};
