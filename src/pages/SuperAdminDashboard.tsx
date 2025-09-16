import {
  Activity,
  Ban,
  CheckCircle,
  Clock,
  Crown,
  Database,
  Download,
  Eye,
  FileText,
  Lock,
  RefreshCw,
  Server,
  Shield,
  Trash2,
  UserCheck,
  UserPlus,
  Users,
} from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import Navbar from '../components/layout/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { useAuth, useRoleAccess } from '../contexts/AuthContext';
import { toast } from '../hooks/use-toast';
import { usePageTitle } from '../hooks/usePageTitle';
import { adminService } from '../services/modules/admin.service';
import { superAdminService } from '../services/modules/superAdmin.service';
import {
  AdminStats,
  User as AdminUser,
  AuditLog,
  UserManagementParams,
  AnalyticsOverview,
  SuspiciousAccount,
  LoginAttempt,
} from '../types/api';

// Define missing types locally
interface UserManagementParams {
  page: number;
  limit: number;
  search: string;
  role: string;
  status: string;
  sortBy: string;
  sortOrder: string;
}

interface CreateAdminRequest {
  username: string;
  email: string;
  password: string;
  role: 'admin' | 'super_admin';
  firstName?: string;
  lastName?: string;
}

interface EmergencyLockdownRequest {
  reason: string;
  duration: string;
  password: string;
}

interface SuperAdminState {
  stats: AdminStats | null;
  users: AdminUser[];
  admins: AdminUser[];
  auditLogs: AuditLog[];
  systemConfig: any;
  analytics: AnalyticsOverview | null;
  suspiciousAccounts: SuspiciousAccount[];
  loginAttempts: LoginAttempt[];
  loading: {
    stats: boolean;
    users: boolean;
    admins: boolean;
    auditLogs: boolean;
    system: boolean;
    analytics: boolean;
    security: boolean;
  };
  error: string | null;
}

const SuperAdminDashboard: React.FC = () => {
  usePageTitle('Super Admin Dashboard');
  const { user } = useAuth();
  const { canAccessSuperAdmin } = useRoleAccess();

  const [dashboardState, setDashboardState] = useState<SuperAdminState>({
    stats: null,
    users: [],
    admins: [],
    auditLogs: [],
    systemConfig: null,
    analytics: null,
    suspiciousAccounts: [],
    loginAttempts: [],
    loading: {
      stats: true,
      users: true,
      admins: true,
      auditLogs: true,
      system: true,
      analytics: true,
      security: true,
    },
    error: null,
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [userFilters, setUserFilters] = useState<UserManagementParams>({
    page: 1,
    limit: 20,
    search: '',
    role: '',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [adminFilters, setAdminFilters] = useState<UserManagementParams>({
    page: 1,
    limit: 20,
    search: '',
    role: 'admin',
    status: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [createAdminDialog, setCreateAdminDialog] = useState(false);
  const [emergencyDialog, setEmergencyDialog] = useState(false);

  // Load dashboard data
  const loadDashboardData = useCallback(async () => {
    try {
      setDashboardState(prev => ({
        ...prev,
        loading: { ...prev.loading, stats: true },
        error: null,
      }));

      const response = await adminService.getStats();
      if (response.success && response.data) {
        setDashboardState(prev => ({
          ...prev,
          stats: response.data!,
          loading: { ...prev.loading, stats: false },
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

  // Load all users
  const loadUsers = useCallback(async () => {
    try {
      setDashboardState(prev => ({
        ...prev,
        loading: { ...prev.loading, users: true },
      }));

      const response = await adminService.getAllUsers({
        ...userFilters,
        role: 'user',
      });

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
  }, [userFilters]);

  // Load all admins
  const loadAdmins = useCallback(async () => {
    try {
      setDashboardState(prev => ({
        ...prev,
        loading: { ...prev.loading, admins: true },
      }));

      const response = await superAdminService.getAllAdmins();
      if (response.success && response.data) {
        setDashboardState(prev => ({
          ...prev,
          admins: response.data!,
          loading: { ...prev.loading, admins: false },
        }));
      }
    } catch (error: any) {
      setDashboardState(prev => ({
        ...prev,
        loading: { ...prev.loading, admins: false },
        error: error.message,
      }));
    }
  }, []);

  // Load audit logs
  const loadAuditLogs = useCallback(async () => {
    try {
      setDashboardState(prev => ({
        ...prev,
        loading: { ...prev.loading, auditLogs: true },
      }));

      const response = await superAdminService.getAuditLogs({
        page: 1,
        limit: 50,
      });

      if (response.success && response.data) {
        setDashboardState(prev => ({
          ...prev,
          auditLogs: response.data!,
          loading: { ...prev.loading, auditLogs: false },
        }));
      }
    } catch (error: any) {
      setDashboardState(prev => ({
        ...prev,
        loading: { ...prev.loading, auditLogs: false },
        error: error.message,
      }));
    }
  }, []);

  // Load system config
  const loadSystemConfig = useCallback(async () => {
    try {
      setDashboardState(prev => ({
        ...prev,
        loading: { ...prev.loading, system: true },
      }));

      const response = await superAdminService.getSystemConfig();
      if (response.success && response.data) {
        setDashboardState(prev => ({
          ...prev,
          systemConfig: response.data!,
          loading: { ...prev.loading, system: false },
        }));
      }
    } catch (error: any) {
      setDashboardState(prev => ({
        ...prev,
        loading: { ...prev.loading, system: false },
        error: error.message,
      }));
    }
  }, []);

  // Admin actions
  const handleAdminAction = useCallback(
    async (adminId: string, action: 'delete' | 'suspend' | 'activate', reason?: string) => {
      try {
        let response;

        switch (action) {
          case 'delete':
            response = await superAdminService.deleteAdmin(adminId, {
              confirmPassword: 'admin123', // This should be from a secure input
              reason: reason || 'Super admin action',
            });
            break;
          case 'suspend':
            response = await adminService.suspendUser(adminId, {
              reason: reason || 'Super admin action',
            });
            break;
          case 'activate':
            response = await adminService.activateUser(adminId);
            break;
        }

        if (response?.success) {
          toast({
            title: 'Success',
            description: `Admin ${action}d successfully`,
          });

          // Reload admins
          loadAdmins();
        }
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || `Failed to ${action} admin`,
          variant: 'destructive',
        });
      }
    },
    [loadAdmins]
  );

  // User role change
  const handleRoleChange = useCallback(
    async (userId: string, newRole: 'user' | 'admin' | 'super_admin', reason: string) => {
      try {
        const response = await superAdminService.changeUserRole(userId, {
          newRole,
          reason,
        });

        if (response?.success) {
          toast({
            title: 'Role Changed',
            description: `User role changed to ${newRole} successfully`,
          });

          // Reload data
          loadUsers();
          loadAdmins();
        }
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to change user role',
          variant: 'destructive',
        });
      }
    },
    [loadUsers, loadAdmins]
  );

  // Admin user actions (from Admin panel)
  const handleUserAction = useCallback(
    async (userId: string, action: 'suspend' | 'activate' | 'delete', reason?: string) => {
      try {
        let response;

        switch (action) {
          case 'suspend':
            response = await adminService.suspendUser(userId, {
              reason: reason || 'Super admin action',
            });
            break;
          case 'activate':
            response = await adminService.activateUser(userId);
            break;
          case 'delete':
            response = await adminService.deleteUser(userId, {
              reason: reason || 'Super admin action',
            });
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

  // Load analytics (Admin functionality)
  const loadAnalytics = useCallback(async () => {
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
      console.warn('Analytics not available:', error.message);
      setDashboardState(prev => ({
        ...prev,
        loading: { ...prev.loading, analytics: false },
        analytics: null,
      }));
    }
  }, []);

  // Load security data (Admin functionality)
  const loadSecurityData = useCallback(async () => {
    try {
      setDashboardState(prev => ({
        ...prev,
        loading: { ...prev.loading, security: true },
      }));

      const [suspiciousResponse, loginAttemptsResponse] = await Promise.allSettled([
        adminService.getSuspiciousAccounts({ limit: 10, riskLevel: 'high' }),
        adminService.getLoginAttempts({ status: 'failed', limit: 10 }),
      ]);

      setDashboardState(prev => ({
        ...prev,
        suspiciousAccounts:
          suspiciousResponse.status === 'fulfilled' ? suspiciousResponse.value.data || [] : [],
        loginAttempts:
          loginAttemptsResponse.status === 'fulfilled'
            ? loginAttemptsResponse.value.data || []
            : [],
        loading: { ...prev.loading, security: false },
      }));
    } catch (error: any) {
      console.warn('Security data not available:', error.message);
      setDashboardState(prev => ({
        ...prev,
        loading: { ...prev.loading, security: false },
        suspiciousAccounts: [],
        loginAttempts: [],
      }));
    }
  }, []);

  // Create new admin
  const handleCreateAdmin = useCallback(
    async (adminData: CreateAdminRequest) => {
      try {
        const response = await superAdminService.createAdmin(adminData);

        if (response?.success) {
          toast({
            title: 'Admin Created',
            description: 'New admin account created successfully',
          });

          setCreateAdminDialog(false);
          loadAdmins();
        }
      } catch (error: any) {
        toast({
          title: 'Error',
          description: error.message || 'Failed to create admin',
          variant: 'destructive',
        });
      }
    },
    [loadAdmins]
  );

  // Emergency lockdown
  const handleEmergencyLockdown = useCallback(async (data: EmergencyLockdownRequest) => {
    try {
      const response = await superAdminService.emergencyLockdown(data);

      if (response?.success) {
        toast({
          title: 'Emergency Lockdown Activated',
          description: 'System has been locked down for security',
          variant: 'destructive',
        });

        setEmergencyDialog(false);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to activate lockdown',
        variant: 'destructive',
      });
    }
  }, []);

  // Initialize dashboard
  useEffect(() => {
    if (canAccessSuperAdmin()) {
      loadDashboardData();
      loadSystemConfig();
      loadAuditLogs();
      loadAnalytics();
      loadSecurityData();
    }
  }, []);

  // Load users/admins when filters change
  useEffect(() => {
    if (activeTab === 'users') {
      loadUsers();
    } else if (activeTab === 'admins') {
      loadAdmins();
    }
  }, [activeTab]);

  // Access control
  if (!canAccessSuperAdmin()) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-center flex items-center gap-2">
                <Shield className="h-6 w-6" />
                Super Admin Access Required
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground">
                You don't have permission to access the super admin dashboard.
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

      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-2">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Crown className="h-8 w-8 text-yellow-500" />
                Super Admin Dashboard
              </h1>
              <p className="text-muted-foreground">System-wide control and monitoring</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={loadDashboardData}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Dialog open={emergencyDialog} onOpenChange={setEmergencyDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Lock className="h-4 w-4 mr-2" />
                    Emergency Lockdown
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Emergency System Lockdown</DialogTitle>
                    <DialogDescription>
                      This will immediately lock down the entire system. Use only in emergency
                      situations.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="reason">Reason</Label>
                      <Input id="reason" placeholder="Security breach detected..." />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1h">1 Hour</SelectItem>
                          <SelectItem value="6h">6 Hours</SelectItem>
                          <SelectItem value="24h">24 Hours</SelectItem>
                          <SelectItem value="indefinite">Indefinite</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="password">Confirm Password</Label>
                      <Input id="password" type="password" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setEmergencyDialog(false)}>
                      Cancel
                    </Button>
                    <Button variant="destructive">Activate Lockdown</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardState.stats?.totalUsers?.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-muted-foreground">
                  +{dashboardState.stats?.userGrowth || 0}% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dashboardState.stats?.activeUsers?.toLocaleString() || '0'}
                </div>
                <p className="text-xs text-muted-foreground">Currently online</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
                <Crown className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardState.admins.length}</div>
                <p className="text-xs text-muted-foreground">System administrators</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Healthy</div>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Security Status</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Secure</div>
                <p className="text-xs text-muted-foreground">No threats detected</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="admins">Admins</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="audit">Audit Logs</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>User Management</CardTitle>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Users
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* User Filters */}
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
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Last Active</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.isArray(dashboardState.users) ? (
                          dashboardState.users.map(user => (
                            <TableRow key={user._id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={user.avatar} />
                                    <AvatarFallback>
                                      {user.firstName?.[0]}
                                      {user.lastName?.[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">
                                      {user.firstName} {user.lastName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      @{user.username}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Badge variant="secondary">{user.role}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={user.isActive ? 'default' : 'destructive'}>
                                  {user.isActive ? 'Active' : 'Suspended'}
                                </Badge>
                              </TableCell>
                              <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                              <TableCell>
                                {user.lastLoginAt
                                  ? new Date(user.lastLoginAt).toLocaleDateString()
                                  : 'Never'}
                              </TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleRoleChange(user._id, 'admin', 'Promoted by super admin')
                                    }
                                  >
                                    <Crown className="h-4 w-4" />
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
                            <TableCell colSpan={7} className="text-center text-muted-foreground">
                              No users available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Admins Tab */}
            <TabsContent value="admins" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Admin Management</CardTitle>
                    <div className="flex gap-2">
                      <Dialog open={createAdminDialog} onOpenChange={setCreateAdminDialog}>
                        <DialogTrigger asChild>
                          <Button size="sm">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Create Admin
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create New Admin</DialogTitle>
                            <DialogDescription>
                              Create a new administrator account with specified permissions.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="username">Username</Label>
                              <Input id="username" placeholder="admin_username" />
                            </div>
                            <div>
                              <Label htmlFor="email">Email</Label>
                              <Input id="email" type="email" placeholder="admin@example.com" />
                            </div>
                            <div>
                              <Label htmlFor="password">Password</Label>
                              <Input id="password" type="password" />
                            </div>
                            <div>
                              <Label htmlFor="role">Role</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="admin">Admin</SelectItem>
                                  <SelectItem value="super_admin">Super Admin</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setCreateAdminDialog(false)}>
                              Cancel
                            </Button>
                            <Button>Create Admin</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Export Admins
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Admin Filters */}
                  <div className="flex flex-wrap gap-4 mb-4">
                    <div className="flex-1 min-w-64">
                      <Input
                        placeholder="Search admins..."
                        value={adminFilters.search}
                        onChange={e =>
                          setAdminFilters(prev => ({ ...prev, search: e.target.value }))
                        }
                      />
                    </div>
                  </div>

                  {/* Admins Table */}
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Admin</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Role</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Last Login</TableHead>
                          <TableHead>Login Count</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.isArray(dashboardState.admins) ? (
                          dashboardState.admins.map(admin => (
                            <TableRow key={admin._id}>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={admin.avatar} />
                                    <AvatarFallback>
                                      {admin.firstName?.[0]}
                                      {admin.lastName?.[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">
                                      {admin.firstName} {admin.lastName}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      @{admin.username}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>{admin.email}</TableCell>
                              <TableCell>
                                <Badge
                                  variant={admin.role === 'super_admin' ? 'default' : 'secondary'}
                                >
                                  {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={admin.isActive ? 'default' : 'destructive'}>
                                  {admin.isActive ? 'Active' : 'Suspended'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {new Date(admin.createdAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {admin.lastLoginAt
                                  ? new Date(admin.lastLoginAt).toLocaleDateString()
                                  : 'Never'}
                              </TableCell>
                              <TableCell>{admin.loginCount || 0}</TableCell>
                              <TableCell>
                                <div className="flex gap-2">
                                  {admin.role !== 'super_admin' && (
                                    <>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          handleAdminAction(
                                            admin._id,
                                            admin.isActive ? 'suspend' : 'activate'
                                          )
                                        }
                                      >
                                        {admin.isActive ? (
                                          <Ban className="h-4 w-4" />
                                        ) : (
                                          <CheckCircle className="h-4 w-4" />
                                        )}
                                      </Button>
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                          handleAdminAction(
                                            admin._id,
                                            'delete',
                                            'Removed by super admin'
                                          )
                                        }
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </>
                                  )}
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      window.open(`/admin/users/${admin._id}`, '_blank')
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
                            <TableCell colSpan={8} className="text-center text-muted-foreground">
                              No admins available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Audit Logs Tab */}
            <TabsContent value="audit" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Audit Logs</CardTitle>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Export Logs
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Timestamp</TableHead>
                          <TableHead>Admin</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Target</TableHead>
                          <TableHead>Criticality</TableHead>
                          <TableHead>Details</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {Array.isArray(dashboardState.auditLogs) ? (
                          dashboardState.auditLogs.map(log => (
                            <TableRow key={log._id}>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                  {new Date(log.timestamp).toLocaleString()}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Avatar className="h-6 w-6">
                                    <AvatarImage src={log.admin.avatar} />
                                    <AvatarFallback>
                                      {log.admin.firstName?.[0]}
                                      {log.admin.lastName?.[0]}
                                    </AvatarFallback>
                                  </Avatar>
                                  {log.admin.username}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{log.action}</Badge>
                              </TableCell>
                              <TableCell>
                                {log.targetType}: {log.targetId}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    log.criticality === 'CRITICAL'
                                      ? 'destructive'
                                      : log.criticality === 'HIGH'
                                        ? 'destructive'
                                        : log.criticality === 'MEDIUM'
                                          ? 'default'
                                          : 'secondary'
                                  }
                                >
                                  {log.criticality}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm">
                                  <FileText className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-muted-foreground">
                              No audit logs available
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab - Admin Panel Functionality */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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

                <Card>
                  <CardHeader>
                    <CardTitle>Content Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Total Posts</span>
                        <span className="font-semibold">
                          {dashboardState.stats?.totalPosts || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Total Comments</span>
                        <span className="font-semibold">
                          {dashboardState.stats?.totalComments || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Total Likes</span>
                        <span className="font-semibold">
                          {dashboardState.stats?.totalLikes || 0}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Engagement Rate</span>
                        <span className="font-semibold">
                          {dashboardState.stats?.engagementRate || 0}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Security Tab - Admin Panel Functionality */}
            <TabsContent value="security" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5" />
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
                              <div className="h-4 w-24 bg-muted animate-pulse rounded mb-2" />
                              <div className="h-3 w-16 bg-muted animate-pulse rounded" />
                            </div>
                            <div className="h-6 w-12 bg-muted animate-pulse rounded" />
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

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5" />
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
                              <div className="h-4 w-32 bg-muted animate-pulse rounded mb-2" />
                              <div className="h-3 w-24 bg-muted animate-pulse rounded" />
                            </div>
                            <div className="h-6 w-16 bg-muted animate-pulse rounded" />
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

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="h-5 w-5" />
                      Security Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Multiple login attempts</p>
                          <p className="text-sm text-muted-foreground">2 minutes ago</p>
                        </div>
                        <Badge variant="destructive">High</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Suspicious IP detected</p>
                          <p className="text-sm text-muted-foreground">15 minutes ago</p>
                        </div>
                        <Badge variant="default">Medium</Badge>
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">Password reset request</p>
                          <p className="text-sm text-muted-foreground">1 hour ago</p>
                        </div>
                        <Badge variant="secondary">Low</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* System Tab */}
            <TabsContent value="system" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="h-5 w-5" />
                      System Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>Database</span>
                        <Badge variant="default">Connected</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Redis Cache</span>
                        <Badge variant="default">Connected</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>File Storage</span>
                        <Badge variant="default">Healthy</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Email Service</span>
                        <Badge variant="default">Operational</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5" />
                      System Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span>CPU Usage</span>
                        <span>45%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Memory Usage</span>
                        <span>62%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Disk Usage</span>
                        <span>78%</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Network I/O</span>
                        <span>Normal</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default SuperAdminDashboard;
