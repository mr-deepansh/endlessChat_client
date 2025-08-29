import { apiClient } from '../core/apiClient';
import {
  ApiResponse,
  AdminStats,
  AdminUser,
  UserManagementParams,
  SuspiciousAccount,
  BlockedIP,
  LoginAttempt,
  AnalyticsOverview,
  UserGrowthData,
  EngagementMetrics,
  NotificationTemplate,
  BulkNotificationRequest,
  AppSettings,
  AutomationRule,
  Experiment,
  RevenueAnalytics,
  UserLifetimeValue,
  CreateAdminRequest,
  RoleChangeRequest,
  AuditLog,
  EmergencyLockdownRequest,
  TimeRangeParams,
  BaseQueryParams,
} from '../../types/api';

class AdminService {
  private readonly baseUrl = '/admin';

  // Dashboard & Statistics
  async getDashboard(): Promise<
    ApiResponse<{
      stats: AdminStats;
      recentActivity: Array<{
        type: string;
        description: string;
        timestamp: string;
        user?: string;
      }>;
      alerts: Array<{
        type: 'info' | 'warning' | 'error';
        message: string;
        timestamp: string;
      }>;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/dashboard`);
  }

  async getStats(): Promise<ApiResponse<AdminStats>> {
    return apiClient.get<AdminStats>(`${this.baseUrl}/stats`);
  }

  async getLiveStats(): Promise<
    ApiResponse<{
      activeUsers: number;
      onlineUsers: number;
      requestsPerMinute: number;
      errorRate: number;
      responseTime: number;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/stats/live`);
  }

  // User Management
  async getAllUsers(params: UserManagementParams = {}): Promise<ApiResponse<AdminUser[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<AdminUser[]>(`${this.baseUrl}/users${queryString}`);
  }

  async getUserById(userId: string): Promise<ApiResponse<AdminUser>> {
    return apiClient.get<AdminUser>(`${this.baseUrl}/users/${userId}`);
  }

  async updateUser(userId: string, data: Partial<AdminUser>): Promise<ApiResponse<AdminUser>> {
    return apiClient.put<AdminUser>(`${this.baseUrl}/users/${userId}`, data);
  }

  async deleteUser(userId: string, data: { reason: string }): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.baseUrl}/users/${userId}`, { data });
  }

  async suspendUser(
    userId: string,
    data: { reason: string; duration?: string }
  ): Promise<ApiResponse<void>> {
    return apiClient.patch<void>(`${this.baseUrl}/users/${userId}/suspend`, data);
  }

  async activateUser(userId: string): Promise<ApiResponse<void>> {
    return apiClient.patch<void>(`${this.baseUrl}/users/${userId}/activate`);
  }

  // Admin Management
  async getAllAdmins(): Promise<ApiResponse<AdminUser[]>> {
    return apiClient.get<AdminUser[]>(`${this.baseUrl}/admins`);
  }

  // Add missing getUsers method
  async getUsers(params: UserManagementParams = {}): Promise<ApiResponse<AdminUser[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<AdminUser[]>(`${this.baseUrl}/users${queryString}`);
  }

  async getAdminById(adminId: string): Promise<ApiResponse<AdminUser>> {
    return apiClient.get<AdminUser>(`${this.baseUrl}/admins/${adminId}`);
  }

  // Analytics
  async getAnalyticsOverview(
    params: TimeRangeParams = {}
  ): Promise<ApiResponse<AnalyticsOverview>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<AnalyticsOverview>(`${this.baseUrl}/analytics/overview${queryString}`);
  }

  async getUserGrowthAnalytics(
    params: {
      period?: 'daily' | 'weekly' | 'monthly';
      days?: number;
    } = {}
  ): Promise<ApiResponse<UserGrowthData[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<UserGrowthData[]>(`${this.baseUrl}/analytics/users/growth${queryString}`);
  }

  async getUserDemographics(): Promise<
    ApiResponse<{
      ageGroups: Record<string, number>;
      countries: Record<string, number>;
      devices: Record<string, number>;
      registrationSources: Record<string, number>;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/analytics/users/demographics`);
  }

  async getUserRetentionAnalytics(
    params: {
      period?: 'weekly' | 'monthly';
      weeks?: number;
    } = {}
  ): Promise<
    ApiResponse<
      Array<{
        cohort: string;
        week0: number;
        week1: number;
        week2: number;
        week3: number;
        week4: number;
      }>
    >
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/analytics/users/retention${queryString}`);
  }

  async getEngagementMetrics(
    params: TimeRangeParams & {
      metric?: 'all' | 'likes' | 'comments' | 'shares' | 'views';
    } = {}
  ): Promise<ApiResponse<EngagementMetrics>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<EngagementMetrics>(
      `${this.baseUrl}/analytics/engagement/metrics${queryString}`
    );
  }

  // Security & Moderation
  async getSuspiciousAccounts(
    params: {
      page?: number;
      limit?: number;
      riskLevel?: 'low' | 'medium' | 'high' | 'critical';
    } = {}
  ): Promise<ApiResponse<SuspiciousAccount[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<SuspiciousAccount[]>(
      `${this.baseUrl}/security/suspicious-accounts${queryString}`
    );
  }

  async getBlockedIPs(params: BaseQueryParams = {}): Promise<ApiResponse<BlockedIP[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<BlockedIP[]>(`${this.baseUrl}/security/blocked-ips${queryString}`);
  }

  async blockIP(data: {
    ipAddress: string;
    reason: string;
    duration?: string;
  }): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.baseUrl}/security/blocked-ips`, data);
  }

  async unblockIP(ipId: string, data: { reason: string }): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`${this.baseUrl}/security/blocked-ips/${ipId}`, { data });
  }

  async getLoginAttempts(
    params: {
      status?: 'success' | 'failed';
      timeRange?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ApiResponse<LoginAttempt[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<LoginAttempt[]>(`${this.baseUrl}/security/login-attempts${queryString}`);
  }

  async getThreatDetection(): Promise<
    ApiResponse<{
      threats: Array<{
        type: string;
        severity: 'low' | 'medium' | 'high' | 'critical';
        description: string;
        detectedAt: string;
        status: 'active' | 'resolved';
      }>;
      summary: {
        total: number;
        active: number;
        resolved: number;
      };
    }>
  > {
    return apiClient.get(`${this.baseUrl}/security/threat-detection`);
  }

  // Content Management
  async getAllPosts(
    params: {
      page?: number;
      limit?: number;
      status?: 'published' | 'hidden' | 'reported';
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<
    ApiResponse<
      Array<{
        _id: string;
        content: string;
        author: AdminUser;
        status: string;
        reportsCount: number;
        createdAt: string;
      }>
    >
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/content/posts${queryString}`);
  }

  async togglePostVisibility(
    postId: string,
    data: {
      action: 'hide' | 'show';
      reason?: string;
    }
  ): Promise<ApiResponse<void>> {
    return apiClient.patch<void>(`${this.baseUrl}/content/posts/${postId}/toggle-visibility`, data);
  }

  // System Configuration
  async getAppSettings(): Promise<ApiResponse<AppSettings>> {
    return apiClient.get<AppSettings>(`${this.baseUrl}/config/app-settings`);
  }

  async updateAppSettings(data: {
    category: string;
    settings: Record<string, any>;
  }): Promise<ApiResponse<AppSettings>> {
    return apiClient.put<AppSettings>(`${this.baseUrl}/config/app-settings`, data);
  }

  // Notifications
  async getNotificationTemplates(
    params: {
      type?: 'email' | 'in-app' | 'push';
    } = {}
  ): Promise<ApiResponse<NotificationTemplate[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<NotificationTemplate[]>(
      `${this.baseUrl}/notifications/templates${queryString}`
    );
  }

  async sendBulkNotification(data: BulkNotificationRequest): Promise<
    ApiResponse<{
      jobId: string;
      estimatedDelivery: string;
      recipientCount: number;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/notifications/send-bulk`, data);
  }

  // Monitoring
  async getDatabaseStats(): Promise<
    ApiResponse<{
      collections: Record<
        string,
        {
          documents: number;
          size: string;
          indexes: number;
        }
      >;
      performance: {
        readLatency: number;
        writeLatency: number;
        connections: number;
      };
    }>
  > {
    return apiClient.get(`${this.baseUrl}/monitoring/database-stats`);
  }

  async getServerHealth(): Promise<
    ApiResponse<{
      status: 'healthy' | 'warning' | 'critical';
      uptime: number;
      memory: {
        used: number;
        total: number;
        percentage: number;
      };
      cpu: {
        usage: number;
        load: number[];
      };
      disk: {
        used: number;
        total: number;
        percentage: number;
      };
    }>
  > {
    return apiClient.get(`${this.baseUrl}/monitoring/server-health`);
  }

  // Session Analytics
  async getSessionAnalytics(params: TimeRangeParams = {}): Promise<
    ApiResponse<{
      totalSessions: number;
      activeSessions: number;
      averageSessionDuration: number;
      sessionsByDevice: Record<string, number>;
      sessionsByLocation: Record<string, number>;
    }>
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/sessions/analytics${queryString}`);
  }

  async getAdminSessions(adminId: string): Promise<
    ApiResponse<
      Array<{
        id: string;
        startTime: string;
        endTime?: string;
        duration: number;
        ipAddress: string;
        userAgent: string;
        location: string;
      }>
    >
  > {
    return apiClient.get(`${this.baseUrl}/sessions/${adminId}`);
  }

  // Automation
  async getAutomationRules(
    params: {
      status?: 'active' | 'inactive';
    } = {}
  ): Promise<ApiResponse<AutomationRule[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<AutomationRule[]>(`${this.baseUrl}/automation/rules${queryString}`);
  }

  async createAutomationRule(
    data: Omit<AutomationRule, '_id' | 'createdAt'>
  ): Promise<ApiResponse<AutomationRule>> {
    return apiClient.post<AutomationRule>(`${this.baseUrl}/automation/rules`, data);
  }

  async getExperiments(
    params: {
      status?: 'draft' | 'running' | 'paused' | 'completed';
    } = {}
  ): Promise<ApiResponse<Experiment[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<Experiment[]>(`${this.baseUrl}/experiments${queryString}`);
  }

  async createExperiment(
    data: Omit<Experiment, '_id' | 'metrics'>
  ): Promise<ApiResponse<Experiment>> {
    return apiClient.post<Experiment>(`${this.baseUrl}/experiments`, data);
  }

  // Business Intelligence
  async getRevenueAnalytics(
    params: {
      period?: string;
    } = {}
  ): Promise<ApiResponse<RevenueAnalytics>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<RevenueAnalytics>(`${this.baseUrl}/bi/revenue-analytics${queryString}`);
  }

  async getUserLifetimeValue(
    params: {
      segment?: string;
    } = {}
  ): Promise<ApiResponse<UserLifetimeValue>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<UserLifetimeValue>(`${this.baseUrl}/bi/user-lifetime-value${queryString}`);
  }
}

export const adminService = new AdminService();
export default adminService;
