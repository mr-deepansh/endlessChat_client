import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface RateLimitContextType {
  isRateLimited: boolean;
  setRateLimited: (limited: boolean) => void;
  lastRateLimitTime: number | null;
  setLastRateLimitTime: (time: number) => void;
}

const RateLimitContext = createContext<RateLimitContextType | undefined>(undefined);

export const useRateLimit = () => {
  const context = useContext(RateLimitContext);
  if (context === undefined) {
    throw new Error('useRateLimit must be used within a RateLimitProvider');
  }
  return context;
};

interface RateLimitProviderProps {
  children: ReactNode;
}

export const RateLimitProvider: React.FC<RateLimitProviderProps> = ({ children }) => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [lastRateLimitTime, setLastRateLimitTime] = useState<number | null>(null);

  const setRateLimited = (limited: boolean) => {
    setIsRateLimited(limited);
    if (limited) {
      setLastRateLimitTime(Date.now());
    }
  };

  useEffect(() => {
    const handleRateLimitExceeded = (event: CustomEvent) => {
      setRateLimited(true);
    };

    window.addEventListener('rateLimitExceeded', handleRateLimitExceeded as EventListener);
    
    return () => {
      window.removeEventListener('rateLimitExceeded', handleRateLimitExceeded as EventListener);
    };
  }, []);

  const value: RateLimitContextType = {
    isRateLimited,
    setRateLimited,
    lastRateLimitTime,
    setLastRateLimitTime,
  };

  return (
    <RateLimitContext.Provider value={value}>
      {children}
    </RateLimitContext.Provider>
  );
};

export default RateLimitProvider;
