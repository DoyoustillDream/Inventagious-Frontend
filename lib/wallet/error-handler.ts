/**
 * Error handling utilities for wallet onboarding
 */

export enum OnboardingErrorType {
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  SIGNATURE_REJECTED = 'SIGNATURE_REJECTED',
  NETWORK_ERROR = 'NETWORK_ERROR',
  BACKEND_ERROR = 'BACKEND_ERROR',
  TIMEOUT = 'TIMEOUT',
  USER_CANCELLED = 'USER_CANCELLED',
  WALLET_NOT_FOUND = 'WALLET_NOT_FOUND',
  UNKNOWN = 'UNKNOWN',
}

export interface OnboardingError {
  type: OnboardingErrorType;
  message: string;
  originalError?: any;
  recoverable: boolean;
  retryable: boolean;
  step: string;
}

export function categorizeError(error: any, step: string): OnboardingError {
  const errorMessage = error?.message || error?.toString() || 'Unknown error';
  const lowerMessage = errorMessage.toLowerCase();

  // User cancellation
  if (
    lowerMessage.includes('user rejected') ||
    lowerMessage.includes('user cancelled') ||
    lowerMessage.includes('rejected') ||
    lowerMessage.includes('cancelled') ||
    error?.code === 4001
  ) {
    return {
      type: OnboardingErrorType.USER_CANCELLED,
      message: 'Sign in was cancelled. Please try again when ready.',
      originalError: error,
      recoverable: true,
      retryable: true,
      step,
    };
  }

  // Network errors
  if (
    lowerMessage.includes('network') ||
    lowerMessage.includes('fetch') ||
    lowerMessage.includes('connection') ||
    error?.status === 0 ||
    error?.name === 'NetworkError'
  ) {
    return {
      type: OnboardingErrorType.NETWORK_ERROR,
      message: 'Network error. Please check your connection and try again.',
      originalError: error,
      recoverable: true,
      retryable: true,
      step,
    };
  }

  // Timeout errors
  if (
    lowerMessage.includes('timeout') ||
    lowerMessage.includes('timed out') ||
    error?.name === 'AbortError'
  ) {
    return {
      type: OnboardingErrorType.TIMEOUT,
      message: 'Request timed out. Please try again.',
      originalError: error,
      recoverable: true,
      retryable: true,
      step,
    };
  }

  // Wallet not found
  if (
    lowerMessage.includes('wallet') && lowerMessage.includes('not found') ||
    lowerMessage.includes('no wallet') ||
    lowerMessage.includes('extension')
  ) {
    return {
      type: OnboardingErrorType.WALLET_NOT_FOUND,
      message: 'Wallet not found. Please install a Solana wallet extension.',
      originalError: error,
      recoverable: true,
      retryable: false,
      step,
    };
  }

  // Connection failed
  if (
    lowerMessage.includes('connect') ||
    lowerMessage.includes('connection failed') ||
    error?.code === -32002
  ) {
    return {
      type: OnboardingErrorType.CONNECTION_FAILED,
      message: 'Failed to connect wallet. Please try again.',
      originalError: error,
      recoverable: true,
      retryable: true,
      step,
    };
  }

  // Signature rejected
  if (
    lowerMessage.includes('signature') ||
    lowerMessage.includes('sign') ||
    error?.code === 4001
  ) {
    return {
      type: OnboardingErrorType.SIGNATURE_REJECTED,
      message: 'Signature was rejected. Please try again.',
      originalError: error,
      recoverable: true,
      retryable: true,
      step,
    };
  }

  // Backend errors
  if (error?.status && error.status >= 400 && error.status < 500) {
    const userMessage = error?.message || 'Invalid request. Please try again.';
    return {
      type: OnboardingErrorType.BACKEND_ERROR,
      message: userMessage,
      originalError: error,
      recoverable: true,
      retryable: true,
      step,
    };
  }

  if (error?.status && error.status >= 500) {
    return {
      type: OnboardingErrorType.BACKEND_ERROR,
      message: 'Server error. Please try again later.',
      originalError: error,
      recoverable: true,
      retryable: true,
      step,
    };
  }

  // Unknown error
  return {
    type: OnboardingErrorType.UNKNOWN,
    message: errorMessage || 'An unexpected error occurred. Please try again.',
    originalError: error,
    recoverable: true,
    retryable: true,
    step,
  };
}

export function getErrorRecoveryAction(error: OnboardingError): {
  label: string;
  action: () => void;
} | null {
  if (!error.recoverable) {
    return null;
  }

  if (error.type === OnboardingErrorType.WALLET_NOT_FOUND) {
    return {
      label: 'Install Wallet',
      action: () => {
        window.open('https://phantom.app/', '_blank');
      },
    };
  }

  if (error.retryable) {
    return {
      label: 'Try Again',
      action: () => {
        // Action will be provided by the component
      },
    };
  }

  return null;
}

export function logError(error: OnboardingError, context?: Record<string, any>) {
  console.error('[Wallet Onboarding Error]', {
    type: error.type,
    message: error.message,
    step: error.step,
    originalError: error.originalError,
    context,
  });
}

