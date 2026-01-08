import { User, Item, Request, Message, Notification, Review } from '@/lib/types';
import { supabaseAuthService } from './supabase/auth.service';
import { supabaseItemsService } from './supabase/items.service';
import { supabaseRequestsService } from './supabase/requests.service';
import { supabaseMessagesService } from './supabase/messages.service';
import { supabaseNotificationsService } from './supabase/notifications.service';
import { supabaseReviewsService } from './supabase/reviews.service';

// Auth API - Now using Supabase
export const authApi = {
  signIn: async (email: string, password: string): Promise<User> => {
    return supabaseAuthService.signIn(email, password);
  },

  signUp: async (data: { email: string; password: string; name: string }): Promise<User> => {
    return supabaseAuthService.signUp(data);
  },

  getCurrentUser: async (): Promise<User | null> => {
    return supabaseAuthService.getCurrentUser();
  },
};

// Items API - Now using Supabase
export const itemsApi = {
  getAll: async (filters?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    search?: string;
    sort?: string;
  }): Promise<Item[]> => {
    return supabaseItemsService.getAll(filters);
  },

  getById: async (id: string): Promise<Item | null> => {
    return supabaseItemsService.getById(id);
  },

  create: async (data: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'metadata'>): Promise<Item> => {
    return supabaseItemsService.create(data);
  },

  update: async (id: string, data: Partial<Item>): Promise<Item> => {
    return supabaseItemsService.update(id, data);
  },

  delete: async (id: string): Promise<void> => {
    return supabaseItemsService.delete(id);
  },
};

// Requests API - Now using Supabase
export const requestsApi = {
  getAll: async (userId?: string, role?: 'borrower' | 'owner'): Promise<Request[]> => {
    return supabaseRequestsService.getAll(userId, role);
  },

  getById: async (id: string): Promise<Request | null> => {
    return supabaseRequestsService.getById(id);
  },

  create: async (data: Omit<Request, 'id' | 'createdAt' | 'updatedAt'>): Promise<Request> => {
    return supabaseRequestsService.create(data);
  },

  update: async (id: string, data: Partial<Request>): Promise<Request> => {
    return supabaseRequestsService.update(id, data);
  },
};

// Messages API - Now using Supabase
export const messagesApi = {
  getByRequestId: async (requestId: string): Promise<Message[]> => {
    return supabaseMessagesService.getByRequestId(requestId);
  },

  send: async (data: Omit<Message, 'id' | 'createdAt' | 'read' | 'readAt'>): Promise<Message> => {
    return supabaseMessagesService.send(data);
  },

  markAsRead: async (messageId: string): Promise<void> => {
    return supabaseMessagesService.markAsRead(messageId);
  },
};

// Notifications API - Now using Supabase
export const notificationsApi = {
  getAll: async (userId: string): Promise<Notification[]> => {
    return supabaseNotificationsService.getAll(userId);
  },

  markAsRead: async (id: string): Promise<void> => {
    return supabaseNotificationsService.markAsRead(id);
  },

  markAllAsRead: async (userId: string): Promise<void> => {
    return supabaseNotificationsService.markAllAsRead(userId);
  },
};

// Reviews API - Now using Supabase
export const reviewsApi = {
  getByItemId: async (itemId: string): Promise<Review[]> => {
    return supabaseReviewsService.getByItemId(itemId);
  },

  create: async (data: Omit<Review, 'id' | 'createdAt'>): Promise<Review> => {
    return supabaseReviewsService.create(data);
  },
};
