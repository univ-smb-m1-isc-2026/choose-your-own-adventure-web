import api from './api';
import type { AdventureSummary } from './adventureService';

export const favoriteService = {
  async toggle(adventureId: string): Promise<boolean> {
    const res = await api.post<{ favorited: boolean }>(`/favorites/${adventureId}`);
    return res.data.favorited;
  },

  async getMyFavorites(): Promise<AdventureSummary[]> {
    const res = await api.get<AdventureSummary[]>('/favorites');
    return res.data;
  },
};
