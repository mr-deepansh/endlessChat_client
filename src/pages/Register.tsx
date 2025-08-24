import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import StepForm from '@/components/auth/StepForm';
import worldHeroImage from '@/assets/world-hero.jpg';

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
      const result = await register(data);
      if (result.success) {
        navigate('/feed');
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

      {/* Registration Form */}
      <div className="relative z-10 w-full max-w-md">
        <StepForm 
          onSubmit={handleSubmit} 
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default Register;