import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { messengerService } from '../../services/messenger';
import api from '../../services/api';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // 안읽은 메시지 수 조회 (30초마다 자동 갱신)
  const { data: unreadData } = useQuery({
    queryKey: ['totalUnread'],
    queryFn: () => messengerService.getTotalUnread(),
    enabled: isAuthenticated && !!user?.is_approved,
    refetchInterval: 30000, // 30초마다 자동 갱신
    staleTime: 10000, // 10초
  });

  const totalUnread = (unreadData?.total_unread || 0) + (unreadData?.pending_invitations || 0);

  // 관리자 알림 카운트 조회 (30초마다 자동 갱신)
  const { data: adminNotiData } = useQuery({
    queryKey: ['adminNotifications'],
    queryFn: async () => {
      const response = await api.get('/accounts/users/admin-notifications/');
      return response.data as { pending_users: number; pending_participants: number; total: number };
    },
    enabled: isAuthenticated && user?.role === 'admin',
    refetchInterval: 30000,
    staleTime: 10000,
  });

  const adminNotiTotal = adminNotiData?.total || 0;

  // 클럽장 대기 요청 수 조회
  const { data: pendingClubData } = useQuery({
    queryKey: ['pendingClubRequestCount'],
    queryFn: () => messengerService.getPendingClubRequestCount(),
    enabled: isAuthenticated && user?.role === 'instructor',
    refetchInterval: 30000,
    staleTime: 10000,
  });

  const pendingClubCount = pendingClubData?.count || 0;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Navigate and close mobile menu
  const handleMobileLink = (path: string) => {
    closeMobileMenu();
    navigate(path);
  };

  // Navigation items
  const navItems = [
    { to: '/about', label: '협회소개', always: true },
    { to: '/schedule', label: '경기일정', always: true },
    { to: '/gallery', label: '갤러리', always: true },
    { to: '/documents', label: '서식다운로드', always: true },
  ];

  return (
    <header className="bg-white shadow-sm">
      {/* Top Bar */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 md:gap-3" onClick={closeMobileMenu}>
              <img src="/images/logo.png" alt="DDGA 로고" className="w-10 h-10 md:w-12 md:h-12 object-contain" />
              <div>
                <h1 className="text-base md:text-xl font-bold text-green-800">대덕구골프협회</h1>
                <p className="text-[10px] md:text-xs text-green-600 hidden sm:block">Dae Deok gu Golf Association</p>
              </div>
            </Link>

            {/* Desktop User Menu */}
            <div className="hidden md:flex items-center gap-4 text-sm">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-600">{user?.username}님 환영합니다</span>
                  <span className="text-gray-300">|</span>
                  <Link to="/profile" className="text-gray-600 hover:text-green-700">
                    마이페이지
                  </Link>
                  {user?.role === 'admin' && (
                    <>
                      <span className="text-gray-300">|</span>
                      <Link to="/admin" className="relative text-gray-600 hover:text-green-700">
                        관리자
                        {adminNotiTotal > 0 && (
                          <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                            {adminNotiTotal > 99 ? '99+' : adminNotiTotal}
                          </span>
                        )}
                      </Link>
                    </>
                  )}
                  {user?.role === 'instructor' && (
                    <>
                      <span className="text-gray-300">|</span>
                      <Link to="/club-manage" className="relative text-gray-600 hover:text-green-700">
                        클럽장
                        {pendingClubCount > 0 && (
                          <span className="absolute -top-2 -right-4 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                            {pendingClubCount > 99 ? '99+' : pendingClubCount}
                          </span>
                        )}
                      </Link>
                    </>
                  )}
                  <span className="text-gray-300">|</span>
                  <button
                    onClick={handleLogout}
                    className="text-gray-600 hover:text-green-700"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-green-700">
                    로그인
                  </Link>
                  <span className="text-gray-300">|</span>
                  <Link to="/register" className="text-gray-600 hover:text-green-700">
                    회원가입
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden relative p-2 text-gray-600 hover:text-green-700 focus:outline-none"
              aria-label="메뉴 열기"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
              {/* Badge on hamburger when there are notifications */}
              {(totalUnread > 0 || adminNotiTotal > 0 || pendingClubCount > 0) && !mobileMenuOpen && (
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-gradient-to-r from-green-800 to-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex justify-center">
            {navItems.map((item) => (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className="block px-4 py-3 lg:px-8 lg:py-4 text-white font-medium hover:bg-green-900 transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {/* 비로그인 또는 미승인 회원: 공개 공지사항 */}
            {(!isAuthenticated || !user?.is_approved) && (
              <li>
                <Link
                  to="/public-notices"
                  className="block px-4 py-3 lg:px-8 lg:py-4 text-white font-medium hover:bg-green-900 transition-colors"
                >
                  공지사항
                </Link>
              </li>
            )}
            {/* 승인된 회원: 회원 전용 메뉴 */}
            {isAuthenticated && user?.is_approved && (
              <>
                <li>
                  <Link
                    to="/boards"
                    className="block px-4 py-3 lg:px-8 lg:py-4 text-white font-medium hover:bg-green-900 transition-colors"
                  >
                    자유게시판
                  </Link>
                </li>
                <li>
                  <Link
                    to="/notices"
                    className="block px-4 py-3 lg:px-8 lg:py-4 text-white font-medium hover:bg-green-900 transition-colors"
                  >
                    공지사항
                  </Link>
                </li>
                <li>
                  <Link
                    to="/messenger"
                    className="relative block px-4 py-3 lg:px-8 lg:py-4 text-white font-medium hover:bg-green-900 transition-colors"
                  >
                    클럽
                    {totalUnread > 0 && (
                      <span className="absolute top-2 right-1 lg:right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {totalUnread > 99 ? '99+' : totalUnread}
                      </span>
                    )}
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 shadow-lg">
          {/* User Menu Section */}
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
            {isAuthenticated ? (
              <div className="space-y-2">
                <p className="text-sm text-gray-600 font-medium">{user?.username}님 환영합니다</p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleMobileLink('/profile')}
                    className="text-sm text-green-700 hover:text-green-800"
                  >
                    마이페이지
                  </button>
                  {user?.role === 'admin' && (
                    <button
                      onClick={() => handleMobileLink('/admin')}
                      className="relative text-sm text-green-700 hover:text-green-800"
                    >
                      관리자
                      {adminNotiTotal > 0 && (
                        <span className="ml-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                          {adminNotiTotal > 99 ? '99+' : adminNotiTotal}
                        </span>
                      )}
                    </button>
                  )}
                  {user?.role === 'instructor' && (
                    <button
                      onClick={() => handleMobileLink('/club-manage')}
                      className="relative text-sm text-green-700 hover:text-green-800"
                    >
                      클럽장
                      {pendingClubCount > 0 && (
                        <span className="ml-1 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
                          {pendingClubCount > 99 ? '99+' : pendingClubCount}
                        </span>
                      )}
                    </button>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    로그아웃
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex gap-4">
                <button
                  onClick={() => handleMobileLink('/login')}
                  className="text-sm font-medium text-green-700 hover:text-green-800"
                >
                  로그인
                </button>
                <button
                  onClick={() => handleMobileLink('/register')}
                  className="text-sm text-gray-600 hover:text-green-700"
                >
                  회원가입
                </button>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <ul className="divide-y divide-gray-100">
            {navItems.map((item) => (
              <li key={item.to}>
                <button
                  onClick={() => handleMobileLink(item.to)}
                  className={`block w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                    location.pathname === item.to
                      ? 'text-green-700 bg-green-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
            {(!isAuthenticated || !user?.is_approved) && (
              <li>
                <button
                  onClick={() => handleMobileLink('/public-notices')}
                  className={`block w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                    location.pathname === '/public-notices'
                      ? 'text-green-700 bg-green-50'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  공지사항
                </button>
              </li>
            )}
            {isAuthenticated && user?.is_approved && (
              <>
                <li>
                  <button
                    onClick={() => handleMobileLink('/boards')}
                    className={`block w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                      location.pathname === '/boards'
                        ? 'text-green-700 bg-green-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    자유게시판
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleMobileLink('/notices')}
                    className={`block w-full text-left px-4 py-3 text-sm font-medium transition-colors ${
                      location.pathname === '/notices'
                        ? 'text-green-700 bg-green-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    공지사항
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleMobileLink('/messenger')}
                    className={`flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition-colors ${
                      location.pathname.startsWith('/messenger')
                        ? 'text-green-700 bg-green-50'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    클럽
                    {totalUnread > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                        {totalUnread > 99 ? '99+' : totalUnread}
                      </span>
                    )}
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
