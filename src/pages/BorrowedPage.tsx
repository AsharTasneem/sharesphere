import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "@heroicons/react/24/outline";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import { supabaseRequestsService } from "@/services/supabase/requests.service";

export default function BorrowedPage() {
  const { user } = useAuthStore();
  const { showToast } = useUIStore();
  const queryClient = useQueryClient();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [requestToDelete, setRequestToDelete] = useState<string | null>(null);

  const {
    data: requests = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["borrowed-items", user?.id],
    queryFn: () => {
      if (!user?.id) return Promise.resolve([]);
      return supabaseRequestsService.getAll(user.id, "borrower");
    },
    enabled: !!user?.id,
  });

  const handleDeleteClick = (e: React.MouseEvent, requestId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setRequestToDelete(requestId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!requestToDelete) return;

    try {
      await supabaseRequestsService.delete(requestToDelete);

      // Optimistically update the cache to remove the item immediately from UI
      queryClient.setQueryData(
        ["borrowed-items", user?.id],
        (oldRequests: any[] | undefined) =>
          oldRequests
            ? oldRequests.filter((req) => req.id !== requestToDelete)
            : []
      );

      // Also invalidate to ensure sync with server
      queryClient.invalidateQueries({ queryKey: ["borrowed-items"] });

      showToast("Request deleted successfully", "success");
    } catch (err: any) {
      console.error("Error deleting request:", err);
      showToast(err.message || "Failed to delete request", "error");
    } finally {
      setIsDeleteModalOpen(false);
      setRequestToDelete(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "success" | "warning" | "error" | "info"> = {
      active: "success",
      paid: "success",
      pending_owner: "warning",
      completed: "info",
      cancelled: "error",
      declined: "error",
      accepted: "success",
      returned: "info",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Borrowed Items
        </h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-gray-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Borrowed Items
        </h1>
        <Card>
          <div className="text-center py-12 text-red-600">
            Failed to load borrowed items. Please try again later.
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Borrowed Items</h1>

      {requests.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">
              You haven't borrowed any items yet
            </p>
            <Link to="/browse">
              <button className="px-6 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700">
                Browse Items
              </button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <Link
              key={request.id}
              to={`/listing/${request.item?.id || request.itemId}`}
            >
              <Card className="hover:shadow-md transition-shadow relative">
                <div className="flex items-center gap-4 pr-12">
                  <img
                    src={
                      request.item?.primaryImage ||
                      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
                    }
                    alt={request.item?.title}
                    className="w-24 h-24 object-cover rounded-lg bg-gray-100"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900 line-clamp-1">
                        {request.item?.title || "Unknown Item"}
                      </h3>
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {formatDate(request.startDate)} -{" "}
                      {formatDate(request.endDate)}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(request.pricing.total)} total
                    </p>
                  </div>
                </div>
                {/* Delete Button for deletable statuses */}
                {[
                  "pending_owner",
                  "declined",
                  "cancelled",
                  "completed",
                ].includes(request.status) && (
                  <button
                    onClick={(e) => handleDeleteClick(e, request.id)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors z-10"
                    title="Delete Request"
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                )}
              </Card>
            </Link>
          ))}
        </div>
      )}

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Request"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete this request? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
