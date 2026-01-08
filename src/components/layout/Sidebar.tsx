import { useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
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
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import { cn } from "@/lib/utils";

gsap.registerPlugin(useGSAP);

// Extracted SidebarItem for scoped animation
const SidebarItem = ({
  item,
  isActive,
  onClick,
}: {
  item: { path?: string; label: string; icon: any };
  isActive?: boolean;
  onClick: () => void;
}) => {
  const itemRef = useRef<HTMLAnchorElement | HTMLButtonElement>(null);

  useGSAP(
    () => {
      if (!itemRef.current) return;

      const beam = itemRef.current.querySelector(".beam");

      if (isActive) {
        // Active state: Beam fills from left to right
        gsap.to(beam, {
          scaleX: 1,
          opacity: 1,
          duration: 0.6,
          ease: "power3.inOut",
        });

        // Subtle pop for the container
        gsap.fromTo(
          itemRef.current,
          { scale: 0.98 },
          {
            scale: 1,
            duration: 0.4,
            ease: "power3.inOut",
            clearProps: "scale",
          }
        );
      } else {
        // Inactive state: Beam recedes
        gsap.to(beam, {
          scaleX: 0,
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
        });
      }
    },
    { dependencies: [isActive], scope: itemRef }
  );

  const Icon = item.icon;
  const className = cn(
    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors nav-item relative overflow-hidden group",
    isActive
      ? "text-primary-900 font-semibold"
      : "text-gray-700 hover:bg-gray-50"
  );

  const content = (
    <>
      <div className="beam absolute inset-0 bg-primary-200 z-0 origin-left scale-x-0 opacity-0" />
      <Icon
        className={cn(
          "h-5 w-5 relative z-10 transition-colors",
          isActive ? "text-primary-700" : "group-hover:text-gray-900"
        )}
      />
      <span className="relative z-10">{item.label}</span>
      {isActive && (
        <span className="absolute left-0 top-0 bottom-0 w-1 bg-primary-600 rounded-r-full z-20" />
      )}
    </>
  );

  // Render as Button if no path (e.g. Sign Out)
  if (!item.path) {
    return (
      <button
        ref={itemRef as any}
        onClick={onClick}
        className={cn(className, "w-full text-left")}
      >
        {content}
      </button>
    );
  }

  // Render as Link
  return (
    <Link
      ref={itemRef as any}
      to={item.path}
      onClick={onClick}
      className={className}
    >
      {content}
    </Link>
  );
};

export function Sidebar() {
  const location = useLocation();
  const { signOut } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const sidebarRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);

  // Close sidebar on window resize to prevent stuck state
  useEffect(() => {
    const handleResize = () => {
      // Always close sidebar when resizing
      if (sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [sidebarOpen, setSidebarOpen]);

  // Initial setup - runs only once on mount
  useEffect(() => {
    if (sidebarRef.current && overlayRef.current) {
      const mm = gsap.matchMedia();

      // Set initial states based on screen size
      mm.add("(max-width: 1023px)", () => {
        gsap.set(sidebarRef.current, { x: "100%" });
        gsap.set(overlayRef.current, { autoAlpha: 0 });
      });

      mm.add("(min-width: 1024px)", () => {
        gsap.set(sidebarRef.current, { x: 0 });
        gsap.set(overlayRef.current, { autoAlpha: 0 });
      });

      return () => mm.revert();
    }
  }, []);

  // Mobile sidebar open/close animations - only runs when sidebarOpen changes
  useGSAP(
    () => {
      // Only animate on mobile
      if (window.innerWidth >= 1024) return;

      if (sidebarOpen) {
        // Open animations
        gsap.to(overlayRef.current, {
          autoAlpha: 1,
          duration: 0.3,
          ease: "power2.out",
        });
        gsap.to(sidebarRef.current, {
          x: 0,
          duration: 0.5,
          ease: "power3.out",
        });

        // Stagger navigation items
        gsap.fromTo(
          ".nav-item",
          { x: 12, autoAlpha: 0 },
          {
            x: 0,
            autoAlpha: 1,
            duration: 0.4,
            stagger: 0.07,
            ease: "power4.out",
            delay: 0.2, // Wait for sidebar to start opening
          }
        );
      } else {
        // Close animations
        gsap.to(overlayRef.current, {
          autoAlpha: 0,
          duration: 0.3,
          ease: "power2.in",
        });
        gsap.to(sidebarRef.current, {
          x: "100%",
          duration: 0.4,
          ease: "power3.in",
        });
      }
    },
    { scope: sidebarRef, dependencies: [sidebarOpen] }
  );

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: HomeIcon, exact: true },
    { path: "/browse", label: "Browse", icon: MagnifyingGlassIcon },
    {
      path: "/dashboard/messages",
      label: "Messages",
      icon: ChatBubbleLeftRightIcon,
    },
    {
      path: "/dashboard/notifications",
      label: "Notifications",
      icon: BellIcon,
    },
  ];

  const manageItems = [
    {
      path: "/dashboard/my-listings",
      label: "My Listings",
      icon: RectangleStackIcon,
    },
    { path: "/listing/new", label: "Add Listing", icon: PlusCircleIcon },
    { path: "/dashboard/borrowed", label: "Borrowed", icon: ShoppingBagIcon },
    {
      path: "/dashboard/lending-history",
      label: "Lending History",
      icon: ClockIcon,
    },
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return (
      location.pathname === path || location.pathname.startsWith(path + "/")
    );
  };

  return (
    <>
      {/* Mobile overlay - Always rendered for GSAP to control, pointer-events toggle visibility */}
      <div
        ref={overlayRef}
        className={cn(
          "fixed inset-0 z-[70] lg:hidden opacity-0",
          sidebarOpen ? "pointer-events-auto" : "pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={cn(
          "fixed w-64 bg-white z-[80] shadow-xl",
          "top-0 right-0 bottom-0 border-l border-gray-200", // Mobile
          "lg:static lg:border-l-0 lg:border-r lg:shadow-none lg:h-auto", // Desktop
          "translate-x-full lg:translate-x-0 " // Default CSS State (Mobile Hidden, Desktop Visible)
        )}
      >
        <div className="h-full flex flex-col" ref={navContainerRef}>
          {/* Mobile Close Button Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 lg:hidden">
            <span className="font-semibold text-gray-900">Menu</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close menu"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 nav-item">
                Main
              </h3>
              <div className="space-y-1">
                {navItems.map((item) => (
                  <SidebarItem
                    key={item.path}
                    item={item}
                    isActive={isActive(item.path, item.exact)}
                    onClick={() => setSidebarOpen(false)}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 nav-item">
                Manage
              </h3>
              <div className="space-y-1">
                {manageItems.map((item) => (
                  <SidebarItem
                    key={item.path}
                    item={item}
                    isActive={isActive(item.path)}
                    onClick={() => setSidebarOpen(false)}
                  />
                ))}
              </div>
            </div>

            <div>
              <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 nav-item">
                Settings
              </h3>
              <div className="space-y-1">
                <SidebarItem
                  item={{
                    path: "/dashboard/profile",
                    label: "Profile",
                    icon: Cog6ToothIcon,
                  }}
                  isActive={isActive("/dashboard/profile")}
                  onClick={() => setSidebarOpen(false)}
                />
                <SidebarItem
                  item={{
                    path: "/dashboard/settings",
                    label: "Account Settings",
                    icon: Cog6ToothIcon,
                  }}
                  isActive={isActive("/dashboard/settings")}
                  onClick={() => setSidebarOpen(false)}
                />

                <SidebarItem
                  item={{
                    label: "Sign Out",
                    icon: ArrowRightOnRectangleIcon,
                  }}
                  isActive={false}
                  onClick={() => {
                    signOut();
                    setSidebarOpen(false);
                  }}
                />
              </div>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}
