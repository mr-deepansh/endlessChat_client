// Export all services for easy importing
export { userService } from './userService';
export { socialService } from './socialService';
export { adminService } from './adminService';
export { api } from './api';
export { cacheService } from './core/cache';

// Export types
export type {
  User,
  Post,
  Comment,
  UserStats,
  LoginData,
  RegisterData,
  UpdateProfileData,
} from './userService';
export type { FollowResponse, FeedParams, FeedPost } from './socialService';
export type { AdminStats, AdminUser } from './adminService';

// API endpoints based on Postman collection
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/users/login',
    REGISTER: '/users/register',
    LOGOUT: '/users/logout',
  },

  // Profile Management
  PROFILE: {
    GET_CURRENT: '/users/profile/me',
    UPDATE_CURRENT: '/users/profile/me',
    UPLOAD_AVATAR: '/users/upload-avatar',
    CHANGE_PASSWORD: '/users/change-password',
  },

  // User Actions
  USERS: {
    GET_ALL: '/users',
    GET_BY_ID: (id: string) => `/users/${id}`,
    SEARCH: '/users/search',
  },

  // Social Features
  SOCIAL: {
    FOLLOW: (id: string) => `/users/follow/${id}`,
    UNFOLLOW: (id: string) => `/users/unfollow/${id}`,
    FOLLOWERS: (id: string) => `/users/followers/${id}`,
    FOLLOWING: (id: string) => `/users/following/${id}`,
    FEED: '/users/feed',
  },

  // Admin Routes
  ADMIN: {
    STATS: '/admin/stats',
    STATS_LIVE: '/admin/stats/live',
    USERS: '/admin/users',
    USER_BY_ID: (id: string) => `/admin/users/${id}`,
    ACTIVATE_USER: (id: string) => `/admin/users/${id}/activate`,
    SUSPEND_USER: (id: string) => `/admin/users/${id}/suspend`,
    ADMINS: '/admin/admins',
    ADMIN_BY_ID: (id: string) => `/admin/admins/${id}`,
  },
} as const;
