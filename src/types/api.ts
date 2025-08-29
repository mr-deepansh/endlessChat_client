// Core API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Authentication Types
export interface LoginRequest {
  identifier: string; // username or email
  password: string;
  rememberMe?: boolean;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role?: 'user' | 'admin';
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// User Types
export interface User {
  _id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  bio?: string;
  avatar?: string;
  role: 'user' | 'admin' | 'super_admin';
  isActive: boolean;
  isEmailVerified: boolean;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

// Social Features Types
export interface FollowResponse {
  isFollowing: boolean;
  followersCount: number;
  followingCount: number;
}

export interface UserSearchParams {
  username?: string;
  email?: string;
  page?: number;
  limit?: number;
  role?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Feed Types
export interface FeedParams {
  page?: number;
  limit?: number;
  sort?: 'recent' | 'popular' | 'trending';
}

export interface Post {
  _id: string;
  content: string;
  author: User;
  images?: string[];
  likesCount: number;
  commentsCount: number;
  repostsCount: number;
  sharesCount: number;
  viewsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isReposted: boolean;
  visibility: 'public' | 'private' | 'hidden';
  createdAt: string;
  updatedAt: string;
}

// Admin Types
export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalPosts: number;
  totalComments: number;
  userGrowth: number;
  engagementRate: number;
  serverHealth: 'healthy' | 'warning' | 'critical';
}

export interface AdminUser extends User {
  lastLoginAt?: string;
  loginCount: number;
  suspendedAt?: string;
  suspensionReason?: string;
}

export interface UserManagementParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: 'active' | 'suspended' | 'all';
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Security Types
export interface SuspiciousAccount {
  userId: string;
  user: User;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: string[];
  detectedAt: string;
  status: 'pending' | 'reviewed' | 'resolved';
}

export interface BlockedIP {
  _id: string;
  ipAddress: string;
  reason: string;
  blockedAt: string;
  expiresAt?: string;
  isActive: boolean;
}

export interface LoginAttempt {
  _id: string;
  ipAddress: string;
  userAgent: string;
  status: 'success' | 'failed';
  userId?: string;
  attemptedAt: string;
  location?: {
    country: string;
    city: string;
    region: string;
  };
}

// Analytics Types
export interface AnalyticsOverview {
  users: {
    total: number;
    active: number;
    new: number;
    growth: number;
  };
  content: {
    posts: number;
    comments: number;
    engagement: number;
  };
  performance: {
    responseTime: number;
    uptime: number;
    errorRate: number;
  };
}

export interface UserGrowthData {
  date: string;
  newUsers: number;
  totalUsers: number;
  activeUsers: number;
}

export interface EngagementMetrics {
  likes: number;
  comments: number;
  shares: number;
  reposts: number;
  views: number;
  engagementRate: number;
}

// Notification Types
export interface NotificationTemplate {
  _id: string;
  name: string;
  type: 'email' | 'in-app' | 'push';
  subject: string;
  content: string;
  variables: string[];
  isActive: boolean;
}

export interface BulkNotificationRequest {
  recipients: 'all' | 'active' | 'inactive' | string[];
  template: string;
  channels: ('email' | 'in-app' | 'push')[];
  priority: 'low' | 'normal' | 'high' | 'urgent';
  customMessage?: {
    title: string;
    content: string;
  };
}

// System Configuration Types
export interface AppSettings {
  security: {
    maxLoginAttempts: number;
    lockoutDuration: number;
    passwordMinLength: number;
    requireEmailVerification: boolean;
  };
  features: {
    enableRegistration: boolean;
    enableSocialLogin: boolean;
    enableNotifications: boolean;
    maintenanceMode: boolean;
  };
  limits: {
    maxPostLength: number;
    maxImageSize: number;
    maxImagesPerPost: number;
    dailyPostLimit: number;
  };
}

// Automation Types
export interface AutomationRule {
  _id: string;
  name: string;
  description: string;
  trigger: string;
  conditions: Record<string, any>;
  actions: Array<{
    type: string;
    template?: string;
    delay: number;
  }>;
  isActive: boolean;
  createdAt: string;
}

export interface Experiment {
  _id: string;
  name: string;
  description: string;
  status: 'draft' | 'running' | 'paused' | 'completed';
  variants: Array<{
    name: string;
    description: string;
    traffic: number;
  }>;
  startDate: string;
  endDate?: string;
  metrics: Record<string, number>;
}

// Business Intelligence Types
export interface RevenueAnalytics {
  totalRevenue: number;
  monthlyRevenue: number;
  revenueGrowth: number;
  averageRevenuePerUser: number;
  revenueBySource: Record<string, number>;
}

export interface UserLifetimeValue {
  segment: string;
  averageLTV: number;
  medianLTV: number;
  retentionRate: number;
  churnRate: number;
}

// Activity & Location Types
export interface ActivityLog {
  _id: string;
  userId: string;
  action: string;
  details: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  location?: {
    country: string;
    city: string;
    region: string;
    coordinates?: [number, number];
  };
  timestamp: string;
}

export interface LocationAnalytics {
  country: string;
  city: string;
  userCount: number;
  activeUsers: number;
  engagementRate: number;
}

// Super Admin Types
export interface CreateAdminRequest {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'super_admin';
  permissions: string[];
}

export interface RoleChangeRequest {
  newRole: 'user' | 'admin' | 'super_admin';
  reason: string;
}

export interface AuditLog {
  _id: string;
  adminId: string;
  admin: User;
  action: string;
  targetType: string;
  targetId: string;
  details: Record<string, any>;
  criticality: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: string;
}

export interface EmergencyLockdownRequest {
  reason: string;
  duration: string;
  confirmPassword: string;
}

// Error Types
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
  timestamp: string;
}

// Query Parameters Types
export interface BaseQueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TimeRangeParams {
  timeRange?: '1h' | '24h' | '7d' | '30d' | '90d' | '1y';
  startDate?: string;
  endDate?: string;
}

export interface FilterParams {
  status?: string;
  type?: string;
  category?: string;
  search?: string;
}
