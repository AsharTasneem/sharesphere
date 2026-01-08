import { supabase } from '@/lib/supabaseClient';

export const supabaseStorageService = {
    /**
     * Upload an item image to Supabase Storage
     */
    uploadItemImage: async (file: File, userId: string): Promise<string> => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}/${Date.now()}.${fileExt}`;

        const { data, error } = await supabase.storage
            .from('item-images')
            .upload(fileName, file, {
                cacheControl: '3600',
                upsert: false,
            });

        if (error) throw error;
        if (!data) throw new Error('Failed to upload image');

        return supabaseStorageService.getPublicUrl(data.path);
    },

    /**
     * Upload multiple item images
     */
    uploadItemImages: async (files: File[], userId: string): Promise<string[]> => {
        const uploadPromises = files.map((file) =>
            supabaseStorageService.uploadItemImage(file, userId)
        );

        return Promise.all(uploadPromises);
    },

    /**
     * Delete an item image from storage
     */
    deleteItemImage: async (path: string): Promise<void> => {
        // Extract path from URL if full URL is provided
        const filePath = path.includes('item-images/')
            ? path.split('item-images/')[1]
            : path;

        const { error } = await supabase.storage
            .from('item-images')
            .remove([filePath]);

        if (error) throw error;
    },

    /**
     * Get public URL for an image
     */
    getPublicUrl: (path: string): string => {
        const { data } = supabase.storage
            .from('item-images')
            .getPublicUrl(path);

        return data.publicUrl;
    },
};
