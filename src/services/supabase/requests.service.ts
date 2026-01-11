import { supabase } from "@/lib/supabaseClient";
import { dbRequestToRequest, toDbDate } from "@/lib/supabase-helpers";
import type { Request } from "@/lib/types";
import type { TablesInsert, TablesUpdate } from "@/types/database";

export const supabaseRequestsService = {
  /**
   * Get all requests with optional filtering by user and role
   */
  getAll: async (
    userId?: string,
    role?: "borrower" | "owner"
  ): Promise<Request[]> => {
    let query = supabase.from("requests").select(`
        *,
        item:items(*,owner:profiles!owner_id(*)),
        borrower:profiles!borrower_id(*)
      `);

    if (userId && role === "borrower") {
      query = query.eq("borrower_id", userId);
    } else if (userId && role === "owner") {
      query = query.eq("owner_id", userId);
    }

    query = query.order("created_at", { ascending: false });

    const { data, error } = (await query) as { data: any[] | null; error: any };

    if (error) throw error;
    if (!data) return [];

    return data.map((request) =>
      dbRequestToRequest(
        request,
        request.item || undefined,
        request.borrower || undefined,
        request.item?.owner || undefined
      )
    );
  },

  /**
   * Get request by ID
   */
  getById: async (id: string): Promise<Request | null> => {
    const { data, error } = (await supabase
      .from("requests")
      .select(
        `
        *,
        item:items(*,owner:profiles!owner_id(*)),
        borrower:profiles!borrower_id(*)
      `
      )
      .eq("id", id)
      .single()) as { data: any | null; error: any };

    if (error) {
      if (error.code === "PGRST116") return null; // Not found
      throw error;
    }
    if (!data) return null;

    return dbRequestToRequest(
      data,
      data.item || undefined,
      data.borrower || undefined,
      data.item?.owner || undefined
    );
  },

  /**
   * Create new request
   */
  create: async (
    requestData: Omit<Request, "id" | "createdAt" | "updatedAt">
  ): Promise<Request> => {
    const insert: TablesInsert<"requests"> = {
      item_id: requestData.itemId,
      borrower_id: requestData.borrowerId,
      owner_id: requestData.ownerId,
      start_date: toDbDate(requestData.startDate),
      end_date: toDbDate(requestData.endDate),
      status: requestData.status,
      price_per_day: requestData.pricing.pricePerDay,
      days: requestData.pricing.days,
      rental_fee: requestData.pricing.rentalFee,
      deposit: requestData.pricing.deposit,
      service_fee: requestData.pricing.serviceFee,
      total: requestData.pricing.total,
      payment_type: requestData.paymentMethod?.type,
      payment_last4: requestData.paymentMethod?.last4,
      payment_id: requestData.paymentId,
      notes: requestData.notes,
    };

    const { data, error } = (await supabase
      .from("requests")
      .insert(insert as any)
      .select(
        `
        *,
        item:items(*,owner:profiles!owner_id(*)),
        borrower:profiles!borrower_id(*)
      `
      )
      .single()) as { data: any | null; error: any };

    if (error) throw error;
    if (!data) throw new Error("Failed to create request");

    return dbRequestToRequest(
      data,
      data.item || undefined,
      data.borrower || undefined,
      data.item?.owner || undefined
    );
  },

  /**
   * Update existing request
   */
  update: async (
    id: string,
    requestData: Partial<Request>
  ): Promise<Request> => {
    const update: TablesUpdate<"requests"> = {};

    if (requestData.status) {
      update.status = requestData.status;

      // Set timestamps based on status
      if (requestData.status === "accepted") {
        update.accepted_at = new Date().toISOString();
      } else if (requestData.status === "declined") {
        update.declined_at = new Date().toISOString();
      } else if (requestData.status === "completed") {
        update.completed_at = new Date().toISOString();
      }
    }

    if (requestData.pickupCode !== undefined)
      update.pickup_code = requestData.pickupCode;
    if (requestData.returnCode !== undefined)
      update.return_code = requestData.returnCode;
    if (requestData.pickupDate)
      update.pickup_date = toDbDate(requestData.pickupDate);
    if (requestData.returnDate)
      update.return_date = toDbDate(requestData.returnDate);
    if (requestData.ownerNotes !== undefined)
      update.owner_notes = requestData.ownerNotes;
    if (requestData.cancellationReason !== undefined)
      update.cancellation_reason = requestData.cancellationReason;
    if (requestData.depositRefunded !== undefined)
      update.deposit_refunded = requestData.depositRefunded;
    if (requestData.refundAmount !== undefined)
      update.refund_amount = requestData.refundAmount;

    if (requestData.paymentMethod) {
      update.payment_type = requestData.paymentMethod.type;
      update.payment_last4 = requestData.paymentMethod.last4;
    }
    if (requestData.paymentId !== undefined)
      update.payment_id = requestData.paymentId;

    const { data, error } = (await supabase
      .from("requests")
      // @ts-expect-error - Supabase type inference issue with generic Database type
      .update(update as any)
      .eq("id", id)
      .select(
        `
        *,
        item:items(*,owner:profiles!owner_id(*)),
        borrower:profiles!borrower_id(*)
      `
      )
      .single()) as { data: any | null; error: any };

    if (error) throw error;
    if (!data) throw new Error("Failed to update request");

    return dbRequestToRequest(
      data,
      data.item || undefined,
      data.borrower || undefined,
      data.item?.owner || undefined
    );
  },
  delete: async (id: string): Promise<void> => {
    const { error, count } = await supabase
      .from("requests")
      .delete({ count: "exact" })
      .eq("id", id);

    if (error) throw error;
    if (count === 0) {
      throw new Error(
        "Unable to delete request. You may not have permission or it may not exist."
      );
    }
  },
};
