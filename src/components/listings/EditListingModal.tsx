import { useState, useRef, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { itemsApi } from "@/services/api";
import { supabaseStorageService } from "@/services/supabase/storage.service";
import { useUIStore } from "@/stores/uiStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Modal } from "@/components/ui/Modal";
import { CATEGORIES, ITEM_CONDITIONS, PICKUP_WINDOWS } from "@/lib/constants";
import { Item } from "@/lib/types";

const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(1, "Category is required"),
  pricePerDay: z.number().min(1, "Price must be at least $1"),
  deposit: z.number().min(0, "Deposit cannot be negative"),
  condition: z.enum(["new", "like_new", "good", "fair"]),
  pickupInstructions: z.string().min(10, "Pickup instructions are required"),
  pickupWindow: z.string().min(1, "Pickup window is required"),
});

type ListingForm = z.infer<typeof listingSchema>;

interface EditListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: Item;
}

export function EditListingModal({
  isOpen,
  onClose,
  item,
}: EditListingModalProps) {
  if (!item) return null;

  console.log("EditListingModal rendering for item:", item.id);
  const { showToast } = useUIStore();
  const queryClient = useQueryClient();

  // State for images
  const [images, setImages] = useState<string[]>(item.images || []);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ListingForm>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      title: item.title,
      description: item.description,
      category: item.category,
      pricePerDay: item.pricePerDay,
      deposit: item.deposit,
      condition: item.condition,
      pickupInstructions: item.pickupInstructions,
      pickupWindow: item.pickupWindow,
    },
  });

  // Reset form when item changes
  useEffect(() => {
    if (isOpen) {
      reset({
        title: item.title,
        description: item.description,
        category: item.category,
        pricePerDay: item.pricePerDay,
        deposit: item.deposit,
        condition: item.condition,
        pickupInstructions: item.pickupInstructions,
        pickupWindow: item.pickupWindow,
      });
      setImages(item.images || []);
      setImageFiles([]);
    }
  }, [isOpen, item, reset]);

  const mutation = useMutation({
    mutationFn: async (data: ListingForm) => {
      let finalImages = [...images]; // Start with existing images

      // Upload new images if any
      if (imageFiles.length > 0) {
        setUploadingImages(true);
        try {
          const newImageUrls = await supabaseStorageService.uploadItemImages(
            imageFiles,
            item.ownerId
          );
          finalImages = [...finalImages, ...newImageUrls];
        } catch (error: any) {
          setUploadingImages(false);
          console.error("Upload failed details:", error);
          throw new Error(error.message || "Failed to upload images");
        }
        setUploadingImages(false);
      }

      return itemsApi.update(item.id, {
        ...data,
        images: finalImages,
        primaryImage: finalImages[0] || "",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      queryClient.invalidateQueries({ queryKey: ["item", item.id] });
      showToast("Listing updated successfully!", "success");
      onClose();
    },
    onError: (error) => {
      console.error("Update listing error:", error);
      showToast(`Failed to update listing: ${error.message}`, "error");
    },
  });

  const onSubmit = (data: ListingForm) => {
    mutation.mutate(data);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);

      if (images.length + imageFiles.length + newFiles.length <= 10) {
        // Store files for upload
        setImageFiles([...imageFiles, ...newFiles]);

        // We append these to the images array for display purposes.
        // Note: In a real app we might want to distinguish between existing URLs and preview blobs more explicitly,
        // but since we only use them for display here, it's fine.
        // We just need to be careful NOT to include blob URLs in the final submission if we cancel.
        // But here we reconstruct finalImages in mutationFn using `images` (which are existing URLs) + uploaded `imageFiles`.
        // Wait, if I add blob URLs to `images` state, they might get submitted if I'm not careful.
        // Let's keep `images` state strictly for *display*.
        // Actually, the `mutationFn` logic I wrote uses `images` as the base.
        // So I should NOT add blob URLs to `images` state if I want to keep it simple.
        // Instead, let's keep `images` as "existing server images" + "newly added blobs".
        // BUT `mutationFn` needs to distinguish.

        // Simpler approach for this iteration:
        // Use a separate state for previews? Or just standard approach:
        // 1. `images` state holds EVERYTHING to show.
        // 2. We verify which are blobs and which are real URLs before submitting?
        // Actually, easiest is:
        // `images` = existing URLs from server.
        // `newImagesPreviews` = previews of `imageFiles`.
        // Display = [...images, ...newImagesPreviews]
        // Submit = [...images, ...uploadedUrls]
        // Remove = if index < images.length -> remove from images. Else remove from imageFiles.
      } else {
        showToast("You can only upload up to 10 images", "error");
      }
    }
    if (event.target) {
      event.target.value = "";
    }
  };

  // Correction for image handling strategy described above
  // Let's refactor the state slightly to handle the "display vs submit" logic cleanly

  // RETHINK:
  // We have `images` (strings).
  // We have `imageFiles` (Files).
  // When user adds a file -> add to `imageFiles`.
  // When user deletes an image -> we need to know if it was an existing one or a new one.

  // Let's keep `images` as the source of truth for "Current text URLs".
  // Let's keep `imageFiles` as the source of truth for "New files".
  // But we need to see previews of `imageFiles`.

  // Derived state or just a helper:
  const imagePreviews = imageFiles.map((f) => URL.createObjectURL(f));
  const allDisplayImages = [...images, ...imagePreviews];

  const handleRemoveImage = (index: number) => {
    if (index < images.length) {
      // It's an existing image
      const newImages = [...images];
      newImages.splice(index, 1);
      setImages(newImages);
    } else {
      // It's a new file
      const fileIndex = index - images.length;
      const newFiles = [...imageFiles];
      newFiles.splice(fileIndex, 1);
      setImageFiles(newFiles);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Listing" size="xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
        <div className="space-y-4">
          <Input
            label="Title"
            {...register("title")}
            error={errors.title?.message}
            required
          />

          <Textarea
            label="Description"
            rows={4}
            {...register("description")}
            error={errors.description?.message}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition
              </label>
              <Controller
                name="condition"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    options={ITEM_CONDITIONS.map((o) => ({
                      value: o.value,
                      label: o.label,
                    }))}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Price per Day ($)"
              type="number"
              step="0.01"
              min="1"
              {...register("pricePerDay", { valueAsNumber: true })}
              error={errors.pricePerDay?.message}
              required
            />

            <Input
              label="Deposit ($)"
              type="number"
              step="0.01"
              min="0"
              {...register("deposit", { valueAsNumber: true })}
              error={errors.deposit?.message}
              required
            />
          </div>

          <Textarea
            label="Pickup Instructions"
            rows={2}
            {...register("pickupInstructions")}
            error={errors.pickupInstructions?.message}
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pickup Window
            </label>
            <Controller
              name="pickupWindow"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  options={PICKUP_WINDOWS.map((w) => ({
                    value: w,
                    label: w,
                  }))}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images
            </label>
            <div className="flex gap-2 flex-wrap mb-2">
              {allDisplayImages.map((img, idx) => (
                <div key={idx} className="relative w-24 h-24">
                  <img
                    src={img}
                    alt={`Preview ${idx}`}
                    className="w-full h-full object-cover rounded-md border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}

              {allDisplayImages.length < 10 && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-md flex flex-col items-center justify-center text-gray-400 hover:border-primary-500 hover:text-primary-500 transition-colors"
                >
                  <span className="text-2xl">+</span>
                  <span className="text-xs">Add</span>
                </button>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="image/*"
              multiple
              className="hidden"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            loading={mutation.isPending || uploadingImages}
            disabled={uploadingImages}
          >
            {uploadingImages ? "Uploading..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
