import api from './api';
import type { ChatRoom, Message, User, ClubMembershipRequest, ClubListItem, ClubImage } from '../types';

const WS_BASE_URL = import.meta.env.VITE_WS_URL || `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/ws`;

export interface ChatInvitation {
  id: number;
  room: {
    id: number;
    name: string;
    description: string;
    is_public: boolean;
  };
  user: User;
  invited_by: User;
  status: string;
  status_display: string;
  created_at: string;
  responded_at: string | null;
}

export const messengerService = {
  getChatRooms: async (): Promise<ChatRoom[]> => {
    const response = await api.get('/messenger/rooms/');
    // 페이지네이션된 응답 처리
    return response.data.results || response.data;
  },

  getChatRoom: async (id: number): Promise<ChatRoom> => {
    const response = await api.get(`/messenger/rooms/${id}/`);
    return response.data;
  },

  createChatRoom: async (data: Partial<ChatRoom> & { member_ids?: number[] }): Promise<ChatRoom> => {
    const response = await api.post('/messenger/rooms/', data);
    return response.data;
  },

  getMessages: async (roomId: number): Promise<Message[]> => {
    const response = await api.get(`/messenger/rooms/${roomId}/messages/`);
    return response.data;
  },

  sendMessage: async (roomId: number, content: string): Promise<Message> => {
    const response = await api.post(`/messenger/rooms/${roomId}/send_message/`, { content });
    return response.data;
  },

  markAsRead: async (roomId: number): Promise<void> => {
    await api.post(`/messenger/rooms/${roomId}/mark_read/`);
  },

  inviteMembers: async (roomId: number, userIds: number[]): Promise<void> => {
    await api.post(`/messenger/rooms/${roomId}/invite/`, { user_ids: userIds });
  },

  leaveRoom: async (roomId: number): Promise<void> => {
    await api.post(`/messenger/rooms/${roomId}/leave/`);
  },

  // 알림 토글
  toggleNotification: async (roomId: number): Promise<{ notification_enabled: boolean }> => {
    const response = await api.post(`/messenger/rooms/${roomId}/toggle_notification/`);
    return response.data;
  },

  // 초대 가능한 사용자 검색
  searchAvailableUsers: async (roomId: number, search: string): Promise<User[]> => {
    const response = await api.get(`/messenger/rooms/${roomId}/available_users/`, {
      params: { search }
    });
    return response.data;
  },

  // 초대장 목록
  getInvitations: async (): Promise<ChatInvitation[]> => {
    const response = await api.get('/messenger/invitations/');
    return response.data.results || response.data;
  },

  // 초대 수락
  acceptInvitation: async (invitationId: number): Promise<{ room_id: number }> => {
    const response = await api.post(`/messenger/invitations/${invitationId}/accept/`);
    return response.data;
  },

  // 초대 거절
  rejectInvitation: async (invitationId: number): Promise<void> => {
    await api.post(`/messenger/invitations/${invitationId}/reject/`);
  },

  // 전체 안읽은 수
  getTotalUnread: async (): Promise<{ total_unread: number; pending_invitations: number }> => {
    const response = await api.get('/messenger/unread/');
    return response.data;
  },

  // 채팅방 삭제
  deleteChatRoom: async (roomId: number): Promise<void> => {
    await api.delete(`/messenger/rooms/${roomId}/`);
  },

  // 채팅 기록 삭제 (채팅방 유지)
  clearMessages: async (roomId: number): Promise<{ message: string; deleted_count: number }> => {
    const response = await api.post(`/messenger/rooms/${roomId}/clear_messages/`);
    return response.data;
  },

  // 제재 상태 확인
  getMyBanStatus: async (roomId: number): Promise<{
    is_banned: boolean;
    ban_type?: string;
    ban_type_display?: string;
    reason?: string;
    expires_at?: string;
  }> => {
    const response = await api.get(`/messenger/rooms/${roomId}/my_ban_status/`);
    return response.data;
  },

  // 클럽 목록 (가입/탈퇴용)
  getClubList: async (): Promise<ClubListItem[]> => {
    const response = await api.get('/messenger/rooms/club_list/');
    return response.data;
  },

  // 클럽 가입 요청
  requestJoinClub: async (roomId: number): Promise<ClubMembershipRequest> => {
    const response = await api.post('/messenger/club-requests/request-join/', { room_id: roomId });
    return response.data;
  },

  // 클럽 탈퇴 요청
  requestLeaveClub: async (roomId: number): Promise<ClubMembershipRequest> => {
    const response = await api.post('/messenger/club-requests/request-leave/', { room_id: roomId });
    return response.data;
  },

  // 내 요청 이력
  getMyClubRequests: async (): Promise<ClubMembershipRequest[]> => {
    const response = await api.get('/messenger/club-requests/my-requests/');
    return response.data;
  },

  // 클럽장: 대기 요청 목록
  getPendingClubRequests: async (): Promise<ClubMembershipRequest[]> => {
    const response = await api.get('/messenger/club-requests/pending-requests/');
    return response.data;
  },

  // 클럽장: 대기 요청 수
  getPendingClubRequestCount: async (): Promise<{ count: number }> => {
    const response = await api.get('/messenger/club-requests/pending-count/');
    return response.data;
  },

  // 클럽장: 요청 승인
  approveClubRequest: async (requestId: number): Promise<void> => {
    await api.post(`/messenger/club-requests/${requestId}/approve/`);
  },

  // 클럽장: 요청 거절
  rejectClubRequest: async (requestId: number): Promise<void> => {
    await api.post(`/messenger/club-requests/${requestId}/reject/`);
  },

  // 클럽장: 내 클럽 멤버 목록
  getClubMembers: async (): Promise<User[]> => {
    const response = await api.get('/messenger/club-requests/club-members/');
    return response.data;
  },

  // 클럽장: 추가 가능한 회원 검색
  searchAvailableMembers: async (search: string): Promise<User[]> => {
    const response = await api.get('/messenger/club-requests/available-members/', {
      params: { search },
    });
    return response.data;
  },

  // 클럽장: 멤버 직접 추가
  addClubMember: async (userId: number): Promise<{ message: string }> => {
    const response = await api.post('/messenger/club-requests/add-member/', { user_id: userId });
    return response.data;
  },

  // 클럽장: 멤버 제거
  removeClubMember: async (userId: number): Promise<{ message: string }> => {
    const response = await api.post('/messenger/club-requests/remove-member/', { user_id: userId });
    return response.data;
  },

  // 클럽 이미지 목록
  getClubImages: async (roomId: number): Promise<ClubImage[]> => {
    const response = await api.get(`/messenger/rooms/${roomId}/club_images/`);
    return response.data;
  },

  // 클럽 이미지 추가
  addClubImage: async (roomId: number, data: FormData): Promise<ClubImage> => {
    const response = await api.post(`/messenger/rooms/${roomId}/add_club_image/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // 클럽 이미지 삭제
  deleteClubImage: async (roomId: number, imageId: number): Promise<void> => {
    await api.delete(`/messenger/rooms/${roomId}/club_images/${imageId}/`);
  },

  // 클럽 이미지 수정 (설명)
  updateClubImage: async (roomId: number, imageId: number, data: { caption: string }): Promise<ClubImage> => {
    const response = await api.patch(`/messenger/rooms/${roomId}/club_images/${imageId}/update/`, data);
    return response.data;
  },

  // 클럽 소개글 수정
  updateClubInfo: async (roomId: number, data: { description: string }): Promise<{ description: string }> => {
    const response = await api.patch(`/messenger/rooms/${roomId}/update_info/`, data);
    return response.data;
  },

  // 클럽 아이콘 설정
  setClubIcon: async (roomId: number, data: FormData): Promise<{ icon: string | null }> => {
    const response = await api.post(`/messenger/rooms/${roomId}/set_icon/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // WebSocket 연결
  connectWebSocket: (roomId: number, onMessage: (message: Message) => void): WebSocket => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    const ws = new WebSocket(`${WS_BASE_URL}/chat/${roomId}/?token=${token}`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      onMessage(message);
    };

    return ws;
  },
};
