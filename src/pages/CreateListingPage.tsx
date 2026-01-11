import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { itemsApi } from "@/services/api";
import { supabaseStorageService } from "@/services/supabase/storage.service";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Card } from "@/components/ui/Card";
import { CATEGORIES, ITEM_CONDITIONS, PICKUP_WINDOWS } from "@/lib/constants";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

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

export default function CreateListingPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showToast } = useUIStore();
  const [images, setImages] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ListingForm>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      category: "",
      condition: "good",
      pickupWindow: "Flexible",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ListingForm & { images: string[]; ownerId: string }) => {
      // Upload images first if there are any files
      let uploadedImageUrls = data.images;

      if (imageFiles.length > 0) {
        setUploadingImages(true);
        try {
          uploadedImageUrls = await supabaseStorageService.uploadItemImages(
            imageFiles,
            data.ownerId
          );
        } catch (error) {
          setUploadingImages(false);
          throw new Error('Failed to upload images');
        }
        setUploadingImages(false);
      }

      return itemsApi.create({
        ...data,
        images: uploadedImageUrls,
        primaryImage: uploadedImageUrls[0] || "",
        location: {
          address: user?.location.city || "",
          city: user?.location.city || "",
          state: user?.location.state || "",
          coordinates: user?.location.coordinates || { lat: 0, lng: 0 },
          displayAddress: `${user?.location.city}, ${user?.location.state}`,
        },
        availability: {
          type: "always",
        },
        tags: [],
        status: "published",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["items"] });
      showToast("Listing created successfully!", "success");
      navigate("/dashboard/my-listings");
    },
    onError: () => {
      showToast("Failed to create listing", "error");
    },
  });

  const onSubmit = (data: ListingForm) => {
    if (!user) return;

    // Use placeholder image if no images uploaded
    const imagesToUse = imageFiles.length > 0
      ? [] // Will be uploaded in mutation
      : ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"];

    mutation.mutate({
      ...data,
      images: imagesToUse,
      ownerId: user.id,
    });
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const newFiles = Array.from(files);

      if (imageFiles.length + newFiles.length <= 10) {
        // Store files for upload
        setImageFiles([...imageFiles, ...newFiles]);

        // Create preview URLs
        const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
        setImages([...images, ...newPreviews]);
      } else {
        showToast("You can only upload up to 10 images", "error");
      }
    }
    // Reset input so same file can be selected again if needed
    if (event.target) {
      event.target.value = "";
    }
  };

  const containerRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".page-title", {
        y: 30,
        opacity: 0,
        duration: 0.8,
      }).from(
        ".form-card",
        {
          y: 20,
          opacity: 0,
          duration: 0.6,
          stagger: 0.1,
        },
        "-=0.4"
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <h1 className="page-title text-3xl font-bold text-gray-900 mb-8">
        Create New Listing
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="form-card">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="space-y-4">
            <Input
              label="Title"
              placeholder="e.g., Professional Camera Kit"
              {...register("title")}
              error={errors.title?.message}
              required
            />

            <Textarea
              label="Description"
              placeholder="Describe your item in detail..."
              rows={6}
              {...register("description")}
              error={errors.description?.message}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <CustomSelect
                    options={CATEGORIES.map((c) => ({ value: c, label: c }))}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="Select a category"
                  />
                )}
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Condition <span className="text-red-500">*</span>
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
                    placeholder="Select condition"
                  />
                )}
              />
              {errors.condition && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.condition.message}
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card className="form-card">
          <h2 className="text-xl font-semibold mb-4">Pricing</h2>
          <div className="grid md:grid-cols-2 gap-4">
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
        </Card>

        <Card className="form-card">
          <h2 className="text-xl font-semibold mb-4">Pickup Details</h2>
          <div className="space-y-4">
            <Textarea
              label="Pickup Instructions"
              placeholder="Provide detailed instructions for pickup..."
              rows={4}
              {...register("pickupInstructions")}
              error={errors.pickupInstructions?.message}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pickup Window <span className="text-red-500">*</span>
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
                    placeholder="Select pickup window"
                  />
                )}
              />
              {errors.pickupWindow && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.pickupWindow.message}
                </p>
              )}
            </div>
          </div>
        </Card>

        <Card className="form-card">
          <h2 className="text-xl font-semibold mb-4">Images</h2>
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept="image/*"
                multiple
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Images
              </Button>
              <span className="text-sm text-gray-500 self-center">
                {images.length} / 10 images
              </span>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-4 gap-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative">
                    <img
                      src={img}
                      alt={`Image ${idx + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setImages(images.filter((_, i) => i !== idx))
                      }
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>

        <div className="flex gap-3">
          <Button
            type="submit"
            loading={mutation.isPending || uploadingImages}
            disabled={uploadingImages}
          >
            {uploadingImages ? 'Uploading Images...' : 'Create Listing'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/dashboard/my-listings")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
