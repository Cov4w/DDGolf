import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { noticesService } from '../../services/notices';
import Loading from '../../components/common/Loading';

export default function NoticeDetail() {
  const { id } = useParams<{ id: string }>();

  const { data: notice, isLoading } = useQuery({
    queryKey: ['notice', id],
    queryFn: () => noticesService.getNotice(Number(id)),
    enabled: !!id,
  });

  if (isLoading) return <Loading />;
  if (!notice) return <div className="text-center py-12">공지사항을 찾을 수 없습니다.</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link to="/notices" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
        &larr; 목록으로
      </Link>

      <article className="card">
        <header className="border-b pb-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            {notice.is_important && (
              <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                중요
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">{notice.title}</h1>
          <div className="flex gap-4 mt-4 text-sm text-gray-500">
            <span>작성자: {notice.author.username}</span>
            <span>조회: {notice.views}</span>
            <span>{new Date(notice.created_at).toLocaleDateString()}</span>
          </div>
        </header>

        <div className="prose max-w-none">
          <p className="whitespace-pre-wrap">{notice.content}</p>
        </div>
      </article>
    </div>
  );
}
