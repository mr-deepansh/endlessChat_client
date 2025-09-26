import React from 'react';
import { Activity, Clock, Eye, MousePointer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { DataFormatter } from '../../services';
import type { EngagementMetrics } from '../../services/modules';

interface EngagementMetricsProps {
  data: EngagementMetrics;
}

export const EngagementMetricsCard: React.FC<EngagementMetricsProps> = ({ data }) => {
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return 'text-green-600';
      case 'decreasing':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing':
        return '↗️';
      case 'decreasing':
        return '↘️';
      default:
        return '➡️';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Engagement Metrics ({data.timeRange})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Daily Active Users</p>
                <p className="text-2xl font-bold">
                  {DataFormatter.formatNumber(data.metrics.dailyActiveUsers)}
                </p>
              </div>
              <div className="text-right">
                <span className={`text-sm ${getTrendColor(data.trends.dailyActive)}`}>
                  {getTrendIcon(data.trends.dailyActive)} {data.trends.dailyActive}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600">Weekly Active Users</p>
              <p className="text-lg font-semibold">
                {DataFormatter.formatNumber(data.metrics.weeklyActiveUsers)}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-600">Monthly Active Users</p>
              <p className="text-lg font-semibold">
                {DataFormatter.formatNumber(data.metrics.monthlyActiveUsers)}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Session Duration</p>
                <p className="text-lg font-semibold">
                  {DataFormatter.formatDuration(data.metrics.averageSessionDuration)}
                </p>
              </div>
              <div className="text-right">
                <span className={`text-sm ${getTrendColor(data.trends.engagement)}`}>
                  {getTrendIcon(data.trends.engagement)} {data.trends.engagement}
                </span>
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600">Bounce Rate</p>
              <p className="text-lg font-semibold">
                {DataFormatter.formatPercentage(data.metrics.bounceRate)}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pages per Session</p>
                <p className="text-lg font-semibold">
                  {(data.metrics.pageViewsPerSession || 0).toFixed(1)}
                </p>
              </div>
              <div className="text-right">
                <span className={`text-sm ${getTrendColor(data.trends.retention)}`}>
                  {getTrendIcon(data.trends.retention)} {data.trends.retention}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              High Engagement
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {data.trends.retention === 'improving' ? 'Retention Up' : 'Monitor Retention'}
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <MousePointer className="h-3 w-3" />
              Low Bounce Rate
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
