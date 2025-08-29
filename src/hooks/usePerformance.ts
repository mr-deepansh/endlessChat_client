/**
 * Enterprise Performance Hooks
 * Custom React hooks for performance monitoring and optimization
 */

import { useEffect, useRef, useCallback, useMemo, useState } from 'react';
import { PerformanceMonitor, debounce, throttle, CacheManager } from '../utils/performance';

// Performance monitoring hook
export const usePerformanceMonitor = (componentName: string) => {
  const monitor = useMemo(() => PerformanceMonitor.getInstance(), []);
  const renderStartRef = useRef<number>();

  useEffect(() => {
    renderStartRef.current = performance.now();

    return () => {
      if (renderStartRef.current) {
        const renderTime = performance.now() - renderStartRef.current;
        // Record render time (method would need to be public)
        console.debug(`${componentName} render time:`, renderTime);
      }
    };
  });

  const measureAsync = useCallback(
    async <T>(label: string, asyncFn: () => Promise<T>): Promise<T> => {
      const endTimer = monitor.startTimer(`${componentName}_${label}`);
      try {
        const result = await asyncFn();
        return result;
      } finally {
        endTimer();
      }
    },
    [monitor, componentName]
  );

  const getMetrics = useCallback(() => {
    return monitor.getAllMetrics();
  }, [monitor]);

  return { measureAsync, getMetrics };
};

// Debounced value hook
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Throttled callback hook
export const useThrottle = <T extends (...args: unknown[]) => void>(
  callback: T,
  delay: number
): T => {
  const throttledCallback = useMemo(() => throttle(callback, delay), [callback, delay]);

  return throttledCallback as T;
};

// Intersection observer hook for lazy loading
export const useIntersectionObserver = (options: IntersectionObserverInit = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        rootMargin: '50px',
        threshold: 0.1,
        ...options,
      }
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
    };
  }, [options]);

  return { targetRef, isIntersecting };
};

// Virtual scrolling hook
export const useVirtualScroll = <T>(items: T[], itemHeight: number, containerHeight: number) => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const visibleRange = useMemo(() => {
    const buffer = 5;
    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.min(
      visibleStart + Math.ceil(containerHeight / itemHeight),
      items.length
    );

    return {
      start: Math.max(0, visibleStart - buffer),
      end: Math.min(items.length, visibleEnd + buffer),
    };
  }, [scrollTop, itemHeight, containerHeight, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end).map((item, index) => ({
      item,
      index: visibleRange.start + index,
    }));
  }, [items, visibleRange]);

  const totalHeight = items.length * itemHeight;

  const handleScroll = useThrottle((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, 16); // ~60fps

  return {
    scrollElementRef,
    visibleItems,
    totalHeight,
    handleScroll,
    offsetY: visibleRange.start * itemHeight,
  };
};

// API cache hook
export const useApiCache = <T>(key: string, ttl = 300000) => {
  const cache = useMemo(() => CacheManager.getInstance(), []);

  const getCachedData = useCallback((): T | null => {
    return cache.get<T>(key);
  }, [cache, key]);

  const setCachedData = useCallback(
    (data: T): void => {
      cache.set(key, data, ttl);
    },
    [cache, key, ttl]
  );

  const clearCache = useCallback((): void => {
    cache.clear();
  }, [cache]);

  return { getCachedData, setCachedData, clearCache };
};

// Memory usage monitoring hook
export const useMemoryMonitor = () => {
  const [memoryInfo, setMemoryInfo] = useState<{
    used: number;
    total: number;
    limit: number;
  } | null>(null);

  useEffect(() => {
    const updateMemoryInfo = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        setMemoryInfo({
          used: memory.usedJSHeapSize,
          total: memory.totalJSHeapSize,
          limit: memory.jsHeapSizeLimit,
        });
      }
    };

    updateMemoryInfo();
    const interval = setInterval(updateMemoryInfo, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const getMemoryUsagePercentage = useCallback(() => {
    if (!memoryInfo) return 0;
    return (memoryInfo.used / memoryInfo.limit) * 100;
  }, [memoryInfo]);

  return { memoryInfo, getMemoryUsagePercentage };
};

// Network status hook
export const useNetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectionType, setConnectionType] = useState<string>('unknown');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check connection type if available
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      setConnectionType(connection.effectiveType || 'unknown');

      const handleConnectionChange = () => {
        setConnectionType(connection.effectiveType || 'unknown');
      };

      connection.addEventListener('change', handleConnectionChange);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
        connection.removeEventListener('change', handleConnectionChange);
      };
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, connectionType };
};

// Image lazy loading hook
export const useLazyImage = (src: string, placeholder = '') => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const { targetRef, isIntersecting } = useIntersectionObserver();

  useEffect(() => {
    if (isIntersecting && src && !isLoaded && !isError) {
      const img = new Image();

      img.onload = () => {
        setImageSrc(src);
        setIsLoaded(true);
      };

      img.onerror = () => {
        setIsError(true);
      };

      img.src = src;
    }
  }, [isIntersecting, src, isLoaded, isError]);

  return { targetRef, imageSrc, isLoaded, isError };
};

export default {
  usePerformanceMonitor,
  useDebounce,
  useThrottle,
  useIntersectionObserver,
  useVirtualScroll,
  useApiCache,
  useMemoryMonitor,
  useNetworkStatus,
  useLazyImage,
};
