import api from './api';

export interface AdminStats {
  users: {
    total: number;
    active: number;
    inactive: number;
    newToday: number;
    newThisWeek: number;
    newThisMonth: number;
  };
  posts: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  engagement: {
    totalLikes: number;
    totalComments: number;
    totalReposts: number;
    totalViews: number;
  };
  system: {
    uptime: string;
    memoryUsage: number;
    cpuUsage: number;
    diskUsage: number;
  };
}

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
  async getDashboard(): Promise<AdminDashboard> {
    const response = await api.get('/admin/dashboard');
    return response.data.data;
  }

  // Get admin stats
  async getStats(): Promise<AdminStats> {
    const response = await api.get('/admin/stats');
    return response.data.data;
  }

  // Get live stats
  async getLiveStats(): Promise<AdminStats> {
    const response = await api.get('/admin/stats/live');
    return response.data.data;
  }

  // Get all users (admin view)
  async getAllUsers(page = 1, limit = 20, filters?: any): Promise<any> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });
    const response = await api.get(`/admin/users?${params}`);
    return response.data.data;
  }

  // Get user by ID (admin)
  async getUserById(id: string): Promise<any> {
    const response = await api.get(`/admin/users/${id}`);
    return response.data.data;
  }

  // Update user (admin)
  async updateUser(id: string, data: any): Promise<any> {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data.data;
  }

  // Delete user (admin)
  async deleteUser(id: string): Promise<void> {
    await api.delete(`/admin/users/${id}`);
  }

  // Suspend user
  async suspendUser(id: string, reason: string): Promise<void> {
    await api.patch(`/admin/users/${id}/suspend`, { reason });
  }

  // Activate user
  async activateUser(id: string): Promise<void> {
    await api.patch(`/admin/users/${id}/activate`);
  }

  // Verify user account
  async verifyUser(id: string): Promise<void> {
    await api.patch(`/admin/users/${id}/verify`);
  }

  // Search users (admin)
  async searchUsers(query: string, page = 1, limit = 20, role?: string): Promise<any> {
    const params = new URLSearchParams({
      query,
      page: page.toString(),
      limit: limit.toString(),
    });
    if (role) params.append('role', role);

    const response = await api.get(`/admin/users/search?${params}`);
    return response.data.data;
  }

  // Bulk export users
  async exportUsers(format = 'csv', filters = 'active'): Promise<Blob> {
    const response = await api.get(`/admin/users/export?format=${format}&filters=${filters}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  // Bulk actions on users
  async bulkActions(data: BulkActionData): Promise<void> {
    await api.post('/admin/users/bulk-actions', data);
  }

  // Get user activity log
  async getUserActivityLog(id: string, page = 1, limit = 50, type?: string): Promise<any> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (type) params.append('type', type);

    const response = await api.get(`/admin/users/${id}/activity-log?${params}`);
    return response.data.data;
  }

  // Send notification to user
  async sendNotificationToUser(id: string, data: {
    type: string;
    title: string;
    message: string;
    channels: string[];
  }): Promise<void> {
    await api.post(`/admin/users/${id}/notify`, data);
  }

  // Force password reset
  async forcePasswordReset(id: string, reason: string): Promise<void> {
    await api.post(`/admin/users/${id}/force-password-reset`, { reason });
  }

  // Get user security analysis
  async getUserSecurityAnalysis(id: string): Promise<SecurityAnalysis> {
    const response = await api.get(`/admin/users/${id}/security-analysis`);
    return response.data.data;
  }

  // Get all admins
  async getAllAdmins(): Promise<any> {
    const response = await api.get('/admin/admins');
    return response.data.data;
  }

  // Get admin by ID
  async getAdminById(adminId: string): Promise<any> {
    const response = await api.get(`/admin/admins/${adminId}`);
    return response.data.data;
  }

  // Analytics endpoints
  async getSessionAnalytics(timeRange = '30d'): Promise<any> {
    const response = await api.get(`/admin/sessions/analytics?timeRange=${timeRange}`);
    return response.data.data;
  }

  async getAnalyticsOverview(timeRange = '30d'): Promise<any> {
    const response = await api.get(`/admin/analytics/overview?timeRange=${timeRange}`);
    return response.data.data;
  }

  async getUserGrowthAnalytics(period = 'daily', days = 30): Promise<any> {
    const response = await api.get(`/admin/analytics/users/growth?period=${period}&days=${days}`);
    return response.data.data;
  }

  async getUserRetentionAnalytics(period = 'weekly', weeks = 12): Promise<any> {
    const response = await api.get(`/admin/analytics/users/retention?period=${period}&weeks=${weeks}`);
    return response.data.data;
  }

  async getUserDemographics(): Promise<any> {
    const response = await api.get('/admin/analytics/users/demographics');
    return response.data.data;
  }

  async getEngagementMetrics(timeRange = '30d', metric = 'all'): Promise<any> {
    const response = await api.get(`/admin/analytics/engagement/metrics?timeRange=${timeRange}&metric=${metric}`);
    return response.data.data;
  }

  // Security endpoints
  async getSuspiciousAccounts(page = 1, limit = 20, riskLevel = 'high'): Promise<any> {
    const response = await api.get(`/admin/security/suspicious-accounts?page=${page}&limit=${limit}&riskLevel=${riskLevel}`);
    return response.data.data;
  }

  async getLoginAttempts(status = 'failed', timeRange = '24h'): Promise<any> {
    const response = await api.get(`/admin/security/login-attempts?status=${status}&timeRange=${timeRange}`);
    return response.data.data;
  }

  async getBlockedIPs(page = 1, limit = 20): Promise<any> {
    const response = await api.get(`/admin/security/blocked-ips?page=${page}&limit=${limit}`);
    return response.data.data;
  }

  async blockIP(data: { ipAddress: string; reason: string; duration: string }): Promise<void> {
    await api.post('/admin/security/blocked-ips', data);
  }

  async unblockIP(ipId: string, reason: string): Promise<void> {
    await api.delete(`/admin/security/blocked-ips/${ipId}`, { data: { reason } });
  }

  async getThreatDetection(): Promise<any> {
    const response = await api.get('/admin/security/threat-detection');
    return response.data.data;
  }
}

export default new AdminService();