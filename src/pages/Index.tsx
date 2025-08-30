import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Users, MessageCircle, Heart, Zap, Shield, Globe, ArrowRight, Star } from 'lucide-react';
import { isAdmin } from '@/utils/roleUtils';
import worldHeroImage from '@/assets/world-hero.jpg';
import { usePageTitle } from '../hooks/usePageTitle';
const Index = () => {
  usePageTitle('Home');
  const { user } = useAuth();
  const navigate = useNavigate();

  // Redirect logged in users based on role
  useEffect(() => {
    if (user) {
      if (isAdmin(user)) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/feed', { replace: true });
      }
    }
  }, [user, navigate]);
  const features = useMemo(
    () => [
      {
        icon: Users,
        title: 'Connect & Follow',
        description:
          'Build your network by following interesting people and discovering new voices.',
      },
      {
        icon: MessageCircle,
        title: 'Share Your Thoughts',
        description:
          'Express yourself with posts, comments, and engage in meaningful conversations.',
      },
      {
        icon: Heart,
        title: 'Show Appreciation',
        description: 'Like, repost, and bookmark content that resonates with you.',
      },
      {
        icon: Zap,
        title: 'Real-time Updates',
        description: 'Stay up-to-date with instant notifications and live feed updates.',
      },
      {
        icon: Shield,
        title: 'Safe Environment',
        description: 'Robust moderation tools ensure a positive and respectful community.',
      },
      {
        icon: Globe,
        title: 'Global Community',
        description: 'Connect with people from around the world and expand your horizons.',
      },
    ],
    []
  );

  const stats = useMemo(
    () => [
      {
        label: 'Active Users',
        value: '50K+',
      },
      {
        label: 'Posts Shared',
        value: '2M+',
      },
      {
        label: 'Connections Made',
        value: '100K+',
      },
      {
        label: 'Communities',
        value: '500+',
      },
    ],
    []
  );

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={worldHeroImage}
            alt="Global social platform hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-blue-900/60 to-teal-800/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16 text-center text-white">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl xl:text-8xl 2xl:text-9xl font-bold mb-6 xl:mb-8 2xl:mb-10 leading-tight">
              <span className="gradient-text">Endless</span>
              <br />
              Conversations.
              <br />
              <span className="text-white/90">Infinite</span> Ideas.
            </h1>
            <p className="text-xl md:text-2xl xl:text-3xl 2xl:text-4xl text-white/90 mb-8 xl:mb-10 2xl:mb-12 max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mx-auto leading-relaxed">
              Welcome to <span className="font-semibold text-primary-glow">EndlessChatt</span> -
              where meaningful conversations never end and authentic connections begin.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 xl:gap-6 2xl:gap-8 justify-center mb-12 xl:mb-16 2xl:mb-20">
            {user ? (
              <>
                {isAdmin(user) ? (
                  <>
                    <Link to="/admin">
                      <Button
                        variant="hero"
                        size="lg"
                        className="px-8 py-4 text-lg w-full sm:w-auto"
                      >
                        Admin Dashboard <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                    <Link to="/feed">
                      <Button
                        variant="secondary"
                        size="lg"
                        className="px-8 py-4 text-lg bg-white/20 text-white border-white/30 hover:bg-white/30 w-full sm:w-auto"
                      >
                        User Feed
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/feed">
                      <Button
                        variant="hero"
                        size="lg"
                        className="px-8 py-4 text-lg w-full sm:w-auto"
                      >
                        Go to Feed <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </Link>
                    <Link to={user ? `/@${user.username}` : '/profile/me'}>
                      <Button
                        variant="secondary"
                        size="lg"
                        className="px-8 py-4 text-lg bg-white/20 text-white border-white/30 hover:bg-white/30 w-full sm:w-auto"
                      >
                        My Profile
                      </Button>
                    </Link>
                  </>
                )}
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button variant="hero" size="lg" className="px-8 py-4 text-lg w-full sm:w-auto">
                    Get Started <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="px-8 py-4 text-lg bg-white/20 text-white border-white/30 hover:bg-white/30 w-full sm:w-auto"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-8 xl:gap-12 2xl:gap-16 max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto">
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
      <section className="py-20 bg-slate-50/60 dark:bg-background">
        <div className="max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 gradient-text">
              Why Choose EndlessChatt?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built by <span className="font-semibold text-primary">Deepansh Gangwar</span> -
              Experience social networking designed for authentic, endless conversations and genuine
              connections.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-8 xl:gap-10 2xl:gap-12 cursor-pointer">
            {features.map((feature, index) => (
              <div key={index} className="group">
                <div className="p-8 rounded-2xl bg-gradient-card border-none shadow-soft hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-2">
                  <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:shadow-primary transition-all duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto px-4 lg:px-8 xl:px-12 2xl:px-16 text-center text-white">
          <div className="flex items-center justify-center mb-6">
            <Star className="w-8 h-8 text-yellow-400 mr-2" />
            <Star className="w-10 h-10 text-yellow-400 mr-2" />
            <Star className="w-8 h-8 text-yellow-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Join the Community?</h2>
          <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
            Thousands of users are already sharing, connecting, and building amazing relationships.
            Don't miss out on the conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button
                variant="hero"
                size="lg"
                className="px-8 py-4 text-lg bg-white text-primary hover:bg-white/90 w-full sm:w-auto"
              >
                Create Account <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="hero"
                size="lg"
                className="px-8 py-4 text-lg bg-white text-primary hover:bg-white/90 w-full sm:w-auto"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
export default Index;
