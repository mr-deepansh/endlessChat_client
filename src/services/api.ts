import axios, { AxiosResponse, AxiosError } from 'axios';
import { toast } from '@/hooks/use-toast';
import ENV from '@/config/environment';

// API Configuration
const API_CONFIG = {
  baseURL: ENV.API_BASE_URL,
  timeout: 15000,
  retryAttempts: 3,
  retryDelay: 1000,
};

// Environment validation
if (!ENV.API_BASE_URL && ENV.IS_DEVELOPMENT) {
  console.warn('⚠️ VITE_API_BASE_URL not set, using default:', API_CONFIG.baseURL);
}

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Handle 401 errors (unauthorized)
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // Handle network errors with retry logic
    if (!error.response && originalRequest._retryCount < API_CONFIG.retryAttempts) {
      originalRequest._retryCount = (originalRequest._retryCount || 0) + 1;
      
      await new Promise(resolve => 
        setTimeout(resolve, API_CONFIG.retryDelay * originalRequest._retryCount)
      );
      
      return apiClient(originalRequest);
    }

    return Promise.reject(error);
  }
);

// Generic API methods
export const api = {
  // GET request
  get: async <T>(url: string, config?: any): Promise<T> => {
    const response = await apiClient.get<T>(url, config);
    return response.data;
  },

  // POST request
  post: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await apiClient.post<T>(url, data, config);
    return response.data;
  },

  // PUT request
  put: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await apiClient.put<T>(url, data, config);
    return response.data;
  },

  // PATCH request
  patch: async <T>(url: string, data?: any, config?: any): Promise<T> => {
    const response = await apiClient.patch<T>(url, data, config);
    return response.data;
  },

  // DELETE request
  delete: async <T>(url: string, config?: any): Promise<T> => {
    const response = await apiClient.delete<T>(url, config);
    return response.data;
  },

  // Upload file
  upload: async <T>(url: string, formData: FormData, config?: any): Promise<T> => {
    const response = await apiClient.post<T>(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config?.headers,
      },
    });
    return response.data;
  },
};

// Helper functions
export const handleApiError = (error: any, defaultMessage: string = 'An error occurred') => {
  const message = (error as any)?.response?.data?.message || (error as any)?.message || defaultMessage;
  console.error('API Error:', message);
  throw error;
};

export const withErrorHandling = async <T>(
  apiCall: () => Promise<T>,
  errorMessage?: string
): Promise<T> => {
  try {
    return await apiCall();
  } catch (error: any) {
    // Only log errors in production or for non-404 errors
    if (ENV.IS_PRODUCTION || (error.response?.status !== 404 && ENV.ENABLE_DEBUG)) {
      console.error('API call failed:', errorMessage || 'Unknown error', error);
    }
    throw error;
  }
};

export default apiClient;