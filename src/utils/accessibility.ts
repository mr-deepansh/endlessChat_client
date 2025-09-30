/**
 * Accessibility Utilities for WCAG Compliance
 * Provides functions for color contrast, focus management, and screen reader support
 */

// Color contrast calculation for WCAG compliance
export const calculateContrast = (color1: string, color2: string): number => {
  const getLuminance = (color: string): number => {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    // Calculate relative luminance
    const sRGB = [r, g, b].map(c => {
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * sRGB[0] + 0.7152 * sRGB[1] + 0.0722 * sRGB[2];
  };

  const lum1 = getLuminance(color1);
  const lum2 = getLuminance(color2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);

  return (brightest + 0.05) / (darkest + 0.05);
};

// Check if color contrast meets WCAG standards
export const meetsContrastRequirement = (
  foreground: string,
  background: string,
  level: 'AA' | 'AAA' = 'AA',
  size: 'normal' | 'large' = 'normal'
): boolean => {
  const contrast = calculateContrast(foreground, background);

  if (level === 'AAA') {
    return size === 'large' ? contrast >= 4.5 : contrast >= 7;
  }

  return size === 'large' ? contrast >= 3 : contrast >= 4.5;
};

// Generate ARIA attributes for better accessibility
export const generateAriaAttributes = (options: {
  label?: string;
  describedBy?: string;
  expanded?: boolean;
  hasPopup?: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';
  controls?: string;
  owns?: string;
  live?: 'polite' | 'assertive' | 'off';
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all';
  busy?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  invalid?: boolean;
  required?: boolean;
  readonly?: boolean;
  multiline?: boolean;
  autocomplete?: string;
  role?: string;
}) => {
  const attributes: Record<string, string | boolean> = {};

  if (options.label) attributes['aria-label'] = options.label;
  if (options.describedBy) attributes['aria-describedby'] = options.describedBy;
  if (options.expanded !== undefined) attributes['aria-expanded'] = options.expanded;
  if (options.hasPopup) attributes['aria-haspopup'] = options.hasPopup;
  if (options.controls) attributes['aria-controls'] = options.controls;
  if (options.owns) attributes['aria-owns'] = options.owns;
  if (options.live) attributes['aria-live'] = options.live;
  if (options.atomic !== undefined) attributes['aria-atomic'] = options.atomic;
  if (options.relevant) attributes['aria-relevant'] = options.relevant;
  if (options.busy !== undefined) attributes['aria-busy'] = options.busy;
  if (options.disabled !== undefined) attributes['aria-disabled'] = options.disabled;
  if (options.hidden !== undefined) attributes['aria-hidden'] = options.hidden;
  if (options.invalid !== undefined) attributes['aria-invalid'] = options.invalid;
  if (options.required !== undefined) attributes['aria-required'] = options.required;
  if (options.readonly !== undefined) attributes['aria-readonly'] = options.readonly;
  if (options.multiline !== undefined) attributes['aria-multiline'] = options.multiline;
  if (options.autocomplete) attributes['aria-autocomplete'] = options.autocomplete;
  if (options.role) attributes['role'] = options.role;

  return attributes;
};

// Focus management utilities
export const focusManagement = {
  // Get all focusable elements within a container
  getFocusableElements: (container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'button:not([disabled])',
      '[href]',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]',
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors));
  },

  // Create focus trap for modals and dialogs
  createFocusTrap: (container: HTMLElement) => {
    const focusableElements = focusManagement.getFocusableElements(container);
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  },

  // Move focus to next/previous element
  moveFocus: (direction: 'next' | 'previous', container?: HTMLElement) => {
    const activeElement = document.activeElement as HTMLElement;
    const focusableElements = focusManagement.getFocusableElements(container || document.body);
    const currentIndex = focusableElements.indexOf(activeElement);

    if (currentIndex === -1) return;

    const nextIndex =
      direction === 'next'
        ? (currentIndex + 1) % focusableElements.length
        : (currentIndex - 1 + focusableElements.length) % focusableElements.length;

    focusableElements[nextIndex]?.focus();
  },
};

// Screen reader utilities
export const screenReader = {
  // Announce message to screen readers
  announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  },

  // Create live region for dynamic content
  createLiveRegion: (priority: 'polite' | 'assertive' = 'polite') => {
    const liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', priority);
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);

    return {
      announce: (message: string) => {
        liveRegion.textContent = message;
        setTimeout(() => {
          liveRegion.textContent = '';
        }, 1000);
      },
      destroy: () => {
        document.body.removeChild(liveRegion);
      },
    };
  },
};

// Keyboard event utilities
export const keyboard = {
  // Check if key combination is pressed
  isKeyCombo: (event: KeyboardEvent, combo: string[]): boolean => {
    const pressedKeys = [];
    if (event.ctrlKey) pressedKeys.push('ctrl');
    if (event.metaKey) pressedKeys.push('meta');
    if (event.shiftKey) pressedKeys.push('shift');
    if (event.altKey) pressedKeys.push('alt');
    pressedKeys.push(event.key.toLowerCase());

    return combo.every(key => pressedKeys.includes(key.toLowerCase()));
  },

  // Prevent default for specific keys
  preventDefaultFor: (keys: string[]) => (event: KeyboardEvent) => {
    if (keys.includes(event.key)) {
      event.preventDefault();
    }
  },

  // Handle escape key
  onEscape: (callback: () => void) => (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      callback();
    }
  },
};

// Touch and gesture utilities for mobile accessibility
export const touch = {
  // Check if device supports touch
  isTouchDevice: (): boolean => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  },

  // Get touch-friendly minimum size
  getTouchTargetSize: (baseSize: number): number => {
    return touch.isTouchDevice() ? Math.max(baseSize, 44) : baseSize;
  },

  // Add touch-friendly spacing
  getTouchSpacing: (baseSpacing: number): number => {
    return touch.isTouchDevice() ? Math.max(baseSpacing, 8) : baseSpacing;
  },
};

// Form accessibility utilities
export const formAccessibility = {
  // Generate form field IDs and associations
  generateFieldIds: (fieldName: string) => {
    const baseId = `field-${fieldName}-${Math.random().toString(36).substr(2, 9)}`;
    return {
      fieldId: baseId,
      labelId: `${baseId}-label`,
      errorId: `${baseId}-error`,
      hintId: `${baseId}-hint`,
    };
  },

  // Validate form accessibility
  validateFormAccessibility: (form: HTMLFormElement): string[] => {
    const issues: string[] = [];
    const inputs = form.querySelectorAll('input, select, textarea');

    inputs.forEach((input, index) => {
      const element = input as HTMLInputElement;

      // Check for labels
      const hasLabel = element.labels && element.labels.length > 0;
      const hasAriaLabel = element.hasAttribute('aria-label');
      const hasAriaLabelledBy = element.hasAttribute('aria-labelledby');

      if (!hasLabel && !hasAriaLabel && !hasAriaLabelledBy) {
        issues.push(`Input ${index + 1} is missing a label`);
      }

      // Check for required field indication
      if (element.required && !element.hasAttribute('aria-required')) {
        issues.push(`Required input ${index + 1} is missing aria-required attribute`);
      }

      // Check for error association
      if (element.hasAttribute('aria-invalid') && element.getAttribute('aria-invalid') === 'true') {
        if (!element.hasAttribute('aria-describedby')) {
          issues.push(`Invalid input ${index + 1} is missing error description`);
        }
      }
    });

    return issues;
  },
};

// Color and theme utilities
export const colorAccessibility = {
  // Get appropriate text color for background
  getTextColorForBackground: (backgroundColor: string): 'light' | 'dark' => {
    const contrast = calculateContrast('#ffffff', backgroundColor);
    return contrast >= 4.5 ? 'light' : 'dark';
  },

  // Generate accessible color palette
  generateAccessiblePalette: (baseColor: string) => {
    // This would typically use a color manipulation library
    // For now, return predefined accessible colors
    return {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: baseColor,
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    };
  },
};

// Export all utilities
export default {
  calculateContrast,
  meetsContrastRequirement,
  generateAriaAttributes,
  focusManagement,
  screenReader,
  keyboard,
  touch,
  formAccessibility,
  colorAccessibility,
};
