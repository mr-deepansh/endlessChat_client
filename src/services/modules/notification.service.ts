import { apiClient } from '../core/apiClient';
import type { ApiResponse, PaginatedResponse } from '../../types/api';

export interface Notification {
  _id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'repost' | 'system' | 'security';
  title: string;
  message: string;
  data?: Record<string, any>;
  sender?: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  recipient: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  updatedAt: string;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
}

export interface NotificationPreferences {
  email: {
    likes: boolean;
    comments: boolean;
    follows: boolean;
    mentions: boolean;
    reposts: boolean;
    system: boolean;
  };
  push: {
    likes: boolean;
    comments: boolean;
    follows: boolean;
    mentions: boolean;
    reposts: boolean;
    system: boolean;
  };
  inApp: {
    likes: boolean;
    comments: boolean;
    follows: boolean;
    mentions: boolean;
    reposts: boolean;
    system: boolean;
  };
}

class NotificationService {
  private readonly baseUrl = '/notifications';

  async getNotifications(
    params: {
      page?: number;
      limit?: number;
      type?: string;
      isRead?: boolean;
      priority?: string;
    } = {}
  ): Promise<{
    notifications: Notification[];
    pagination: {
      totalCount: number;
      totalPages: number;
      currentPage: number;
      hasNext: boolean;
      hasPrev: boolean;
    };
    unreadCount: number;
  }> {
    const queryString = new URLSearchParams();
    if (params.page) queryString.append('page', params.page.toString());
    if (params.limit) queryString.append('limit', params.limit.toString());
    if (params.type) queryString.append('type', params.type);
    if (params.isRead !== undefined) queryString.append('isRead', params.isRead.toString());
    if (params.priority) queryString.append('priority', params.priority);

    const response = await apiClient.get(`${this.baseUrl}?${queryString}`);
    return response.data.data;
  }

  async getUnreadCount(): Promise<{ unreadCount: number }> {
    const response = await apiClient.get(`${this.baseUrl}/unread-count`);
    return response.data.data;
  }

  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.patch(`${this.baseUrl}/${notificationId}/read`);
  }

  async markAllAsRead(): Promise<{ modifiedCount: number }> {
    const response = await apiClient.patch(`${this.baseUrl}/mark-all-read`);
    return response.data.data;
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete(`${this.baseUrl}/${notificationId}`);
  }

  async clearAllNotifications(): Promise<{ deletedCount: number }> {
    const response = await apiClient.delete(`${this.baseUrl}/clear-all`);
    return response.data.data;
  }

  async getNotificationStats(): Promise<NotificationStats> {
    const response = await apiClient.get(`${this.baseUrl}/stats`);
    return response.data.data;
  }

  async getNotificationPreferences(): Promise<NotificationPreferences> {
    const response = await apiClient.get(`${this.baseUrl}/preferences`);
    return response.data.data;
  }

  async updateNotificationPreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    const response = await apiClient.put(`${this.baseUrl}/preferences`, preferences);
    return response.data.data;
  }

  async createTestNotification(data: {
    type?: string;
    targetUserId?: string;
  }): Promise<Notification> {
    const response = await apiClient.post(`${this.baseUrl}/test/create`, data);
    return response.data.data;
  }
}

export const notificationService = new NotificationService();
export default notificationService;
