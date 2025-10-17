import {
  AlertTriangle,
  CheckCircle,
  Database,
  Lock,
  Mail,
  Save,
  Server,
  Settings as SettingsIcon,
  Shield,
  Zap,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from '../../hooks/use-toast';
import { usePageTitle } from '../../hooks/usePageTitle';
import adminService from '../../services/modules/admin.service';

interface AppSettings {
  application?: {
    name: string;
    version: string;
    environment: string;
    port: string | number;
    nodeVersion: string;
  };
  database?: {
    uri: string;
    poolSize: string;
    maxIdleTime: string;
  };
  redis?: {
    url: string;
    clusterMode: string;
    maxRetries: string;
  };
  security?: {
    jwtSecret: string;
    jwtExpiry: string;
    encryptionKey: string;
    maxLoginAttempts?: number;
    lockoutDuration?: number;
  };
  performance?: {
    rateLimitMax: string;
    rateLimitWindow: string;
    cacheTTL: string;
    maxFileSize: string;
  };
  monitoring?: {
    enabled: string;
    healthCheckInterval: string;
    metricsCollection: string;
    logLevel: string;
  };
}

const AdminSettings: React.FC = () => {
  usePageTitle('Admin Settings');
  const [settings, setSettings] = useState<AppSettings>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState<{ [key: string]: boolean }>({});
  const [editedSettings, setEditedSettings] = useState<AppSettings>({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAppSettings();
      if (response.success && response.data) {
        setSettings(response.data);
        setEditedSettings(response.data);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load settings',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (category: string, categorySettings: Record<string, any>) => {
    setSaving({ ...saving, [category]: true });
    try {
      const response = await adminService.updateAppSettings(category, categorySettings);
      if (response.success) {
        toast({
          title: 'Success',
          description: `${category} settings updated successfully`,
        });
        await fetchSettings();
      } else {
        throw new Error(response.message || 'Failed to update settings');
      }
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message || `Failed to update ${category} settings`,
        variant: 'destructive',
      });
    } finally {
      setSaving({ ...saving, [category]: false });
    }
  };

  const handleSettingChange = (
    category: keyof AppSettings,
    field: string,
    value: string | number
  ) => {
    setEditedSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <SettingsIcon className="w-8 h-8" />
            System Configuration
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your application settings and configurations
          </p>
        </div>

        <Tabs defaultValue="application" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 gap-2">
            <TabsTrigger value="application">Application</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="database">Database</TabsTrigger>
            <TabsTrigger value="redis">Redis</TabsTrigger>
            <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
          </TabsList>

          {/* Application Settings */}
          <TabsContent value="application">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  Application Configuration
                </CardTitle>
                <CardDescription>
                  Basic application settings and information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Application Name</Label>
                      <Input
                        value={editedSettings.application?.name || ''}
                        onChange={e =>
                          handleSettingChange('application', 'name', e.target.value)
                        }
                        placeholder="App Name"
                      />
                    </div>
                    <div>
                      <Label>Version</Label>
                      <Input
                        value={editedSettings.application?.version || ''}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div>
                      <Label>Environment</Label>
                      <Input
                        value={editedSettings.application?.environment || ''}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div>
                      <Label>Server Port</Label>
                      <Input
                        value={editedSettings.application?.port || ''}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div>
                      <Label>Node Version</Label>
                      <Input
                        value={editedSettings.application?.nodeVersion || ''}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Some fields are read-only and cannot be modified directly.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Security Configuration
                </CardTitle>
                <CardDescription>
                  Manage authentication and security settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="jwtExpiry">JWT Expiry</Label>
                      <Input
                        id="jwtExpiry"
                        value={editedSettings.security?.jwtExpiry || ''}
                        onChange={e =>
                          handleSettingChange('security', 'jwtExpiry', e.target.value)
                        }
                        placeholder="1h"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Format: 1h, 7d, 30d
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                      <Input
                        id="maxLoginAttempts"
                        type="number"
                        value={editedSettings.security?.maxLoginAttempts || ''}
                        onChange={e =>
                          handleSettingChange(
                            'security',
                            'maxLoginAttempts',
                            parseInt(e.target.value)
                          )
                        }
                        placeholder="5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lockoutDuration">Lockout Duration (seconds)</Label>
                      <Input
                        id="lockoutDuration"
                        type="number"
                        value={editedSettings.security?.lockoutDuration || ''}
                        onChange={e =>
                          handleSettingChange(
                            'security',
                            'lockoutDuration',
                            parseInt(e.target.value)
                          )
                        }
                        placeholder="900"
                      />
                    </div>
                    <div>
                      <Label>JWT Secret</Label>
                      <Input
                        value={editedSettings.security?.jwtSecret || ''}
                        disabled
                        className="bg-muted"
                        type="password"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Configured via environment
                      </p>
                    </div>
                    <div>
                      <Label>Encryption Key</Label>
                      <Input
                        value={editedSettings.security?.encryptionKey || ''}
                        disabled
                        className="bg-muted"
                        type="password"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Configured via environment
                      </p>
                    </div>
                  </div>

                  <Alert>
                    <Lock className="h-4 w-4" />
                    <AlertDescription>
                      Critical security settings require server restart to take effect.
                    </AlertDescription>
                  </Alert>

                  <Button
                    onClick={() => updateSettings('security', editedSettings.security || {})}
                    disabled={saving.security}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving.security ? 'Saving...' : 'Save Security Settings'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Performance Settings */}
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Performance Configuration
                </CardTitle>
                <CardDescription>
                  Optimize application performance and resource usage
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rateLimitMax">Rate Limit Max Requests</Label>
                      <Input
                        id="rateLimitMax"
                        value={editedSettings.performance?.rateLimitMax || ''}
                        onChange={e =>
                          handleSettingChange('performance', 'rateLimitMax', e.target.value)
                        }
                        placeholder="1000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="rateLimitWindow">Rate Limit Window (ms)</Label>
                      <Input
                        id="rateLimitWindow"
                        value={editedSettings.performance?.rateLimitWindow || ''}
                        onChange={e =>
                          handleSettingChange('performance', 'rateLimitWindow', e.target.value)
                        }
                        placeholder="3600000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cacheTTL">Cache TTL (seconds)</Label>
                      <Input
                        id="cacheTTL"
                        value={editedSettings.performance?.cacheTTL || ''}
                        onChange={e =>
                          handleSettingChange('performance', 'cacheTTL', e.target.value)
                        }
                        placeholder="3600"
                      />
                    </div>
                    <div>
                      <Label htmlFor="maxFileSize">Max File Size (bytes)</Label>
                      <Input
                        id="maxFileSize"
                        value={editedSettings.performance?.maxFileSize || ''}
                        onChange={e =>
                          handleSettingChange('performance', 'maxFileSize', e.target.value)
                        }
                        placeholder="10485760"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        10485760 bytes = 10MB
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={() =>
                      updateSettings('performance', editedSettings.performance || {})
                    }
                    disabled={saving.performance}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving.performance ? 'Saving...' : 'Save Performance Settings'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Settings */}
          <TabsContent value="database">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Database Configuration
                </CardTitle>
                <CardDescription>MongoDB connection and performance settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Connection URI</Label>
                      <Input
                        value={editedSettings.database?.uri || ''}
                        disabled
                        className="bg-muted"
                        type="password"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Configured via environment variable
                      </p>
                    </div>
                    <div>
                      <Label>Pool Size</Label>
                      <Input
                        value={editedSettings.database?.poolSize || ''}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div>
                      <Label>Max Idle Time</Label>
                      <Input
                        value={editedSettings.database?.maxIdleTime || ''}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <Alert>
                    <Database className="h-4 w-4" />
                    <AlertDescription>
                      Database settings are managed through environment variables and require
                      server restart.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Redis Settings */}
          <TabsContent value="redis">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-red-500" />
                  Redis Configuration
                </CardTitle>
                <CardDescription>Cache and session store settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Redis URL</Label>
                      <Input
                        value={editedSettings.redis?.url || ''}
                        disabled
                        className="bg-muted"
                        type="password"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Configured via environment variable
                      </p>
                    </div>
                    <div>
                      <Label>Cluster Mode</Label>
                      <Input
                        value={editedSettings.redis?.clusterMode || ''}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                    <div>
                      <Label>Max Retries</Label>
                      <Input
                        value={editedSettings.redis?.maxRetries || ''}
                        disabled
                        className="bg-muted"
                      />
                    </div>
                  </div>

                  <Alert>
                    <Server className="h-4 w-4" />
                    <AlertDescription>
                      Redis settings are managed through environment variables and require
                      server restart.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Monitoring Settings */}
          <TabsContent value="monitoring">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Monitoring Configuration
                </CardTitle>
                <CardDescription>
                  System monitoring and logging settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="monitoringEnabled">Monitoring Enabled</Label>
                      <select
                        id="monitoringEnabled"
                        value={editedSettings.monitoring?.enabled || 'true'}
                        onChange={e =>
                          handleSettingChange('monitoring', 'enabled', e.target.value)
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="healthCheckInterval">Health Check Interval (ms)</Label>
                      <Input
                        id="healthCheckInterval"
                        value={editedSettings.monitoring?.healthCheckInterval || ''}
                        onChange={e =>
                          handleSettingChange(
                            'monitoring',
                            'healthCheckInterval',
                            e.target.value
                          )
                        }
                        placeholder="30000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="metricsCollection">Metrics Collection</Label>
                      <select
                        id="metricsCollection"
                        value={editedSettings.monitoring?.metricsCollection || 'true'}
                        onChange={e =>
                          handleSettingChange('monitoring', 'metricsCollection', e.target.value)
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="logLevel">Log Level</Label>
                      <select
                        id="logLevel"
                        value={editedSettings.monitoring?.logLevel || 'info'}
                        onChange={e =>
                          handleSettingChange('monitoring', 'logLevel', e.target.value)
                        }
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        <option value="error">Error</option>
                        <option value="warn">Warning</option>
                        <option value="info">Info</option>
                        <option value="debug">Debug</option>
                      </select>
                    </div>
                  </div>

                  <Alert>
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Changes to monitoring settings take effect immediately without restart.
                    </AlertDescription>
                  </Alert>

                  <Button
                    onClick={() =>
                      updateSettings('monitoring', editedSettings.monitoring || {})
                    }
                    disabled={saving.monitoring}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving.monitoring ? 'Saving...' : 'Save Monitoring Settings'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminSettings;
