import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { toast } from '../../hooks/use-toast';
import { Button } from '../ui/button';
import { AlertCircle, X } from 'lucide-react';

const EmailVerificationBanner: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Don't show banner if email is verified or user dismissed it
  if (!user || user.emailVerified || !isVisible) {
    return null;
  }

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      const response = await authService.resendVerification();
      if (response.success) {
        toast({
          title: 'Verification Email Sent',
          description: 'Please check your email for the verification link.',
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      toast({
        title: 'Failed to Send Email',
        description: error.message || 'Failed to send verification email',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-600" />
          <p className="text-sm text-yellow-800">Please verify your email address</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleResendVerification}
            disabled={isLoading}
            variant="ghost"
            size="sm"
            className="text-yellow-700 hover:bg-yellow-100 h-7 px-2 text-xs"
          >
            {isLoading ? 'Sending...' : 'Resend'}
          </Button>
          <Button
            onClick={() => setIsVisible(false)}
            variant="ghost"
            size="sm"
            className="text-yellow-600 hover:bg-yellow-100 h-7 w-7 p-0"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
