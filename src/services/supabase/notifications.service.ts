import { supabase } from '@/lib/supabaseClient';
import { dbNotificationToNotification } from '@/lib/supabase-helpers';
import type { Notification } from '@/lib/types';

export const supabaseNotificationsService = {
    /**
     * Get all notifications for a user
     */
    getAll: async (userId: string): Promise<Notification[]> => {
        const { data, error } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        if (!data) return [];

        return data.map(dbNotificationToNotification);
    },

    /**
     * Mark notification as read
     */
    markAsRead: async (id: string): Promise<void> => {
        const { error } = await supabase
            .from('notifications')
            // @ts-expect-error - Supabase type inference issue with generic Database type
            .update({
                read: true,
                read_at: new Date().toISOString(),
            } as any)
            .eq('id', id);

        if (error) throw error;
    },

    /**
     * Mark all notifications as read for a user
     */
    markAllAsRead: async (userId: string): Promise<void> => {
        const { error } = await supabase
            .from('notifications')
            // @ts-expect-error - Supabase type inference issue with generic Database type
            .update({
                read: true,
                read_at: new Date().toISOString(),
            } as any)
            .eq('user_id', userId)
            .eq('read', false);

        if (error) throw error;
    },
};
