  import React, { useState, useEffect } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import { Button } from '@/components/ui/button';
  import { Input } from '@/components/ui/input';
  import { Label } from '@/components/ui/label';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
  import { useAuth } from '@/contexts/AuthContext';
  import { Eye, EyeOff, Mail, Lock } from 'lucide-react';
  import worldHeroImage from '@/assets/world-hero.jpg';

  const Login = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
      console.log('🔄 Login useEffect - user changed:', user ? { id: user._id, username: user.username } : null);
      if (user) {
        console.log('✅ User exists in Login, navigating to /feed');
        navigate('/feed');
      }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      console.log('📝 Login form submitted with:', { emailOrUsername, password: '***' });
      setIsLoading(true);

      try {
        const success = await login(emailOrUsername, password);
        console.log('📊 Login result:', success);
        if (success) {
          console.log('✅ Login successful, navigating to /feed');
          navigate('/feed');
        } else {
          console.log('❌ Login failed');
        }
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <img 
            src={worldHeroImage} 
            alt="Social platform background" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
        </div>

        {/* Login Form */}
        <div className="relative z-10 w-full max-w-md">
          <Card className="glass border-white/20 shadow-2xl">
            <CardHeader className="text-center space-y-2">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center shadow-primary">
                <span className="text-2xl font-bold text-white">E</span>
              </div>
              <CardTitle className="text-2xl font-bold gradient-text">Welcome Back</CardTitle>
              <CardDescription className="text-muted-foreground">
                Sign in to EndlessChat and continue your conversations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="emailOrUsername" className="text-foreground">Email or Username</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="emailOrUsername"
                      type="text"
                      placeholder="Enter your email or username"
                      value={emailOrUsername}
                      onChange={(e) => setEmailOrUsername(e.target.value)}
                      required
                      className="pl-10 bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background/80"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password (min 8 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="pl-10 pr-10 bg-background/50 border-border text-foreground placeholder:text-muted-foreground focus:bg-background/80"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="absolute right-1 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="remember" className="w-4 h-4 rounded border-border bg-background/50 text-primary focus:ring-primary" />
                    <label htmlFor="remember" className="text-sm text-muted-foreground">Remember me</label>
                  </div>
                  <Link to="/forgot-password" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
                    Forgot password?
                  </Link>
                </div>
              <div className="mt-6 text-center">
                <p className="text-muted-foreground">
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
  };

  export default Login;