import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { requestsApi } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function LendingHistoryPage() {
  const { user } = useAuthStore();

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['requests', 'owner', user?.id],
    queryFn: () => requestsApi.getAll(user?.id, 'owner'),
    enabled: !!user,
  });

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
      active: 'success',
      paid: 'success',
      pending_owner: 'warning',
      completed: 'info',
      cancelled: 'error',
      declined: 'error',
      returned: 'info',
    };
    return <Badge variant={variants[status] || 'default'}>{status.replace('_', ' ')}</Badge>;
  };

  const completedRequests = requests.filter(r => 
    ['completed', 'returned', 'cancelled', 'declined'].includes(r.status)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Lending History</h1>
        <p className="text-gray-600">View all your past lending transactions</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-24 bg-gray-200 rounded" />
            </Card>
          ))}
        </div>
      ) : completedRequests.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No lending history yet</p>
            <p className="text-gray-500 text-sm mb-4">
              When borrowers complete rentals of your items, they'll appear here.
            </p>
            <Link to="/listing/new">
              <button className="px-6 py-3 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors">
                Create Your First Listing
              </button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {completedRequests.map((request) => (
            <Card key={request.id}>
              <div className="flex items-center gap-4">
                <img
                  src={request.item?.primaryImage || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'}
                  alt={request.item?.title}
                  className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-gray-900">{request.item?.title}</h3>
                    {getStatusBadge(request.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-1">
                    Borrowed by {request.borrower?.name || 'Unknown'}
                  </p>
                  <p className="text-sm text-gray-600 mb-2">
                    {formatDate(request.startDate)} - {formatDate(request.endDate)}
                  </p>
                  <div className="flex items-center gap-4">
                    <p className="text-sm font-medium text-gray-900">
                      Earnings: <span className="text-primary-600">{formatCurrency(request.pricing.rentalFee + request.pricing.serviceFee)}</span>
                    </p>
                    {request.completedAt && (
                      <p className="text-sm text-gray-500">
                        Completed: {formatDate(request.completedAt)}
                      </p>
                    )}
                  </div>
                </div>
                <Link to={`/dashboard/my-listings/${request.itemId}`}>
                  <button className="px-4 py-2 border-2 border-primary-600 text-primary-600 rounded-full hover:bg-primary-50 transition-colors font-medium">
                    View Details
                  </button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

