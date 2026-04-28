import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public pages
import Home from './pages/public/Home';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import About from './pages/public/About';
import Gallery from './pages/public/Gallery';
import GalleryDetail from './pages/public/GalleryDetail';
import PublicNotices from './pages/public/Notices';
import PublicNoticeDetail from './pages/public/NoticeDetail';
import Documents from './pages/public/Documents';
import Privacy from './pages/public/Privacy';
import Terms from './pages/public/Terms';
import EmailPolicy from './pages/public/EmailPolicy';

// Member pages
import Boards from './pages/member/Boards';
import BoardDetail from './pages/member/BoardDetail';
import BoardForm from './pages/member/BoardForm';
import Notices from './pages/member/Notices';
import NoticeDetail from './pages/member/NoticeDetail';
import Schedule from './pages/member/Schedule';
import ScheduleDetail from './pages/member/ScheduleDetail';
import Messenger from './pages/member/Messenger';
import ClubManage from './pages/member/ClubManage';
import Profile from './pages/member/Profile';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30 * 1000, // 30초로 단축
      refetchOnWindowFocus: true, // 창 포커스 시 자동 새로고침
    },
  },
});

function AppContent() {
  const { fetchProfile, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    }
  }, [isAuthenticated, fetchProfile]);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public routes */}
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="about" element={<About />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="gallery/:id" element={<GalleryDetail />} />
        <Route path="public-notices" element={<PublicNotices />} />
        <Route path="public-notices/:id" element={<PublicNoticeDetail />} />
        <Route path="documents" element={<Documents />} />
        <Route path="schedule" element={<Schedule />} />
        <Route path="schedule/:id" element={<ScheduleDetail />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="terms" element={<Terms />} />
        <Route path="email-policy" element={<EmailPolicy />} />

        {/* Member routes */}
        <Route
          path="boards"
          element={
            <ProtectedRoute>
              <Boards />
            </ProtectedRoute>
          }
        />
        <Route
          path="boards/new"
          element={
            <ProtectedRoute>
              <BoardForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="boards/:id"
          element={
            <ProtectedRoute>
              <BoardDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="boards/:id/edit"
          element={
            <ProtectedRoute>
              <BoardForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="notices"
          element={
            <ProtectedRoute>
              <Notices />
            </ProtectedRoute>
          }
        />
        <Route
          path="notices/:id"
          element={
            <ProtectedRoute>
              <NoticeDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="messenger"
          element={
            <ProtectedRoute>
              <Messenger />
            </ProtectedRoute>
          }
        />
        <Route
          path="club-manage"
          element={
            <ProtectedRoute>
              <ClubManage />
            </ProtectedRoute>
          }
        />
        <Route
          path="profile"
          element={
            <ProtectedRoute requireApproval={false}>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="admin"
          element={
            <ProtectedRoute requireAdmin>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
