import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAuthStore();

  // 전역 자동 새로고침 (60초마다)
  useEffect(() => {
    if (!isAuthenticated || !user?.is_approved) return;

    const interval = setInterval(() => {
      // 주요 데이터 자동 새로고침
      queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
      queryClient.invalidateQueries({ queryKey: ['totalUnread'] });
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      queryClient.invalidateQueries({ queryKey: ['boards'] });
      queryClient.invalidateQueries({ queryKey: ['events'] });
    }, 60000); // 60초마다

    return () => clearInterval(interval);
  }, [isAuthenticated, user?.is_approved, queryClient]);

  // 창 포커스 시 즉시 새로고침
  useEffect(() => {
    const handleFocus = () => {
      if (isAuthenticated && user?.is_approved) {
        queryClient.invalidateQueries({ queryKey: ['totalUnread'] });
        queryClient.invalidateQueries({ queryKey: ['chatRooms'] });
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [isAuthenticated, user?.is_approved, queryClient]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
