import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { Toast } from "@/components/ui/Toast";
import { useAuthStore } from "@/stores/authStore";

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export function Layout({ children, showSidebar = true }: LayoutProps) {
  const { isAuthenticated } = useAuthStore();
  const shouldShowSidebar = showSidebar && isAuthenticated;

  return (
    <div className="min-h-screen bg-surface">
      <Navbar showSidebarToggle={shouldShowSidebar} />
      {shouldShowSidebar && (
        <>
          <Sidebar />
        </>
      )}
      <main className={shouldShowSidebar ? "lg:ml-64" : ""}>{children}</main>
      <Toast />
    </div>
  );
}
