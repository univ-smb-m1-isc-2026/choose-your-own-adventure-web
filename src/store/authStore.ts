import { create } from 'zustand';
import { authService, type AuthResponse } from '../services/authService';

interface AuthState {
  user: AuthResponse | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  initialize: () => void;
}

function getStoredAuthState(): Pick<AuthState, 'user' | 'isAuthenticated'> {
  return {
    user: authService.getUser(),
    isAuthenticated: authService.isAuthenticated(),
  };
}

export const useAuthStore = create<AuthState>((set) => ({
  ...getStoredAuthState(),

  initialize: () => {
    set(getStoredAuthState());
  },

  login: async (email: string, password: string) => {
    const user = await authService.login({ email, password });
    set({ user, isAuthenticated: true });
  },

  register: async (username: string, email: string, password: string) => {
    await authService.register({ username, email, password });
  },

  logout: () => {
    authService.logout();
    set({ user: null, isAuthenticated: false });
  },
}));
