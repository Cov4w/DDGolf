import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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

export default function ScheduleDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: event, isLoading } = useQuery({
    queryKey: ['event', id],
    queryFn: () => scheduleService.getEvent(Number(id)),
    enabled: !!id,
  });

  const joinMutation = useMutation({
    mutationFn: () => scheduleService.joinEvent(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id] });
    },
  });

  const leaveMutation = useMutation({
    mutationFn: () => scheduleService.leaveEvent(Number(id)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['event', id] });
    },
  });

  if (isLoading) return <Loading />;
  if (!event) return <div className="text-center py-12">일정을 찾을 수 없습니다.</div>;

  const confirmedParticipants = event.participants?.filter(
    (p) => p.status === 'confirmed'
  ) || [];
  const isFull = event.max_participants > 0 && confirmedParticipants.length >= event.max_participants;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/schedule" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
        &larr; 목록으로
      </Link>

      <div className="card mb-8">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-sm text-primary-600 font-medium">
              {EVENT_TYPE_LABELS[event.event_type]}
            </span>
            <h1 className="text-2xl font-bold text-gray-900 mt-1">{event.title}</h1>
          </div>
          {user && !event.is_participating && !isFull && (
            <button
              onClick={() => joinMutation.mutate()}
              className="btn btn-primary"
              disabled={joinMutation.isPending}
            >
              참가 신청
            </button>
          )}
          {user && event.is_participating && (
            <button
              onClick={() => leaveMutation.mutate()}
              className="btn btn-secondary"
              disabled={leaveMutation.isPending}
            >
              참가 취소
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 gap-6 mt-6">
          <div>
            <h3 className="text-sm font-medium text-gray-500">일시</h3>
            <p className="mt-1">
              {new Date(event.start_date).toLocaleString('ko-KR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                weekday: 'long',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
            <p className="text-gray-500">
              ~ {new Date(event.end_date).toLocaleString('ko-KR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-500">장소</h3>
            <p className="mt-1">{event.location || '미정'}</p>
          </div>
        </div>

        {event.description && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2">상세 내용</h3>
            <p className="whitespace-pre-wrap">{event.description}</p>
          </div>
        )}

        <div className="mt-6 pt-6 border-t">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              참가자 ({confirmedParticipants.length}
              {event.max_participants > 0 && `/${event.max_participants}`}명)
            </h3>
            {isFull && (
              <span className="text-red-500 text-sm">마감</span>
            )}
          </div>
          {confirmedParticipants.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {confirmedParticipants.map((p) => (
                <span
                  key={p.id}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                >
                  {p.user.username}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">아직 참가자가 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}
