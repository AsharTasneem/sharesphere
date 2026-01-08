import { supabase } from '@/lib/supabaseClient';
import { dbItemToItem, toDbDate } from '@/lib/supabase-helpers';
import type { Item } from '@/lib/types';
import type { TablesInsert, TablesUpdate } from '@/types/database';

export const supabaseItemsService = {
    /**
     * Get all items with optional filters
     */
    getAll: async (filters?: {
        category?: string;
        minPrice?: number;
        maxPrice?: number;
        search?: string;
        sort?: string;
    }): Promise<Item[]> => {
        let query = supabase
            .from('items')
            .select(`
        *,
        owner:profiles!owner_id(*)
      `)
            .eq('status', 'published');

        // Apply filters
        if (filters?.category) {
            query = query.eq('category', filters.category);
        }

        if (filters?.minPrice !== undefined) {
            query = query.gte('price_per_day', filters.minPrice);
        }

        if (filters?.maxPrice !== undefined) {
            query = query.lte('price_per_day', filters.maxPrice);
        }

        if (filters?.search) {
            query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
        }

        // Apply sorting
        if (filters?.sort) {
            switch (filters.sort) {
                case 'price_low':
                    query = query.order('price_per_day', { ascending: true });
                    break;
                case 'price_high':
                    query = query.order('price_per_day', { ascending: false });
                    break;
                case 'newest':
                    query = query.order('created_at', { ascending: false });
                    break;
                case 'rating':
                    query = query.order('rating', { ascending: false });
                    break;
                default:
                    query = query.order('created_at', { ascending: false });
            }
        } else {
            query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query as { data: any[] | null; error: any };

        if (error) throw error;
        if (!data) return [];

        return data.map((item) => dbItemToItem(item, item.owner || undefined));
    },

    /**
     * Get item by ID
     */
    getById: async (id: string): Promise<Item | null> => {
        const { data, error } = await supabase
            .from('items')
            .select(`
        *,
        owner:profiles!owner_id(*)
      `)
            .eq('id', id)
            .single() as { data: any | null; error: any };

        if (error) {
            if (error.code === 'PGRST116') return null; // Not found
            throw error;
        }
        if (!data) return null;

        // Increment view count
        // @ts-expect-error - Supabase RPC type inference issue
        await supabase.rpc('increment_item_views', { item_id: id });

        return dbItemToItem(data, data.owner || undefined);
    },

    /**
     * Create new item
     */
    create: async (itemData: Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'metadata'>): Promise<Item> => {
        const insert: TablesInsert<'items'> = {
            owner_id: itemData.ownerId,
            title: itemData.title,
            description: itemData.description,
            category: itemData.category,
            price_per_day: itemData.pricePerDay,
            deposit: itemData.deposit,
            condition: itemData.condition,
            images: itemData.images,
            primary_image: itemData.primaryImage,
            address: itemData.location.address,
            city: itemData.location.city,
            state: itemData.location.state,
            latitude: itemData.location.coordinates?.lat,
            longitude: itemData.location.coordinates?.lng,
            display_address: itemData.location.displayAddress,
            availability_type: itemData.availability.type,
            blocked_dates: itemData.availability.blockedDates?.map(d => toDbDate(d)),
            available_days: itemData.availability.availableDays,
            pickup_instructions: itemData.pickupInstructions,
            pickup_window: itemData.pickupWindow,
            tags: itemData.tags,
            status: itemData.status,
            published_at: itemData.status === 'published' ? new Date().toISOString() : undefined,
        };

        const { data, error } = await supabase
            .from('items')
            .insert(insert as any)
            .select(`
        *,
        owner:profiles!owner_id(*)
      `)
            .single() as { data: any | null; error: any };

        if (error) throw error;
        if (!data) throw new Error('Failed to create item');

        return dbItemToItem(data, data.owner || undefined);
    },

    /**
     * Update existing item
     */
    update: async (id: string, itemData: Partial<Item>): Promise<Item> => {
        const update: TablesUpdate<'items'> = {};

        if (itemData.title) update.title = itemData.title;
        if (itemData.description) update.description = itemData.description;
        if (itemData.category) update.category = itemData.category;
        if (itemData.pricePerDay !== undefined) update.price_per_day = itemData.pricePerDay;
        if (itemData.deposit !== undefined) update.deposit = itemData.deposit;
        if (itemData.condition) update.condition = itemData.condition;
        if (itemData.images) update.images = itemData.images;
        if (itemData.primaryImage !== undefined) update.primary_image = itemData.primaryImage;
        if (itemData.pickupInstructions !== undefined) update.pickup_instructions = itemData.pickupInstructions;
        if (itemData.pickupWindow !== undefined) update.pickup_window = itemData.pickupWindow;
        if (itemData.tags) update.tags = itemData.tags;
        if (itemData.status) {
            update.status = itemData.status;
            if (itemData.status === 'published') {
                update.published_at = new Date().toISOString();
            }
        }

        if (itemData.location) {
            if (itemData.location.address !== undefined) update.address = itemData.location.address;
            if (itemData.location.city !== undefined) update.city = itemData.location.city;
            if (itemData.location.state !== undefined) update.state = itemData.location.state;
            if (itemData.location.displayAddress !== undefined) update.display_address = itemData.location.displayAddress;
            if (itemData.location.coordinates) {
                update.latitude = itemData.location.coordinates.lat;
                update.longitude = itemData.location.coordinates.lng;
            }
        }

        if (itemData.availability) {
            if (itemData.availability.type) update.availability_type = itemData.availability.type;
            if (itemData.availability.blockedDates !== undefined) {
                update.blocked_dates = itemData.availability.blockedDates?.map(d => toDbDate(d));
            }
            if (itemData.availability.availableDays !== undefined) {
                update.available_days = itemData.availability.availableDays;
            }
        }

        const { data, error } = await supabase
            .from('items')
            // @ts-expect-error - Supabase type inference issue with generic Database type
            .update(update as any)
            .eq('id', id)
            .select(`
        *,
        owner:profiles!owner_id(*)
      `)
            .single() as { data: any | null; error: any };

        if (error) throw error;
        if (!data) throw new Error('Failed to update item');

        return dbItemToItem(data, data.owner || undefined);
    },

    /**
     * Delete item
     */
    delete: async (id: string): Promise<void> => {
        const { error } = await supabase
            .from('items')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },
};
