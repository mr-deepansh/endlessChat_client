import { apiClient } from './core/apiClient';
import type { ApiResponse } from '../types/api';

interface MediaUploadResponse {
  url: string;
  publicId: string;
  format: string;
  width?: number;
  height?: number;
  bytes: number;
}

class MediaService {
  /**
   * Upload single media file
   */
  async uploadMedia(file: File): Promise<ApiResponse<MediaUploadResponse>> {
    const formData = new FormData();
    formData.append('media', file);

    const response = await apiClient.post<MediaUploadResponse>('/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  /**
   * Upload multiple media files (max 10)
   */
  async uploadMultipleMedia(files: File[]): Promise<ApiResponse<MediaUploadResponse[]>> {
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('media', file);
    });

    const response = await apiClient.post<MediaUploadResponse[]>('/media/upload-multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  }

  /**
   * Delete media by public ID
   */
  async deleteMedia(publicId: string): Promise<ApiResponse<{ message: string }>> {
    const response = await apiClient.delete<{ message: string }>(`/media/${publicId}`);
    return response.data;
  }
}

export const mediaService = new MediaService();
export default mediaService;
