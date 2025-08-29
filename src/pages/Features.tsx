import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/layout/Footer';
import { Button } from '../components/ui/button';
import Navbar from '../components/layout/Navbar';
import {
  Users,
  MessageCircle,
  Heart,
  Zap,
  Shield,
  Globe,
  Search,
  Bell,
  Share2,
  Bookmark,
  Camera,
  MapPin,
  Calendar,
  BarChart3,
  Settings,
  Lock,
} from 'lucide-react';

const Features = () => {
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
      <section className="py-20 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 gradient-text">Powerful Features</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Everything you need for meaningful social interactions, built with modern technology and
            user experience in mind.
          </p>
          <Button variant="gradient" size="lg" asChild>
            <Link to="/register">Try All Features</Link>
          </Button>
        </div>
      </section>

      {/* Core Features */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {coreFeatures.map((feature, index) => (
              <div key={index} className="p-8 rounded-2xl bg-gradient-card border-none shadow-soft">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.features.map((item, idx) => (
                        <li key={idx} className="flex items-center text-sm text-muted-foreground">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary mr-3" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Advanced Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advancedFeatures.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-background shadow-soft hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Excellence */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Platform Excellence</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Built with industry-leading practices for optimal performance and user experience.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: 'Secure', icon: '🔒' },
              { label: 'Fast', icon: '⚡' },
              { label: 'Reliable', icon: '🛡️' },
              { label: 'Modern', icon: '🚀' },
            ].map((item, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/50 text-center">
                <div className="text-2xl mb-2">{item.icon}</div>
                <div className="font-medium">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-primary text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience All Features?</h2>
          <p className="text-xl mb-8 text-white/90">
            Join thousands of users who are already enjoying the full EndlessChat experience.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              variant="hero"
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              asChild
            >
              <Link to="/register">Get Started Free</Link>
            </Button>
            <Button
              variant="hero"
              size="lg"
              className="bg-white/20 text-white border-white/30 hover:bg-white/30"
              asChild
            >
              <Link to="/login">Sign In</Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Features;
