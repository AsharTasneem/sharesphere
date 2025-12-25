import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useSearchParams } from 'react-router-dom';
import { itemsApi } from '@/services/api';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { CATEGORIES, SORT_OPTIONS } from '@/lib/constants';
import { Squares2X2Icon, ListBulletIcon } from '@heroicons/react/24/outline';

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['items', { search, category, sort }],
    queryFn: () => itemsApi.getAll({ search, category: category || undefined, sort }),
  });

  const handleSearch = (value: string) => {
    setSearch(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    setSearchParams(params);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Items</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <Input
              placeholder="Search items..."
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              options={[{ value: '', label: 'All Categories' }, ...CATEGORIES.map(c => ({ value: c, label: c }))]}
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                const params = new URLSearchParams(searchParams);
                if (e.target.value) {
                  params.set('category', e.target.value);
                } else {
                  params.delete('category');
                }
                setSearchParams(params);
              }}
            />
          </div>
          <div className="w-full md:w-48">
            <Select
              options={SORT_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                const params = new URLSearchParams(searchParams);
                params.set('sort', e.target.value);
                setSearchParams(params);
              }}
            />
          </div>
          <div className="flex gap-2 items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
              aria-label="Grid view"
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'}`}
              aria-label="List view"
            >
              <ListBulletIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-48 bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg mb-4">No items found</p>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Link 
              key={item.id} 
              to={`/listing/${item.id}`} 
              className="block h-full transition-transform hover:scale-[1.02]"
            >
              <Card className="h-full flex flex-col overflow-hidden">
                <div className="w-full h-48 mb-4 overflow-hidden rounded-lg bg-gray-100">
                  <img
                    src={item.primaryImage}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-2 leading-tight">{item.title}</h3>
                    <Badge variant="default" size="sm" className="flex-shrink-0">{item.category}</Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-shrink-0">{item.description}</p>
                  <div className="mt-auto pt-2">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-primary-600">{formatCurrency(item.pricePerDay)}</span>
                        <span className="text-gray-500 text-sm">/day</span>
                      </div>
                      {item.metadata.rating > 0 && (
                        <div className="text-sm text-gray-500 flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span>{item.metadata.rating.toFixed(1)}</span>
                          <span className="text-gray-400">({item.metadata.reviewCount})</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-500 truncate">{item.location.displayAddress}</p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <Link 
              key={item.id} 
              to={`/listing/${item.id}`} 
              className="block"
            >
              <Card className="flex gap-4">
                <img
                  src={item.primaryImage}
                  alt={item.title}
                  className="w-32 h-32 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2 gap-2">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1 line-clamp-1">{item.title}</h3>
                    <Badge variant="default" size="sm" className="flex-shrink-0">{item.category}</Badge>
                  </div>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{item.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-bold text-primary-600">{formatCurrency(item.pricePerDay)}</span>
                      <span className="text-gray-500 text-sm">/day</span>
                    </div>
                    {item.metadata.rating > 0 && (
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span>{item.metadata.rating.toFixed(1)}</span>
                        <span className="text-gray-400">({item.metadata.reviewCount})</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mt-2">{item.location.displayAddress}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
