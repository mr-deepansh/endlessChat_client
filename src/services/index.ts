// Export all services
export { authService } from './authService';
export { default as postService } from './postService';
export { default as commentService } from './commentService';
export { default as userService } from './userService';
export { default as notificationService } from './notificationService';
export { default as adminService } from './adminService';
export { default as mediaService } from './mediaService';
export { default as api } from './api';

// Export new modular services
export { securityService, monitoringService, analyticsService } from './modules';

// Export service manager and utilities
export { serviceManager, ServiceManager } from './serviceManager';
export { DataFormatter, serviceCache } from './utils';

// Export types
export type { AuthResponse, ChangePassword_data, UpdateProfileData } from './authService';
export type { Post, CreatePost_data, PostsResponse } from './postService';
export type { Comment, CommentsResponse } from './commentService';
export type { User, UserProfileResponse, FeedResponse } from './userService';
export type {
  Notification,
  NotificationsResponse,
  NotificationStats,
  NotificationPreferences,
} from './notificationService';
export type {
  AdminStats,
  AdminDashboard,
  BulkAction_data,
  UserActivityLog,
  SecurityAnalysis,
} from './adminService';

// Export new module types
export type {
  SecurityOverview,
  DatabaseStats,
  SystemMetrics,
  RetentionAnalytics,
  EngagementMetrics,
  UserGrowth_data,
} from './modules';
