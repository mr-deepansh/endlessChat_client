import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import { Users, MessageCircle, Heart, Zap, Shield, Globe, ArrowRight, Star } from 'lucide-react';
import { isAdmin } from '../../utils/roleUtils';
import worldHeroImage from '../../assets/world-hero.jpg';
import { usePageTitle } from '../../hooks/usePageTitle';
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
      <section className="relative min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] lg:min-h-[calc(100vh-4.5rem)] xl:min-h-[calc(100vh-5rem)] 2xl:min-h-[calc(100vh-6rem)] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src={worldHeroImage}
            alt="Global social platform hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 via-blue-900/70 to-teal-800/80" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl sm:max-w-5xl lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 text-center text-white">
          <div className="mb-6 sm:mb-8 lg:mb-12 xl:mb-16 2xl:mb-20">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold mb-4 sm:mb-6 lg:mb-8 xl:mb-10 2xl:mb-12 leading-tight">
              <span className="gradient-text">Endless</span>
              <br />
              Conversations.
              <br />
              <span className="text-white/90">Infinite</span> Ideas.
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl text-white/90 mb-6 sm:mb-8 lg:mb-10 xl:mb-12 2xl:mb-16 max-w-xl sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto leading-relaxed">
              Welcome to <span className="font-semibold text-primary-glow">EndlessChatt</span> -
              where meaningful conversations never end and authentic connections begin.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 xl:gap-8 2xl:gap-10 justify-center mb-8 sm:mb-12 lg:mb-16 xl:mb-20 2xl:mb-24">
            {user ? (
              <>
                {isAdmin(user) ? (
                  <>
                    <Link to="/admin">
                      <Button
                        variant="hero"
                        size="lg"
                        className="px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16 py-3 sm:py-4 lg:py-5 xl:py-6 2xl:py-8 text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl w-full sm:w-auto"
                      >
                        Admin Dashboard <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                      </Button>
                    </Link>
                    <Link to="/feed">
                      <Button
                        variant="secondary"
                        size="lg"
                        className="px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16 py-3 sm:py-4 lg:py-5 xl:py-6 2xl:py-8 text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl bg-white/20 text-white border-white/30 hover:bg-white/30 w-full sm:w-auto"
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
                        className="px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16 py-3 sm:py-4 lg:py-5 xl:py-6 2xl:py-8 text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl w-full sm:w-auto"
                      >
                        Go to Feed <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                      </Button>
                    </Link>
                    <Link to={user ? `/@${user.username}` : '/profile/me'}>
                      <Button
                        variant="secondary"
                        size="lg"
                        className="px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16 py-3 sm:py-4 lg:py-5 xl:py-6 2xl:py-8 text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl bg-white/20 text-white border-white/30 hover:bg-white/30 w-full sm:w-auto"
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
                    <span className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl">Get Started</span> <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16 py-3 sm:py-4 lg:py-5 xl:py-6 2xl:py-8 text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl bg-white/20 text-white border-white/30 hover:bg-white/30 w-full sm:w-auto"
                  >
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 xl:gap-12 2xl:gap-16 max-w-2xl sm:max-w-3xl lg:max-w-4xl xl:max-w-5xl 2xl:max-w-6xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-bold mb-1 sm:mb-2">{stat.value}</div>
                <div className="text-white/80 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-5 h-8 sm:w-6 sm:h-10 lg:w-7 lg:h-12 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-0.5 sm:w-1 h-2 sm:h-3 lg:h-4 bg-white/50 rounded-full mt-1 sm:mt-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 lg:py-20 xl:py-24 2xl:py-32 bg-slate-50/60 dark:bg-background">
        <div className="max-w-6xl lg:max-w-7xl xl:max-w-[1400px] 2xl:max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16 xl:mb-20 2xl:mb-24">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-4 sm:mb-6 lg:mb-8 gradient-text">
              Why Choose EndlessChatt?
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl text-muted-foreground max-w-xl sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl 2xl:max-w-5xl mx-auto">
              Built by <span className="font-semibold text-primary">Deepansh Gangwar</span> -
              Experience social networking designed for authentic, endless conversations and genuine
              connections.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
            {features.map((feature, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 rounded-xl sm:rounded-2xl bg-gradient-card border-none shadow-soft hover:shadow-primary/20 transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 xl:w-18 xl:h-18 2xl:w-20 2xl:h-20 rounded-lg sm:rounded-xl bg-gradient-primary flex items-center justify-center mb-4 sm:mb-6 lg:mb-8 group-hover:shadow-primary transition-all duration-300 group-hover:scale-110">
                    <feature.icon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 xl:w-9 xl:h-9 2xl:w-10 2xl:h-10 text-white" />
                  </div>
                  <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-semibold mb-2 sm:mb-3 lg:mb-4 text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                  <p className="text-xs sm:text-sm lg:text-base xl:text-lg 2xl:text-xl text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 xl:py-24 2xl:py-32 bg-gradient-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 2xl:px-16 text-center text-white">
          <div className="flex items-center justify-center mb-4 sm:mb-6 lg:mb-8">
            <Star className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-yellow-400 mr-1 sm:mr-2" />
            <Star className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-yellow-400 mr-1 sm:mr-2" />
            <Star className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-yellow-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-4 sm:mb-6 lg:mb-8">Ready to Join the Community?</h2>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl mb-6 sm:mb-8 lg:mb-12 text-white/90 max-w-xl sm:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto">
            Thousands of users are already sharing, connecting, and building amazing relationships.
            Don't miss out on the conversation.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center">
            <Link to="/register">
              <Button
                variant="hero"
                size="lg"
                className="px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16 py-3 sm:py-4 lg:py-5 xl:py-6 2xl:py-8 text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl bg-white text-primary hover:bg-white/90 w-full sm:w-auto"
              >
                Create Account <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="hero"
                size="lg"
                className="px-6 sm:px-8 lg:px-10 xl:px-12 2xl:px-16 py-3 sm:py-4 lg:py-5 xl:py-6 2xl:py-8 text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl bg-white text-primary hover:bg-white/90 w-full sm:w-auto"
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
