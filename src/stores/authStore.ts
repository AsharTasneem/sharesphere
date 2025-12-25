import { create } from 'zustand';
import { User } from '@/lib/types';
import { authApi } from '@/services/api';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: { email: string; password: string; name: string }) => Promise<void>;
  signOut: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,

  initialize: async () => {
    try {
      // Check localStorage first
      const savedUser = localStorage.getItem('auth_user');
      if (savedUser) {
        try {
          const user = JSON.parse(savedUser);
          set({ user, isAuthenticated: true, loading: false });
          return;
        } catch {
          // Invalid JSON, clear it
          localStorage.removeItem('auth_user');
        }
      }
      // Fallback to API
      const user = await authApi.getCurrentUser();
      set({ user, isAuthenticated: !!user, loading: false });
    } catch {
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const user = await authApi.signIn(email, password);
      set({ user, isAuthenticated: true, loading: false });
      localStorage.setItem('auth_user', JSON.stringify(user));
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  signUp: async (data: { email: string; password: string; name: string }) => {
    set({ loading: true });
    try {
      const user = await authApi.signUp(data);
      set({ user, isAuthenticated: true, loading: false });
      localStorage.setItem('auth_user', JSON.stringify(user));
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  signOut: () => {
    set({ user: null, isAuthenticated: false });
    localStorage.removeItem('auth_user');
  },

  updateProfile: async (data: Partial<User>) => {
    const { user } = get();
    if (!user) return;
    
    const updatedUser = { ...user, ...data, updatedAt: new Date() };
    set({ user: updatedUser });
    localStorage.setItem('auth_user', JSON.stringify(updatedUser));
  },
}));



