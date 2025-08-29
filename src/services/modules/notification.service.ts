import { apiClient } from '../core/apiClient';
import { ApiResponse, User, BaseQueryParams } from '../../types/api';

interface Notification {
  _id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'repost' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  sender?: User;
  isRead: boolean;
  createdAt: string;
  readAt?: string;
}

interface NotificationPreferences {
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

  // Get Notifications
  async getNotifications(
    params: {
      page?: number;
      limit?: number;
      type?: 'all' | 'following' | 'you';
      filter?: 'like' | 'comment' | 'follow' | 'mention' | 'repost' | 'system';
      unreadOnly?: boolean;
    } = {}
  ): Promise<ApiResponse<Notification[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<Notification[]>(`${this.baseUrl}${queryString}`);
  }

  async getUnreadCount(): Promise<
    ApiResponse<{
      total: number;
      byType: Record<string, number>;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/unread-count`);
  }

  // Mark as Read/Unread
  async markAsRead(notificationId: string): Promise<ApiResponse<void>> {
    return apiClient.patch(`${this.baseUrl}/${notificationId}/read`);
  }

  async markAsUnread(notificationId: string): Promise<ApiResponse<void>> {
    return apiClient.patch(`${this.baseUrl}/${notificationId}/unread`);
  }

  async markAllAsRead(): Promise<
    ApiResponse<{
      markedCount: number;
    }>
  > {
    return apiClient.patch(`${this.baseUrl}/mark-all-read`);
  }

  async markMultipleAsRead(notificationIds: string[]): Promise<
    ApiResponse<{
      markedCount: number;
      failed: string[];
    }>
  > {
    return apiClient.patch(`${this.baseUrl}/mark-multiple-read`, {
      notificationIds,
    });
  }

  // Delete Notifications
  async deleteNotification(notificationId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.baseUrl}/${notificationId}`);
  }

  async deleteMultipleNotifications(notificationIds: string[]): Promise<
    ApiResponse<{
      deletedCount: number;
      failed: string[];
    }>
  > {
    return apiClient.delete(`${this.baseUrl}/bulk-delete`, {
      data: { notificationIds },
    });
  }

  async clearAllNotifications(): Promise<
    ApiResponse<{
      deletedCount: number;
    }>
  > {
    return apiClient.delete(`${this.baseUrl}/clear-all`);
  }

  // Notification Preferences
  async getPreferences(): Promise<ApiResponse<NotificationPreferences>> {
    return apiClient.get<NotificationPreferences>(`${this.baseUrl}/preferences`);
  }

  async updatePreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<ApiResponse<NotificationPreferences>> {
    return apiClient.put<NotificationPreferences>(`${this.baseUrl}/preferences`, preferences);
  }

  async updateChannelPreferences(
    channel: 'email' | 'push' | 'inApp',
    preferences: Record<string, boolean>
  ): Promise<ApiResponse<void>> {
    return apiClient.patch(`${this.baseUrl}/preferences/${channel}`, preferences);
  }

  // Push Notifications
  async subscribeToPush(subscription: {
    endpoint: string;
    keys: {
      p256dh: string;
      auth: string;
    };
  }): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.baseUrl}/push/subscribe`, subscription);
  }

  async unsubscribeFromPush(): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.baseUrl}/push/unsubscribe`);
  }

  async testPushNotification(): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.baseUrl}/push/test`);
  }

  // Real-time Notifications (WebSocket)
  private eventSource: EventSource | null = null;

  connectToRealTime(onNotification: (notification: Notification) => void): void {
    if (this.eventSource) {
      this.eventSource.close();
    }

    const token = localStorage.getItem('auth_token');
    if (!token) return;

    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/v1';
    this.eventSource = new EventSource(`${baseUrl}/notifications/stream?token=${token}`);

    this.eventSource.onmessage = event => {
      try {
        const notification = JSON.parse(event.data);
        onNotification(notification);
      } catch (error) {
        console.error('Failed to parse notification:', error);
      }
    };

    this.eventSource.onerror = error => {
      console.error('Notification stream error:', error);
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (this.eventSource?.readyState === EventSource.CLOSED) {
          this.connectToRealTime(onNotification);
        }
      }, 5000);
    };
  }

  disconnectFromRealTime(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }

  // Notification Analytics
  async getNotificationStats(
    params: {
      timeRange?: '7d' | '30d' | '90d';
    } = {}
  ): Promise<
    ApiResponse<{
      totalSent: number;
      totalRead: number;
      readRate: number;
      byType: Record<
        string,
        {
          sent: number;
          read: number;
          readRate: number;
        }
      >;
      byChannel: Record<
        string,
        {
          sent: number;
          delivered: number;
          opened: number;
        }
      >;
      timeline: Array<{
        date: string;
        sent: number;
        read: number;
      }>;
    }>
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/stats${queryString}`);
  }

  // Notification Templates (for admin use)
  async getTemplates(): Promise<
    ApiResponse<
      Array<{
        _id: string;
        name: string;
        type: string;
        subject: string;
        content: string;
        variables: string[];
        isActive: boolean;
      }>
    >
  > {
    return apiClient.get(`${this.baseUrl}/templates`);
  }

  // Mute/Unmute Users
  async muteUser(userId: string): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.baseUrl}/mute/${userId}`);
  }

  async unmuteUser(userId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.baseUrl}/mute/${userId}`);
  }

  async getMutedUsers(params: BaseQueryParams = {}): Promise<ApiResponse<User[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<User[]>(`${this.baseUrl}/muted${queryString}`);
  }

  // Notification Scheduling
  async scheduleNotification(data: {
    type: string;
    title: string;
    message: string;
    scheduledAt: string;
    recipients?: string[];
    data?: Record<string, any>;
  }): Promise<
    ApiResponse<{
      _id: string;
      scheduledAt: string;
      status: 'scheduled' | 'sent' | 'failed';
    }>
  > {
    return apiClient.post(`${this.baseUrl}/schedule`, data);
  }

  async getScheduledNotifications(params: BaseQueryParams = {}): Promise<
    ApiResponse<
      Array<{
        _id: string;
        type: string;
        title: string;
        message: string;
        scheduledAt: string;
        status: 'scheduled' | 'sent' | 'failed';
        recipientCount: number;
        createdAt: string;
      }>
    >
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/scheduled${queryString}`);
  }

  async cancelScheduledNotification(notificationId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.baseUrl}/scheduled/${notificationId}`);
  }

  // Notification History
  async getNotificationHistory(
    params: {
      page?: number;
      limit?: number;
      type?: string;
      startDate?: string;
      endDate?: string;
    } = {}
  ): Promise<
    ApiResponse<
      Array<{
        _id: string;
        type: string;
        title: string;
        message: string;
        channel: 'email' | 'push' | 'inApp';
        status: 'sent' | 'delivered' | 'read' | 'failed';
        sentAt: string;
        readAt?: string;
        error?: string;
      }>
    >
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/history${queryString}`);
  }

  // Utility Methods
  async testNotification(type: string, data?: Record<string, any>): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.baseUrl}/test`, { type, data });
  }

  async exportNotifications(
    params: {
      format?: 'csv' | 'json';
      startDate?: string;
      endDate?: string;
      type?: string;
    } = {}
  ): Promise<
    ApiResponse<{
      downloadUrl: string;
      expiresAt: string;
    }>
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.post(`${this.baseUrl}/export${queryString}`);
  }
}

export const notificationService = new NotificationService();
export default notificationService;
