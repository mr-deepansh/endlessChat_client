import React, { useState, useEffect, memo, useCallback, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock, X, Home } from 'lucide-react';
import { usePageTitle } from '../../hooks/usePageTitle';

const Login = memo(() => {
  usePageTitle('Login');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  // Debouncing refs
  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSubmitRef = useRef<number>(0);
  useEffect(() => {
    if (user) navigate('/feed', { replace: true });
  }, [user, navigate]);
  // Debounced submit to prevent multiple API calls
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      if (!identifier.trim() || !password.trim() || isLoading) {
        return;
      }
      // Debounce: prevent multiple submissions within 1 second
      const now = Date.now();
      if (now - lastSubmitRef.current < 1000) {
        return;
      }
      lastSubmitRef.current = now;
      setIsLoading(true);
      try {
        await login({ identifier, password, rememberMe });
      } catch (error) {
        console.error('Login error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [identifier, password, rememberMe, login, isLoading]
  );
  const togglePassword = useCallback(() => setShowPassword(prev => !prev), []);
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" />
      <div className="absolute top-4 left-4 right-4 z-20 flex justify-between">
        <Button
          variant="ghost"
          size="icon"
          className="text-white/80 hover:text-white hover:bg-white/10"
          asChild
        >
          <Link to="/">
            <Home className="w-5 h-5" />
          </Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white/80 hover:text-white hover:bg-white/10"
          asChild
        >
          <Link to="/">
            <X className="w-5 h-5" />
          </Link>
        </Button>
      </div>
      {/* Login Form */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md">
        <Card className="glass border-white/20 shadow-2xl">
          <CardHeader className="text-center space-y-2 p-4 sm:p-6">
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-primary">
              <span className="text-xl sm:text-2xl font-bold text-white">E</span>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold gradient-text">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Sign in to EndlessChat and continue your conversations
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <form
              className="space-y-3 sm:space-y-4"
              onSubmit={e => {
                e.preventDefault();
                handleSubmit(e);
              }}
            >
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="identifier" className="text-foreground text-sm">
                  Email or Username
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="identifier"
                    type="text"
                    placeholder="Enter your email or username"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    className="pl-10 bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background/80 h-10 sm:h-11 text-sm"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !isLoading) {
                        e.preventDefault();
                        if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current);
                        submitTimeoutRef.current = setTimeout(handleSubmit, 100);
                      }
                    }}
                  />
                </div>
              </div>
              <div className="space-y-1 sm:space-y-2">
                <Label htmlFor="password" className="text-foreground text-sm">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background/80 h-10 sm:h-11 text-sm"
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !isLoading) {
                        e.preventDefault();
                        if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current);
                        submitTimeoutRef.current = setTimeout(handleSubmit, 100);
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={togglePassword}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <Button
                type="submit"
                variant="hero"
                size="default"
                className="w-full h-10 sm:h-11 text-sm sm:text-base mt-4 sm:mt-6"
                disabled={isLoading || !identifier.trim() || !password.trim()}
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </Button>
            </form>
            <div className="mt-3 sm:mt-4 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-border bg-background/50 text-primary focus:ring-primary"
                />
                <label htmlFor="remember" className="text-xs sm:text-sm text-muted-foreground">
                  Remember me
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-xs sm:text-sm text-muted-foreground hover:text-foreground hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-muted-foreground text-xs sm:text-sm">
                Don't have an account?{' '}
                <Link to="/register" className="text-primary-glow hover:underline font-medium">
                  Sign up
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
});

Login.displayName = 'Login';
export default Login;
