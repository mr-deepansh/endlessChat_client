import { AlertCircle, Bell, Camera, CheckCircle, Eye, Lock, Mail, User } from 'lucide-react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftSidebar from '../../components/layout/LeftSidebar';
import Navbar from '../../components/layout/Navbar';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Textarea } from '../../components/ui/textarea';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from '../../hooks/use-toast';
import { usePageTitle } from '../../hooks/usePageTitle';
import { authService } from '../../services/authService';

const Settings: React.FC = () => {
  usePageTitle('Settings');
  const { user, refreshUser, updateProfile, changePassword } = useAuth();
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
    verification: false,
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading({ ...loading, profile: true });

    try {
      await updateProfile(profileData);
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

      // Upload to server
      const response = await authService.updateAvatar(file);

      if (response.success) {
        await refreshUser();
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
      return toast({ title: 'Passwords do not match', variant: 'destructive' });
    }

    if (passwordData.newPassword.length < 6) {
      return toast({ title: 'Password must be at least 6 characters', variant: 'destructive' });
    }

    setLoading({ ...loading, password: true });

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmNewPassword: passwordData.confirmPassword,
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error: any) {
      toast({
        title: 'Password change failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading({ ...loading, password: false });
    }
  };

  const handleResendVerification = async () => {
    setLoading({ ...loading, verification: true });

    try {
      const response = await authService.resendVerification();
      if (response.success) {
        toast({
          title: 'Verification Email Sent',
          description: 'Please check your email for the verification link.',
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      console.error('Email verification error:', error);

      if (error.message?.includes('already verified')) {
        toast({
          title: 'Email Already Verified',
          description: 'Your email address is already verified.',
        });
        await refreshUser();
        // Force page refresh to update UI
        window.location.reload();
      } else {
        toast({
          title: 'Service Unavailable',
          description: 'Email verification is temporarily unavailable. Please contact support.',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading({ ...loading, verification: false });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <LeftSidebar />
      <div className="ml-60 transition-all duration-300">
        <div className="max-w-4xl mx-auto px-4 py-6">
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
            <TabsContent value="security" className="space-y-6">
              {/* Email Verification Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Email Verification
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {user?.emailVerified || user?.isEmailVerified || user?.isVerified ? (
                    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <div>
                        <h4 className="font-medium text-green-800">Email Verified</h4>
                        <p className="text-sm text-green-600">
                          Your email address has been successfully verified
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-yellow-600" />
                        <div className="flex-1">
                          <h4 className="font-medium text-yellow-800">Verify Your Email</h4>
                          <p className="text-sm text-yellow-600">
                            Please verify your email address to secure your account and enable all
                            features
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <p className="font-medium">Send Verification Email</p>
                          <p className="text-sm text-muted-foreground">
                            We'll send a verification link to {user?.email}
                          </p>
                        </div>
                        <Button
                          onClick={handleResendVerification}
                          disabled={loading.verification}
                          variant="default"
                          size="sm"
                        >
                          {loading.verification ? 'Sending...' : 'Send Verification Email'}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Password Change Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lock className="w-5 h-5" />
                    Change Password
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
