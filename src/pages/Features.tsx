import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import Navbar from '../components/layout/Navbar';
import { usePageTitle } from '../hooks/usePageTitle';
import {
  Users,
  MessageCircle,
  Heart,
  Shield,
  Search,
  Bell,
  Camera,
  MapPin,
  Calendar,
  BarChart3,
  Settings,
  Lock,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
} from 'lucide-react';

const Features = () => {
  usePageTitle('Features');
  const [activeTab, setActiveTab] = useState('core');

  const coreFeatures = [
    {
      icon: Users,
      title: 'Social Networking',
      description: 'Follow users, build your network, and discover new voices in your community.',
      features: [
        'Follow/Unfollow users',
        'Discover new people',
        'View profiles',
        'Social connections',
      ],
    },
    {
      icon: MessageCircle,
      title: 'Rich Posting',
      description: 'Share your thoughts with text, images, polls, and scheduled posts.',
      features: ['Text & media posts', 'Polls & surveys', 'Post scheduling', 'Article creation'],
    },
    {
      icon: Heart,
      title: 'Engagement',
      description: 'Like, comment, repost, and share content that resonates with you.',
      features: ['Like & comment', 'Repost with quotes', 'Share posts', 'Bookmark content'],
    },
    {
      icon: Bell,
      title: 'Real-time Notifications',
      description: 'Stay updated with instant notifications for all your social interactions.',
      features: [
        'Follow notifications',
        'Like & comment alerts',
        'Mention notifications',
        'Real-time updates',
      ],
    },
  ];

  const advancedFeatures = [
    {
      icon: Search,
      title: 'Smart Search',
      description: 'Find users, posts, and content with our intelligent search system.',
    },
    {
      icon: Camera,
      title: 'Media Upload',
      description: 'Share photos and videos with drag-and-drop media uploading.',
    },
    {
      icon: MapPin,
      title: 'Location Tagging',
      description: 'Add location context to your posts and discover local content.',
    },
    {
      icon: Calendar,
      title: 'Post Scheduling',
      description: 'Schedule your posts for optimal engagement times.',
    },
    {
      icon: BarChart3,
      title: 'Analytics',
      description: 'Track your post performance and engagement metrics.',
    },
    {
      icon: Shield,
      title: 'Content Moderation',
      description: 'Advanced moderation tools ensure a safe and positive environment.',
    },
    {
      icon: Settings,
      title: 'Customization',
      description: 'Personalize your experience with themes and privacy settings.',
    },
    {
      icon: Lock,
      title: 'Privacy Controls',
      description: 'Full control over your data and who can see your content.',
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10 overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative max-w-6xl lg:max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Star className="w-4 h-4" />
              <span>Enterprise-Grade Features</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 lg:mb-8 gradient-text">
              Powerful Features
            </h1>
            <p className="text-xl lg:text-2xl xl:text-3xl text-muted-foreground max-w-3xl lg:max-w-5xl mx-auto mb-8 lg:mb-12">
              Everything you need for meaningful social interactions, built with modern technology
              and user experience in mind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                variant="gradient"
                size="lg"
                className="lg:text-lg xl:text-xl lg:px-8 xl:px-12 lg:py-4 xl:py-6"
                asChild
              >
                <Link to="/register">
                  <span>Try All Features</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="lg:text-lg xl:text-xl lg:px-8 xl:px-12 lg:py-4 xl:py-6"
              >
                <Play className="w-5 h-5 mr-2" />
                <span>Watch Demo</span>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mt-16 lg:mt-24">
            {[
              { number: '50+', label: 'Features' },
              { number: '99.9%', label: 'Uptime' },
              { number: '10k+', label: 'Users' },
              { number: '24/7', label: 'Support' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-2xl lg:text-3xl xl:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-sm lg:text-base text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Tabs */}
      <section className="py-16 lg:py-24 xl:py-32 bg-background">
        <div className="max-w-7xl xl:max-w-[1600px] mx-auto px-4 lg:px-8 xl:px-12">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 lg:mb-6">
              Explore Our Features
            </h2>
            <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover what makes EndlessChatt the perfect platform for your social needs
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex justify-center mb-12 lg:mb-16">
            <div className="inline-flex p-1 bg-muted rounded-lg">
              <button
                onClick={() => setActiveTab('core')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'core'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Core Features
              </button>
              <button
                onClick={() => setActiveTab('advanced')}
                className={`px-6 py-3 rounded-md font-medium transition-all ${
                  activeTab === 'advanced'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Advanced Tools
              </button>
            </div>
          </div>

          {/* Core Features */}
          {activeTab === 'core' && (
            <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-8 lg:gap-12">
              {coreFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="group p-8 lg:p-10 xl:p-12 rounded-2xl bg-gradient-card shadow-soft hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 border border-border/30 hover:border-primary/30"
                >
                  <div className="flex items-start gap-6">
                    <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl lg:text-2xl xl:text-3xl font-semibold mb-3 lg:mb-4">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground mb-6 lg:text-lg xl:text-xl">
                        {feature.description}
                      </p>
                      <ul className="space-y-3">
                        {feature.features.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-center text-sm lg:text-base xl:text-lg text-muted-foreground"
                          >
                            <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-primary mr-3 flex-shrink-0" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Advanced Features */}
          {activeTab === 'advanced' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-6 lg:gap-8">
              {advancedFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="group p-6 lg:p-8 rounded-xl bg-gradient-card shadow-soft hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2 border border-border/50 hover:border-primary/50"
                >
                  <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 lg:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2 lg:mb-3 lg:text-lg xl:text-xl group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm lg:text-base text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Why Choose EndlessChatt?</h2>
            <p className="text-lg text-muted-foreground">See how we compare to other platforms</p>
          </div>

          <div className="bg-background rounded-2xl p-8 lg:p-12 shadow-soft">
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">❌</span>
                </div>
                <h3 className="font-semibold mb-2 text-red-600">Other Platforms</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>Limited customization</li>
                  <li>Basic analytics</li>
                  <li>No real-time features</li>
                  <li>Poor mobile experience</li>
                </ul>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold mb-2 text-primary">EndlessChatt</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>Full customization control</li>
                  <li>Advanced analytics dashboard</li>
                  <li>Real-time everything</li>
                  <li>Mobile-first design</li>
                </ul>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚠️</span>
                </div>
                <h3 className="font-semibold mb-2 text-yellow-600">Legacy Solutions</h3>
                <ul className="text-sm text-muted-foreground space-y-2">
                  <li>Outdated technology</li>
                  <li>Security vulnerabilities</li>
                  <li>Slow performance</li>
                  <li>No modern features</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Excellence */}
      <section className="py-16 lg:py-24 bg-background">
        <div className="max-w-6xl lg:max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold mb-6 lg:mb-8">
              Platform Excellence
            </h2>
            <p className="text-lg lg:text-xl xl:text-2xl text-muted-foreground max-w-3xl mx-auto">
              Built with industry-leading practices for optimal performance and user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 xl:gap-12 2xl:gap-16">
            {[
              {
                label: 'Enterprise Security',
                icon: '🔒',
                description: 'Bank-level encryption and security protocols',
                metric: '99.99%',
              },
              {
                label: 'Lightning Fast',
                icon: '⚡',
                description: 'Optimized for speed and performance',
                metric: '<100ms',
              },
              {
                label: 'Always Reliable',
                icon: '🛡️',
                description: 'Guaranteed uptime and data protection',
                metric: '99.9%',
              },
              {
                label: 'Modern Stack',
                icon: '🚀',
                description: 'Built with latest technologies',
                metric: '2024',
              },
            ].map((item, index) => (
              <div
                key={index}
                className="group p-6 lg:p-8 xl:p-10 2xl:p-12 rounded-xl lg:rounded-2xl bg-gradient-card shadow-soft hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 text-center border border-border/30 hover:border-primary/30"
              >
                <div className="text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl mb-4 lg:mb-6 xl:mb-8 group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <div className="text-2xl lg:text-3xl xl:text-4xl 2xl:text-5xl font-bold text-primary mb-2 lg:mb-3 xl:mb-4">
                  {item.metric}
                </div>
                <div className="font-semibold mb-2 lg:mb-3 xl:mb-4 lg:text-lg xl:text-xl 2xl:text-2xl">
                  {item.label}
                </div>
                <div className="text-sm lg:text-base xl:text-lg 2xl:text-xl text-muted-foreground leading-relaxed">
                  {item.description}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 lg:py-24 xl:py-32 bg-gradient-primary text-white overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-10" />
        <div className="relative max-w-6xl lg:max-w-7xl mx-auto px-4 lg:px-8 xl:px-12 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-6 lg:mb-8">
              Ready to Experience All Features?
            </h2>
            <p className="text-xl lg:text-2xl xl:text-3xl mb-8 lg:mb-12 xl:mb-16 text-white/90">
              Join thousands of users who are already enjoying the full EndlessChatt experience.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 xl:gap-8 justify-center mb-12">
              <Button
                variant="hero"
                size="lg"
                className="bg-white text-primary hover:bg-white/90 lg:text-lg xl:text-xl lg:px-8 xl:px-12 lg:py-4 xl:py-6"
                asChild
              >
                <Link to="/register">
                  <span>Get Started Free</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button
                variant="hero"
                size="lg"
                className="bg-white/20 text-white border-white/30 hover:bg-white/30 lg:text-lg xl:text-xl lg:px-8 xl:px-12 lg:py-4 xl:py-6"
                asChild
              >
                <Link to="/login">Sign In</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap justify-center items-center gap-8 text-white/70">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Free Forever Plan</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Setup in 2 Minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Features;
