import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { noticesService } from '../../services/notices';
import Loading from '../../components/common/Loading';

export default function PublicNoticeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: notice, isLoading, error } = useQuery({
    queryKey: ['publicNotice', id],
    queryFn: () => noticesService.getPublicNotice(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return <Loading />;

  if (error || !notice) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">공지사항을 찾을 수 없습니다.</p>
          <Link to="/public-notices" className="text-green-600 hover:text-green-700">
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <article className="bg-white rounded-lg shadow overflow-hidden">
        {/* 헤더 */}
        <div className="px-6 py-8 border-b border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            {notice.is_important && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded">
                중요
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{notice.title}</h1>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span>작성자: {notice.author?.username || '관리자'}</span>
            <span>조회수: {notice.views}</span>
            <span>작성일: {new Date(notice.created_at).toLocaleDateString()}</span>
          </div>
        </div>

        {/* 내용 */}
        <div className="px-6 py-8">
          <div className="prose max-w-none whitespace-pre-wrap">
            {notice.content}
          </div>
        </div>
      </article>

      {/* 하단 버튼 */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={() => navigate(-1)}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          ← 이전
        </button>
        <Link
          to="/public-notices"
          className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          목록
        </Link>
      </div>
    </div>
  );
}
