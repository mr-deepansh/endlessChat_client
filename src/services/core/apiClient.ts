import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config } from '../../config/environment';
import type { ApiError, ApiResponse } from '../../types/api';
import Logger from '../../utils/logger';
import { requestQueue } from '../../utils/requestQueue';
import SecureStorage from '../../utils/secureStorage';

class ApiClient {
  private instance: AxiosInstance;
  private baseURL: string;
  private token: string | null = null;
  private isLoggingOut: boolean = false;
  private consecutiveFailures: number = 0;
  private circuitBreakerOpen: boolean = false;
  private lastFailureTime: number = 0;
  private readonly maxFailures = 5;
  private readonly circuitBreakerTimeout = 30000; // 30 seconds

  constructor(baseURL: string = config.apiBaseUrl) {
    this.baseURL = baseURL;

    this.instance = axios.create({
      baseURL: config.apiBaseUrl,
      timeout: config.performance.requestTimeout,
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-Client-Version': config.appVersion,
      },
      withCredentials: true, // Essential for HttpOnly cookies
    });

    // Remove any problematic headers that might cause CORS issues
    delete this.instance.defaults.headers.common['accept-version'];
    delete this.instance.defaults.headers.common['Accept-Version'];

    this.setupInterceptors();
    // No manual token management - cookies handled automatically
  }

  private setupInterceptors(): void {
    // Request interceptor
    this.instance.interceptors.request.use(
      config => {
        // Add CSRF protection header if available
        const csrfToken = document
          .querySelector('meta[name="csrf-token"]')
          ?.getAttribute('content');
        if (csrfToken) {
          config.headers['X-CSRF-Token'] = csrfToken;
        }

        // Add request timestamp for performance monitoring
        config.metadata = { startTime: new Date() };

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
          Logger.debug(`API Request completed`, {
            method: response.config.method?.toUpperCase(),
            url: response.config.url,
            duration: `${duration}ms`,
          });
        }

        return response;
      },
      async error => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - redirect to login
        if (error.response?.status === 401 && !this.isLoggingOut) {
          this.consecutiveFailures++;
          this.lastFailureTime = Date.now();

          // Open circuit breaker if too many failures
          if (this.consecutiveFailures >= this.maxFailures) {
            this.circuitBreakerOpen = true;
            Logger.warn('Circuit breaker opened due to consecutive 401 failures');
          }

          // Only redirect once, not on every 401
          if (this.consecutiveFailures === 1) {
            this.clearAuth();
            window.location.href = '/login';
          }
          return Promise.reject(error);
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

  public clearAuth(): void {
    this.token = null;
    this.isLoggingOut = false;
    this.consecutiveFailures = 0;
    this.circuitBreakerOpen = false;
    // Clear any client-side storage (cookies handled by backend)
    SecureStorage.clearTokens();
  }

  public setLoggingOut(value: boolean): void {
    this.isLoggingOut = value;
  }

  private checkCircuitBreaker(): boolean {
    if (!this.circuitBreakerOpen) return false;

    // Check if circuit breaker timeout has passed
    if (Date.now() - this.lastFailureTime > this.circuitBreakerTimeout) {
      this.circuitBreakerOpen = false;
      this.consecutiveFailures = 0;
      Logger.info('Circuit breaker closed, allowing requests again');
      return false;
    }

    return true;
  }

  // Generic request methods with rate limiting protection
  public async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    if (this.checkCircuitBreaker()) {
      throw new Error('Circuit breaker is open - too many failed requests');
    }

    const requestKey = `GET_${url}_${JSON.stringify(config?.params || {})}`;
    return requestQueue.add(async () => {
      const response = await this.instance.get(url, config);
      this.consecutiveFailures = 0; // Reset on success
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
          Logger.error(`Batch request ${index} failed`, {
            reason: result.reason?.message || 'Unknown error',
          });
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
