import { useParams, Link } from "react-router-dom";
import Loader from "@/components/layout/Loader";
import { useQuery } from "@tanstack/react-query";
import { authApi, itemsApi } from "@/services/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate, formatCurrency } from "@/lib/utils";
import {
  StarIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import {
  StarIcon as StarOutlineIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import RotatingCard from "@/components/ui/RotatingCards";

export default function PublicProfilePage() {
  const { id } = useParams<{ id: string }>();

  // Fetch User
  const {
    data: user,
    isLoading: userLoading,
    error: userError,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: () => (id ? authApi.getById(id) : null),
    enabled: !!id,
  });

  // Fetch User's Listings
  const { data: userItems = [], isLoading: itemsLoading } = useQuery({
    queryKey: ["items", "user", id],
    queryFn: () => (id ? itemsApi.getAll({ ownerId: id }) : []),
    enabled: !!id,
  });

  if (userLoading) {
    return <Loader />;
  }

  if (!user || userError) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">User not found</h2>
        <p className="text-gray-600 mt-2">
          The user you are looking for does not exist or an error occurred.
        </p>
        <Link to="/browse">
          <Button className="mt-4">Browse Items</Button>
        </Link>
      </div>
    );
  }

  // Use user stats or default to 0
  const displayStats = user.stats || {
    rating: 0,
    reviewCount: 0,
    totalBorrowed: 0,
    totalLent: 0,
    responseRate: 0,
    responseTime: "N/A",
    completionRate: 0,
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <Link
          to="/browse"
          className="text-sm text-primary-600 hover:text-primary-700 mb-4 inline-block font-medium"
        >
          ← Back to Browse
        </Link>
      </div>

      {/* Profile Header Card */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg bg-primary-100 flex items-center justify-center text-primary-600 text-4xl font-bold">
                {user.name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "U"}
              </div>
            )}
          </div>

          <div className="flex-1 w-full text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-1">
              {user.name}
            </h1>
            {user.username && (
              <p className="text-lg text-gray-500 font-medium mb-3">
                @{user.username}
              </p>
            )}

            {user.bio ? (
              <p className="text-gray-600 mb-4 leading-relaxed max-w-2xl">
                {user.bio}
              </p>
            ) : (
              <p className="text-gray-400 italic mb-4">No bio available.</p>
            )}

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <MapPinIcon className="h-4 w-4" />
                <span>
                  {user.location.city}, {user.location.state}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span>Member since {formatDate(user.stats.memberSince)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Stats and Verification Grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Statistics Card */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <ChartBarIcon className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900">Statistics</h3>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-200">
              <span className="text-gray-600 flex items-center gap-2">
                <StarIcon className="h-4 w-4 text-yellow-400" />
                Overall Rating
              </span>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) =>
                    i < Math.floor(displayStats.rating) ? (
                      <StarIcon key={i} className="h-4 w-4 text-yellow-400" />
                    ) : (
                      <StarOutlineIcon
                        key={i}
                        className="h-4 w-4 text-gray-300"
                      />
                    )
                  )}
                </div>
                <span className="font-semibold text-gray-900">
                  {displayStats.rating.toFixed(1)}
                </span>
                <span className="text-gray-500 text-sm">
                  ({displayStats.reviewCount} reviews)
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-600">
                  {displayStats.totalBorrowed}
                </p>
                <p className="text-sm text-gray-600">Items Borrowed</p>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold text-primary-600">
                  {displayStats.totalLent}
                </p>
                <p className="text-sm text-gray-600">Items Lent</p>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Response Rate</span>
                <span className="font-semibold text-gray-900">
                  {displayStats.responseRate}%
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Response Time</span>
                <span className="font-semibold text-gray-900">
                  {displayStats.responseTime || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-semibold text-gray-900">
                  {displayStats.completionRate}%
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Verification Card */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <IdentificationIcon className="h-5 w-5 text-primary-600" />
            <h3 className="font-semibold text-gray-900">Verified Info</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700 font-medium">Email</span>
              </div>
              {user.verification.email ? (
                <Badge variant="success">Verified</Badge>
              ) : (
                <span className="text-gray-400 text-sm">Not Verified</span>
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700 font-medium">Phone</span>
              </div>
              {user.verification.phone ? (
                <Badge variant="success">Verified</Badge>
              ) : (
                <span className="text-gray-400 text-sm">Not Verified</span>
              )}
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700 font-medium">Address</span>
              </div>
              {user.verification.address ? (
                <Badge variant="success">Verified</Badge>
              ) : (
                <span className="text-gray-400 text-sm">Not Verified</span>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* User's Listings */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          {user.name.split(" ")[0]}'s Listings
        </h2>

        {itemsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="w-full h-80 bg-gray-200 rounded-[12px] animate-pulse"
              />
            ))}
          </div>
        ) : userItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userItems.map((item) => (
              <Link
                key={item.id}
                to={`/listing/${item.id}`}
                className="block h-full"
              >
                <RotatingCard
                  hoverEffect
                  className="h-full w-full"
                  backContent={
                    <div className="flex flex-col h-full justify-between p-2 text-center">
                      <div className="mt-2">
                        <Badge
                          variant="default"
                          className="mb-2 bg-primary-100 text-primary-700 hover:bg-primary-200 border-none"
                        >
                          {item.category}
                        </Badge>
                        <p className="text-gray-300 text-xs line-clamp-3 mb-3">
                          {item.description}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-center gap-1">
                          <span className="text-xl font-bold text-white">
                            {formatCurrency(item.pricePerDay)}
                          </span>
                          <span className="text-gray-400 text-xs">/day</span>
                        </div>

                        <div className="flex items-center justify-center gap-2">
                          <div className="text-xs text-white/90 flex items-center gap-1 font-medium bg-black/30 px-2 py-0.5 rounded-full backdrop-blur-sm">
                            <span className="text-yellow-400">★</span>
                            <span>
                              {Math.min(
                                item.metadata?.rating || 0,
                                4.9
                              ).toFixed(1)}
                            </span>
                            <span className="text-white/60">
                              ({item.metadata?.reviewCount || 0})
                            </span>
                          </div>
                        </div>
                        <p className="text-xs text-white/80 truncate font-medium flex items-center justify-center gap-1">
                          <MapPinIcon className="h-3 w-3" />
                          {item.location.displayAddress ||
                            item.location.city ||
                            "Location N/A"}
                        </p>
                      </div>
                    </div>
                  }
                >
                  <div className="w-full h-80 relative">
                    <img
                      src={item.primaryImage}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover rounded-[5px]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-[5px]" />

                    <div className="absolute bottom-0 left-0 w-full p-4 text-left z-10">
                      <div className="flex justify-between items-end">
                        <h3 className="text-white font-bold text-lg line-clamp-2 leading-tight drop-shadow-md mb-2 flex-1 mr-2">
                          {item.title}
                        </h3>
                        <div className="flex flex-col items-end gap-1">
                          <Badge
                            variant="default"
                            size="sm"
                            className="bg-white/20 text-white backdrop-blur-md border-none"
                          >
                            {item.category}
                          </Badge>
                          <span className="text-lg font-bold text-white drop-shadow-md">
                            {formatCurrency(item.pricePerDay)}
                            <span className="text-xs font-normal opacity-80">
                              /day
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </RotatingCard>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-100">
            <p className="text-gray-500 italic">
              This user hasn't listed any items yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
