import api from './api';
import type { Album, Photo, PaginatedResponse } from '../types';

export const galleryService = {
  getAlbums: async (page = 1, publicOnly = false): Promise<PaginatedResponse<Album>> => {
    const params = new URLSearchParams({ page: page.toString() });
    if (publicOnly) {
      params.append('public', 'true');
    }
    const response = await api.get(`/gallery/albums/?${params}`);
    return response.data;
  },

  getAlbum: async (id: number): Promise<Album> => {
    const response = await api.get(`/gallery/albums/${id}/`);
    return response.data;
  },

  createAlbum: async (data: FormData): Promise<Album> => {
    const response = await api.post('/gallery/albums/', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  updateAlbum: async (id: number, data: Partial<Album>): Promise<Album> => {
    const response = await api.patch(`/gallery/albums/${id}/`, data);
    return response.data;
  },

  deleteAlbum: async (id: number): Promise<void> => {
    await api.delete(`/gallery/albums/${id}/`);
  },

  addPhoto: async (albumId: number, data: FormData): Promise<Photo> => {
    const response = await api.post(`/gallery/albums/${albumId}/add_photo/`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  deletePhoto: async (albumId: number, photoId: number): Promise<void> => {
    await api.delete(`/gallery/albums/${albumId}/photos/${photoId}/`);
  },
};
