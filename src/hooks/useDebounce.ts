import { useState, useEffect } from 'react';
import { UI_CONFIG } from '@/utils/constants';

export function useDebounce<T>(value: T, delay: number = UI_CONFIG.DEBOUNCE_DELAY): T {
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
}
