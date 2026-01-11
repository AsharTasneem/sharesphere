import { supabase } from '@/lib/supabaseClient';
import { dbMessageToMessage } from '@/lib/supabase-helpers';
import type { Message } from '@/lib/types';
import type { TablesInsert } from '@/types/database';

export const supabaseMessagesService = {
    /**
     * Get messages by request ID
     */
    getByRequestId: async (requestId: string): Promise<Message[]> => {
        const { data, error } = await supabase
            .from('messages')
            .select(`
        *,
        sender:profiles!sender_id(*)
      `)
            .eq('request_id', requestId)
            .order('created_at', { ascending: true }) as { data: any[] | null; error: any };

        if (error) throw error;
        if (!data) return [];

        return data.map((message) => dbMessageToMessage(message, message.sender || undefined));
    },

    /**
     * Send a new message
     */
    send: async (messageData: Omit<Message, 'id' | 'createdAt' | 'read' | 'readAt'>): Promise<Message> => {
        const insert: TablesInsert<'messages'> = {
            request_id: messageData.requestId,
            sender_id: messageData.senderId,
            recipient_id: messageData.recipientId,
            text: messageData.text,
            type: messageData.type,
            image_url: messageData.imageUrl,
        };

        const { data, error } = await supabase
            .from('messages')
            .insert(insert as any)
            .select(`
        *,
        sender:profiles!sender_id(*)
      `)
            .single() as { data: any | null; error: any };

        if (error) throw error;
        if (!data) throw new Error('Failed to send message');

        return dbMessageToMessage(data, data.sender || undefined);
    },

    /**
     * Mark message as read
     */
    markAsRead: async (messageId: string): Promise<void> => {
        const { error } = await supabase
            .from('messages')
            // @ts-expect-error - Supabase type inference issue with generic Database type
            .update({
                read: true,
                read_at: new Date().toISOString(),
            } as any)
            .eq('id', messageId);

        if (error) throw error;
    },
};
