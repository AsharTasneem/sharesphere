import { create } from 'zustand';
import { User } from '@/lib/types';
import { supabaseAuthService } from '@/services/supabase/auth.service';

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
      const user = await supabaseAuthService.getCurrentUser();
      set({ user, isAuthenticated: !!user, loading: false });

      // Set up auth state change listener
      supabaseAuthService.onAuthStateChange((user) => {
        set({ user, isAuthenticated: !!user });
      });
    } catch {
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true });
    try {
      const user = await supabaseAuthService.signIn(email, password);
      set({ user, isAuthenticated: true, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  signUp: async (data: { email: string; password: string; name: string }) => {
    set({ loading: true });
    try {
      const user = await supabaseAuthService.signUp(data);
      set({ user, isAuthenticated: true, loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  signOut: async () => {
    try {
      await supabaseAuthService.signOut();
      set({ user: null, isAuthenticated: false });
    } catch (error) {
      console.error('Sign out error:', error);
      // Still clear local state even if API call fails
      set({ user: null, isAuthenticated: false });
    }
  },

  updateProfile: async (data: Partial<User>) => {
    const { user } = get();
    if (!user) return;

    try {
      const updatedUser = await supabaseAuthService.updateProfile(user.id, data);
      set({ user: updatedUser });
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
}));
