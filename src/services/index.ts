// Core API Client
export { apiClient } from './core/apiClient';

// Service Modules
export { authService } from './modules/auth.service';
export { userService } from './modules/user.service';
export { adminService } from './modules/admin.service';
export { superAdminService } from './modules/superAdmin.service';
export { feedService } from './modules/feed.service';
export { notificationService } from './modules/notification.service';
export { socialService } from './modules/social.service';

// Types
export * from '../types/api';

// Service Factory for dependency injection
class ServiceFactory {
  private static instance: ServiceFactory;
  private services: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): ServiceFactory {
    if (!ServiceFactory.instance) {
      ServiceFactory.instance = new ServiceFactory();
    }
    return ServiceFactory.instance;
  }

  register<T>(name: string, service: T): void {
    this.services.set(name, service);
  }

  get<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service ${name} not found`);
    }
    return service;
  }

  has(name: string): boolean {
    return this.services.has(name);
  }
}

export const serviceFactory = ServiceFactory.getInstance();

// Register all services
import { authService } from './modules/auth.service';
import { userService } from './modules/user.service';
import { adminService } from './modules/admin.service';
import { superAdminService } from './modules/superAdmin.service';
import { feedService } from './modules/feed.service';
import { notificationService } from './modules/notification.service';
import { socialService } from './modules/social.service';
import { apiClient } from './core/apiClient';

serviceFactory.register('auth', authService);
serviceFactory.register('user', userService);
serviceFactory.register('admin', adminService);
serviceFactory.register('superAdmin', superAdminService);
serviceFactory.register('feed', feedService);
serviceFactory.register('notification', notificationService);
serviceFactory.register('social', socialService);

// Service hooks for React components
export const useServices = () => ({
  auth: authService,
  user: userService,
  admin: adminService,
  superAdmin: superAdminService,
  feed: feedService,
  notification: notificationService,
  social: socialService,
});

// Error handling utilities
export class ServiceError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export const handleServiceError = (error: any): ServiceError => {
  if (error instanceof ServiceError) {
    return error;
  }

  if (error.response) {
    // API error response
    return new ServiceError(
      error.response.data?.message || 'API request failed',
      error.response.data?.code || 'API_ERROR',
      error.response.status,
      error.response.data
    );
  }

  if (error.request) {
    // Network error
    return new ServiceError('Network request failed', 'NETWORK_ERROR', undefined, error.request);
  }

  // Generic error
  return new ServiceError(error.message || 'Unknown error occurred', 'UNKNOWN_ERROR');
};

// Service configuration
export interface ServiceConfig {
  baseURL: string;
  timeout: number;
  retryAttempts: number;
  retryDelay: number;
  enableLogging: boolean;
  enableCaching: boolean;
}

export const defaultServiceConfig: ServiceConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000,
  enableLogging: import.meta.env.DEV,
  enableCaching: true,
};

// Service health check
export const checkServiceHealth = async (): Promise<{
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: Record<string, boolean>;
  timestamp: string;
}> => {
  const services = {
    api: false,
    auth: false,
    database: false,
  };

  try {
    // Check API health
    try {
      await apiClient.get('/health');
      services.api = true;
    } catch {
      services.api = false;
    }

    // Check auth service
    if (authService.isAuthenticated()) {
      try {
        await authService.getCurrentUser();
        services.auth = true;
      } catch {
        services.auth = false;
      }
    } else {
      services.auth = true; // Not authenticated is not an error
    }

    // Determine overall status
    const healthyCount = Object.values(services).filter(Boolean).length;
    const totalCount = Object.keys(services).length;

    let status: 'healthy' | 'degraded' | 'unhealthy';
    if (healthyCount === totalCount) {
      status = 'healthy';
    } else if (healthyCount > 0) {
      status = 'degraded';
    } else {
      status = 'unhealthy';
    }

    return {
      status,
      services,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    return {
      status: 'unhealthy',
      services,
      timestamp: new Date().toISOString(),
    };
  }
};

// Performance monitoring
export const performanceMonitor = {
  startTime: new Map<string, number>(),

  start(operation: string): void {
    this.startTime.set(operation, performance.now());
  },

  end(operation: string): number {
    const start = this.startTime.get(operation);
    if (!start) return 0;

    const duration = performance.now() - start;
    this.startTime.delete(operation);

    if (import.meta.env.DEV) {
      console.log(`Service operation "${operation}" took ${duration.toFixed(2)}ms`);
    }

    return duration;
  },
};

// Cache management
export const cacheManager = {
  cache: new Map<string, { data: any; timestamp: number; ttl: number }>(),

  set(key: string, data: any, ttl: number = 5 * 60 * 1000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });
  },

  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  },

  delete(key: string): void {
    this.cache.delete(key);
  },

  clear(): void {
    this.cache.clear();
  },

  size(): number {
    return this.cache.size;
  },
};

export default {
  authService,
  userService,
  adminService,
  superAdminService,
  feedService,
  notificationService,
  socialService,
  apiClient,
  serviceFactory,
  checkServiceHealth,
  performanceMonitor,
  cacheManager,
};
