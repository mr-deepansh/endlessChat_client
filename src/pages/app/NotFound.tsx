import { useLocation, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Home, Search, ArrowLeft, AlertTriangle } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error('404 Error: User attempted to access non-existent route:', location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-primary rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <div className="max-w-2xl mx-auto text-center p-8 relative z-10">
        {/* 3D Rotating Cube */}
        <div className="perspective-1000 mb-12">
          <div
            className="cube-3d mx-auto relative float-animation"
            style={{ width: '100px', height: '100px' }}
          >
            <div className="cube-face flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">4</span>
            </div>
            <div className="cube-face flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">0</span>
            </div>
            <div className="cube-face flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">4</span>
            </div>
            <div className="cube-face flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-primary" />
            </div>
            <div className="cube-face flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">?</span>
            </div>
            <div className="cube-face flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">!</span>
            </div>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold mb-6 gradient-text animate-fade-in">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-8 leading-relaxed text-lg max-w-md mx-auto animate-fade-in">
          Oops! The page you're looking for seems to have vanished into the digital void. Let's get
          you back on track.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in">
          <Button asChild className="w-full transition-spring hover-scale" variant="gradient">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Link>
          </Button>
          <Button asChild className="w-full transition-spring hover-scale" variant="outline">
            <Link to="/feed">
              <Search className="w-4 h-4 mr-2" />
              Go to Feed
            </Link>
          </Button>
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="w-full transition-spring hover-scale"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>

        {/* Error details for debugging */}
        <div className="mt-8 p-4 rounded-lg bg-muted/30 border border-border/50">
          <p className="text-sm text-muted-foreground">
            Route attempted: <code className="text-primary">{location.pathname}</code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
