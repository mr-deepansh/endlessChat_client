import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { FileText, Scale, Users, Shield, AlertTriangle, Mail } from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <Navbar />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Scale className="w-4 h-4" />
            Terms of Service
          </div>

          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-4">
            Terms & Conditions
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Please read these terms carefully before using EndlessChat. By accessing our platform,
            you agree to be bound by these terms and conditions.
          </p>

          <div className="flex items-center justify-center gap-4 mt-6">
            <Badge variant="secondary" className="px-4 py-2">
              <FileText className="w-4 h-4 mr-2" />
              Legal Agreement
            </Badge>
            <Badge variant="secondary" className="px-4 py-2">
              <Shield className="w-4 h-4 mr-2" />
              User Protection
            </Badge>
          </div>
        </div>

        <div className="space-y-8">
          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-500" />
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                By creating an account or using EndlessChat services, you acknowledge that you have
                read, understood, and agree to be bound by these Terms of Service and our Privacy
                Policy. If you do not agree to these terms, please do not use our platform.
              </p>
              <div>
                <h4 className="font-semibold mb-2">Eligibility Requirements</h4>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li>• Must be at least 13 years of age (or legal age in your jurisdiction)</li>
                  <li>• Provide accurate and complete registration information</li>
                  <li>• Maintain the security of your account credentials</li>
                  <li>• Comply with all applicable laws and regulations</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-500" />
                Platform Usage Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2 text-green-600">Permitted Uses</h4>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li>• Share original content and engage in meaningful discussions</li>
                  <li>• Connect with other users in a respectful manner</li>
                  <li>• Use our messaging and social features as intended</li>
                  <li>• Report violations of community guidelines</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2 text-red-600">Prohibited Activities</h4>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li>• Harassment, bullying, or threatening behavior</li>
                  <li>• Sharing illegal, harmful, or inappropriate content</li>
                  <li>• Impersonating others or creating fake accounts</li>
                  <li>• Spamming, phishing, or malicious activities</li>
                  <li>• Attempting to hack or compromise platform security</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-purple-500" />
                Intellectual Property Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Your Content</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  You retain ownership of content you create and share on EndlessChat. By posting
                  content, you grant us a non-exclusive, worldwide license to use, display, and
                  distribute your content on our platform.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Platform Content</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  EndlessChat's software, design, logos, and proprietary features are protected by
                  intellectual property laws. Users may not copy, modify, or distribute our platform
                  without explicit permission.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Copyright Protection</h4>
                <p className="text-slate-600 dark:text-slate-400">
                  We respect intellectual property rights and respond to valid DMCA takedown
                  notices. Users must not share copyrighted material without proper authorization.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-500" />
                Account Security & Responsibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">User Responsibilities</h4>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-sm">
                    <li>• Maintain strong, unique passwords</li>
                    <li>• Enable two-factor authentication</li>
                    <li>• Monitor account activity regularly</li>
                    <li>• Report suspicious activities immediately</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Platform Security</h4>
                  <ul className="space-y-1 text-slate-600 dark:text-slate-400 text-sm">
                    <li>• Enterprise-grade encryption</li>
                    <li>• Regular security audits</li>
                    <li>• Incident response procedures</li>
                    <li>• Compliance with security standards</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-slate-600 dark:text-slate-400">
                EndlessChat is provided "as is" without warranties of any kind. We strive to
                maintain reliable service but cannot guarantee uninterrupted access or error-free
                operation.
              </p>
              <div>
                <h4 className="font-semibold mb-2">Service Availability</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  While we maintain high uptime standards, we reserve the right to modify, suspend,
                  or discontinue services for maintenance, updates, or other operational reasons
                  with appropriate notice.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">User-Generated Content</h4>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  We are not responsible for user-generated content and do not endorse opinions
                  expressed by users. We reserve the right to remove content that violates our
                  community guidelines.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-500" />
                Contact & Legal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Questions about these terms? Our legal team is available to provide clarification
                and assistance.
              </p>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>Legal Department:</strong>{' '}
                  <a
                    href="mailto:legal@endlesschat.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    legal@endlesschat.com
                  </a>
                </p>
                <p>
                  <strong>Business Address:</strong> EndlessChat Inc., 123 Tech Street, San
                  Francisco, CA 94105
                </p>
                <p>
                  <strong>Governing Law:</strong> These terms are governed by the laws of
                  California, United States
                </p>
                <p>
                  <strong>Dispute Resolution:</strong> Binding arbitration in San Francisco, CA
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-12 text-sm text-slate-500 dark:text-slate-400">
          <p>Last updated: January 15, 2024 | Effective Date: January 15, 2024</p>
          <p className="mt-2">
            These terms may be updated periodically. Continued use constitutes acceptance of revised
            terms.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Terms;
