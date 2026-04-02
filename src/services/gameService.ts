import api from './api';

export interface GameState {
  saveGameId: string;
  adventureId: string;
  adventureTitle: string;
  allowBacktrack: boolean;
  currentChapter: {
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    isStart: boolean;
    isEnding: boolean;
    endingType: string;
    isCombat: boolean;
    combatEnemyName: string;
    combatEnemyHealth: number;
  };
  availableChoices: {
    id: string;
    label: string;
    toChapterId: string;
    displayOrder: number;
    requiresConfirmation: boolean;
    isAvailable: boolean;
    healthDelta: number | null;
  }[];
  health: number;
  maxHealth: number;
  stats: Record<string, string>;
  flags: Record<string, string>;
  inventory: {
    itemId: string;
    name: string;
    description: string;
    imageUrl: string;
    quantity: number;
  }[];
  history: {
    stepOrder: number;
    chapterId: string;
    chapterTitle: string;
    choiceId: string;
    choiceLabel: string;
    decidedAt: string;
  }[];
  completed: boolean;
  endingType: string;
}

export interface SaveGameSummary {
  id: string;
  adventureId: string;
  adventureTitle: string;
  currentChapterTitle: string;
  health: number;
  maxHealth: number;
  completed: boolean;
  lastPlayed: string;
}

export const gameService = {
  async startOrResume(adventureId: string): Promise<GameState> {
    const res = await api.post<GameState>(`/game/start/${adventureId}`);
    return res.data;
  },

  async restart(adventureId: string): Promise<GameState> {
    const res = await api.post<GameState>(`/game/restart/${adventureId}`);
    return res.data;
  },

  async makeChoice(saveGameId: string, choiceId: string): Promise<GameState> {
    const res = await api.post<GameState>(`/game/${saveGameId}/choice`, { choiceId });
    return res.data;
  },

  async submitCombatResult(saveGameId: string, newHealth: number): Promise<GameState> {
    const res = await api.post<GameState>(`/game/${saveGameId}/combat-result`, { newHealth });
    return res.data;
  },

  async getState(saveGameId: string): Promise<GameState> {
    const res = await api.get<GameState>(`/game/${saveGameId}`);
    return res.data;
  },

  async backtrack(saveGameId: string, step: number): Promise<GameState> {
    const res = await api.post<GameState>(`/game/${saveGameId}/backtrack/${step}`);
    return res.data;
  },

  async getMySaves(): Promise<SaveGameSummary[]> {
    const res = await api.get<SaveGameSummary[]>('/game/saves');
    return res.data;
  },
};
