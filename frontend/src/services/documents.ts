import api from './api';
import type { DocumentCategory, Document, PaginatedResponse } from '../types';

export const documentsService = {
  getCategories: async (): Promise<DocumentCategory[]> => {
    const response = await api.get('/documents/categories/');
    return response.data;
  },

  getDocuments: async (page = 1, categoryId?: number): Promise<PaginatedResponse<Document>> => {
    const params = new URLSearchParams({ page: page.toString() });
    if (categoryId) params.append('category', categoryId.toString());
    const response = await api.get(`/documents/items/?${params}`);
    return response.data;
  },

  createCategory: async (data: { name: string; order?: number }): Promise<DocumentCategory> => {
    const response = await api.post('/documents/categories/', data);
    return response.data;
  },

  updateCategory: async (id: number, data: { name: string; order?: number }): Promise<DocumentCategory> => {
    const response = await api.patch(`/documents/categories/${id}/`, data);
    return response.data;
  },

  deleteCategory: async (id: number): Promise<void> => {
    await api.delete(`/documents/categories/${id}/`);
  },

  createDocument: async (data: FormData): Promise<Document> => {
    const response = await api.post('/documents/items/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateDocument: async (id: number, data: FormData): Promise<Document> => {
    const response = await api.patch(`/documents/items/${id}/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deleteDocument: async (id: number): Promise<void> => {
    await api.delete(`/documents/items/${id}/`);
  },

  setThumbnail: async (docId: number, fileId: number | null): Promise<Document> => {
    const response = await api.post(`/documents/items/${docId}/set_thumbnail/`, { file_id: fileId });
    return response.data;
  },

  deleteFile: async (docId: number, fileId: number): Promise<Document> => {
    const response = await api.delete(`/documents/items/${docId}/delete_file/${fileId}/`);
    return response.data;
  },

  getDownloadUrl: (docId: number, fileId: number): string => {
    return `${import.meta.env.VITE_API_URL || '/api'}/documents/items/${docId}/download/${fileId}/`;
  },
};
