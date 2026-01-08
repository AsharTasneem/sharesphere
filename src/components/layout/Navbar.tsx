import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import {
  MagnifyingGlassIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "@/stores/authStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { useUIStore } from "@/stores/uiStore";
import { Button } from "@/components/ui/Button";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

interface NavbarProps {
  showSidebarToggle?: boolean;
}

export function Navbar({ showSidebarToggle = false }: NavbarProps) {
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useAuthStore();
  const { unreadCount, fetchNotifications } = useNotificationStore();
  const { showToast, toggleSidebar } = useUIStore();
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = Math.abs(currentScrollY - lastScrollY);

      // Show navbar when at the top of the page
      if (currentScrollY < 100) {
        setIsVisible(true);
      }
      // Only trigger hide/show after scrolling at least 100px
      else if (scrollDifference > 50) {
        if (currentScrollY > lastScrollY) {
          // Scrolling down - hide navbar
          setIsVisible(false);
        } else {
          // Scrolling up - show navbar
          setIsVisible(true);
        }
        setLastScrollY(currentScrollY);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useGSAP(
    () => {
      if (!navRef.current) return;

      if (isVisible) {
        // Show navbar with smooth animation
        gsap.to(navRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          ease: "power4.out",
        });
      } else {
        // Hide navbar with smooth animation
        gsap.to(navRef.current, {
          y: -100,
          opacity: 0.8,
          duration: 0.6,
          ease: "power4.in",
        });
      }
    },
    { dependencies: [isVisible] }
  );

  const handleSignOut = () => {
    signOut();
    showToast("Signed out successfully", "success");
    navigate("/");
  };

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      navigate(`/browse?search=${(e.target as HTMLInputElement).value}`);
      setIsMobileSearchOpen(false);
    }
  };

  return (
    <nav
      ref={navRef}
      className="bg-white border-b border-gray-200 sticky top-0 z-40"
    >
      <div className="max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 flex-shrink-0 min-w-fit">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">S</span>
              </div>
              <span className="text-xl font-semibold text-gray-900 hidden sm:block whitespace-nowrap">
                ShareSphere
              </span>
            </Link>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-4">
              {/* Desktop Search */}
              <div className="hidden md:flex items-center gap-2">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search items..."
                    className="w-64 px-4 py-2 pl-10 rounded-full border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 outline-none text-sm"
                    onKeyDown={handleSearch}
                  />
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Mobile Search Toggle */}
              <button
                className="md:hidden p-2 rounded-full hover:bg-primary-100 hover:text-primary-600 transition-colors"
                onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
              >
                <MagnifyingGlassIcon className="h-6 w-6 text-gray-600" />
              </button>

              <Link
                to="/dashboard/messages"
                className="relative p-2 rounded-full hover:bg-primary-100 transition-colors group"
                aria-label="Messages"
              >
                <ChatBubbleLeftRightIcon className="h-6 w-6 text-gray-600 group-hover:text-gray-600 transition-colors" />
              </Link>

              <button
                onClick={() => {
                  fetchNotifications();
                  navigate("/dashboard/notifications");
                }}
                className="relative p-2 rounded-full hover:bg-primary-100 transition-colors group"
                aria-label="Notifications"
              >
                <BellIcon className="h-6 w-6 text-gray-600 group-hover:text-gray-600 transition-colors" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                )}
              </button>

              <div className="relative group">
                <button className="flex items-center gap-2 p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <img
                    src={user?.avatar || "https://i.pravatar.cc/150?img=1"}
                    alt={user?.name || "User"}
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

              {showSidebarToggle && (
                <button
                  onClick={toggleSidebar}
                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg lg:hidden"
                  aria-label="Toggle sidebar"
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/browse">
                <Button variant="ghost" size="sm">
                  Browse
                </Button>
              </Link>
              <Link to="/signin">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Search Bar */}
        {isAuthenticated && isMobileSearchOpen && (
          <div className="md:hidden py-3 border-t border-gray-100 animate-in">
            <div className="relative">
              <input
                type="text"
                placeholder="Search items..."
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-500 focus:ring-opacity-20 outline-none text-sm"
                onKeyDown={handleSearch}
                autoFocus
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
