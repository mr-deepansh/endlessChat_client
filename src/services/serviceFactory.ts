// Enterprise Service Factory for Dependency Injection and Service Management
// Optimized for millions of users with proper error handling and monitoring

import { apiClient } from './core/apiClient';
import { authService } from './modules/auth.service';
import { userService } from './modules/user.service';
import { adminService } from './modules/admin.service';
import { superAdminService } from './modules/superAdmin.service';
import { feedService } from './modules/feed.service';
import { notificationService } from './modules/notification.service';
import { socialService } from './modules/social.service';
import { blogService } from './modules/blog.service';
import { getServiceConfig } from './serviceConfig';

export interface ServiceInstance {
  name: string;
  instance: any;
  version: string;
  status: 'active' | 'inactive' | 'error';
  lastHealthCheck: Date;
  errorCount: number;
  requestCount: number;
  averageResponseTime: number;
}

export interface ServiceMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  uptime: number;
  errorRate: number;
}

class EnterpriseServiceFactory {
  private static instance: EnterpriseServiceFactory;
  private services: Map<string, ServiceInstance> = new Map();
  private config = getServiceConfig();
  private metrics: Map<string, ServiceMetrics> = new Map();
  private healthCheckInterval: NodeJS.Timeout | null = null;

  private constructor() {
    this.initializeServices();
    this.startHealthChecking();
    this.setupErrorHandling();
  }

  static getInstance(): EnterpriseServiceFactory {
    if (!EnterpriseServiceFactory.instance) {
      EnterpriseServiceFactory.instance = new EnterpriseServiceFactory();
    }
    return EnterpriseServiceFactory.instance;
  }

  private initializeServices(): void {
    // Register core services
    this.registerService('apiClient', apiClient, '1.0.0');
    this.registerService('auth', authService, '1.0.0');
    this.registerService('user', userService, '1.0.0');
    this.registerService('admin', adminService, '1.0.0');
    this.registerService('superAdmin', superAdminService, '1.0.0');
    this.registerService('feed', feedService, '1.0.0');
    this.registerService('notification', notificationService, '1.0.0');
    this.registerService('social', socialService, '1.0.0');
    this.registerService('blog', blogService, '1.0.0');

    console.log(`✅ Initialized ${this.services.size} enterprise services`);
  }

  private registerService(name: string, instance: any, version: string): void {
    const serviceInstance: ServiceInstance = {
      name,
      instance,
      version,
      status: 'active',
      lastHealthCheck: new Date(),
      errorCount: 0,
      requestCount: 0,
      averageResponseTime: 0,
    };

    this.services.set(name, serviceInstance);
    this.metrics.set(name, {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      uptime: 100,
      errorRate: 0,
    });

    if (this.config.monitoring.enableLogging) {
      console.log(`📦 Registered service: ${name} v${version}`);
    }
  }

  public getService<T>(name: string): T {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(
        `Service '${name}' not found. Available services: ${Array.from(this.services.keys()).join(', ')}`
      );
    }

    if (service.status === 'error') {
      console.warn(`⚠️ Service '${name}' is in error state. Attempting to recover...`);
      this.attemptServiceRecovery(name);
    }

    // Track service usage
    this.trackServiceUsage(name);

    return service.instance as T;
  }

  public hasService(name: string): boolean {
    return this.services.has(name);
  }

  public getAllServices(): string[] {
    return Array.from(this.services.keys());
  }

  public getServiceStatus(name: string): ServiceInstance | null {
    return this.services.get(name) || null;
  }

  public getServiceMetrics(name: string): ServiceMetrics | null {
    return this.metrics.get(name) || null;
  }

  public getAllMetrics(): Record<string, ServiceMetrics> {
    const allMetrics: Record<string, ServiceMetrics> = {};
    this.metrics.forEach((metrics, name) => {
      allMetrics[name] = metrics;
    });
    return allMetrics;
  }

  private trackServiceUsage(serviceName: string): void {
    const service = this.services.get(serviceName);
    const metrics = this.metrics.get(serviceName);

    if (service && metrics) {
      service.requestCount++;
      metrics.totalRequests++;
    }
  }

  public recordServiceResponse(serviceName: string, responseTime: number, success: boolean): void {
    const service = this.services.get(serviceName);
    const metrics = this.metrics.get(serviceName);

    if (service && metrics) {
      // Update response time
      const totalTime = service.averageResponseTime * (service.requestCount - 1) + responseTime;
      service.averageResponseTime = totalTime / service.requestCount;
      metrics.averageResponseTime = service.averageResponseTime;

      // Update success/failure counts
      if (success) {
        metrics.successfulRequests++;
        service.status = 'active';
      } else {
        metrics.failedRequests++;
        service.errorCount++;

        // Mark service as error if error rate is too high
        const errorRate = service.errorCount / service.requestCount;
        if (errorRate > 0.1) {
          // 10% error rate threshold
          service.status = 'error';
        }
      }

      // Update error rate
      metrics.errorRate = metrics.failedRequests / metrics.totalRequests;
    }
  }

  private startHealthChecking(): void {
    if (!this.config.monitoring.enableMetrics) return;

    this.healthCheckInterval = setInterval(() => {
      this.performHealthCheck();
    }, 30000); // Check every 30 seconds
  }

  private async performHealthCheck(): Promise<void> {
    for (const [name, service] of this.services) {
      try {
        // Perform basic health check
        if (name === 'apiClient') {
          const isHealthy = await apiClient.healthCheck();
          service.status = isHealthy ? 'active' : 'error';
        } else if (service.instance.healthCheck) {
          const isHealthy = await service.instance.healthCheck();
          service.status = isHealthy ? 'active' : 'error';
        }

        service.lastHealthCheck = new Date();

        // Update uptime metrics
        const metrics = this.metrics.get(name);
        if (metrics && service.status === 'active') {
          metrics.uptime = Math.min(100, metrics.uptime + 1);
        } else if (metrics) {
          metrics.uptime = Math.max(0, metrics.uptime - 5);
        }
      } catch (error) {
        service.status = 'error';
        service.errorCount++;

        if (this.config.monitoring.enableLogging) {
          console.error(`❌ Health check failed for service '${name}':`, error);
        }
      }
    }
  }

  private attemptServiceRecovery(serviceName: string): void {
    const service = this.services.get(serviceName);
    if (!service) return;

    try {
      // Reset error count and status
      service.errorCount = 0;
      service.status = 'active';

      if (this.config.monitoring.enableLogging) {
        console.log(`🔄 Attempting recovery for service '${serviceName}'`);
      }

      // Perform service-specific recovery
      if (serviceName === 'apiClient') {
        // Reinitialize API client if needed
        apiClient.healthCheck();
      }
    } catch (error) {
      console.error(`❌ Failed to recover service '${serviceName}':`, error);
    }
  }

  private setupErrorHandling(): void {
    // Global error handler for unhandled service errors
    window.addEventListener('unhandledrejection', event => {
      console.error('🚨 Unhandled service error:', event.reason);

      // Try to identify which service caused the error
      const errorMessage = event.reason?.message || '';
      for (const [name, service] of this.services) {
        if (errorMessage.includes(name)) {
          service.errorCount++;
          this.recordServiceResponse(name, 0, false);
          break;
        }
      }
    });
  }

  // Service lifecycle management
  public async startService(name: string): Promise<void> {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service '${name}' not found`);
    }

    try {
      if (service.instance.start) {
        await service.instance.start();
      }
      service.status = 'active';

      if (this.config.monitoring.enableLogging) {
        console.log(`▶️ Started service: ${name}`);
      }
    } catch (error) {
      service.status = 'error';
      throw new Error(`Failed to start service '${name}': ${error}`);
    }
  }

  public async stopService(name: string): Promise<void> {
    const service = this.services.get(name);
    if (!service) {
      throw new Error(`Service '${name}' not found`);
    }

    try {
      if (service.instance.stop) {
        await service.instance.stop();
      }
      service.status = 'inactive';

      if (this.config.monitoring.enableLogging) {
        console.log(`⏹️ Stopped service: ${name}`);
      }
    } catch (error) {
      throw new Error(`Failed to stop service '${name}': ${error}`);
    }
  }

  public async restartService(name: string): Promise<void> {
    await this.stopService(name);
    await this.startService(name);
  }

  // Bulk operations for enterprise scale
  public async startAllServices(): Promise<void> {
    const promises = Array.from(this.services.keys()).map(name =>
      this.startService(name).catch(error =>
        console.error(`Failed to start service '${name}':`, error)
      )
    );
    await Promise.allSettled(promises);
  }

  public async stopAllServices(): Promise<void> {
    const promises = Array.from(this.services.keys()).map(name =>
      this.stopService(name).catch(error =>
        console.error(`Failed to stop service '${name}':`, error)
      )
    );
    await Promise.allSettled(promises);
  }

  // Configuration management
  public updateConfig(newConfig: Partial<typeof this.config>): void {
    this.config = { ...this.config, ...newConfig };

    if (this.config.monitoring.enableLogging) {
      console.log('🔧 Service configuration updated');
    }
  }

  public getConfig() {
    return { ...this.config };
  }

  // Performance monitoring
  public getPerformanceReport(): {
    totalServices: number;
    activeServices: number;
    errorServices: number;
    averageResponseTime: number;
    totalRequests: number;
    errorRate: number;
  } {
    const services = Array.from(this.services.values());
    const metrics = Array.from(this.metrics.values());

    const totalServices = services.length;
    const activeServices = services.filter(s => s.status === 'active').length;
    const errorServices = services.filter(s => s.status === 'error').length;

    const totalRequests = metrics.reduce((sum, m) => sum + m.totalRequests, 0);
    const totalFailures = metrics.reduce((sum, m) => sum + m.failedRequests, 0);
    const totalResponseTime = metrics.reduce(
      (sum, m) => sum + m.averageResponseTime * m.totalRequests,
      0
    );

    return {
      totalServices,
      activeServices,
      errorServices,
      averageResponseTime: totalRequests > 0 ? totalResponseTime / totalRequests : 0,
      totalRequests,
      errorRate: totalRequests > 0 ? totalFailures / totalRequests : 0,
    };
  }

  // Cleanup
  public destroy(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
      this.healthCheckInterval = null;
    }

    // Stop all services
    this.stopAllServices();

    // Clear all data
    this.services.clear();
    this.metrics.clear();

    if (this.config.monitoring.enableLogging) {
      console.log('🧹 Service factory destroyed');
    }
  }
}

// Export singleton instance
export const serviceFactory = EnterpriseServiceFactory.getInstance();

// Convenience hooks for React components
export const useServices = () => ({
  auth: serviceFactory.getService('auth'),
  user: serviceFactory.getService('user'),
  admin: serviceFactory.getService('admin'),
  superAdmin: serviceFactory.getService('superAdmin'),
  feed: serviceFactory.getService('feed'),
  notification: serviceFactory.getService('notification'),
  social: serviceFactory.getService('social'),
  apiClient: serviceFactory.getService('apiClient'),
});

// Service health monitoring hook
export const useServiceHealth = () => ({
  getServiceStatus: (name: string) => serviceFactory.getServiceStatus(name),
  getServiceMetrics: (name: string) => serviceFactory.getServiceMetrics(name),
  getAllMetrics: () => serviceFactory.getAllMetrics(),
  getPerformanceReport: () => serviceFactory.getPerformanceReport(),
});

// Error handling utilities
export class ServiceError extends Error {
  constructor(
    message: string,
    public serviceName: string,
    public code: string,
    public statusCode?: number,
    public details?: any
  ) {
    super(message);
    this.name = 'ServiceError';
  }
}

export const handleServiceError = (error: any, serviceName: string): ServiceError => {
  // Record the error in metrics
  serviceFactory.recordServiceResponse(serviceName, 0, false);

  if (error instanceof ServiceError) {
    return error;
  }

  if (error.response) {
    return new ServiceError(
      error.response.data?.message || 'API request failed',
      serviceName,
      error.response.data?.code || 'API_ERROR',
      error.response.status,
      error.response.data
    );
  }

  if (error.request) {
    return new ServiceError(
      'Network request failed',
      serviceName,
      'NETWORK_ERROR',
      undefined,
      error.request
    );
  }

  return new ServiceError(error.message || 'Unknown error occurred', serviceName, 'UNKNOWN_ERROR');
};

export default serviceFactory;
