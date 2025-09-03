import { blogsApi } from './core/serviceClients';

export const uploadService = {
  uploadFiles: async (files: File[]): Promise<string[]> => {
    const formData = new FormData();

    files.forEach(file => {
      formData.append('files', file);
    });

    const response = await blogsApi.post('/blogs/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.urls || [];
  },
};
