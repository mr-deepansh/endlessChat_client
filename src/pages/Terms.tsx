import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { usePageTitle } from '../hooks/usePageTitle';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import {
  FileText,
  Scale,
  Users,
  Shield,
  AlertTriangle,
  Mail,
  CheckCircle,
  Star,
  Download,
  ExternalLink,
  Lock,
  Eye,
  Globe,
  X,
  BookOpen,
  Gavel,
  HelpCircle,
} from 'lucide-react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';

const Terms: React.FC = () => {
  usePageTitle('Terms & Conditions');
  const legalResources = [
    {
      title: 'Privacy Policy',
      description: 'How we collect, use, and protect your personal information',
      icon: Shield,
      link: '/privacy',
      type: 'internal',
    },
    {
      title: 'Community Guidelines',
      description: 'Rules and standards for platform behavior and content',
      icon: Users,
      link: '#guidelines',
      type: 'section',
    },
    {
      title: 'DMCA Policy',
      description: 'Copyright infringement reporting and takedown procedures',
      icon: Scale,
      link: '#dmca',
      type: 'section',
    },
    {
      title: 'Cookie Policy',
      description: 'Information about cookies and tracking technologies',
      icon: Eye,
      link: '#cookies',
      type: 'section',
    },
    {
      title: 'Data Processing Agreement',
      description: 'GDPR compliance and data processing terms',
      icon: Lock,
      link: '#dpa',
      type: 'section',
    },
    {
      title: 'Legal FAQ',
      description: 'Frequently asked questions about legal matters',
      icon: HelpCircle,
      link: '#faq',
      type: 'section',
    },
  ];

  const handleDownloadTerms = () => {
    // Create a simple text version of terms for download
    const termsText = `EndlessChatt Terms of Service\n\nLast Updated: January 15, 2024\n\nBy using EndlessChatt, you agree to these terms...`;
    const blob = new Blob([termsText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'endlesschatt-terms-of-service.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleResourceClick = (resource: (typeof legalResources)[0]) => {
    // Do nothing - keep content on same page
    console.log(`Clicked on ${resource.title}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50/80 to-slate-100/80 dark:from-slate-900 dark:to-slate-800">
      <Navbar />

      <div className="container mx-auto px-4 lg:px-8 py-12 max-w-6xl lg:max-w-7xl">
        {/* Hero Section */}
        <div className="text-center mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            <span>Legal Framework</span>
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold gradient-text mb-6 lg:mb-8">
            Terms & Conditions
          </h1>

          <p className="text-xl lg:text-2xl xl:text-3xl text-muted-foreground max-w-3xl lg:max-w-5xl mx-auto mb-8 lg:mb-12">
            Please read these terms carefully before using EndlessChatt. By accessing our platform,
            you agree to be bound by these terms and conditions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 lg:gap-6 mb-8">
            <Badge className="px-4 py-2 lg:px-6 lg:py-3 bg-gradient-primary text-white border-0">
              <FileText className="w-4 h-4 mr-2" />
              Legal Agreement
            </Badge>
            <Badge className="px-4 py-2 lg:px-6 lg:py-3 bg-gradient-primary text-white border-0">
              <Shield className="w-4 h-4 mr-2" />
              User Protection
            </Badge>
            <Badge className="px-4 py-2 lg:px-6 lg:py-3 bg-gradient-primary text-white border-0">
              <Scale className="w-4 h-4 mr-2" />
              Fair Terms
            </Badge>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="gradient"
              size="lg"
              className="lg:text-lg xl:text-xl lg:px-8 xl:px-12 lg:py-4 xl:py-6"
              onClick={handleDownloadTerms}
            >
              <Download className="w-5 h-5 mr-2" />
              Download Terms
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="lg:text-lg xl:text-xl lg:px-8 xl:px-12 lg:py-4 xl:py-6"
              onClick={() => {
                const element = document.getElementById('legal-resources-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <BookOpen className="w-5 h-5 mr-2" />
              Support Resources
            </Button>
          </div>
        </div>

        <div className="space-y-8 lg:space-y-12">
          <Card className="group shadow-lg bg-gradient-card backdrop-blur-sm border border-border/50 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/20">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl xl:text-3xl">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-600 dark:text-slate-400 lg:text-lg">
                By creating an account or using EndlessChatt services, you acknowledge that you have
                read, understood, and agree to be bound by these Terms of Service and our Privacy
                Policy.
              </p>
              <div className="grid md:grid-cols-2 gap-4 lg:gap-6">
                <div className="p-4 lg:p-6 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50">
                  <h4 className="font-semibold mb-3 lg:text-lg text-blue-700 dark:text-blue-300">
                    Eligibility Requirements
                  </h4>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm lg:text-base">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Must be at least 13 years of age
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Provide accurate registration information
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Maintain account security
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Comply with applicable laws
                    </li>
                  </ul>
                </div>
                <div className="p-4 lg:p-6 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50">
                  <h4 className="font-semibold mb-3 lg:text-lg text-green-700 dark:text-green-300">
                    Agreement Benefits
                  </h4>
                  <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm lg:text-base">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Full platform access
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Legal protection
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Community guidelines
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Support services
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group shadow-lg bg-gradient-card backdrop-blur-sm border border-border/50 hover:border-green-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/20">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl xl:text-3xl">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                Platform Usage Guidelines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 lg:space-y-8">
              <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                <div className="p-6 lg:p-8 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                    <h4 className="font-semibold lg:text-lg text-green-700 dark:text-green-300">
                      Permitted Uses
                    </h4>
                  </div>
                  <ul className="space-y-3 text-slate-600 dark:text-slate-400 text-sm lg:text-base">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Share original content and engage in discussions
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Connect with users respectfully
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Use messaging and social features
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      Report guideline violations
                    </li>
                  </ul>
                </div>
                <div className="p-6 lg:p-8 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50">
                  <div className="flex items-center gap-3 mb-4">
                    <AlertTriangle className="w-6 h-6 text-red-600" />
                    <h4 className="font-semibold lg:text-lg text-red-700 dark:text-red-300">
                      Prohibited Activities
                    </h4>
                  </div>
                  <ul className="space-y-3 text-slate-600 dark:text-slate-400 text-sm lg:text-base">
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      Harassment or threatening behavior
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      Sharing illegal or harmful content
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      Impersonating others or fake accounts
                    </li>
                    <li className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                      Spamming or malicious activities
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group shadow-lg bg-gradient-card backdrop-blur-sm border border-border/50 hover:border-purple-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/20">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl xl:text-3xl">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Scale className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                Intellectual Property Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 lg:space-y-8">
              <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
                <div className="text-center p-6 lg:p-8 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200/50 dark:border-purple-800/50">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                    <Users className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-3 lg:text-lg text-purple-700 dark:text-purple-300">
                    Your Content
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base">
                    You retain ownership of your content while granting us usage rights for platform
                    operation.
                  </p>
                </div>
                <div className="text-center p-6 lg:p-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                    <Shield className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-3 lg:text-lg text-blue-700 dark:text-blue-300">
                    Platform Content
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base">
                    Our software, design, and features are protected by intellectual property laws.
                  </p>
                </div>
                <div className="text-center p-6 lg:p-8 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200/50 dark:border-green-800/50">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                    <Lock className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-3 lg:text-lg text-green-700 dark:text-green-300">
                    Copyright Protection
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base">
                    We respect IP rights and respond to valid DMCA takedown notices.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group shadow-lg bg-gradient-card backdrop-blur-sm border border-border/50 hover:border-orange-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/20">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl xl:text-3xl">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                Account Security & Responsibility
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                <div className="p-6 lg:p-8 rounded-xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200/50 dark:border-orange-800/50">
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-6 h-6 text-orange-600" />
                    <h4 className="font-semibold lg:text-lg text-orange-700 dark:text-orange-300">
                      User Responsibilities
                    </h4>
                  </div>
                  <ul className="space-y-3 text-slate-600 dark:text-slate-400 text-sm lg:text-base">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                      Maintain strong, unique passwords
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                      Enable two-factor authentication
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                      Monitor account activity regularly
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                      Report suspicious activities
                    </li>
                  </ul>
                </div>
                <div className="p-6 lg:p-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50">
                  <div className="flex items-center gap-3 mb-4">
                    <Shield className="w-6 h-6 text-blue-600" />
                    <h4 className="font-semibold lg:text-lg text-blue-700 dark:text-blue-300">
                      Platform Security
                    </h4>
                  </div>
                  <ul className="space-y-3 text-slate-600 dark:text-slate-400 text-sm lg:text-base">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Enterprise-grade encryption
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Regular security audits
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Incident response procedures
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      Security standards compliance
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group shadow-lg bg-gradient-card backdrop-blur-sm border border-border/50 hover:border-yellow-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/20">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl xl:text-3xl">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <AlertTriangle className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                Limitation of Liability
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-slate-600 dark:text-slate-400 lg:text-lg">
                EndlessChatt is provided "as is" without warranties of any kind. We strive to
                maintain reliable service but cannot guarantee uninterrupted access.
              </p>
              <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
                <div className="p-6 lg:p-8 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200/50 dark:border-yellow-800/50">
                  <div className="flex items-center gap-3 mb-4">
                    <Globe className="w-6 h-6 text-yellow-600" />
                    <h4 className="font-semibold lg:text-lg text-yellow-700 dark:text-yellow-300">
                      Service Availability
                    </h4>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base">
                    We maintain high uptime standards but reserve the right to modify services for
                    maintenance with appropriate notice.
                  </p>
                </div>
                <div className="p-6 lg:p-8 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200/50 dark:border-purple-800/50">
                  <div className="flex items-center gap-3 mb-4">
                    <Eye className="w-6 h-6 text-purple-600" />
                    <h4 className="font-semibold lg:text-lg text-purple-700 dark:text-purple-300">
                      User-Generated Content
                    </h4>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 text-sm lg:text-base">
                    We are not responsible for user content and reserve the right to remove content
                    violating guidelines.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="group shadow-lg bg-gradient-to-r from-blue-50/70 to-purple-50/70 dark:from-slate-800 dark:to-slate-700 border border-border/50 hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/20">
            <CardHeader className="pb-6">
              <CardTitle className="flex items-center gap-3 text-xl lg:text-2xl xl:text-3xl">
                <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                </div>
                Contact & Support Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-600 dark:text-slate-400 mb-6 lg:text-lg">
                Questions about these terms? Our support team is available to provide clarification
                and assistance.
              </p>
              <div className="grid md:grid-cols-2 gap-4 lg:gap-6 mb-6">
                <div className="p-4 lg:p-6 rounded-xl bg-slate-50/80 dark:bg-slate-800/50">
                  <Mail className="w-8 h-8 mb-2 text-blue-600" />
                  <p className="font-semibold mb-1">Support Department</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    support@endlesschatt.com
                  </p>
                </div>
                <div className="p-4 lg:p-6 rounded-xl bg-slate-50/80 dark:bg-slate-800/50">
                  <Globe className="w-8 h-8 mb-2 text-purple-600" />
                  <p className="font-semibold mb-1">Business Address</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">New Delhi, India</p>
                </div>
                <div className="p-4 lg:p-6 rounded-xl bg-slate-50/80 dark:bg-slate-800/50">
                  <Scale className="w-8 h-8 mb-2 text-green-600" />
                  <p className="font-semibold mb-1">Governing Law</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Delhi, India</p>
                </div>
                <div className="p-4 lg:p-6 rounded-xl bg-slate-50/80 dark:bg-slate-800/50">
                  <Shield className="w-8 h-8 mb-2 text-orange-600" />
                  <p className="font-semibold mb-1">Dispute Resolution</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Binding arbitration</p>
                </div>
              </div>
              <Button className="w-full bg-gradient-primary text-white hover:opacity-90">
                <Mail className="w-4 h-4 mr-2" />
                Contact Support Team
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Legal Resources Section */}
        <div id="legal-resources-section" className="mt-16 lg:mt-20">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6">Support Resources</h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
              Access comprehensive documentation and resources for EndlessChatt platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {legalResources.map((resource, index) => (
              <Card
                key={index}
                className="group cursor-pointer border border-border/50 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-primary/20"
                onClick={() => handleResourceClick(resource)}
              >
                <CardContent className="p-6 lg:p-8">
                  <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <resource.icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-3 lg:text-lg group-hover:text-primary transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm lg:text-base text-muted-foreground mb-4">
                    {resource.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="text-center mt-12 lg:mt-16 p-6 lg:p-8 rounded-xl bg-muted/50 border border-border/30">
          <p className="text-sm lg:text-base text-slate-500 dark:text-slate-400 mb-2">
            <strong>Last updated:</strong> January 15, 2024 | <strong>Effective Date:</strong>{' '}
            January 15, 2024
          </p>
          <p className="text-xs lg:text-sm text-slate-400 dark:text-slate-500">
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
