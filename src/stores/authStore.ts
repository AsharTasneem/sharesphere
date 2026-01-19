import { create } from "zustand";
import { User } from "@/lib/types";
import { supabaseAuthService } from "@/services/supabase/auth.service";

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  initialized: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (data: {
    email: string;
    password: string;
    name: string;
  }) => Promise<void>;
  signOut: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  loading: true,
  initialized: false,

  initialize: async () => {
    const { initialized } = get();
    if (initialized) return;

    try {
      const user = await supabaseAuthService.getCurrentUser();
      set({ user, isAuthenticated: !!user, loading: false, initialized: true });

      // Set up auth state change listener
      supabaseAuthService.onAuthStateChange((user) => {
        set({ user, isAuthenticated: !!user });
      });
    } catch (error) {
      console.error("Auth initialization error:", error);
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
        initialized: true,
      });
    }
  },

  refreshUser: async () => {
    try {
      const user = await supabaseAuthService.getCurrentUser();
      set({ user });
    } catch (error) {
      console.error("Failed to refresh user:", error);
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
      console.error("Sign out error:", error);
      // Still clear local state even if API call fails
      set({ user: null, isAuthenticated: false });
    }
  },

  updateProfile: async (data: Partial<User>) => {
    const { user } = get();
    if (!user) return;

    try {
      const updatedUser = await supabaseAuthService.updateProfile(
        user.id,
        data
      );
      set({ user: updatedUser });
    } catch (error) {
      console.error("Update profile error:", error);
      throw error;
    }
  },
}));
