// Core API Types for Enterprise Social Media Platform

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: ApiError;
  meta?: {
    timestamp: string;
    requestId: string;
    version: string;
  };
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  path?: string;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface SearchParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Authentication Types
export interface LoginRequest {
  identifier: string; // email or username
  password: string;
  rememberMe?: boolean;
  deviceInfo?: {
    userAgent: string;
    platform: string;
    location?: {
      country: string;
      city: string;
      ip: string;
    };
  };
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role?: 'user' | 'admin';
  acceptTerms: boolean;
  marketingConsent?: boolean;
  referralCode?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
  accessToken?: string;
  expiresAt: string;
  permissions: string[];
  sessionId: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// User Types
export interface User {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName?: string;
  avatar?: string;
  bio?: string;
  location?: string;
  website?: string;
  dateOfBirth?: string;
  phone?: string;
  role: 'user' | 'admin' | 'super_admin';
  status?: 'active' | 'inactive' | 'suspended' | 'banned';
  isActive?: boolean;
  isVerified?: boolean;
  emailVerified?: boolean;
  isPrivate?: boolean;
  isOnline?: boolean;
  lastSeen?: string;
  createdAt: string;
  updatedAt: string;

  // Social Stats
  followersCount: number;
  followingCount: number;
  postsCount: number;

  // Privacy Settings
  privacy: {
    profileVisibility: 'public' | 'followers' | 'private';
    showEmail: boolean;
    showPhone: boolean;
    showLocation: boolean;
    allowTagging: 'everyone' | 'followers' | 'none';
    allowMentions: 'everyone' | 'followers' | 'none';
  };

  // Preferences
  preferences: {
    language: string;
    timezone: string;
    theme: 'light' | 'dark' | 'auto';
    notifications: NotificationPreferences;
  };

  // Verification
  verification?: {
    type: 'identity' | 'business' | 'celebrity' | 'organization';
    verifiedAt: string;
    badge: string;
  };

  // Subscription (if applicable)
  subscription?: {
    plan: 'free' | 'pro' | 'enterprise';
    status: 'active' | 'cancelled' | 'expired';
    expiresAt?: string;
  };
}

export interface NotificationPreferences {
  email: {
    enabled: boolean;
    frequency: 'immediate' | 'hourly' | 'daily' | 'weekly';
    types: Record<string, boolean>;
  };
  push: {
    enabled: boolean;
    types: Record<string, boolean>;
  };
  inApp: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
    types: Record<string, boolean>;
  };
  sms: {
    enabled: boolean;
    types: Record<string, boolean>;
  };
}

// Activity & Location Types
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  description: string;
  ipAddress: string;
  userAgent: string;
  location?: {
    country: string;
    region: string;
    city: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  device: {
    type: 'desktop' | 'mobile' | 'tablet';
    os: string;
    browser: string;
  };
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface LocationAnalytics {
  country: string;
  region: string;
  city: string;
  loginCount: number;
  lastLoginAt: string;
  isCurrentLocation: boolean;
  riskScore?: number;
}

// Post Types
export interface Post {
  id: string;
  content: string;
  author: User;
  type: 'text' | 'image' | 'video' | 'poll' | 'article' | 'repost';
  media?: MediaItem[];
  location?: LocationData;
  visibility: 'public' | 'followers' | 'private';

  // Engagement
  metrics: {
    likes: number;
    comments: number;
    shares: number;
    views: number;
    reposts: number;
    bookmarks: number;
  };

  // User Interactions
  engagement: {
    isLiked: boolean;
    isBookmarked: boolean;
    isReposted: boolean;
    isFollowing: boolean;
  };

  // Content
  tags: string[];
  mentions: string[];
  hashtags: string[];

  // Timestamps
  createdAt: string;
  updatedAt: string;
  scheduledAt?: string;
  expiresAt?: string;

  // Moderation
  isHidden: boolean;
  isFlagged: boolean;
  moderationStatus?: 'approved' | 'pending' | 'rejected';

  // Original post (for reposts)
  originalPost?: Post;
  repostComment?: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video' | 'gif' | 'audio';
  url: string;
  thumbnail?: string;
  alt?: string;
  metadata: {
    size: number;
    dimensions?: { width: number; height: number };
    duration?: number;
    format: string;
  };
}

export interface LocationData {
  name: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  address?: {
    street?: string;
    city: string;
    region: string;
    country: string;
    postalCode?: string;
  };
}

// Comment Types
export interface Comment {
  id: string;
  content: string;
  author: User;
  postId: string;
  parentId?: string;
  replies?: Comment[];
  likes: number;
  isLiked: boolean;
  mentions: string[];
  createdAt: string;
  updatedAt: string;
  isHidden: boolean;
  isFlagged: boolean;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'repost' | 'system' | 'security';
  title: string;
  message: string;
  data?: Record<string, any>;

  actor?: User;
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

// Social Types
export interface FollowStats {
  followersCount: number;
  followingCount: number;
  mutualFollowersCount: number;
  followerGrowth: {
    daily: number;
    weekly: number;
    monthly: number;
  };
}

export interface Relationship {
  userId: string;
  isFollowing: boolean;
  isFollowedBy: boolean;
  isMutual: boolean;
  isBlocked: boolean;
  isBlockedBy: boolean;
  isMuted: boolean;
  followedAt?: string;
  blockedAt?: string;
  mutedAt?: string;
}

// Admin Types
export interface AdminStats {
  overview: {
    totalUsers: number;
    activeUsers: number;
    adminUsers: number;
    verifiedUsers: number;
    suspendedUsers: number;
    activePercentage: string;
    currentMonthSignups: number;
    userGrowthTrend: string;
    healthScore: number;
  };
  breakdown: {
    usersByRole: Record<string, number>;
    usersByLocation: Record<string, number>;
    monthlyGrowth: Array<{
      year: number;
      month: number;
      count: number;
      monthName: string;
    }>;
    dailyGrowth: Array<{
      year: number;
      month: number;
      day: number;
      count: number;
      date: string;
    }>;
  };
  activity: {
    recentUsers: Array<{
      id: string;
      username: string;
      email: string;
      role: string;
      joinedAt: string;
      lastLogin: string;
      status: string;
      daysSinceJoined: number;
    }>;
  };
  engagement: any;
  metadata: {
    generatedAt: string;
    fromCache: boolean;
    optimizedVersion?: string;
    pipeline?: string;
  };
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
  profileImage?: string;
  daysSinceJoined: number;
}

export interface AnalyticsOverview {
  timeRange: string;
  metrics: Record<string, number>;
  trends: Array<{
    date: string;
    value: number;
    change?: number;
  }>;
  breakdown: Record<string, number>;
  insights: string[];
}

export interface SuspiciousAccount {
  id: string;
  userId: string;
  username: string;
  email: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: string[];
  lastActivity: string;
  flaggedAt: string;
}

export interface LoginAttempt {
  id: string;
  userId?: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed' | 'blocked';
  failureReason?: string;
  location?: string;
  timestamp: string;
}

export interface UserManagementParams {
  page: number;
  limit: number;
  search: string;
  role: string;
  status: string;
  sortBy: string;
  sortOrder: string;
}

// Security Types
export interface SecurityEvent {
  id: string;
  type: 'login_failure' | 'suspicious_activity' | 'data_breach' | 'privilege_escalation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  sourceIP: string;
  userId?: string;
  userAgent?: string;
  location?: LocationData;
  timestamp: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  metadata?: Record<string, any>;
}

// Analytics Types
export interface AnalyticsData {
  timeRange: string;
  metrics: Record<string, number>;
  trends: Array<{
    date: string;
    value: number;
    change?: number;
  }>;
  breakdown: Record<string, number>;
  insights: string[];
}

// File Upload Types
export interface FileUploadResponse {
  id: string;
  url: string;
  filename: string;
  size: number;
  mimeType: string;
  metadata?: Record<string, any>;
}

// Webhook Types
export interface WebhookEvent {
  id: string;
  type: string;
  data: Record<string, any>;
  timestamp: string;
  source: string;
}

// Rate Limiting Types
export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  retryAfter?: number;
}

// Cache Types
export interface CacheInfo {
  key: string;
  ttl: number;
  size: number;
  hitRate: number;
}

// Health Check Types
export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: Record<
    string,
    {
      status: 'up' | 'down' | 'degraded';
      responseTime?: number;
      lastCheck: string;
    }
  >;
  timestamp: string;
}

// Feature Flag Types
export interface FeatureFlag {
  name: string;
  enabled: boolean;
  rolloutPercentage: number;
  targetAudience?: string[];
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Audit Log Types
export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  changes?: Record<string, { old: any; new: any }>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  success: boolean;
  errorMessage?: string;
}

// Export all types
export type {
  ApiResponse,
  ApiError,
  PaginatedResponse,
  SearchParams,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ChangePasswordRequest,
  User,
  NotificationPreferences,
  ActivityLog,
  LocationAnalytics,
  Post,
  MediaItem,
  LocationData,
  Comment,
  Notification,
  FollowStats,
  Relationship,
  AdminStats,
  AdminUser,
  AnalyticsOverview,
  SuspiciousAccount,
  LoginAttempt,
  UserManagementParams,
  SecurityEvent,
  AnalyticsData,
  FileUploadResponse,
  WebhookEvent,
  RateLimitInfo,
  CacheInfo,
  HealthStatus,
  FeatureFlag,
  AuditLog,
};
