import { describe, it, expect, vi, beforeEach } from 'vitest';
import { adminService } from '../adminService';
import { apiClient } from '../core/apiClient';

// Mock the API client
vi.mock('../core/apiClient', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}));

describe('AdminService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getStats', () => {
    it('should call the correct API endpoint', async () => {
      const mockResponse = {
        success: true,
        data: {
          stats: {
            overview: {
              totalUsers: 100,
              activeUsers: 80,
              adminUsers: 5,
              verifiedUsers: 60,
              suspendedUsers: 20,
              activePercentage: '80%',
              currentMonthSignups: 15,
              userGrowthTrend: 'up',
              healthScore: 85,
            },
          },
        },
      };

      (apiClient.get as any).mockResolvedValue({ data: mockResponse });

      const result = await adminService.getStats();

      expect(apiClient.get).toHaveBeenCalledWith('/api/v2/admin/stats');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getAllUsers', () => {
    it('should call the correct API endpoint with parameters', async () => {
      const mockResponse = {
        success: true,
        data: {
          users: [],
          pagination: {},
          filters: {},
          meta: {},
        },
      };

      const params = {
        page: 1,
        limit: 10,
        search: 'test',
        role: 'user',
        status: 'active',
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };

      (apiClient.get as any).mockResolvedValue({ data: mockResponse });

      const result = await adminService.getAllUsers(params);

      expect(apiClient.get).toHaveBeenCalledWith(
        '/api/v2/admin/users?page=1&limit=10&search=test&role=user&isActive=true&sortBy=createdAt&sortOrder=desc'
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('suspendUser', () => {
    it('should call the correct API endpoint with data', async () => {
      const mockResponse = {
        success: true,
        data: { user: { id: '123', isActive: false } },
      };

      const userId = '123';
      const data = { reason: 'Policy violation' };

      (apiClient.patch as any).mockResolvedValue({ data: mockResponse });

      const result = await adminService.suspendUser(userId, data);

      expect(apiClient.patch).toHaveBeenCalledWith('/api/v2/admin/users/123/suspend', data);
      expect(result).toEqual(mockResponse);
    });
  });

  describe('deleteUser', () => {
    it('should call the correct API endpoint with data', async () => {
      const mockResponse = {
        success: true,
        data: { deletion: { userId: '123' } },
      };

      const userId = '123';
      const data = { reason: 'Account deletion requested', confirmPassword: 'password' };

      (apiClient.delete as any).mockResolvedValue({ data: mockResponse });

      const result = await adminService.deleteUser(userId, data);

      expect(apiClient.delete).toHaveBeenCalledWith('/api/v2/admin/users/123', { data });
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getAnalyticsOverview', () => {
    it('should call the correct API endpoint with parameters', async () => {
      const mockResponse = {
        success: true,
        data: {
          timeRange: '30d',
          metrics: {},
          trends: [],
          breakdown: {},
          insights: [],
        },
      };

      const params = { timeRange: '30d' };

      (apiClient.get as any).mockResolvedValue({ data: mockResponse });

      const result = await adminService.getAnalyticsOverview(params);

      expect(apiClient.get).toHaveBeenCalledWith('/api/v2/admin/analytics/overview?timeRange=30d');
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getSuspiciousAccounts', () => {
    it('should call the correct API endpoint with parameters', async () => {
      const mockResponse = {
        success: true,
        data: [],
      };

      const params = { limit: 10, riskLevel: 'high' };

      (apiClient.get as any).mockResolvedValue({ data: mockResponse });

      const result = await adminService.getSuspiciousAccounts(params);

      expect(apiClient.get).toHaveBeenCalledWith(
        '/api/v2/admin/security/suspicious-accounts?limit=10&riskLevel=high'
      );
      expect(result).toEqual(mockResponse);
    });
  });
});