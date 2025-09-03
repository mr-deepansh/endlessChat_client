import { adminApi as apiClient } from '../core/serviceClients';
import type { ApiResponse, User, PaginatedResponse, SearchParams } from '../../types/api';

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  serverHealth: 'healthy' | 'degraded' | 'unhealthy';
  systemLoad: number;
  memoryUsage: number;
  diskUsage: number;
}

export interface LiveStats {
  onlineUsers: number;
  activeConnections: number;
  requestsPerMinute: number;
  errorRate: number;
  responseTime: number;
  timestamp: string;
}

export interface UserManagementParams extends SearchParams {
  role?: 'user' | 'admin' | 'super_admin';
  status?: 'active' | 'suspended' | 'banned';
  sortBy?: 'createdAt' | 'lastLoginAt' | 'username';
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

export interface AnalyticsParams {
  timeRange?: '7d' | '30d' | '90d' | '1y';
  period?: 'daily' | 'weekly' | 'monthly';
  days?: number;
  weeks?: number;
}

export interface SessionAnalytics {
  totalSessions: number;
  averageSessionDuration: number;
  bounceRate: number;
  peakHours: Array<{ hour: number; sessions: number }>;
  deviceBreakdown: Record<string, number>;
  locationBreakdown: Record<string, number>;
}

class AdminService {
  private readonly baseUrl = '/admin';

  // Dashboard & Statistics
  async getAdminStats(): Promise<ApiResponse<AdminStats>> {
    return apiClient.get<AdminStats>(`${this.baseUrl}/stats`);
  }

  async getLiveStats(): Promise<ApiResponse<LiveStats>> {
    return apiClient.get<LiveStats>(`${this.baseUrl}/stats/live`);
  }

  async getDashboard(): Promise<
    ApiResponse<{
      stats: AdminStats;
      recentActivity: any[];
      systemAlerts: any[];
      topUsers: User[];
      contentMetrics: any;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/dashboard`);
  }

  // User Management
  async getAllUsers(
    params: UserManagementParams = {}
  ): Promise<ApiResponse<PaginatedResponse<User>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<PaginatedResponse<User>>(`${this.baseUrl}/users${queryString}`);
  }

  async getUserById(userId: string): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`${this.baseUrl}/users/${userId}`);
  }

  async updateUser(userId: string, userData: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put<User>(`${this.baseUrl}/users/${userId}`, userData);
  }

  async deleteUser(userId: string, reason: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`${this.baseUrl}/users/${userId}`, {
      data: { reason },
    });
  }

  async suspendUser(
    userId: string,
    reason: string,
    duration?: string
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.patch(`${this.baseUrl}/users/${userId}/suspend`, {
      reason,
      duration,
    });
  }

  async activateUser(userId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.patch(`${this.baseUrl}/users/${userId}/activate`);
  }

  // Admin Management
  async getAllAdmins(params: SearchParams = {}): Promise<ApiResponse<PaginatedResponse<User>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<PaginatedResponse<User>>(`${this.baseUrl}/admins${queryString}`);
  }

  async getAdminById(adminId: string): Promise<ApiResponse<User>> {
    return apiClient.get<User>(`${this.baseUrl}/admins/${adminId}`);
  }

  // Session Analytics
  async getSessionAnalytics(params: AnalyticsParams = {}): Promise<ApiResponse<SessionAnalytics>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<SessionAnalytics>(`${this.baseUrl}/sessions/analytics${queryString}`);
  }

  async getAdminSessions(adminId: string): Promise<ApiResponse<any[]>> {
    return apiClient.get(`${this.baseUrl}/sessions/${adminId}`);
  }

  // Analytics & Reporting
  async getAnalyticsOverview(params: AnalyticsParams = {}): Promise<
    ApiResponse<{
      userGrowth: any[];
      engagementMetrics: any;
      contentMetrics: any;
      revenueMetrics?: any;
    }>
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/analytics/overview${queryString}`);
  }

  async getUserGrowthAnalytics(params: AnalyticsParams = {}): Promise<
    ApiResponse<
      Array<{
        date: string;
        newUsers: number;
        totalUsers: number;
        activeUsers: number;
      }>
    >
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/analytics/users/growth${queryString}`);
  }

  async getUserDemographics(): Promise<
    ApiResponse<{
      ageGroups: Record<string, number>;
      genderDistribution: Record<string, number>;
      locationDistribution: Record<string, number>;
      deviceTypes: Record<string, number>;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/analytics/users/demographics`);
  }

  async getUserRetentionAnalytics(params: AnalyticsParams = {}): Promise<
    ApiResponse<{
      cohortData: any[];
      retentionRates: Record<string, number>;
      churnRate: number;
    }>
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/analytics/users/retention${queryString}`);
  }

  async getEngagementMetrics(params: AnalyticsParams = {}): Promise<
    ApiResponse<{
      dailyActiveUsers: number;
      weeklyActiveUsers: number;
      monthlyActiveUsers: number;
      averageSessionDuration: number;
      postsPerUser: number;
      likesPerPost: number;
      commentsPerPost: number;
    }>
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/analytics/engagement/metrics${queryString}`);
  }

  // Content Management
  async getAllPosts(
    params: {
      page?: number;
      limit?: number;
      status?: 'published' | 'hidden' | 'flagged';
      sortBy?: 'createdAt' | 'likes' | 'comments';
      sortOrder?: 'asc' | 'desc';
    } = {}
  ): Promise<ApiResponse<PaginatedResponse<any>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/content/posts${queryString}`);
  }

  async togglePostVisibility(
    postId: string,
    action: 'hide' | 'show',
    reason?: string
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.patch(`${this.baseUrl}/content/posts/${postId}/toggle-visibility`, {
      action,
      reason,
    });
  }

  async deletePost(postId: string, reason: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`${this.baseUrl}/content/posts/${postId}`, {
      data: { reason },
    });
  }

  // Security & Moderation
  async getSuspiciousAccounts(
    params: {
      page?: number;
      limit?: number;
      riskLevel?: 'low' | 'medium' | 'high';
    } = {}
  ): Promise<ApiResponse<PaginatedResponse<any>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/security/suspicious-accounts${queryString}`);
  }

  async getBlockedIPs(params: SearchParams = {}): Promise<ApiResponse<PaginatedResponse<any>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/security/blocked-ips${queryString}`);
  }

  async blockIP(
    ipAddress: string,
    reason: string,
    duration: string = '24h'
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`${this.baseUrl}/security/blocked-ips`, {
      ipAddress,
      reason,
      duration,
    });
  }

  async unblockIP(ipId: string, reason?: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`${this.baseUrl}/security/blocked-ips/${ipId}`, {
      data: { reason },
    });
  }

  async getLoginAttempts(
    params: {
      status?: 'success' | 'failed';
      timeRange?: '1h' | '24h' | '7d';
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ApiResponse<PaginatedResponse<any>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/security/login-attempts${queryString}`);
  }

  async getThreatDetection(): Promise<
    ApiResponse<{
      activeThreat: number;
      blockedAttempts: number;
      suspiciousActivity: any[];
      securityScore: number;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/security/threat-detection`);
  }

  // System Configuration
  async getAppSettings(): Promise<ApiResponse<Record<string, any>>> {
    return apiClient.get(`${this.baseUrl}/config/app-settings`);
  }

  async updateAppSettings(
    category: string,
    settings: Record<string, any>
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put(`${this.baseUrl}/config/app-settings`, {
      category,
      settings,
    });
  }

  // Notifications Management
  async getNotificationTemplates(type?: 'email' | 'push' | 'sms'): Promise<ApiResponse<any[]>> {
    const queryString = type ? apiClient.buildQueryString({ type }) : '';
    return apiClient.get(`${this.baseUrl}/notifications/templates${queryString}`);
  }

  async sendBulkNotification(data: {
    recipients: 'all' | 'active' | 'inactive' | string[];
    template?: string;
    channels: Array<'email' | 'push' | 'sms' | 'in-app'>;
    priority: 'low' | 'normal' | 'high' | 'urgent';
    customMessage?: {
      title: string;
      content: string;
    };
    scheduledAt?: string;
  }): Promise<
    ApiResponse<{
      jobId: string;
      estimatedDelivery: string;
      recipientCount: number;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/notifications/send-bulk`, data);
  }

  // Monitoring & Health
  async getServerHealth(): Promise<
    ApiResponse<{
      status: 'healthy' | 'degraded' | 'unhealthy';
      uptime: number;
      memory: { used: number; total: number; percentage: number };
      cpu: { usage: number; cores: number };
      disk: { used: number; total: number; percentage: number };
      database: { status: string; connections: number; responseTime: number };
    }>
  > {
    return apiClient.get(`${this.baseUrl}/monitoring/server-health`);
  }

  async getDatabaseStats(): Promise<
    ApiResponse<{
      collections: Record<string, { documents: number; size: string; indexes: number }>;
      performance: { avgResponseTime: number; slowQueries: number };
      connections: { active: number; available: number };
    }>
  > {
    return apiClient.get(`${this.baseUrl}/monitoring/database-stats`);
  }

  // Automation & Rules
  async getAutomationRules(status?: 'active' | 'inactive'): Promise<ApiResponse<any[]>> {
    const queryString = status ? apiClient.buildQueryString({ status }) : '';
    return apiClient.get(`${this.baseUrl}/automation/rules${queryString}`);
  }

  async createAutomationRule(rule: {
    name: string;
    description: string;
    trigger: string;
    conditions: Record<string, any>;
    actions: Array<{
      type: string;
      template?: string;
      delay?: number;
      [key: string]: any;
    }>;
  }): Promise<ApiResponse<{ ruleId: string; message: string }>> {
    return apiClient.post(`${this.baseUrl}/automation/rules`, rule);
  }

  // A/B Testing & Experiments
  async getExperiments(status?: 'draft' | 'running' | 'completed'): Promise<ApiResponse<any[]>> {
    const queryString = status ? apiClient.buildQueryString({ status }) : '';
    return apiClient.get(`${this.baseUrl}/experiments${queryString}`);
  }

  async createExperiment(experiment: {
    name: string;
    description: string;
    variants: Array<{ name: string; description: string }>;
    trafficSplit: number[];
    duration: number;
    targetAudience?: Record<string, any>;
  }): Promise<ApiResponse<{ experimentId: string; message: string }>> {
    return apiClient.post(`${this.baseUrl}/experiments`, experiment);
  }

  // Business Intelligence
  async getRevenueAnalytics(period: string = '30d'): Promise<
    ApiResponse<{
      totalRevenue: number;
      revenueGrowth: number;
      averageRevenuePerUser: number;
      revenueBySource: Record<string, number>;
      monthlyRecurringRevenue: number;
    }>
  > {
    const queryString = apiClient.buildQueryString({ period });
    return apiClient.get(`${this.baseUrl}/bi/revenue-analytics${queryString}`);
  }

  async getUserLifetimeValue(segment?: string): Promise<
    ApiResponse<{
      averageLTV: number;
      ltv90Days: number;
      ltv180Days: number;
      ltv365Days: number;
      segmentBreakdown: Record<string, number>;
    }>
  > {
    const queryString = segment ? apiClient.buildQueryString({ segment }) : '';
    return apiClient.get(`${this.baseUrl}/bi/user-lifetime-value${queryString}`);
  }

  // Export & Reporting
  async exportUsers(
    format: 'csv' | 'xlsx' | 'json' = 'csv',
    filters?: UserManagementParams
  ): Promise<
    ApiResponse<{
      downloadUrl: string;
      expiresAt: string;
      recordCount: number;
    }>
  > {
    const params = { format, ...filters };
    const queryString = apiClient.buildQueryString(params);
    return apiClient.post(`${this.baseUrl}/export/users${queryString}`);
  }

  async exportAnalytics(
    type: 'users' | 'engagement' | 'content' | 'revenue',
    params: AnalyticsParams & { format?: 'csv' | 'xlsx' | 'pdf' } = {}
  ): Promise<
    ApiResponse<{
      downloadUrl: string;
      expiresAt: string;
    }>
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.post(`${this.baseUrl}/export/analytics/${type}${queryString}`);
  }

  // Real-time Monitoring
  async subscribeToLiveStats(callback: (stats: LiveStats) => void): () => void {
    // WebSocket connection for real-time stats
    const ws = new WebSocket(
      `${apiClient.getInstance().defaults.baseURL?.replace('http', 'ws')}/admin/live-stats`
    );

    ws.onmessage = event => {
      try {
        const stats = JSON.parse(event.data);
        callback(stats);
      } catch (error) {
        console.error('Failed to parse live stats:', error);
      }
    };

    ws.onerror = error => {
      console.error('WebSocket error:', error);
    };

    // Return cleanup function
    return () => {
      ws.close();
    };
  }

  // Bulk Operations for Enterprise Scale
  async bulkUserAction(
    action: 'suspend' | 'activate' | 'delete',
    userIds: string[],
    reason?: string
  ): Promise<
    ApiResponse<{
      successful: string[];
      failed: Array<{ userId: string; error: string }>;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/users/bulk/${action}`, {
      userIds,
      reason,
    });
  }

  // Cache Management
  async clearCache(
    type?: 'users' | 'posts' | 'analytics' | 'all'
  ): Promise<ApiResponse<{ message: string }>> {
    const data = type ? { type } : {};
    return apiClient.post(`${this.baseUrl}/cache/clear`, data);
  }

  async getCacheStats(): Promise<
    ApiResponse<{
      totalKeys: number;
      memoryUsage: string;
      hitRate: number;
      missRate: number;
      evictions: number;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/cache/stats`);
  }
}

export const adminService = new AdminService();
export default adminService;
