import { useState, useEffect } from 'react';
import { analyticsService, revenueService, monitoringService } from '../services/modules';
import type { RetentionAnalytics, EngagementMetrics, RevenueAnalytics, DatabaseStats } from '../services/modules';

export const useRetentionAnalytics = (period = 'weekly', weeks = 12) => {
  const [data, setData] = useState<RetentionAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await analyticsService.getRetentionAnalytics(period, weeks);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch retention data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period, weeks]);

  return { data, loading, error, refetch: () => fetchData() };
};

export const useEngagementMetrics = (timeRange = '30d') => {
  const [data, setData] = useState<EngagementMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await analyticsService.getEngagementMetrics(timeRange);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch engagement data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [timeRange]);

  return { data, loading, error, refetch: () => fetchData() };
};

export const useRevenueAnalytics = (period = '30d') => {
  const [data, setData] = useState<RevenueAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await revenueService.getRevenueAnalytics(period);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch revenue data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period]);

  return { data, loading, error, refetch: () => fetchData() };
};

export const useDatabaseStats = () => {
  const [data, setData] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await monitoringService.getDatabaseStats();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch database stats');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return { data, loading, error, refetch: () => fetchData() };
};