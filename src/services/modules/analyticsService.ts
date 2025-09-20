import { apiClient } from '../core/apiClient';

export interface RetentionAnalytics {
  cohortPeriod: 'weekly' | 'monthly';
  cohorts: Array<{
    cohort: string;
    users: number;
    retention: {
      week1: number;
      week2: number;
      week4: number;
      week8: number;
    };
  }>;
  averageRetention: {
    week1: number;
    week2: number;
    week4: number;
    week8: number;
  };
}

export interface EngagementMetrics {
  timeRange: string;
  metrics: {
    dailyActiveUsers: number;
    weeklyActiveUsers: number;
    monthlyActiveUsers: number;
    averageSessionDuration: number;
    bounceRate: number;
    pageViewsPerSession: number;
  };
  trends: {
    dailyActive: 'increasing' | 'decreasing' | 'stable';
    engagement: 'increasing' | 'decreasing' | 'stable';
    retention: 'improving' | 'declining' | 'stable';
  };
}

export interface UserGrowthData {
  period: string;
  data: Array<{
    date: string;
    newUsers: number;
    totalUsers: number;
    growthRate: number;
  }>;
}

class AnalyticsService {
  async getRetentionAnalytics(period = 'weekly', weeks = 12): Promise<RetentionAnalytics> {
    const response = await apiClient.get<RetentionAnalytics>(
      `/admin/analytics/users/retention?period=${period}&weeks=${weeks}`
    );
    return response.data;
  }

  async getEngagementMetrics(timeRange = '30d', metric = 'all'): Promise<EngagementMetrics> {
    const response = await apiClient.get<EngagementMetrics>(
      `/admin/analytics/engagement/metrics?timeRange=${timeRange}&metric=${metric}`
    );
    return response.data;
  }

  async getUserGrowth(period = 'daily', days = 30): Promise<UserGrowthData> {
    const response = await apiClient.get<UserGrowthData>(
      `/admin/analytics/users/growth?period=${period}&days=${days}`
    );
    return response.data;
  }

  async getContentAnalytics(timeRange = '30d'): Promise<{
    totalPosts: number;
    totalComments: number;
    totalLikes: number;
    topContent: Array<{ id: string; title: string; engagement: number }>;
  }> {
    const response = await apiClient.get(`/admin/analytics/content?timeRange=${timeRange}`);
    return response.data;
  }

  async getGeographicData(): Promise<{
    countries: Array<{ country: string; users: number; percentage: number }>;
    cities: Array<{ city: string; users: number; percentage: number }>;
  }> {
    const response = await apiClient.get('/admin/analytics/geographic');
    return response.data;
  }
}

export default new AnalyticsService();