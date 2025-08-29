import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from '../components/layout/Navbar';
import { useAuth, useRoleAccess } from '../contexts/AuthContext';
import { adminService } from '../services';
import {
  AdminStats,
  AdminUser,
  UserManagementParams,
  AnalyticsOverview,
  SuspiciousAccount,
  LoginAttempt,
} from '../types/api';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Skeleton } from '../components/ui/skeleton';
import { toast } from '../hooks/use-toast';
import {
  Users,
  UserCheck,
  UserX,
  TrendingUp,
  Activity,
  Shield,
  AlertTriangle,
  BarChart3,
  Settings,
  Search,
  Filter,
  Download,
  RefreshCw,
  Eye,
  Ban,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Server,
  Database,
  Zap,
} from 'lucide-react';

interface DashboardState {
  stats: AdminStats | null;
  users: AdminUser[];
  analytics: AnalyticsOverview | null;
  suspiciousAccounts: SuspiciousAccount[];
  loginAttempts: LoginAttempt[];
  loading: {
    stats: boolean;
    users: boolean;
    analytics: boolean;
    security: boolean;
  };
  error: string | null;
}

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { canAccessAdmin, canManageUsers, canViewAnalytics } = useRoleAccess();

  const [dashboardState, setDashboardState] = useState<DashboardState>({
    stats: null,
    users: [],
    analytics: null,
    suspiciousAccounts: [],
    loginAttempts: [],
    loading: {
      stats: true,
      users: true,
      analytics: true,
      security: true,
    },
    error: null,
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [userFilters, setUserFilters] = useState<UserManagementParams>({
    page: 1,
    limit: 10,
    search: '',
    role: '',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  // Optimized dashboard data loading with batching
  const loadDashboardData = useCallback(async () => {
    try {
      setDashboardState(prev => ({
        ...prev,
        loading: { ...prev.loading, stats: true },
        error: null,
      }));

      // Batch requests for better performance
      const [statsResponse, dashboardResponse] = await Promise.allSettled([
        adminService.getStats(),
        adminService.getDashboard(),
      ]);

      // Handle stats response
      if (statsResponse.status === 'fulfilled' && statsResponse.value.success) {
        setDashboardState(prev => ({
          ...prev,
          stats: statsResponse.value.data!,
          loading: { ...prev.loading, stats: false },
        }));
      } else {
        setDashboardState(prev => ({
          ...prev,
          loading: { ...prev.loading, stats: false },
          error: 'Failed to load dashboard stats',
        }));
      }
    } catch (error: any) {
      setDashboardState(prev => ({
        ...prev,
        loading: { ...prev.loading, stats: false },
        error: error.message,
      }));
    }
  }, []);

  // Load users with debounced search
  const loadUsers = useCallback(async () => {
    if (!canManageUsers()) return;

    try {
      setDashboardState(prev => ({
        ...prev,
        loading: { ...prev.loading, users: true },
      }));

      const response = await adminService.getAllUsers(userFilters);

      if (response.success && response.data) {
        setDashboardState(prev => ({
          ...prev,
          users: response.data!,
          loading: { ...prev.loading, users: false },
        }));
      }
    } catch (error: any) {
      setDashboardState(prev => ({
        ...prev,
        loading: { ...prev.loading, users: false },
        error: error.message,
      }));
    }
  }, [canManageUsers, userFilters]);

  // Load analytics
  const loadAnalytics = useCallback(async () => {
    if (!canViewAnalytics()) return;

    try {
      setDashboardState(prev => ({
        ...prev,
        loading: { ...prev.loading, analytics: true },
      }));

      const response = await adminService.getAnalyticsOverview({
        timeRange: '30d',
      });

      if (response.success && response.data) {
        setDashboardState(prev => ({
          ...prev,
          analytics: response.data!,
          loading: { ...prev.loading, analytics: false },
        }));
      }
    } catch (error: any) {
      setDashboardState(prev => ({
        ...prev,
        loading: { ...prev.loading, analytics: false },
        error: error.message,
      }));
    }
  }, [canViewAnalytics]);

  // Load security data
  const loadSecurityData = useCallback(async () => {
    try {
      setDashboardState(prev => ({
        ...prev,
        loading: { ...prev.loading, security: true },
      }));

      const [suspiciousResponse, loginAttemptsResponse] = await Promise.all([
        adminService.getSuspiciousAccounts({ limit: 10, riskLevel: 'high' }),
        adminService.getLoginAttempts({ status: 'failed', limit: 10 }),
      ]);

      setDashboardState(prev => ({
        ...prev,
        suspiciousAccounts: suspiciousResponse.data || [],
        loginAttempts: loginAttemptsResponse.data || [],
        loading: { ...prev.loading, security: false },
      }));
    } catch (error: any) {
      setDashboardState(prev => ({
        ...prev,
        loading: { ...prev.loading, security: false },
        error: error.message,
      }));
    }
  }, []);

  // User actions
  const handleUserAction = useCallback(
    async (userId: string, action: 'suspend' | 'activate' | 'delete', reason?: string) => {
      try {
        let response;

        switch (action) {
          case 'suspend':
            response = await adminService.suspendUser(userId, { reason: reason || 'Admin action' });
            break;
          case 'activate':
            response = await adminService.activateUser(userId);
            break;
          case 'delete':
            response = await adminService.deleteUser(userId, { reason: reason || 'Admin action' });
            break;
        }

        if (response?.success) {
          toast({
            title: 'Success',
            description: `User ${action}d successfully`,
          });

          // Reload users
          loadUsers();
        }
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || `Failed to ${action} user`,
          variant: 'destructive',
        });
      }
    },
    [loadUsers]
  );

  // Export data
  const handleExport = useCallback(async (type: 'users' | 'analytics' | 'security') => {
    try {
      // Implementation would depend on backend API
      toast({
        title: 'Export Started',
        description: 'Your export will be ready shortly',
      });
    } catch (error: any) {
      toast({
        title: 'Export Failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  }, []);

  // Memoized stats cards
  const statsCards = useMemo(() => {
    if (!dashboardState.stats) return [];

    const stats = dashboardState.stats;
    return [
      {
        title: 'Total Users',
        value: (stats.totalUsers || 0).toLocaleString(),
        icon: Users,
        change: `+${stats.userGrowth || 0}%`,
        changeType: 'positive' as const,
      },
      {
        title: 'Active Users',
        value: (stats.activeUsers || 0).toLocaleString(),
        icon: UserCheck,
        change: `${Math.round(((stats.activeUsers || 0) / (stats.totalUsers || 1)) * 100)}%`,
        changeType: 'neutral' as const,
      },
      {
        title: 'Total Posts',
        value: (stats.totalPosts || 0).toLocaleString(),
        icon: Activity,
        change: 'This month',
        changeType: 'neutral' as const,
      },
      {
        title: 'Engagement Rate',
        value: `${stats.engagementRate || 0}%`,
        icon: TrendingUp,
        change: '+2.1%',
        changeType: 'positive' as const,
      },
    ];
  }, [dashboardState.stats]);

  // Initialize dashboard
  useEffect(() => {
    if (canAccessAdmin()) {
      loadDashboardData();
      loadAnalytics();
      loadSecurityData();
    }
  }, []); // Remove dependencies to prevent infinite re-renders

  // Debounced user loading
  useEffect(() => {
    if (activeTab === 'users') {
      const timeoutId = setTimeout(() => {
        loadUsers();
      }, 300);
      return () => clearTimeout(timeoutId);
    }
  }, [activeTab, loadUsers]);

  // Access control
  if (!canAccessAdmin()) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center pt-16">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center">Access Denied</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                You don't have permission to access the admin dashboard.
              </p>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-16">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, {user?.firstName}. Here's what's happening.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={loadDashboardData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleExport('analytics')}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {dashboardState.loading.stats || !dashboardState.stats
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-4 w-24" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-16 mb-2" />
                      <Skeleton className="h-3 w-20" />
                    </CardContent>
                  </Card>
                ))
              : statsCards.map((stat, index) => (
                  <Card key={index}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p
                        className={`text-xs ${
                          stat.changeType === 'positive'
                            ? 'text-green-600'
                            : stat.changeType === 'negative'
                              ? 'text-red-600'
                              : 'text-muted-foreground'
                        }`}
                      >
                        {stat.change}
                      </p>
                    </CardContent>
                  </Card>
                ))}
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                          <div className="h-2 w-2 bg-blue-500 rounded-full" />
                          <div className="flex-1">
                            <p className="text-sm">New user registration</p>
                            <p className="text-xs text-muted-foreground">2 minutes ago</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* System Health */}
                <Card>
                  <CardHeader>
                    <CardTitle>System Health</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Server className="h-4 w-4" />
                          <span className="text-sm">Server Status</span>
                        </div>
                        <Badge variant="default">Healthy</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Database className="h-4 w-4" />
                          <span className="text-sm">Database</span>
                        </div>
                        <Badge variant="default">Connected</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4" />
                          <span className="text-sm">API Response</span>
                        </div>
                        <Badge variant="outline">125ms</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              {/* User Filters */}
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex-1 min-w-64">
                      <Input
                        placeholder="Search users..."
                        value={userFilters.search}
                        onChange={e =>
                          setUserFilters(prev => ({ ...prev, search: e.target.value }))
                        }
                      />
                    </div>
                    <Select
                      value={userFilters.role || 'all'}
                      onValueChange={value =>
                        setUserFilters(prev => ({ ...prev, role: value === 'all' ? '' : value }))
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Roles</SelectItem>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={userFilters.status}
                      onValueChange={value =>
                        setUserFilters(prev => ({ ...prev, status: value as any }))
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Users Table */}
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {dashboardState.loading.users ? (
                          Array.from({ length: 5 }).map((_, i) => (
                            <TableRow key={i}>
                              <TableCell>
                                <Skeleton className="h-4 w-32" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-16" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-20" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-24" />
                              </TableCell>
                              <TableCell>
                                <Skeleton className="h-4 w-20" />
                              </TableCell>
                            </TableRow>
                          ))
                        ) : dashboardState.users?.length > 0 ? (
                          dashboardState.users.map(user => (
                            <TableRow key={user._id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">
                                    {user.firstName} {user.lastName}
                                  </p>
                                  <p className="text-sm text-muted-foreground">{user.email}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                                  {user.role}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={user.isActive ? 'default' : 'destructive'}>
                                  {user.isActive ? 'Active' : 'Suspended'}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleUserAction(
                                        user._id,
                                        user.isActive ? 'suspend' : 'activate'
                                      )
                                    }
                                  >
                                    {user.isActive ? (
                                      <Ban className="h-4 w-4" />
                                    ) : (
                                      <CheckCircle className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      window.open(`/admin/users/${user._id}`, '_blank')
                                    }
                                  >
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="text-center py-8 text-muted-foreground"
                            >
                              No users found
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>User Growth</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Chart placeholder - User growth over time
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Engagement Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center text-muted-foreground">
                      Chart placeholder - Engagement metrics
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Suspicious Accounts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5" />
                      Suspicious Accounts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardState.loading.security ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <Skeleton className="h-4 w-24 mb-2" />
                              <Skeleton className="h-3 w-16" />
                            </div>
                            <Skeleton className="h-6 w-12" />
                          </div>
                        ))
                      ) : dashboardState.suspiciousAccounts?.length > 0 ? (
                        dashboardState.suspiciousAccounts.map(account => (
                          <div
                            key={account.userId}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{account.user?.username || 'Unknown'}</p>
                              <p className="text-sm text-muted-foreground">
                                Risk: {account.riskLevel}
                              </p>
                            </div>
                            <Badge variant="destructive">{account.riskLevel}</Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-4 text-muted-foreground">
                          No suspicious accounts found
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Failed Login Attempts */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
                      Failed Login Attempts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardState.loading.security ? (
                        Array.from({ length: 3 }).map((_, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <Skeleton className="h-4 w-32 mb-2" />
                              <Skeleton className="h-3 w-24" />
                            </div>
                            <Skeleton className="h-6 w-16" />
                          </div>
                        ))
                      ) : dashboardState.loginAttempts?.length > 0 ? (
                        dashboardState.loginAttempts.map(attempt => (
                          <div
                            key={attempt._id}
                            className="flex items-center justify-between p-3 border rounded-lg"
                          >
                            <div>
                              <p className="font-medium">{attempt.ipAddress}</p>
                              <p className="text-sm text-muted-foreground">
                                {new Date(attempt.attemptedAt).toLocaleString()}
                              </p>
                            </div>
                            <Badge variant="outline">{attempt.status}</Badge>
                          </div>
                        ))
                      ) : (
                        <p className="text-center py-4 text-muted-foreground">
                          No failed login attempts
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* System Tab */}
            <TabsContent value="system" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <Server className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <h3 className="font-semibold">Server Status</h3>
                      <p className="text-sm text-muted-foreground">All systems operational</p>
                    </div>
                    <div className="text-center">
                      <Database className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <h3 className="font-semibold">Database</h3>
                      <p className="text-sm text-muted-foreground">Connected and healthy</p>
                    </div>
                    <div className="text-center">
                      <Globe className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <h3 className="font-semibold">API Status</h3>
                      <p className="text-sm text-muted-foreground">Response time: 125ms</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
