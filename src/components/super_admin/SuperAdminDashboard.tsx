import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';
import { SecurityOverviewCard } from './SecurityOverview';
import { DatabaseStatsCard } from './DatabaseStats';
import { RetentionAnalyticsCard } from './RetentionAnalytics';
import { RevenueAnalyticsCard } from './RevenueAnalytics';
import { EngagementMetricsCard } from './EngagementMetrics';
import { serviceManager } from '../../services';
import type { 
  SecurityOverview, 
  DatabaseStats, 
  RetentionAnalytics, 
  RevenueAnalytics, 
  UserLifetimeValue,
  EngagementMetrics 
} from '../../services/modules';

export const SuperAdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    security: SecurityOverview | null;
    database: DatabaseStats | null;
    retention: RetentionAnalytics | null;
    revenue: RevenueAnalytics | null;
    ltv: UserLifetimeValue | null;
    engagement: EngagementMetrics | null;
  }>({
    security: null,
    database: null,
    retention: null,
    revenue: null,
    ltv: null,
    engagement: null,
  });

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [security, database, retention, revenue, ltv, engagement] = await Promise.allSettled([
        serviceManager.getSecurityOverview(),
        serviceManager.getDatabaseStats(),
        serviceManager.getRetentionAnalytics(),
        serviceManager.getRevenueAnalytics(),
        serviceManager.getUserLifetimeValue(),
        serviceManager.getEngagementMetrics(),
      ]);

      setData({
        security: security.status === 'fulfilled' ? security.value : null,
        database: database.status === 'fulfilled' ? database.value : null,
        retention: retention.status === 'fulfilled' ? retention.value : null,
        revenue: revenue.status === 'fulfilled' ? revenue.value : null,
        ltv: ltv.status === 'fulfilled' ? ltv.value : null,
        engagement: engagement.status === 'fulfilled' ? engagement.value : null,
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
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.security && <SecurityOverviewCard data={data.security} />}
            {data.engagement && <EngagementMetricsCard data={data.engagement} />}
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          {data.security && <SecurityOverviewCard data={data.security} />}
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.retention && <RetentionAnalyticsCard data={data.retention} />}
            {data.engagement && <EngagementMetricsCard data={data.engagement} />}
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          {data.revenue && <RevenueAnalyticsCard revenue={data.revenue} ltv={data.ltv} />}
        </TabsContent>

        <TabsContent value="system" className="space-y-4">
          {data.database && <DatabaseStatsCard data={data.database} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};