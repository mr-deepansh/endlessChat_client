/**
 * Responsive Design Utilities
 * Provides utilities for responsive design, breakpoint management, and device detection
 */

// Breakpoint configuration matching Tailwind CSS
export const breakpoints = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

// Device type detection
export const deviceDetection = {
  isMobile: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < breakpoints.md;
  },

  isTablet: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= breakpoints.md && window.innerWidth < breakpoints.lg;
  },

  isDesktop: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= breakpoints.lg;
  },

  isLargeDesktop: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= breakpoints.xl;
  },

  isXLDesktop: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth >= breakpoints['2xl'];
  },

  isTouchDevice: (): boolean => {
    if (typeof window === 'undefined') return false;
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  hasHover: (): boolean => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(hover: hover)').matches;
  },

  prefersReducedMotion: (): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  getDevicePixelRatio: (): number => {
    if (typeof window === 'undefined') return 1;
    return window.devicePixelRatio || 1;
  },

  getViewportSize: (): { width: number; height: number } => {
    if (typeof window === 'undefined') return { width: 1024, height: 768 };
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  },

  getOrientation: (): 'portrait' | 'landscape' => {
    const { width, height } = deviceDetection.getViewportSize();
    return height > width ? 'portrait' : 'landscape';
  },
};

// Responsive value utilities
export const responsiveValues = {
  // Get value based on current breakpoint
  getResponsiveValue: <T>(
    values: Partial<Record<Breakpoint | 'xs', T>>,
    currentWidth: number
  ): T | undefined => {
    const sortedBreakpoints = Object.entries(breakpoints)
      .sort(([, a], [, b]) => b - a) // Sort descending
      .map(([key]) => key as Breakpoint);

    // Add 'xs' to the beginning
    const allBreakpoints: (Breakpoint | 'xs')[] = ['xs', ...sortedBreakpoints];

    for (const bp of allBreakpoints) {
      if (bp === 'xs' || currentWidth >= breakpoints[bp as Breakpoint]) {
        if (values[bp] !== undefined) {
          return values[bp];
        }
      }
    }

    return undefined;
  },

  // Generate responsive classes
  generateResponsiveClasses: (
    property: string,
    values: Partial<Record<Breakpoint | 'xs', string | number>>
  ): string => {
    const classes: string[] = [];

    Object.entries(values).forEach(([breakpoint, value]) => {
      if (breakpoint === 'xs') {
        classes.push(`${property}-${value}`);
      } else {
        classes.push(`${breakpoint}:${property}-${value}`);
      }
    });

    return classes.join(' ');
  },

  // Get responsive spacing
  getResponsiveSpacing: (
    base: number,
    multipliers: Partial<Record<Breakpoint, number>> = {}
  ): Partial<Record<Breakpoint | 'xs', number>> => {
    return {
      xs: base,
      sm: base * (multipliers.sm || 1.25),
      md: base * (multipliers.md || 1.5),
      lg: base * (multipliers.lg || 1.75),
      xl: base * (multipliers.xl || 2),
      '2xl': base * (multipliers['2xl'] || 2.5),
    };
  },

  // Get responsive font sizes
  getResponsiveFontSizes: (
    base: number
  ): Partial<Record<Breakpoint | 'xs', number>> => {
    return {
      xs: base,
      sm: base * 1.125, // 18px if base is 16px
      md: base * 1.25,  // 20px if base is 16px
      lg: base * 1.5,   // 24px if base is 16px
      xl: base * 1.75,  // 28px if base is 16px
      '2xl': base * 2,  // 32px if base is 16px
    };
  },
};

// Layout utilities
export const layoutUtils = {
  // Calculate optimal grid columns based on screen size
  getOptimalGridColumns: (
    itemMinWidth: number,
    containerWidth: number,
    gap: number = 16
  ): number => {
    const availableWidth = containerWidth - gap;
    const itemWidthWithGap = itemMinWidth + gap;
    return Math.max(1, Math.floor(availableWidth / itemWidthWithGap));
  },

  // Get container padding based on screen size
  getContainerPadding: (screenWidth: number): number => {
    if (screenWidth < breakpoints.sm) return 16; // 1rem
    if (screenWidth < breakpoints.md) return 24; // 1.5rem
    if (screenWidth < breakpoints.lg) return 32; // 2rem
    if (screenWidth < breakpoints.xl) return 48; // 3rem
    if (screenWidth < breakpoints['2xl']) return 64; // 4rem
    return 80; // 5rem
  },

  // Calculate responsive aspect ratio
  getResponsiveAspectRatio: (
    baseRatio: number,
    screenWidth: number
  ): number => {
    if (screenWidth < breakpoints.md) {
      return Math.max(baseRatio * 0.75, 0.5); // Taller on mobile
    }
    return baseRatio;
  },
};

// Performance utilities for responsive design
export const performanceUtils = {
  // Debounce resize events
  debounceResize: (callback: () => void, delay: number = 150): (() => void) => {
    let timeoutId: NodeJS.Timeout;
    
    const debouncedCallback = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(callback, delay);
    };

    return debouncedCallback;
  },

  // Throttle scroll events
  throttleScroll: (callback: () => void, delay: number = 16): (() => void) => {
    let isThrottled = false;
    
    const throttledCallback = () => {
      if (!isThrottled) {
        callback();
        isThrottled = true;
        setTimeout(() => {
          isThrottled = false;
        }, delay);
      }
    };

    return throttledCallback;
  },

  // Optimize images for different screen sizes
  getOptimizedImageUrl: (
    baseUrl: string,
    screenWidth: number,
    pixelRatio: number = 1
  ): string => {
    const targetWidth = Math.ceil(screenWidth * pixelRatio);
    
    // This would typically integrate with an image optimization service
    // For now, return the base URL with width parameter
    if (baseUrl.includes('unsplash.com')) {
      return `${baseUrl}&w=${targetWidth}&q=80&fm=webp`;
    }
    
    return baseUrl;
  },
};

// CSS-in-JS utilities for responsive styles
export const responsiveStyles = {
  // Generate media query
  mediaQuery: (breakpoint: Breakpoint): string => {
    return `@media (min-width: ${breakpoints[breakpoint]}px)`;
  },

  // Generate responsive CSS object
  responsive: (
    styles: Partial<Record<Breakpoint | 'xs', React.CSSProperties>>
  ): React.CSSProperties => {
    let baseStyles: React.CSSProperties = {};
    const mediaQueries: string[] = [];

    // Apply base styles (xs)
    if (styles.xs) {
      baseStyles = { ...baseStyles, ...styles.xs };
    }

    // Generate media queries for other breakpoints
    Object.entries(styles).forEach(([bp, style]) => {
      if (bp !== 'xs' && style) {
        const breakpoint = bp as Breakpoint;
        const mediaQuery = responsiveStyles.mediaQuery(breakpoint);
        // Note: This would need to be processed by a CSS-in-JS library
        // For React inline styles, we'd need a different approach
      }
    });

    return baseStyles;
  },

  // Generate Tailwind responsive classes
  tailwindResponsive: (
    property: string,
    values: Partial<Record<Breakpoint | 'xs', string | number>>
  ): string => {
    const classes: string[] = [];

    Object.entries(values).forEach(([bp, value]) => {
      if (bp === 'xs') {
        classes.push(`${property}-${value}`);
      } else {
        classes.push(`${bp}:${property}-${value}`);
      }
    });

    return classes.join(' ');
  },
};

// Export all utilities
export default {
  breakpoints,
  deviceDetection,
  responsiveValues,
  layoutUtils,
  performanceUtils,
  responsiveStyles,
};