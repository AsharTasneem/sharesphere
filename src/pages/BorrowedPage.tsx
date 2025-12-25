import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { requestsApi } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency, formatDate } from '@/lib/utils';

export default function BorrowedPage() {
  const { user } = useAuthStore();

  const { data: requests = [] } = useQuery({
    queryKey: ['requests', 'borrower', user?.id],
    queryFn: () => requestsApi.getAll(user?.id, 'borrower'),
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
    };
    return <Badge variant={variants[status] || 'default'}>{status.replace('_', ' ')}</Badge>;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Borrowed Items</h1>

      {requests.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't borrowed any items yet</p>
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
            <Link key={request.id} to={`/dashboard/borrowed/${request.id}`}>
              <Card>
                <div className="flex items-center gap-4">
                  <img
                    src={request.item?.primaryImage || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'}
                    alt={request.item?.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{request.item?.title}</h3>
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {formatDate(request.startDate)} - {formatDate(request.endDate)}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(request.pricing.total)} total
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}



