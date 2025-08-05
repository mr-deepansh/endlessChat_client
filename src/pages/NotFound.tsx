import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, Search, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md mx-auto text-center p-8">
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-primary/10 flex items-center justify-center">
          <span className="text-4xl font-bold text-primary">404</span>
        </div>
        <h1 className="text-3xl font-bold mb-4 gradient-text">Page Not Found</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Oops! The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL.
        </p>
        <div className="space-y-4">
          <Button asChild className="w-full" variant="gradient">
            <Link to="/">
              <Home className="w-4 h-4 mr-2" />
              Return to Home
            </Link>
          </Button>
          <Button asChild className="w-full" variant="outline">
            <Link to="/feed">
              <Search className="w-4 h-4 mr-2" />
              Go to Feed
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
