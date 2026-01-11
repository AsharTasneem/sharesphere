import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { itemsApi } from "@/services/api";
import { Card } from "@/components/ui/Card";

import RotatingCard from "@/components/ui/RotatingCards";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/lib/utils";
import { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { PlusCircleIcon, PencilIcon } from "@heroicons/react/24/outline";
import { EditListingModal } from "@/components/listings/EditListingModal";
import { Item } from "@/lib/types";

export default function MyListingsPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const { data: allItems = [], isLoading } = useQuery({
    queryKey: ["items"],
    queryFn: () => itemsApi.getAll(),
  });

  const myItems = allItems.filter((item) => item.ownerId === user?.id);
  const [editingItem, setEditingItem] = useState<Item | null>(null);

  const containerRef = useRef(null);

  useGSAP(
    () => {
      // Only animate if not loading
      if (isLoading) return;

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(
        ".page-title",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }
      ).fromTo(
        ".listing-card",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.1, stagger: 0.1 },
        "-=0.4"
      );
    },
    { scope: containerRef, dependencies: [isLoading, myItems.length] }
  );

  return (
    <div
      ref={containerRef}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="flex items-center justify-between mb-8 page-title opacity-0">
        <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
        <Link to="/listing/new">
          <Button>
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Create Listing
          </Button>
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-80 rounded-[5px] bg-gray-200 animate-pulse relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-full p-4">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-2" />
                <div className="flex justify-between items-end">
                  <div className="h-4 bg-gray-300 rounded w-1/2" />
                  <div className="h-8 bg-gray-300 rounded w-1/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : myItems.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              You haven't created any listings yet
            </p>
            <Link to="/listing/new">
              <Button>Create Your First Listing</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {myItems.map((item) => (
            <div key={item.id} className="listing-card opacity-0 h-80">
              <RotatingCard
                hoverEffect
                className="h-full w-full cursor-pointer"
                onClick={() => navigate(`/listing/${item.id}`)}
                backContent={
                  <div className="flex flex-col h-full justify-between p-2 text-center relative">
                    <div className="mt-2">
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
                      <div className="text-sm text-gray-400">
                        {item.metadata.views} views
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2 w-full border-white text-white hover:bg-white hover:text-gray-900"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingItem(item);
                      }}
                    >
                      <PencilIcon className="h-4 w-4 mr-2" />
                      Edit Listing
                    </Button>
                  </div>
                }
              >
                <div className="w-full h-80 relative">
                  <img
                    src={item.primaryImage}
                    alt={item.title}
                    className="absolute inset-0 w-full h-full object-cover rounded-[5px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent rounded-[5px]" />

                  <div className="absolute bottom-0 left-0 w-full p-4 text-left z-10">
                    <div className="flex justify-between items-end">
                      <h3 className="text-white font-bold text-lg line-clamp-2 leading-tight drop-shadow-md mb-2 flex-1 mr-2">
                        {item.title}
                      </h3>
                      <div className="flex flex-col items-end gap-1">
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
            </div>
          ))}
        </div>
      )}
      {editingItem && editingItem.id && (
        <EditListingModal
          key={editingItem.id}
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          item={editingItem}
        />
      )}
    </div>
  );
}
