import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { ApiResponse, ApiError } from '../../types/api';
import { config } from '../../config/environment';
import { requestQueue } from '../../utils/requestQueue';

class ApiClient {
  private instance: AxiosInstance;
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = config.apiBaseUrl) {
    this.baseURL = baseURL;

    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: config.performance.requestTimeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Remove any problematic headers that might cause CORS issues
    delete this.instance.defaults.headers.common['accept-version'];
    delete this.instance.defaults.headers.common['Accept-Version'];

    this.setupInterceptors();
    this.loadTokenFromStorage();

    // Ensure token is set on instance creation
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      config => {
        // Always check for token from storage
        const token =
          this.token || localStorage.getItem('auth_token') || localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          if (!this.token) {
            this.token = token; // Update instance token
          }
        }

        // Add request timestamp for performance monitoring
        config.metadata = { startTime: new Date() };

        // Ensure proper JSON serialization
        if (
          config.data &&
          typeof config.data === 'string' &&
          config.headers['Content-Type'] === 'application/json'
        ) {
          try {
            // If data is already a JSON string, parse and re-stringify to ensure it's valid
            config.data = JSON.parse(config.data);
          } catch (e) {
            // If parsing fails, it might be a malformed string, so wrap it properly
            console.warn('Invalid JSON string detected, attempting to fix:', config.data);
          }
        }
        return config;
      },
      error => Promise.reject(error)
    );

    // Response interceptor
    this.instance.interceptors.response.use(
      (response: AxiosResponse) => {
        // Calculate request duration
        const endTime = new Date();
        const duration = endTime.getTime() - response.config.metadata?.startTime?.getTime();

        // Log performance metrics in development
        if (config.isDevelopment && config.features.enableDebug) {
          console.log(
            `API Request: ${response.config.method?.toUpperCase()} ${response.config.url} - ${duration}ms`
          );
        }

        return response;
      },
      async error => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            await this.refreshToken();
            return this.instance(originalRequest);
          } catch (refreshError) {
            this.clearAuth();
            window.location.href = '/login';
            return Promise.reject(refreshError);
          }
        }

        // Handle rate limiting (429)
        if (error.response?.status === 429) {
          const rateLimitError: ApiError = {
            code: 'RATE_LIMIT_ERROR',
            message: 'Too many requests. Please try again later.',
            timestamp: new Date().toISOString(),
          };

          // Notify rate limit context if available
          if (typeof window !== 'undefined') {
            // Dispatch a custom event that the rate limit context can listen to
            window.dispatchEvent(
              new CustomEvent('rateLimitExceeded', {
                detail: { timestamp: Date.now() },
              })
            );
          }

          return Promise.reject(rateLimitError);
        }

        // Handle network errors
        if (!error.response) {
          const networkError: ApiError = {
            code: 'NETWORK_ERROR',
            message: 'Network connection failed. Please check your internet connection.',
            timestamp: new Date().toISOString(),
          };
          return Promise.reject(networkError);
        }

        // Transform error response
        const apiError: ApiError = {
          code: error.response.data?.code || 'API_ERROR',
          message: error.response.data?.message || 'An unexpected error occurred',
          details: error.response.data?.details,
          timestamp: new Date().toISOString(),
        };

        return Promise.reject(apiError);
      }
    );
  }

  private loadTokenFromStorage(): void {
    const token = localStorage.getItem('auth_token') || localStorage.getItem('accessToken');
    if (token) {
      this.setToken(token);
    }
  }

  public setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
    localStorage.setItem('accessToken', token); // Also store as accessToken for compatibility
    // Update default headers immediately
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('🔑 Token set in API client:', token.substring(0, 20) + '...');
  }

  public clearAuth(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refresh_token');
    // Remove authorization header
    delete this.instance.defaults.headers.common['Authorization'];
  }

  private async refreshToken(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${this.baseURL}/auth/refresh`, {
      refreshToken,
    });

    const { token } = response.data.data;
    this.setToken(token);
  }

  // Generic request methods with rate limiting protection
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const requestKey = `GET_${url}_${JSON.stringify(config?.params || {})}`;
    return requestQueue.add(async () => {
      const response = await this.instance.get(url, config);
      return response.data;
    }, requestKey);
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    return requestQueue.add(async () => {
      const serializedData = data && typeof data === 'object' ? data : data;
      const response = await this.instance.post(url, serializedData, config);

      // Clear related cache for follow/unfollow actions
      if (url.includes('/follow/')) {
        const userId = url.split('/follow/')[1];
        requestQueue.clearCache(`GET_/users/${userId}/follow-status_{}`);
        requestQueue.clearCache(`GET_/users/${userId}_{}`);
        requestQueue.clearCache(`GET_/users/profile/me_{}`);
        // Clear all cache to ensure fresh data
        requestQueue.clearCache();
      }

      return response.data;
    });
  }

  public async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.put(url, data, config);
    return response.data;
  }

  public async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.instance.patch(url, data, config);
    return response.data;
  }

  public async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return requestQueue.add(async () => {
      const response = await this.instance.delete(url, config);

      // Clear related cache for follow/unfollow actions
      if (url.includes('/follow/')) {
        const userId = url.split('/follow/')[1];
        requestQueue.clearCache(`GET_/users/${userId}/follow-status_{}`);
        requestQueue.clearCache(`GET_/users/${userId}_{}`);
        requestQueue.clearCache(`GET_/users/profile/me_{}`);
        // Clear all cache to ensure fresh data
        requestQueue.clearCache();
      }

      return response.data;
    });
  }

  // Utility methods for query parameters
  public buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  // File upload method
  public async uploadFile<T>(
    url: string,
    file: File,
    onProgress?: (progress: number) => void
  ): Promise<ApiResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    const config: AxiosRequestConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: progressEvent => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    };

    const response = await this.instance.post(url, formData, config);
    return response.data;
  }

  // Batch request method for multiple API calls
  public async batch<T>(requests: Array<() => Promise<ApiResponse<any>>>): Promise<T[]> {
    const results = await Promise.allSettled(requests.map(request => request()));

    return results
      .map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value.data;
        } else {
          console.error(`Batch request ${index} failed:`, result.reason);
          return null;
        }
      })
      .filter(Boolean);
  }

  // Health check method
  public async healthCheck(): Promise<boolean> {
    try {
      await this.get('/');
      return true;
    } catch {
      return false;
    }
  }

  // Get instance for direct access if needed
  public getInstance(): AxiosInstance {
    return this.instance;
  }
}

// Single global API client instance for consistent token management
export const apiClient = new ApiClient(config.apiBaseUrl);

// Factory function for creating new instances if needed
export const createApiClient = (baseURL?: string): ApiClient => new ApiClient(baseURL);

export default apiClient;
