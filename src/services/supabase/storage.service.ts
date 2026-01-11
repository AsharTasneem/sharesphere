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

  /**
   * Upload multiple item images
   * @param files Array of file objects
   * @param userId The ID of the user uploading
   * @returns Array of public URLs
   */
  uploadItemImages: async (
    files: File[],
    userId: string
  ): Promise<string[]> => {
    const uploadPromises = files.map(async (file) => {
      // 1. Validate
      if (!file.type.startsWith("image/")) {
        throw new Error(`File ${file.name} must be an image`);
      }

      if (file.size > 5 * 1024 * 1024) {
        throw new Error(`File ${file.name} must be less than 5MB`);
      }

      // 2. Generate path
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // 3. Upload to "items" bucket
      const { error: uploadError } = await supabase.storage
        .from("items")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        console.error("Supabase storage error:", uploadError);
        if (
          uploadError.message.includes("Bucket not found") ||
          (uploadError as any).error === "Bucket not found"
        ) {
          throw new Error(
            "Storage bucket 'items' not found. Go to Supabase > Storage > Create a new public bucket named 'items'."
          );
        }
        if (uploadError.message.includes("row-level security policy")) {
          throw new Error(
            "Permission denied. You need to add an RLS policy to the 'items' bucket to allow uploads. Run the SQL script provided."
          );
        }
        throw uploadError;
      }

      // 4. Get URL
      const { data } = supabase.storage.from("items").getPublicUrl(filePath);

      if (!data || !data.publicUrl) {
        throw new Error("Failed to get public URL for uploaded image");
      }

      return data.publicUrl;
    });

    return Promise.all(uploadPromises);
  },
};
