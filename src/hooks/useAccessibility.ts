import { useEffect, useRef, useState } from 'react';

// Hook for managing focus
export const useFocusManagement = () => {
  const focusRef = useRef<HTMLElement | null>(null);

  const setFocus = (element: HTMLElement | null) => {
    if (element) {
      element.focus();
      focusRef.current = element;
    }
  };

  const restoreFocus = () => {
    if (focusRef.current) {
      focusRef.current.focus();
    }
  };

  const trapFocus = (container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  };

  return { setFocus, restoreFocus, trapFocus };
};

// Hook for keyboard navigation
export const useKeyboardNavigation = (
  onEnter?: () => void,
  onEscape?: () => void,
  onArrowUp?: () => void,
  onArrowDown?: () => void,
  onArrowLeft?: () => void,
  onArrowRight?: () => void
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'Enter':
          onEnter?.();
          break;
        case 'Escape':
          onEscape?.();
          break;
        case 'ArrowUp':
          event.preventDefault();
          onArrowUp?.();
          break;
        case 'ArrowDown':
          event.preventDefault();
          onArrowDown?.();
          break;
        case 'ArrowLeft':
          onArrowLeft?.();
          break;
        case 'ArrowRight':
          onArrowRight?.();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onEnter, onEscape, onArrowUp, onArrowDown, onArrowLeft, onArrowRight]);
};

// Hook for screen reader announcements
export const useScreenReader = () => {
  const [announcement, setAnnouncement] = useState('');

  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement(''); // Clear first to ensure re-announcement
    setTimeout(() => {
      setAnnouncement(message);
    }, 100);
  };

  return { announcement, announce };
};

// Hook for reduced motion preference
export const useReducedMotion = (): boolean => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};

// Hook for high contrast preference
export const useHighContrast = (): boolean => {
  const [prefersHighContrast, setPrefersHighContrast] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    setPrefersHighContrast(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersHighContrast(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersHighContrast;
};

// Hook for color scheme preference
export const useColorScheme = (): 'light' | 'dark' | 'no-preference' => {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark' | 'no-preference'>(
    'no-preference'
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const lightQuery = window.matchMedia('(prefers-color-scheme: light)');

    const updateColorScheme = () => {
      if (darkQuery.matches) {
        setColorScheme('dark');
      } else if (lightQuery.matches) {
        setColorScheme('light');
      } else {
        setColorScheme('no-preference');
      }
    };

    updateColorScheme();

    darkQuery.addEventListener('change', updateColorScheme);
    lightQuery.addEventListener('change', updateColorScheme);

    return () => {
      darkQuery.removeEventListener('change', updateColorScheme);
      lightQuery.removeEventListener('change', updateColorScheme);
    };
  }, []);

  return colorScheme;
};

// Hook for skip links
export const useSkipLinks = () => {
  const skipToContent = () => {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const skipToNavigation = () => {
    const navigation = document.getElementById('main-navigation');
    if (navigation) {
      navigation.focus();
      navigation.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return { skipToContent, skipToNavigation };
};

// Hook for ARIA live regions
export const useAriaLive = () => {
  const liveRegionRef = useRef<HTMLDivElement>(null);

  const announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    if (liveRegionRef.current) {
      liveRegionRef.current.setAttribute('aria-live');
      liveRegionRef.current.textContent = message;

      // Clear after announcement
      setTimeout(() => {
        if (liveRegionRef.current) {
          liveRegionRef.current.textContent = '';
        }
      }, 1000);
    }
  };

  return { announceToScreenReader, liveRegionRef };
};

const accessibilityHooks = {
  useFocusManagement,
  useKeyboardNavigation,
  useScreenReader,
  useReducedMotion,
  useHighContrast,
  useColorScheme,
  useSkipLinks,
  useAriaLive,
};

export default accessibilityHooks;
