import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { noticesService } from '../../services/notices';
import Loading from '../../components/common/Loading';

export default function Notices() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['notices', page],
    queryFn: () => noticesService.getNotices(page),
  });

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">공지사항</h1>

      {data && data.results.length > 0 ? (
        <>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제목
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작성자
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    조회
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작성일
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.results.map((notice) => (
                  <tr
                    key={notice.id}
                    className={`hover:bg-gray-50 ${notice.is_important ? 'bg-yellow-50' : ''}`}
                  >
                    <td className="px-6 py-4">
                      <Link
                        to={`/notices/${notice.id}`}
                        className="text-gray-900 hover:text-primary-600 flex items-center gap-2"
                      >
                        {notice.is_important && (
                          <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                            중요
                          </span>
                        )}
                        {notice.title}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {notice.author.username}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {notice.views}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(notice.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
          등록된 공지사항이 없습니다.
        </div>
      )}
    </div>
  );
}
