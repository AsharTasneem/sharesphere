import { supabase } from "@/lib/supabaseClient";

export interface UserStats {
  totalBorrowed: number;
  totalLent: number;
  rating: number;
  reviewCount: number;
  responseRate: number;
  responseTime: string; // Keep as string for now
  completionRate: number;
}

export const statsService = {
  async getUserStats(userId: string): Promise<UserStats> {
    try {
      // 1. Total Borrowed: Requests where user is borrower and status is 'completed'
      const { count: borrowedCount, error: borrowedError } = await supabase
        .from("requests")
        .select("*", { count: "exact", head: true })
        .eq("borrower_id", userId)
        .eq("status", "completed");

      if (borrowedError) throw borrowedError;

      // 2. Total Lent: Requests where user is owner and status is 'completed'
      const { count: lentCount, error: lentError } = await supabase
        .from("requests")
        .select("*", { count: "exact", head: true })
        .eq("owner_id", userId)
        .eq("status", "completed");

      if (lentError) throw lentError;

      // 3. Rating & Review Count: Reviews where user is reviewee
      const { data: reviews, error: reviewsError } = await supabase
        .from("reviews")
        .select("rating")
        .eq("reviewee_id", userId);

      if (reviewsError) throw reviewsError;

      let averageRating = 0;
      if (reviews && reviews.length > 0) {
        const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
        averageRating = totalRating / reviews.length;
      }

      // 4. Response Rate (Placeholder logic for now, or could query messages/requests)
      // For now, we'll return a default if we can't easily calculate it without complex joins
      const responseRate = 100; // Placeholder

      // 5. Completion Rate: Completed requests / Total non-cancelled requests (as owner or borrower)
      // This is a bit complex, let's stick to a simple placeholder or existing logic if available
      const completionRate = 100; // Placeholder

      return {
        totalBorrowed: borrowedCount || 0,
        totalLent: lentCount || 0,
        rating: averageRating,
        reviewCount: reviews?.length || 0,
        responseRate: responseRate,
        responseTime: "Same day", // Placeholder
        completionRate: completionRate,
      };
    } catch (error) {
      console.error("Error fetching user stats:", error);
      // Return zeros on error to avoid crashing UI
      return {
        totalBorrowed: 0,
        totalLent: 0,
        rating: 0,
        reviewCount: 0,
        responseRate: 0,
        responseTime: "N/A",
        completionRate: 0,
      };
    }
  },
};
