import { apiClient } from '../core/apiClient';
import { buildQueryString } from '../core/utils';
import {
  AdminStats,
  AdminUser,
  User,
  MessageResponse,
  UserSearchParams,
  PaginatedResponse,
} from '../core/types';

/**
 * Admin Service
 * Handles all admin-related API calls
 */
class AdminService {
  private readonly baseUrl = '/admin';

  /**
   * Get admin dashboard statistics
   */
  async getStats(): Promise<AdminStats> {
    const response = await apiClient.get<AdminStats>(`${this.baseUrl}/stats`);
    return response.data;
  }

  /**
   * Get live admin statistics
   */
  async getLiveStats(): Promise<AdminStats> {
    const response = await apiClient.get<AdminStats>(`${this.baseUrl}/stats/live`);
    return response.data;
  }

  /**
   * Get all users for admin management
   */
  async getAllUsers(params: UserSearchParams = {}): Promise<PaginatedResponse<AdminUser>> {
    const queryString = buildQueryString(params);
    const response = await apiClient.get<PaginatedResponse<AdminUser>>(
      `${this.baseUrl}/users${queryString}`
    );
    return response.data;
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<AdminUser> {
    const response = await apiClient.get<AdminUser>(`${this.baseUrl}/users/${userId}`);
    return response.data;
  }

  /**
   * Update user
   */
  async updateUser(userId: string, userData: Partial<AdminUser>): Promise<AdminUser> {
    const response = await apiClient.put<AdminUser>(`${this.baseUrl}/users/${userId}`, userData);
    return response.data;
  }

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<MessageResponse> {
    const response = await apiClient.delete<MessageResponse>(`${this.baseUrl}/users/${userId}`);
    return response.data;
  }

  /**
   * Activate user
   */
  async activateUser(userId: string): Promise<MessageResponse> {
    const response = await apiClient.patch<MessageResponse>(
      `${this.baseUrl}/users/${userId}/activate`
    );
    return response.data;
  }

  /**
   * Suspend user
   */
  async suspendUser(userId: string, reason?: string): Promise<MessageResponse> {
    const response = await apiClient.patch<MessageResponse>(
      `${this.baseUrl}/users/${userId}/suspend`,
      { reason }
    );
    return response.data;
  }

  /**
   * Get all admins
   */
  async getAllAdmins(): Promise<AdminUser[]> {
    const response = await apiClient.get<AdminUser[]>(`${this.baseUrl}/admins`);
    return response.data;
  }

  /**
   * Get admin by ID
   */
  async getAdminById(adminId: string): Promise<AdminUser> {
    const response = await apiClient.get<AdminUser>(`${this.baseUrl}/admins/${adminId}`);
    return response.data;
  }

  /**
   * Create new admin
   */
  async createAdmin(adminData: Partial<User>): Promise<AdminUser> {
    const response = await apiClient.post<AdminUser>(`${this.baseUrl}/admins`, adminData);
    return response.data;
  }

  /**
   * Update admin
   */
  async updateAdmin(adminId: string, adminData: Partial<AdminUser>): Promise<AdminUser> {
    const response = await apiClient.put<AdminUser>(`${this.baseUrl}/admins/${adminId}`, adminData);
    return response.data;
  }

  /**
   * Delete admin
   */
  async deleteAdmin(adminId: string): Promise<MessageResponse> {
    const response = await apiClient.delete<MessageResponse>(`${this.baseUrl}/admins/${adminId}`);
    return response.data;
  }

  /**
   * Get system information
   */
  async getSystemInfo(): Promise<{
    version: string;
    uptime: number;
    memory: {
      used: number;
      total: number;
    };
    cpu: {
      usage: number;
    };
    database: {
      status: string;
      connections: number;
    };
  }> {
    const response = await apiClient.get<{
      version: string;
      uptime: number;
      memory: { used: number; total: number };
      cpu: { usage: number };
      database: { status: string; connections: number };
    }>(`${this.baseUrl}/system/info`);
    return response.data;
  }

  /**
   * Export users data
   */
  async exportUsers(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/export/users?format=${format}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  /**
   * Export posts data
   */
  async exportPosts(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    const response = await apiClient.get(`${this.baseUrl}/export/posts?format=${format}`, {
      responseType: 'blob',
    });
    return response.data;
  }

  /**
   * Get user growth analytics
   */
  async getUserGrowthAnalytics(period: '7d' | '30d' | '90d' | '1y'): Promise<{
    labels: string[];
    data: number[];
    growth: number;
  }> {
    const response = await apiClient.get<{
      labels: string[];
      data: number[];
      growth: number;
    }>(`${this.baseUrl}/analytics/user-growth?period=${period}`);
    return response.data;
  }

  /**
   * Get engagement analytics
   */
  async getEngagementAnalytics(period: '7d' | '30d' | '90d' | '1y'): Promise<{
    posts: number[];
    comments: number[];
    likes: number[];
    shares: number[];
    labels: string[];
  }> {
    const response = await apiClient.get<{
      posts: number[];
      comments: number[];
      likes: number[];
      shares: number[];
      labels: string[];
    }>(`${this.baseUrl}/analytics/engagement?period=${period}`);
    return response.data;
  }

  /**
   * Get content moderation queue
   */
  async getModerationQueue(): Promise<{
    reportedPosts: any[];
    reportedUsers: any[];
    flaggedContent: any[];
  }> {
    const response = await apiClient.get<{
      reportedPosts: any[];
      reportedUsers: any[];
      flaggedContent: any[];
    }>(`${this.baseUrl}/moderation/queue`);
    return response.data;
  }

  /**
   * Moderate content
   */
  async moderateContent(
    contentId: string,
    action: 'approve' | 'reject' | 'delete',
    reason?: string
  ): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(
      `${this.baseUrl}/moderation/content/${contentId}`,
      {
        action,
        reason,
      }
    );
    return response.data;
  }

  /**
   * Send system notification
   */
  async sendSystemNotification(notification: {
    title: string;
    message: string;
    type: 'info' | 'warning' | 'error' | 'success';
    targetUsers?: string[];
    broadcast?: boolean;
  }): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(
      `${this.baseUrl}/notifications/system`,
      notification
    );
    return response.data;
  }

  /**
   * Update system settings
   */
  async updateSystemSettings(settings: Record<string, any>): Promise<MessageResponse> {
    const response = await apiClient.patch<MessageResponse>(`${this.baseUrl}/settings`, settings);
    return response.data;
  }

  /**
   * Get system settings
   */
  async getSystemSettings(): Promise<Record<string, any>> {
    const response = await apiClient.get<Record<string, any>>(`${this.baseUrl}/settings`);
    return response.data;
  }
}

export const adminService = new AdminService();
export default adminService;
