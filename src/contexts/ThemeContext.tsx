import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

const getStoredTheme = (): Theme => {
  try {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('endlesschat-theme') as Theme) || 'light';
    }
  } catch {
    // localStorage access denied - fallback to light theme
  }
  return 'light';
};

const setStoredTheme = (theme: Theme): void => {
  try {
    localStorage.setItem('endlesschat-theme', theme);
  } catch {
    // localStorage access denied - ignore
  }
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  useEffect(() => {
    const root = window.document.documentElement;

    // Remove existing theme classes
    root.classList.remove('light', 'dark');

    // Add new theme class
    root.classList.add(theme);

    // Save to localStorage with error handling
    setStoredTheme(theme);

    // Also set data attribute for additional CSS targeting
    root.setAttribute('data-theme', theme);
  }, [theme]);

  // Initialize theme on mount
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.add(theme);
    root.setAttribute('data-theme', theme);
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const value = {
    theme,
    toggleTheme,
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};
