import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

// Pages
import LandingPage from '@/pages/LandingPage';
import HowItWorksPage from '@/pages/HowItWorksPage';
import SignInPage from '@/pages/SignInPage';
import SignUpPage from '@/pages/SignUpPage';
import BrowsePage from '@/pages/BrowsePage';
import ListingDetailPage from '@/pages/ListingDetailPage';
import DashboardPage from '@/pages/DashboardPage';
import MessagesPage from '@/pages/MessagesPage';
import NotificationsPage from '@/pages/NotificationsPage';
import ProfilePage from '@/pages/ProfilePage';
import CreateListingPage from '@/pages/CreateListingPage';
import MyListingsPage from '@/pages/MyListingsPage';
import BorrowedPage from '@/pages/BorrowedPage';
import LendingHistoryPage from '@/pages/LendingHistoryPage';
import AccountSettingsPage from '@/pages/AccountSettingsPage';
import RequestDetailPage from '@/pages/RequestDetailPage';

function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout showSidebar={false}><LandingPage /></Layout>} />
      <Route path="/how-it-works" element={<Layout showSidebar={false}><HowItWorksPage /></Layout>} />
      <Route path="/signin" element={<Layout showSidebar={false}><SignInPage /></Layout>} />
      <Route path="/signup" element={<Layout showSidebar={false}><SignUpPage /></Layout>} />
      <Route path="/browse" element={<Layout><BrowsePage /></Layout>} />
      <Route path="/listing/:id" element={<Layout><ListingDetailPage /></Layout>} />

      {/* Protected routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout><DashboardPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/messages"
        element={
          <ProtectedRoute>
            <Layout><MessagesPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/messages/:requestId"
        element={
          <ProtectedRoute>
            <Layout><MessagesPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/notifications"
        element={
          <ProtectedRoute>
            <Layout><NotificationsPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/profile"
        element={
          <ProtectedRoute>
            <Layout><ProfilePage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/settings"
        element={
          <ProtectedRoute>
            <Layout><AccountSettingsPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/listing/new"
        element={
          <ProtectedRoute>
            <Layout><CreateListingPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/my-listings"
        element={
          <ProtectedRoute>
            <Layout><MyListingsPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/borrowed"
        element={
          <ProtectedRoute>
            <Layout><BorrowedPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/borrowed/:id"
        element={
          <ProtectedRoute>
            <Layout><RequestDetailPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/lending-history"
        element={
          <ProtectedRoute>
            <Layout><LendingHistoryPage /></Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/borrow/request/:itemId"
        element={
          <ProtectedRoute>
            <Layout><RequestDetailPage /></Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;



