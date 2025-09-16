import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../services/authService';
import { toast } from '../hooks/use-toast';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';

const VerifyEmail: React.FC = () => {
  const { token: pathToken } = useParams<{ token: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      // Get token from either path parameter or query parameter
      const token = pathToken || searchParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const response = await authService.verifyEmail(token);
        if (response.success) {
          setStatus('success');
          setMessage('Your email has been verified successfully!');
          toast({
            title: 'Email Verified',
            description: 'Your email has been verified successfully.',
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
  }, [pathToken, searchParams]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'loading' && (
            <>
              <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
              <p>Verifying your email...</p>
            </>
          )}

          {status === 'success' && (
            <>
              <CheckCircle className="w-12 h-12 mx-auto text-green-500" />
              <p className="text-green-600">{message}</p>
              <Button onClick={() => navigate('/feed')} className="w-full">
                Continue to Feed
              </Button>
            </>
          )}

          {status === 'error' && (
            <>
              <XCircle className="w-12 h-12 mx-auto text-red-500" />
              <p className="text-red-600">{message}</p>
              <div className="space-y-2">
                <Button onClick={() => navigate('/login')} variant="outline" className="w-full">
                  Go to Login
                </Button>
                <Button onClick={() => navigate('/settings')} className="w-full">
                  Go to Settings
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;
