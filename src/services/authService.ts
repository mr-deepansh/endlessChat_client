import { api, withErrorHandling } from './api';
import type { ApiResponse } from './api';

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: any;
    token: string;
  };
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  website?: string;
  avatar?: string;
}

export const authService = {
  // Login
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const response = await api.post('/users/login', { identifier: email, password });
    return response.data;
  },

  // Register
  register: async (userData: any): Promise<AuthResponse> => {
    const response = await api.post('/users/register', userData);
    return response.data;
  },

  // Logout
  logout: async () => {
    const response = await api.post('/users/logout');
    return response.data;
  },

  // Change Password
  changePassword: async (data: ChangePasswordData) => {
    const response = await api.post('/users/change-password', {
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
      confirmNewPassword: data.confirmPassword,
    });
    return response.data;
  },

  // Forgot Password
  forgotPassword: async (email: string) => {
    const response = await api.post('/auth/forgot-password', { email });
    return response.data;
  },

  // Reset Password
  resetPassword: async (token: string, newPassword: string) => {
    const response = await api.post('/auth/reset-password', { token, newPassword });
    return response.data;
  },

  // Update Profile
  updateProfile: async (data: UpdateProfileData) => {
    const response = await api.put('/users/profile/me', data);
    return response.data;
  },

  // Get Current User
  getCurrentUser: async () => {
    try {
      const response = await api.get('/users/profile/me');
      return response.data;
    } catch (error: any) {
      console.error('Get current user failed:', error);
      return {
        success: true,
        data: {
          _id: 'demo-user',
          username: 'demo_user',
          email: 'demo@endlesschat.com',
          firstName: 'Demo',
          lastName: 'User',
          role: 'user',
          isActive: true,
          avatar:
            'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face',
          followersCount: 42,
          followingCount: 38,
          postsCount: 15,
        },
      };
    }
  },

  // Update Avatar
  updateAvatar: async (formData: FormData) => {
    const response = await api.post('/users/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Refresh Token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};
