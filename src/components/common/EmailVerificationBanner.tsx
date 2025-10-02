import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { toast } from '../../hooks/use-toast';
import { Button } from '../ui/button';
import { Mail, X, Send } from 'lucide-react';

const EmailVerificationBanner: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Don't show banner if email is verified or user dismissed it
  if (!user || user.emailVerified || user.isEmailVerified || user.isVerified || !isVisible) {
    return null;
  }

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      const response = await authService.resendVerification();
      if (response.success) {
        toast({
          title: '📧 Verification Email Sent',
          description: 'Please check your email for the verification link.',
        });
      } else {
        throw new Error(response.message);
      }
    } catch (error: any) {
      toast({
        title: 'Failed to Send Email',
        description: error.message || 'Email service temporarily unavailable',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Mail className="w-4 h-4 text-white" />
          </div>
          <div>
            <p className="text-sm font-medium text-blue-800">📧 Please verify your email address</p>
            <p className="text-xs text-blue-600">Check your inbox and click the verification link to unlock all features</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleResendVerification}
            disabled={isLoading}
            variant="ghost"
            size="sm"
            className="text-blue-700 hover:bg-blue-100 h-8 px-3 text-xs font-medium border border-blue-200 hover:border-blue-300 transition-all duration-200"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border border-blue-600 border-t-transparent mr-1"></div>
                Sending...
              </>
            ) : (
              <>
                <Send className="w-3 h-3 mr-1" />
                Resend
              </>
            )}
          </Button>
          <Button
            onClick={() => setIsVisible(false)}
            variant="ghost"
            size="sm"
            className="text-blue-600 hover:bg-blue-100 h-8 w-8 p-0 rounded-full transition-all duration-200"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationBanner;
