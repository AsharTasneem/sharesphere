import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Toast } from "@/components/ui/Toast";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";
import { Bars3Icon } from "@heroicons/react/24/outline";

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export function Layout({ children, showSidebar = true }: LayoutProps) {
  const { isAuthenticated } = useAuthStore();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const shouldShowSidebar = showSidebar && isAuthenticated;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar />
      {shouldShowSidebar && (
        <>
          <button
            onClick={toggleSidebar}
            className="fixed top-20 left-4 z-30 lg:hidden p-2 bg-white rounded-lg shadow-md border border-gray-200"
            aria-label="Toggle sidebar"
          >
            <Bars3Icon className="h-6 w-6 text-gray-600" />
          </button>
          <Sidebar />
        </>
      )}
      <main className={shouldShowSidebar ? "lg:ml-64" : ""}>{children}</main>
      <Toast />
    </div>
  );
}
