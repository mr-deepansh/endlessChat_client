import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v2';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('accessToken') || localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken') || localStorage.getItem('refresh_token');
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
            refreshToken,
          });

          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('auth_token', accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Error handling utility
export const withErrorHandling = <T>(fn: () => Promise<T>) => fn();

// Export api response type
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// Follow/Unfollow API methods
export const followUser = async (userId: string): Promise<ApiResponse> => {
  const response = await api.post(`/users/${userId}/follow`);
  return response.data;
};

export const unfollowUser = async (userId: string): Promise<ApiResponse> => {
  const response = await api.delete(`/users/${userId}/follow`);
  return response.data;
};

export const getFollowers = async (userId: string): Promise<ApiResponse> => {
  const response = await api.get(`/users/${userId}/followers`);
  return response.data;
};

export const getFollowing = async (userId: string): Promise<ApiResponse> => {
  const response = await api.get(`/users/${userId}/following`);
  return response.data;
};

export const getUserProfile = async (userId: string): Promise<ApiResponse> => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

export { api };
export default api;
