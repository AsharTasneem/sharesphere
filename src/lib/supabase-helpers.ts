import type { Tables } from "@/types/database";
import type {
  User,
  Item,
  Request,
  Message,
  Notification,
  Review,
} from "./types";

/**
 * Helper functions to convert between database types and application types
 */

// Profile (Database) → User (Application)
export function dbProfileToUser(profile: Tables<"profiles">): User {
  return {
    id: profile.id,
    email: profile.email,
    name: profile.name,
    avatar: profile.avatar || undefined,
    bio: profile.bio || undefined,
    phone: profile.phone || undefined,
    location: {
      address: profile.address || undefined,
      city: profile.city,
      state: profile.state,
      country: profile.country,
      coordinates:
        profile.latitude && profile.longitude
          ? { lat: profile.latitude, lng: profile.longitude }
          : undefined,
    },
    verification: {
      email: profile.email_verified,
      phone: profile.phone_verified,
      address: profile.address_verified,
    },
    stats: {
      rating: Math.min(profile.rating || 0, 4.9),
      reviewCount: profile.review_count,
      totalBorrowed: profile.total_borrowed,
      totalLent: profile.total_lent,
      activeRentals: profile.active_rentals,
      responseRate: profile.response_rate,
      responseTime: profile.response_time,
      memberSince: new Date(profile.created_at),
      completionRate: profile.completion_rate,
    },
    preferences: {
      searchRadius: profile.search_radius,
      defaultPickupWindow: profile.default_pickup_window,
      notificationLevel: profile.notification_level,
      emailDigest: profile.email_digest,
      pushEnabled: profile.push_enabled,
    },
    payoutMethod: profile.payout_type
      ? {
          type: profile.payout_type,
          last4: profile.payout_last4 || undefined,
          verified: profile.payout_verified,
        }
      : undefined,
    createdAt: new Date(profile.created_at),
    updatedAt: new Date(profile.updated_at),
  };
}

// Item (Database) → Item (Application)
export function dbItemToItem(
  item: Tables<"items">,
  owner?: Tables<"profiles">
): Item {
  return {
    id: item.id,
    ownerId: item.owner_id,
    owner: owner ? dbProfileToUser(owner) : undefined,
    title: item.title,
    description: item.description,
    category: item.category,
    pricePerDay: item.price_per_day,
    deposit: item.deposit,
    condition: item.condition,
    images: item.images,
    primaryImage: item.primary_image || "",
    location: {
      address: item.address || "",
      city: item.city || "",
      state: item.state || "",
      coordinates:
        item.latitude && item.longitude
          ? { lat: item.latitude, lng: item.longitude }
          : { lat: 0, lng: 0 },
      displayAddress: item.display_address || "",
    },
    availability: {
      type: item.availability_type,
      blockedDates: item.blocked_dates?.map((d) => new Date(d)),
      availableDays: item.available_days || undefined,
    },
    pickupInstructions: item.pickup_instructions || "",
    pickupWindow: item.pickup_window || "",
    tags: item.tags,
    metadata: {
      views: item.views,
      requests: item.requests_count,
      bookings: item.bookings_count,
      rating: item.rating,
      reviewCount: item.review_count,
    },
    status: item.status,
    createdAt: new Date(item.created_at),
    updatedAt: new Date(item.updated_at),
    publishedAt: item.published_at ? new Date(item.published_at) : undefined,
  };
}

// Request (Database) → Request (Application)
export function dbRequestToRequest(
  request: Tables<"requests">,
  item?: Tables<"items">,
  borrower?: Tables<"profiles">,
  itemOwner?: Tables<"profiles">
): Request {
  return {
    id: request.id,
    itemId: request.item_id,
    item: item ? dbItemToItem(item, itemOwner) : undefined,
    borrowerId: request.borrower_id,
    borrower: borrower ? dbProfileToUser(borrower) : undefined,
    ownerId: request.owner_id,
    startDate: new Date(request.start_date),
    endDate: new Date(request.end_date),
    status: request.status,
    pricing: {
      pricePerDay: request.price_per_day,
      days: request.days,
      rentalFee: request.rental_fee,
      deposit: request.deposit,
      serviceFee: request.service_fee,
      total: request.total,
    },
    paymentMethod:
      request.payment_type && request.payment_last4
        ? {
            type: request.payment_type,
            last4: request.payment_last4,
          }
        : undefined,
    paymentId: request.payment_id || undefined,
    depositRefunded: request.deposit_refunded || undefined,
    refundAmount: request.refund_amount || undefined,
    pickupCode: request.pickup_code || undefined,
    returnCode: request.return_code || undefined,
    pickupDate: request.pickup_date ? new Date(request.pickup_date) : undefined,
    returnDate: request.return_date ? new Date(request.return_date) : undefined,
    notes: request.notes || undefined,
    ownerNotes: request.owner_notes || undefined,
    cancellationReason: request.cancellation_reason || undefined,
    createdAt: new Date(request.created_at),
    updatedAt: new Date(request.updated_at),
    acceptedAt: request.accepted_at ? new Date(request.accepted_at) : undefined,
    declinedAt: request.declined_at ? new Date(request.declined_at) : undefined,
    completedAt: request.completed_at
      ? new Date(request.completed_at)
      : undefined,
  };
}

// Message (Database) → Message (Application)
export function dbMessageToMessage(
  message: Tables<"messages">,
  sender?: Tables<"profiles">
): Message {
  return {
    id: message.id,
    requestId: message.request_id,
    senderId: message.sender_id,
    sender: sender ? dbProfileToUser(sender) : undefined,
    recipientId: message.recipient_id,
    text: message.text,
    type: message.type,
    read: message.read,
    imageUrl: message.image_url || undefined,
    createdAt: new Date(message.created_at),
    readAt: message.read_at ? new Date(message.read_at) : undefined,
  };
}

// Notification (Database) → Notification (Application)
export function dbNotificationToNotification(
  notification: Tables<"notifications">
): Notification {
  return {
    id: notification.id,
    userId: notification.user_id,
    type: notification.type,
    title: notification.title,
    message: notification.message,
    read: notification.read,
    actionUrl: notification.action_url || undefined,
    actionText: notification.action_text || undefined,
    relatedId: notification.related_id || undefined,
    icon: notification.icon || undefined,
    createdAt: new Date(notification.created_at),
    readAt: notification.read_at ? new Date(notification.read_at) : undefined,
  };
}

// Review (Database) → Review (Application)
export function dbReviewToReview(
  review: Tables<"reviews">,
  reviewer?: Tables<"profiles">
): Review {
  return {
    id: review.id,
    requestId: review.request_id,
    itemId: review.item_id,
    reviewerId: review.reviewer_id,
    reviewer: reviewer ? dbProfileToUser(reviewer) : undefined,
    revieweeId: review.reviewee_id,
    type: review.type,
    rating: review.rating,
    comment: review.comment || undefined,
    wouldRecommend: review.would_recommend,
    createdAt: new Date(review.created_at),
  };
}

// Helper to format dates for database (ISO string)
export function toDbDate(date: Date): string {
  return date.toISOString();
}

// Helper to parse database dates
export function fromDbDate(dateString: string): Date {
  return new Date(dateString);
}
