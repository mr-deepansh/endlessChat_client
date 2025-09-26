import { serviceCache } from './utils';
import { securityService, monitoringService, analyticsService, revenueService } from './modules';

export class ServiceManager {
  // Security methods with caching
  async getSecurityOverview(useCache = true) {
    const cacheKey = 'security_overview';

    if (useCache) {
      return serviceCache.getOrFetch(
        cacheKey,
        () => securityService.getSecurityOverview(),
        2 * 60 * 1000 // 2 minutes cache
      );
    }

    return securityService.getSecurityOverview();
  }

  // Monitoring methods with caching
  async getDatabaseStats(useCache = true) {
    const cacheKey = 'database_stats';

    if (useCache) {
      return serviceCache.getOrFetch(
        cacheKey,
        () => monitoringService.getDatabaseStats(),
        30 * 1000 // 30 seconds cache for real-time data
      );
    }

    return monitoringService.getDatabaseStats();
  }

  async getSystemMetrics(useCache = true) {
    const cacheKey = 'system_metrics';

    if (useCache) {
      return serviceCache.getOrFetch(
        cacheKey,
        () => monitoringService.getSystemMetrics(),
        15 * 1000 // 15 seconds cache
      );
    }

    return monitoringService.getSystemMetrics();
  }

  // Analytics methods with caching
  async getRetentionAnalytics(period = 'weekly', weeks = 12, useCache = true) {
    const cacheKey = `retention_${period}_${weeks}`;

    if (useCache) {
      return serviceCache.getOrFetch(
        cacheKey,
        () => analyticsService.getRetentionAnalytics(period, weeks),
        10 * 60 * 1000 // 10 minutes cache
      );
    }

    return analyticsService.getRetentionAnalytics(period, weeks);
  }

  async getEngagementMetrics(timeRange = '30d', metric = 'all', useCache = true) {
    const cacheKey = `engagement_${timeRange}_${metric}`;

    if (useCache) {
      return serviceCache.getOrFetch(
        cacheKey,
        () => analyticsService.getEngagementMetrics(timeRange, metric),
        5 * 60 * 1000 // 5 minutes cache
      );
    }

    return analyticsService.getEngagementMetrics(timeRange, metric);
  }

  // Revenue methods with caching
  async getRevenueAnalytics(period = '30d', useCache = true) {
    const cacheKey = `revenue_${period}`;

    if (useCache) {
      return serviceCache.getOrFetch(
        cacheKey,
        () => revenueService.getRevenueAnalytics(period),
        5 * 60 * 1000 // 5 minutes cache
      );
    }

    return revenueService.getRevenueAnalytics(period);
  }

  async getUserLifetimeValue(segment = 'premium', useCache = true) {
    const cacheKey = `ltv_${segment}`;

    if (useCache) {
      return serviceCache.getOrFetch(
        cacheKey,
        () => revenueService.getUserLifetimeValue(segment),
        15 * 60 * 1000 // 15 minutes cache
      );
    }

    return revenueService.getUserLifetimeValue(segment);
  }

  // Batch operations for dashboard loading
  async getDashboardData() {
    const [securityOverview, databaseStats, engagementMetrics, revenueAnalytics] =
      await Promise.allSettled([
        this.getSecurityOverview(),
        this.getDatabaseStats(),
        this.getEngagementMetrics(),
        this.getRevenueAnalytics(),
      ]);

    return {
      security: securityOverview.status === 'fulfilled' ? securityOverview.value : null,
      database: databaseStats.status === 'fulfilled' ? databaseStats.value : null,
      engagement: engagementMetrics.status === 'fulfilled' ? engagementMetrics.value : null,
      revenue: revenueAnalytics.status === 'fulfilled' ? revenueAnalytics.value : null,
    };
  }

  // Cache management
  clearCache() {
    serviceCache.clear();
  }

  getCacheStats() {
    return {
      size: serviceCache.size(),
    };
  }
}

export const serviceManager = new ServiceManager();
