import { create } from 'zustand';
import { Notification } from '@/lib/types';
import { notificationsApi } from '@/services/api';
import { useAuthStore } from './authStore';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    set({ loading: true });
    try {
      const notifications = await notificationsApi.getAll(user.id);
      const unreadCount = notifications.filter(n => !n.read).length;
      set({ notifications, unreadCount, loading: false });
    } catch (error) {
      set({ loading: false });
      console.error('Failed to fetch notifications:', error);
    }
  },

  markAsRead: async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      const { notifications } = get();
      const updated = notifications.map(n =>
        n.id === id ? { ...n, read: true, readAt: new Date() } : n
      );
      const unreadCount = updated.filter(n => !n.read).length;
      set({ notifications: updated, unreadCount });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  },

  markAllAsRead: async () => {
    const user = useAuthStore.getState().user;
    if (!user) return;

    try {
      await notificationsApi.markAllAsRead(user.id);
      const { notifications } = get();
      const updated = notifications.map(n => ({ ...n, read: true, readAt: new Date() }));
      set({ notifications: updated, unreadCount: 0 });
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  },

  addNotification: (notification: Notification) => {
    const { notifications } = get();
    const updated = [notification, ...notifications];
    const unreadCount = updated.filter(n => !n.read).length;
    set({ notifications: updated, unreadCount });
  },
}));



