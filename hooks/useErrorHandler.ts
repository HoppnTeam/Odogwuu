import { useState, useCallback, useRef } from 'react';
import { errorHandler, ErrorType, ErrorSeverity, AppError, ErrorContext } from '@/lib/error-handler';

interface UseErrorHandlerOptions {
  showAlert?: boolean;
  showToast?: boolean;
  autoRetry?: boolean;
  maxRetries?: number;
  retryDelay?: number;
}

interface UseErrorHandlerReturn {
  error: AppError | null;
  isLoading: boolean;
  retryCount: number;
  handleError: (error: any, context?: Partial<ErrorContext>) => void;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
  executeWithErrorHandling: <T>(
    operation: () => Promise<T>,
    context?: Partial<ErrorContext>
  ) => Promise<T | null>;
  retryLastOperation: () => void;
}

export function useErrorHandler(options: UseErrorHandlerOptions = {}): UseErrorHandlerReturn {
  const {
    showAlert = true,
    showToast = false,
    autoRetry = false,
    maxRetries = 3,
    retryDelay = 1000
  } = options;

  const [error, setError] = useState<AppError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const lastOperation = useRef<(() => Promise<any>) | null>(null);
  const lastContext = useRef<Partial<ErrorContext> | undefined>(undefined);

  const clearError = useCallback(() => {
    setError(null);
    setRetryCount(0);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const handleError = useCallback((error: any, context?: Partial<ErrorContext>) => {
    let appError: AppError;

    // Handle different error types
    if (error?.code && error.code.startsWith('PGRST')) {
      appError = errorHandler.handleSupabaseError(error, context);
    } else if (error?.message?.includes('network') || error?.name === 'TypeError') {
      appError = errorHandler.handleNetworkError(error, context);
    } else {
      appError = errorHandler.createError(
        ErrorType.UNKNOWN,
        error?.message || 'An unexpected error occurred',
        error,
        context
      );
    }

    setError(appError);
    errorHandler.handleError(appError, showAlert, showToast);

    // Auto-retry for retryable errors
    if (autoRetry && appError.retryable && retryCount < maxRetries) {
      setTimeout(() => {
        setRetryCount(prev => prev + 1);
        if (lastOperation.current) {
          lastOperation.current();
        }
      }, retryDelay);
    }
  }, [showAlert, showToast, autoRetry, maxRetries, retryCount, retryDelay]);

  const executeWithErrorHandling = useCallback(async <T>(
    operation: () => Promise<T>,
    context?: Partial<ErrorContext>
  ): Promise<T | null> => {
    try {
      setIsLoading(true);
      clearError();
      
      // Store operation for potential retry
      lastOperation.current = operation;
      lastContext.current = context;

      const result = await operation();
      return result;
    } catch (error) {
      handleError(error, context);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [handleError, clearError]);

  const retryLastOperation = useCallback(async () => {
    if (lastOperation.current) {
      clearError();
      setRetryCount(prev => prev + 1);
      await executeWithErrorHandling(lastOperation.current, lastContext.current);
    }
  }, [executeWithErrorHandling, clearError]);

  return {
    error,
    isLoading,
    retryCount,
    handleError,
    clearError,
    setLoading,
    executeWithErrorHandling,
    retryLastOperation
  };
}

// Specialized hooks for common use cases
export function useAuthErrorHandler() {
  return useErrorHandler({
    showAlert: true,
    showToast: false,
    autoRetry: false
  });
}

export function useDataErrorHandler() {
  return useErrorHandler({
    showAlert: false,
    showToast: true,
    autoRetry: true,
    maxRetries: 2,
    retryDelay: 2000
  });
}

export function useNetworkErrorHandler() {
  return useErrorHandler({
    showAlert: true,
    showToast: false,
    autoRetry: true,
    maxRetries: 3,
    retryDelay: 1000
  });
}

export function useValidationErrorHandler() {
  return useErrorHandler({
    showAlert: false,
    showToast: true,
    autoRetry: false
  });
} 