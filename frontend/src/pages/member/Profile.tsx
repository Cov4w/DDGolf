import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/auth';
import { messengerService } from '../../services/messenger';

type EditMode = 'none' | 'verify' | 'edit' | 'password';

export default function Profile() {
  const { user, setUser, fetchProfile } = useAuthStore();
  const queryClient = useQueryClient();

  // 페이지 진입 시 최신 프로필 갱신 (assigned_club 반영)
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const [editMode, setEditMode] = useState<EditMode>('none');
  const [verifyPassword, setVerifyPassword] = useState('');
  const [formData, setFormData] = useState({
    username: user?.username || '',
    phone: user?.phone || '',
  });
  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
    new_password2: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [verifyError, setVerifyError] = useState('');

  // 전화번호 포맷팅
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  // 비밀번호 확인
  const verifyMutation = useMutation({
    mutationFn: (password: string) => authService.verifyPassword(password),
    onSuccess: () => {
      setVerifyError('');
      setVerifyPassword('');
      setEditMode('edit');
    },
    onError: () => {
      setVerifyError('비밀번호가 일치하지 않습니다.');
    },
  });

  // 프로필 수정
  const updateMutation = useMutation({
    mutationFn: (data: { username?: string; phone?: string }) =>
      authService.updateProfile(data),
    onSuccess: (updatedUser) => {
      setUser(updatedUser);
      setEditMode('none');
      setMessage({ type: 'success', text: '프로필이 업데이트되었습니다.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    },
    onError: () => {
      setMessage({ type: 'error', text: '프로필 수정에 실패했습니다.' });
    },
  });

  // 비밀번호 변경
  const changePasswordMutation = useMutation({
    mutationFn: (data: { current_password: string; new_password: string; new_password2: string }) =>
      authService.changePassword(data),
    onSuccess: () => {
      setEditMode('none');
      setPasswordData({ current_password: '', new_password: '', new_password2: '' });
      setMessage({ type: 'success', text: '비밀번호가 변경되었습니다.' });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { error?: string } } };
      setMessage({ type: 'error', text: error.response?.data?.error || '비밀번호 변경에 실패했습니다.' });
    },
  });

  // 클럽 관련
  const { data: clubList } = useQuery({
    queryKey: ['clubList'],
    queryFn: () => messengerService.getClubList(),
    enabled: !!user?.is_approved,
  });

  const joinClubMutation = useMutation({
    mutationFn: (roomId: number) => messengerService.requestJoinClub(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubList'] });
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { error?: string } } };
      alert(error.response?.data?.error || '가입 요청에 실패했습니다.');
    },
  });

  const leaveClubMutation = useMutation({
    mutationFn: (roomId: number) => messengerService.requestLeaveClub(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubList'] });
    },
    onError: (err: unknown) => {
      const error = err as { response?: { data?: { error?: string } } };
      alert(error.response?.data?.error || '탈퇴 요청에 실패했습니다.');
    },
  });

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyPassword) {
      setVerifyError('비밀번호를 입력해주세요.');
      return;
    }
    verifyMutation.mutate(verifyPassword);
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateMutation.mutate(formData);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.new_password2) {
      setMessage({ type: 'error', text: '새 비밀번호가 일치하지 않습니다.' });
      return;
    }
    if (passwordData.new_password.length < 8) {
      setMessage({ type: 'error', text: '비밀번호는 8자 이상이어야 합니다.' });
      return;
    }
    changePasswordMutation.mutate(passwordData);
  };

  const handleCancel = () => {
    setEditMode('none');
    setVerifyPassword('');
    setVerifyError('');
    setFormData({ username: user?.username || '', phone: user?.phone || '' });
    setPasswordData({ current_password: '', new_password: '', new_password2: '' });
  };

  if (!user) return null;

  // 소셜 로그인 사용자인지 확인
  const isSocialUser = !!user.social_provider;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">프로필</h1>

      {message.text && (
        <div className={`mb-4 p-3 rounded-lg ${
          message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="card">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 text-3xl font-bold">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-xl font-semibold">{user.username}</h2>
            <p className="text-gray-500">{user.email}</p>
            <div className="flex gap-2 mt-2">
              <span
                className={`text-xs px-2 py-0.5 rounded ${
                  user.is_approved
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}
              >
                {user.is_approved ? '승인됨' : '승인 대기'}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-700">
                {user.role === 'admin' ? '관리자' : user.role === 'instructor' ? '클럽장' : '회원'}
              </span>
              {isSocialUser && (
                <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                  Google 계정
                </span>
              )}
            </div>
          </div>
        </div>

        {/* 비밀번호 확인 모달 */}
        {editMode === 'verify' && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
              <h3 className="text-lg font-bold mb-4">비밀번호 확인</h3>
              <p className="text-sm text-gray-600 mb-4">
                프로필을 수정하려면 현재 비밀번호를 입력해주세요.
              </p>
              <form onSubmit={handleVerifySubmit}>
                <input
                  type="password"
                  value={verifyPassword}
                  onChange={(e) => setVerifyPassword(e.target.value)}
                  placeholder="현재 비밀번호"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-2 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                  autoFocus
                />
                {verifyError && (
                  <p className="text-red-500 text-sm mb-2">{verifyError}</p>
                )}
                <div className="flex gap-2 mt-4">
                  <button
                    type="submit"
                    disabled={verifyMutation.isPending}
                    className="flex-1 bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 disabled:opacity-50"
                  >
                    {verifyMutation.isPending ? '확인 중...' : '확인'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
                  >
                    취소
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* 프로필 수정 폼 */}
        {editMode === 'edit' && (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름
              </label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                전화번호
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="010-0000-0000"
              />
            </div>
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 disabled:opacity-50"
              >
                {updateMutation.isPending ? '저장 중...' : '저장'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
            </div>
          </form>
        )}

        {/* 비밀번호 변경 폼 */}
        {editMode === 'password' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                현재 비밀번호
              </label>
              <input
                type="password"
                value={passwordData.current_password}
                onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                새 비밀번호
              </label>
              <input
                type="password"
                value={passwordData.new_password}
                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="8자 이상"
                required
                minLength={8}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                새 비밀번호 확인
              </label>
              <input
                type="password"
                value={passwordData.new_password2}
                onChange={(e) => setPasswordData({ ...passwordData, new_password2: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                required
              />
              {passwordData.new_password2 && (
                <p className={`mt-1 text-sm ${
                  passwordData.new_password === passwordData.new_password2
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  {passwordData.new_password === passwordData.new_password2
                    ? '✓ 비밀번호가 일치합니다'
                    : '✗ 비밀번호가 일치하지 않습니다'}
                </p>
              )}
            </div>
            <div className="flex gap-2 pt-4">
              <button
                type="submit"
                disabled={changePasswordMutation.isPending}
                className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800 disabled:opacity-50"
              >
                {changePasswordMutation.isPending ? '변경 중...' : '비밀번호 변경'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="border border-gray-300 px-6 py-2 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
            </div>
          </form>
        )}

        {/* 기본 프로필 보기 */}
        {editMode === 'none' && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">이름</label>
              <p className="mt-1">{user.username}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">이메일</label>
              <p className="mt-1">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">전화번호</label>
              <p className="mt-1">{user.phone || '-'}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">가입일</label>
              <p className="mt-1">{new Date(user.created_at).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2 pt-4">
              <button
                onClick={() => setEditMode('edit')}
                className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800"
              >
                프로필 수정
              </button>
              {!isSocialUser && (
                <button
                  onClick={() => setEditMode('password')}
                  className="border border-green-700 text-green-700 px-6 py-2 rounded-lg hover:bg-green-50"
                >
                  비밀번호 변경
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* 클럽 섹션 */}
      {user.is_approved && (
        <div className="card mt-6">
          <h2 className="text-lg font-semibold mb-4">클럽</h2>

          {/* 현재 소속 클럽 */}
          {user.assigned_club_name ? (
            <div className="mb-4 p-3 bg-green-50 rounded-lg">
              <div className="text-sm text-gray-500">현재 소속 클럽</div>
              <div className="font-medium text-green-800">{user.assigned_club_name}</div>
            </div>
          ) : (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-500">소속 클럽이 없습니다.</div>
            </div>
          )}

          {/* 전체 클럽 목록 */}
          <h3 className="text-sm font-medium text-gray-700 mb-2">전체 클럽 목록</h3>
          {clubList && clubList.length > 0 ? (
            <div className="space-y-2">
              {clubList.map((club) => (
                <div key={club.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                  <div>
                    <div className="font-medium">{club.name}</div>
                    <div className="text-sm text-gray-500">{club.member_count}명</div>
                  </div>
                  <div>
                    {club.pending_request ? (
                      <span className={`text-xs px-3 py-1.5 rounded-lg ${
                        club.pending_request.request_type === 'join'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {club.pending_request.request_type === 'join' ? '가입 요청 중' : '탈퇴 요청 중'}
                      </span>
                    ) : club.is_member ? (
                      <button
                        onClick={() => {
                          if (window.confirm(`${club.name} 클럽 탈퇴를 요청하시겠습니까?`)) {
                            leaveClubMutation.mutate(club.id);
                          }
                        }}
                        disabled={leaveClubMutation.isPending}
                        className="px-3 py-1.5 text-sm border border-orange-300 text-orange-600 rounded-lg hover:bg-orange-50 disabled:opacity-50"
                      >
                        탈퇴 요청
                      </button>
                    ) : user.assigned_club ? (
                      <span className="text-xs text-gray-400">
                        기존 클럽 탈퇴 후 가입 가능
                      </span>
                    ) : (
                      <button
                        onClick={() => joinClubMutation.mutate(club.id)}
                        disabled={joinClubMutation.isPending}
                        className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                      >
                        가입 요청
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-gray-500">등록된 클럽이 없습니다.</div>
          )}
        </div>
      )}
    </div>
  );
}
