import api from './api';

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
    const response = await api.post('/auth/login', { 
      identifier: email, 
      password,
      rememberMe 
    });
    
    // Store tokens
    if (response.data.data?.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
    }
    if (response.data.data?.refreshToken) {
      localStorage.setItem('refreshToken', response.data.data.refreshToken);
    }
    
    return response.data;
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
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/auth/logout');
    
    // Clear tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    
    return response.data;
  },

  // Change Password
  changePassword: async (data: ChangePasswordData) => {
    const response = await api.post('/users/change-password', data);
    return response.data;
  },

  // Forgot Password
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset Password
  resetPassword: async (token: string, password: string, confirmPassword: string) => {
    const response = await api.post(`/auth/reset-password/${token}`, { 
      password, 
      confirmPassword 
    });
    return response.data;
  },

  // Verify Email
  verifyEmail: async (token: string) => {
    const response = await api.post(`/auth/verify-email/${token}`);
    return response.data;
  },

  // Resend Email Verification
  resendVerification: async () => {
    const response = await api.post('/auth/resend-verification');
    return response.data;
  },

  // Get Security Overview
  getSecurityOverview: async () => {
    const response = await api.get('/auth/security-overview');
    return response.data;
  },

  // Get User Activity
  getUserActivity: async (page = 1, limit = 20, type?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (type) params.append('type', type);
    
    const response = await api.get(`/auth/activity?${params}`);
    return response.data;
  },

  // Get Activity Stats
  getActivityStats: async () => {
    const response = await api.get('/auth/activity/stats');
    return response.data;
  },

  // Get Login Locations
  getLoginLocations: async () => {
    const response = await api.get('/auth/activity/locations');
    return response.data;
  },

  // Update Profile
  updateProfile: async (data: UpdateProfileData) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  // Get Current User
  getCurrentUser: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },

  // Upload Avatar
  uploadAvatar: async (avatarUrl: string) => {
    const response = await api.post('/users/upload-avatar', { avatarUrl });
    return response.data;
  },

  // Refresh Token
  refreshToken: async (refreshToken: string) => {
    const response = await api.post('/auth/refresh-token', { refreshToken });
    
    // Update stored token
    if (response.data.data?.accessToken) {
      localStorage.setItem('accessToken', response.data.data.accessToken);
    }
    
    return response.data;
  },
};
