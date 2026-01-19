import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams } from "react-router-dom";
import { itemsApi, authApi } from "@/services/api";
import { useDebounce } from "@/hooks/useDebounce";
import { Card } from "@/components/ui/Card";
import RotatingCard from "@/components/ui/RotatingCards";
import { Input } from "@/components/ui/Input";
import { CustomSelect } from "@/components/ui/CustomSelect";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/lib/utils";
import { CATEGORIES, SORT_OPTIONS } from "@/lib/constants";
import {
  Squares2X2Icon,
  ListBulletIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [sort, setSort] = useState(searchParams.get("sort") || "newest");

  // Debounce search term to prevent excessive API calls
  const debouncedSearch = useDebounce(search, 500);

  const isUserSearch = debouncedSearch.startsWith("@");
  const userQuery = isUserSearch ? debouncedSearch.substring(1) : "";

  const { data: items = [], isLoading: isItemsLoading } = useQuery({
    queryKey: ["items", { search: debouncedSearch, category, sort }],
    queryFn: () =>
      itemsApi.getAll({
        search: debouncedSearch,
        category: category || undefined,
        sort,
      }),
    enabled: !isUserSearch,
  });

  const { data: users = [], isLoading: isUsersLoading } = useQuery({
    queryKey: ["users", userQuery],
    queryFn: () => authApi.search(userQuery),
    enabled: isUserSearch && userQuery.length > 0,
  });

  const isLoading = isUserSearch ? isUsersLoading : isItemsLoading;

  const handleSearch = (value: string) => {
    setSearch(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }
    setSearchParams(params);
    setSearchParams(params);
  };

  const containerRef = useRef(null);

  const showSkeleton =
    isLoading && (items.length === 0 || (isUserSearch && users.length === 0));

  useGSAP(
    () => {
      // Header animation only - independent of data loading
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".page-header",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="mb-8 page-header opacity-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Browse Items</h1>
          {/* View mode buttons - visible on small screens only */}
          <div className="flex gap-2 items-center md:hidden">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-primary-100 text-primary-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-label="Grid view"
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-primary-100 text-primary-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-label="List view"
            >
              <ListBulletIcon className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search items..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <CustomSelect
              options={[
                { value: "", label: "All Categories" },
                ...CATEGORIES.map((c) => ({ value: c, label: c })),
              ]}
              value={category}
              onChange={(value) => {
                setCategory(value);
                const params = new URLSearchParams(searchParams);
                if (value) {
                  params.set("category", value);
                } else {
                  params.delete("category");
                }
                setSearchParams(params);
              }}
              // searchable
            />
          </div>
          <div className="w-full md:w-48">
            <CustomSelect
              options={SORT_OPTIONS.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
              value={sort}
              onChange={(value) => {
                setSort(value);
                const params = new URLSearchParams(searchParams);
                params.set("sort", value);
                setSearchParams(params);
              }}
            />
          </div>
          {/* View mode buttons - visible on medium screens and above */}
          <div className="hidden md:flex gap-2 items-center">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "grid"
                  ? "bg-primary-100 text-primary-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-label="Grid view"
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === "list"
                  ? "bg-primary-100 text-primary-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
              aria-label="List view"
            >
              <ListBulletIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {showSkeleton ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="w-full h-80 bg-gray-200 rounded-[12px] animate-pulse relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-full p-4 space-y-3">
                <div className="flex justify-between items-end">
                  <div className="h-6 bg-gray-300 rounded w-2/3" />
                  <div className="h-8 bg-gray-300 rounded w-16" />
                </div>
                <div className="h-5 bg-white/20 backdrop-blur-sm rounded w-20" />
              </div>
            </div>
          ))}
        </div>
      ) : items.length === 0 && !isUserSearch ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No items found</p>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : isUserSearch ? (
        users.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">No users found</p>
            <p className="text-gray-500">
              Try searching for a different username
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user: any) => (
              <Link
                key={user.id}
                to={`/profile/${user.id}`}
                className="block hover:scale-105 transition-transform duration-300"
              >
                <Card className="h-full flex flex-col items-center p-6 text-center hover:shadow-xl transition-shadow border-primary-100">
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-24 h-24 rounded-full border-4 border-white shadow-md object-cover mb-4"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-md bg-primary-100 flex items-center justify-center text-primary-600 text-3xl font-bold mb-4">
                      {user.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2) || "U"}
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    {user.name}
                  </h3>
                  {user.username && (
                    <p className="text-primary-600 text-sm font-medium mb-2">
                      @{user.username}
                    </p>
                  )}
                  <div className="flex items-center gap-1 text-gray-500 text-xs mt-auto">
                    <span>
                      Member since{" "}
                      {new Date(user.createdAt || Date.now()).getFullYear()}
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )
      ) : (
        <BrowseResults items={items} viewMode={viewMode} />
      )}
    </div>
  );
}

interface BrowseResultsProps {
  items: typeof itemsApi.getAll extends (...args: any) => Promise<infer T>
    ? T
    : any[];
  viewMode: "grid" | "list";
}

function BrowseResults({ items, viewMode }: BrowseResultsProps) {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".item-card-container",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, stagger: 0.05 }
      );
    },
    { scope: containerRef, dependencies: [items, viewMode] }
  );

  return (
    <div ref={containerRef}>
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item: any) => (
            <Link
              key={item.id}
              to={`/listing/${item.id}`}
              className="item-card-container block h-full transition-transform opacity-0"
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
                            {Math.min(item.metadata?.rating || 0, 4.9).toFixed(
                              1
                            )}
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
        <div className="space-y-4">
          {items.map((item: any) => (
            <Link
              key={item.id}
              to={`/listing/${item.id}`}
              className="block item-card-container opacity-0"
            >
              <Card hoverEffect className="flex gap-4">
                <img
                  src={item.primaryImage}
                  alt={item.title}
                  className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-1">
                      {item.title}
                    </h3>
                    <Badge
                      variant="default"
                      size="sm"
                      className="flex-shrink-0"
                    >
                      {item.category}
                    </Badge>
                  </div>
                  <p className="text-gray-600 text-lg mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-primary-600">
                        {formatCurrency(item.pricePerDay)}
                      </span>
                      <span className="text-gray-500 text-sm">/day</span>
                    </div>
                    {item.metadata?.rating > 0 && (
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span>
                          {Math.min(item.metadata.rating, 4.9).toFixed(1)}
                        </span>
                        <span className="text-gray-400">
                          ({item.metadata.reviewCount})
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    {item.location.displayAddress}
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
