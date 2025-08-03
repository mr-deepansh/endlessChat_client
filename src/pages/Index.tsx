import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Users, 
  MessageCircle, 
  Heart, 
  Zap, 
  Shield, 
  Globe,
  ArrowRight,
  Star
} from 'lucide-react';
import heroImage from '@/assets/hero-social.jpg';

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/feed');
    }
  }, [user, navigate]);

  const features = [
    {
      icon: Users,
      title: 'Connect & Follow',
      description: 'Build your network by following interesting people and discovering new voices.'
    },
    {
      icon: MessageCircle,
      title: 'Share Your Thoughts',
      description: 'Express yourself with posts, comments, and engage in meaningful conversations.'
    },
    {
      icon: Heart,
      title: 'Show Appreciation',
      description: 'Like, repost, and bookmark content that resonates with you.'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Stay up-to-date with instant notifications and live feed updates.'
    },
    {
      icon: Shield,
      title: 'Safe Environment',
      description: 'Robust moderation tools ensure a positive and respectful community.'
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Connect with people from around the world and expand your horizons.'
    }
  ];

  const stats = [
    { label: 'Active Users', value: '50K+' },
    { label: 'Posts Shared', value: '2M+' },
    { label: 'Connections Made', value: '100K+' },
    { label: 'Communities', value: '500+' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Social platform hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-hero/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <div className="mb-8">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <span className="text-3xl font-bold">S</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Connect.
              <br />
              <span className="gradient-text">Share.</span>
              <br />
              Inspire.
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join our vibrant community where ideas flourish, connections grow, and every voice matters.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="hero" size="lg" asChild className="px-8 py-4 text-lg">
              <Link to="/register">
                Get Started <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="secondary" size="lg" asChild className="px-8 py-4 text-lg bg-white/20 text-white border-white/30 hover:bg-white/30">
              <Link to="/login">
                Sign In
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-3xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-white/80 text-sm md:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experience social networking like never before with our innovative features designed for meaningful connections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="p-8 rounded-2xl bg-gradient-card border-none shadow-soft hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:shadow-primary transition-all duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <div className="flex items-center justify-center mb-6">
            <Star className="w-8 h-8 text-yellow-400 mr-2" />
            <Star className="w-10 h-10 text-yellow-400 mr-2" />
            <Star className="w-8 h-8 text-yellow-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Join the Community?
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Thousands of users are already sharing, connecting, and building amazing relationships. Don't miss out on the conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="lg" asChild className="px-8 py-4 text-lg bg-white text-primary hover:bg-white/90">
              <Link to="/register">
                Create Account <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="px-8 py-4 text-lg border-white text-white hover:bg-white/10">
              <Link to="/login">
                Sign In
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-card border-t">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center mr-3">
              <span className="text-white font-bold">S</span>
            </div>
            <span className="text-2xl font-bold gradient-text">Social</span>
          </div>
          <p className="text-muted-foreground mb-6">
            Building meaningful connections, one post at a time.
          </p>
          <div className="text-sm text-muted-foreground">
            © 2024 Social Platform. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
