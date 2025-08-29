import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Shield, Lock, Eye, Database, Globe, Mail } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Privacy: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Shield className="w-4 h-4" />
            Privacy Policy
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-4">
            Your Privacy Matters
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            We are committed to protecting your privacy and ensuring transparency in how we collect,
            use, and safeguard your personal information.
          </p>

          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge variant="secondary" className="px-4 py-2">
              <Lock className="w-4 h-4 mr-2" />
              GDPR Compliant
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              SOC 2 Certified
            </Badge>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-500" />
                Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Account Information</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Name, email address, username, and profile information you provide when creating
                  an account.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Content Data</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Posts, comments, messages, and other content you create or share on our platform.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Usage Analytics</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Device information, IP address, browser type, and usage patterns to improve our
                  services.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-green-500" />
                How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span className="text-slate-600 dark:text-slate-400">
                    Provide and maintain our social media platform services
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span className="text-slate-600 dark:text-slate-400">
                    Personalize your experience and improve our algorithms
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span className="text-slate-600 dark:text-slate-400">
                    Send important notifications and security updates
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span className="text-slate-600 dark:text-slate-400">
                    Ensure platform security and prevent fraudulent activities
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-purple-500" />
                Data Protection & Security
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Encryption</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  All data is encrypted in transit using TLS 1.3 and at rest using AES-256
                  encryption.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Access Controls</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  Strict access controls ensure only authorized personnel can access your data when
                  necessary.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Regular Audits</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  We conduct regular security audits and penetration testing to maintain the highest
                  security standards.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-orange-500" />
                Your Rights & Choices
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Access & Portability</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Request a copy of your personal data in a portable format.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Correction & Updates</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Update or correct your personal information at any time.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Deletion</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Request deletion of your account and associated data.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Opt-out</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    Control marketing communications and data processing preferences.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500" />
                Contact Our Privacy Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Have questions about our privacy practices? Our dedicated privacy team is here to
                help.
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Email:</strong> privacy@endlesschat.com
                </p>
                <p>
                  <strong>Address:</strong> EndlessChat Privacy Office, 123 Tech Street, San
                  Francisco, CA 94105
                </p>
                <p>
                  <strong>Response Time:</strong> We respond to all privacy inquiries within 72
                  hours
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 text-sm text-slate-500 dark:text-slate-400">
          <p>Last updated: January 15, 2024 | Effective Date: January 15, 2024</p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Privacy;
