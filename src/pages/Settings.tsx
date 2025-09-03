import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import { useAuth } from '../contexts/AuthContext';
import { usePageTitle } from '../hooks/usePageTitle';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from '../hooks/use-toast';
import { authService } from '../services/authService';
import {
  User,
  Settings as SettingsIcon,
  Lock,
  Bell,
  Shield,
  Eye,
  Camera,
  Upload,
} from 'lucide-react';

const Settings: React.FC = () => {
  usePageTitle('Settings');
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  // Profile form state
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    bio: user?.bio || '',
    location: user?.location || '',
    website: user?.website || '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState({
    profile: false,
    password: false,
    avatar: false,
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading({ ...loading, profile: true });

    try {
      const response = await authService.updateProfile(profileData);

      if (response.success) {
        updateUser(response.data);
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been updated successfully.',
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setLoading({ ...loading, profile: false });
    }
  };

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: 'File Too Large',
        description: 'Please select an image under 2MB.',
        variant: 'destructive',
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid File Type',
        description: 'Please select a valid image file.',
        variant: 'destructive',
      });
      return;
    }

    setLoading({ ...loading, avatar: true });

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = e => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Upload to server (you'll need to implement this API)
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await authService.updateAvatar(formData);

      if (response.success) {
        updateUser({ ...user, avatar: response.data.avatar });
        toast({
          title: 'Profile Picture Updated',
          description: 'Your profile picture has been updated successfully.',
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      toast({
        title: 'Upload Failed',
        description: error.message || 'Failed to update profile picture',
        variant: 'destructive',
      });
      setAvatarPreview(null);
    } finally {
      setLoading({ ...loading, avatar: false });
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: 'Password Mismatch',
        description: 'New password and confirm password do not match.',
        variant: 'destructive',
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: 'Password Too Short',
        description: 'Password must be at least 6 characters long.',
        variant: 'destructive',
      });
      return;
    }

    setLoading({ ...loading, password: true });

    try {
      const response = await authService.changePassword(passwordData);

      if (response.success) {
        toast({
          title: 'Password Changed',
          description: 'Your password has been changed successfully.',
        });
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      toast({
        title: 'Password Change Failed',
        description: error.message || 'Failed to change password',
        variant: 'destructive',
      });
    } finally {
      setLoading({ ...loading, password: false });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Settings</h1>
            <p className="text-muted-foreground">Manage your account settings and preferences</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <Avatar className="w-20 h-20">
                          <AvatarImage src={avatarPreview || user?.avatar} />
                          <AvatarFallback className="bg-gradient-primary text-white text-xl">
                            {user?.firstName?.[0]}
                            {user?.lastName?.[0]}
                          </AvatarFallback>
                        </Avatar>
                        {loading.avatar && (
                          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                          </div>
                        )}
                      </div>
                      <div>
                        <input
                          type="file"
                          id="avatar-upload"
                          accept="image/*"
                          onChange={handleAvatarChange}
                          className="hidden"
                          disabled={loading.avatar}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => document.getElementById('avatar-upload')?.click()}
                          disabled={loading.avatar}
                          className="flex items-center gap-2"
                        >
                          <Camera className="w-4 h-4" />
                          {loading.avatar ? 'Uploading...' : 'Change Photo'}
                        </Button>
                        <p className="text-sm text-muted-foreground mt-1">
                          JPG, PNG or GIF. Max size 2MB.
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={e =>
                            setProfileData({ ...profileData, firstName: e.target.value })
                          }
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={e =>
                            setProfileData({ ...profileData, lastName: e.target.value })
                          }
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={e => setProfileData({ ...profileData, bio: e.target.value })}
                        placeholder="Tell us about yourself"
                        rows={3}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profileData.location}
                          onChange={e =>
                            setProfileData({ ...profileData, location: e.target.value })
                          }
                          placeholder="Your location"
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={profileData.website}
                          onChange={e =>
                            setProfileData({ ...profileData, website: e.target.value })
                          }
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </div>

                    <Button type="submit" disabled={loading.profile}>
                      {loading.profile ? 'Updating...' : 'Update Profile'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                      <Label htmlFor="currentPassword">Current Password</Label>
                      <Input
                        id="currentPassword"
                        type="password"
                        value={passwordData.currentPassword}
                        onChange={e =>
                          setPasswordData({ ...passwordData, currentPassword: e.target.value })
                        }
                        placeholder="Enter your current password"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        value={passwordData.newPassword}
                        onChange={e =>
                          setPasswordData({ ...passwordData, newPassword: e.target.value })
                        }
                        placeholder="Enter your new password"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="confirmPassword">Confirm New Password</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={e =>
                          setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                        }
                        placeholder="Confirm your new password"
                        required
                      />
                    </div>

                    <Button type="submit" disabled={loading.password}>
                      {loading.password ? 'Changing...' : 'Change Password'}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Email Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                          Receive notifications via email
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Push Notifications</h4>
                        <p className="text-sm text-muted-foreground">Receive push notifications</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Privacy Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Profile Visibility</h4>
                        <p className="text-sm text-muted-foreground">
                          Control who can see your profile
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Manage
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Data Export</h4>
                        <p className="text-sm text-muted-foreground">Download your data</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Export
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Settings;
