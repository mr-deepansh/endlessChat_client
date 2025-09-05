// Export all services
export { authService } from './authService';
export { default as postService } from './postService';
export { default as commentService } from './commentService';
export { default as userService } from './userService';
export { default as notificationService } from './notificationService';
export { default as adminService } from './adminService';
export { default as api } from './api';

// Create a mock superAdminService for now
export const superAdminService = {
  getAllAdmins: () => Promise.resolve({ success: true, data: [] }),
  getAuditLogs: () => Promise.resolve({ success: true, data: [] }),
  getSystemConfig: () => Promise.resolve({ success: true, data: {} }),
  deleteAdmin: () => Promise.resolve({ success: true }),
  changeUserRole: () => Promise.resolve({ success: true }),
  createAdmin: () => Promise.resolve({ success: true }),
  emergencyLockdown: () => Promise.resolve({ success: true })
};

// Export types
export type { AuthResponse, ChangePasswordData, UpdateProfileData } from './authService';
export type { Post, CreatePostData, PostsResponse } from './postService';
export type { Comment, CommentsResponse } from './commentService';
export type { User, UserProfile, UsersResponse, FeedResponse } from './userService';
export type { 
  Notification, 
  NotificationsResponse, 
  NotificationStats, 
  NotificationPreferences 
} from './notificationService';
export type { 
  AdminStats, 
  AdminDashboard, 
  BulkActionData, 
  UserActivityLog, 
  SecurityAnalysis 
} from './adminService';