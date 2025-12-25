import { create } from 'zustand';
import { Message } from '@/lib/types';
import { messagesApi } from '@/services/api';

interface MessageStore {
  conversations: Map<string, Message[]>;
  unreadCounts: Map<string, number>;
  loading: boolean;
  fetchMessages: (requestId: string) => Promise<void>;
  sendMessage: (requestId: string, text: string, senderId: string, recipientId: string) => Promise<void>;
  markAsRead: (requestId: string, messageId: string) => Promise<void>;
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  conversations: new Map(),
  unreadCounts: new Map(),
  loading: false,

  fetchMessages: async (requestId: string) => {
    set({ loading: true });
    try {
      const messages = await messagesApi.getByRequestId(requestId);
      const conversations = new Map(get().conversations);
      conversations.set(requestId, messages);
      const unreadCount = messages.filter(m => !m.read).length;
      const unreadCounts = new Map(get().unreadCounts);
      unreadCounts.set(requestId, unreadCount);
      set({ conversations, unreadCounts, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to fetch messages:', error);
    }
  },

  sendMessage: async (requestId: string, text: string, senderId: string, recipientId: string) => {
    try {
      const message = await messagesApi.send({
        requestId,
        senderId,
        recipientId,
        text,
        type: 'user',
      });

      const conversations = new Map(get().conversations);
      const existing = conversations.get(requestId) || [];
      conversations.set(requestId, [...existing, message]);
      set({ conversations });
    } catch (error) {
      console.error('Failed to send message:', error);
      throw error;
    }
  },

  markAsRead: async (requestId: string, messageId: string) => {
    try {
      await messagesApi.markAsRead(messageId);
      const conversations = new Map(get().conversations);
      const messages = conversations.get(requestId) || [];
      const updated = messages.map(m =>
        m.id === messageId ? { ...m, read: true, readAt: new Date() } : m
      );
      conversations.set(requestId, updated);
      const unreadCount = updated.filter(m => !m.read).length;
      const unreadCounts = new Map(get().unreadCounts);
      unreadCounts.set(requestId, unreadCount);
      set({ conversations, unreadCounts });
    } catch (error) {
      console.error('Failed to mark message as read:', error);
    }
  },
}));



