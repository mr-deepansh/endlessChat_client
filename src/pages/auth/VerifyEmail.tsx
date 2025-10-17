import { ArrowRight, CheckCircle, Home, Loader2, Mail, Settings, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from '../../hooks/use-toast';
import { authService } from '../../services/authService';

const VerifyEmail: React.FC = () => {
  const { token: pathToken } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      // Get token from either path parameter or query parameter
      const token = pathToken || searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid or missing verification token');
        return;
      }
      try {
        const response = await authService.verifyEmail(token);
        if (response.success) {
          setStatus('success');
          setMessage('Your email has been verified successfully!');
          // Refresh user data to update emailVerified status
          try {
            await refreshUser();
          } catch (_refreshError) {}
          toast({
            title: '✅ Email Verified Successfully',
            description: 'Welcome to EndlessChat! You can now access all features.',
          });
        } else {
          throw new Error(response.message);
        }
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Failed to verify email');
        toast({
          title: 'Verification Failed',
          description: error.message || 'Failed to verify email',
          variant: 'destructive',
        });
      }
    };
    verifyEmail();
  }, [pathToken, searchParams, refreshUser]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg shadow-xl border-0">
        <CardHeader className="text-center pb-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Email Verification
          </CardTitle>
          <p className="text-sm text-gray-600 mt-2">EndlessChat</p>
        </CardHeader>
        <CardContent className="text-center space-y-6 px-6 pb-6">
          {status === 'loading' && (
            <div className="space-y-4">
              <div className="relative">
                <Loader2 className="w-16 h-16 animate-spin mx-auto text-blue-500" />
                <div className="absolute inset-0 w-16 h-16 mx-auto border-4 border-blue-100 rounded-full"></div>
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800">Verifying your email...</h3>
                <p className="text-gray-600">Please wait while we confirm your email address</p>
              </div>
            </div>
          )}
          {status === 'success' && (
            <div className="space-y-6">
              <div className="relative">
                <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-12 h-12 text-green-500" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">✓</span>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-green-700">
                  ✅ Email Verified Successfully!
                </h3>
                <p className="text-green-600 font-medium">{message}</p>
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="text-blue-400 text-lg">🎉</span>
                    </div>
                    <div className="ml-3 text-left">
                      <p className="text-sm font-medium text-blue-800">What's Next?</p>
                      <p className="text-sm text-blue-700 mt-1">
                        You can now access all features of EndlessChat. Start creating posts,
                        following users, and engaging with the community!
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={() => navigate('/feed')}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-105"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Start Exploring
              </Button>
            </div>
          )}
          {status === 'error' && (
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="w-12 h-12 text-red-500" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-bold text-red-700">Verification Failed</h3>
                <p className="text-red-600">{message}</p>
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <span className="text-yellow-400 text-lg">🔒</span>
                    </div>
                    <div className="ml-3 text-left">
                      <p className="text-sm font-medium text-yellow-800">Security Notice</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        If you're having trouble, please contact our support team or try requesting
                        a new verification email.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <Button
                  onClick={() => navigate('/login')}
                  variant="outline"
                  className="w-full border-blue-300 text-blue-600 hover:bg-blue-50 font-semibold py-3"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go to Login
                </Button>
                <Button
                  onClick={() => navigate('/settings')}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Go to Settings
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
