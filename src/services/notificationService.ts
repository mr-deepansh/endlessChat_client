/**
 * Enterprise-grade Notification Service
 * Handles all notification-related operations with caching, error handling, and security
 * @module NotificationService
 */

import { apiClient } from './core/apiClient';
import Logger from '../utils/logger';

// ==================== Types ====================

export type NotificationType =
  | 'like'
  | 'comment'
  | 'follow'
  | 'unfollow'
  | 'repost'
  | 'mention'
  | 'system';
export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface NotificationUser {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatar?: string | null;
}

export interface Notification {
  _id: string;
  type: NotificationType;
  message: string;
  from: NotificationUser;
  sender?: NotificationUser;
  recipient?: string;
  to?: string;
  postId?: string;
  postContent?: string;
  postImage?: string;
  isRead: boolean;
  priority: NotificationPriority;
  data?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  notifications: Notification[];
  totalNotifications: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  unreadCount: number;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
}

export interface NotificationPreferences {
  email: Record<NotificationType, boolean>;
  push: Record<NotificationType, boolean>;
  inApp: Record<NotificationType, boolean>;
}

export interface NotificationFilters {
  page?: number;
  limit?: number;
  type?: NotificationType;
  isRead?: boolean;
  priority?: NotificationPriority;
}

// ==================== Service ====================

class NotificationService {
  private readonly BASE_PATH = '/notifications';
  private readonly DEFAULT_LIMIT = 20;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  private readonly CACHE_TTL = 30000; // 30 seconds

  /**
   * Get notifications with filters and pagination
   */
  async getNotifications(filters: NotificationFilters = {}): Promise<NotificationsResponse> {
    const { page = 1, limit = this.DEFAULT_LIMIT, type, isRead, priority } = filters;

    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (type) params.append('type', type);
      if (isRead !== undefined) params.append('isRead', String(isRead));
      if (priority) params.append('priority', priority);

      const cacheKey = `notifications_${params.toString()}`;
      const cached = this.getFromCache(cacheKey);
      if (cached) return cached;

      const response = await apiClient.get(`${this.BASE_PATH}?${params}`);
      const result = this.normalizeNotificationsResponse(response.data, page);

      this.setCache(cacheKey, result);
      return result;
    } catch (error) {
      Logger.error('Failed to fetch notifications', error);
      return this.getEmptyResponse(page);
    }
  }

  /**
   * Get unread notification count
   */
  async getUnreadCount(): Promise<number> {
    try {
      const cached = this.getFromCache('unread_count');
      if (cached !== null) return cached;

      const response = await apiClient.get(`${this.BASE_PATH}/unread-count`);
      const count = response.data?.unreadCount || 0;

      this.setCache('unread_count', count);
      return count;
    } catch (error) {
      Logger.error('Failed to fetch unread count', error);
      return 0;
    }
  }

  /**
   * Mark single notification as read
   */
  async markAsRead(notificationId: string): Promise<boolean> {
    try {
      await apiClient.patch(`${this.BASE_PATH}/${notificationId}/read`);
      this.invalidateCache();
      return true;
    } catch (error) {
      Logger.error('Failed to mark notification as read', { notificationId, error });
      throw new Error('Failed to mark notification as read');
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ success: boolean; count: number }> {
    try {
      const response = await apiClient.patch(`${this.BASE_PATH}/mark-all-read`);
      this.invalidateCache();
      return { success: true, count: response.data?.modifiedCount || 0 };
    } catch (error) {
      Logger.error('Failed to mark all notifications as read', error);
      throw new Error('Failed to mark all notifications as read');
    }
  }

  /**
   * Delete single notification
   */
  async deleteNotification(notificationId: string): Promise<boolean> {
    try {
      await apiClient.delete(`${this.BASE_PATH}/${notificationId}`);
      this.invalidateCache();
      return true;
    } catch (error) {
      Logger.error('Failed to delete notification', { notificationId, error });
      throw new Error('Failed to delete notification');
    }
  }

  /**
   * Clear all notifications
   */
  async clearAllNotifications(): Promise<{ success: boolean; count: number }> {
    try {
      const response = await apiClient.delete(`${this.BASE_PATH}/clear-all`);
      this.invalidateCache();
      return { success: true, count: response.data?.deletedCount || 0 };
    } catch (error) {
      Logger.error('Failed to clear all notifications', error);
      throw new Error('Failed to clear all notifications');
    }
  }

  /**
   * Get notification statistics
   */
  async getNotificationStats(): Promise<NotificationStats> {
    try {
      const response = await apiClient.get(`${this.BASE_PATH}/stats`);
      return response.data;
    } catch (error) {
      Logger.error('Failed to fetch notification stats', error);
      throw new Error('Failed to fetch notification statistics');
    }
  }

  /**
   * Get notification preferences
   */
  async getNotificationPreferences(): Promise<NotificationPreferences> {
    try {
      const response = await apiClient.get(`${this.BASE_PATH}/preferences`);
      return response.data;
    } catch (error) {
      Logger.error('Failed to fetch notification preferences', error);
      throw new Error('Failed to fetch notification preferences');
    }
  }

  /**
   * Update notification preferences
   */
  async updateNotificationPreferences(
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    try {
      const response = await apiClient.put(`${this.BASE_PATH}/preferences`, preferences);
      return response.data;
    } catch (error) {
      Logger.error('Failed to update notification preferences', error);
      throw new Error('Failed to update notification preferences');
    }
  }

  /**
   * Create system notification (admin only)
   */
  async createSystemNotification(data: {
    recipients: string[];
    title: string;
    message: string;
    data?: Record<string, any>;
  }): Promise<void> {
    try {
      await apiClient.post(`${this.BASE_PATH}/system`, data);
    } catch (error) {
      Logger.error('Failed to create system notification', error);
      throw new Error('Failed to create system notification');
    }
  }

  // ==================== Private Methods ====================

  private normalizeNotificationsResponse(data: any, page: number): NotificationsResponse {
    return {
      notifications: (data.notifications || []).map(this.normalizeNotification),
      totalNotifications: data.pagination?.totalCount || 0,
      totalPages: data.pagination?.totalPages || 0,
      currentPage: data.pagination?.currentPage || page,
      hasNextPage: data.pagination?.hasNext || false,
      hasPrevPage: data.pagination?.hasPrev || false,
      unreadCount: data.unreadCount || 0,
    };
  }

  private normalizeNotification(notification: any): Notification {
    return {
      ...notification,
      from: notification.sender ||
        notification.from || {
          _id: 'unknown',
          username: 'unknown',
          firstName: 'Unknown',
          lastName: 'User',
          avatar: null,
        },
      postId: notification.data?.postId?._id || notification.postId,
      postContent: notification.data?.postContent || notification.postContent,
      postImage: notification.data?.postImage || notification.postImage,
    };
  }

  private getEmptyResponse(page: number): NotificationsResponse {
    return {
      notifications: [],
      totalNotifications: 0,
      totalPages: 0,
      currentPage: page,
      hasNextPage: false,
      hasPrevPage: false,
      unreadCount: 0,
    };
  }

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T;
    }
    return null;
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private invalidateCache(): void {
    this.cache.clear();
  }
}

export default new NotificationService();
