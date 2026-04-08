import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { scheduleService } from '../../services/schedule';
import { useAuthStore } from '../../store/authStore';
import Loading from '../../components/common/Loading';

const EVENT_TYPE_LABELS: Record<string, string> = {
  match: '정기 경기',
  tournament: '토너먼트',
  practice: '연습',
  meeting: '모임',
  other: '기타',
};

const EVENT_TYPE_COLORS: Record<string, string> = {
  match: 'bg-green-100 text-green-800',
  tournament: 'bg-purple-100 text-purple-800',
  practice: 'bg-blue-100 text-blue-800',
  meeting: 'bg-yellow-100 text-yellow-800',
  other: 'bg-gray-100 text-gray-800',
};

export default function Schedule() {
  const [page, setPage] = useState(1);
  const { isAuthenticated, user } = useAuthStore();
  const isApproved = isAuthenticated && user?.is_approved;

  const { data, isLoading } = useQuery({
    queryKey: ['events', page, isApproved ? 'member' : 'public'],
    queryFn: () =>
      isApproved
        ? scheduleService.getEvents(page)
        : scheduleService.getPublicEvents(page),
  });

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">경기 일정</h1>

      {!isApproved && (
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center gap-3">
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-blue-700">
            {isAuthenticated
              ? '회원 승인 후 더 많은 일정을 확인하고 참가 신청할 수 있습니다.'
              : <>
                  <Link to="/login" className="font-semibold underline hover:text-blue-900">로그인</Link>하면 더 많은 일정을 확인하고 참가 신청할 수 있습니다.
                </>
            }
          </p>
        </div>
      )}

      {data && data.results.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.results.map((event) => (
              <Link
                key={event.id}
                to={`/schedule/${event.id}`}
                className="card hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start gap-4">
                  <div className="bg-primary-100 text-primary-600 rounded-lg p-3 text-center min-w-[70px]">
                    <div className="text-sm">
                      {new Date(event.start_date).toLocaleDateString('ko-KR', { month: 'short' })}
                    </div>
                    <div className="text-2xl font-bold">
                      {new Date(event.start_date).getDate()}
                    </div>
                    <div className="text-xs">
                      {new Date(event.start_date).toLocaleDateString('ko-KR', { weekday: 'short' })}
                    </div>
                  </div>
                  <div className="flex-1">
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${EVENT_TYPE_COLORS[event.event_type]}`}
                    >
                      {EVENT_TYPE_LABELS[event.event_type]}
                    </span>
                    <h2 className="font-semibold mt-1">{event.title}</h2>
                    <p className="text-gray-500 text-sm mt-1">{event.location}</p>
                    <div className="text-sm text-gray-500 mt-2">
                      참가: {event.participant_count}
                      {event.max_participants > 0 && `/${event.max_participants}`}명
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex justify-center mt-8 gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!data.previous}
              className="btn btn-secondary disabled:opacity-50"
            >
              이전
            </button>
            <span className="px-4 py-2 text-gray-600">
              {page} 페이지
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!data.next}
              className="btn btn-secondary disabled:opacity-50"
            >
              다음
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          등록된 일정이 없습니다.
        </div>
      )}
    </div>
  );
}
