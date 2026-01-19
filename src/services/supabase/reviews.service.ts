import { supabase } from "@/lib/supabaseClient";
import { dbReviewToReview } from "@/lib/supabase-helpers";
import type { Review } from "@/lib/types";
import type { TablesInsert } from "@/types/database";

export const supabaseReviewsService = {
  /**
   * Get reviews by item ID
   */
  getByItemId: async (itemId: string): Promise<Review[]> => {
    const { data, error } = (await supabase
      .from("reviews")
      .select(
        `
        *,
        reviewer:profiles!reviewer_id(*)
      `
      )
      .eq("item_id", itemId)
      .order("created_at", { ascending: false })) as {
      data: any[] | null;
      error: any;
    };

    if (error) throw error;
    if (!data) return [];

    return data.map((review) =>
      dbReviewToReview(review, review.reviewer || undefined)
    );
    return data.map((review) =>
      dbReviewToReview(review, review.reviewer || undefined)
    );
  },

  /**
   * Get reviews by reviewee ID
   */
  getByRevieweeId: async (userId: string): Promise<Review[]> => {
    const { data, error } = (await supabase
      .from("reviews")
      .select(
        `
        *,
        reviewer:profiles!reviewer_id(*)
      `
      )
      .eq("reviewee_id", userId)
      .order("created_at", { ascending: false })) as {
      data: any[] | null;
      error: any;
    };

    if (error) throw error;
    if (!data) return [];

    return data.map((review) =>
      dbReviewToReview(review, review.reviewer || undefined)
    );
  },

  /**
   * Create a new review
   */
  create: async (
    reviewData: Omit<Review, "id" | "createdAt">
  ): Promise<Review> => {
    const insert: TablesInsert<"reviews"> = {
      request_id: reviewData.requestId,
      item_id: reviewData.itemId,
      reviewer_id: reviewData.reviewerId,
      reviewee_id: reviewData.revieweeId,
      type: reviewData.type,
      rating: reviewData.rating,
      comment: reviewData.comment,
      would_recommend: reviewData.wouldRecommend,
    };

    const { data, error } = (await supabase
      .from("reviews")
      .insert(insert as any)
      .select(
        `
        *,
        reviewer:profiles!reviewer_id(*)
      `
      )
      .single()) as { data: any | null; error: any };

    if (error) throw error;
    if (!data) throw new Error("Failed to create review");

    return dbReviewToReview(data, data.reviewer || undefined);
  },
};
