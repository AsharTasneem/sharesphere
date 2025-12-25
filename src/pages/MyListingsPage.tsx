import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/stores/authStore';
import { itemsApi } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatCurrency } from '@/lib/utils';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

export default function MyListingsPage() {
  const { user } = useAuthStore();

  const { data: allItems = [] } = useQuery({
    queryKey: ['items'],
    queryFn: () => itemsApi.getAll(),
  });

  const myItems = allItems.filter(item => item.ownerId === user?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
        <Link to="/listing/new">
          <Button>
            <PlusCircleIcon className="h-5 w-5 mr-2" />
            Create Listing
          </Button>
        </Link>
      </div>

      {myItems.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">You haven't created any listings yet</p>
            <Link to="/listing/new">
              <Button>Create Your First Listing</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myItems.map((item) => (
            <Card key={item.id}>
              <img
                src={item.primaryImage}
                alt={item.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <div className="flex items-start justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{item.title}</h3>
                <Badge variant={item.status === 'published' ? 'success' : 'warning'}>
                  {item.status}
                </Badge>
              </div>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{item.description}</p>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xl font-bold text-primary-600">{formatCurrency(item.pricePerDay)}</span>
                  <span className="text-gray-500 text-sm">/day</span>
                </div>
                <div className="text-sm text-gray-500">
                  {item.metadata.views} views
                </div>
              </div>
              <div className="flex gap-3">
                <Link to={`/listing/${item.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">View</Button>
                </Link>
                <Link to={`/listing/${item.id}/edit`} className="flex-1">
                  <Button variant="outline" className="w-full">Edit</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}



