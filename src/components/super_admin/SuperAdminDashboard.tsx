import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';
import { SecurityOverviewCard } from './SecurityOverview';
import { DatabaseStatsCard } from './DatabaseStats';
import { RetentionAnalyticsCard } from './RetentionAnalytics';
import { EngagementMetricsCard } from './EngagementMetrics';
import { adminService } from '../../services/adminService';
import type {
  SecurityOverview,
  DatabaseStats,
  RetentionAnalytics,
  EngagementMetrics,
} from '../../services/modules';

export const SuperAdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    security: SecurityOverview | null;
    database: DatabaseStats | null;
    retention: RetentionAnalytics | null;
    engagement: EngagementMetrics | null;
  }>({
    security: null,
    database: null,
    retention: null,
    engagement: null,
  });

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [database, retention, engagement] = await Promise.allSettled([
        adminService.getDatabaseStats(),
        adminService.getUserRetentionAnalytics({ cohortPeriod: 'monthly' }),
        adminService.getEngagementMetrics({ timeRange: '30d' }),
      ]);

      setData({
        security: null, // Mock data for now
        database: database.status === 'fulfilled' && database.value.success ? database.value.data : null,
        retention: retention.status === 'fulfilled' && retention.value.success ? retention.value.data : null,
        engagement: engagement.status === 'fulfilled' && engagement.value.success ? engagement.value.data : null,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Super Admin Dashboard</h1>
        <Button onClick={loadDashboardData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.engagement && <EngagementMetricsCard data={data.engagement} />}
            {data.database && <DatabaseStatsCard data={data.database} />}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.retention && <RetentionAnalyticsCard data={data.retention} />}
            {data.engagement && <EngagementMetricsCard data={data.engagement} />}
          </div>
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          {data.database && <DatabaseStatsCard data={data.database} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};
