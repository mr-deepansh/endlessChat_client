import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { RefreshCw } from 'lucide-react';
import { DashboardMetrics } from './DashboardMetrics';
import { SecurityOverviewCard } from '../super_admin/SecurityOverview';
import { EngagementMetricsCard } from '../super_admin/EngagementMetrics';
import { serviceManager } from '../../services';
import type { SecurityOverview, EngagementMetrics } from '../../services/modules';

export const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<{
    security: SecurityOverview | null;
    engagement: EngagementMetrics | null;
  }>({
    security: null,
    engagement: null,
  });

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [security, engagement] = await Promise.allSettled([
        serviceManager.getSecurityOverview(),
        serviceManager.getEngagementMetrics(),
      ]);

      setData({
        security: security.status === 'fulfilled' ? security.value : null,
        engagement: engagement.status === 'fulfilled' ? engagement.value : null,
      });
    } catch (error) {
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
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={loadDashboardData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <DashboardMetrics />
          {data.engagement && <EngagementMetricsCard data={data.engagement} />}
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          {data.security && <SecurityOverviewCard data={data.security} />}
        </TabsContent>

        <TabsContent value="engagement" className="space-y-4">
          {data.engagement && <EngagementMetricsCard data={data.engagement} />}
        </TabsContent>
      </Tabs>
    </div>
  );
};
