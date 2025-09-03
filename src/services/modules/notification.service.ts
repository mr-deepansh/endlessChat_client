import { notificationsApi as apiClient } from '../core/serviceClients';
import type { ApiResponse, PaginatedResponse, SearchParams } from '../../types/api';

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'repost' | 'system' | 'security';
  title: string;
  message: string;
  data?: Record<string, any>;
  actor?: {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  target?: {
    type: 'post' | 'comment' | 'user';
    id: string;
    title?: string;
  };
  isRead: boolean;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  channels: Array<'in-app' | 'email' | 'push' | 'sms'>;
  createdAt: string;
  readAt?: string;
  expiresAt?: string;
}

export interface NotificationPreferences {
  email: {
    enabled: boolean;
    frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
    types: {
      likes: boolean;
      comments: boolean;
      follows: boolean;
      mentions: boolean;
      reposts: boolean;
      system: boolean;
      marketing: boolean;
    };
  };
  push: {
    enabled: boolean;
    types: {
      likes: boolean;
      comments: boolean;
      follows: boolean;
      mentions: boolean;
      reposts: boolean;
      system: boolean;
    };
  };
  inApp: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
    types: {
      likes: boolean;
      comments: boolean;
      follows: boolean;
      mentions: boolean;
      reposts: boolean;
      system: boolean;
    };
  };
  sms: {
    enabled: boolean;
    types: {
      security: boolean;
      urgent: boolean;
    };
  };
  quietHours: {
    enabled: boolean;
    start: string; // HH:mm format
    end: string; // HH:mm format
    timezone: string;
  };
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<string, number>;
  byPriority: Record<string, number>;
  todayCount: number;
  weekCount: number;
}

class NotificationService {
  private readonly baseUrl = '/notifications';
  private eventSource: EventSource | null = null;
  private listeners: Set<(notification: Notification) => void> = new Set();

  // Notification Management
  async getNotifications(
    params: {
      type?: 'all' | 'following' | 'you' | 'system';
      status?: 'all' | 'unread' | 'read';
      priority?: 'low' | 'normal' | 'high' | 'urgent';
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ApiResponse<PaginatedResponse<Notification>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<PaginatedResponse<Notification>>(`${this.baseUrl}${queryString}`);
  }

  async getNotificationById(notificationId: string): Promise<ApiResponse<Notification>> {
    return apiClient.get<Notification>(`${this.baseUrl}/${notificationId}`);
  }

  async markAsRead(notificationId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.patch(`${this.baseUrl}/${notificationId}/read`);
  }

  async markAsUnread(notificationId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.patch(`${this.baseUrl}/${notificationId}/unread`);
  }

  async markAllAsRead(type?: string): Promise<
    ApiResponse<{
      message: string;
      updatedCount: number;
    }>
  > {
    const data = type ? { type } : {};
    return apiClient.patch(`${this.baseUrl}/mark-all-read`, data);
  }

  async deleteNotification(notificationId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`${this.baseUrl}/${notificationId}`);
  }

  async deleteAllNotifications(type?: string): Promise<
    ApiResponse<{
      message: string;
      deletedCount: number;
    }>
  > {
    const data = type ? { type } : {};
    return apiClient.delete(`${this.baseUrl}/delete-all`, { data });
  }

  // Notification Statistics
  async getNotificationStats(): Promise<ApiResponse<NotificationStats>> {
    return apiClient.get<NotificationStats>(`${this.baseUrl}/stats`);
  }

  async getUnreadCount(): Promise<ApiResponse<{ count: number }>> {
    return apiClient.get(`${this.baseUrl}/unread-count`);
  }

  // Notification Preferences
  async getPreferences(): Promise<ApiResponse<NotificationPreferences>> {
    return apiClient.get(`${this.baseUrl}/preferences`);
  }

  async updatePreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put(`${this.baseUrl}/preferences`, preferences);
  }

  async updateEmailPreferences(
    emailPrefs: Partial<NotificationPreferences['email']>
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.patch(`${this.baseUrl}/preferences/email`, emailPrefs);
  }

  async updatePushPreferences(
    pushPrefs: Partial<NotificationPreferences['push']>
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.patch(`${this.baseUrl}/preferences/push`, pushPrefs);
  }

  // Push Notification Management
  async registerPushDevice(data: {
    token: string;
    platform: 'web' | 'ios' | 'android';
    deviceInfo?: {
      model?: string;
      os?: string;
      browser?: string;
    };
  }): Promise<
    ApiResponse<{
      deviceId: string;
      message: string;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/push/register`, data);
  }

  async unregisterPushDevice(deviceId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`${this.baseUrl}/push/devices/${deviceId}`);
  }

  async getPushDevices(): Promise<
    ApiResponse<
      Array<{
        id: string;
        platform: string;
        deviceInfo: any;
        registeredAt: string;
        lastUsed: string;
        isActive: boolean;
      }>
    >
  > {
    return apiClient.get(`${this.baseUrl}/push/devices`);
  }

  async testPushNotification(deviceId?: string): Promise<ApiResponse<{ message: string }>> {
    const data = deviceId ? { deviceId } : {};
    return apiClient.post(`${this.baseUrl}/push/test`, data);
  }

  // Email Notifications
  async subscribeToEmailNotifications(email?: string): Promise<ApiResponse<{ message: string }>> {
    const data = email ? { email } : {};
    return apiClient.post(`${this.baseUrl}/email/subscribe`, data);
  }

  async unsubscribeFromEmailNotifications(
    token?: string
  ): Promise<ApiResponse<{ message: string }>> {
    const data = token ? { token } : {};
    return apiClient.post(`${this.baseUrl}/email/unsubscribe`, data);
  }

  async getEmailSubscriptionStatus(): Promise<
    ApiResponse<{
      isSubscribed: boolean;
      email: string;
      subscribedAt?: string;
      unsubscribedAt?: string;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/email/status`);
  }

  // Custom Notifications
  async createCustomNotification(data: {
    title: string;
    message: string;
    type?: string;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
    channels?: Array<'in-app' | 'email' | 'push'>;
    scheduledAt?: string;
    expiresAt?: string;
    data?: Record<string, any>;
  }): Promise<ApiResponse<Notification>> {
    return apiClient.post<Notification>(`${this.baseUrl}/custom`, data);
  }

  // Notification Templates (for admin use)
  async getNotificationTemplates(): Promise<
    ApiResponse<
      Array<{
        id: string;
        name: string;
        type: string;
        channels: string[];
        template: {
          title: string;
          message: string;
          variables: string[];
        };
        isActive: boolean;
      }>
    >
  > {
    return apiClient.get(`${this.baseUrl}/templates`);
  }

  // Real-time Notifications
  async subscribeToRealTimeNotifications(
    callback: (notification: Notification) => void
  ): () => void {
    this.listeners.add(callback);

    if (!this.eventSource) {
      this.setupEventSource();
    }

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
      if (this.listeners.size === 0 && this.eventSource) {
        this.eventSource.close();
        this.eventSource = null;
      }
    };
  }

  private setupEventSource(): void {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    const baseUrl = apiClient.getInstance().defaults.baseURL;
    this.eventSource = new EventSource(`${baseUrl}/notifications/stream?token=${token}`);

    this.eventSource.onmessage = event => {
      try {
        const notification: Notification = JSON.parse(event.data);
        this.listeners.forEach(callback => callback(notification));
      } catch (error) {
        console.error('Failed to parse notification:', error);
      }
    };

    this.eventSource.onerror = error => {
      console.error('Notification stream error:', error);
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (this.listeners.size > 0) {
          this.setupEventSource();
        }
      }, 5000);
    };
  }

  // Notification Actions
  async performNotificationAction(
    notificationId: string,
    action: string,
    data?: any
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`${this.baseUrl}/${notificationId}/actions/${action}`, data);
  }

  // Notification History
  async getNotificationHistory(
    params: {
      startDate?: string;
      endDate?: string;
      type?: string;
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ApiResponse<PaginatedResponse<Notification>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<PaginatedResponse<Notification>>(`${this.baseUrl}/history${queryString}`);
  }

  // Notification Analytics
  async getNotificationAnalytics(timeRange: '7d' | '30d' | '90d' = '30d'): Promise<
    ApiResponse<{
      deliveryStats: {
        sent: number;
        delivered: number;
        opened: number;
        clicked: number;
        failed: number;
      };
      channelPerformance: Record<
        string,
        {
          sent: number;
          delivered: number;
          openRate: number;
          clickRate: number;
        }
      >;
      typePerformance: Record<
        string,
        {
          sent: number;
          engagementRate: number;
        }
      >;
      trends: Array<{
        date: string;
        sent: number;
        delivered: number;
        opened: number;
      }>;
    }>
  > {
    const queryString = apiClient.buildQueryString({ timeRange });
    return apiClient.get(`${this.baseUrl}/analytics${queryString}`);
  }

  // Notification Scheduling
  async scheduleNotification(data: {
    title: string;
    message: string;
    scheduledAt: string;
    recipients?: string[] | 'all' | 'active';
    type?: string;
    channels?: Array<'in-app' | 'email' | 'push'>;
    priority?: 'low' | 'normal' | 'high' | 'urgent';
  }): Promise<
    ApiResponse<{
      scheduleId: string;
      message: string;
      scheduledAt: string;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/schedule`, data);
  }

  async getScheduledNotifications(
    params: SearchParams = {}
  ): Promise<ApiResponse<PaginatedResponse<any>>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.baseUrl}/scheduled${queryString}`);
  }

  async cancelScheduledNotification(scheduleId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`${this.baseUrl}/scheduled/${scheduleId}`);
  }

  // Notification Digest
  async getNotificationDigest(period: 'daily' | 'weekly' | 'monthly'): Promise<
    ApiResponse<{
      period: string;
      summary: {
        totalNotifications: number;
        newFollowers: number;
        postEngagement: number;
        mentions: number;
      };
      highlights: Array<{
        type: string;
        message: string;
        data: any;
      }>;
      topPosts: Array<{
        id: string;
        content: string;
        engagement: number;
      }>;
    }>
  > {
    return apiClient.get(`${this.baseUrl}/digest/${period}`);
  }

  async subscribeToDigest(
    period: 'daily' | 'weekly' | 'monthly',
    enabled: boolean
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.post(`${this.baseUrl}/digest/${period}/subscribe`, { enabled });
  }

  // Notification Filters
  async createNotificationFilter(filter: {
    name: string;
    conditions: Array<{
      field: string;
      operator: 'equals' | 'contains' | 'starts_with' | 'ends_with';
      value: string;
    }>;
    actions: Array<{
      type: 'mark_read' | 'delete' | 'move_to_folder' | 'set_priority';
      value?: string;
    }>;
  }): Promise<ApiResponse<{ filterId: string; message: string }>> {
    return apiClient.post(`${this.baseUrl}/filters`, filter);
  }

  async getNotificationFilters(): Promise<ApiResponse<Array<any>>> {
    return apiClient.get(`${this.baseUrl}/filters`);
  }

  async updateNotificationFilter(
    filterId: string,
    filter: any
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.put(`${this.baseUrl}/filters/${filterId}`, filter);
  }

  async deleteNotificationFilter(filterId: string): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete(`${this.baseUrl}/filters/${filterId}`);
  }

  // Notification Folders/Categories
  async createNotificationFolder(
    name: string,
    description?: string
  ): Promise<
    ApiResponse<{
      folderId: string;
      message: string;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/folders`, { name, description });
  }

  async getNotificationFolders(): Promise<
    ApiResponse<
      Array<{
        id: string;
        name: string;
        description?: string;
        count: number;
        unreadCount: number;
      }>
    >
  > {
    return apiClient.get(`${this.baseUrl}/folders`);
  }

  async moveNotificationToFolder(
    notificationId: string,
    folderId: string
  ): Promise<ApiResponse<{ message: string }>> {
    return apiClient.patch(`${this.baseUrl}/${notificationId}/move`, { folderId });
  }

  // Bulk Operations
  async bulkMarkAsRead(notificationIds: string[]): Promise<
    ApiResponse<{
      successful: string[];
      failed: Array<{ notificationId: string; error: string }>;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/bulk/mark-read`, { notificationIds });
  }

  async bulkDeleteNotifications(notificationIds: string[]): Promise<
    ApiResponse<{
      successful: string[];
      failed: Array<{ notificationId: string; error: string }>;
    }>
  > {
    return apiClient.post(`${this.baseUrl}/bulk/delete`, { notificationIds });
  }

  // Notification Export
  async exportNotifications(
    params: {
      format?: 'json' | 'csv';
      startDate?: string;
      endDate?: string;
      type?: string;
    } = {}
  ): Promise<
    ApiResponse<{
      downloadUrl: string;
      expiresAt: string;
      recordCount: number;
    }>
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.post(`${this.baseUrl}/export${queryString}`);
  }

  // Cleanup
  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.listeners.clear();
  }
}

export const notificationService = new NotificationService();
export default notificationService;
