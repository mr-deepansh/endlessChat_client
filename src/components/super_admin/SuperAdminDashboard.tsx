import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import {
  RefreshCw,
  Shield,
  Users,
  Database,
  Activity,
  AlertTriangle,
  Lock,
  Settings,
  TrendingUp,
  Server,
} from 'lucide-react';
import { SecurityOverviewCard } from './SecurityOverview';
import { DatabaseStatsCard } from './DatabaseStats';
import { RetentionAnalyticsCard } from './RetentionAnalytics';
import { EngagementMetricsCard } from './EngagementMetrics';
import { DashboardMetrics } from '../admin/DashboardMetrics';
import { adminService } from '../../services/adminService';
import { superAdminService } from '../../services/modules/superAdmin.service';
import type {
  SecurityOverview,
  DatabaseStats,
  RetentionAnalytics,
  EngagementMetrics,
} from '../../services/modules';
import type { AdminStats } from '../../types/api';

interface SuperAdminData {
  adminStats: AdminStats | null;
  database: DatabaseStats | null;
  retention: RetentionAnalytics | null;
  engagement: EngagementMetrics | null;
  systemMetrics: any | null;
  securityReport: any | null;
  allAdmins: any[] | null;
  auditLogs: any | null;
  systemConfig: any | null;
}

export const SuperAdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<SuperAdminData>({
    adminStats: null,
    database: null,
    retention: null,
    engagement: null,
    systemMetrics: null,
    securityReport: null,
    allAdmins: null,
    auditLogs: null,
    systemConfig: null,
  });

  const loadDashboardData = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      // Fetch all data in parallel for better performance
      const [
        stats,
        database,
        retention,
        engagement,
        systemMetrics,
        securityReport,
        admins,
        auditLogs,
        systemConfig,
      ] = await Promise.allSettled([
        adminService.getStats(),
        adminService.getDatabaseStats(),
        adminService.getUserRetentionAnalytics({ cohortPeriod: 'monthly' }),
        adminService.getEngagementMetrics({ timeRange: '30d' }),
        superAdminService.getSystemMetrics(),
        superAdminService.getSecurityReport('7d'),
        superAdminService.getAllAdmins(),
        superAdminService.getAuditLogs({ limit: 10, page: 1 }),
        superAdminService.getSystemConfig(),
      ]);

      setData({
        adminStats:
          stats.status === 'fulfilled' && stats.value.success ? stats.value.data.stats : null,
        database:
          database.status === 'fulfilled' && database.value.success ? database.value.data : null,
        retention:
          retention.status === 'fulfilled' && retention.value.success ? retention.value.data : null,
        engagement:
          engagement.status === 'fulfilled' && engagement.value.success
            ? engagement.value.data
            : null,
        systemMetrics:
          systemMetrics.status === 'fulfilled' && systemMetrics.value.success
            ? systemMetrics.value.data
            : null,
        securityReport:
          securityReport.status === 'fulfilled' && securityReport.value.success
            ? securityReport.value.data
            : null,
        allAdmins: admins.status === 'fulfilled' && admins.value.success ? admins.value.data : null,
        auditLogs:
          auditLogs.status === 'fulfilled' && auditLogs.value.success ? auditLogs.value.data : null,
        systemConfig:
          systemConfig.status === 'fulfilled' && systemConfig.value.success
            ? systemConfig.value.data
            : null,
      });
    } catch (error) {
      console.error('Error loading super admin dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-3 text-gray-600">Loading super admin dashboard...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Complete system control and monitoring</p>
        </div>
        <Button
          onClick={() => loadDashboardData(true)}
          variant="outline"
          size="sm"
          disabled={refreshing}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Refreshing...' : 'Refresh'}
        </Button>
      </div>

      {/* Quick Stats */}
      {data.adminStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Users</p>
                  <h3 className="text-2xl font-bold mt-1">{data.adminStats.totalUsers}</h3>
                  <p className="text-xs text-green-600 mt-1">↑ Active users</p>
                </div>
                <Users className="h-10 w-10 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Posts</p>
                  <h3 className="text-2xl font-bold mt-1">{data.adminStats.totalPosts}</h3>
                  <p className="text-xs text-blue-600 mt-1">Content created</p>
                </div>
                <Activity className="h-10 w-10 text-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Admins</p>
                  <h3 className="text-2xl font-bold mt-1">{data.allAdmins?.length || 0}</h3>
                  <p className="text-xs text-indigo-600 mt-1">System administrators</p>
                </div>
                <Shield className="h-10 w-10 text-indigo-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Security Events</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {data.securityReport?.summary?.criticalEvents || 0}
                  </h3>
                  <p className="text-xs text-red-600 mt-1">Critical alerts</p>
                </div>
                <AlertTriangle className="h-10 w-10 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* System Health Overview */}
      {data.systemMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Server className="h-5 w-5 mr-2" />
              System Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Server Status</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">CPU Usage</span>
                    <span className="text-xs font-semibold">
                      {data.systemMetrics.server?.cpu?.usage || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Memory</span>
                    <span className="text-xs font-semibold">
                      {data.systemMetrics.server?.memory?.percentage || 0}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Disk</span>
                    <span className="text-xs font-semibold">
                      {data.systemMetrics.server?.disk?.percentage || 0}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Application</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Active Users</span>
                    <span className="text-xs font-semibold">
                      {data.systemMetrics.application?.activeUsers || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Req/s</span>
                    <span className="text-xs font-semibold">
                      {data.systemMetrics.application?.requestsPerSecond || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Error Rate</span>
                    <span className="text-xs font-semibold">
                      {data.systemMetrics.application?.errorRate || 0}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4">
                <p className="text-sm font-medium text-gray-500 mb-2">Database</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Connections</span>
                    <span className="text-xs font-semibold">
                      {data.systemMetrics.database?.connections || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Query Time</span>
                    <span className="text-xs font-semibold">
                      {data.systemMetrics.database?.queryTime || 0}ms
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-gray-600">Throughput</span>
                    <span className="text-xs font-semibold">
                      {data.systemMetrics.database?.throughput || 0}/s
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="admins">Admins</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
          <TabsTrigger value="audit">Audit Logs</TabsTrigger>
        </TabsList>

        {/* Overview Tab - Inherits Admin Dashboard Functionality */}
        <TabsContent value="overview" className="space-y-4">
          {data.adminStats && <DashboardMetrics />}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.engagement && <EngagementMetricsCard data={data.engagement} />}
            {data.database && <DatabaseStatsCard data={data.database} />}
          </div>
        </TabsContent>

        {/* Admins Management Tab */}
        <TabsContent value="admins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Administrator Management</CardTitle>
            </CardHeader>
            <CardContent>
              {data.allAdmins && data.allAdmins.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-sm text-gray-600">Total Admins: {data.allAdmins.length}</p>
                    <Button size="sm">Add Admin</Button>
                  </div>
                  <div className="border rounded-lg">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Admin
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Role
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Last Active
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {data.allAdmins.slice(0, 10).map((admin: any, index: number) => (
                          <tr key={admin._id || index}>
                            <td className="px-4 py-3 text-sm">
                              <div>
                                <div className="font-medium">{admin.username}</div>
                                <div className="text-gray-500">{admin.email}</div>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-700">
                                {admin.role}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  admin.isActive
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                                }`}
                              >
                                {admin.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-500">
                              {admin.lastLogin
                                ? new Date(admin.lastLogin).toLocaleDateString()
                                : 'Never'}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <Button variant="ghost" size="sm">
                                Manage
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No administrators found</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-4">
          {data.securityReport && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Lock className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                      <p className="text-sm text-gray-500">Total Events</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {data.securityReport.summary?.totalEvents || 0}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <AlertTriangle className="h-8 w-8 mx-auto text-red-500 mb-2" />
                      <p className="text-sm text-gray-500">Critical Events</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {data.securityReport.summary?.criticalEvents || 0}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <Shield className="h-8 w-8 mx-auto text-green-500 mb-2" />
                      <p className="text-sm text-gray-500">Resolved</p>
                      <h3 className="text-2xl font-bold mt-1">
                        {data.securityReport.summary?.resolvedEvents || 0}
                      </h3>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {data.securityReport.topThreats && data.securityReport.topThreats.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Top Security Threats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {data.securityReport.topThreats.map((threat: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium">{threat.type}</p>
                            <p className="text-sm text-gray-500">Count: {threat.count}</p>
                          </div>
                          <span
                            className={`px-3 py-1 text-xs rounded-full ${
                              threat.trend === 'increasing'
                                ? 'bg-red-100 text-red-700'
                                : threat.trend === 'decreasing'
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {threat.trend}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {data.retention && <RetentionAnalyticsCard data={data.retention} />}
            {data.engagement && <EngagementMetricsCard data={data.engagement} />}
          </div>
        </TabsContent>

        {/* System Tab */}
        <TabsContent value="system" className="space-y-4">
          {data.database && <DatabaseStatsCard data={data.database} />}

          {data.systemConfig && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="h-5 w-5 mr-2" />
                  System Configuration
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Security Settings</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Max Login Attempts</span>
                        <span className="font-medium">
                          {data.systemConfig.security?.maxLoginAttempts}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Session Timeout</span>
                        <span className="font-medium">
                          {data.systemConfig.security?.sessionTimeout}min
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">2FA Enabled</span>
                        <span className="font-medium">
                          {data.systemConfig.security?.twoFactorAuth?.enabled ? 'Yes' : 'No'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Feature Flags</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Registration</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            data.systemConfig.features?.registration
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {data.systemConfig.features?.registration ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email Verification</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            data.systemConfig.features?.emailVerification
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {data.systemConfig.features?.emailVerification ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Content Moderation</span>
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            data.systemConfig.features?.contentModeration
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {data.systemConfig.features?.contentModeration ? 'Enabled' : 'Disabled'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Audit Logs Tab */}
        <TabsContent value="audit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Audit Logs</CardTitle>
            </CardHeader>
            <CardContent>
              {data.auditLogs?.data && data.auditLogs.data.length > 0 ? (
                <div className="space-y-3">
                  {data.auditLogs.data.map((log: any) => (
                    <div key={log.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{log.adminUsername}</span>
                            <span
                              className={`px-2 py-0.5 text-xs rounded ${
                                log.criticality === 'CRITICAL'
                                  ? 'bg-red-100 text-red-700'
                                  : log.criticality === 'HIGH'
                                    ? 'bg-orange-100 text-orange-700'
                                    : log.criticality === 'MEDIUM'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-gray-100 text-gray-700'
                              }`}
                            >
                              {log.criticality}
                            </span>
                            <span
                              className={`px-2 py-0.5 text-xs rounded ${
                                log.result === 'SUCCESS'
                                  ? 'bg-green-100 text-green-700'
                                  : log.result === 'FAILURE'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-yellow-100 text-yellow-700'
                              }`}
                            >
                              {log.result}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 mb-1">{log.action}</p>
                          <p className="text-xs text-gray-500">
                            {log.targetType} • {log.ipAddress} •{' '}
                            {new Date(log.timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">No audit logs available</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
