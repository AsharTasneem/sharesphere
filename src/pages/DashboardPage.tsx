import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/stores/authStore";
import { requestsApi } from "@/services/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate, getRelativeTime } from "@/lib/utils";
import {
  ShoppingBagIcon,
  RectangleStackIcon,
  CurrencyDollarIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";

export default function DashboardPage() {
  const { user, refreshUser } = useAuthStore();

  // Refresh user data on mount to ensure stats are up to date (synced by DB triggers)
  useEffect(() => {
    refreshUser();
  }, []);

  const { data: borrowerRequests = [] } = useQuery({
    queryKey: ["requests", "borrower", user?.id],
    queryFn: () => requestsApi.getAll(user?.id, "borrower"),
    enabled: !!user,
  });

  const { data: ownerRequests = [] } = useQuery({
    queryKey: ["requests", "owner", user?.id],
    queryFn: () => requestsApi.getAll(user?.id, "owner"),
    enabled: !!user,
  });

  // Broader filter for active rentals (to match profile stats logic)
  const activeBorrows = borrowerRequests.filter((r) =>
    ["active", "paid", "payment_pending", "returned", "overdue"].includes(
      r.status
    )
  );
  const pendingRequests = ownerRequests.filter(
    (r) => r.status === "pending_owner"
  );

  // Use dynamic stats from user profile (Source of Truth)
  const totalLent = user?.stats?.totalLent || 0;
  const averageRating = user?.stats?.rating || 0;

  const dueThisWeek = borrowerRequests.filter((r) => {
    if (r.status !== "active") return false;
    const returnDate = new Date(r.endDate);
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    return returnDate <= weekFromNow;
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "success" | "warning" | "error" | "info"> = {
      active: "success",
      paid: "success",
      pending_owner: "warning",
      completed: "info",
      cancelled: "error",
      declined: "error",
    };
    return (
      <Badge variant={variants[status] || "default"}>
        {status.replace("_", " ")}
      </Badge>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}!</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Active Rentals</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeBorrows.length}
              </p>
            </div>
            <ShoppingBagIcon className="h-8 w-8 text-primary-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-900">
                {pendingRequests.length}
              </p>
            </div>
            <ClockIcon className="h-8 w-8 text-yellow-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Lent</p>
              <p className="text-2xl font-bold text-gray-900">{totalLent}</p>
            </div>
            <RectangleStackIcon className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {averageRating.toFixed(1)}
              </p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
          </div>
        </Card>
      </div>

      {/* Due This Week */}
      {dueThisWeek.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Due This Week
          </h2>
          <div className="space-y-4">
            {dueThisWeek.map((request) => (
              <Card key={request.id}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {request.item?.title}
                      </h3>
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-sm text-gray-600">
                      Return by {formatDate(request.endDate)} •{" "}
                      {getRelativeTime(request.endDate)}
                    </p>
                  </div>
                  <Link to={`/dashboard/borrowed/${request.id}`}>
                    <Button variant="outline">View Details</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Incoming Requests
          </h2>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <Card key={request.id}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {request.item?.title}
                      </h3>
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-sm text-gray-600">
                      Requested by {request.borrower?.name} •{" "}
                      {formatDate(request.startDate)} -{" "}
                      {formatDate(request.endDate)}
                    </p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      {formatCurrency(request.pricing.total)} total
                    </p>
                  </div>
                  <Link to={`/dashboard/my-listings/${request.itemId}`}>
                    <Button>Review Request</Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            <Link to="/listing/new">
              <Button className="w-full" variant="outline">
                Create New Listing
              </Button>
            </Link>
            <Link to="/browse">
              <Button className="w-full" variant="outline">
                Browse Items
              </Button>
            </Link>
            <Link to="/dashboard/my-listings">
              <Button className="w-full" variant="outline">
                Manage Listings
              </Button>
            </Link>
          </div>
        </Card>
        <Card>
          <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <p className="text-gray-600 text-sm">No recent activity</p>
        </Card>
      </div>
    </div>
  );
}
