import { create } from 'zustand';
import { gameService, type GameState } from '../services/gameService';
import { getApiErrorMessage } from '../utils/apiError';

interface GameStore {
  gameState: GameState | null;
  loading: boolean;
  error: string | null;
  startOrResume: (adventureId: string) => Promise<void>;
  makeChoice: (choiceId: string) => Promise<void>;
  backtrack: (step: number) => Promise<void>;
  loadState: (saveGameId: string) => Promise<void>;
  clear: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  gameState: null,
  loading: false,
  error: null,

  startOrResume: async (adventureId: string) => {
    set({ loading: true, error: null });
    try {
      const state = await gameService.startOrResume(adventureId);
      set({ gameState: state, loading: false });
    } catch (error: unknown) {
      set({ error: getApiErrorMessage(error, 'Error starting game'), loading: false });
    }
  },

  makeChoice: async (choiceId: string) => {
    const { gameState } = get();
    if (!gameState) return;
    set({ loading: true, error: null });
    try {
      const state = await gameService.makeChoice(gameState.saveGameId, choiceId);
      set({ gameState: state, loading: false });
    } catch (error: unknown) {
      set({ error: getApiErrorMessage(error, 'Error making choice'), loading: false });
    }
  },

  backtrack: async (step: number) => {
    const { gameState } = get();
    if (!gameState) return;
    set({ loading: true, error: null });
    try {
      const state = await gameService.backtrack(gameState.saveGameId, step);
      set({ gameState: state, loading: false });
    } catch (error: unknown) {
      set({ error: getApiErrorMessage(error, 'Error backtracking'), loading: false });
    }
  },

  loadState: async (saveGameId: string) => {
    set({ loading: true, error: null });
    try {
      const state = await gameService.getState(saveGameId);
      set({ gameState: state, loading: false });
    } catch (error: unknown) {
      set({ error: getApiErrorMessage(error, 'Error loading state'), loading: false });
    }
  },

  clear: () => set({ gameState: null, loading: false, error: null }),
}));
