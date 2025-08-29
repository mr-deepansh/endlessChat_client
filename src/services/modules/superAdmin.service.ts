import { apiClient } from '../core/apiClient';
import {
  ApiResponse,
  CreateAdminRequest,
  RoleChangeRequest,
  AuditLog,
  EmergencyLockdownRequest,
  AdminUser,
  BaseQueryParams,
} from '../../types/api';

class SuperAdminService {
  private readonly baseUrl = '/admin/super-admin';

  // Admin Management
  async getAllAdmins(): Promise<ApiResponse<AdminUser[]>> {
    return apiClient.get<AdminUser[]>(`/admin/admins`);
  }

  async createAdmin(data: CreateAdminRequest): Promise<ApiResponse<AdminUser>> {
    return apiClient.post<AdminUser>(`${this.baseUrl}/create-admin`, data);
  }

  async deleteAdmin(
    adminId: string,
    data: {
      confirmPassword: string;
      reason: string;
    }
  ): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.baseUrl}/delete-admin/${adminId}`, { data });
  }

  async changeUserRole(
    userId: string,
    data: RoleChangeRequest
  ): Promise<
    ApiResponse<{
      user: AdminUser;
      previousRole: string;
      newRole: string;
      changedAt: string;
    }>
  > {
    return apiClient.put(`${this.baseUrl}/change-role/${userId}`, data);
  }

  // System Configuration
  async getSystemConfig(): Promise<
    ApiResponse<{
      database: {
        host: string;
        name: string;
        version: string;
        status: 'connected' | 'disconnected';
      };
      redis: {
        host: string;
        status: 'connected' | 'disconnected';
        memory: string;
      };
      server: {
        version: string;
        environment: string;
        uptime: number;
        nodeVersion: string;
      };
      features: {
        maintenance: boolean;
        registration: boolean;
        emailService: boolean;
        fileUpload: boolean;
      };
      limits: {
        maxUsers: number;
        maxFileSize: string;
        rateLimit: number;
      };
    }>
  > {
    return apiClient.get(`${this.baseUrl}/system-config`);
  }

  async updateSystemConfig(data: {
    category: 'database' | 'redis' | 'server' | 'features' | 'limits';
    settings: Record<string, any>;
  }): Promise<ApiResponse<void>> {
    return apiClient.put(`${this.baseUrl}/system-config`, data);
  }

  // Audit Logs
  async getAuditLogs(
    params: {
      page?: number;
      limit?: number;
      action?: string;
      criticality?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      adminId?: string;
      startDate?: string;
      endDate?: string;
    } = {}
  ): Promise<ApiResponse<AuditLog[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<AuditLog[]>(`${this.baseUrl}/audit-logs${queryString}`);
  }

  async getAuditLogById(logId: string): Promise<ApiResponse<AuditLog>> {
    return apiClient.get<AuditLog>(`${this.baseUrl}/audit-logs/${logId}`);
  }

  async exportAuditLogs(
    params: {
      startDate?: string;
      endDate?: string;
      format?: 'csv' | 'json' | 'xlsx';
      adminId?: string;
      action?: string;
    } = {}
  ): Promise<
    ApiResponse<{
      downloadUrl: string;
      expiresAt: string;
      fileSize: string;
    }>
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.post(`${this.baseUrl}/audit-logs/export${queryString}`);
  }

  // Emergency Controls
  async emergencyLockdown(data: EmergencyLockdownRequest): Promise<
    ApiResponse<{
      lockdownId: string;
      activatedAt: string;
      expiresAt: string;
      reason: string;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/emergency-lockdown`, data);
  }

  async liftLockdown(
    lockdownId: string,
    data: {
      confirmPassword: string;
      reason: string;
    }
  ): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.baseUrl}/lift-lockdown/${lockdownId}`, data);
  }

  async getLockdownStatus(): Promise<
    ApiResponse<{
      isActive: boolean;
      lockdownId?: string;
      activatedAt?: string;
      expiresAt?: string;
      reason?: string;
      activatedBy?: AdminUser;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/lockdown-status`);
  }

  // System Maintenance
  async enableMaintenanceMode(data: {
    reason: string;
    estimatedDuration: string;
    message?: string;
    allowAdminAccess?: boolean;
  }): Promise<
    ApiResponse<{
      maintenanceId: string;
      startTime: string;
      estimatedEndTime: string;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/maintenance/enable`, data);
  }

  async disableMaintenanceMode(maintenanceId: string): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.baseUrl}/maintenance/disable/${maintenanceId}`);
  }

  async getMaintenanceStatus(): Promise<
    ApiResponse<{
      isActive: boolean;
      maintenanceId?: string;
      startTime?: string;
      estimatedEndTime?: string;
      reason?: string;
      message?: string;
      enabledBy?: AdminUser;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/maintenance/status`);
  }

  // Database Operations
  async createDatabaseBackup(
    data: {
      name?: string;
      description?: string;
      includeFiles?: boolean;
    } = {}
  ): Promise<
    ApiResponse<{
      backupId: string;
      startedAt: string;
      estimatedCompletion: string;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/database/backup`, data);
  }

  async getDatabaseBackups(): Promise<
    ApiResponse<
      Array<{
        id: string;
        name: string;
        size: string;
        createdAt: string;
        status: 'creating' | 'completed' | 'failed';
        downloadUrl?: string;
      }>
    >
  > {
    return apiClient.get(`${this.baseUrl}/database/backups`);
  }

  async restoreDatabase(
    backupId: string,
    data: {
      confirmPassword: string;
      reason: string;
    }
  ): Promise<
    ApiResponse<{
      restoreId: string;
      startedAt: string;
      estimatedCompletion: string;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/database/restore/${backupId}`, data);
  }

  // System Analytics
  async getSystemAnalytics(
    params: {
      timeRange?: '1h' | '24h' | '7d' | '30d';
    } = {}
  ): Promise<
    ApiResponse<{
      performance: {
        averageResponseTime: number;
        requestsPerSecond: number;
        errorRate: number;
        uptime: number;
      };
      resources: {
        cpuUsage: number;
        memoryUsage: number;
        diskUsage: number;
        networkIO: {
          incoming: number;
          outgoing: number;
        };
      };
      database: {
        connections: number;
        queryTime: number;
        operations: {
          reads: number;
          writes: number;
          updates: number;
          deletes: number;
        };
      };
      users: {
        totalActive: number;
        concurrentSessions: number;
        newRegistrations: number;
        authenticatedRequests: number;
      };
    }>
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/analytics/system${queryString}`);
  }

  // Security Management
  async getSecuritySettings(): Promise<
    ApiResponse<{
      authentication: {
        maxLoginAttempts: number;
        lockoutDuration: number;
        sessionTimeout: number;
        requireTwoFactor: boolean;
      };
      passwords: {
        minLength: number;
        requireSpecialChars: boolean;
        requireNumbers: boolean;
        requireUppercase: boolean;
        expirationDays: number;
      };
      api: {
        rateLimit: number;
        allowedOrigins: string[];
        requireApiKey: boolean;
      };
      monitoring: {
        logLevel: 'error' | 'warn' | 'info' | 'debug';
        enableAuditLog: boolean;
        enableSecurityAlerts: boolean;
      };
    }>
  > {
    return apiClient.get(`${this.baseUrl}/security/settings`);
  }

  async updateSecuritySettings(data: {
    category: 'authentication' | 'passwords' | 'api' | 'monitoring';
    settings: Record<string, any>;
  }): Promise<ApiResponse<void>> {
    return apiClient.put(`${this.baseUrl}/security/settings`, data);
  }

  // License & Billing (if applicable)
  async getLicenseInfo(): Promise<
    ApiResponse<{
      type: 'free' | 'pro' | 'enterprise';
      status: 'active' | 'expired' | 'suspended';
      expiresAt?: string;
      features: string[];
      limits: {
        maxUsers: number;
        maxStorage: string;
        maxBandwidth: string;
      };
      usage: {
        currentUsers: number;
        currentStorage: string;
        currentBandwidth: string;
      };
    }>
  > {
    return apiClient.get(`${this.baseUrl}/license`);
  }

  // System Health Checks
  async runHealthCheck(): Promise<
    ApiResponse<{
      overall: 'healthy' | 'warning' | 'critical';
      services: {
        database: 'healthy' | 'warning' | 'critical';
        redis: 'healthy' | 'warning' | 'critical';
        fileSystem: 'healthy' | 'warning' | 'critical';
        externalAPIs: 'healthy' | 'warning' | 'critical';
      };
      details: Record<
        string,
        {
          status: string;
          responseTime: number;
          lastChecked: string;
          error?: string;
        }
      >;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/health-check`);
  }

  // Feature Flags
  async getFeatureFlags(): Promise<
    ApiResponse<
      Record<
        string,
        {
          enabled: boolean;
          description: string;
          rolloutPercentage: number;
          conditions?: Record<string, any>;
        }
      >
    >
  > {
    return apiClient.get(`${this.baseUrl}/feature-flags`);
  }

  async updateFeatureFlag(
    flagName: string,
    data: {
      enabled: boolean;
      rolloutPercentage?: number;
      conditions?: Record<string, any>;
    }
  ): Promise<ApiResponse<void>> {
    return apiClient.put(`${this.baseUrl}/feature-flags/${flagName}`, data);
  }
}

export const superAdminService = new SuperAdminService();
export default superAdminService;
