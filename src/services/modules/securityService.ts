import { apiClient } from '../core/apiClient';
import type { ApiResponse } from '../types';

export interface SecurityOverview {
  accountSecurity: {
    isEmailVerified: boolean;
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    failedLoginAttempts: number;
    isAccountLocked: boolean;
  };
  recentActivity: {
    lastActive: string;
    recentLogins: Array<{
      timestamp: string;
      ipAddress: string;
      location: string;
      device: string;
    }>;
  };
  deviceInfo: {
    lastLoginIP: string;
    lastLoginLocation: string;
  };
}

class SecurityService {
  async getSecurityOverview(): Promise<SecurityOverview> {
    const response = await apiClient.get<SecurityOverview>('/auth/security-overview');
    return response.data;
  }

  async enableTwoFactor(code: string): Promise<{ backupCodes: string[] }> {
    const response = await apiClient.post('/auth/2fa/enable', { code });
    return response.data;
  }

  async disableTwoFactor(password: string): Promise<void> {
    await apiClient.post('/auth/2fa/disable', { password });
  }

  async getLoginHistory(limit = 10): Promise<Array<{
    timestamp: string;
    ipAddress: string;
    location: string;
    device: string;
    success: boolean;
  }>> {
    const response = await apiClient.get(`/auth/login-history?limit=${limit}`);
    return response.data;
  }
}

export default new SecurityService();