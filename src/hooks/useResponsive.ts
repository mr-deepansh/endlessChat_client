import { useState, useEffect } from 'react';

interface BreakpointConfig {
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl': number;
}

const defaultBreakpoints: BreakpointConfig = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export type Breakpoint = keyof BreakpointConfig;

export interface ResponsiveState {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isLargeDesktop: boolean;
  isXLDesktop: boolean;
  currentBreakpoint: Breakpoint | 'xs';
  isAbove: (breakpoint: Breakpoint) => boolean;
  isBelow: (breakpoint: Breakpoint) => boolean;
  isBetween: (min: Breakpoint, max: Breakpoint) => boolean;
}

export const useResponsive = (
  breakpoints: BreakpointConfig = defaultBreakpoints
): ResponsiveState => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    // Debounce resize events for performance
    let timeoutId: NodeJS.Timeout;
    const debouncedHandleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedHandleResize);

    // Initial call
    handleResize();

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  const { width, height } = windowSize;

  // Helper functions
  const isAbove = (breakpoint: Breakpoint): boolean => {
    return width >= breakpoints[breakpoint];
  };

  const isBelow = (breakpoint: Breakpoint): boolean => {
    return width < breakpoints[breakpoint];
  };

  const isBetween = (min: Breakpoint, max: Breakpoint): boolean => {
    return width >= breakpoints[min] && width < breakpoints[max];
  };

  // Determine current breakpoint
  const getCurrentBreakpoint = (): Breakpoint | 'xs' => {
    if (width >= breakpoints['2xl']) return '2xl';
    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
  };

  // Device type detection
  const isMobile = width < breakpoints.md;
  const isTablet = width >= breakpoints.md && width < breakpoints.lg;
  const isDesktop = width >= breakpoints.lg && width < breakpoints.xl;
  const isLargeDesktop = width >= breakpoints.xl && width < breakpoints['2xl'];
  const isXLDesktop = width >= breakpoints['2xl'];

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    isLargeDesktop,
    isXLDesktop,
    currentBreakpoint: getCurrentBreakpoint(),
    isAbove,
    isBelow,
    isBetween,
  };
};

// Hook for specific breakpoint detection
export const useBreakpoint = (breakpoint: Breakpoint): boolean => {
  const { isAbove } = useResponsive();
  return isAbove(breakpoint);
};

// Hook for mobile detection
export const useIsMobile = (): boolean => {
  const { isMobile } = useResponsive();
  return isMobile;
};

// Hook for tablet detection
export const useIsTablet = (): boolean => {
  const { isTablet } = useResponsive();
  return isTablet;
};

// Hook for desktop detection
export const useIsDesktop = (): boolean => {
  const { isDesktop, isLargeDesktop, isXLDesktop } = useResponsive();
  return isDesktop || isLargeDesktop || isXLDesktop;
};

// Hook for orientation detection
export const useOrientation = (): 'portrait' | 'landscape' => {
  const { width, height } = useResponsive();
  return height > width ? 'portrait' : 'landscape';
};

// Hook for safe area detection (for mobile devices with notches)
export const useSafeArea = () => {
  const [safeArea, setSafeArea] = useState({
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const updateSafeArea = () => {
      const style = getComputedStyle(document.documentElement);
      setSafeArea({
        top: parseInt(style.getPropertyValue('env(safe-area-inset-top)') || '0'),
        right: parseInt(style.getPropertyValue('env(safe-area-inset-right)') || '0'),
        bottom: parseInt(style.getPropertyValue('env(safe-area-inset-bottom)') || '0'),
        left: parseInt(style.getPropertyValue('env(safe-area-inset-left)') || '0'),
      });
    };

    updateSafeArea();
    window.addEventListener('resize', updateSafeArea);
    window.addEventListener('orientationchange', updateSafeArea);

    return () => {
      window.removeEventListener('resize', updateSafeArea);
      window.removeEventListener('orientationchange', updateSafeArea);
    };
  }, []);

  return safeArea;
};

export default useResponsive;
