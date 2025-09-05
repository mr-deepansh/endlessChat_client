import { apiClient } from './core/apiClient';

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: any;
    accessToken: string;
    refreshToken: string;
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
}

export const authService = {
  // Login
  login: async (email: string, password: string, rememberMe = false): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', { 
      identifier: email, 
      password,
      rememberMe 
    });
    
    // Store tokens
    if (response.data?.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    if (response.data?.refreshToken) {
      localStorage.setItem('refreshToken', response.data.refreshToken);
    }
    
    return response;
  },

  // Register
  register: async (userData: {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
  }): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', userData);
    return response;
  },

  // Logout
  logout: async () => {
    const response = await apiClient.post('/auth/logout');
    
    // Clear tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    return response;
  },

  // Change Password
  changePassword: async (data: ChangePasswordData) => {
    const response = await apiClient.post('/auth/change-password', data);
    return response;
  },

  // Forgot Password
  forgotPassword: async (email: string) => {
    const response = await apiClient.post('/auth/forgot-password', { email });
    return response;
  },

  // Reset Password
  resetPassword: async (token: string, password: string, confirmPassword: string) => {
    const response = await apiClient.post(`/auth/reset-password/${token}`, { 
      password, 
      confirmPassword 
    });
    return response;
  },

  // Verify Email
  verifyEmail: async (token: string) => {
    const response = await apiClient.post(`/auth/verify-email/${token}`);
    return response;
  },

  // Resend Email Verification
  resendVerification: async () => {
    const response = await apiClient.post('/auth/resend-verification');
    return response;
  },

  // Get Security Overview
  getSecurityOverview: async () => {
    const response = await apiClient.get('/auth/security-overview');
    return response;
  },

  // Get User Activity
  getUserActivity: async (page = 1, limit = 20, type?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (type) params.append('type', type);
    
    const response = await apiClient.get(`/auth/activity?${params}`);
    return response;
  },

  // Get Activity Stats
  getActivityStats: async () => {
    const response = await apiClient.get('/auth/activity/stats');
    return response;
  },

  // Get Login Locations
  getLoginLocations: async () => {
    const response = await apiClient.get('/auth/activity/locations');
    return response;
  },

  // Update Profile
  updateProfile: async (data: UpdateProfileData) => {
    const response = await apiClient.put('/users/profile/me', data);
    return response;
  },

  // Get Current User
  getCurrentUser: async () => {
    const response = await apiClient.get('/users/profile/me');
    return response;
  },

  // Upload Avatar
  uploadAvatar: async (avatarUrl: string) => {
    const response = await apiClient.post('/users/upload-avatar', { avatarUrl });
    return response;
  },

  // Refresh Token
  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/refresh-token', { refreshToken });
    
    // Update stored token
    if (response.data?.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
    }
    
    return response;
  },
};
