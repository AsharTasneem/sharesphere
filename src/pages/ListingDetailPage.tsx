import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { itemsApi } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ITEM_CONDITIONS } from "@/lib/constants";
import { StarIcon, MapPinIcon, CalendarIcon } from "@heroicons/react/24/solid";
import { StarIcon as StarOutlineIcon } from "@heroicons/react/24/outline";
import { EditListingModal } from "@/components/listings/EditListingModal";

export default function ListingDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: item, isLoading } = useQuery({
    queryKey: ["item", id],
    queryFn: () => itemsApi.getById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-96 bg-gray-200 rounded-lg mb-6" />
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Item not found</h1>
        <Link to="/browse">
          <Button>Browse Items</Button>
        </Link>
      </div>
    );
  }

  const conditionLabel =
    ITEM_CONDITIONS.find((c) => c.value === item.condition)?.label ||
    item.condition;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        {/* Image Gallery */}
        <div>
          <div className="aspect-square rounded-lg overflow-hidden mb-4 bg-gray-100">
            <img
              src={item.images[selectedImage] || item.primaryImage}
              alt={item.title}
              className="w-full h-full object-cover"
            />
          </div>
          {item.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {item.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 ${
                    selectedImage === idx
                      ? "border-primary-600"
                      : "border-transparent"
                  }`}
                >
                  <img
                    src={img}
                    alt={`${item.title} ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {item.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPinIcon className="h-5 w-5" />
                <span>{item.location.displayAddress}</span>
              </div>
            </div>
            <Badge variant="default">{item.category}</Badge>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div>
              <span className="text-4xl font-bold text-primary-600">
                {formatCurrency(item.pricePerDay)}
              </span>
              <span className="text-gray-500">/day</span>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) =>
                i < Math.floor(item.metadata.rating) ? (
                  <StarIcon key={i} className="h-5 w-5 text-yellow-400" />
                ) : (
                  <StarOutlineIcon key={i} className="h-5 w-5 text-gray-300" />
                )
              )}
              <span className="ml-2 text-gray-600">
                {item.metadata.rating.toFixed(1)} ({item.metadata.reviewCount}{" "}
                reviews)
              </span>
            </div>
          </div>

          <Card className="mb-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-700 whitespace-pre-line">
                  {item.description}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <span className="text-sm text-gray-500">Condition</span>
                  <p className="font-medium">{conditionLabel}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Deposit</span>
                  <p className="font-medium">{formatCurrency(item.deposit)}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Pickup Window</span>
                  <p className="font-medium">{item.pickupWindow}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Views</span>
                  <p className="font-medium">{item.metadata.views}</p>
                </div>
              </div>
            </div>
          </Card>

          {item.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="default" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {isAuthenticated ? (
            user?.id === item.ownerId ? (
              <Button
                className="w-full"
                size="lg"
                onClick={() => setIsEditModalOpen(true)}
              >
                Edit Listing
              </Button>
            ) : (
              <Button
                className="w-full"
                size="lg"
                onClick={() => navigate(`/borrow/request/${item.id}`)}
              >
                Request to Borrow
              </Button>
            )
          ) : (
            <Link to="/signin">
              <Button className="w-full" size="lg">
                Sign In to Request
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Owner Card */}
      {item.owner && (
        <Card className="mb-8">
          <div className="flex items-center gap-4">
            <img
              src={item.owner.avatar || "https://i.pravatar.cc/150?img=1"}
              alt={item.owner.name}
              className="w-16 h-16 rounded-full"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{item.owner.name}</h3>
              <p className="text-sm text-gray-600">
                Member since {formatDate(item.owner.stats.memberSince)}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <StarIcon className="h-4 w-4 text-yellow-400" />
                  <span className="text-sm">
                    {item.owner.stats.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({item.owner.stats.reviewCount})
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {item.owner.stats.totalLent} items lent
                </span>
              </div>
            </div>
            <Link to={`/user/${item.owner.id}`}>
              <Button variant="outline">View Profile</Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Pickup Instructions */}
      <Card className="mb-8">
        <h3 className="font-semibold text-gray-900 mb-2">
          Pickup Instructions
        </h3>
        <p className="text-gray-700">{item.pickupInstructions}</p>
      </Card>

      <EditListingModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        item={item}
      />
    </div>
  );
}
