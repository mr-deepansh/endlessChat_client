import { useState } from 'react';
import { toast } from './use-toast';

interface UseApiOptions {
  showSuccessToast?: boolean;
  showErrorToast?: boolean;
  successMessage?: string;
  errorMessage?: string;
}

export function useApi<T = any>(options: UseApiOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const {
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = 'Operation completed successfully',
    errorMessage = 'An error occurred',
  } = options;

  const execute = async (apiCall: () => Promise<T>) => {
    try {
      setLoading(true);
      setError(null);

      const result = await apiCall();
      setData(result);

      if (showSuccessToast) {
        toast({
          title: 'Success',
          description: successMessage,
        });
      }

      return result;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || errorMessage;
      setError(errorMsg);

      if (showErrorToast) {
        toast({
          title: 'Error',
          description: errorMsg,
          variant: 'destructive',
        });
      }

      throw err;
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setData(null);
  };

  return {
    loading,
    error,
    data,
    execute,
    reset,
  };
}
