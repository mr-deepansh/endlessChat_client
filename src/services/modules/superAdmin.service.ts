import { adminApi as apiClient } from '../core/serviceClients';
import type { ApiResponse, User, PaginatedResponse, SearchParams } from '../../types/api';

export interface AuditLog {
  id: string;
  adminId: string;
  adminUsername: string;
  action: string;
  targetType: 'user' | 'admin' | 'system' | 'content';
  targetId?: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  result: 'SUCCESS' | 'FAILURE' | 'PARTIAL';
}

export interface SystemConfig {
  security: {
    maxLoginAttempts: number;
    lockoutDuration: number;
    sessionTimeout: number;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
    twoFactorAuth: {
      enabled: boolean;
      required: boolean;
    };
  };
  features: {
    registration: boolean;
    emailVerification: boolean;
    contentModeration: boolean;
    realTimeNotifications: boolean;
  };
  limits: {
    maxUsersPerDay: number;
    maxPostsPerUser: number;
    maxFileSize: number;
    rateLimit: {
      requests: number;
      window: number;
    };
  };
  maintenance: {
    enabled: boolean;
    message: string;
    allowedIPs: string[];
  };
}

export interface AdminCreationData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'super_admin';
  permissions: string[];
  department?: string;
  notes?: string;
}

class SuperAdminService {
  private readonly baseUrl = '/admin/super-admin';

  // Admin Management
  async createAdmin(adminData: AdminCreationData): Promise<
    ApiResponse<{
      admin: User;
      temporaryPassword?: string;
      message: string;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/create-admin`, adminData);
  }

  async deleteAdmin(
    adminId: string,
    data: {
      confirmPassword: string;
      reason: string;
    }
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`${this.baseUrl}/delete-admin/${adminId}`, {
      data,
    });
  }

  async changeUserRole(
    userId: string,
    data: {
      newRole: 'user' | 'admin' | 'super_admin';
      reason: string;
      permissions?: string[];
    }
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put(`${this.baseUrl}/change-role/${userId}`, data);
  }

  async getAllAdmins(): Promise<ApiResponse<User[]>> {
    return apiClient.get<User[]>(`${this.baseUrl}/admins`);
  }

  async suspendAdmin(
    adminId: string,
    data: {
      reason: string;
      duration?: string;
    }
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.patch(`${this.baseUrl}/suspend-admin/${adminId}`, data);
  }

  async activateAdmin(adminId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.patch(`${this.baseUrl}/activate-admin/${adminId}`);
  }

  // System Configuration
  async getSystemConfig(): Promise<ApiResponse<SystemConfig>> {
    return apiClient.get<SystemConfig>(`${this.baseUrl}/system-config`);
  }

  async updateSystemConfig(
    config: Partial<SystemConfig>
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put(`${this.baseUrl}/system-config`, config);
  }

  async resetSystemConfig(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`${this.baseUrl}/system-config/reset`);
  }

  // Audit Logs & Security
  async getAuditLogs(
    params: {
      page?: number;
      limit?: number;
      action?: string;
      adminId?: string;
      targetType?: 'user' | 'admin' | 'system' | 'content';
      criticality?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      startDate?: string;
      endDate?: string;
      result?: 'SUCCESS' | 'FAILURE' | 'PARTIAL';
    } = {}
  ): Promise<ApiResponse<PaginatedResponse<AuditLog>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<PaginatedResponse<AuditLog>>(`${this.baseUrl}/audit-logs${queryString}`);
  }

  async exportAuditLogs(
    params: {
      format?: 'csv' | 'xlsx' | 'json';
      startDate?: string;
      endDate?: string;
      adminId?: string;
      action?: string;
    } = {}
  ): Promise<
    ApiResponse<{
      downloadUrl: string;
      expiresAt: string;
      recordCount: number;
    }>
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.post(`${this.baseUrl}/audit-logs/export${queryString}`);
  }

  // Emergency Controls
  async emergencyLockdown(data: {
    reason: string;
    duration: string;
    confirmPassword: string;
    notifyAdmins?: boolean;
  }): Promise<
    ApiResponse<{
      message: string;
      lockdownId: string;
      expiresAt: string;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/emergency-lockdown`, data);
  }

  async disableLockdown(
    lockdownId: string,
    confirmPassword: string
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`${this.baseUrl}/emergency-lockdown/${lockdownId}`, {
      data: { confirmPassword },
    });
  }

  async getLockdownStatus(): Promise<
    ApiResponse<{
      isActive: boolean;
      reason?: string;
      activatedBy?: string;
      activatedAt?: string;
      expiresAt?: string;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/lockdown-status`);
  }

  // System Maintenance
  async enableMaintenanceMode(data: {
    message: string;
    estimatedDuration?: string;
    allowedIPs?: string[];
    notifyUsers?: boolean;
  }): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`${this.baseUrl}/maintenance/enable`, data);
  }

  async disableMaintenanceMode(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`${this.baseUrl}/maintenance/disable`);
  }

  async getMaintenanceStatus(): Promise<
    ApiResponse<{
      enabled: boolean;
      message?: string;
      startedAt?: string;
      estimatedEnd?: string;
      allowedIPs?: string[];
    }>
  > {
    return apiClient.get(`${this.baseUrl}/maintenance/status`);
  }

  // Database Management
  async getDatabaseHealth(): Promise<
    ApiResponse<{
      status: 'healthy' | 'warning' | 'critical';
      connections: {
        active: number;
        idle: number;
        total: number;
        max: number;
      };
      performance: {
        avgQueryTime: number;
        slowQueries: number;
        indexEfficiency: number;
      };
      storage: {
        totalSize: string;
        dataSize: string;
        indexSize: string;
        freeSpace: string;
      };
      replication: {
        status: string;
        lag: number;
        lastSync: string;
      };
    }>
  > {
    return apiClient.get(`${this.baseUrl}/database/health`);
  }

  async optimizeDatabase(): Promise<
    ApiResponse<{
      message: string;
      jobId: string;
      estimatedDuration: string;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/database/optimize`);
  }

  async createDatabaseBackup(data: {
    type: 'full' | 'incremental';
    compression?: boolean;
    encryption?: boolean;
  }): Promise<
    ApiResponse<{
      backupId: string;
      message: string;
      estimatedSize: string;
      estimatedDuration: string;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/database/backup`, data);
  }

  async getDatabaseBackups(): Promise<
    ApiResponse<
      Array<{
        id: string;
        type: 'full' | 'incremental';
        size: string;
        createdAt: string;
        status: 'completed' | 'in_progress' | 'failed';
        downloadUrl?: string;
      }>
    >
  > {
    return apiClient.get(`${this.baseUrl}/database/backups`);
  }

  // System Monitoring
  async getSystemMetrics(): Promise<
    ApiResponse<{
      server: {
        uptime: number;
        cpu: { usage: number; cores: number; load: number[] };
        memory: { used: number; total: number; percentage: number };
        disk: { used: number; total: number; percentage: number };
        network: { bytesIn: number; bytesOut: number };
      };
      application: {
        activeUsers: number;
        requestsPerSecond: number;
        errorRate: number;
        responseTime: number;
        cacheHitRate: number;
      };
      database: {
        connections: number;
        queryTime: number;
        throughput: number;
        lockWaits: number;
      };
    }>
  > {
    return apiClient.get(`${this.baseUrl}/system/metrics`);
  }

  async getSystemLogs(
    params: {
      level?: 'error' | 'warn' | 'info' | 'debug';
      service?: string;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<
    ApiResponse<
      PaginatedResponse<{
        timestamp: string;
        level: string;
        service: string;
        message: string;
        metadata?: Record<string, any>;
      }>
    >
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/system/logs${queryString}`);
  }

  // Security Management
  async getSecurityEvents(
    params: {
      type?: 'login_failure' | 'suspicious_activity' | 'data_breach' | 'privilege_escalation';
      severity?: 'low' | 'medium' | 'high' | 'critical';
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<
    ApiResponse<
      PaginatedResponse<{
        id: string;
        type: string;
        severity: string;
        description: string;
        sourceIP: string;
        userId?: string;
        timestamp: string;
        resolved: boolean;
        resolvedBy?: string;
        resolvedAt?: string;
      }>
    >
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/security/events${queryString}`);
  }

  async resolveSecurityEvent(
    eventId: string,
    resolution: {
      action: string;
      notes: string;
    }
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.patch(`${this.baseUrl}/security/events/${eventId}/resolve`, resolution);
  }

  async getSecurityReport(timeRange: '24h' | '7d' | '30d' = '7d'): Promise<
    ApiResponse<{
      summary: {
        totalEvents: number;
        criticalEvents: number;
        resolvedEvents: number;
        averageResolutionTime: number;
      };
      trends: Array<{
        date: string;
        events: number;
        severity: Record<string, number>;
      }>;
      topThreats: Array<{
        type: string;
        count: number;
        trend: 'increasing' | 'decreasing' | 'stable';
      }>;
      recommendations: string[];
    }>
  > {
    const queryString = apiClient.buildQueryString({ timeRange });
    return apiClient.get(`${this.baseUrl}/security/report${queryString}`);
  }

  // License & Compliance
  async getLicenseInfo(): Promise<
    ApiResponse<{
      type: 'free' | 'pro' | 'enterprise';
      status: 'active' | 'expired' | 'suspended';
      expiresAt?: string;
      features: string[];
      limits: Record<string, number>;
      usage: Record<string, number>;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/license/info`);
  }

  async updateLicense(licenseKey: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`${this.baseUrl}/license/update`, { licenseKey });
  }

  async getComplianceReport(): Promise<
    ApiResponse<{
      gdpr: {
        dataRetentionCompliance: boolean;
        consentManagement: boolean;
        dataPortability: boolean;
        rightToErasure: boolean;
      };
      security: {
        encryptionAtRest: boolean;
        encryptionInTransit: boolean;
        accessControls: boolean;
        auditLogging: boolean;
      };
      recommendations: string[];
      lastAudit: string;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/compliance/report`);
  }

  // Feature Flags & Experiments
  async getFeatureFlags(): Promise<
    ApiResponse<
      Record<
        string,
        {
          enabled: boolean;
          rolloutPercentage: number;
          targetAudience?: string[];
          description: string;
        }
      >
    >
  > {
    return apiClient.get(`${this.baseUrl}/feature-flags`);
  }

  async updateFeatureFlag(
    flagName: string,
    config: {
      enabled: boolean;
      rolloutPercentage?: number;
      targetAudience?: string[];
    }
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put(`${this.baseUrl}/feature-flags/${flagName}`, config);
  }

  // System Updates & Deployment
  async getSystemVersion(): Promise<
    ApiResponse<{
      current: string;
      latest: string;
      updateAvailable: boolean;
      releaseNotes?: string;
      securityUpdate: boolean;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/system/version`);
  }

  async initiateSystemUpdate(data: {
    version: string;
    confirmPassword: string;
    maintenanceWindow?: {
      start: string;
      duration: number;
    };
  }): Promise<
    ApiResponse<{
      updateId: string;
      message: string;
      estimatedDuration: string;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/system/update`, data);
  }

  async getUpdateStatus(updateId: string): Promise<
    ApiResponse<{
      status: 'pending' | 'in_progress' | 'completed' | 'failed';
      progress: number;
      currentStep: string;
      estimatedTimeRemaining?: string;
      error?: string;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/system/update/${updateId}/status`);
  }

  // Global Settings
  async getGlobalSettings(): Promise<
    ApiResponse<{
      branding: {
        appName: string;
        logo: string;
        favicon: string;
        primaryColor: string;
        secondaryColor: string;
      };
      email: {
        provider: string;
        fromAddress: string;
        fromName: string;
        templates: Record<string, any>;
      };
      storage: {
        provider: string;
        maxFileSize: number;
        allowedTypes: string[];
      };
      integrations: {
        analytics: boolean;
        socialLogin: string[];
        paymentGateways: string[];
      };
    }>
  > {
    return apiClient.get(`${this.baseUrl}/global-settings`);
  }

  async updateGlobalSettings(
    settings: Record<string, any>
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put(`${this.baseUrl}/global-settings`, settings);
  }

  // Emergency Actions
  async forceLogoutAllUsers(reason: string): Promise<
    ApiResponse<{
      message: string;
      affectedUsers: number;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/emergency/logout-all`, { reason });
  }

  async disableUserRegistration(
    reason: string,
    duration?: string
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`${this.baseUrl}/emergency/disable-registration`, {
      reason,
      duration,
    });
  }

  async enableUserRegistration(): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`${this.baseUrl}/emergency/enable-registration`);
  }

  // Data Management
  async initiateDataCleanup(data: {
    type: 'inactive_users' | 'old_logs' | 'temp_files' | 'cache';
    olderThan: string; // e.g., "30d", "1y"
    dryRun?: boolean;
  }): Promise<
    ApiResponse<{
      jobId: string;
      estimatedRecords: number;
      estimatedSize: string;
      message: string;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/data/cleanup`, data);
  }

  async getDataCleanupStatus(jobId: string): Promise<
    ApiResponse<{
      status: 'pending' | 'running' | 'completed' | 'failed';
      progress: number;
      recordsProcessed: number;
      recordsDeleted: number;
      spaceFreed: string;
      error?: string;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/data/cleanup/${jobId}/status`);
  }
}

export const superAdminService = new SuperAdminService();
export default superAdminService;
