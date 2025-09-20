import { apiClient } from '../core/apiClient';

export interface RevenueAnalytics {
  period: string;
  revenue: {
    total: number;
    recurring: number;
    oneTime: number;
    growth: string;
  };
  metrics: {
    mrr: number;
    arr: number;
    churn: number;
    ltv: number;
  };
  trends: Array<{
    date: string;
    revenue: number;
  }>;
}

export interface UserLifetimeValue {
  segment: string;
  averageLTV: number;
  segments: {
    premium: { ltv: number; count: number };
    standard: { ltv: number; count: number };
    basic: { ltv: number; count: number };
  };
  factors: {
    retentionRate: number;
    averageOrderValue: number;
    purchaseFrequency: number;
  };
}

export interface SubscriptionMetrics {
  totalSubscribers: number;
  newSubscriptions: number;
  cancellations: number;
  upgrades: number;
  downgrades: number;
  churnRate: number;
  conversionRate: number;
}

class RevenueService {
  async getRevenueAnalytics(period = '30d'): Promise<RevenueAnalytics> {
    const response = await apiClient.get<RevenueAnalytics>(`/admin/bi/revenue-analytics?period=${period}`);
    return response.data;
  }

  async getUserLifetimeValue(segment = 'premium'): Promise<UserLifetimeValue> {
    const response = await apiClient.get<UserLifetimeValue>(`/admin/bi/user-lifetime-value?segment=${segment}`);
    return response.data;
  }

  async getSubscriptionMetrics(timeRange = '30d'): Promise<SubscriptionMetrics> {
    const response = await apiClient.get<SubscriptionMetrics>(`/admin/bi/subscription-metrics?timeRange=${timeRange}`);
    return response.data;
  }

  async getRevenueByPlan(period = '30d'): Promise<Array<{
    plan: string;
    revenue: number;
    subscribers: number;
    growth: number;
  }>> {
    const response = await apiClient.get(`/admin/bi/revenue-by-plan?period=${period}`);
    return response.data;
  }

  async getForecast(months = 6): Promise<{
    revenue: Array<{ month: string; predicted: number; confidence: number }>;
    subscribers: Array<{ month: string; predicted: number; confidence: number }>;
  }> {
    const response = await apiClient.get(`/admin/bi/forecast?months=${months}`);
    return response.data;
  }
}

export default new RevenueService();