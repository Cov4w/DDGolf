import api from './api';
import type { Notice, PaginatedResponse } from '../types';

export const noticesService = {
  // 회원용 공지사항 (로그인 필요)
  getNotices: async (page = 1): Promise<PaginatedResponse<Notice>> => {
    const response = await api.get(`/notices/?page=${page}`);
    return response.data;
  },

  getNotice: async (id: number): Promise<Notice> => {
    const response = await api.get(`/notices/${id}/`);
    return response.data;
  },

  createNotice: async (data: Partial<Notice>): Promise<Notice> => {
    const response = await api.post('/notices/', data);
    return response.data;
  },

  updateNotice: async (id: number, data: Partial<Notice>): Promise<Notice> => {
    const response = await api.patch(`/notices/${id}/`, data);
    return response.data;
  },

  deleteNotice: async (id: number): Promise<void> => {
    await api.delete(`/notices/${id}/`);
  },

  // 공개 공지사항 (로그인 불필요)
  getPublicNotices: async (page = 1): Promise<PaginatedResponse<Notice>> => {
    const response = await api.get(`/notices/public/?page=${page}`);
    return response.data;
  },

  getPublicNotice: async (id: number): Promise<Notice> => {
    const response = await api.get(`/notices/public/${id}/`);
    return response.data;
  },
};
