import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { messengerService } from '../../services/messenger';
import api from '../../services/api';

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

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
    navigate('/');
  };

  return (
    <header className="bg-white shadow-sm">
      {/* Top Bar */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <img src="/images/logo.png" alt="DDGA 로고" className="w-12 h-12 object-contain" />
              <div>
                <h1 className="text-xl font-bold text-green-800">대덕구골프협회</h1>
                <p className="text-xs text-green-600">Dae Deok gu Golf Association</p>
              </div>
            </Link>

            {/* User Menu */}
            <div className="flex items-center gap-4 text-sm">
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
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-gradient-to-r from-green-800 to-green-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ul className="flex justify-center">
            <li>
              <Link
                to="/about"
                className="block px-8 py-4 text-white font-medium hover:bg-green-900 transition-colors"
              >
                협회소개
              </Link>
            </li>
            <li>
              <Link
                to="/schedule"
                className="block px-8 py-4 text-white font-medium hover:bg-green-900 transition-colors"
              >
                경기일정
              </Link>
            </li>
            <li>
              <Link
                to="/gallery"
                className="block px-8 py-4 text-white font-medium hover:bg-green-900 transition-colors"
              >
                갤러리
              </Link>
            </li>
            <li>
              <Link
                to="/documents"
                className="block px-8 py-4 text-white font-medium hover:bg-green-900 transition-colors"
              >
                서식다운로드
              </Link>
            </li>
            {/* 비로그인 또는 미승인 회원: 공개 공지사항 */}
            {(!isAuthenticated || !user?.is_approved) && (
              <li>
                <Link
                  to="/public-notices"
                  className="block px-8 py-4 text-white font-medium hover:bg-green-900 transition-colors"
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
                    className="block px-8 py-4 text-white font-medium hover:bg-green-900 transition-colors"
                  >
                    자유게시판
                  </Link>
                </li>
                <li>
                  <Link
                    to="/notices"
                    className="block px-8 py-4 text-white font-medium hover:bg-green-900 transition-colors"
                  >
                    공지사항
                  </Link>
                </li>
                <li>
                  <Link
                    to="/messenger"
                    className="relative block px-8 py-4 text-white font-medium hover:bg-green-900 transition-colors"
                  >
                    클럽
                    {totalUnread > 0 && (
                      <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
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
    </header>
  );
}
