import { apiClient } from '../core/apiClient';
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ChangePasswordRequest,
  MessageResponse,
  User,
} from '../core/types';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */
class AuthService {
  private readonly baseUrl = '/users';

  /**
   * User login
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(`${this.baseUrl}/login`, credentials);
    return response.data;
  }

  /**
   * User registration
   */
  async register(userData: RegisterRequest): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(`${this.baseUrl}/register`, userData);
    return response.data;
  }

  /**
   * User logout
   */
  async logout(): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(`${this.baseUrl}/logout`);
    return response.data;
  }

  /**
   * Change password
   */
  async changePassword(passwordData: ChangePasswordRequest): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>(
      `${this.baseUrl}/change-password`,
      passwordData
    );
    return response.data;
  }

  /**
   * Refresh access token
   */
  async refreshToken(
    refreshToken: string
  ): Promise<{ accessToken: string; refreshToken?: string }> {
    const response = await apiClient.post<{ accessToken: string; refreshToken?: string }>(
      '/auth/refresh',
      {
        refreshToken,
      }
    );
    return response.data;
  }

  /**
   * Forgot password
   */
  async forgotPassword(email: string): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>('/auth/forgot-password', { email });
    return response.data;
  }

  /**
   * Reset password
   */
  async resetPassword(token: string, newPassword: string): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>('/auth/reset-password', {
      token,
      newPassword,
    });
    return response.data;
  }

  /**
   * Verify email
   */
  async verifyEmail(token: string): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>('/auth/verify-email', { token });
    return response.data;
  }

  /**
   * Resend verification email
   */
  async resendVerificationEmail(email: string): Promise<MessageResponse> {
    const response = await apiClient.post<MessageResponse>('/auth/resend-verification', { email });
    return response.data;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    if (!token) return false;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  /**
   * Get current user from token
   */
  getCurrentUserFromToken(): Partial<User> | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        _id: payload._id,
        email: payload.email,
        username: payload.username,
        firstName: payload.firstName,
        lastName: payload.lastName,
        role: payload.role,
        isActive: payload.isActive,
      };
    } catch {
      return null;
    }
  }

  /**
   * Clear authentication data
   */
  clearAuth(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
  }
}

export const authService = new AuthService();
export default authService;
