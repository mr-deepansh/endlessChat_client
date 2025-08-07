import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { AdminDashboardSkeleton } from '@/components/loaders/AdminDashboardSkeleton';
import { adminService, type AdminStats, type AdminUser } from '@/services/adminService';
import {
  Users,
  MessageSquare,
  TrendingUp,
  Shield,
  Search,
  MoreHorizontal,
  UserCheck,
  UserX,
  Trash2,
  AlertTriangle,
  Download,
  RefreshCw,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (user?.role !== 'admin') {
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      return;
    }

    loadAdminData();
  }, [user]);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      
      // Load stats and users in parallel for better performance
      const [statsData, usersData] = await Promise.all([
        adminService.getStats(),
        adminService.getAllUsers()
      ]);
      
      setStats(statsData);
      setUsers(usersData);
    } catch (error) {
      console.error('Failed to load admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await loadAdminData();
      toast({
        title: "Data Refreshed",
        description: "Admin dashboard data has been updated.",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      await adminService.activateUser(userId);
      setUsers(prev => prev.map(u => 
        u._id === userId ? { ...u, isActive: true } : u
      ));
      toast({
        title: "User Activated",
        description: "User has been successfully activated.",
      });
    } catch (error) {
      console.error('Failed to activate user:', error);
    }
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      await adminService.suspendUser(userId);
      setUsers(prev => prev.map(u => 
        u._id === userId ? { ...u, isActive: false } : u
      ));
      toast({
        title: "User Suspended",
        description: "User has been suspended.",
      });
    } catch (error) {
      console.error('Failed to suspend user:', error);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      await adminService.deleteUser(userId);
      setUsers(prev => prev.filter(u => u._id !== userId));
      toast({
        title: "User Deleted",
        description: "User has been permanently deleted.",
        variant: "destructive",
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
    }
  };

  const handleExportUsers = async () => {
    try {
      const blob = await adminService.exportUsers('csv');
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-export-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export Complete",
        description: "Users data has been exported successfully.",
      });
    } catch (error) {
      console.error('Failed to export users:', error);
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (user?.role !== 'admin') {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto py-12 px-4 text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </Layout>
    );
  }

  if (isLoading) {
    return (
      <Layout>
        <AdminDashboardSkeleton />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-4 sm:py-6 px-2 sm:px-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Admin Dashboard</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Manage users, monitor activity, and oversee platform operations
            </p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Button 
              onClick={handleRefresh} 
              variant="outline" 
              size="sm"
              disabled={isRefreshing}
              className="w-full sm:w-auto"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </Button>
            <Button 
              onClick={handleExportUsers} 
              variant="outline" 
              size="sm"
              className="w-full sm:w-auto"
            >
              <Download className="h-4 w-4 mr-2" />
              <span>Export</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards - Mobile Responsive Grid */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-6 mb-6 sm:mb-8">
            <Card className="bg-gradient-card border-none shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold text-foreground">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.newUsersToday} today
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-none shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Active Users</CardTitle>
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold text-foreground">{stats.activeUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% of total
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-none shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Total Posts</CardTitle>
                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold text-foreground">{stats.totalPosts.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.postsToday} today
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-none shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Comments</CardTitle>
                <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold text-foreground">{stats.totalComments.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +{stats.commentsToday || 0} today
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-none shadow-soft">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">Suspended</CardTitle>
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-lg sm:text-2xl font-bold text-foreground">{stats.suspendedUsers || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.suspendedUsers || 0} suspended users
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* User Management */}
        <Card className="bg-gradient-card border-none shadow-soft">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-4 sm:space-y-0">
              <div>
                <CardTitle className="text-lg sm:text-xl text-foreground">User Management</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Monitor and manage registered users
                </p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full sm:w-72 bg-background text-foreground border-border"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Mobile Cards View */}
            <div className="block md:hidden space-y-4">
              {filteredUsers.map((user) => (
                <Card key={user._id} className="bg-background border-border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar || ''} alt={user.username} />
                          <AvatarFallback className="bg-gradient-primary text-white">
                            {user.firstName?.[0] || user.username?.[0] || 'U'}
                            {user.lastName?.[0] || ''}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleActivateUser(user._id)}>
                            <UserCheck className="mr-2 h-4 w-4" />
                            Activate
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleSuspendUser(user._id)}>
                            <UserX className="mr-2 h-4 w-4" />
                            Suspend
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteUser(user._id)} className="text-red-600">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-muted-foreground">Email:</span>
                        <p className="text-foreground truncate">{user.email}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Role:</span>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="ml-1">
                          {user.role}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Status:</span>
                        <Badge variant={user.isActive ? 'default' : 'destructive'} className="ml-1">
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Joined:</span>
                        <p className="text-foreground">{new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-muted-foreground">User</TableHead>
                    <TableHead className="text-muted-foreground">Email</TableHead>
                    <TableHead className="text-muted-foreground">Role</TableHead>
                    <TableHead className="text-muted-foreground">Status</TableHead>
                    <TableHead className="text-muted-foreground">Followers</TableHead>
                    <TableHead className="text-muted-foreground">Joined</TableHead>
                    <TableHead className="text-muted-foreground">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user._id} className="hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar || ''} alt={user.username} />
                            <AvatarFallback className="bg-gradient-primary text-white">
                              {user.firstName?.[0] || user.username?.[0] || 'U'}
                              {user.lastName?.[0] || ''}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-foreground">{user.firstName} {user.lastName}</p>
                            <p className="text-sm text-muted-foreground">@{user.username}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-foreground">{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isActive ? 'default' : 'destructive'}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-foreground">{user.followersCount || 0}</TableCell>
                      <TableCell className="text-foreground">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleActivateUser(user._id)}>
                              <UserCheck className="mr-2 h-4 w-4" />
                              Activate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleSuspendUser(user._id)}>
                              <UserX className="mr-2 h-4 w-4" />
                              Suspend
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDeleteUser(user._id)} className="text-red-600">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdminDashboard;