import { supabase } from "@/lib/supabaseClient";

export const supabaseStorageService = {
  /**
   * Upload an avatar image for a specific user
   * @param file The file object to upload
   * @param userId The ID of the user
   * @returns The public URL of the uploaded image
   */
  uploadAvatar: async (file: File, userId: string): Promise<string> => {
    // 1. Validate file type and size
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    // Max size 5MB
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("File size must be less than 5MB");
    }

    // 2. Generate a unique file path: avatars/{userId}/{timestamp}.{ext}
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // 3. Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      throw uploadError;
    }

    // 4. Get Public URL
    const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

    return data.publicUrl;
  },
};
