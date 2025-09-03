// services/api/admin.service.ts
import { api, withErrorHandling, ApiResponse } from '../services/api';

class AdminApiService {
  // =============================================================================
  // 📊 ANALYTICS METHODS
  // =============================================================================
  async getAnalyticsOverview(params?: {
    startDate?: string;
    endDate?: string;
    granularity?: string;
  }) {
    return withErrorHandling(() => api.get<ApiResponse>('/admin/analytics/overview', { params }));
  }

  async getUserGrowthAnalytics(params?: { period?: string; segment?: string }) {
    return withErrorHandling(() =>
      api.get<ApiResponse>('/admin/analytics/users/growth', { params })
    );
  }

  async getUserRetentionMetrics(params?: { cohort?: string; period?: string }) {
    return withErrorHandling(() =>
      api.get<ApiResponse>('/admin/analytics/users/retention', { params })
    );
  }

  async exportReport(params: {
    type: string;
    format: 'csv' | 'xlsx' | 'pdf';
    startDate?: string;
    endDate?: string;
  }) {
    return withErrorHandling(() =>
      api.get('/admin/reports/export', {
        params,
        responseType: 'blob',
      })
    );
  }

  // =============================================================================
  // 👥 USER MANAGEMENT METHODS
  // =============================================================================
  async getUsers(params?: {
    page?: number;
    limit?: number;
    search?: string;
    role?: string;
    status?: string;
  }) {
    return withErrorHandling(() => api.get<ApiResponse>('/admin/users', { params }));
  }

  async getUserDetails(userId: string) {
    return withErrorHandling(() => api.get<ApiResponse>(`/admin/users/${userId}`));
  }

  async updateUser(
    userId: string,
    data: {
      name?: string;
      email?: string;
      role?: string;
      status?: string;
    }
  ) {
    return withErrorHandling(() => api.put<ApiResponse>(`/admin/users/${userId}`, data));
  }

  async suspendUser(
    userId: string,
    data: {
      reason: string;
      duration?: number;
    }
  ) {
    return withErrorHandling(() => api.patch<ApiResponse>(`/admin/users/${userId}/suspend`, data));
  }

  async activateUser(userId: string) {
    return withErrorHandling(() => api.patch<ApiResponse>(`/admin/users/${userId}/activate`));
  }

  async deleteUser(userId: string) {
    return withErrorHandling(() => api.delete<ApiResponse>(`/admin/users/${userId}`));
  }

  async getUserActivityLog(
    userId: string,
    params?: {
      startDate?: string;
      endDate?: string;
      type?: string;
    }
  ) {
    return withErrorHandling(() =>
      api.get<ApiResponse>(`/admin/users/${userId}/activity-log`, { params })
    );
  }

  async bulkUserActions(data: {
    userIds: string[];
    action: 'suspend' | 'activate' | 'delete' | 'update_role';
    params?: Record<string, any>;
  }) {
    return withErrorHandling(() => api.post<ApiResponse>('/admin/users/bulk-actions', data));
  }

  // =============================================================================
  // 🛡️ SECURITY & MODERATION METHODS
  // =============================================================================
  async getSuspiciousAccounts(params?: { severity?: string; status?: string; limit?: number }) {
    return withErrorHandling(() =>
      api.get<ApiResponse>('/admin/security/suspicious-accounts', { params })
    );
  }

  async getLoginAttempts(params?: { ip?: string; user_id?: string; time_range?: string }) {
    return withErrorHandling(() =>
      api.get<ApiResponse>('/admin/security/login-attempts', { params })
    );
  }

  async blockIpAddress(data: { ip: string; reason: string; duration?: number }) {
    return withErrorHandling(() => api.post<ApiResponse>('/admin/security/block-ip', data));
  }

  async getReportedContent(params?: { status?: string; type?: string; severity?: string }) {
    return withErrorHandling(() =>
      api.get<ApiResponse>('/admin/moderation/reported-content', { params })
    );
  }

  async reviewContent(data: {
    contentId: string;
    action: 'approve' | 'reject' | 'escalate';
    reason?: string;
  }) {
    return withErrorHandling(() => api.post<ApiResponse>('/admin/moderation/review-content', data));
  }

  // =============================================================================
  // 🚨 CONTENT MANAGEMENT METHODS
  // =============================================================================
  async getPosts(params?: {
    status?: string;
    author?: string;
    category?: string;
    sort?: string;
    page?: number;
  }) {
    return withErrorHandling(() => api.get<ApiResponse>('/admin/content/posts', { params }));
  }

  async getReportedPosts() {
    return withErrorHandling(() => api.get<ApiResponse>('/admin/content/posts/reported'));
  }

  async getTrendingPosts(params?: { timeframe?: string; limit?: number }) {
    return withErrorHandling(() =>
      api.get<ApiResponse>('/admin/content/posts/trending', { params })
    );
  }

  async deletePost(postId: string) {
    return withErrorHandling(() => api.delete<ApiResponse>(`/admin/content/posts/${postId}`));
  }

  async hidePost(postId: string, reason: string) {
    return withErrorHandling(() =>
      api.patch<ApiResponse>(`/admin/content/posts/${postId}/hide`, { reason })
    );
  }

  async featurePost(postId: string) {
    return withErrorHandling(() =>
      api.patch<ApiResponse>(`/admin/content/posts/${postId}/feature`)
    );
  }

  // =============================================================================
  // 🎛️ SYSTEM CONFIGURATION METHODS
  // =============================================================================
  async getAppSettings() {
    return withErrorHandling(() => api.get<ApiResponse>('/admin/config/app-settings'));
  }

  async updateAppSettings(settings: Record<string, any>) {
    return withErrorHandling(() =>
      api.put<ApiResponse>('/admin/config/app-settings', { settings })
    );
  }

  async getFeatureFlags() {
    return withErrorHandling(() => api.get<ApiResponse>('/admin/config/feature-flags'));
  }

  async toggleFeatureFlag(
    flag: string,
    data: {
      enabled: boolean;
      config?: Record<string, any>;
    }
  ) {
    return withErrorHandling(() =>
      api.put<ApiResponse>(`/admin/config/feature-flags/${flag}`, data)
    );
  }

  async getSystemHealth() {
    return withErrorHandling(() => api.get<ApiResponse>('/admin/system/health'));
  }
}

export const adminApiService = new AdminApiService();
export default adminApiService;
