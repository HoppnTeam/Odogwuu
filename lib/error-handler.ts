import { Alert, ToastAndroid, Platform } from 'react-native';
import { SecurityService } from './security-service';

// Error types for better categorization
export enum ErrorType {
  NETWORK = 'NETWORK',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  VALIDATION = 'VALIDATION',
  DATABASE = 'DATABASE',
  LOCATION = 'LOCATION',
  PAYMENT = 'PAYMENT',
  NOTIFICATION = 'NOTIFICATION',
  UNKNOWN = 'UNKNOWN'
}

// Error severity levels
export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

// Error context for better debugging
export interface ErrorContext {
  userId?: string;
  screen?: string;
  action?: string;
  data?: any;
  timestamp: string;
}

// Error information structure
export interface AppError {
  type: ErrorType;
  severity: ErrorSeverity;
  message: string;
  userMessage: string;
  code?: string;
  context?: ErrorContext;
  originalError?: any;
  retryable: boolean;
}

type NetworkMessages = {
  default: string;
  timeout: string;
  offline: string;
  server: string;
};
type AuthMessages = {
  default: string;
  expired: string;
  invalid: string;
  locked: string;
};
type AuthorizationMessages = {
  default: string;
  profile: string;
  order: string;
  review: string;
};
type ValidationMessages = {
  default: string;
  email: string;
  password: string;
  required: string;
  phone: string;
};
type DatabaseMessages = {
  default: string;
  notFound: string;
  duplicate: string;
  constraint: string;
};
type LocationMessages = {
  default: string;
  permission: string;
  timeout: string;
  unavailable: string;
};
type PaymentMessages = {
  default: string;
  declined: string;
  insufficient: string;
  expired: string;
};
type NotificationMessages = {
  default: string;
  permission: string;
  token: string;
  send: string;
};
type UnknownMessages = {
  default: string;
};

type UserMessagesType = {
  [ErrorType.NETWORK]: NetworkMessages;
  [ErrorType.AUTHENTICATION]: AuthMessages;
  [ErrorType.AUTHORIZATION]: AuthorizationMessages;
  [ErrorType.VALIDATION]: ValidationMessages;
  [ErrorType.DATABASE]: DatabaseMessages;
  [ErrorType.LOCATION]: LocationMessages;
  [ErrorType.PAYMENT]: PaymentMessages;
  [ErrorType.NOTIFICATION]: NotificationMessages;
  [ErrorType.UNKNOWN]: UnknownMessages;
};

const USER_MESSAGES: UserMessagesType = {
  NETWORK: {
    default: 'Connection issue. Please check your internet and try again.',
    timeout: 'Request timed out. Please try again.',
    offline: 'You appear to be offline. Please check your connection.',
    server: 'Server is temporarily unavailable. Please try again later.'
  },
  AUTHENTICATION: {
    default: 'Authentication failed. Please sign in again.',
    expired: 'Your session has expired. Please sign in again.',
    invalid: 'Invalid credentials. Please check your email and password.',
    locked: 'Account temporarily locked. Please try again later.'
  },
  AUTHORIZATION: {
    default: 'You don\'t have permission to perform this action.',
    profile: 'You can only access your own profile.',
    order: 'You can only view your own orders.',
    review: 'You can only review orders you\'ve completed.'
  },
  VALIDATION: {
    default: 'Please check your input and try again.',
    email: 'Please enter a valid email address.',
    password: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character.',
    required: 'This field is required.',
    phone: 'Please enter a valid phone number.'
  },
  DATABASE: {
    default: 'Data operation failed. Please try again.',
    notFound: 'The requested information was not found.',
    duplicate: 'This information already exists.',
    constraint: 'Operation failed due to data constraints.'
  },
  LOCATION: {
    default: 'Location service is unavailable.',
    permission: 'Location permission is required for this feature.',
    timeout: 'Location request timed out. Please try again.',
    unavailable: 'Location service is not available on this device.'
  },
  PAYMENT: {
    default: 'Payment processing failed. Please try again.',
    declined: 'Payment was declined. Please check your payment method.',
    insufficient: 'Insufficient funds. Please use a different payment method.',
    expired: 'Payment method has expired. Please update your payment information.'
  },
  NOTIFICATION: {
    default: 'Notification service is unavailable.',
    permission: 'Notification permission is required for order updates.',
    token: 'Failed to register for notifications.',
    send: 'Failed to send notification.'
  },
  UNKNOWN: {
    default: 'Something went wrong. Please try again.'
  }
};

class ErrorHandler {
  private static instance: ErrorHandler;
  private errorLog: AppError[] = [];
  private maxLogSize = 100;

  private constructor() {}

  static getInstance(): ErrorHandler {
    if (!ErrorHandler.instance) {
      ErrorHandler.instance = new ErrorHandler();
    }
    return ErrorHandler.instance;
  }

  /**
   * Create a standardized error object
   */
  createError(
    type: ErrorType,
    message: string,
    originalError?: any,
    context?: Partial<ErrorContext>,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM
  ): AppError {
    const error: AppError = {
      type,
      severity,
      message,
      userMessage: this.getUserMessage(type, message),
      originalError,
      context: {
        timestamp: new Date().toISOString(),
        ...context
      },
      retryable: this.isRetryable(type, originalError)
    };

    // Add error code if available
    if (originalError?.code) {
      error.code = originalError.code;
    }

    return error;
  }

  /**
   * Get user-friendly error message
   */
  private getUserMessage(type: ErrorType, message: string): string {
    const messages = USER_MESSAGES[type];
    switch (type) {
      case ErrorType.NETWORK: {
        const m = messages as NetworkMessages;
        if (message.includes('timeout')) return m.timeout;
        if (message.includes('offline') || message.includes('network')) return m.offline;
        if (message.includes('server') || message.includes('500')) return m.server;
        return m.default;
      }
      case ErrorType.AUTHENTICATION: {
        const m = messages as AuthMessages;
        if (message.includes('expired')) return m.expired;
        if (message.includes('invalid')) return m.invalid;
        if (message.includes('locked')) return m.locked;
        return m.default;
      }
      case ErrorType.AUTHORIZATION: {
        const m = messages as AuthorizationMessages;
        if (message.includes('profile')) return m.profile;
        if (message.includes('order')) return m.order;
        if (message.includes('review')) return m.review;
        return m.default;
      }
      case ErrorType.VALIDATION: {
        const m = messages as ValidationMessages;
        if (message.includes('email')) return m.email;
        if (message.includes('password')) return m.password;
        if (message.includes('required')) return m.required;
        if (message.includes('phone')) return m.phone;
        return m.default;
      }
      case ErrorType.DATABASE: {
        const m = messages as DatabaseMessages;
        if (message.includes('not found')) return m.notFound;
        if (message.includes('duplicate')) return m.duplicate;
        if (message.includes('constraint')) return m.constraint;
        return m.default;
      }
      case ErrorType.LOCATION: {
        const m = messages as LocationMessages;
        if (message.includes('permission')) return m.permission;
        if (message.includes('timeout')) return m.timeout;
        if (message.includes('unavailable')) return m.unavailable;
        return m.default;
      }
      case ErrorType.PAYMENT: {
        const m = messages as PaymentMessages;
        if (message.includes('declined')) return m.declined;
        if (message.includes('insufficient')) return m.insufficient;
        if (message.includes('expired')) return m.expired;
        return m.default;
      }
      case ErrorType.NOTIFICATION: {
        const m = messages as NotificationMessages;
        if (message.includes('permission')) return m.permission;
        if (message.includes('token')) return m.token;
        if (message.includes('send')) return m.send;
        return m.default;
      }
      case ErrorType.UNKNOWN:
      default: {
        const m = messages as UnknownMessages;
        return m.default;
      }
    }
  }

  /**
   * Determine if an error is retryable
   */
  private isRetryable(type: ErrorType, originalError?: any): boolean {
    switch (type) {
      case ErrorType.NETWORK:
        return true;
      case ErrorType.DATABASE:
        // Retry database errors except for constraint violations
        return !originalError?.message?.includes('constraint');
      case ErrorType.LOCATION:
        return originalError?.message?.includes('timeout');
      case ErrorType.NOTIFICATION:
        return true;
      default:
        return false;
    }
  }

  /**
   * Handle and display error to user
   */
  handleError(
    error: AppError,
    showAlert: boolean = true,
    showToast: boolean = false
  ): void {
    // Log the error
    this.logError(error);
    
    // Log security event for critical errors
    if (error.severity === ErrorSeverity.CRITICAL || error.severity === ErrorSeverity.HIGH) {
      SecurityService.logSecurityEvent('ERROR_OCCURRED', {
        type: error.type,
        severity: error.severity,
        message: error.message,
        context: error.context
      });
    }

    // Show user notification
    if (showAlert) {
      this.showErrorAlert(error);
    } else if (showToast) {
      this.showErrorToast(error);
    }
  }

  /**
   * Show error as alert
   */
  private showErrorAlert(error: AppError): void {
    Alert.alert(
      'Error',
      error.userMessage,
      [
        {
          text: 'OK',
          style: 'default'
        },
        ...(error.retryable ? [{
          text: 'Retry',
          style: 'default' as const,
          onPress: () => this.retryLastOperation()
        }] : [])
      ]
    );
  }

  /**
   * Show error as toast (Android) or alert (iOS)
   */
  private showErrorToast(error: AppError): void {
    if (Platform.OS === 'android') {
      ToastAndroid.show(error.userMessage, ToastAndroid.SHORT);
    } else {
      // iOS doesn't have native toast, use alert for short messages
      Alert.alert('', error.userMessage, [{ text: 'OK' }]);
    }
  }

  /**
   * Log error for debugging
   */
  private logError(error: AppError): void {
    this.errorLog.push(error);
    
    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize);
    }

    // Console log for development
    if (__DEV__) {
      console.error('App Error:', {
        type: error.type,
        severity: error.severity,
        message: error.message,
        userMessage: error.userMessage,
        context: error.context,
        originalError: error.originalError
      });
    }
  }

  /**
   * Get error log for debugging
   */
  getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  /**
   * Clear error log
   */
  clearErrorLog(): void {
    this.errorLog = [];
  }

  /**
   * Retry last operation (placeholder for retry mechanism)
   */
  private retryLastOperation(): void {
    // This would be implemented with a retry queue
    console.log('Retry mechanism not implemented yet');
  }

  /**
   * Handle Supabase errors specifically
   */
  handleSupabaseError(error: any, context?: Partial<ErrorContext>): AppError {
    let type = ErrorType.UNKNOWN;
    let severity = ErrorSeverity.MEDIUM;

    if (error?.code) {
      switch (error.code) {
        case 'PGRST116': // Not found
          type = ErrorType.DATABASE;
          break;
        case '23505': // Unique constraint violation
          type = ErrorType.DATABASE;
          break;
        case '23503': // Foreign key constraint violation
          type = ErrorType.DATABASE;
          break;
        case 'PGRST301': // JWT expired
          type = ErrorType.AUTHENTICATION;
          severity = ErrorSeverity.HIGH;
          break;
        case 'PGRST302': // JWT invalid
          type = ErrorType.AUTHENTICATION;
          severity = ErrorSeverity.HIGH;
          break;
        default:
          if (error.code.startsWith('PGRST')) {
            type = ErrorType.DATABASE;
          }
      }
    }

    if (error?.message?.includes('network') || error?.message?.includes('fetch')) {
      type = ErrorType.NETWORK;
    }

    return this.createError(type, error?.message || 'Unknown error', error, context, severity);
  }

  /**
   * Handle network errors specifically
   */
  handleNetworkError(error: any, context?: Partial<ErrorContext>): AppError {
    let message = 'Network error occurred';
    
    if (error?.message) {
      message = error.message;
    } else if (error?.name === 'TypeError' && error?.message?.includes('fetch')) {
      message = 'Unable to connect to server';
    }

    return this.createError(ErrorType.NETWORK, message, error, context, ErrorSeverity.MEDIUM);
  }

  /**
   * Handle validation errors specifically
   */
  handleValidationError(field: string, message: string, context?: Partial<ErrorContext>): AppError {
    return this.createError(
      ErrorType.VALIDATION,
      `${field}: ${message}`,
      null,
      context,
      ErrorSeverity.LOW
    );
  }
}

// Export singleton instance
export const errorHandler = ErrorHandler.getInstance(); 