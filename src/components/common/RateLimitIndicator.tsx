import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '../ui/alert';
import { Button } from '../ui/button';
import { X } from 'lucide-react';
import { useRateLimit } from '../../contexts/RateLimitContext';

export const RateLimitIndicator: React.FC = () => {
  const { isRateLimited, setRateLimited } = useRateLimit();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isRateLimited) {
      setShow(true);
      // Auto-hide after 10 seconds
      const timer = setTimeout(() => {
        setShow(false);
        setRateLimited(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [isRateLimited, setRateLimited]);

  const handleDismiss = () => {
    setShow(false);
    setRateLimited(false);
  };

  if (!show || !isRateLimited) return null;

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      <Alert className="border-orange-200 bg-orange-50">
        <AlertDescription className="flex items-center justify-between">
          <div>
            <p className="font-medium text-orange-800">Rate Limited</p>
            <p className="text-sm text-orange-700">
              Too many requests. Please wait a moment before trying again.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="text-orange-600 hover:text-orange-800"
          >
            <X className="h-4 w-4" />
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default RateLimitIndicator;
