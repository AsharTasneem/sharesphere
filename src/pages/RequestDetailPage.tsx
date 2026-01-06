import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import { requestsApi, itemsApi } from "@/services/api";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import {
  formatCurrency,
  formatDate,
  calculatePricing,
  isValidDateRange,
} from "@/lib/utils";

export default function RequestDetailPage() {
  const { itemId, id } = useParams<{ itemId?: string; id?: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { showToast } = useUIStore();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const isCreating = !!itemId && !id;
  const requestId = id || "";

  const { data: item, isLoading: itemLoading } = useQuery({
    queryKey: ["item", itemId],
    queryFn: () => itemsApi.getById(itemId!),
    enabled: !!itemId,
  });

  const { data: request, isLoading: requestLoading } = useQuery({
    queryKey: ["request", requestId],
    queryFn: () => requestsApi.getById(requestId),
    enabled: !!requestId,
  });

  if (isCreating && itemLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8" />
          <div className="h-64 bg-gray-200 rounded-lg mb-6" />
        </div>
      </div>
    );
  }

  if (requestId && requestLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8" />
          <div className="h-64 bg-gray-200 rounded-lg" />
        </div>
      </div>
    );
  }

  const createMutation = useMutation({
    mutationFn: (data: {
      itemId: string;
      startDate: Date;
      endDate: Date;
      borrowerId: string;
      ownerId: string;
      pricePerDay: number;
      deposit: number;
    }) => {
      const pricing = calculatePricing(
        data.pricePerDay,
        data.deposit,
        data.startDate,
        data.endDate
      );
      return requestsApi.create({
        itemId: data.itemId,
        startDate: data.startDate,
        endDate: data.endDate,
        borrowerId: data.borrowerId,
        ownerId: data.ownerId,
        status: "pending_owner",
        pricing: {
          pricePerDay: data.pricePerDay,
          days: pricing.days,
          rentalFee: pricing.rentalFee,
          deposit: pricing.deposit,
          serviceFee: pricing.serviceFee,
          total: pricing.total,
        },
      });
    },
    onSuccess: () => {
      showToast("Request created successfully!", "success");
      navigate("/dashboard/borrowed");
    },
    onError: () => {
      showToast("Failed to create request", "error");
    },
  });

  const handleSubmit = () => {
    if (!item || !user) return;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const validation = isValidDateRange(start, end, item);

    if (!validation.valid) {
      showToast(validation.error || "Invalid date range", "error");
      return;
    }

    createMutation.mutate({
      itemId: item.id,
      startDate: start,
      endDate: end,
      borrowerId: user.id,
      ownerId: item.ownerId,
      pricePerDay: item.pricePerDay,
      deposit: item.deposit,
    });
  };

  if (isCreating && item) {
    const pricing =
      startDate && endDate
        ? calculatePricing(
            item.pricePerDay,
            item.deposit,
            new Date(startDate),
            new Date(endDate)
          )
        : null;

    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Request to Borrow
        </h1>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <Card className="mb-6">
              <img
                src={item.primaryImage}
                alt={item.title}
                className="w-full h-64 object-cover rounded-lg mb-4"
              />
              <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
              <p className="text-gray-600 mb-4">{item.description}</p>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-primary-600">
                    {formatCurrency(item.pricePerDay)}
                  </span>
                  <span className="text-gray-500">/day</span>
                </div>
                <Badge>{item.category}</Badge>
              </div>
            </Card>
          </div>

          <div>
            <Card className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-4">Select Dates</h3>
              <div className="space-y-4">
                <Input
                  label="Start Date"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
                <Input
                  label="End Date"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </Card>

            {pricing && (
              <Card className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-4">
                  Pricing Breakdown
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      Rental Fee ({pricing.days} days)
                    </span>
                    <span className="font-medium">
                      {formatCurrency(pricing.rentalFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Service Fee (15%)</span>
                    <span className="font-medium">
                      {formatCurrency(pricing.serviceFee)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Deposit (refundable)</span>
                    <span className="font-medium">
                      {formatCurrency(pricing.deposit)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span className="text-primary-600">
                        {formatCurrency(pricing.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            <Button
              className="w-full"
              size="lg"
              onClick={handleSubmit}
              disabled={!startDate || !endDate || createMutation.isPending}
              loading={createMutation.isPending}
            >
              Submit Request
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (request) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Request Details
        </h1>

        <Card>
          <div className="flex items-center gap-4 mb-6">
            <img
              src={
                request.item?.primaryImage ||
                "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
              }
              alt={request.item?.title}
              className="w-32 h-32 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">
                {request.item?.title}
              </h2>
              <Badge variant="info">{request.status.replace("_", " ")}</Badge>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Dates</h3>
              <p className="text-gray-600">
                {formatDate(request.startDate)} - {formatDate(request.endDate)}
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Pricing</h3>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Rental Fee</span>
                  <span>{formatCurrency(request.pricing.rentalFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Fee</span>
                  <span>{formatCurrency(request.pricing.serviceFee)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Deposit</span>
                  <span>{formatCurrency(request.pricing.deposit)}</span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary-600">
                    {formatCurrency(request.pricing.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return null;
}
