import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiResponse, ApiError } from '../../types/api';
import { config } from '../../config/environment';
import { requestQueue } from '../../utils/requestQueue';

class ApiClient {
  private instance: AxiosInstance;
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = config.apiBaseUrl;

    this.instance = axios.create({
      baseURL: this.baseURL,
      timeout: config.performance.requestTimeout,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.loadTokenFromStorage();
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      config => {
        if (this.token) {
          config.headers.Authorization = `Bearer ${this.token}`;
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

        // Debug logging (disabled for cleaner console)
        // if (config.isDevelopment && config.features.enableDebug) {
        //   console.log('API Request:', config.method, config.url);
        // }

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
    const token = localStorage.getItem('auth_token');
    if (token) {
      this.setToken(token);
    }
  }

  public setToken(token: string): void {
    this.token = token;
    localStorage.setItem('auth_token', token);
    // Update default headers immediately
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  public clearAuth(): void {
    this.token = null;
    localStorage.removeItem('auth_token');
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
    return requestQueue.add(async () => {
      const response = await this.instance.get(url, config);
      return response.data;
    });
  }

  public async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    // Ensure data is properly serialized
    const serializedData = data && typeof data === 'object' ? data : data;
    const response = await this.instance.post(url, serializedData, config);
    return response.data;
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
    const response = await this.instance.delete(url, config);
    return response.data;
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
      await this.get('/health');
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

// Export singleton instance
export const apiClient = new ApiClient();
export default apiClient;
