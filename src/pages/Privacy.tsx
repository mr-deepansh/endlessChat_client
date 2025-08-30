import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { usePageTitle } from '../hooks/usePageTitle';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  Shield,
  Lock,
  Eye,
  Database,
  Globe,
  Mail,
  CheckCircle,
  Star,
  Download,
  Settings,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Privacy: React.FC = () => {
  usePageTitle('Privacy Policy');
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar />

      <div className="container mx-auto px-4 lg:px-8 py-12 max-w-6xl lg:max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            <span>Privacy First Platform</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold gradient-text mb-6 lg:mb-8">
            Your Privacy Matters
          </h1>

          <p className="text-xl lg:text-2xl xl:text-3xl text-muted-foreground max-w-3xl lg:max-w-5xl mx-auto mb-8 lg:mb-12">
            We are committed to protecting your privacy and ensuring transparency in how we collect,
            use, and safeguard your personal information.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6 mb-8">
            <Badge className="px-4 py-2 lg:px-6 lg:py-3 bg-gradient-primary text-white border-0">
              <Lock className="w-4 h-4 mr-2" />
              GDPR Compliant
            </Badge>
            <Badge className="px-4 py-2 lg:px-6 lg:py-3 bg-gradient-primary text-white border-0">
              <Shield className="w-4 h-4 mr-2" />
              SOC 2 Certified
            </Badge>
            <Badge className="px-4 py-2 lg:px-6 lg:py-3 bg-gradient-primary text-white border-0">
              <CheckCircle className="w-4 h-4 mr-2" />
              ISO 27001
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="gradient"
              size="lg"
              className="lg:text-lg xl:text-xl lg:px-8 xl:px-12 lg:py-4 xl:py-6"
            >
              <Download className="w-5 h-5 mr-2" />
              Download Privacy Policy
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="lg:text-lg xl:text-xl lg:px-8 xl:px-12 lg:py-4 xl:py-6"
            >
              <Settings className="w-5 h-5 mr-2" />
              Privacy Settings
            </Button>
          </div>
        </div>

        <div className="space-y-8 lg:space-y-12">
          <Card className="group shadow-lg bg-gradient-card backdrop-blur-sm border border-border/50 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/20">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl xl:text-3xl">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Database className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 lg:space-y-8">
              <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                <div className="p-4 lg:p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50">
                  <h4 className="font-semibold mb-3 lg:text-lg text-blue-700 dark:text-blue-300">
                    Account Information
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base">
                    Name, email address, username, and profile information you provide when creating
                    an account.
                  </p>
                </div>
                <div className="p-4 lg:p-6 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50">
                  <h4 className="font-semibold mb-3 lg:text-lg text-green-700 dark:text-green-300">
                    Content Data
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base">
                    Posts, comments, messages, and other content you create or share on our
                    platform.
                  </p>
                </div>
                <div className="p-4 lg:p-6 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200/50 dark:border-purple-800/50">
                  <h4 className="font-semibold mb-3 lg:text-lg text-purple-700 dark:text-purple-300">
                    Usage Analytics
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base">
                    Device information, IP address, browser type, and usage patterns to improve our
                    services.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group shadow-lg bg-gradient-card backdrop-blur-sm border border-border/50 hover:border-green-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/20">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl xl:text-3xl">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Eye className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-slate-600 dark:text-slate-400 lg:text-lg">
                    Provide and maintain our social media platform services
                  </span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-slate-600 dark:text-slate-400 lg:text-lg">
                    Personalize your experience and improve our algorithms
                  </span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-slate-600 dark:text-slate-400 lg:text-lg">
                    Send important notifications and security updates
                  </span>
                </div>
                <div className="flex items-start gap-4">
                  <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-slate-600 dark:text-slate-400 lg:text-lg">
                    Ensure platform security and prevent fraudulent activities
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group shadow-lg bg-gradient-card backdrop-blur-sm border border-border/50 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/20">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl xl:text-3xl">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Lock className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                Data Protection & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 lg:space-y-8">
              <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                <div className="text-center p-6 lg:p-8 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200/50 dark:border-purple-800/50">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                    <Shield className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-3 lg:text-lg text-purple-700 dark:text-purple-300">
                    Encryption
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base">
                    TLS 1.3 in transit, AES-256 at rest encryption for all data.
                  </p>
                </div>
                <div className="text-center p-6 lg:p-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <Lock className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-3 lg:text-lg text-blue-700 dark:text-blue-300">
                    Access Controls
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base">
                    Strict access controls for authorized personnel only.
                  </p>
                </div>
                <div className="text-center p-6 lg:p-8 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-3 lg:text-lg text-green-700 dark:text-green-300">
                    Regular Audits
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base">
                    Regular security audits and penetration testing.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group shadow-lg bg-gradient-card backdrop-blur-sm border border-border/50 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/20">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl xl:text-3xl">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Globe className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                Your Rights & Choices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div className="p-4 lg:p-6 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200/50 dark:border-orange-800/50 text-center">
                  <Download className="w-8 h-8 lg:w-10 lg:h-10 mx-auto mb-3 text-orange-600" />
                  <h4 className="font-semibold mb-2 lg:text-lg text-orange-700 dark:text-orange-300">
                    Access & Portability
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Request a copy of your personal data in a portable format.
                  </p>
                </div>
                <div className="p-4 lg:p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50 text-center">
                  <Settings className="w-8 h-8 lg:w-10 lg:h-10 mx-auto mb-3 text-blue-600" />
                  <h4 className="font-semibold mb-2 lg:text-lg text-blue-700 dark:text-blue-300">
                    Correction & Updates
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Update or correct your personal information at any time.
                  </p>
                </div>
                <div className="p-4 lg:p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 text-center">
                  <Database className="w-8 h-8 lg:w-10 lg:h-10 mx-auto mb-3 text-red-600" />
                  <h4 className="font-semibold mb-2 lg:text-lg text-red-700 dark:text-red-300">
                    Deletion
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Request deletion of your account and associated data.
                  </p>
                </div>
                <div className="p-4 lg:p-6 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50 text-center">
                  <CheckCircle className="w-8 h-8 lg:w-10 lg:h-10 mx-auto mb-3 text-green-600" />
                  <h4 className="font-semibold mb-2 lg:text-lg text-green-700 dark:text-green-300">
                    Opt-out
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Control marketing communications and data processing preferences.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700 border border-border/50 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/20">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl xl:text-3xl">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                Contact Our Privacy Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 mb-6 lg:text-lg">
                Have questions about our privacy practices? Our dedicated privacy team is here to
                help.
              </p>
              <div className="grid md:grid-cols-3 gap-4 lg:gap-6 mb-6">
                <div className="text-center p-4 lg:p-6 rounded-xl bg-white/50 dark:bg-slate-800/50">
                  <Mail className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <p className="font-semibold mb-1">Email</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    privacy@endlesschatt.com
                  </p>
                </div>
                <div className="text-center p-4 lg:p-6 rounded-xl bg-white/50 dark:bg-slate-800/50">
                  <Globe className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <p className="font-semibold mb-1">Address</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">New Delhi, India</p>
                </div>
                <div className="text-center p-4 lg:p-6 rounded-xl bg-white/50 dark:bg-slate-800/50">
                  <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <p className="font-semibold mb-1">Response Time</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Within 72 hours</p>
                </div>
              </div>
              <Button className="w-full bg-gradient-primary text-white hover:opacity-90">
                <Mail className="w-4 h-4 mr-2" />
                Contact Privacy Team
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 lg:mt-16 p-6 lg:p-8 rounded-xl bg-muted/50 border border-border/30">
          <p className="text-sm lg:text-base text-slate-500 dark:text-slate-400 mb-2">
            <strong>Last updated:</strong> January 15, 2024 | <strong>Effective Date:</strong>{' '}
            January 15, 2024
          </p>
          <p className="text-xs lg:text-sm text-slate-400 dark:text-slate-500">
            This privacy policy is reviewed and updated regularly to ensure compliance with evolving
            regulations.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;
