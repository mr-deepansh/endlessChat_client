import { apiClient } from './core/apiClient';
import type {
  AdminStats,
  AdminUser,
  AnalyticsOverview,
  SuspiciousAccount,
  LoginAttempt,
  UserManagementParams,
  ApiResponse
} from '../types/api';

export interface AdminDashboard {
  stats: AdminStats;
  recentUsers: any[];
  recentPosts: any[];
  systemAlerts: any[];
}

export interface BulkActionData {
  action: 'suspend' | 'activate' | 'delete' | 'verify';
  userIds: string[];
  reason?: string;
  notifyUsers?: boolean;
}

export interface UserActivityLog {
  _id: string;
  userId: string;
  action: string;
  details: any;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
}

export interface SecurityAnalysis {
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  factors: string[];
  recommendations: string[];
  lastLogin: string;
  loginLocations: string[];
  suspiciousActivity: boolean;
}

class AdminService {
  // Get admin dashboard
  async getDashboard(): Promise<ApiResponse<AdminDashboard>> {
    const response = await apiClient.get('/api/v2/admin/dashboard');
    return response.data;
  }

  // Get admin stats
  async getStats(): Promise<ApiResponse<{ stats: AdminStats }>> {
    const response = await apiClient.get('/api/v2/admin/stats');
    return response.data;
  }

  // Get live stats
  async getLiveStats(): Promise<ApiResponse<AdminStats>> {
    const response = await apiClient.get('/api/v2/admin/stats/live');
    return response.data;
  }

  // Get all users (admin view)
  async getAllUsers(params: UserManagementParams): Promise<ApiResponse<{ users: AdminUser[]; pagination: any; filters: any; meta: any }>> {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      limit: params.limit.toString(),
      search: params.search,
      role: params.role,
      isActive: params.status === 'all' ? '' : (params.status === 'active').toString(),
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
    });
    const response = await apiClient.get(`/api/v2/admin/users?${queryParams}`);
    return response.data;
  }

  // Get user by ID (admin)
  async getUserById(id: string): Promise<ApiResponse<{ user: AdminUser }>> {
    const response = await apiClient.get(`/api/v2/admin/users/${id}`);
    return response.data;
  }

  // Update user (admin)
  async updateUser(id: string, data: any): Promise<ApiResponse<{ user: AdminUser }>> {
    const response = await apiClient.put(`/api/v2/admin/users/${id}`, data);
    return response.data;
  }

  // Delete user (admin)
  async deleteUser(id: string, data: { reason: string; confirmPassword?: string; notifyUser?: boolean }): Promise<ApiResponse<any>> {
    const response = await apiClient.delete(`/api/v2/admin/users/${id}`, { data });
    return response.data;
  }

  // Suspend user
  async suspendUser(id: string, data: { reason: string }): Promise<ApiResponse<{ user: AdminUser }>> {
    const response = await apiClient.patch(`/api/v2/admin/users/${id}/suspend`, data);
    return response.data;
  }

  // Activate user
  async activateUser(id: string): Promise<ApiResponse<{ user: AdminUser }>> {
    const response = await apiClient.patch(`/api/v2/admin/users/${id}/activate`);
    return response.data;
  }

  // Verify user account
  async verifyUser(id: string): Promise<ApiResponse<{ user: AdminUser }>> {
    const response = await apiClient.patch(`/api/v2/admin/users/${id}/verify`);
    return response.data;
  }

  // Search users (admin)
  async searchUsers(params: { q?: string; search?: string; username?: string; page?: number; limit?: number; role?: string; isActive?: boolean; sortBy?: string; sortOrder?: string }): Promise<ApiResponse<{ users: AdminUser[]; search: any; pagination: any; meta: any }>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    const response = await apiClient.get(`/api/v2/admin/users/search?${queryParams}`);
    return response.data;
  }

  // Bulk export users
  async exportUsers(params: { format?: string; role?: string; isActive?: boolean; fields?: string; search?: string; limit?: number; sortBy?: string; sortOrder?: string }): Promise<Blob> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        queryParams.append(key, value.toString());
      }
    });
    const response = await apiClient.get(
      `/api/v2/admin/users/export?${queryParams}`,
      {
        responseType: 'blob',
      }
    );
    return response.data;
  }

  // Bulk actions on users
  async bulkActions(data: BulkActionData): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/api/v2/admin/users/bulk-actions', data);
    return response.data;
  }

  // Get user activity log
  async getUserActivityLog(id: string, params?: { page?: number; limit?: number; type?: string }): Promise<ApiResponse<{ activityLog: any }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const response = await apiClient.get(`/api/v2/admin/users/${id}/activity-log?${queryParams}`);
    return response.data;
  }

  // Send notification to user
  async sendNotificationToUser(
    id: string,
    data: {
      title?: string;
      message?: string;
      type?: string;
      priority?: string;
      template?: string;
      templateData?: any;
      channels?: string[];
      scheduleFor?: string;
      trackDelivery?: boolean;
    }
  ): Promise<ApiResponse<any>> {
    const response = await apiClient.post(`/api/v2/admin/users/${id}/notify`, data);
    return response.data;
  }

  // Force password reset
  async forcePasswordReset(id: string, data: { reason: string; notifyUser?: boolean; invalidateAllSessions?: boolean; confirmPassword?: string }): Promise<ApiResponse<any>> {
    const response = await apiClient.post(`/api/v2/admin/users/${id}/force-password-reset`, data);
    return response.data;
  }

  // Get user security analysis
  async getUserSecurityAnalysis(id: string, params?: { includeDevices?: boolean; includeSessions?: boolean }): Promise<ApiResponse<{ user: any; securityAnalysis: SecurityAnalysis; meta: any }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const response = await apiClient.get(`/api/v2/admin/users/${id}/security-analysis?${queryParams}`);
    return response.data;
  }

  // Get all admins
  async getAllAdmins(params?: { page?: number; limit?: number; sortBy?: string; sortOrder?: string; search?: string; status?: string; role?: string }): Promise<ApiResponse<{ admins: AdminUser[]; pagination: any; summary: any; filters: any; metadata: any }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });
    }
    const response = await apiClient.get(`/api/v2/admin/admins?${queryParams}`);
    return response.data;
  }

  // Get admin by ID
  async getAdminById(adminId: string): Promise<ApiResponse<{ admin: any; meta: any }>> {
    const response = await apiClient.get(`/api/v2/admin/admins/${adminId}`);
    return response.data;
  }

  // Analytics endpoints
  async getAnalyticsOverview(params?: { timeRange?: string }): Promise<ApiResponse<AnalyticsOverview>> {
    const queryParams = new URLSearchParams();
    if (params?.timeRange) queryParams.append('timeRange', params.timeRange);
    const response = await apiClient.get(`/api/v2/admin/analytics/overview?${queryParams}`);
    return response.data;
  }

  async getUserGrowthAnalytics(params?: { period?: string; days?: number }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params?.period) queryParams.append('period', params.period);
    if (params?.days) queryParams.append('days', params.days.toString());
    const response = await apiClient.get(`/api/v2/admin/analytics/users/growth?${queryParams}`);
    return response.data;
  }

  async getUserRetentionAnalytics(params?: { cohortPeriod?: string }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params?.cohortPeriod) queryParams.append('cohortPeriod', params.cohortPeriod);
    const response = await apiClient.get(`/api/v2/admin/analytics/users/retention?${queryParams}`);
    return response.data;
  }

  async getUserDemographics(): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/api/v2/admin/analytics/users/demographics');
    return response.data;
  }

  async getEngagementMetrics(params?: { timeRange?: string }): Promise<ApiResponse<any>> {
    const queryParams = new URLSearchParams();
    if (params?.timeRange) queryParams.append('timeRange', params.timeRange);
    const response = await apiClient.get(`/api/v2/admin/analytics/engagement/metrics?${queryParams}`);
    return response.data;
  }

  // Security endpoints
  async getSuspiciousAccounts(params?: { page?: number; limit?: number; riskLevel?: string }): Promise<ApiResponse<SuspiciousAccount[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const response = await apiClient.get(`/api/v2/admin/security/suspicious-accounts?${queryParams}`);
    return response.data;
  }

  async getLoginAttempts(params?: { status?: string; timeRange?: string; limit?: number }): Promise<ApiResponse<LoginAttempt[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const response = await apiClient.get(`/api/v2/admin/security/login-attempts?${queryParams}`);
    return response.data;
  }

  async getBlockedIPs(params?: { page?: number; limit?: number }): Promise<ApiResponse<any[]>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    const response = await apiClient.get(`/api/v2/admin/security/blocked-ips?${queryParams}`);
    return response.data;
  }

  async blockIP(data: { ipAddress: string; reason: string; duration: string }): Promise<ApiResponse<any>> {
    const response = await apiClient.post('/api/v2/admin/security/blocked-ips', data);
    return response.data;
  }

  async unblockIP(ipId: string, data: { reason: string }): Promise<ApiResponse<any>> {
    const response = await apiClient.delete(`/api/v2/admin/security/blocked-ips/${ipId}`, { data });
    return response.data;
  }

  async getThreatDetection(): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/api/v2/admin/security/threat-detection');
    return response.data;
  }

  // Monitoring endpoints
  async getServerHealth(): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/api/v2/admin/monitoring/server-health');
    return response.data;
  }

  async getDatabaseStats(): Promise<ApiResponse<any>> {
    const response = await apiClient.get('/api/v2/admin/monitoring/database-stats');
    return response.data;
  }
}

export const adminService = new AdminService();
export default adminService;
