import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { usePageTitle } from '../hooks/usePageTitle';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { toast } from '../hooks/use-toast';
import {
  MessageCircle,
  Users,
  Zap,
  Shield,
  Bell,
  Video,
  FileText,
  Globe,
  Clock,
  Mail,
  CheckCircle,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import LeftSidebar from '../components/layout/LeftSidebar';
import Footer from '../components/layout/Footer';

const Messages: React.FC = () => {
  usePageTitle('Messages');
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleNotifyMe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: 'Email Required',
        description: 'Please enter your email address to get notified.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setLoading(false);
      toast({
        title: 'Successfully Subscribed!',
        description: "You'll be notified when messaging is available.",
      });
    }, 1000);
  };

  const features = [
    {
      icon: MessageCircle,
      title: 'Real-time Messaging',
      description: 'Instant messaging with read receipts and typing indicators',
    },
    {
      icon: Users,
      title: 'Group Conversations',
      description: 'Create and manage group chats with up to 500 members',
    },
    {
      icon: Video,
      title: 'Video & Voice Calls',
      description: 'High-quality video calls and voice messages',
    },
    {
      icon: FileText,
      title: 'File Sharing',
      description: 'Share documents, images, and media files securely',
    },
    {
      icon: Shield,
      title: 'End-to-End Encryption',
      description: 'Enterprise-grade security for all your conversations',
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Customizable notifications and priority messaging',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar />
      <LeftSidebar />
      <div className="ml-60 transition-all duration-300">
        <div className="container mx-auto px-3 sm:px-4 pt-16 sm:pt-20 py-8 sm:py-12">
          {/* Hero Section */}
          <div className="text-center mb-8 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
              Coming Soon
            </div>

            <h1 className="text-2xl sm:text-5xl md:text-6xl font-black mb-4 sm:mb-6">
              <span className="bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                Enterprise Messaging
              </span>
            </h1>

            <p className="text-sm sm:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto mb-6 sm:mb-8 px-2">
              Experience the future of business communication with our advanced messaging platform.
              Built for teams that demand security, reliability, and seamless collaboration.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 mb-6 sm:mb-8">
              <Badge variant="secondary" className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                <Globe className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Global Infrastructure
              </Badge>
              <Badge variant="secondary" className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                SOC 2 Compliant
              </Badge>
              <Badge variant="secondary" className="px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm">
                <Zap className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                99.9% Uptime
              </Badge>
            </div>
          </div>

          {/* Notification Signup */}
          <Card className="max-w-sm sm:max-w-md mx-auto mb-8 sm:mb-16 shadow-lg border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="text-center p-4 sm:p-6">
              <CardTitle className="flex items-center justify-center gap-2 text-lg sm:text-xl">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                Get Early Access
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              {!isSubscribed ? (
                <form onSubmit={handleNotifyMe} className="space-y-3 sm:space-y-4">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="text-center h-10 sm:h-11 text-sm"
                  />
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 h-10 sm:h-11 text-sm"
                    disabled={loading}
                  >
                    {loading ? 'Subscribing...' : 'Notify Me When Ready'}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-3">
                  <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 text-green-500 mx-auto" />
                  <p className="text-green-600 dark:text-green-400 font-medium text-sm sm:text-base">
                    You're on the list! We'll notify you when messaging launches.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Features Grid */}
          <div className="mb-8 sm:mb-16">
            <h2 className="text-xl sm:text-3xl font-bold text-center mb-6 sm:mb-12 text-slate-900 dark:text-white">
              Powerful Features Coming Your Way
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-300 border-0 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-slate-800/80"
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="p-2 sm:p-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white group-hover:scale-110 transition-transform duration-300">
                        <feature.icon className="w-4 h-4 sm:w-6 sm:h-6" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-1 sm:mb-2 text-sm sm:text-base">
                          {feature.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Timeline */}
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 border-0">
            <CardHeader className="text-center p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-2xl">Development Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm sm:text-base">
                      Phase 1: Core Infrastructure
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      Real-time messaging foundation - Completed
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm sm:text-base">
                      Phase 2: Advanced Features
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      Group chats, file sharing - In Progress
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm sm:text-base">
                      Phase 3: Enterprise Security
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      End-to-end encryption, compliance - Q2 2024
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-slate-300 dark:bg-slate-600 rounded-full"></div>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white text-sm sm:text-base">
                      Phase 4: Launch
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                      Public release with full features - Q3 2024
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer CTA */}
          <div className="text-center mt-8 sm:mt-16">
            <p className="text-slate-600 dark:text-slate-400 mb-3 sm:mb-4 text-sm sm:text-base">
              Questions about our messaging platform?
            </p>
            <Button
              variant="outline"
              className="hover:bg-slate-100 dark:hover:bg-slate-800 h-9 sm:h-10 text-sm"
            >
              Contact Our Team
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Messages;
