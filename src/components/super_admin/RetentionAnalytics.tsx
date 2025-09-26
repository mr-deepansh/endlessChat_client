import React from 'react';
import { TrendingUp, Users, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Progress } from '../ui/progress';
import { DataFormatter } from '../../services';
import type { RetentionAnalytics } from '../../services/modules';

interface RetentionAnalyticsProps {
  data: RetentionAnalytics;
}

export const RetentionAnalyticsCard: React.FC<RetentionAnalyticsProps> = ({ data }) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            User Retention ({data.cohortPeriod})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <p className="text-lg font-bold">
                {DataFormatter.formatPercentage(data.averageRetention.week1)}
              </p>
              <p className="text-sm text-gray-600">Week 1</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">
                {DataFormatter.formatPercentage(data.averageRetention.week2)}
              </p>
              <p className="text-sm text-gray-600">Week 2</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">
                {DataFormatter.formatPercentage(data.averageRetention.week4)}
              </p>
              <p className="text-sm text-gray-600">Week 4</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">
                {DataFormatter.formatPercentage(data.averageRetention.week8)}
              </p>
              <p className="text-sm text-gray-600">Week 8</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Cohort Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {data.cohorts.map(cohort => (
              <div key={cohort.cohort} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{cohort.cohort}</span>
                  <span className="text-sm text-gray-600">
                    {DataFormatter.formatNumber(cohort.users)} users
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  <div className="space-y-1">
                    <Progress value={cohort.retention.week1} className="h-2" />
                    <p className="text-xs text-center">{cohort.retention.week1}%</p>
                  </div>
                  <div className="space-y-1">
                    <Progress value={cohort.retention.week2} className="h-2" />
                    <p className="text-xs text-center">{cohort.retention.week2}%</p>
                  </div>
                  <div className="space-y-1">
                    <Progress value={cohort.retention.week4} className="h-2" />
                    <p className="text-xs text-center">{cohort.retention.week4}%</p>
                  </div>
                  <div className="space-y-1">
                    <Progress value={cohort.retention.week8} className="h-2" />
                    <p className="text-xs text-center">{cohort.retention.week8}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
