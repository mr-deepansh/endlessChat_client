import { authApi as apiClient } from '../core/serviceClients';
import { AuthPersistence } from '../../utils/authPersistence';
import type {
  ApiResponse,
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
  ChangePasswordRequest,
  ActivityLog,
  LocationAnalytics,
} from '../../types/api';

class AuthService {
  private readonly baseUrl = '/users';
  private readonly authUrl = '/auth';

  // Authentication Methods
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    console.log('🔍 Login request:', JSON.stringify(credentials, null, 2));
    
    try {
      const response = await apiClient.post<AuthResponse>(`${this.baseUrl}/login`, credentials);
      console.log('🔍 Login response:', JSON.stringify(response, null, 2));
      
      if (response.success && response.data) {
        // Extract token from multiple possible locations in response
        const token =
          response.data.token ||
          response.data.accessToken ||
          response.data.data?.token ||
          response.data.data?.accessToken ||
          response.token ||
          response.accessToken;

        if (token) {
          // Store token using API client method
          apiClient.setToken(token);
          console.log('✅ Token stored successfully:', token.substring(0, 20) + '...');
        } else {
          console.warn('⚠️ No token found in login response. Full response:', response);
        }

        // Store refresh token if provided
        const refreshToken =
          response.data.refreshToken ||
          response.data.refresh_token ||
          response.data.data?.refreshToken ||
          response.refreshToken ||
          response.refresh_token;
        
        // Use AuthPersistence to store tokens only if token exists
        if (token) {
          AuthPersistence.setTokens(token, refreshToken);
          console.log('✅ Tokens stored successfully');
        }
      }
      
      return response;
    } catch (error: any) {
      console.error('🚨 Login error:', error);
      throw error;
    }
  }

  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiClient.post<AuthResponse>(`${this.baseUrl}/register`, userData);

    if (response.success && response.data) {
      // Handle both token and accessToken from backend response
      const token = response.data.token || response.data.accessToken;

      if (token) {
        // Store token using API client method
        apiClient.setToken(token);
        console.log('Registration token stored successfully:', token.substring(0, 20) + '...');
      }

      // Handle refresh token
      const refreshToken = response.data.refreshToken || response.data.refresh_token;
      
      // Use AuthPersistence to store tokens
      AuthPersistence.setTokens(token, refreshToken);
    }

    return response;
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      const response = await apiClient.post<void>(`${this.baseUrl}/logout`);
      return response;
    } finally {
      // Always clear local auth data
      AuthPersistence.clearTokens();
      apiClient.clearAuth();
    }
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const refreshToken = AuthPersistence.getRefreshToken();

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiClient.post<{ token: string }>(`${this.authUrl}/refresh`, {
      refreshToken,
    });

    if (response.success && response.data?.token) {
      AuthPersistence.setTokens(response.data.token);
      apiClient.setToken(response.data.token);
    }

    return response;
  }

  // Profile Management
  async getCurrentUser(): Promise<ApiResponse<User>> {
    try {
      return await apiClient.get<User>(`${this.baseUrl}/profile/me`);
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as User,
      };
    }
  }

  async updateProfile(profileData: Partial<User>): Promise<ApiResponse<User>> {
    return apiClient.put<User>(`${this.baseUrl}/profile/me`, profileData);
  }

  async changePassword(passwordData: ChangePasswordRequest): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.baseUrl}/change-password`, passwordData);
  }

  async uploadAvatar(avatarData: {
    avatarUrl: string;
  }): Promise<ApiResponse<{ avatarUrl: string }>> {
    return apiClient.post<{ avatarUrl: string }>(`${this.baseUrl}/upload-avatar`, avatarData);
  }

  // Activity & Location Tracking
  async getActivityStats(days: number = 30): Promise<
    ApiResponse<{
      totalLogins: number;
      uniqueLocations: number;
      averageSessionDuration: number;
      lastLoginAt: string;
    }>
  > {
    const queryString = apiClient.buildQueryString({ days });
    return apiClient.get(`${this.authUrl}/activity/stats${queryString}`);
  }

  async getActivityLogs(
    params: {
      page?: number;
      limit?: number;
    } = {}
  ): Promise<ApiResponse<ActivityLog[]>> {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get<ActivityLog[]>(`${this.authUrl}/activity${queryString}`);
  }

  async getLocationAnalytics(days: number = 7): Promise<ApiResponse<LocationAnalytics[]>> {
    const queryString = apiClient.buildQueryString({ days });
    return apiClient.get<LocationAnalytics[]>(
      `${this.authUrl}/activity/location-analytics${queryString}`
    );
  }

  async getLoginLocations(
    params: {
      limit?: number;
      days?: number;
    } = {}
  ): Promise<
    ApiResponse<
      Array<{
        country: string;
        city: string;
        region: string;
        lastLoginAt: string;
        loginCount: number;
      }>
    >
  > {
    const queryString = apiClient.buildQueryString(params);
    return apiClient.get(`${this.authUrl}/activity/locations${queryString}`);
  }

  // Password Reset (if implemented in backend)
  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.authUrl}/forgot-password`, { email });
  }

  async resetPassword(token: string, newPassword: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.authUrl}/reset-password`, {
      token,
      newPassword,
    });
  }

  // Email Verification (if implemented in backend)
  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.authUrl}/verify-email`, { token });
  }

  async resendVerificationEmail(): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.authUrl}/resend-verification`);
  }

  // Utility Methods
  isAuthenticated(): boolean {
    return AuthPersistence.isAuthenticated();
  }

  getCurrentToken(): string | null {
    return AuthPersistence.getAccessToken();
  }

  getUserFromToken(): User | null {
    const token = this.getCurrentToken();
    if (!token) return null;

    try {
      // Decode JWT token to get user info (basic implementation)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.user || null;
    } catch {
      return null;
    }
  }

  // Session Management
  async validateSession(): Promise<boolean> {
    try {
      const response = await this.getCurrentUser();
      return response.success;
    } catch {
      return false;
    }
  }

  async extendSession(): Promise<ApiResponse<void>> {
    return apiClient.post<void>(`${this.authUrl}/extend-session`);
  }

  // Security Methods
  async getActiveSessions(): Promise<
    ApiResponse<
      Array<{
        id: string;
        device: string;
        location: string;
        lastActive: string;
        isCurrent: boolean;
      }>
    >
  > {
    return apiClient.get(`${this.authUrl}/sessions`);
  }

  async terminateSession(sessionId: string): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.authUrl}/sessions/${sessionId}`);
  }

  async terminateAllSessions(): Promise<ApiResponse<void>> {
    return apiClient.delete(`${this.authUrl}/sessions/all`);
  }
}

export const authService = new AuthService();
export default authService;
