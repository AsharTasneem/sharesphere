// Database types generated from Supabase schema
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          name: string;
          avatar: string | null;
          bio: string | null;
          phone: string | null;
          city: string;
          state: string;
          country: string;
          address: string | null;
          latitude: number | null;
          longitude: number | null;
          email_verified: boolean;
          phone_verified: boolean;
          address_verified: boolean;
          rating: number;
          review_count: number;
          total_borrowed: number;
          total_lent: number;
          active_rentals: number;
          response_rate: number;
          response_time: string;
          completion_rate: number;
          search_radius: number;
          default_pickup_window: string;
          notification_level: "all" | "important" | "minimal";
          email_digest: boolean;
          push_enabled: boolean;
          payout_type: "bank" | "paypal" | null;
          payout_last4: string | null;
          payout_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          name: string;
          avatar?: string | null;
          bio?: string | null;
          phone?: string | null;
          city?: string;
          state?: string;
          country?: string;
          address?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          email_verified?: boolean;
          phone_verified?: boolean;
          address_verified?: boolean;
          rating?: number;
          review_count?: number;
          total_borrowed?: number;
          total_lent?: number;
          active_rentals?: number;
          response_rate?: number;
          response_time?: string;
          completion_rate?: number;
          search_radius?: number;
          default_pickup_window?: string;
          notification_level?: "all" | "important" | "minimal";
          email_digest?: boolean;
          push_enabled?: boolean;
          payout_type?: "bank" | "paypal" | null;
          payout_last4?: string | null;
          payout_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          avatar?: string | null;
          bio?: string | null;
          phone?: string | null;
          city?: string;
          state?: string;
          country?: string;
          latitude?: number | null;
          longitude?: number | null;
          email_verified?: boolean;
          phone_verified?: boolean;
          address_verified?: boolean;
          rating?: number;
          review_count?: number;
          total_borrowed?: number;
          total_lent?: number;
          active_rentals?: number;
          response_rate?: number;
          response_time?: string;
          completion_rate?: number;
          search_radius?: number;
          default_pickup_window?: string;
          notification_level?: "all" | "important" | "minimal";
          email_digest?: boolean;
          push_enabled?: boolean;
          payout_type?: "bank" | "paypal" | null;
          payout_last4?: string | null;
          payout_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      items: {
        Row: {
          id: string;
          owner_id: string;
          title: string;
          description: string;
          category: string;
          price_per_day: number;
          deposit: number;
          condition: "new" | "like_new" | "good" | "fair";
          images: string[];
          primary_image: string | null;
          address: string | null;
          city: string | null;
          state: string | null;
          latitude: number | null;
          longitude: number | null;
          display_address: string | null;
          availability_type: "calendar" | "always" | "by_request";
          blocked_dates: string[] | null;
          available_days: number[] | null;
          pickup_instructions: string | null;
          pickup_window: string | null;
          tags: string[];
          views: number;
          requests_count: number;
          bookings_count: number;
          rating: number;
          review_count: number;
          status: "draft" | "published" | "paused" | "archived";
          created_at: string;
          updated_at: string;
          published_at: string | null;
        };
        Insert: {
          id?: string;
          owner_id: string;
          title: string;
          description: string;
          category: string;
          price_per_day: number;
          deposit?: number;
          condition: "new" | "like_new" | "good" | "fair";
          images?: string[];
          primary_image?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          display_address?: string | null;
          availability_type?: "calendar" | "always" | "by_request";
          blocked_dates?: string[] | null;
          available_days?: number[] | null;
          pickup_instructions?: string | null;
          pickup_window?: string | null;
          tags?: string[];
          views?: number;
          requests_count?: number;
          bookings_count?: number;
          rating?: number;
          review_count?: number;
          status?: "draft" | "published" | "paused" | "archived";
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
        Update: {
          id?: string;
          owner_id?: string;
          title?: string;
          description?: string;
          category?: string;
          price_per_day?: number;
          deposit?: number;
          condition?: "new" | "like_new" | "good" | "fair";
          images?: string[];
          primary_image?: string | null;
          address?: string | null;
          city?: string | null;
          state?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          display_address?: string | null;
          availability_type?: "calendar" | "always" | "by_request";
          blocked_dates?: string[] | null;
          available_days?: number[] | null;
          pickup_instructions?: string | null;
          pickup_window?: string | null;
          tags?: string[];
          views?: number;
          requests_count?: number;
          bookings_count?: number;
          rating?: number;
          review_count?: number;
          status?: "draft" | "published" | "paused" | "archived";
          created_at?: string;
          updated_at?: string;
          published_at?: string | null;
        };
      };
      requests: {
        Row: {
          id: string;
          item_id: string;
          borrower_id: string;
          owner_id: string;
          start_date: string;
          end_date: string;
          status:
            | "pending_owner"
            | "accepted"
            | "payment_pending"
            | "paid"
            | "active"
            | "returned"
            | "completed"
            | "cancelled"
            | "declined"
            | "overdue";
          price_per_day: number;
          days: number;
          rental_fee: number;
          deposit: number;
          service_fee: number;
          total: number;
          payment_type: "card" | null;
          payment_last4: string | null;
          payment_id: string | null;
          deposit_refunded: boolean;
          refund_amount: number | null;
          pickup_code: string | null;
          return_code: string | null;
          pickup_date: string | null;
          return_date: string | null;
          notes: string | null;
          owner_notes: string | null;
          cancellation_reason: string | null;
          created_at: string;
          updated_at: string;
          accepted_at: string | null;
          declined_at: string | null;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          item_id: string;
          borrower_id: string;
          owner_id: string;
          start_date: string;
          end_date: string;
          status?:
            | "pending_owner"
            | "accepted"
            | "payment_pending"
            | "paid"
            | "active"
            | "returned"
            | "completed"
            | "cancelled"
            | "declined"
            | "overdue";
          price_per_day: number;
          days: number;
          rental_fee: number;
          deposit: number;
          service_fee: number;
          total: number;
          payment_type?: "card" | null;
          payment_last4?: string | null;
          payment_id?: string | null;
          deposit_refunded?: boolean;
          refund_amount?: number | null;
          pickup_code?: string | null;
          return_code?: string | null;
          pickup_date?: string | null;
          return_date?: string | null;
          notes?: string | null;
          owner_notes?: string | null;
          cancellation_reason?: string | null;
          created_at?: string;
          updated_at?: string;
          accepted_at?: string | null;
          declined_at?: string | null;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          item_id?: string;
          borrower_id?: string;
          owner_id?: string;
          start_date?: string;
          end_date?: string;
          status?:
            | "pending_owner"
            | "accepted"
            | "payment_pending"
            | "paid"
            | "active"
            | "returned"
            | "completed"
            | "cancelled"
            | "declined"
            | "overdue";
          price_per_day?: number;
          days?: number;
          rental_fee?: number;
          deposit?: number;
          service_fee?: number;
          total?: number;
          payment_type?: "card" | null;
          payment_last4?: string | null;
          payment_id?: string | null;
          deposit_refunded?: boolean;
          refund_amount?: number | null;
          pickup_code?: string | null;
          return_code?: string | null;
          pickup_date?: string | null;
          return_date?: string | null;
          notes?: string | null;
          owner_notes?: string | null;
          cancellation_reason?: string | null;
          created_at?: string;
          updated_at?: string;
          accepted_at?: string | null;
          declined_at?: string | null;
          completed_at?: string | null;
        };
      };
      messages: {
        Row: {
          id: string;
          request_id: string;
          sender_id: string;
          recipient_id: string;
          text: string;
          type: "user" | "system" | "quick_reply";
          image_url: string | null;
          read: boolean;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          sender_id: string;
          recipient_id: string;
          text: string;
          type?: "user" | "system" | "quick_reply";
          image_url?: string | null;
          read?: boolean;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          sender_id?: string;
          recipient_id?: string;
          text?: string;
          type?: "user" | "system" | "quick_reply";
          image_url?: string | null;
          read?: boolean;
          read_at?: string | null;
          created_at?: string;
        };
      };
      notifications: {
        Row: {
          id: string;
          user_id: string;
          type: "message" | "request" | "system" | "reminder" | "payment";
          title: string;
          message: string;
          read: boolean;
          read_at: string | null;
          action_url: string | null;
          action_text: string | null;
          related_id: string | null;
          icon: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: "message" | "request" | "system" | "reminder" | "payment";
          title: string;
          message: string;
          read?: boolean;
          read_at?: string | null;
          action_url?: string | null;
          action_text?: string | null;
          related_id?: string | null;
          icon?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: "message" | "request" | "system" | "reminder" | "payment";
          title?: string;
          message?: string;
          read?: boolean;
          read_at?: string | null;
          action_url?: string | null;
          action_text?: string | null;
          related_id?: string | null;
          icon?: string | null;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          request_id: string;
          item_id: string;
          reviewer_id: string;
          reviewee_id: string;
          type: "item" | "borrower" | "owner";
          rating: number;
          comment: string | null;
          would_recommend: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          request_id: string;
          item_id: string;
          reviewer_id: string;
          reviewee_id: string;
          type: "item" | "borrower" | "owner";
          rating: number;
          comment?: string | null;
          would_recommend?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          request_id?: string;
          item_id?: string;
          reviewer_id?: string;
          reviewee_id?: string;
          type?: "item" | "borrower" | "owner";
          rating?: number;
          comment?: string | null;
          would_recommend?: boolean;
          created_at?: string;
        };
      };
    };
  };
}

// Helper types for easier access
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
