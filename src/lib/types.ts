export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  avatar?: string | null;
  bio?: string;
  phone?: string;
  location: {
    address?: string;
    city: string;
    state: string;
    country: string;
    coordinates?: { lat: number; lng: number };
  };
  verification: {
    email: boolean;
    phone: boolean;
    address: boolean;
  };
  stats: {
    rating: number;
    reviewCount: number;
    totalBorrowed: number;
    totalLent: number;
    activeRentals: number;
    responseRate: number;
    responseTime: string;
    memberSince: Date;
    completionRate: number;
  };
  preferences: {
    searchRadius: number;
    defaultPickupWindow: string;
    notificationLevel: "all" | "important" | "minimal";
    emailDigest: boolean;
    pushEnabled: boolean;
  };
  payoutMethod?: {
    type: "bank" | "paypal";
    last4?: string;
    verified: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Item {
  id: string;
  ownerId: string;
  owner?: User;
  title: string;
  description: string;
  category: string;
  pricePerDay: number;
  deposit: number;
  condition: "new" | "like_new" | "good" | "fair";
  images: string[];
  primaryImage: string;
  location: {
    address: string;
    city: string;
    state: string;
    coordinates: { lat: number; lng: number };
    displayAddress: string;
  };
  availability: {
    type: "calendar" | "always" | "by_request";
    blockedDates?: Date[];
    availableDays?: number[];
  };
  pickupInstructions: string;
  pickupWindow: string;
  tags: string[];
  metadata: {
    views: number;
    requests: number;
    bookings: number;
    rating: number;
    reviewCount: number;
  };
  status: "draft" | "published" | "paused" | "archived";
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface Request {
  id: string;
  itemId: string;
  item?: Item;
  borrowerId: string;
  borrower?: User;
  ownerId: string;
  startDate: Date;
  endDate: Date;
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
  pricing: {
    pricePerDay: number;
    days: number;
    rentalFee: number;
    deposit: number;
    serviceFee: number;
    total: number;
  };
  paymentMethod?: {
    type: "card";
    last4: string;
  };
  paymentId?: string;
  depositRefunded?: boolean;
  refundAmount?: number;
  pickupCode?: string;
  returnCode?: string;
  pickupDate?: Date;
  returnDate?: Date;
  notes?: string;
  ownerNotes?: string;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
  acceptedAt?: Date;
  declinedAt?: Date;
  completedAt?: Date;
}

export interface Message {
  id: string;
  requestId: string;
  senderId: string;
  sender?: User;
  recipientId: string;
  text: string;
  type: "user" | "system" | "quick_reply";
  read: boolean;
  imageUrl?: string;
  createdAt: Date;
  readAt?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: "message" | "request" | "system" | "reminder" | "payment";
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  actionText?: string;
  relatedId?: string;
  icon?: string;
  createdAt: Date;
  readAt?: Date;
}

export interface Review {
  id: string;
  requestId: string;
  itemId: string;
  reviewerId: string;
  reviewer?: User;
  revieweeId: string;
  type: "item" | "borrower" | "owner";
  rating: number;
  comment?: string;
  wouldRecommend: boolean;
  createdAt: Date;
}

export interface PricingBreakdown {
  days: number;
  rentalFee: number;
  serviceFee: number;
  deposit: number;
  total: number;
}
