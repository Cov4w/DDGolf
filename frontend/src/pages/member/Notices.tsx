import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { noticesService } from '../../services/notices';
import { useAuthStore } from '../../store/authStore';
import Loading from '../../components/common/Loading';

export default function Notices() {
  const [page, setPage] = useState(1);
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const isInstructor = user?.role === 'instructor' && user?.is_approved && !!user?.assigned_club;

  // 공지 작성 폼 상태
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    is_important: false,
  });

  const { data, isLoading } = useQuery({
    queryKey: ['notices', page],
    queryFn: () => noticesService.getNotices(page),
  });

  const createMutation = useMutation({
    mutationFn: (data: { title: string; content: string; is_important: boolean }) =>
      noticesService.createNotice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notices'] });
      setShowForm(false);
      setFormData({ title: '', content: '', is_important: false });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) return;
    createMutation.mutate(formData);
  };

  if (isLoading) return <Loading />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">공지사항</h1>
        {isInstructor && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn btn-primary"
          >
            {showForm ? '취소' : '클럽 공지 작성'}
          </button>
        )}
      </div>

      {/* 클럽장 공지 작성 폼 */}
      {isInstructor && showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            클럽 공지 작성 {user?.assigned_club_name && `(${user.assigned_club_name})`}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="공지 제목을 입력하세요"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                rows={6}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="공지 내용을 입력하세요"
                required
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_important"
                checked={formData.is_important}
                onChange={(e) => setFormData({ ...formData, is_important: e.target.checked })}
                className="rounded border-gray-300"
              />
              <label htmlFor="is_important" className="text-sm text-gray-700">중요 공지</label>
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="btn btn-primary disabled:opacity-50"
              >
                {createMutation.isPending ? '등록 중...' : '등록'}
              </button>
            </div>
          </div>
        </form>
      )}

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
                        {notice.club_name && (
                          <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded">
                            {notice.club_name}
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
