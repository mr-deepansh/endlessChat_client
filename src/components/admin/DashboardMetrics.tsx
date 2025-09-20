import React from 'react';
import { useRetentionAnalytics, useEngagementMetrics, useRevenueAnalytics, useDatabaseStats } from '../../hooks/useAnalytics';
import { DataFormatter } from '../../services';

export const DashboardMetrics: React.FC = () => {
  const { data: retention, loading: retentionLoading } = useRetentionAnalytics();
  const { data: engagement, loading: engagementLoading } = useEngagementMetrics();
  const { data: revenue, loading: revenueLoading } = useRevenueAnalytics();
  const { data: database, loading: databaseLoading } = useDatabaseStats();

  if (retentionLoading || engagementLoading || revenueLoading || databaseLoading) {
    return <div className="p-4">Loading dashboard metrics...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
      {/* Revenue Metrics */}
      {revenue && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Revenue</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="font-bold">{DataFormatter.formatCurrency(revenue.revenue.total)}</span>
            </div>
            <div className="flex justify-between">
              <span>MRR:</span>
              <span>{DataFormatter.formatCurrency(revenue.metrics.mrr)}</span>
            </div>
            <div className="flex justify-between">
              <span>Growth:</span>
              <span className="text-green-600">{revenue.revenue.growth}</span>
            </div>
          </div>
        </div>
      )}

      {/* Engagement Metrics */}
      {engagement && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Engagement</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>DAU:</span>
              <span className="font-bold">{DataFormatter.formatNumber(engagement.metrics.dailyActiveUsers)}</span>
            </div>
            <div className="flex justify-between">
              <span>MAU:</span>
              <span>{DataFormatter.formatNumber(engagement.metrics.monthlyActiveUsers)}</span>
            </div>
            <div className="flex justify-between">
              <span>Session:</span>
              <span>{DataFormatter.formatDuration(engagement.metrics.averageSessionDuration)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Database Stats */}
      {database && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Database</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Collections:</span>
              <span className="font-bold">{database.overview.collections}</span>
            </div>
            <div className="flex justify-between">
              <span>Objects:</span>
              <span>{DataFormatter.formatNumber(database.overview.objects)}</span>
            </div>
            <div className="flex justify-between">
              <span>Size:</span>
              <span>{database.overview.dataSize}</span>
            </div>
          </div>
        </div>
      )}

      {/* Retention Stats */}
      {retention && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Retention</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Week 1:</span>
              <span className="font-bold">{DataFormatter.formatPercentage(retention.averageRetention.week1)}</span>
            </div>
            <div className="flex justify-between">
              <span>Week 4:</span>
              <span>{DataFormatter.formatPercentage(retention.averageRetention.week4)}</span>
            </div>
            <div className="flex justify-between">
              <span>Week 8:</span>
              <span>{DataFormatter.formatPercentage(retention.averageRetention.week8)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};