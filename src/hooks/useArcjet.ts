import { useCallback } from 'react';
import {
  aj,
  createPostLimiter,
  loginLimiter,
  searchLimiter,
  handleArcjetResponse,
} from '@/lib/arcjet';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from './use-toast';

export const useArcjetProtection = () => {
  const { user } = useAuth();

  const protectRequest = useCallback(
    async (
      action: 'general' | 'createPost' | 'login' | 'search',
      request: Request | { ip?: string; userId?: string } = {}
    ) => {
      try {
        let decision;
        const context = {
          userId: user?.id || user?._id,
          ip: 'ip' in request ? request.ip : undefined,
          ...request,
        };

        switch (action) {
          case 'createPost':
            decision = await createPostLimiter.protect(context);
            break;
          case 'login':
            decision = await loginLimiter.protect(context);
            break;
          case 'search':
            decision = await searchLimiter.protect(context);
            break;
          default:
            decision = await aj.protect(context);
        }

        handleArcjetResponse(decision);
        return { allowed: true, decision };
      } catch (error: any) {
        toast({
          title: 'Request Blocked',
          description: error.message,
          variant: 'destructive',
        });
        return { allowed: false, error: error.message };
      }
    },
    [user]
  );

  const protectCreatePost = useCallback(async () => {
    return protectRequest('createPost');
  }, [protectRequest]);

  const protectLogin = useCallback(
    async (ip?: string) => {
      return protectRequest('login', { ip });
    },
    [protectRequest]
  );

  const protectSearch = useCallback(async () => {
    return protectRequest('search');
  }, [protectRequest]);

  return {
    protectRequest,
    protectCreatePost,
    protectLogin,
    protectSearch,
  };
};

// Hook for rate limit status
export const useRateLimitStatus = () => {
  const checkRateLimit = useCallback(async (action: string) => {
    try {
      const decision = await aj.protect({});

      return {
        allowed: !decision.isDenied(),
        remaining: decision.reason.isRateLimit() ? decision.reason.remaining : null,
        resetTime: decision.reason.isRateLimit() ? decision.reason.resetTime : null,
      };
    } catch (_error) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: null,
      };
    }
  }, []);

  return { checkRateLimit };
};

export default useArcjetProtection;
