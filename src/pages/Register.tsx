import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import StepForm from '@/components/auth/StepForm';
import { Button } from '@/components/ui/button';
import { X, Home } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle';

interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role?: 'user' | 'admin';
}

const Register = () => {
  usePageTitle('Register');
  const [isLoading, setIsLoading] = useState(false);
  const { register, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/feed');
    }
  }, [user, navigate]);

  const handleSubmit = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      await register(data);
      // If register() completes without throwing, registration was successful
      // The AuthContext register function already handles navigation to /feed
    } catch (error) {
      console.error('Registration failed:', error);
      // Error handling is done in AuthContext, so we just need to catch here
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
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

      {/* Registration Form */}
      <div className="relative z-10 w-full max-w-md">
        <StepForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Register;
