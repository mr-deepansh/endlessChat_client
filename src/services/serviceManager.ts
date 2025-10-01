// Simplified service manager using only existing backend APIs
import { adminService } from './adminService';

export class ServiceManager {
  // Use existing admin service methods
  async getDatabaseStats() {
    const response = await adminService.getDatabaseStats();
    return response.success ? response.data : null;
  }

  async getEngagementMetrics(timeRange = '30d') {
    const response = await adminService.getEngagementMetrics({ timeRange });
    return response.success ? response.data : null;
  }

  async getRetentionAnalytics(cohortPeriod = 'monthly') {
    const response = await adminService.getUserRetentionAnalytics({ cohortPeriod });
    return response.success ? response.data : null;
  }

  async getServerHealth() {
    const response = await adminService.getServerHealth();
    return response.success ? response.data : null;
  }

  // Batch operations for dashboard loading
  async getDashboardData() {
    const [databaseStats, engagementMetrics, serverHealth] = await Promise.allSettled([
      this.getDatabaseStats(),
      this.getEngagementMetrics(),
      this.getServerHealth(),
    ]);

    return {
      database: databaseStats.status === 'fulfilled' ? databaseStats.value : null,
      engagement: engagementMetrics.status === 'fulfilled' ? engagementMetrics.value : null,
      serverHealth: serverHealth.status === 'fulfilled' ? serverHealth.value : null,
    };
  }
}

export const serviceManager = new ServiceManager();
