import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';

// API base URL from .env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // ensures cookies are sent
});

// ✅ Request interceptor (no Authorization header needed)
api.interceptors.request.use(
  config => {
    config.withCredentials = true; // redundant safety line
    return config;
  },
  error => Promise.reject(error)
);

// ✅ Response interceptor (cookie-based refresh handling)
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // If Access Token expired — backend will respond 401
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Call backend refresh endpoint — this uses the refreshToken cookie
        await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, { withCredentials: true });

        // After successful refresh, retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// ✅ Error handling utility
export const withErrorHandling = <T>(fn: () => Promise<T>) => fn();

// ✅ Response type
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

// ✅ User actions
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
