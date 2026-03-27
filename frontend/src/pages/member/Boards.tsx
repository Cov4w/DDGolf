import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { boardsService } from '../../services/boards';
import Loading from '../../components/common/Loading';
import { useAuthStore } from '../../store/authStore';

export default function Boards() {
  const [page, setPage] = useState(1);
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['posts', page],
    queryFn: () => boardsService.getPosts(page),
  });

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">회원 게시판</h1>
        {user && (
          <Link to="/boards/new" className="btn btn-primary">
            글쓰기
          </Link>
        )}
      </div>

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
                {data.results.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link
                        to={`/boards/${post.id}`}
                        className="text-gray-900 hover:text-primary-600 flex items-center gap-2"
                      >
                        {post.title}
                        {post.thumbnail && (
                          <span className="text-primary-600 text-sm">📷</span>
                        )}
                        {(post.comment_count ?? 0) > 0 && (
                          <span className="text-primary-600 text-sm">
                            [{post.comment_count}]
                          </span>
                        )}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {post.author.username}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {post.views}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(post.created_at).toLocaleDateString()}
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
          등록된 게시글이 없습니다.
        </div>
      )}
    </div>
  );
}
