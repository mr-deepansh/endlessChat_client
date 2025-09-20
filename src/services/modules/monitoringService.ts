import { apiClient } from '../core/apiClient';

export interface DatabaseStats {
  overview: {
    collections: number;
    objects: number;
    dataSize: string;
    storageSize: string;
    indexSize: string;
    avgObjSize: string;
  };
  collections: Array<{
    name: string;
    count: number;
    size: string;
    avgObjSize: string;
    storageSize: string;
    indexes: number;
    status: 'healthy' | 'warning' | 'error';
    efficiency: number;
  }>;
  performance: {
    ok: number;
    fsUsedSize: string;
    fsTotalSize: string;
  };
}

export interface SystemMetrics {
  cpu: number;
  memory: number;
  disk: number;
  network: {
    inbound: number;
    outbound: number;
  };
  uptime: string;
}

class MonitoringService {
  async getDatabaseStats(): Promise<DatabaseStats> {
    const response = await apiClient.get<DatabaseStats>('/admin/monitoring/database-stats');
    return response.data;
  }

  async getSystemMetrics(): Promise<SystemMetrics> {
    const response = await apiClient.get<SystemMetrics>('/admin/monitoring/system-metrics');
    return response.data;
  }

  async getHealthCheck(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    services: Record<string, { status: string; responseTime: number }>;
  }> {
    const response = await apiClient.get('/admin/monitoring/health');
    return response.data;
  }

  async getPerformanceMetrics(timeRange = '1h'): Promise<{
    responseTime: Array<{ timestamp: string; value: number }>;
    throughput: Array<{ timestamp: string; value: number }>;
    errorRate: Array<{ timestamp: string; value: number }>;
  }> {
    const response = await apiClient.get(`/admin/monitoring/performance?timeRange=${timeRange}`);
    return response.data;
  }
}

export default new MonitoringService();