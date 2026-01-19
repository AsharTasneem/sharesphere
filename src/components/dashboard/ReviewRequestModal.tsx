import { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Request } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { requestsApi } from "@/services/api";
import { useQueryClient } from "@tanstack/react-query";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

interface ReviewRequestModalProps {
  request: Request | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ReviewRequestModal({
  request,
  isOpen,
  onClose,
}: ReviewRequestModalProps) {
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  if (!request) return null;

  const handleAction = async (status: "accepted" | "declined") => {
    try {
      setLoading(true);
      await requestsApi.update(request.id, { status });

      // Invalidate queries to refresh dashboard
      await queryClient.invalidateQueries({ queryKey: ["requests"] });

      onClose();
    } catch (error) {
      console.error("Failed to update request:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Review Rental Request"
      size="md"
    >
      <div className="space-y-6">
        {/* Request Details */}
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Item</span>
            <span className="font-medium text-gray-900">
              {request.item?.title}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Borrower</span>
            <span className="font-medium text-gray-900">
              {request.borrower?.name}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 text-sm">Dates</span>
            <span className="font-medium text-gray-900">
              {formatDate(request.startDate)} - {formatDate(request.endDate)}
            </span>
          </div>
          <div className="flex justify-between pt-2 border-t border-gray-200">
            <span className="text-gray-900 font-semibold">Total Earnings</span>
            <span className="text-primary-600 font-bold">
              {formatCurrency(request.pricing.total)}
            </span>
          </div>
        </div>

        {/* Notes */}
        {request.notes && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Borrower&apos;s Message
            </h4>
            <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg italic border border-gray-100">
              &quot;{request.notes}&quot;
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4 pt-4">
          <Button
            variant="outline"
            className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            onClick={() => handleAction("declined")}
            disabled={loading}
          >
            {loading ? (
              "Processing..."
            ) : (
              <div className="flex items-center justify-center gap-2">
                <XCircleIcon className="h-5 w-5" />
                Decline
              </div>
            )}
          </Button>
          <Button
            className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            onClick={() => handleAction("accepted")}
            disabled={loading}
          >
            {loading ? (
              "Processing..."
            ) : (
              <div className="flex items-center justify-center gap-2">
                <CheckCircleIcon className="h-5 w-5" />
                Approve Request
              </div>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
