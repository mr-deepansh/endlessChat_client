import { api, ApiResponse } from './api';

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
    const response = await api.get('/users/profile/me');
    return response.data;
  },

  // Refresh Token
  refreshToken: async () => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};
