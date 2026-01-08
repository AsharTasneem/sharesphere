import { useEffect } from "react";
import { Routes, Route, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { Layout } from "@/components/layout/Layout";
import { ProtectedRoute } from "@/components/layout/ProtectedRoute";

// Pages
import LandingPage from "@/pages/LandingPage";
import HowItWorksPage from "@/pages/HowItWorksPage";
import SignInPage from "@/pages/SignInPage";
import SignUpPage from "@/pages/SignUpPage";
import BrowsePage from "@/pages/BrowsePage";
import ListingDetailPage from "@/pages/ListingDetailPage";
import DashboardPage from "@/pages/DashboardPage";
import MessagesPage from "@/pages/MessagesPage";
import NotificationsPage from "@/pages/NotificationsPage";
import ProfilePage from "@/pages/ProfilePage";
import CreateListingPage from "@/pages/CreateListingPage";
import MyListingsPage from "@/pages/MyListingsPage";
import BorrowedPage from "@/pages/BorrowedPage";
import LendingHistoryPage from "@/pages/LendingHistoryPage";
import AccountSettingsPage from "@/pages/AccountSettingsPage";
import RequestDetailPage from "@/pages/RequestDetailPage";
import RouteChangeLoader from "@/components/layout/RouteChangeLoader";

// Layout wrapper components
function PublicLayout() {
  return (
    <Layout showSidebar={false}>
      <Outlet />
    </Layout>
  );
}

// Single unified layout for all pages with sidebar (both public and protected)
function SidebarLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <RouteChangeLoader>
      <Routes>
        {/* Public routes without sidebar */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/signin" element={<SignInPage />} />
          <Route path="/signup" element={<SignUpPage />} />
        </Route>

        {/* All routes with sidebar - unified layout */}
        <Route element={<SidebarLayout />}>
          {/* Public routes with sidebar */}
          <Route path="/browse" element={<BrowsePage />} />
          <Route path="/listing/:id" element={<ListingDetailPage />} />

          {/* Protected routes with sidebar */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/messages"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/messages/:requestId"
            element={
              <ProtectedRoute>
                <MessagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/settings"
            element={
              <ProtectedRoute>
                <AccountSettingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/listing/new"
            element={
              <ProtectedRoute>
                <CreateListingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/my-listings"
            element={
              <ProtectedRoute>
                <MyListingsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/borrowed"
            element={
              <ProtectedRoute>
                <BorrowedPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/borrowed/:id"
            element={
              <ProtectedRoute>
                <RequestDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/lending-history"
            element={
              <ProtectedRoute>
                <LendingHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/borrow/request/:itemId"
            element={
              <ProtectedRoute>
                <RequestDetailPage />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </RouteChangeLoader>
  );
}

export default App;
