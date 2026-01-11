import { supabase } from "@/lib/supabaseClient";
import { dbProfileToUser } from "@/lib/supabase-helpers";
import type { User } from "@/lib/types";
import type { TablesInsert } from "@/types/database";

// Default values for new profiles to ensure DB constraints are met
const DEFAULT_PROFILE_DATA = {
  city: "",
  state: "",
  country: "",
  address: "",
  bio: "",
  phone: "",
  avatar: null,
  latitude: null,
  longitude: null,
  email_verified: false,
  phone_verified: false,
  address_verified: false,
  rating: 0,
  review_count: 0,
  total_borrowed: 0,
  total_lent: 0,
  active_rentals: 0,
  response_rate: 0,
  response_time: "Same day",
  completion_rate: 0,
  search_radius: 20,
  default_pickup_window: "Flexible",
  notification_level: "all" as "all" | "important" | "minimal",
  email_digest: true,
  push_enabled: true,
  payout_type: null as "bank" | "paypal" | null,
  payout_last4: null,
  payout_verified: false,
};

export const supabaseAuthService = {
  /**
   * Sign in with email and password
   */
  signIn: async (email: string, password: string): Promise<User> => {
    const { data: authData, error: authError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) throw authError;
    if (!authData.user) throw new Error("No user returned from sign in");

    // Fetch user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authData.user.id)
      .single();

    if (profileError || !profile) {
      console.warn(
        "Profile not found logic triggered. Attempting self-healing..."
      );

      // Self-healing: Create profile if missing
      const newProfile: TablesInsert<"profiles"> = {
        ...DEFAULT_PROFILE_DATA,
        id: authData.user.id,
        email: authData.user.email!,
        name:
          authData.user.user_metadata?.name ||
          authData.user.email?.split("@")[0] ||
          "User",
      };

      const { data: createdProfile, error: createError } = (await supabase
        .from("profiles")
        .insert(newProfile as any)
        .select()
        .single()) as { data: any | null; error: any };

      if (createError) {
        console.error(
          "Failed to create profile during self-healing:",
          createError
        );
        throw (
          profileError || new Error("Profile not found and creation failed")
        );
      }

      return dbProfileToUser(createdProfile);
    }

    return dbProfileToUser(profile);
  },

  /**
   * Sign up with email, password, and name
   */
  signUp: async (data: {
    email: string;
    password: string;
    name: string;
  }): Promise<User> => {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          name: data.name,
        },
      },
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("No user returned from sign up");

    // Profile should be created automatically by the database trigger
    // Poll for profile creation (max 2 seconds)
    let profile: any = null;
    let attempts = 0;

    while (!profile && attempts < 4) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", authData.user.id)
        .single();

      if (data) {
        profile = data;
        break;
      }
      attempts++;
    }

    // Fallback if trigger didn't work, create profile manually
    if (!profile) {
      const newProfile: TablesInsert<"profiles"> = {
        ...DEFAULT_PROFILE_DATA,
        id: authData.user.id,
        email: data.email,
        name: data.name,
      };

      const { data: createdProfile, error: createError } = (await supabase
        .from("profiles")
        .insert(newProfile as any)
        .select()
        .single()) as { data: any | null; error: any };

      if (createError) throw createError;
      if (!createdProfile) throw new Error("Failed to create profile");

      return dbProfileToUser(createdProfile);
    }

    return dbProfileToUser(profile);
  },

  /**
   * Sign out current user
   */
  signOut: async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get current authenticated user
   */
  getCurrentUser: async (): Promise<User | null> => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session?.user) return null;

    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    if (error || !profile) {
      if (session.user) {
        console.warn(
          "Profile missing for referenced session. Attempting self-healing in getCurrentUser..."
        );

        // Self-healing: Create profile if missing
        const newProfile: TablesInsert<"profiles"> = {
          ...DEFAULT_PROFILE_DATA,
          id: session.user.id,
          email: session.user.email!,
          name:
            session.user.user_metadata?.name ||
            session.user.email?.split("@")[0] ||
            "User",
        };

        const { data: createdProfile, error: createError } = (await supabase
          .from("profiles")
          .insert(newProfile as any)
          .select()
          .single()) as { data: any | null; error: any };

        if (!createError && createdProfile) {
          return dbProfileToUser(createdProfile);
        }
      }
      return null;
    }

    return dbProfileToUser(profile);
  },

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange: (callback: (user: User | null) => void) => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        if (profile) {
          callback(dbProfileToUser(profile));
        } else {
          callback(null);
        }
      } else {
        callback(null);
      }
    });

    return subscription;
  },

  /**
   * Update user profile
   */
  updateProfile: async (userId: string, data: Partial<User>): Promise<User> => {
    const updates: Record<string, unknown> = {};

    if (data.name) updates.name = data.name;
    if (data.bio !== undefined) updates.bio = data.bio;
    if (data.phone !== undefined) updates.phone = data.phone;
    if (data.avatar !== undefined) updates.avatar = data.avatar;

    if (data.location) {
      // if (data.location.address !== undefined)
      //   updates.address = data.location.address;
      if (data.location.city !== undefined) updates.city = data.location.city;
      if (data.location.state !== undefined)
        updates.state = data.location.state;
      if (data.location.country !== undefined)
        updates.country = data.location.country;
      if (data.location.coordinates) {
        updates.latitude = data.location.coordinates.lat;
        updates.longitude = data.location.coordinates.lng;
      }
    }

    if (data.preferences) {
      if (data.preferences.searchRadius !== undefined)
        updates.search_radius = data.preferences.searchRadius;
      if (data.preferences.defaultPickupWindow)
        updates.default_pickup_window = data.preferences.defaultPickupWindow;
      if (data.preferences.notificationLevel)
        updates.notification_level = data.preferences.notificationLevel;
      if (data.preferences.emailDigest !== undefined)
        updates.email_digest = data.preferences.emailDigest;
      if (data.preferences.pushEnabled !== undefined)
        updates.push_enabled = data.preferences.pushEnabled;
    }

    console.log("Supabase update payload:", updates);

    const { data: profile, error } = (await supabase
      .from("profiles")
      // @ts-expect-error - Supabase type inference issue with generic Database type
      .update(updates as any)
      .eq("id", userId)
      .select("*")
      .single()) as { data: any | null; error: any };

    if (error) throw error;
    if (!profile) throw new Error("Failed to update profile");

    return dbProfileToUser(profile);
  },

  /**
   * Update user email
   */
  updateEmail: async (email: string): Promise<void> => {
    const { error } = await supabase.auth.updateUser({ email });
    if (error) throw error;
  },
};
