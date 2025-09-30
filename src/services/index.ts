// Export all services
export { authService } from './authService';
export { default as postService } from './postService';
export { default as commentService } from './commentService';
export { default as userService } from './userService';
export { default as notificationService } from './notificationService';
export { default as adminService } from './adminService';
export { default as api } from './api';

// Export new modular services
export { securityService, monitoringService, analyticsService, revenueService } from './modules';

// Export service manager and utilities
export { serviceManager, ServiceManager } from './serviceManager';
export { DataFormatter, serviceCache } from './utils';

// Export types
export type { AuthResponse, ChangePasswordData, UpdateProfileData } from './authService';
export type { Post, CreatePostData, PostsResponse } from './postService';
export type { Comment, CommentsResponse } from './commentService';
export type { User, UserProfile, UsersResponse, FeedResponse } from './userService';
export type {
  Notification,
  NotificationsResponse,
  NotificationStats,
  NotificationPreferences,
} from './notificationService';
export type {
  AdminStats,
  AdminDashboard,
  BulkActionData,
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
  UserGrowthData,
  RevenueAnalytics,
  UserLifetimeValue,
  SubscriptionMetrics,
} from './modules';
