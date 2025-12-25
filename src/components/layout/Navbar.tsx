import { Link, useNavigate } from 'react-router-dom';
import { MagnifyingGlassIcon, BellIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/Button';

export function Navbar() {
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuthStore();
  const { unreadCount, fetchNotifications } = useNotificationStore();
  const { showToast } = useUIStore();

  const handleSignOut = () => {
    signOut();
    showToast('Signed out successfully', 'success');
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-semibold text-gray-900">ShareSphere</span>
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search items..."
                    className="w-64 px-4 py-2 pl-10 rounded-full border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 outline-none text-sm"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        navigate(`/browse?search=${(e.target as HTMLInputElement).value}`);
                      }
                    }}
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              <Link
                to="/dashboard/messages"
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Messages"
              >
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-600" />
              </Link>

              <button
                onClick={() => {
                  fetchNotifications();
                  navigate('/dashboard/notifications');
                }}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Notifications"
              >
                <BellIcon className="h-6 w-6 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <div className="relative group">
                <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <img
                    src={user?.avatar || 'https://i.pravatar.cc/150?img=1'}
                    alt={user?.name || 'User'}
                    className="h-8 w-8 rounded-full"
                  />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/dashboard/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/browse">
                <Button variant="ghost" size="sm">Browse</Button>
              </Link>
              <Link to="/signin">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}



