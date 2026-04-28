import { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { galleryService } from '../../services/gallery';
import { noticesService } from '../../services/notices';
import { scheduleService } from '../../services/schedule';
import { messengerService } from '../../services/messenger';
import { boardsService } from '../../services/boards';
import { useAuthStore } from '../../store/authStore';
import BannerSlider from '../../components/common/BannerSlider';
import NoticePopup from '../../components/common/NoticePopup';
import type { Event } from '../../types';

// 드래그 가능한 일정 팝업 컴포넌트
function EventPopup({
  events,
  onClose,
  navigate,
  initialPosition,
}: {
  events: Event[];
  onClose: () => void;
  navigate: (path: string) => void;
  initialPosition?: { x: number; y: number };
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [position, setPosition] = useState(initialPosition || { x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!initialPosition && popupRef.current) {
      const rect = popupRef.current.getBoundingClientRect();
      setPosition({
        x: (window.innerWidth - rect.width) / 2,
        y: Math.max(40, (window.innerHeight - rect.height) / 3),
      });
    }
  }, [initialPosition]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    e.preventDefault();
  }, [position]);

  useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX - dragOffset.current.x,
        y: e.clientY - dragOffset.current.y,
      });
    };
    const handleMouseUp = () => setIsDragging(false);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const currentEvent = events[currentIndex];
  if (!currentEvent) return null;

  return (
    <div
      ref={popupRef}
      className="fixed z-50 bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden"
      style={{
        left: position.x,
        top: position.y,
        userSelect: isDragging ? 'none' : 'auto',
      }}
    >
      {/* Header - draggable */}
      <div
        className="flex justify-between items-center px-4 py-3 border-b bg-green-700 text-white cursor-move"
        onMouseDown={handleMouseDown}
      >
        <h3 className="font-semibold text-sm truncate flex-1">{currentEvent.title}</h3>
        <button
          onClick={onClose}
          className="text-white hover:text-green-200 text-xl leading-none ml-2"
        >
          &times;
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500 w-16">일시</span>
            <span className="text-gray-800">
              {new Date(currentEvent.start_date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
              {' '}
              {new Date(currentEvent.start_date).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          {currentEvent.location && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-500 w-16">장소</span>
              <span className="text-gray-800">{currentEvent.location}</span>
            </div>
          )}
          {currentEvent.description && (
            <p className="text-gray-600 text-sm mt-2 whitespace-pre-wrap">{currentEvent.description}</p>
          )}
        </div>

        {/* Action Button */}
        <div className="mb-3">
          <button
            onClick={() => {
              onClose();
              navigate(`/schedule/${currentEvent.id}`);
            }}
            className="w-full py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 font-medium"
          >
            자세히 보기
          </button>
        </div>

        {/* Navigation for multiple event popups */}
        {events.length > 1 && (
          <div className="flex justify-center items-center gap-3 mb-3">
            <button
              onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-sm"
            >
              &lt; 이전
            </button>
            <span className="text-xs text-gray-500">
              {currentIndex + 1} / {events.length}
            </span>
            <button
              onClick={() => setCurrentIndex(i => Math.min(events.length - 1, i + 1))}
              disabled={currentIndex === events.length - 1}
              className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-sm"
            >
              다음 &gt;
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t bg-gray-50 flex justify-between items-center">
        <label className="flex items-center cursor-pointer text-sm text-gray-500">
          <input
            type="checkbox"
            onChange={(e) => {
              if (e.target.checked) {
                const today = new Date().toISOString().split('T')[0];
                const hiddenIds = JSON.parse(localStorage.getItem('event_popup_hidden') || '{}');
                events.forEach((ev: Event) => { hiddenIds[ev.id] = today; });
                localStorage.setItem('event_popup_hidden', JSON.stringify(hiddenIds));
              }
            }}
            className="mr-2 rounded text-green-600 focus:ring-green-500"
          />
          오늘 하루 보지 않기
        </label>
        <button
          onClick={onClose}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          닫기
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const { isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'notices' | 'boards'>('notices');
  const [showPopup, setShowPopup] = useState(true);
  const [showEventPopup, setShowEventPopup] = useState(true);

  const { data: popupNotices } = useQuery({
    queryKey: ['popupNotices'],
    queryFn: async () => {
      try { return await noticesService.getPopupNotices(); }
      catch { return []; }
    },
    retry: false,
  });

  const { data: popupEvents } = useQuery({
    queryKey: ['popupEvents'],
    queryFn: async () => {
      try { return await scheduleService.getPopupEvents(); }
      catch { return []; }
    },
    retry: false,
  });

  // Filter out popups hidden today
  const visiblePopups = (popupNotices || []).filter((p) => {
    const hiddenData = JSON.parse(localStorage.getItem('popup_hidden') || '{}');
    const today = new Date().toISOString().split('T')[0];
    return hiddenData[p.id] !== today;
  });

  // Filter out event popups hidden today
  const visibleEventPopups = (popupEvents || []).filter((e: Event) => {
    const hiddenData = JSON.parse(localStorage.getItem('event_popup_hidden') || '{}');
    const today = new Date().toISOString().split('T')[0];
    return hiddenData[e.id] !== today;
  });

  const { data: albums } = useQuery({
    queryKey: ['publicAlbums'],
    queryFn: () => galleryService.getAlbums(1, true),
  });

  // 승인된 회원용 공지사항
  const { data: notices } = useQuery({
    queryKey: ['homeNotices'],
    queryFn: () => noticesService.getNotices(1),
    enabled: isAuthenticated && !!user?.is_approved,
  });

  // 공개 공지사항 (비로그인/미승인 사용자용)
  const { data: publicNotices } = useQuery({
    queryKey: ['homePublicNotices'],
    queryFn: () => noticesService.getPublicNotices(1),
    enabled: !isAuthenticated || !user?.is_approved,
  });

  const { data: upcomingEvents } = useQuery({
    queryKey: ['upcomingEvents'],
    queryFn: () => scheduleService.getUpcomingEvents(),
    enabled: isAuthenticated && !!user?.is_approved,
  });

  // 자유게시판 최신글 (공개)
  const { data: boardPosts } = useQuery({
    queryKey: ['homeBoardPosts'],
    queryFn: () => boardsService.getPosts(1),
  });

  // 채팅 안읽은 메시지 수 (승인된 회원용)
  const { data: unreadData } = useQuery({
    queryKey: ['totalUnread'],
    queryFn: () => messengerService.getTotalUnread(),
    enabled: isAuthenticated && !!user?.is_approved,
    refetchInterval: 30000, // 30초마다 갱신
  });

  return (
    <div className="bg-white">
      {/* Hero Banner */}
      <section className="relative h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=1600)',
            filter: 'brightness(0.9)'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

        {/* Quick Menu */}
        <div className="absolute right-8 top-8 bg-white/95 rounded-lg shadow-lg p-4 w-48">
          <h3 className="text-center font-bold text-gray-800 border-b pb-2 mb-3">Quick Menu</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <Link to="/about" className="text-gray-600 hover:text-green-700 block py-1">
                → 협회소개
              </Link>
            </li>
            <li>
              <Link to="/schedule" className="text-gray-600 hover:text-green-700 block py-1">
                → 경기일정
              </Link>
            </li>
            <li>
              <Link to="/gallery" className="text-gray-600 hover:text-green-700 block py-1">
                → 갤러리
              </Link>
            </li>
            {isAuthenticated && user?.is_approved && (
              <li>
                <Link to="/messenger" className="text-gray-600 hover:text-green-700 block py-1 flex items-center justify-between">
                  <span>→ 클럽</span>
                  {unreadData && (unreadData.total_unread > 0 || unreadData.pending_invitations > 0) && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {unreadData.total_unread + unreadData.pending_invitations}
                    </span>
                  )}
                </Link>
              </li>
            )}
            {isAuthenticated && user?.is_approved && user.role === 'admin' && (
              <li>
                <Link
                  to="/admin?tab=sms"
                  className="text-gray-600 hover:text-green-700 block py-1"
                >
                  → SMS 관리
                </Link>
              </li>
            )}
            <li>
              <Link to="/documents" className="text-gray-600 hover:text-green-700 block py-1">
                → 서식다운로드
              </Link>
            </li>
            {!isAuthenticated && (
              <li>
                <Link to="/register" className="text-gray-600 hover:text-green-700 block py-1">
                  → 회원가입
                </Link>
              </li>
            )}
          </ul>
        </div>

        {/* Banner Text */}
        <div className="absolute bottom-8 left-8 text-white">
          <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">대덕구골프협회</h1>
          <p className="text-xl drop-shadow-lg">함께하는 골프, 즐거운 라운딩</p>
        </div>
      </section>

      {/* Banner Slider */}
      <BannerSlider />

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column - 공지사항 */}
          <div className="lg:col-span-1">
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('notices')}
                  className={`flex-1 text-center py-3 font-bold transition-colors ${
                    activeTab === 'notices'
                      ? 'bg-green-800 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  공지사항
                </button>
                <button
                  onClick={() => setActiveTab('boards')}
                  className={`flex-1 text-center py-3 font-bold transition-colors ${
                    activeTab === 'boards'
                      ? 'bg-green-800 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  자유게시판
                </button>
              </div>
              <div className="p-4">
                {activeTab === 'notices' ? (
                  <>
                    {isAuthenticated && user?.is_approved && notices?.results ? (
                      <ul className="space-y-2">
                        {notices.results.slice(0, 5).map((notice) => (
                          <li key={notice.id} className="flex justify-between items-center text-sm border-b border-dashed border-gray-200 pb-2">
                            <Link
                              to={`/notices/${notice.id}`}
                              className="text-gray-700 hover:text-green-700 truncate flex-1 mr-2"
                            >
                              {notice.is_important && <span className="text-red-500 mr-1">•</span>}
                              {notice.title}
                            </Link>
                            <span className="text-gray-400 text-xs whitespace-nowrap">
                              {new Date(notice.created_at).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : publicNotices?.results && publicNotices.results.length > 0 ? (
                      <ul className="space-y-2">
                        {publicNotices.results.slice(0, 5).map((notice) => (
                          <li key={notice.id} className="flex justify-between items-center text-sm border-b border-dashed border-gray-200 pb-2">
                            <Link
                              to={`/public-notices/${notice.id}`}
                              className="text-gray-700 hover:text-green-700 truncate flex-1 mr-2"
                            >
                              {notice.is_important && <span className="text-red-500 mr-1">•</span>}
                              {notice.title}
                            </Link>
                            <span className="text-gray-400 text-xs whitespace-nowrap">
                              {new Date(notice.created_at).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-4">
                        등록된 공지사항이 없습니다.
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    {boardPosts?.results && boardPosts.results.length > 0 ? (
                      <ul className="space-y-2">
                        {boardPosts.results.slice(0, 5).map((post) => (
                          <li key={post.id} className="flex justify-between items-center text-sm border-b border-dashed border-gray-200 pb-2">
                            <Link
                              to={isAuthenticated && user?.is_approved ? `/boards/${post.id}` : '/login'}
                              className="text-gray-700 hover:text-green-700 truncate flex-1 mr-2"
                            >
                              {post.title}
                            </Link>
                            <span className="text-gray-400 text-xs whitespace-nowrap">
                              {new Date(post.created_at).toLocaleDateString('ko-KR', { month: '2-digit', day: '2-digit' })}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-4">
                        등록된 게시글이 없습니다.
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Customer Center */}
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">CUSTOMER CENTER</p>
              <p className="text-sm text-gray-600 mb-2">문의전화</p>
              <p className="text-3xl font-bold text-green-800 mb-2">042-624-7080</p>
              <p className="text-xs text-gray-500">언제나 친절하게 상담해 드립니다.</p>
            </div>
          </div>

          {/* Center Column - 갤러리 */}
          <div className="lg:col-span-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-800">협회갤러리</h2>
              <Link to="/gallery" className="text-sm text-gray-500 hover:text-green-700">MORE</Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {albums?.results?.slice(0, 4).map((album) => (
                <Link
                  key={album.id}
                  to={`/gallery/${album.id}`}
                  className="aspect-square bg-gray-200 rounded overflow-hidden hover:opacity-90 transition-opacity"
                >
                  {album.cover_image ? (
                    <img
                      src={album.cover_image}
                      alt={album.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200">
                      <span className="text-4xl">🏌️</span>
                    </div>
                  )}
                </Link>
              )) || (
                <>
                  {[1,2,3,4].map(i => (
                    <div key={i} className="aspect-square bg-gradient-to-br from-green-100 to-green-200 rounded flex items-center justify-center">
                      <span className="text-4xl">🏌️</span>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* 협회 소개 */}
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h3 className="font-bold text-gray-800 mb-2">대덕구골프협회</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                대덕구골프협회를 찾아주셔서 감사합니다. 골프 스포츠의 진흥과 보급을
                통하여 골프 저변확대를 위한 목적으로 하는 본 협회는 골프 발전에
                전력하고 있으며 골프를 대내외적으로 대표하는 기관으로 활동하고 있습니다.
              </p>
            </div>
          </div>

          {/* Right Column - 바로가기 */}
          <div className="lg:col-span-1">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Link to="/about" className="text-center group">
                <div className="bg-gray-100 rounded-lg p-4 mb-2 group-hover:bg-green-50 transition-colors">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/2936/2936690.png"
                    alt="협회소개"
                    className="w-12 h-12 mx-auto"
                  />
                </div>
                <p className="text-sm font-medium text-gray-700">협회소개</p>
                <p className="text-xs text-gray-400">intro</p>
              </Link>
              <Link to="/schedule" className="text-center group">
                <div className="bg-gray-100 rounded-lg p-4 mb-2 group-hover:bg-green-50 transition-colors">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/2693/2693507.png"
                    alt="경기일정"
                    className="w-12 h-12 mx-auto"
                  />
                </div>
                <p className="text-sm font-medium text-gray-700">경기일정</p>
                <p className="text-xs text-gray-400">schedule</p>
              </Link>
              <a href="https://naver.me/FriLMXfa" target="_blank" rel="noopener noreferrer" className="text-center group">
                <div className="bg-gray-100 rounded-lg p-4 mb-2 group-hover:bg-green-50 transition-colors">
                  <img
                    src="https://cdn-icons-png.flaticon.com/128/854/854878.png"
                    alt="오시는길"
                    className="w-12 h-12 mx-auto"
                  />
                </div>
                <p className="text-sm font-medium text-gray-700">오시는길</p>
                <p className="text-xs text-gray-400">map</p>
              </a>
            </div>

            {/* 다가오는 일정 */}
            {isAuthenticated && user?.is_approved && upcomingEvents && upcomingEvents.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-green-800 text-white text-center py-3 font-bold">
                  다가오는 일정
                </div>
                <div className="p-4">
                  <ul className="space-y-3">
                    {upcomingEvents.slice(0, 3).map((event) => (
                      <li key={event.id}>
                        <Link
                          to={`/schedule/${event.id}`}
                          className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded"
                        >
                          <div className="bg-green-100 text-green-800 rounded px-3 py-1 text-center min-w-[60px]">
                            <div className="text-xs">
                              {new Date(event.start_date).toLocaleDateString('ko-KR', { month: 'short' })}
                            </div>
                            <div className="text-lg font-bold">
                              {new Date(event.start_date).getDate()}
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">{event.title}</p>
                            <p className="text-xs text-gray-500">{event.location}</p>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 비회원용 안내 */}
            {!isAuthenticated && (
              <div className="border border-green-200 bg-green-50 rounded-lg p-6 text-center">
                <h3 className="font-bold text-green-800 mb-2">회원 전용 서비스</h3>
                <p className="text-sm text-gray-600 mb-4">
                  로그인하시면 더 많은 서비스를<br />이용하실 수 있습니다.
                </p>
                <div className="space-y-2">
                  <Link to="/login" className="block w-full bg-green-700 text-white py-2 rounded hover:bg-green-800">
                    로그인
                  </Link>
                  <Link to="/register" className="block w-full border border-green-700 text-green-700 py-2 rounded hover:bg-green-100">
                    회원가입
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Popup Notices - positioned left of center */}
      {showPopup && visiblePopups.length > 0 && (
        <NoticePopup
          popups={visiblePopups}
          onClose={() => setShowPopup(false)}
          initialPosition={{
            x: Math.max(20, (window.innerWidth / 2) - (visibleEventPopups.length > 0 && showEventPopup ? 400 : 200)),
            y: 80,
          }}
        />
      )}

      {/* Popup Events - positioned right of notice popup */}
      {showEventPopup && visibleEventPopups.length > 0 && (
        <EventPopup
          events={visibleEventPopups}
          onClose={() => setShowEventPopup(false)}
          navigate={navigate}
          initialPosition={{
            x: Math.max(20, (window.innerWidth / 2) + (visiblePopups.length > 0 && showPopup ? 10 : -200)),
            y: 80,
          }}
        />
      )}
    </div>
  );
}
