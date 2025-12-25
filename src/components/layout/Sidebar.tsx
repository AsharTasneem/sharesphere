import { Link, useLocation } from 'react-router-dom';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  RectangleStackIcon,
  PlusCircleIcon,
  ShoppingBagIcon,
  ClockIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { useAuthStore } from '@/stores/authStore';
import { useUIStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const location = useLocation();
  const { signOut } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: HomeIcon },
    { path: '/browse', label: 'Browse', icon: MagnifyingGlassIcon },
    { path: '/dashboard/messages', label: 'Messages', icon: ChatBubbleLeftRightIcon },
    { path: '/dashboard/notifications', label: 'Notifications', icon: BellIcon },
  ];

  const manageItems = [
    { path: '/dashboard/my-listings', label: 'My Listings', icon: RectangleStackIcon },
    { path: '/listing/new', label: 'Add Listing', icon: PlusCircleIcon },
    { path: '/dashboard/borrowed', label: 'Borrowed', icon: ShoppingBagIcon },
    { path: '/dashboard/lending-history', label: 'Lending History', icon: ClockIcon },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="h-full overflow-y-auto p-4 space-y-6">
          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Main
            </h3>
            <div className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive(item.path)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Manage
            </h3>
            <div className="space-y-1">
              {manageItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                      isActive(item.path)
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              Settings
            </h3>
            <div className="space-y-1">
              <Link
                to="/dashboard/profile"
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive('/dashboard/profile')
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <Cog6ToothIcon className="h-5 w-5" />
                Profile
              </Link>
              <Link
                to="/dashboard/settings"
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive('/dashboard/settings')
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <Cog6ToothIcon className="h-5 w-5" />
                Account Settings
              </Link>
              <button
                onClick={() => {
                  signOut();
                  setSidebarOpen(false);
                }}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 w-full text-left transition-colors"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Sign Out
              </button>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}



