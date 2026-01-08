import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import Footer from "./Footer";
import { Toast } from "@/components/ui/Toast";
import { useAuthStore } from "@/stores/authStore";

interface LayoutProps {
  children?: ReactNode;
  showSidebar?: boolean;
}

export function Layout({ children, showSidebar = true }: LayoutProps) {
  const { isAuthenticated } = useAuthStore();
  const shouldShowSidebar = showSidebar && isAuthenticated;

  return (
    <div className="min-h-screen bg-surface flex flex-col relative">
      <Navbar showSidebarToggle={shouldShowSidebar} />
      <div className="flex flex-1 min-h-screen">
        {shouldShowSidebar && <Sidebar />}
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
      <Toast />
    </div>
  );
}
